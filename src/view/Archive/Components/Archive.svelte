<script>
   import IconDownload from "~icons/tabler/download";
   import IconTrashbin from "~icons/tabler/trash";

   export let name;
   export let date;
   export let id;
   export let enableDeletion = false;
   export let openArchive = () => {};
   export let exportArchive = () => {};

   import { localize } from "../../../lib/utils.js";
   import { fade } from "svelte/transition";
   import { getSetting } from "../../../lib/settings.js";

   const archiveStore = getSetting("archives");

   function deleteArchive(event) {
      function remove() {
         archiveStore.update((store) => store.filter((item) => item.id !== id));
      }

      if (event.shiftKey) {
         remove();
      } else {
         Dialog.confirm({
            content: localize("vce.archive.confirmDeletion"),
         }).then((result) => {
            if (result) {
               remove();
            }
         });
      }
   }
</script>

<button class="inside-button" on:click={openArchive}>
   <div class="text-base text-left">{name}</div>
   <footer class="flex text-xs">
      <button
         class="m-0 p-0 text-center w-min"
         data-tooltip={localize("vce.archive.export")}
         on:click|stopPropagation={exportArchive}
      >
         <IconDownload />
      </button>
      {#if enableDeletion}
         <button
            transition:fade
            class="m-0 p-0text-center w-min bg-red-600/60"
            data-tooltip={localize("vce.archive.delete")}
            on:click|stopPropagation={deleteArchive}
         >
            <IconTrashbin />
         </button>
      {/if}
      <div class="ml-auto">
         {localize("vce.archive.time", {
            date: new Date(date).toISOString().split("T")[0].replaceAll("-", "/"),
            time: `${new Date(date).getHours()}:${new Date(date).getMinutes()}`,
         })}
      </div>
   </footer>
</button>
