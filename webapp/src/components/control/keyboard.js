import React, { useEffect } from 'react';

function KeyMapper({leftClickHandler, rightClickHandler, escapeHandler}) {
	function handleKeyDown(event) {
		event.preventDefault();
		switch (event.key) {
			case "ArrowLeft":
			case "ArrowUp":
			case "PageUp":
				leftClickHandler();
				break;
			case "ArrowRight":
			case "ArrowDown":
			case "PageDown":
				rightClickHandler();
				break;
			default:
				escapeHandler();
				break;
		}
	}
	useEffect(() => {
		document.getElementById('keymap').focus();
	}, []);
	return (
		<div tabIndex={0} onKeyDown={(e) => handleKeyDown(e)} id="keymap"></div>
	);
}

export { KeyMapper };