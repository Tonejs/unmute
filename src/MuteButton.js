import { Toggle } from './Toggle'
import { Context } from './Context'
import './mute-button.scss'

/**
 * @param {Tone.Context} context The Tone.Context to mute/unmute
 * @param {Element=body} container The DOM element to append the button to
 */
export function MuteButton(container=document.body, tone=window.Tone){

	const button = new Toggle(container)

	const context = new Context(tone)

	context.on('mute', m => {
		button.mute = m
	})

	button.on('click', () => {
		if (context.state !== 'running'){
			context.resume()
		} else {
			context.toggleMute()
		}
	})

	//start out as muted
	button.mute = context.mute

	return context.started()
}
