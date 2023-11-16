<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;

   import { blur } from "svelte/transition";
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import Archive from "./Components/Archive.svelte";
   import IconTrashbin from "~icons/tabler/trash";
   import { localize } from "../../lib/utils";
   import { openNewArchiveApp } from "./CreateNewArchive/NewArchive.js";
   import { getSetting } from "../../lib/settings.js";

   const archiveStore = getSetting("archives");

   function createArchive() {
      openNewArchiveApp();
   }

   function openArchive() {
      ui.notifications.info("openArchive");
   }

   function exportArchive() {
      ui.notifications.info("export");
   }

   let enableDeletion = true;
</script>

<ApplicationShell bind:elementRoot transition={import.meta.env.DEV ? null : blur} transitionOptions={{ duration: 500 }}>
   <div class="grid grid-cols-3 gap-1">
      <div class="col-span-1 flex flex-col relative">
         <div class="overflow-y-scroll scroll-gutter-sb">
            {#if !$archiveStore.length}
               <div class="text-center text-gray-400 pt-4">{localize("vce.archive.empty")}</div>
            {/if}
            {#each $archiveStore as item}
               <Archive {...item} {openArchive} {exportArchive} {enableDeletion} />
            {/each}
         </div>
         <div class="mt-2 flex-row inline-flex w-full absolute bottom-0 bg-pleasant-white">
            <button class="inside-button rounded-r-none" on:click={createArchive}>
               {localize("vce.archive.create")}
            </button>
            <button
               class="inside-button rounded-l-none w-min border-l-0"
               on:click={() => (enableDeletion = !enableDeletion)}
               class:bg-[rgb(255,0,0,0.2)]={enableDeletion}
               data-tooltip={enableDeletion
                  ? localize("vce.archive.disableDeletion")
                  : localize("vce.archive.enableDeletion")}
            >
               <IconTrashbin />
            </button>
         </div>
      </div>
      <div class="p-2 col-span-2 border rounded-sm border-foundry-border-dark-primary flex flex-col h-full">
         <div class="flex-grow-0 flex-shrink flex-auto">search</div>
         <div class="flex-1 overflow-y-scroll">
            <!-- await (new ChatMessage(game.messages.contents[0])).getHTML() -->
            content
         </div>
         <div>paginate row</div>
      </div>
   </div>
</ApplicationShell>
