<script>
   import IconBookmarkPlus from "~icons/tabler/bookmark-plus";
   import IconBookmarkFilled from "~icons/tabler/bookmark-filled";
   import { get } from "svelte/store";
   import { overridingSpeaker } from "../features/getSpeakerOverride.js";
   import { localize } from "../lib/utils.js";
   import Ping from "./Components/Ping.svelte";
   import { getSetting } from "../lib/settings.js";

   function toggleSpeakerLock() {
      if (get(overridingSpeaker)) {
         overridingSpeaker.set(false);
      } else {
         overridingSpeaker.set(ChatMessage.getSpeaker());
      }
   }

   const getSpeakerOverride = !CONFIG.VauxsChatEnhancements.getSpeakerOverride;

   let pinnedButtons = getSetting("pinnedButtons");

   function toggleSetting(setting) {
      $pinnedButtons = $pinnedButtons.includes(setting)
         ? $pinnedButtons.filter((s) => s !== setting)
         : [...$pinnedButtons, setting];
   }
</script>

<!-- Lock Speaker -->
<div class="grid grid-cols-10 gap-0">
   <Ping condition={$overridingSpeaker} classes="col-span-9">
      <button
         class="rounded-r-none"
         on:click={toggleSpeakerLock}
         disabled={getSpeakerOverride}
         data-tooltip={getSpeakerOverride ? localize("vce.controls.buttons.getSpeakerOverride") : ""}
      >
         {$overridingSpeaker
            ? localize("vce.controls.buttons.unlockSpeaker")
            : localize("vce.controls.buttons.lockSpeaker")}
      </button>
   </Ping>
   <button
      class="col-span-1 rounded-l-none"
      on:click={() => toggleSetting("lockSpeaker")}
      disabled={getSpeakerOverride}
      data-tooltip={getSpeakerOverride ? localize("vce.controls.buttons.getSpeakerOverride") : ""}
   >
      {#if $pinnedButtons.includes("lockSpeaker")}
         <IconBookmarkFilled class="w-2 scale-200" />
      {:else}
         <IconBookmarkPlus class="w-2 scale-200" />
      {/if}
   </button>
</div>

<!-- Settings -->
<!-- svelte-ignore missing-declaration -->
<button on:click={() => game.settings.sheet.render(true)}>
   {localize("vce.controls.buttons.settings")}
</button>

<style lang="postcss">
   button {
      @apply my-px py-0.5 px-1 border border-foundry-border-light-primary border-solid bg-foundry-button-background;
   }
</style>
