<script>
   import { clickOutside } from "../../lib/utils";
   import { computePosition, flip, shift, arrow as arrowFUI, offset } from "@floating-ui/dom";
   import { writable } from "svelte/store";
   export let tooltipButton;
   export const display = writable(false);

   let tooltip;
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

   export function toggleTooltip() {
      $display ? hideTooltip() : showTooltip();
   }

   function hideTooltip() {
      display.set(false);
   }

   import { onDestroy } from "svelte";
   import { autoUpdate } from "@floating-ui/dom";

   let cleanup = () => {};

   $: if (!import.meta.env.DEV && tooltipButton && !cleanup)
      cleanup = autoUpdate(tooltipButton, tooltip, updatePosition);

   onDestroy(() => {
      cleanup();
   });
</script>

<div
   class="vce vce-tooltip"
   class:hidden={!$display}
   bind:this={tooltip}
   id="tooltipContent"
   use:clickOutside
   on:outsideclick={hideTooltip}
>
   <div
      class="relative z-index-tooltip bg-parchment p-1 text-foundry-text-dark-primary border-2 border-foundry-border-light-primary rounded-md border-solid"
   >
      <slot />
   </div>
   <div
      id="arrow"
      class="bg-parchment absolute w-2 h-2 rotate-45 z-10 border border-foundry-border-light-primary"
      bind:this={arrow}
   />
</div>

<style>
   .vce-tooltip {
      width: max-content;
      position: absolute;
      line-break: auto;
   }
</style>
