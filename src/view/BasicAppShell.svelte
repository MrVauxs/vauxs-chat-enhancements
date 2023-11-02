<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
   import { ApplicationShell } from "#runtime/svelte/component/core";
   import "../app.postcss";

   export let elementRoot;
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <div class="vce">
      <main>
         <h1 class="animate-pulse text-red-600">Basic application</h1>
      </main>
   </div>
</ApplicationShell>

<style>
   main {
      text-align: center;
      display: flex;
      flex-direction: column;
   }
</style>
