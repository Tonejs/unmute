/**
 * Handles case where the script is added to the top of the 
 */

//this is the script which loaded the UnmuteButton
const currentScript = document.currentScript

export function addButton(UnmuteButton){
	const addButtonAttr = currentScript.getAttribute('data-add-button')
	if (currentScript && addButtonAttr === 'true'){
		//add it once the window is loaded
		const mute = currentScript.getAttribute('data-mute') === 'true'

		//check if the document is already loaded
		if (document.readyState === 'complete'){
			UnmuteButton({ mute })
		} else {
			//otherwise add an event listener
			window.addEventListener('load', () => UnmuteButton({ mute }))
		}
	}
}

