<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import { getSetting } from "../../../lib/settings.js";
   import { ChatArchiver } from "../../../lib/chatArchiver.js";

   const archiveStore = getSetting("archives");

   const currentArchive = ChatArchiver.fromChatLog(true);

   const newArchive = {
      name: Date.now(),
      date: Date.now(),
      id: randomID(),
   };

   function addArchive() {
      console.log($currentArchive);
      /* archiveStore.update((store) => {
         store.push({
            name: "New Archive",
            date: Date.now(),
            id: randomID(),
         });
         return store;
      }); */
   }
</script>

<ApplicationShell bind:elementRoot>
   <input type="text" bind:value={newArchive.name} />
   <button on:click={addArchive}>Add Archive</button>
</ApplicationShell>
