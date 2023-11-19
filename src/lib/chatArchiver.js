import { writable } from "svelte/store";
import { createEasyHook, slugify } from "./utils";

export default class ChatArchiver {
   constructor(messages) {
      this.chatMessages = messages;
   }

   get lastMessage() {
      return this.chatMessages.at(-1);
   }

   get firstMessage() {
      return this.chatMessages.at(0);
   }

   get rangeDate() {
      return {
         start: this.firstMessage.timestamp,
         end: this.lastMessage.timestamp,
      };
   }

   toJSON() {
      return this.chatMessages.map((m) => m.toJSON());
   }

   createArchive({ name, date, description }) {
      const data = {
         name,
         date,
         description,
         id: randomID(),
         messages: this.toJSON(),
      };
      const content = JSON.stringify(data, null, "\t");
      const file = new File([content], `${slugify(`${data.name}-${data.id}`)}.json`, { type: "application/json" });
      return FilePicker.upload("data", ChatArchiver.chatPath(), file);
   }

   static fromChatLog(store = false) {
      let result;
      if (store) {
         result = writable(new ChatArchiver(game.messages.contents), (set) => {
            const trackingHooks = [
               createEasyHook("createChatMessage", () => {
                  set(new ChatArchiver(game.messages.contents));
               }),

               createEasyHook("deleteChatMessage", () => {
                  set(new ChatArchiver(game.messages.contents));
               }),
            ];

            return () => trackingHooks.forEach((h) => h());
         });
      } else {
         result = new ChatArchiver(game.messages.contents);
      }
      return result;
   }

   static worldPath(suffix) {
      return suffix ? `worlds/${game.world.id}/${suffix}` : `worlds/${game.world.id}`;
   }

   static chatPath() {
      return ChatArchiver.worldPath("chat-archives");
   }

   static async createFolder() {
      await FilePicker.browse("data", ChatArchiver.worldPath()).then(async (result) => {
         if (!result.dirs.includes(ChatArchiver.chatPath())) {
            await FilePicker.createDirectory("data", ChatArchiver.chatPath());
         }
      });
   }

   static async getFiles() {
      await ChatArchiver.createFolder();
      return FilePicker.browse("data", ChatArchiver.chatPath(), { extensions: [".json"] }).then((result) => {
         return result.files;
      });
   }

   static async parsePathJSON(path) {
      const response = await fetch(path);
      return await response.json();
   }

   /**
    * Gets all chat archives in the world folder.
    *
    * @returns {Promise<Array<string>>} An array of file paths found in the chat-archives folder.
    */
   static async getArchives() {
      return await ChatArchiver.getFiles().then((res) =>
         Promise.all(res.map((path) => ChatArchiver.parsePathJSON(path)))
      );
   }
}

CONFIG.VauxsChatEnhancements.ChatArchiver = ChatArchiver;

