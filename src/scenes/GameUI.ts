import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene {
    populationText?: Phaser.GameObjects.Text
	constructor() {
		super({ key: 'Game-UI', active: false });
	}
    
	init() {
        
    }
    
	preload() {
        
    }
    
    create() {
        this.populationText = this.add.text(16, 16, `Population: 10`, { fontSize: '32px' })
	}

	update() {
		console.log("Updating UI scene")
	}
}