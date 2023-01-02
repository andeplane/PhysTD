import GameObject from "./GameObject";
import {Planet} from "./Planet";

interface CreateProps {
    x: number
    y: number
    size: number
}

export class Asteroid {
    sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    size: number

    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, {x, y, size}: CreateProps) {
        const scale = 0.1 * size
        this.sprite = scene.physics.add.sprite(x, y, 'asteroids', Math.floor(Math.random() * 16)).setScale(scale)
        group.add(this.sprite)
        
        this.size = size
        this.sprite.setAngularVelocity(720 * (Math.random() - 0.5) )
        this.sprite.setVelocityX(-100 - 20 * Math.random())
        this.sprite.setVelocityY(-20 - 20 * Math.random())
        this.sprite.setMass(0.01)
        this.sprite.setBounce(1.0)
    }
}

export default class AsteroidFactory extends GameObject {
    asteroids: Asteroid[] = []
    
    create(scene: Phaser.Scene, options: CreateProps) {
        const asteroid = new Asteroid(scene, this.group, options)
        this.asteroids.push(asteroid)
        
        return asteroid
    }

    destroy() {
        
    }

    update(delta: number, planets: Planet[], asteroids?: Asteroid[]) {
        planets.forEach(planet => {
            // Calculate asteroid gravity
            this.asteroids.forEach(asteroid => {
                const delta = new Phaser.Math.Vector2(planet.sprite.body.center.x - asteroid.sprite.body.center.x, planet.sprite.body.center.y - asteroid.sprite.body.center.y);
                const deltaLength = delta.length()
                delta.normalize()
                delta.scale(1.0/(deltaLength*deltaLength))
                const strength = 10000000.0
                asteroid.sprite.body.setGravity(strength*delta.x, strength*delta.y)
                let scale = 0.99995
                if (deltaLength < 100) {
                    scale -= 0.001 * (100-deltaLength)/100
                    asteroid.sprite.body.velocity.scale(scale)
                }
            })
        })
    }
}