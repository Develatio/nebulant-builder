import React from "react";
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { BaseAutocompleter } from "./BaseAutocompleter";

export class StaticAutocompleter extends BaseAutocompleter {
  extractContent(reactElement) {
    const html = document.createElement('div');
    const root = createRoot(html);
    flushSync(() => {
      root.render(reactElement);
    });
    const dp = new DOMParser();
    return dp.parseFromString(html.innerHTML, "text/html").documentElement.textContent;
  }

  filter(options, { searchPattern }) {
    if(!searchPattern) return options;

    // Tweak the search patter in order to better match the candidate(s)
    searchPattern = searchPattern.toLowerCase();
    searchPattern = searchPattern.replace(/[*?]/g, " ");
    searchPattern = searchPattern.replace(/[^a-z0-9\-.\s]/g, "");
    const terms = searchPattern.split(" ");

    return options.filter(option => {
      let { value, label } = option;

      if(React.isValidElement(label)) {
        label = this.extractContent(label);
      }

      // value can be either an object with a "value" key or a primitive value
      value = typeof value === "object" ? value.value : `${value}`;

      const matchValue = terms.every(term => value.toLowerCase().includes(term));
      if(matchValue) return true;

      const matchLabel = terms.every(term => label.toLowerCase().includes(term));
      if(matchLabel) return true;

      return false;
    });
  }

  paginate(options, { page, perPage }) {
    const start = (page - 1) * perPage;
    return options.slice(start, start + perPage);
  }

  async run() {
    await this.prerun();

    const { searchPattern, page, perPage, _group, _pagingDetails } = this.filters;

    // Filter the data
    if(searchPattern) {
      this.data = this.filter(this.data, { searchPattern });
    }

    const dataLength = this.data.length;

    // Paginate the remaining data
    if(page && perPage) {
      this.data = this.paginate(this.data, { page, perPage });
    }

    // Return the data (as a promise)
    return new Promise((resolve) => {
      resolve({
        // This might be undefined if the class that inherits from
        // StaticAutocompleter didn't set rawdata to anything. You're
        // responsible for handling undefined as possible value.
        rawdata: this.rawdata,

        data: this.data,
        prev: page > 1,
        next: page < Math.ceil(dataLength / perPage),
        total: Math.ceil(dataLength / perPage),
      });
    });
  }
}
