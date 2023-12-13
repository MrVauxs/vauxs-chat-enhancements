<script>
   import IconBookmarkPlus from "~icons/tabler/bookmark-plus";
   import IconBookmarkFilled from "~icons/tabler/bookmark-filled";
   import { localize } from "../../../lib/utils.js";
   import { getSetting } from "../../../lib/settings.js";
   import { openArchiveApp } from "../../Archive/ArchiveApp.js";

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
   <!-- <Ping condition={$overridingSpeaker} classes="col-span-9">
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
         <IconBookmarkFilled class="w-2 scale-200 mx-auto" />
      {:else}
         <IconBookmarkPlus class="w-2 scale-200 mx-auto" />
      {/if}
   </button>
    -->
</div>

<!-- Settings -->
<!-- svelte-ignore missing-declaration -->
<button on:click={() => game.settings.sheet.render(true)}>
   {localize("vce.controls.buttons.settings")}
</button>

<!-- Archive -->
<button on:click={openArchiveApp}>
   {localize("vce.controls.buttons.archive")}
</button>

<style lang="postcss">
   button {
      @apply my-px py-0.5 px-1 border border-foundry-border-light-primary border-solid bg-foundry-button-background;
   }
</style>
