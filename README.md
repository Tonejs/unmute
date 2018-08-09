[![Build Status](https://travis-ci.org/Tonejs/unmute.svg?branch=master)](https://travis-ci.org/Tonejs/unmute)

Unmute adds a mute/unmute button to the top right corner of your page. 

This button implements many browsers' requirements that the AudioContext is started by a user action before it can play any sound. If the AudioContext is not running when the page is loaded, the button will initially be muted until a user clicks to unmute the button.

## INSTALLATION

`npm install unmute`

## USAGE

The mute button can be added to the page like so:

```javascript
UnmuteButton()
```

### es6

```javascript
import { UnmuteButton } from 'unmute'

UnmuteButton()
```

## API

UnmuteButton takes an optional object as a parameter

```javascript
UnmuteButton({
	//the parent element of the mute button
	container : document.querySelector('#container'),
	//AudioContext
	context : new AudioContext(),
	//the title which appears on the iOS lock screen
	title : 'Web Audio'
})
```

### EVENTS

UnmuteButton returns an event emitting object. 

#### "start"

Emitted when the AudioContext is started for the first time. 

```javascript
UnmuteButton().on('start', () => {
	//AudioContext.state is 'running'
	//add your Web Audio code here
})
```

### "mute"

Emitted when the AudioContext is muted. 

### "unmute"

Emitted when the AudioContext is unmuted. 

## Style

The UnmuteButton's default styling can be overwritten with css. The UnmuteButton is a `<button>` element with id `#unmute-button`. When in a muted state, a class `.muted` is added to the element. 

## iOS

Additionally this button plays a silent sound through an <audio> element when the button is clicked which enables sound on iOS even when the mute rocker switch is toggled on. [[reference](https://stackoverflow.com/questions/21122418/ios-webaudio-only-works-on-headphones/46839941#46839941)]