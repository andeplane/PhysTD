import GameObject from "./GameObject";

interface CreateProps {
    angularVelocity: number
    x: number
    y: number
    name: string
    texture: string
}

export class Planet {
    angularVelocity: number
    sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    radius: number
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, {x, y, name, texture, angularVelocity}: CreateProps) {
        const radius = 256
        const scale = 0.25
        this.sprite = scene.physics.add.image(x, y, texture).setScale(scale).refreshBody()
        group.add(this.sprite)
        this.sprite.setName(name)
        this.sprite.setCircle(radius)
        this.radius = radius * scale
        this.sprite.body.setAllowGravity(false)
        this.sprite.setMass(100000)
        this.sprite.setMaxVelocity(0, 0)
        this.sprite.setBounce(1.0)
        this.sprite.disableInteractive()
        this.angularVelocity = angularVelocity
        // this.sprite.setAngularVelocity(angularVelocity)
    }
}

export default class PlanetFactory extends GameObject {
    planets: Planet[] = []
    
    create(scene: Phaser.Scene, options: CreateProps) {
        const planet = new Planet(scene, this.group, options)
        
        this.planets.push(planet)
        
        return planet
    }

    destroy() {
        
    }

    update(delta: number, celestialBodies: Planet[]) {
        this.planets.forEach(planet => {
            planet.sprite.setAcceleration(0, 0)
            planet.sprite.setRotation(planet.sprite.rotation + planet.angularVelocity * delta / 1000)
        })
    }
}