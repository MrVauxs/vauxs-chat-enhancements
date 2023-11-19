<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import ChatArchiver from "../../../lib/chatArchiver.js";
   import { localize } from "../../../lib/utils.js";

   const archive = ChatArchiver.fromChatLog(true);

   async function addArchive() {
      console.log(await $archive.createArchive(deleteMessages));
   }

   let all = true;
   let deleteMessages = false;
   let from = new Date($archive.firstMessage.timestamp).toISOString().slice(0, 16);
   let to = new Date($archive.lastMessage.timestamp).toISOString().slice(0, 16);

   $: if (all) {
      $archive.chatMessages = $archive._ogMessages;
   }

   $: if (!all)
      $archive.chatMessages = $archive._ogMessages.filter((message) => {
         const date = new Date(message.timestamp).getTime();
         return date >= new Date(from).getTime() && date <= new Date(to).getTime();
      });
</script>

<ApplicationShell bind:elementRoot>
   <div class="grid px-1">
      <div>
         <label class="font-bold" for="name"> Name </label>
         <input type="text" id="name" bind:value={$archive.name} />
      </div>
      <div>
         <label class="font-bold" for="description"> Description </label>
         <input type="text" id="description" bind:value={$archive.description} />
      </div>
      <div class="grid grid-cols-4 items-center">
         <label class="font-bold col-span-3 items-center text-center" for="all-chat">
            Archive all of Current Chat
         </label>
         <input class="right-0" type="checkbox" id="all-chat" bind:checked={all} />
      </div>
      <div class="grid grid-rows-2 grid-cols-12 gap-1">
         <label disabled={all} class="col-span-3 font-bold text-center m-auto" for="date-from"> From... </label>
         <!--
         <button disabled={all} class="col-span-1" data-tooltip={localize("vce.archive.scroll")}>
            <i class="fa-solid fa-arrow-up-right-from-square" />
         </button>
         -->
         <input disabled={all} class="col-span-9" type="datetime-local" id="date-from" bind:value={from} />

         <label disabled={all} class="col-span-3 text-center m-auto font-bold" for="date-to"> To... </label>
         <!--
         <button disabled={all} class="col-span-1" data-tooltip={localize("vce.archive.scroll")}>
            <i class="fa-solid fa-arrow-up-right-from-square" />
         </button>
         -->
         <input disabled={all} class="col-span-9" type="datetime-local" id="date-to" bind:value={to} />
      </div>
      <div class="grid grid-cols-4 items-center pt-2">
         <label class="font-bold col-span-3 items-center text-center" for="all-chat"> Delete the Messages </label>
         <input class="right-0" type="checkbox" id="all-chat" bind:checked={deleteMessages} />
      </div>
   </div>
   <button
      class="max-h-8 inside-button"
      on:click={async () => await addArchive()}
      disabled={!$archive.chatMessages.length}
   >
      {localize("vce.archive.button", { count: $archive.chatMessages.length })}
   </button>
</ApplicationShell>

<style lang="postcss">
   input {
      @apply p-1;
   }
</style>
