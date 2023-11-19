/**
 * Handles clicks outside of the passed node
 *
 * @param {HTMLElement} node - node to handle clicks outside of
 *
 * @returns {object} - destroy function
 */
export function clickOutside(node) {
   window.addEventListener("click", handleClick, true);

   // eslint-disable-next-line jsdoc/require-jsdoc
   function handleClick(e) {
      if (!node.contains(e.target)) {
         node.dispatchEvent(new CustomEvent("outsideclick"));
      }
   }

   return {
      destroy() {
         // the node has been removed from the DOM
         window.removeEventListener("click", handleClick, true);
      },
   };
}

/**
 * Returns the localized string for the given key.
 *
 * @param {string} key - The localization
 *
 * @param {object} format - Formatting to add to the localized string
 *
 * @returns {string} The localized string
 */
export function localize(key, format) {
   if (key.startsWith("vce")) {
      key = key.replace("vce.", "vauxs-chat-enhancements.");
   }
   if (format) {
      return game.i18n.format(key, format);
   } else {
      return game.i18n.localize(key);
   }
}

/**
 * Creates a hook that is easy to clean up. Returns a function that can be called to remove the hook.
 *
 * @param {string} hookName - The name of the hook to create
 *
 * @param {Function} callback - The callback to run when the hook is triggered
 *
 * @returns {Function} deletion - The function to call to remove the hook
 */
export function createEasyHook(hookName, callback) {
   const id = Hooks.on(hookName, callback);
   return () => Hooks.off(hookName, id);
}

export const mId = "vauxs-chat-enhancements";

