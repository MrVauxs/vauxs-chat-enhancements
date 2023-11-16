<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";

   import { getSetting } from "../../../lib/settings.js";

   const archiveStore = getSetting("archives");

   console.log(archiveStore);

   function addArchive() {
      archiveStore.update((store) => {
         console.log(store);
         store.push({
            name: "New Archive",
            date: Date.now(),
            id: randomID(),
         });
         return store;
      });
   }
</script>

<ApplicationShell bind:elementRoot>
   <button on:click={addArchive}>Add Archive</button>
</ApplicationShell>
