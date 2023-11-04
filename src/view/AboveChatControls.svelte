<script>
   import "../app.postcss";
   import IconSettings from "~icons/tabler/settings";
   import IconDots from "~icons/tabler/dots-vertical";
   import { writable } from "svelte/store";
   import { onDestroy, onMount } from "svelte";
   import { computePosition, flip, shift, arrow as arrowFUI, offset, autoUpdate } from "@floating-ui/dom";
   import { clickOutside } from "../lib/utils.js";
   import Tooltip from "./Tooltip.svelte";
   import { overridingSpeaker } from "../features/getSpeakerOverride.js";
   import Ping from "./Ping.svelte";

   const speaker = writable(getSpeaker());

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
</script>

<div class="vce vce-tooltip" class:hidden={!$display} bind:this={tooltip}>
   <div id="tooltipContent" use:clickOutside on:outsideclick={hideTooltip}>
      <svelte:component this={Tooltip} bind:arrow />
   </div>
</div>

<div class="vce vce-main-div">
   <div class="border border-foundry-border-light-primary rounded-md p-0.5 my-1">
      <div class="grid-cols-6 grid gap-1 h-8">
         <div id="icon" class="col-span-1 ml-0.5 hover:scale-110 transition-transform">
            <img src={$speaker.img} alt={$speaker.alias} class="w-8 h-8" style="transform: scale({$speaker.scale});" />
         </div>
         <div
            id="name"
            class="p-0.5 col-span-4 truncate align-middle text-center text-lg"
            data-tooltip={$speaker.alias}
            data-tooltip-direction="UP"
         >
            {$speaker.alias}
         </div>
         <div class="col-span-1 flex">
            <button id="settings" class="w-1/2 hover:bg-foundry-checkbox-checked click">
               <IconSettings class="w-full" />
            </button>
            <Ping condition={$overridingSpeaker} classes="w-1/2 h-full">
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
