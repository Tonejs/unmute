import { Toggle } from './Toggle'
import { Context } from './AudioContext'
import { EventEmitter } from 'events'
import { AudioElement } from './AudioElement'
import './unmute.scss'

/**
 * @returns EventEmitter
 */
class Unmute extends EventEmitter {
	constructor({ container=document.body, context=(window.Tone ? window.Tone.context : null), title='Web Audio' } = {}){
		super()

		if (context === null){
			throw new Error('A Web Audio Context needs to be passed in')
		}

		/**
		 * The HTML element
		 * @type {Toggle}
		 */
		this._button = new Toggle(container)

		/**
		 * Controls the AudioContext
		 * @type {Context}
		 */
		this._context = new Context(context)

		/**
		 * The AudioContext reference
		 * @type {AudioContext}
		 */
		this.context = this._context.context

		/**
		 * AudioElement used to unsilence iOS
		 * @type {AudioElement}
		 */
		this._audioElement = new AudioElement(title)

		//fwd events from the context
		this._context.on('mute', m => {
			this._button.mute = m
			this.emit(m ? 'mute' : 'unmute')
		})

		//listen for click events
		this._button.on('click', () => {
			if (this._context.state !== 'running'){
				this._context.resume()
				this._audioElement.click()
				this.emit('click')
			} else {
				this._context.toggleMute()
			}
		})

		//start out in the contexts current state
		this._button.mute = this._context.mute

		//listen for started change
		this._context.started().then(() => {
			this.emit('start')
		})
	}

	/**
	 * the mute state of the button
	 * @type {Boolean}
	 */
	get mute(){
		return this._button.mute
	}

	set mute(m){
		this._button.mute = m
		this._context.mute = m
	}

	/**
	 * The HTML element
	 * @type {HTMLElement}
	 * @readOnly
	 */
	get element(){
		return this._button.element
	}

	/**
	 * remove the element from the container
	 */
	remove(){
		this._button.remove()
	}
}

export function UnmuteButton(...args){
	return new Unmute(...args)
}
