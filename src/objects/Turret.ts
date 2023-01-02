import GameObject from "./GameObject";
import {Asteroid} from "./Asteroid";
import {Planet} from './Planet'
import Level from "../scenes/Level";

interface CreateProps {
    angle: number
    name: string
    texture: string
}

export class Turret {
    sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    planet: Planet
    
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, planet: Planet, {name, texture, angle}: CreateProps) {
        this.planet = planet

        const scale = 0.1
        this.sprite = scene.physics.add.image(0, 0, texture).setScale(scale, scale).setRotation(Math.PI/2)
        group.add(this.sprite)
        
        const x = planet.sprite.x + planet.radius * Math.cos(angle) + 0.9 * scale * this.sprite.height/2
        const y = planet.sprite.y + planet.radius * Math.sin(angle)
        
        this.sprite.setPosition(x,y)
        this.sprite.setName(name)
        this.sprite.body.setAllowGravity(false)
        this.sprite.disableInteractive()
    }

    update(delta: number, level: Level) {
        const planetPosition = new Phaser.Math.Vector2(this.planet.sprite.x,this.planet.sprite.y)
        const turretPosition = new Phaser.Math.Vector2(this.sprite.x,this.sprite.y)
        const turretDirection = turretPosition.clone().subtract(planetPosition).normalize()

        level.asteroidFactory?.asteroids.forEach(asteroid => {
            const asteroidPosition = new Phaser.Math.Vector2(asteroid.sprite.x, asteroid.sprite.y)
            const distance = asteroidPosition.distance(turretPosition)
            const asteroidDirection = asteroidPosition.clone().subtract(planetPosition).normalize()
            const angle = Math.acos(asteroidDirection.dot(turretDirection))
            if (angle < 0.1) {
                asteroid.sprite.disableBody(true, true);
    
                level.fire!.createEmitter({
                    alpha: { start: 1, end: 0 },
                    scale: { start: 0.5, end: 2.5 },
                    tint: { start: 0xff945e, end: 0xff945e },
                    speed: 20,
                    accelerationY: -300,
                    angle: { min: -85, max: -95 },
                    rotate: { min: -180, max: 180 },
                    lifespan: { min: 1000, max: 1100 },
                    blendMode: 'ADD',
                    frequency: 110,
                    maxParticles: 10,
                    x: asteroidPosition.x,
                    y: asteroidPosition.y
                });
            }
        })
    }
}

export default class TurretFactory extends GameObject {
    turrets: Turret[] = []
    planet: Planet
    
    constructor(scene: Phaser.Scene, planet: Planet) {
        super(scene)
        this.planet = planet
    }

    create(scene: Phaser.Scene, options: CreateProps) {
        const turret = new Turret(scene, this.group, this.planet, options)
        this.turrets.push(turret)

        return turret
    }

    destroy() {
        
    }

    update(delta: number, level: Level) {
        // Rotate turret both around planet and itself
        const planetPosition = {
            x: this.planet.sprite.x,
            y: this.planet.sprite.y
          }

        this.group.rotateAround(planetPosition, this.planet.angularVelocity*delta/1000)
        this.turrets.forEach(turret => {
            turret.sprite.setRotation(turret.sprite.rotation + this.planet.angularVelocity*delta/1000)
            turret.update(delta, level)
        })
    }
}