import { writable } from "svelte/store";
import { createEasyHook } from "./utils";

export class ChatArchiver {
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

   createArchive() {
      console.log("Not yet implemented");
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
}

