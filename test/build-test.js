import UnmuteButton from '../'
import Tone, { Synth, Transport } from 'tone'

const unmute = UnmuteButton().on('start', () => {
	const synth = new Synth().toMaster()

	Transport.scheduleRepeat(time => {
		synth.triggerAttackRelease('C4', '8n', time)
	}, 0.5)

	Transport.start()
})

window.SAME_CONTEXT = Tone.context === unmute.context
