import Phaser from 'phaser';
import AsteroidFactory from '../objects/Asteroid';
import Asteroid from '../objects/Asteroid';
import PlanetFactory from '../objects/Planet'
import TurretFactory from '../objects/Turret'
import Wave from '../waves/Wave';
import Level from './Level';

export default class Level1 extends Level {
  constructor() {
    super('Level1');
  }

  preload() {
    this.load.setBaseURL(window.location.href)
    this.load.path = 'assets/'
    this.load.image('fire', 'particles/muzzleflash3.png');
    this.load.image('stars', 'stars.jpg');
    this.load.image('turret2', 'turrets/turret2.png');
    this.load.image('earth', 'planets/earth_generated.png');
    this.load.spritesheet('asteroids', 'asteroids.png', { frameWidth: 125, frameHeight: 125 });
  }

  create() {
    const { width, height } = this.scale
		const stars = this.add.image(width * 0.5, height * 0.5, 'stars').setScrollFactor(0.2, 0.2)
    
    this.fire = this.add.particles('fire');

    this.registry.set('resources', {
      'energy': 0,
      'metal': 0,
      'minerals': 0,
      'knowledge': 0
    })

    this.planetFactory = new PlanetFactory(this)
    this.asteroidFactory = new AsteroidFactory(this)
    
    const angularVelocity = Math.PI * (Math.random() - 0.5)
    const planet = this.planetFactory.create(this, {angularVelocity, x: 400, y: 512, name: "Planet", texture: "earth"})
    this.turretFactory = new TurretFactory(this, planet)
    const turret = this.turretFactory.create(this, {angle: 0, name: "Turret1", texture: "turret2"})
    
    this.physics.add.collider(planet.sprite, this.asteroidFactory.group, this.collidePlanet);
    this.physics.add.collider(this.asteroidFactory.group, this.asteroidFactory.group);
    
    this.waves.push(new Wave({
      duration: 60000,
      spawnDuration: 20000,
      units: {
        meteors: {
          count: 10,
          sizeMin: 1,
          sizeMax: 2
        }
      }
    })
    )
    this.currentWave = this.waves[0]

    this.input.on("wheel",  (pointer: any, gameObjects: any, deltaX: any, deltaY: any, deltaZ: any) => {
      if (deltaY > 0) {
          const magnitude = Math.abs(deltaY)/10
          var newZoom = this.cameras.main.zoom -.01*magnitude;
          if (newZoom > 1.0) {
              this.cameras.main.zoom = newZoom;     
          }
      }
    
      if (deltaY < 0) {
        const magnitude = Math.abs(deltaY)/10
          var newZoom = this.cameras.main.zoom +.01*magnitude;
          if (newZoom < 2.0) {
              this.cameras.main.zoom = newZoom;     
          }
      }

      // this.cameras.main.centerOn(PlanetFactory?.planets[0].body.position.x, PlanetFactory?.planets[0].body.position.y);
      // this.cameras.main.pan(pointer.worldX, pointer.worldY, 2000, "Power2");
    });
    
    this.input.on('pointermove', (pointer: any) => {
        if (!pointer.isDown) return;

        this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
    });

    var uiScene = this.scene.get('Game-UI')
    this.scene.launch('Game-UI')

    this.cameras.main.setZoom(2)
  }

  update(time: number, delta: number) {
    if (this.gameOver || !this.planetFactory) {
      return;
    }

    if (this.currentWave && this.currentWave.isFinished()) {
      this.waves.splice(0, 1)
      if (this.waves.length > 0) {
        this.currentWave = this.waves[0]
      }
    }
    
    if (this.currentWave) {
      this.currentWave.update(delta, this)
    }

    this.planetFactory!.update(delta, this)
    this.turretFactory!.update(delta, this)
    this.asteroidFactory!.update(delta, this)
  }

  collidePlanet = (planet: Phaser.Types.Physics.Arcade.GameObjectWithBody, asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
    if (!this.fire) {
      return
    }
    
    //@ts-ignore
    asteroid.disableBody(true, true);
    
    this.fire.createEmitter({
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
        x: asteroid.body.position.x,
        y: asteroid.body.position.y,
    });

    if (planet.name === "Planet") {
      //  Add and update the score
      this.population -= 1;
    }
  }
}
