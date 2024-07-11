import { Logger } from "@src/core/Logger";
import { EventBus } from "@src/core/EventBus";
import { CrashReport } from "@src/ui/structure/Messages/CrashReport";

export class CrashHandler {
  constructor({ error } = {}) {
    this.logger = new Logger();
    this.eventBus = new EventBus();

    this.error = error;
  }

  handle() {
    let data = this.logger.msgs.map(msg => `[${msg.time}] ${msg.text}`).join("\n");
    // The world would be a fucking excellent place... if we had nice things...
    // ... but we don't... sigh...
    // Github doesn't accept POST-ing to /issues/new
    // Browsers will limit the max amount of characters in the query params
    // ¯\_(ツ)_/¯
    // Get the last N characters and hope that it will be enough to help me
    // debug whatever error happened.
    data = data.slice(-9500);

    this.eventBus.publish("OpenDialog", {
      title: "Oh no...",
      body: <CrashReport error={this.error} data={data} />,
      nolabel: "Ignore",
      no: () => {
        // no-op
      },
      yeslabel: "Create an issue in GitHub",
      yes: () => {
        const title = encodeURIComponent("Crash report");
        data = "Provide any further details that might help us, like a ";
        data += "detailed description of the situacion which caused the crash ";
        data += "or step to reproduce it.\n";
        data += "#### CRASH REPORT ###\n";
        data += `\`\`\`\n${data}\n\`\`\``;
        data = encodeURIComponent(data);
        window.open(`${process.env.CRASH_REPORT_URL}?title=${title}&body=${data}`, "_blank");
      },
    });
  }
}
