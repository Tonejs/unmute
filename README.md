[![Build Status](https://travis-ci.org/Tonejs/unmute.svg?branch=master)](https://travis-ci.org/Tonejs/unmute)

Unmute adds a mute/unmute button to the top right corner of your page. 

This button implements many browsers' requirements that the AudioContext is started by a user action before it can play any sound. If the AudioContext is not running when the page is loaded, the button will initially be muted until a user clicks to unmute the button.

[example](https://tonejs.github.io/unmute/examples/basic.html)

## INSTALLATION

`npm install unmute`

## USAGE

The mute button can be added to the page like so:

```javascript
UnmuteButton()
```

### es6

```javascript
import UnmuteButton from 'unmute'

UnmuteButton()
```

### HTML

If your code uses Tone.js, you can simply add the following code to your `<head>` and it'll add an UnmuteButton to the page and bind itself to Tone.js' AudioContext. Tone.js must be included on the page. 

```html
<script src="https://unpkg.com/unmute" data-add-button="true"></script>
```

## API


### Parameter

UnmuteButton takes an optional object as a parameter.

```javascript
UnmuteButton({
	//the parent element of the mute button
	//can pass in "none" to create the element, but not add it to the DOM
	container : document.querySelector('#container'),
	//the title which appears on the iOS lock screen
	title : 'Web Audio',
	//force it to start muted, even when the AudioContext is running
	mute : false
	//AudioContext
	context : new AudioContext(),
})
```
#### `container`

The HTMLElement which the button will be added to

#### `title`

UnmuteButton also unmutes the browser tab on iOS even when the mute toggle rocker switch is toggled on. This causes a title to appear on the phone's lock screen. The default title says "Web Audio"

#### `mute`

This will force the initial state of the button to be muted. Though, you _cannot_ force it to be 'unmuted' by passing in `{'mute' : false}` because the default state of the button is also determined by the state of the AudioContext. 

#### `context`

If a context is passed in, it will be wrapped and available as a property of the returned object. If no context was passed in, one will be created. You can access the created context as a property.

```javascript
const { context } = UnmuteButton()
```

### Events

UnmuteButton returns an event emitting object. 

#### 'start'

Emitted when the AudioContext is started for the first time. 

```javascript
UnmuteButton().on('start', () => {
	//AudioContext.state is 'running'
})
```

#### 'mute'

Emitted when the AudioContext is muted. 

#### 'unmute'

Emitted when the AudioContext is unmuted. 

## Methods

### `remove()`

Removes the button element from its container

```javascript
const unmute = UnmuteButton()
//remove the element
unmute.remove()
```

## Style

The UnmuteButton's default styling can be overwritten with css. The UnmuteButton is a `<button>` element with id `#unmute-button`. When in a muted state, a class `.muted` is added to the element. 

## iOS

Additionally this button plays a silent sound through an `<audio>` element when the button is clicked which enables sound on iOS even when the mute rocker switch is toggled on. [[reference](https://stackoverflow.com/questions/21122418/ios-webaudio-only-works-on-headphones/46839941#46839941)]

## Earlier versions of Tone.js (before tone@13.2.3)

If using an older version of Tone with a global reference to Tone.js, it should work as with the above examples. The one exception is if you're using it with a build system which does not create a reference to `Tone` on the window. 

This has been tested with Tone.js (>=tone@0.7.0)

```javascript
import Tone from 'tone'

UnmuteButton({ tone : Tone })
```

## Without Tone.js

To use it without Tone.js, check out [this example](examples/context.html). Be sure to use the wrapped and shimmed AudioContext instance which is a property of the UnmuteButton instance. Automatically adding the button to the body (using `data-add-button="true"`) will not work. 