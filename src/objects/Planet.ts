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
    
    Create(scene: Phaser.Scene, {x, y, name, texture}: CreateProps) {
        const planet = scene.physics.add.image(x, y, texture).setScale(0.25).refreshBody()
        this.planets.push(planet)
        this.group.add(planet)

        planet.setName(name)
        planet.setCircle(256)
        planet.body.setAllowGravity(false)
        planet.setMass(100000)
        planet.setMaxVelocity(0, 0)
        planet.setBounce(1.0)
        planet.disableInteractive()
        planet.setAngularVelocity(0.1 * 720 * (Math.random() - 0.5) )

        return planet
    }

    Destroy() {
        
    }

    Update(delta: number, celestialBodies: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]) {
        this.planets.forEach(planet => {
            planet.setAcceleration(0, 0)
        })
    }
}