import { Toggle } from './Toggle'
import { Context } from './Context'
import { EventEmitter } from 'events'
import { AudioElement } from './AudioElement'
import './unmute.scss'

/**
 * @param {Element=body} container The DOM element to append the button to
 * @param {Tone=} tone A reference to Tone.js on the page. 
 * @returns EventEmitter
 */
class Unmute extends EventEmitter {
	constructor({ container=document.body, Tone=window.Tone, title='Web Audio' } = {}){
		super()

		/**
		 * The HTML element
		 * @type {Toggle}
		 */
		const button = this.button = new Toggle(container)

		/**
		 * Controls the AudioContext
		 * @type {Context}
		 */
		const context = this.context = new Context(Tone)

		/**
		 * AudioElement used to unsilence iOS
		 * @type {AudioElement}
		 */
		const audioElement = new AudioElement(title)

		//fwd events from the context
		context.on('mute', m => {
			button.mute = m
			this.emit(m ? 'mute' : 'unmute')
		})

		//listen for click events
		button.on('click', () => {
			if (context.state !== 'running'){
				context.resume()
				audioElement.click()
				this.emit('click')
			} else {
				context.toggleMute()
			}
		})

		//start out in the contexts current state
		button.mute = context.mute

		//listen for started change
		context.started().then(() => {
			this.emit('start')
		})
	}

	/**
	 * the mute state of the button
	 * @type {Boolean}
	 */
	get mute(){
		return this.button.mute
	}

	set mute(m){
		this.button.mute = m
		this.context.mute = m
	}

	/**
	 * The HTML element
	 * @type {HTMLElement}
	 * @readOnly
	 */
	get element(){
		return this.button.element
	}

	/**
	 * remove the element from the container
	 */
	remove(){
		this.button.remove()
	}
}

export function UnmuteButton(...args){
	return new Unmute(...args)
}
