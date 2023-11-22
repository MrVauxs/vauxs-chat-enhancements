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

   const archiveStore = ChatArchiver.getArchives(true);

   function createArchive() {
      if (game.messages.size > 0) {
         openNewArchiveApp();
      } else {
         ui.notifications.error("No messages to archive!");
      }
   }

   let archive = null;

   function openArchive(item) {
      archive = item;
   }

   function exportArchive() {
      ui.notifications.info("export");
   }

   function cleanup(string) {
      return string.replaceAll(/<a aria-label="Delete" class="message-delete">.+<\/a>/g, "");
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
      <!-- TODO: FIX OVERFLOW!!!!!!!!!! -->
      <div class="p-2 col-span-3 border rounded-sm border-foundry-border-dark-primary flex flex-col">
         <div>
            <!-- search -->
            search row
         </div>
         <div class="overflow-y-auto h-[500px]">
            <!-- svelte-ignore missing-declaration -->
            {#if archive}
               {#each { ...archive.messages, length: archive.messages.length <= 10 ? archive.messages.length : 10 } as mes}
                  {#await new ChatMessage(mes).getHTML() then message}
                     {#each message as html}
                        {@html cleanup(html.outerHTML)}
                     {/each}
                  {/await}
               {/each}
            {:else}
               No Archive Selected
            {/if}
         </div>
         <div>
            <!-- pagination -->
            paginate row
         </div>
      </div>
   </div>
</ApplicationShell>
