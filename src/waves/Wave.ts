import Phaser from 'phaser';
import Asteroid from '../objects/Asteroid';

interface MeteorProps {
    count: number,
    sizeMin: number,
    sizeMax: number
}

interface CometProps {
    count: number,
    sizeMin: number,
    sizeMax: number
}

interface AlienProps {
    count: number,
    hpMin: number,
    hpMax: number
}

interface AsteroidProps {
    count: number,
    sizeMin: number,
    sizeMax: number
}

interface UnitsProps {
    meteors?: MeteorProps,
    asteroids?: AsteroidProps,
    comets?: CometProps,
    aliens?: AlienProps
}

interface WaveProps {
    duration: number
    spawnDuration: number
    group: Phaser.GameObjects.Group
    units: UnitsProps
}


export default class Wave {
    private duration: number
    private spawnDuration: number
    private elapsedTime: number = 0
    private numMeteors: number = 0
    private numAsteroids: number = 0
    private numComets: number = 0
    private numAliens: number = 0
    private units: UnitsProps
    public group: Phaser.GameObjects.Group
    public asteroidFactory: Asteroid|undefined
    constructor(options: WaveProps) {
        this.duration = options.duration
        this.spawnDuration = options.spawnDuration
        this.group = options.group
        this.units = options.units
    }

    update(delta: number, scene: Phaser.Scene, celestialBodies: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]) {
        if (!this.asteroidFactory) {
            this.asteroidFactory = new Asteroid(this.group)
        }
        this.elapsedTime += delta
        this.asteroidFactory.Update(delta, celestialBodies)
        const expectedNumMeteors = Math.ceil((this.units.meteors?.count || 0) / this.spawnDuration * this.elapsedTime)
        
        while (this.numMeteors < expectedNumMeteors) {
            const x = 1000
            const y = 200 + 20 * Math.random()
            this.asteroidFactory.Create(scene, {x, y})
            this.numMeteors += 1
        }
    }

    isFinished() {
        return this.elapsedTime >= this.duration
    }
}