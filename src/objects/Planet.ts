import GameObject from "./GameObject";

interface CreateProps {
    x: number
    y: number
    name: string
    texture: string
}

export default class Planet extends GameObject {
    group: Phaser.GameObjects.Group
    planets: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]

    constructor(scene: Phaser.Scene) {
        super()
        this.group = scene.physics.add.group()
        this.planets = []
    }

    Preload() {

    }
    
    Create(scene: Phaser.Scene, {x, y, name}: CreateProps) {
        const planet = scene.physics.add.image(x, y, 'planet').setScale(0.2).refreshBody()
        planet.setName(name)
        planet.setCircle(250)
        planet.body.setAllowGravity(false)
        planet.setMass(10000)
        planet.setMaxVelocity(0, 0)
        planet.setBounce(1.0)

        this.planets.push(planet)
        this.group.add(planet)
        return planet
    }

    Destroy() {
        
    }

    Update() {

    }
}