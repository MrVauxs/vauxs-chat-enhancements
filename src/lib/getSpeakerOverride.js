import { writable, get } from "svelte/store";
import { getSetting } from "./settings";
export const overridingSpeaker = writable(false);

CONFIG.VauxsChatEnhancements ??= {};

Hooks.on("init", () => {
   if (typeof libWrapper === "function") {
      CONFIG.VauxsChatEnhancements.getSpeakerOverride = true;

      libWrapper.register(
         "vauxs-chat-enhancements",
         "ChatMessage.getSpeaker",
         (wrapped, ...args) => {
            // #region Parameters
            /**
             * @type {object} result
             *
             * @type {string} result.alias - The name of the speaker
             *
             * @type {string} result.scene - The id of the scene
             *
             * @type {string} result.token - The id of the token
             *
             * @type {string} result.actor - The id of the actor
             */
            let result = wrapped(...args);

            if (CONFIG.debug.vce) {
               console.log(`%cVauxs Chat Enhancements`, "color:#53b0cf", result);
            }

            /**
             * @param {object} overrider - The object to override the speaker with.
             *
             * @returns {void} - Overrides the speaker with the value of overridingSpeaker store.
             */
            function override(overrider) {
               if (CONFIG.debug.vce) {
                  console.log(
                     `%cVauxs Chat Enhancements%c | Overriding Speaker to %c${overrider.alias}`,
                     "color:#53b0cf",
                     "",
                     "color:yellow"
                  );
               }
               result = { ...result, ...overrider };
            }
            // #endregion

            // #region Logic
            switch (getSetting("speakerMode", false)) {
               case 1: {
                  // Never Speak as PC
                  if (ChatMessage.getSpeakerActor(result)?.hasPlayerOwner) {
                     override(ChatMessage._getSpeakerFromUser({ ...args, user: game.user }));
                  }
                  break;
               }
               case 2: {
                  // Always Out-of-Character
                  override(ChatMessage._getSpeakerFromUser({ ...args, user: game.user }));
                  break;
               }
               default:
                  break;
            }

            if (get(overridingSpeaker) && JSON.stringify(get(overridingSpeaker)) !== JSON.stringify(result)) {
               override(get(overridingSpeaker));
            }
            // #endregion

            return result;
         },
         libWrapper.WRAPPER
      );
   } else {
      CONFIG.VauxsChatEnhancements.getSpeakerOverride = false;
   }
});

