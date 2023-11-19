import { writable } from "svelte/store";
import { createEasyHook, slugify } from "./utils";

export default class ChatArchiver {
   constructor(messages, { name, date, description }) {
      this._ogMessages = messages;
      this.chatMessages = messages;
      this.name = name ?? new Date(Date.now()).toDateString();
      this.date = date ?? Date.now();
      this.description = description ?? "";
   }

   get lastMessage() {
      return this.chatMessages.at(-1);
   }

   get firstMessage() {
      return this.chatMessages.at(0);
   }

   set firstMessage(message) {
      this.chatMessages = this._ogMessages.filter((m) => m.timestamp >= message.timestamp);
   }

   set lastMessage(message) {
      this.chatMessages = this._ogMessages.filter((m) => m.timestamp <= message.timestamp);
   }

   toJSON() {
      return this.chatMessages.map((m) => m.toJSON());
   }

   createArchive() {
      const data = {
         name: this.name,
         date: this.date,
         description: this.description,
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
         const archive = new ChatArchiver(game.messages.contents);
         result = writable(archive, (set) => {
            const trackingHooks = [
               createEasyHook("createChatMessage", () => {
                  set(new ChatArchiver(game.messages.contents, archive));
               }),

               createEasyHook("deleteChatMessage", () => {
                  set(new ChatArchiver(game.messages.contents, archive));
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

