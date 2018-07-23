import { EventEmitter } from 'events'

export class Toggle extends EventEmitter {
	constructor(container){
		super()

		//create the element
		this.element = document.createElement('button')
		this.element.id = 'unmute-button'
		this.element.setAttribute('aria-pressed', false)
		this.element.setAttribute('aria-label', 'mute')

		//add it to the container
		container.appendChild(this.element)

		//forward the events
		this.element.addEventListener('click', e => {
			this.emit('click', e)
		})

		//set it to initially be muted
		this.mute = true
	}

	get mute(){
		return this.element.classList.contains('muted')
	}

	set mute(m){
		this.element.setAttribute('aria-pressed', m)
		if (m){
			this.element.classList.add('muted')
		} else {
			this.element.classList.remove('muted')
		}
	}

	/**
	 * Remove the element from the container
	 */
	remove(){
		this.element.remove()
	}
}
