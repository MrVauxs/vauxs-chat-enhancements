<script>
   import "../app.css";
   import IconMessages from "~icons/tabler/messages";
   import IconDots from "~icons/tabler/dots-vertical";
   import IconLockOpen from "~icons/tabler/lock-open";
   import IconLock from "~icons/tabler/lock";
   import { get, writable } from "svelte/store";
   import { onDestroy, onMount } from "svelte";
   import { computePosition, flip, shift, arrow as arrowFUI, offset, autoUpdate } from "@floating-ui/dom";
   import { clickOutside, localize } from "../lib/utils.js";
   import Tooltip from "./Tooltip.svelte";
   import { overridingSpeaker } from "../features/getSpeakerOverride.js";
   import Ping from "./Ping.svelte";
   import { getSetting } from "../lib/settings";

   const speaker = writable(getSpeaker());
   const whispering = writable(false);

   function toggleSpeakerLock() {
      if (get(overridingSpeaker)) {
         overridingSpeaker.set(false);
      } else {
         overridingSpeaker.set(ChatMessage.getSpeaker());
      }
   }

   /**
    * @returns {object} The speaker object
    */
   function getSpeaker() {
      const spk = ChatMessage.getSpeaker();
      const img = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.src : game.user.avatar;
      const scale = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.scaleX : 1;

      return {
         img,
         scale,
         ...spk,
      };
   }

   const tokenHookId = Hooks.on("controlToken", () => {
      speaker.set(getSpeaker());
   });

   overridingSpeaker.subscribe(() => {
      speaker.set(getSpeaker());
   });

   const display = writable(false);

   let tooltip;
   let tooltipButton;
   let arrow;

   function updatePosition() {
      computePosition(tooltipButton, tooltip, {
         placement: "top",
         middleware: [flip(), shift({ padding: 6 }), offset(3), flip(), arrowFUI({ element: arrow })],
      }).then(({ x, y, placement, middlewareData }) => {
         Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`,
         });

         // Accessing the data
         const { x: arrowX, y: arrowY } = middlewareData.arrow;

         const staticSide = {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right",
         }[placement.split("-")[0]];

         Object.assign(arrow.style, {
            left: arrowX != null ? `${arrowX}px` : "",
            top: arrowY != null ? `${arrowY}px` : "",
            right: "",
            bottom: "",
            [staticSide]: "-4px",
         });
      });
   }

   function showTooltip() {
      display.set(true);
      updatePosition();
   }

   function toggleTooltip() {
      $display ? hideTooltip() : showTooltip();
   }

   function hideTooltip() {
      display.set(false);
   }

   let cleanup;

   onMount(() => {
      cleanup = autoUpdate(tooltipButton, tooltip, updatePosition);
   });

   onDestroy(() => {
      Hooks.off("controlToken", tokenHookId);
      cleanup();
   });

   let pinnedButtons = getSetting("pinnedButtons");
   let cols = [5, 1];
   $: cols = $pinnedButtons.length > 1 ? [4, 2] : [5, 1];
</script>

<div class="vce vce-tooltip" class:hidden={!$display} bind:this={tooltip}>
   <div id="tooltipContent" use:clickOutside on:outsideclick={hideTooltip}>
      <svelte:component this={Tooltip} bind:arrow />
   </div>
</div>

<div class="vce vce-main-div">
   <div class="border border-foundry-border-light-primary rounded-md p-0.5 my-1">
      <div class="grid-cols-5 grid h-8">
         <div id="icon" class="col-span-1 ml-0.5 hover:scale-110 transition-transform">
            <img
               src={$speaker.img}
               alt={$speaker.alias}
               class="w-8 h-8 object-contain"
               style="transform: scale({$speaker.scale});"
            />
         </div>
         <div
            id="name"
            class="p-0.5 col-span-3 truncate align-middle text-center text-lg"
            data-tooltip={$speaker.alias}
            data-tooltip-direction="UP"
         >
            {$speaker.alias}
         </div>
         <div class="col-span-1 flex right-0 ml-auto gap-x-0.5">
            <!-- Whisper Button -->
            {#if $pinnedButtons.includes("whisperTo")}
               <Ping condition={$whispering}>
                  <button
                     id="whisperTo"
                     class="hover:bg-foundry-checkbox-checked click"
                     data-tooltip-direction="UP"
                     data-tooltip={localize("vce.controls.buttons.whisperTo")}
                  >
                     {#if $whispering}
                        <IconMessages class="w-full" />
                     {:else}
                        <IconMessages class="w-full" />
                     {/if}
                  </button>
               </Ping>
            {/if}

            <!-- Lock Button -->
            {#if $pinnedButtons.includes("lockSpeaker")}
               <Ping condition={$overridingSpeaker}>
                  <button
                     id="lockSpeaker"
                     class="hover:bg-foundry-checkbox-checked click"
                     on:click={toggleSpeakerLock}
                     data-tooltip-direction="UP"
                     data-tooltip={localize("vce.controls.buttons.lockSpeaker")}
                  >
                     {#if $overridingSpeaker}
                        <IconLock class="w-full" />
                     {:else}
                        <IconLockOpen class="w-full" />
                     {/if}
                  </button>
               </Ping>
            {/if}

            <!-- Options Button -->
            <Ping condition={$overridingSpeaker || $whispering}>
               <button
                  id="options"
                  class="relative hover:bg-foundry-checkbox-checked click"
                  on:click|stopPropagation={toggleTooltip}
                  bind:this={tooltipButton}
               >
                  <IconDots class="w-full" />
               </button>
            </Ping>
         </div>
      </div>
   </div>
</div>

<style>
   .vce-main-div {
      flex: 0;
      margin: 0 6px;
   }

   .vce-tooltip {
      width: max-content;
      position: absolute;
   }
</style>
