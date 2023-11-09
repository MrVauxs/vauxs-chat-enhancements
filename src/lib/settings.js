import { TJSGameSettings } from "#runtime/svelte/store/fvtt/settings";
import { mId } from "./utils.js";

export const settings = new TJSGameSettings(mId);
export const getSetting = (setting) => settings.getStore(setting);

const array = [
   {
      folder: mId,
      namespace: mId,
      key: "pinnedButtons",
      options: {
         name: "pinnedButtons",
         scope: "client",
         config: false,
         type: Array,
         default: ["settings"],
      },
   },
];

Hooks.on("init", () => {
   settings.registerAll(array);
});

