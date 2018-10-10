import { Toggle } from './Toggle'
import { Context } from './AudioContext'
import { EventEmitter } from 'events'
import { AudioElement } from './AudioElement'
import { addButton } from './ScriptElement'
import './unmute.scss'

/**
 * @returns EventEmitter
 */
class Unmute extends EventEmitter {
	constructor({ container=document.body, tone=window.Tone, context=(tone ? tone.context : null), title='Web Audio', mute=false } = {}){
		super()

		/**
		 * The HTML element
		 * @type {Toggle}
		 */
		this._button = new Toggle(container)

		/**
		 * Controls the AudioContext
		 * @type {Context}
		 */
		this._context = new Context(context, mute, tone)

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
				this.start()
				this.emit('click')
			} else {
				this._context.toggleMute()
			}
		})

		//listen for started change
		this._context.started().then(() => {
			this.emit('start')
		})
		
		//start out in the contexts current state
		this._button.mute = this._context.mute
	}

	/**
	 * the mute state of the button
	 * @type {Boolean}
	 */
	get mute(){
		return this._context.mute
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
	 * The AudioContext reference
	 * @type {Tone.Context}
	 * @readOnly
	 */
	get context(){
		return this._context.context
	}

	/**
	 * remove the element from the container
	 */
	remove(){
		this._button.remove()
	}

	/**
	 * Click on the element. Must come from a trusted MouseEvent to actually unmute the context
	 */
	click(){
		this._button.click()
	}

	/**
	 * Start the AudioContext. Must come from a trusted MouseEvent or keyboard event to actually unmute the context.
	 */
	start(){
		if (this._context.state !== 'running'){
			this._context.resume()
			this._audioElement.click()
		}
	}
}

export function UnmuteButton(...args){
	return new Unmute(...args)
}

//maybe the button automatically
addButton(UnmuteButton)
