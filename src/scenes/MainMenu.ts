import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
	private selectedButtonIndex = 0

	constructor() {
		super('main-menu')
	}

	init() {
		this.cursors = this.input.keyboard.createCursorKeys()
        this.input.keyboard.addKey('RETURN')
	}

	preload() {
        this.load.setBaseURL(window.location.href)
        this.load.path = 'assets/'
		this.load.image('splash', 'menu/splash.png')
		this.load.image('button', 'menu/MenuButton.png')
    }

    create() {
        const { width, height } = this.scale
		this.add.image(width * 0.5, height * 0.5, 'splash');

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.5, 'button')
            .setDisplaySize(250, 100).setInteractive()
        
        this.add.text(playButton.x, playButton.y, 'Play')
            .setOrigin(0.5).setFontSize(30).setColor('black')

        // Settings button
        const settingsButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'button')
            .setDisplaySize(250, 100)

        this.add.text(settingsButton.x, settingsButton.y, 'Settings')
            .setOrigin(0.5).setFontSize(30).setColor('black')

        // Credits button
        const creditsButton = this.add.image(settingsButton.x, settingsButton.y + settingsButton.displayHeight + 10, 'button')
            .setDisplaySize(250, 100)

        this.add.text(creditsButton.x, creditsButton.y, 'Credits')
            .setOrigin(0.5).setFontSize(30).setColor('black')
        this.buttons.push(playButton)
        this.buttons.push(settingsButton)
        this.buttons.push(creditsButton)
        this.selectButton(0)

        playButton.on('selected', () => {
            this.scene.start('Level1')
        })

        playButton.on('pointerdown', () => {
            this.scene.start('Level1')    
        })
    
        settingsButton.on('selected', () => {
            console.log('settings')
        })
    
        settingsButton.on('pointerdown', () => {
            console.log('settings')
        })

        creditsButton.on('selected', () => {
            console.log('credits')
        })
    
        creditsButton.on('pointerdown', () => {
            console.log('credits')
        })
	}

	selectButton(index: number) {
		const currentButton = this.buttons[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)

        const button = this.buttons[index]

        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)

        // store the new selected index
        this.selectedButtonIndex = index
	}

	selectNextButton(change = 1) {
		let index = this.selectedButtonIndex + change

        // wrap the index to the front or end of array
        if (index >= this.buttons.length)
        {
            index = 0
        }
        else if (index < 0)
        {
            index = this.buttons.length - 1
        }

        this.selectButton(index)
	}

	confirmSelection() {
		// get the currently selected button
        const button = this.buttons[this.selectedButtonIndex]

        // emit the 'selected' event
        button.emit('selected')
	}
	
	update() {
		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
        const returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		const returnJustPressed = Phaser.Input.Keyboard.JustDown(returnKey!)
        
		if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
		else if (spaceJustPressed || returnJustPressed)
		{
			this.confirmSelection()
		}
	}
}