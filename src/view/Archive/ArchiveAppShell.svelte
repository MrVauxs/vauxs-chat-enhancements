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
   import { getSetting } from "../../lib/settings.js";

   const archiveStore = ChatArchiver.getArchives(true);

   function createArchive() {
      if (game.messages.size > 0) {
         openNewArchiveApp();
      } else {
         ui.notifications.error("No messages to archive!");
      }
   }

   let archive = null;

   $: if (getSetting("loadLastArchive", false) && $archiveStore.length) archive = $archiveStore[0];

   function openArchive(item) {
      if (CONFIG.debug.vce) console.log(item);
      archive = item;
   }

   function exportArchive() {
      ui.notifications.info("export");
   }

   function cleanup(string) {
      return string.replaceAll(/<a aria-label="Delete" class="message-delete">.+<\/a>/g, "");
   }

   import { paginate, PaginationNav } from "svelte-paginate";
   let currentPage = 1;
   let pageSize = 8;
   let paginatedItems = [];
   $: if (archive) paginatedItems = paginate({ items: archive.messages, pageSize, currentPage });

   let searchText = "";

   $: if (searchText.length) {
      archive.messages = archive._ogMessages.filter((mes) => {
         const message = new ChatMessage(mes);
         return (
            message.content.toLowerCase().includes(searchText.toLowerCase()) ||
            message.flavor.toLowerCase().includes(searchText.toLowerCase())
         );
      });
   } else if (archive) {
      archive.messages = archive._ogMessages;
   }
</script>

<ApplicationShell bind:elementRoot transition={import.meta.env.DEV ? null : blur} transitionOptions={{ duration: 500 }}>
   <div class="grid grid-cols-5 gap-1">
      <div class="col-span-2 flex flex-col relative">
         <div class="overflow-y-scroll scroll-gutter-sb h-[500px]">
            {#await archiveStore.init()}
               Loading...
            {:then}
               {#each $archiveStore as item}
                  <Archive {...item} {exportArchive} openArchive={() => openArchive(item)} />
               {/each}
            {/await}
         </div>
         <div class="mt-2 flex-row inline-flex w-full absolute bottom-0">
            <button class="inside-button rounded-r-none bg-pleasant-white" on:click={createArchive}>
               {localize("vce.archive.create")}
            </button>
            <button
               class="inside-button rounded-l-none w-min border-l-0 bg-pleasant-white"
               disabled="true"
               data-tooltip={localize("vce.archive.cantDelete", {
                  path: `"<span style="color:yellow;">${ChatArchiver.chatPath()}</span>"`,
               })}
            >
               <IconTrashbin />
            </button>
         </div>
      </div>
      <div class="p-2 col-span-3 border rounded-sm border-foundry-border-dark-primary flex flex-col max-h-[554px]">
         {#if archive}
            <div class="mb-2 flex flex-row">
               <!-- search -->
               <input type="text" contenteditable="true" bind:value={searchText} placeholder="Search..." />
            </div>
            <div class="overflow-y-auto h-full">
               {#each paginatedItems as mes}
                  <!-- svelte-ignore missing-declaration -->
                  {#await new ChatMessage(mes).getHTML() then message}
                     {#each message as html}
                        {@html cleanup(html.outerHTML)}
                     {/each}
                  {/await}
               {/each}
            </div>
            <div class="pagination mt-2 flex">
               <!-- pagination -->
               <PaginationNav
                  totalItems={archive.messages.length}
                  {pageSize}
                  {currentPage}
                  limit={1}
                  showStepOptions={true}
                  on:setPage={(e) => (currentPage = e.detail.page)}
               />
               <div class="ml-auto">
                  <input
                     class="!text-center !w-6"
                     type="number"
                     min="1"
                     max={archive.messages.length}
                     bind:value={pageSize}
                     data-tooltip="Change Amount of Rendered Messages"
                  />
               </div>
            </div>
         {:else}
            No Archive Selected
         {/if}
      </div>
   </div>
</ApplicationShell>

<style lang="postcss">
   .pagination :global(.pagination-nav) {
      @apply flex flex-row justify-center items-center;
   }
   .pagination :global(.option) {
      @apply px-2;
   }
   .pagination :global(.option.active) {
      @apply text-blue-500 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.2)];
   }
   .pagination :global(.option.disabled) {
      opacity: 0.3;
      filter: grayscale(100%);
   }
</style>
