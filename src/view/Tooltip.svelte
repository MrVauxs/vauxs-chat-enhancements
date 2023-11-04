<script>
   export let arrow = null;
   import { get } from "svelte/store";
   import { overridingSpeaker } from "../features/getSpeakerOverride.js";
   import { localize } from "../lib/utils.js";
   import Ping from "./Ping.svelte";

   function toggleSpeakerLock() {
      if (get(overridingSpeaker)) {
         overridingSpeaker.set(false);
      } else {
         overridingSpeaker.set(ChatMessage.getSpeaker());
      }
   }

   const getSpeakerOverride = !CONFIG.VauxsChatEnhancements.getSpeakerOverride;
</script>

<div
   class="relative z-20 bg-parchment p-1 grid grid-cols-1 grid-rows-3 text-foundry-text-dark-primary border-2 border-foundry-border-light-primary rounded-md border-solid"
>
   <Ping condition={$overridingSpeaker}>
      <button on:click={toggleSpeakerLock} disabled={getSpeakerOverride} class:disabled={getSpeakerOverride}>
         {$overridingSpeaker
            ? localize("vce.controls.buttons.unlockSpeaker")
            : localize("vce.controls.buttons.lockSpeaker")}
      </button>
   </Ping>
   <button> Option 2 </button>
   <button> Option 3 </button>
</div>
<div
   id="arrow"
   class="bg-parchment absolute w-2 h-2 rotate-45 z-10 border border-foundry-border-light-primary"
   bind:this={arrow}
/>

<style lang="postcss">
   button {
      @apply my-px py-0.5 px-1 border border-foundry-border-light-primary rounded-md border-solid bg-foundry-button-background;
   }
</style>
