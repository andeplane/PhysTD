import GameObject from "./GameObject";
import Planet from "./Planet";

interface CreateProps {
    x: number
    y: number
}

export default class Asteroid extends GameObject {
    asteroids: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]
    group: Phaser.GameObjects.Group
    
    constructor(group: Phaser.GameObjects.Group) {
        super()
        this.group = group
        this.asteroids = []
    }

    Preload() {

    }
    
    Create(scene: Phaser.Scene, {x, y}: CreateProps) {
        const asteroid = scene.physics.add.sprite(x, y, 'asteroids', Math.floor(Math.random() * 16)).setScale(0.1)
        this.group.add(asteroid)
        this.asteroids.push(asteroid)
        
        asteroid.setAngularVelocity(720 * (Math.random() - 0.5) )
        asteroid.setVelocityX(-100 - 20 * Math.random())
        asteroid.setVelocityY(-20 - 20 * Math.random())
        asteroid.setMass(0.01)
        asteroid.setBounce(1.0)
        
        return asteroid
    }

    Destroy() {
        
    }

    Update(delta: number, celestialBodies: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]) {
        const planet = celestialBodies[0]
        
        // Calculate asteroid gravity
        this.asteroids.forEach(asteroid => {
            const delta = new Phaser.Math.Vector2(planet.body.center.x - asteroid.body.center.x, planet.body.center.y - asteroid.body.center.y);
            const deltaLength = delta.length()
            delta.normalize()
            delta.scale(1.0/(deltaLength*deltaLength))
            const strength = 10000000.0
            asteroid.body.setGravity(strength*delta.x, strength*delta.y)
            let scale = 0.99995
            if (deltaLength < 100) {
                scale -= 0.001 * (100-deltaLength)/100
                asteroid.body.velocity.scale(scale)
            }
        })
    }
}