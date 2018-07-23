Unmute adds a mute/unmute button to the top right corner of your page. 

This button implements many browsers' requirements that the AudioContext is started by a user action before it can play any sound. If the AudioContext is not running when the page is loaded, the button will initially be muted until a user clicks to unmute the button. 

## INSTALLATION

`npm install unmute`

## USAGE

Currently Tone.js is a dependency. Make sure that Tone.js is installed and loaded on the page. Then the mute button can be added to the page like so:

```javascript
Unmute()
```

### es6

```javascript
import { Unmute } from '@tonejs/mute'
import Tone from 'tone'

//pass in the Tone.js instance
Unmute({ Tone })
```

## API

Unmute takes an optional object as a parameter

```javascript
Unmute({
	//the parent element of the mute button
	container : document.querySelector('#container'),
	//Tone.js instance
	Tone : Tone,
	//the title which appears on the iOS lock screen
	title : 'Web Audio'
})
```

### EVENTS

Unmute returns an event emitting object. 

#### "start"

Emitted when the AudioContext is started for the first time. 

```javascript
Unmute().on('start', () => {
	//AudioContext.state is 'running'
	//add your Web Audio code here
})
```

### "mute"

Emitted when the AudioContext is muted. 

### "unmute"

Emitted when the AudioContext is unmuted. 