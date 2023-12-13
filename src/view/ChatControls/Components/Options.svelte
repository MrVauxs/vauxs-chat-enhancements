<script>
   import { whispering, overridingSpeaker } from "../AboveChatControls.svelte";
   import { localize } from "../../../lib/utils.js";
   import { openArchiveApp } from "../../Archive/ArchiveApp.js";
   import Ping from "../../Components/Ping.svelte";
</script>

<!-- Settings -->
<!-- svelte-ignore missing-declaration -->
<Ping condition={$overridingSpeaker}>
   <button on:click={() => game.settings.sheet.render(true)}>
      {localize("vce.controls.buttons.settings")}
   </button>
</Ping>

<!-- Archive -->
<button on:click={openArchiveApp}>
   {localize("vce.controls.buttons.archive")}
</button>

<style lang="postcss">
   button {
      @apply my-px py-0.5 px-1 border border-foundry-border-light-primary border-solid bg-foundry-button-background;
   }
</style>
