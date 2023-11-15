<script>
   import IconDownload from "~icons/tabler/download";
   import IconTrashbin from "~icons/tabler/trash";

   export let name;
   export let date;
   export let enableDeletion = false;
   export let click = () => {};
   export let exportArchive = () => {};
   export let deleteArchive = () => {};

   import { localize } from "../../../lib/utils.js";
   import { fade } from "svelte/transition";
</script>

<button class="inside-button" on:click={click}>
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
