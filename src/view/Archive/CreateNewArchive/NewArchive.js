import { SvelteApplication } from "#runtime/svelte/application";

import NewArchiveShell from "./NewArchive.svelte";

/**
 * Opens the Chat Archive Application or focuses it if it is already open.
 */
export function openNewArchiveApp() {
   CONFIG.VauxsChatEnhancements.newArchiveApp ??= false;
   if (CONFIG.VauxsChatEnhancements.newArchiveApp) {
      CONFIG.VauxsChatEnhancements.newArchiveApp.render(true, { focus: true });
   } else {
      CONFIG.VauxsChatEnhancements.newArchiveApp = new NewArchiveApplication().render(true, { focus: true });
   }
}

export default class NewArchiveApplication extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
    */
   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: "vce-create-chat-archive",
         classes: ["vce vce-chat-archive"],
         title: "vauxs-chat-enhancements.archive.create",
         width: 300,
         height: 300,

         svelte: {
            class: NewArchiveShell,
            target: document.body,
         },
      });
   }
}

export class ArchiveShim extends FormApplication {
   constructor(options = {}) {
      super({}, options);

      openNewArchiveApp();
   }

   render() {
      this.close();
   }
}

