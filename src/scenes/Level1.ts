import Phaser from 'phaser';
import Asteroid from '../objects/Asteroid';
import Planet from '../objects/Planet'

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type GameObject = Phaser.GameObjects.GameObject

let PlanetFactory: Planet|undefined
let AsteroidFactory: Asteroid|undefined

export default class Level1 extends Phaser.Scene {
  gameOver: boolean
  population: number
  // populationText?: Phaser.GameObjects.Text
  moon?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  fire?: Phaser.GameObjects.Particles.ParticleEmitterManager
  lastAddUpdate: Date
  lastFireUpdate: Date

  constructor() {
    super({ key: 'Level1', active: false });

    this.gameOver = false
    this.population = 10
    
    this.lastAddUpdate = new Date()
    this.lastFireUpdate = new Date()
  }

  preload() {
    this.load.setBaseURL(window.location.href)
    this.load.path = 'assets/'
    this.load.image('fire', 'particles/muzzleflash3.png');
    this.load.image('stars', 'stars.jpg');
    this.load.image('earth', 'planets/earth_generated.png');
    this.load.spritesheet('asteroids', 'asteroids.png', { frameWidth: 125, frameHeight: 125 });
  }

  create() {
    const { width, height } = this.scale
		this.add.image(width * 0.5, height * 0.5, 'stars').setScrollFactor(0.2, 0.2)
    this.fire = this.add.particles('fire');

    this.cursors = this.input.keyboard.createCursorKeys();
    
    // this.populationText = this.add.text(16, 16, `Population: ${this.population}`, { fontSize: '32px' })
    
    PlanetFactory = new Planet(this)
    AsteroidFactory = new Asteroid(this, PlanetFactory)

    const planet = PlanetFactory.Create(this, {x: 400, y: 512, name: "Planet", texture: "earth"})
    this.physics.add.collider(planet, AsteroidFactory.group, this.collidePlanet);
    this.physics.add.collider(AsteroidFactory.group, AsteroidFactory.group);

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

  update() {
    
    if (this.gameOver || !this.cursors)
    {
      return;
    }

    if (AsteroidFactory) {
      // Add asteroids
      const now = (new Date())
      const delta = now.valueOf() - this.lastAddUpdate.valueOf()
      if (delta > 500 && AsteroidFactory.asteroids.length < 100) {
        this.lastAddUpdate = now
        const x = 1000
        const y = 200 + 20 * Math.random()
        AsteroidFactory.Create(this, {x, y})
      }
      AsteroidFactory.Update()
    }
    if (PlanetFactory) {
      PlanetFactory.Update()
    }
  }

  collidePlanet = (planet: GameObjectWithBody, asteroid: GameObjectWithBody) => {
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
      // this.populationText.setText('Population: ' + this.population);
    }
  }
}
