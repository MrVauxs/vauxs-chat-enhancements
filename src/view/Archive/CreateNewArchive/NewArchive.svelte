<svelte:options accessors={true} />

<script>
   export let elementRoot = void 0;
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import ChatArchiver from "../../../lib/chatArchiver.js";

   const currentArchive = ChatArchiver.fromChatLog(true);

   const newArchive = {
      name: new Date(Date.now()).toDateString(),
      date: Date.now(),
      id: randomID(),
   };

   function addArchive() {
      console.log($currentArchive);
      $currentArchive.createArchive(newArchive);
   }
</script>

<ApplicationShell bind:elementRoot>
   <input type="text" bind:value={newArchive.name} />
   <button on:click={addArchive}>Add Archive</button>
</ApplicationShell>
