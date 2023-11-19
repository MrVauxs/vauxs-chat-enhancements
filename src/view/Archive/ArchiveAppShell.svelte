<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;

   import { blur } from "svelte/transition";
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import Archive from "./Components/Archive.svelte";
   import IconTrashbin from "~icons/tabler/trash";
   import { localize } from "../../lib/utils.js";
   import ChatArchiver from "../../lib/chatArchiver.js";
   import { openNewArchiveApp } from "./CreateNewArchive/NewArchive.js";

   const archives = ChatArchiver.getArchives();

   function createArchive() {
      openNewArchiveApp();
   }

   function openArchive() {
      ui.notifications.info("openArchive");
   }

   function exportArchive() {
      ui.notifications.info("export");
   }
</script>

<ApplicationShell bind:elementRoot transition={import.meta.env.DEV ? null : blur} transitionOptions={{ duration: 500 }}>
   <div class="grid grid-cols-3 gap-1">
      <div class="col-span-1 flex flex-col relative">
         <div class="overflow-y-scroll scroll-gutter-sb h-[500px]">
            {#await archives}
               Loading...
            {:then archives}
               {#each archives as item}
                  <Archive {...item} {openArchive} {exportArchive} />
               {/each}
            {/await}
         </div>
         <div class="mt-2 flex-row inline-flex w-full absolute bottom-0">
            <button class="inside-button rounded-r-none bg-pleasant-white" on:click={createArchive}>
               {localize("vce.archive.create")}
            </button>
            <button
               class="inside-button rounded-l-none w-min border-l-0 bg-pleasant-white"
               disabled={true}
               data-tooltip={localize("vce.archive.cantDelete", { path: `<b>"${ChatArchiver.chatPath()}"</b>` })}
            >
               <IconTrashbin />
            </button>
         </div>
      </div>
      <div class="p-2 col-span-2 border rounded-sm border-foundry-border-dark-primary flex flex-col h-full">
         <div class="flex-grow-0 flex-shrink flex-auto">
            <!-- search -->
            search row
         </div>
         <div class="flex-1 overflow-y-scroll">
            <!-- await (new ChatMessage(game.messages.contents[0])).getHTML() -->
            content
         </div>
         <div>
            <!-- pagination -->
            paginate row
         </div>
      </div>
   </div>
</ApplicationShell>
