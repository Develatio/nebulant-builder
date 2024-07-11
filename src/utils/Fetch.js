// I could try to use Axios (or similar), but then I'd have to hack it somehow
// to be able to implement the pendingRequestsObj funcionality. Given the fact
// that a fetch-wrapper (with the couple of extra features that I need for this)
// is straightforward, I'll just code it myself. Bonus points: I'm avoiding an
// extra 30Kb in the bundle size (the size of Axios last time I checked).

// This is where we'll store instances of AbortController, used to abort
// requests that should be superseded by other requests.
const requestsControllers = new Map();

export class Fetch {
  fetch(url, data = {}, opts = {}) {

    let { __request_id, timeout } = opts;
    let timeoutId;

    if(!__request_id) {
      __request_id = `${new Date().getTime()}-${Math.random()}`;
    }

    const abortController = new AbortController();

    // Check if there is currently a request with the same request ID.
    if(requestsControllers.has(__request_id)) {
      const pendingRequestsObj = requestsControllers.get(__request_id);
      const abortControllers = [...pendingRequestsObj.abortControllers, abortController];
      requestsControllers.set(__request_id, {
        abortControllers: abortControllers,
      });
      // Calling .abort() on a completed request is a safe no-op
      abortControllers[0].abort("Abort");
    } else {
      requestsControllers.set(__request_id, {
        abortControllers: [abortController],
      });
    }

    if(timeout) {
      timeoutId = setTimeout(() => abortController.abort("Timeout"), timeout);
    }
    opts.signal = abortController.signal;

    delete opts.__request_id;
    delete opts.timeout;

    return new Promise((resolve, reject) => {
      const { signal } = opts;

      fetch(url, {
        ...Object.keys(data).length > 0 && ({ body: JSON.stringify(data) }),
        ...signal && ({ signal }),
        ...opts,
      }).then(response => {
        if(response.ok) {
          response.text().then(data => {
            // We got the text of the response
            try {
              // Try to parse as JSON and return JS object
              data = JSON.parse(data);
              resolve({
                data,
                status: response.status,
              });
            } catch (_error) {
              resolve({
                data,
                status: response.status,
              });
            }
          }).catch(_error => {
            // Failed retrieving the text of the response
            resolve({
              data: null,
              status: response.status,
            });
          });
        } else {
          // Fetch failed with something that was not 2xx
          response.text().then(data => {
            try {
              data = JSON.parse(data);
              reject({
                data,
                response: true,
                status: response.status,
              });
            } catch (_error) {
              reject({
                data: null,
                response: true,
                status: response.status,
              });
            }
          }).catch(_error => {
            reject({
              data: null,
              response: true,
              status: response.status,
            });
          });
        }
      }).catch(error => {
        // Fetch failed with network request error (DNS resolve error, no connectivity, etc...)
        reject({
          error, // This is an object { message: "", stack: "\n\n\n" }
          response: false,
        });
      }).finally(() => {
        clearTimeout(timeoutId);
        const pendingRequestsObj = requestsControllers.get(__request_id);
        pendingRequestsObj.abortControllers.splice(0, 1);
        if(pendingRequestsObj.abortControllers.length === 0) {
          requestsControllers.delete(__request_id);
        } else {
          requestsControllers.set(__request_id, pendingRequestsObj);
        }
      });
    });
  }

  get(url, opts) {
    return this.fetch(url, {}, {
      method: "GET",
      ...opts,
    });
  }

  post(url, data, opts) {
    return this.fetch(url, data, {
      method: "POST",
      ...opts,
    });
  }

  patch(url, data, opts) {
    return this.fetch(url, data, {
      method: "PATCH",
      ...opts,
    });
  }
}
