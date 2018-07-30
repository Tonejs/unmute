const puppeteer = require('puppeteer')
const path = require('path')
const looksSame = require('looks-same')
const { expect } = require('chai')

describe('Unmute', () => {

	const serverPrefix = `file://${path.resolve(__dirname)}`

	async function loadPage(url){
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(`${serverPrefix}/${url}`)
		return { page, browser }
	}

	it('loads on a page', async () => {
		const { browser } = await loadPage('blank.html')
		await browser.close()
	})

	it('adds a button to the page', async () => {
		const { browser, page } = await loadPage('blank.html')
		const hasButton = await page.evaluate(() => {
			const context = new AudioContext()
			UnmuteButton({ context })
			return Boolean(document.querySelector('#unmute-button'))
		})
		expect(hasButton).to.be.true
		await page.screenshot({ path : path.resolve(__dirname, './testCapture.png') })
		const similar = await new Promise((done, error) => {
			looksSame(path.resolve(__dirname, './referenceImage.png'), path.resolve(__dirname, './testCapture.png'), (e, equal) => {
				if (e){
					error(e)
				} else {
					done(equal)
				}
			})
		})
		expect(similar).to.be.true
		
		await browser.close()
	})

	it('can specify the container', async () => {
		const { browser, page } = await loadPage('blank.html')
		const correctParent = await page.evaluate(() => {
			const context = new AudioContext()
			const container = document.createElement('div')
			document.body.appendChild(container)
			UnmuteButton({ context, container })
			return Boolean(document.querySelector('#unmute-button').parentNode === container)
		})
		expect(correctParent).to.be.true
		await browser.close()
	})

	it('should initially be muted', async () => {
		/*const browser = await puppeteer.launch({ 
			args : ['--disable-features=MediaEngagementBypassAutoplayPolicies', '--user-gesture-required'],
		})*/
		const { browser, page } = await loadPage('blank.html')
		const context = await page.evaluate(async () => {
			const context = new AudioContext()
			await context.suspend()
			const unmute = UnmuteButton({ context })
			const className = unmute.element.classList[0]
			return { state : context.state, mute : unmute.mute, className }
		})
		expect(context.state).to.equal('suspended')
		expect(context.className).to.equal('muted')
		expect(context.mute).to.be.true
		await browser.close()
	})

	it('unmutes when clicked on', async () => {
		const { browser, page } = await loadPage('blank.html')
		//before being clicked
		const context = await page.evaluate(async () => {
			const context = new AudioContext()
			await context.suspend()
			window.unmute = UnmuteButton({ context })
			return { state : context.state, mute : unmute.mute }
		})
		expect(context.state).to.equal('suspended')
		expect(context.mute).to.be.true

		//click and wait a split second
		await page.click('#unmute-button')
		await page.waitFor(100)

		//check context and state again
		const afterClick = await page.evaluate(() => {
			return { state : unmute.context.state, mute : unmute.mute }
		})
		expect(afterClick.mute).to.be.false
		expect(afterClick.state).to.equal('running')
		await browser.close()
	})

	it('mutes if clicked on again', async () => {
		const { browser, page } = await loadPage('blank.html')
		await page.evaluate(async () => {
			const context = new AudioContext()
			await context.suspend()
			window.unmute = UnmuteButton({ context })
		})

		//unmute
		await page.click('#unmute-button')
		await page.waitFor(100)
		//remute it
		await page.click('#unmute-button')
		await page.waitFor(100)

		//check context and state again
		const afterClick = await page.evaluate(() => {
			return { state : unmute.context.state, mute : unmute.mute }
		})
		expect(afterClick.mute).to.be.true
		expect(afterClick.state).to.equal('running')
		await browser.close()
	})

	it('can remove the element', async () => {
		const { browser, page } = await loadPage('blank.html')
		//before being clicked
		const button = await page.evaluate(async () => {
			const context = new AudioContext()
			await context.suspend()
			const unmute = UnmuteButton({ context })
			unmute.remove()
			return Boolean(document.querySelector('#unmute-button'))
		})
		expect(button).to.be.false
		await browser.close()
	})

	it('can be created with no args if tone is on the page', async () => {
		const { browser, page } = await loadPage('tone.html')
		await page.evaluate(() => {
			const unmute = UnmuteButton()
		})
		await browser.close()
	})

	it('can mute it from Tone.js or by clicking', async () => {
		const { browser, page } = await loadPage('tone.html')
		const beforeClicked = await page.evaluate(async () => {
			window.unmute = UnmuteButton()
			Tone.Master.mute = true
			await wait(100)
			return unmute.mute
		})

		expect(beforeClicked).to.be.true

		//click it
		await page.click('#unmute-button')
		await page.waitFor(100)

		//should be in the opposite state now
		const afterClicked = await page.evaluate(() => {
			return unmute.mute
		})
		expect(afterClicked).to.be.false

		await browser.close()
	})

	it('invokes start, mute, unmute events', async () => {
		const { browser, page } = await loadPage('events.html')

		//click it
		await page.click('#unmute-button')
		await page.waitFor(100)

		//click it again
		await page.click('#unmute-button')
		await page.waitFor(100)
		
		const { started, muted, unmuted } = await page.evaluate(() => events)
		expect(started).to.be.true
		expect(muted).to.be.true
		expect(unmuted).to.be.true

		await browser.close()
	})
})
