import Phaser from 'phaser';

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type GameObject = Phaser.GameObjects.GameObject

export default class Demo extends Phaser.Scene {
  gameOver: boolean
  population: number
  asteroids: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]
  asteroidsGroup?: Phaser.Physics.Arcade.Group
  populationText?: Phaser.GameObjects.Text
  planet?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  moon?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  fire?: Phaser.GameObjects.Particles.ParticleEmitterManager
  lastAddUpdate: Date
  lastFireUpdate: Date

  constructor() {
    super('GameScene');
    this.gameOver = false
    this.population = 10
    this.asteroids = []
    //@ts-ignore
    window.asteroids = this.asteroids
    this.lastAddUpdate = new Date()
    this.lastFireUpdate = new Date()
  }

  preload() {
    this.load.image('fire', 'assets/particles/muzzleflash3.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('planet', 'assets/planet.png');
    this.load.spritesheet('asteroids', 'assets/asteroids.png', { frameWidth: 125, frameHeight: 125 });
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    this.fire = this.add.particles('fire');

    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.populationText = this.add.text(16, 16, `Population: ${this.population}`, { fontSize: '32px' });
    
    this.planet = this.physics.add.image(400, 400, 'planet').setScale(0.2).refreshBody()
    this.planet.setName("Planet")
    this.planet.setCircle(250)
    this.planet.body.setAllowGravity(false)
    this.planet.setMass(10000)
    this.planet.setMaxVelocity(0, 0)
    this.planet.setBounce(1.0)
    this.asteroidsGroup = this.physics.add.group()
    this.physics.add.collider(this.planet, this.asteroidsGroup, this.collidePlanet);
    
    this.moon = this.physics.add.image(600, 400, 'planet').setScale(0.05).refreshBody()
    this.moon.setName("Moon")
    this.moon.setCircle(250)
    this.moon.setVelocityY(-200)
    this.moon.setMass(10000)
    this.moon.setBounce(1.0)
    this.physics.add.collider(this.moon, this.asteroidsGroup, this.collidePlanet);
    
    var FKey = this.input.keyboard.addKey('F');

    FKey.on('down', () =>  {
        if (this.scale.isFullscreen)
        {
            this.scale.stopFullscreen();
        }
        else
        {
            this.scale.startFullscreen();
        }
    });
  }

  update() {
    if (this.gameOver || !this.cursors || !this.planet || !this.moon)
    {
        return;
    }

    // Add asteroids
    const now = (new Date())
    const delta = now.valueOf() - this.lastAddUpdate.valueOf()
    if (delta > 500 && this.asteroids.length < 100) {
      this.lastAddUpdate = now
      const x = 1000
      const y = 200 + 20 * Math.random()
      const asteroid = this.physics.add.sprite(x, y, 'asteroids', Math.floor(Math.random() * 16)).setScale(0.1)
      this.asteroids.push(asteroid)
      this.asteroidsGroup?.add(asteroid)
      asteroid.setAngularVelocity(720 * (Math.random() - 0.5) )
      asteroid.setVelocityX(-100 - 20 * Math.random())
      asteroid.setVelocityY(-20 - 20 * Math.random())
      asteroid.setMass(0.1)
      asteroid.setBounce(1.0)
    }
    
    // Calculate asteroid gravity
    this.asteroids.forEach(asteroid => {
      if (!this.planet) {
        return
      }
      const delta = new Phaser.Math.Vector2(this.planet.body.center.x - asteroid.body.center.x, this.planet.body.center.y - asteroid.body.center.y);
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

    {
      const delta = new Phaser.Math.Vector2(this.planet.body.center.x - this.moon.body.center.x, this.planet.body.center.y - this.moon.body.center.y);
      const deltaLength = delta.length()
      delta.normalize()
      delta.scale(1.0/(deltaLength*deltaLength))
      const strength = 10000000.0
      this.moon.body.setGravity(strength*delta.x, strength*delta.y)
    }

    // Fire defense
    let closestAsteroid = undefined
    let distanceSquared = 1e9
    this.asteroids.forEach(asteroid => {
      if (!this.planet) {
        return
      }
      const delta = new Phaser.Math.Vector2(this.planet.body.center.x - asteroid.body.center.x, this.planet.body.center.y - asteroid.body.center.y);
      if (delta.lengthSq() < distanceSquared) {
        closestAsteroid = asteroid
        distanceSquared = delta.lengthSq()
      }
    })

  }

  collidePlanet = (planet: GameObjectWithBody, asteroid: GameObjectWithBody) => {
    if (!this.populationText || !this.fire) {
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
      this.populationText.setText('Population: ' + this.population);
    }
  }
}
