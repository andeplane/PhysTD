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
    laserBeam?: Phaser.GameObjects.Image
    laserBeamDuration: number = 0
    laserBeamCooldown: number = 0
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
        const turretAngle = Math.atan2(turretDirection.y, turretDirection.x) - Math.PI/2
        
        const asteroids = Array.from(level.asteroidFactory!.asteroids)
        asteroids.filter(a => !a.disabled).forEach(asteroid => {
            const asteroidPosition = new Phaser.Math.Vector2(asteroid.sprite.x, asteroid.sprite.y)
            const distance = asteroidPosition.distance(turretPosition)
            const asteroidDirection = asteroidPosition.clone().subtract(planetPosition).normalize()
            const angle = Math.acos(asteroidDirection.dot(turretDirection))
            
            const withinRange = angle < 0.1 && distance < 150
            
            if (withinRange) {
                if (!this.laserBeam && this.laserBeamCooldown < 0) {
                    // We can now create a new laser beam
                    this.laserBeam = level.add.image(turretPosition.x, turretPosition.y, 'laser').setScale(0.25, 0.25).setRotation(turretAngle).setOrigin(0.5, 0)
                    this.laserBeamDuration = 0
                    this.laserBeamCooldown = 1000
                } 

                if (this.laserBeam) {
                    level.asteroidFactory?.destroy(asteroid)
                    
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
            }
        })

        this.laserBeamDuration += delta.valueOf()
        this.laserBeamCooldown -= delta.valueOf()
        if (this.laserBeam) {
            this.laserBeam.setPosition(turretPosition.x, turretPosition.y)
            this.laserBeam.setRotation(turretAngle)
            if (this.laserBeamDuration > 200) {
                this.laserBeam.destroy(true)
                this.laserBeam = undefined
            }
        }
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