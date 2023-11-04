/**
 * Handles clicks outside of the passed node
 *
 * @param {HTMLElement} node - node to handle clicks outside of
 *
 * @returns {object} - destroy function
 */
export function clickOutside(node) {
	window.addEventListener('click', handleClick);

	// eslint-disable-next-line jsdoc/require-jsdoc
	function handleClick(e) {
        if (!node.contains(e.target)) {
            node.dispatchEvent(new CustomEvent('outsideclick'));
        }
    }

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		}
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
	if (key.startsWith('vce')) {
		key = key.replace('vce.', 'vauxs-chat-enhancements.');
	}
	if (format) {
		return game.i18n.format(key, format);
	} else {
		return game.i18n.localize(key);
	}
}