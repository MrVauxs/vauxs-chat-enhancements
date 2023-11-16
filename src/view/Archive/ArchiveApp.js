import { SvelteApplication } from "#runtime/svelte/application";

import ArchiveAppShell from "./ArchiveAppShell.svelte";

/**
 * Opens the Chat Archive Application or focuses it if it is already open.
 */
export function openArchiveApp() {
   CONFIG.VauxsChatEnhancements.archiveApp ??= false;
   if (CONFIG.VauxsChatEnhancements.archiveApp) {
      CONFIG.VauxsChatEnhancements.archiveApp.render(true, { focus: true });
   } else {
      CONFIG.VauxsChatEnhancements.archiveApp = new ArchiveApplication().render(true, { focus: true });
   }
}

export default class ArchiveApplication extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
    */
   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: "vce-chat-archive",
         classes: ["vce vce-chat-archive"],
         title: "vauxs-chat-enhancements.archive.title",
         width: 600,
         height: 600,

         svelte: {
            class: ArchiveAppShell,
            intro: true,
            target: document.body,
         },
      });
   }
}

export class ArchiveShim extends FormApplication {
   constructor(options = {}) {
      super({}, options);

      openArchiveApp();
   }

   render() {
      this.close();
   }
}

