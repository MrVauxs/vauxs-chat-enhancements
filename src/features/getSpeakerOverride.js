import { writable, get } from "svelte/store";

export const overridingSpeaker = writable(false);

Hooks.on("init", () => {
   if (typeof libWrapper === "function") {
      CONFIG.VauxsChatEnhancements.getSpeakerOverride = true;

      libWrapper.register(
         "vauxs-chat-enhancements",
         "ChatMessage.getSpeaker",
         (wrapped, ...args) => {
            let result = wrapped(...args);

            if (get(overridingSpeaker)) {
               console.log(
                  `%cVauxs Chat Enhancements%c | Overriding Speaker to %c${get(overridingSpeaker).alias}`,
                  "color:#53b0cf",
                  "",
                  "color:yellow"
               );
               result = { ...result, ...get(overridingSpeaker) };
            }

            return result;
         },
         libWrapper.WRAPPER
      );
   } else {
      CONFIG.VauxsChatEnhancements.getSpeakerOverride = false;
   }
});

