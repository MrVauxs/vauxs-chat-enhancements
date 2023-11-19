import { TJSGameSettings } from "#runtime/svelte/store/fvtt/settings";
import { get } from "svelte/store";
import { ArchiveShim } from "../view/Archive/ArchiveApp.js";
import { mId } from "./utils.js";

export const settings = new TJSGameSettings(mId);
export const getSetting = (setting, store = true) =>
   store ? settings.getStore(setting) : get(settings.getStore(setting));

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
         default: [],
      },
   },
   {
      folder: mId,
      namespace: mId,
      key: "archives",
      options: {
         name: "archives",
         scope: "world",
         config: false,
         type: Array,
         default: [],
      },
   },
   {
      folder: mId,
      namespace: mId,
      key: "chatBar",
      options: {
         name: "vauxs-chat-enhancements.settings.chatBar.title",
         hint: "vauxs-chat-enhancements.settings.chatBar.hint",
         scope: "user",
         config: true,
         type: Boolean,
         default: true,
      },
   },
];

Hooks.on("init", () => {
   settings.registerAll(array);

   game.settings.registerMenu(mId, "chat-archive", {
      name: "vauxs-chat-enhancements.settings.archive.title",
      hint: "vauxs-chat-enhancements.settings.archive.hint",
      label: "vauxs-chat-enhancements.controls.buttons.archive",
      icon: "fas fa-message",
      type: ArchiveShim,
   });
});

