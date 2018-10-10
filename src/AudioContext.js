import { EventEmitter } from 'events'
import Tone from 'tone/Tone/core/Tone'
import 'tone/Tone/shim/StereoPannerNode'
import 'tone/Tone/core/Context'
import 'tone/Tone/core/Master'

/**
 * Wraps tone and handles mute/unmute and events
 */
export class Context extends EventEmitter {
	constructor(context, mute, tone){

		super()

		if (tone && tone.context !== Tone.context){
			Tone.context = tone.context
		} else if (context && context !== Tone.context){
			Tone.context = context
		}

		/**
		 * Reference to the wrapper context
		 * @type {Tone.Context}
		 */
		this.context = Tone.context

		/**
		 * Reference to the master output.
		 * @type {Tone.Master}
		 */
		if (tone && tone.Master !== Tone.Master){
			this.master = tone.Master
		} else {
			this.master = this.context.master
		}

		//add listeners
		this.context.addEventListener('statechange', e => {
			this.emit('statechange', e)
		})

		//set the initial muted state
		this.master.mute = mute

		let currentmute = this.mute
		//watch for if it's muted itself
		const loop = () => {
			requestAnimationFrame(loop)
			if (this.mute !== currentmute){
				currentmute = this.mute
				this.emit('mute', this.mute)
			}
		}
		loop()
	}

	get state(){
		return this.context.state
	}

	get mute(){
		return this.master.mute || this.state !== 'running'
	}

	set mute(m){
		if (this.state === 'running'){
			this.master.mute = m
		}
	}

	resume(){
		if (Tone.supported && this.state !== 'running'){
			return this.context.resume()
		} else {
			return Promise.resolve()
		}
	}

	//promise which resolved when the context is started
	started(){
		if (this.state === 'running'){
			return Promise.resolve()
		} else {
			return new Promise(done => {
				this.on('statechange', () => {
					if (this.state === 'running'){
						done()
					}
				})
			})
		}
	}

	toggleMute(){
		this.mute = !this.mute
	}
}
