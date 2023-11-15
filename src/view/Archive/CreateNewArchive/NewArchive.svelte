<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";

   import { getSetting } from "../../../lib/settings.js";

   const archiveStore = getSetting("archives");

   function addArchive() {
      $archiveStore.push({
         name: "New Archive",
         date: Date.now(),
      });
      console.log($archiveStore);
   }
</script>

<ApplicationShell bind:elementRoot>
   <button on:click={addArchive}>Add Archive</button>
</ApplicationShell>
