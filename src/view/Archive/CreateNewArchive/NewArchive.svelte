<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import ChatArchiver from "../../../lib/chatArchiver.js";
   import { localize } from "../../../lib/utils.js";

   const archive = ChatArchiver.fromChatLog(true);

   function addArchive() {
      console.log($archive);
      $archive.createArchive();
   }

   function scrollToMessageFromUnixTime(time) {
      const timestamp = Math.floor(new Date(time).getTime());
      const messageDocument = $archive.chatMessages.find((m) => m.timestamp >= timestamp);
      const chatMessage = document.querySelector(`[data-message-id="${messageDocument.id}"]`);

      console.log(time, timestamp, messageDocument.timestamp);

      if (chatMessage) {
         chatMessage.scrollIntoView({ behavior: "smooth", block: "center" });
         chatMessage.classList.add("vce-highlight");
         setTimeout(() => {
            chatMessage.classList.remove("vce-highlight");
         }, 4000);
      } else {
         ui.notifications.warn("Cannot find message! " + messageDocument.id);
      }
   }
</script>

<ApplicationShell bind:elementRoot>
   <div class="grid gap-1 pb-4">
      <div>
         <label class="font-bold" for="name"> Name </label>
         <input type="text" id="name" bind:value={$archive.name} />
      </div>
      <div>
         <label class="font-bold" for="description"> Description </label>
         <input type="text" id="description" bind:value={$archive.description} />
      </div>
      <div class="grid grid-rows-2 grid-cols-12 gap-1">
         <!-- From -->
         <label class="col-span-3 font-bold text-center m-auto" for="date-from"> From... </label>
         <button
            class="col-span-1"
            data-tooltip={localize("vce.archive.scroll")}
            on:click={() => scrollToMessageFromUnixTime($archive.rangeDate.start)}
         >
            <i class="fa-solid fa-arrow-up-right-from-square" />
         </button>
         <input class="col-span-8" type="datetime-local" id="date-from" bind:value={$archive.rangeDate.start} />

         <!-- To -->
         <label class="col-span-3 text-center m-auto font-bold" for="date-to"> To... </label>
         <button
            class="col-span-1"
            data-tooltip={localize("vce.archive.scroll")}
            on:click={() => scrollToMessageFromUnixTime($archive.rangeDate.end)}
         >
            <i class="fa-solid fa-arrow-up-right-from-square" />
         </button>
         <input class="col-span-8" type="datetime-local" id="date-to" bind:value={$archive.rangeDate.end} />
      </div>
   </div>
   <button class="max-h-8 inside-button" on:click={addArchive}>
      {localize("vce.archive.button", { count: $archive.chatMessages.length })}
   </button>
</ApplicationShell>

<style lang="postcss">
   input {
      @apply p-1;
   }
</style>
