import Phaser from 'phaser';

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type GameObject = Phaser.GameObjects.GameObject

export default class Demo extends Phaser.Scene {
  gameOver: boolean
  score: number
  asteroids: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]
  asteroidsGroup?: Phaser.Physics.Arcade.Group
  scoreText?: Phaser.GameObjects.Text
  planet?: Phaser.Types.Physics.Arcade.ImageWithStaticBody
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  lastUpdate: Date

  constructor() {
    super('GameScene');
    this.gameOver = false
    this.score = 0
    this.asteroids = []
    this.lastUpdate = new Date()
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('planet', 'assets/planet.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('asteroids', 'assets/asteroids.png', { frameWidth: 125, frameHeight: 125 });
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    
    //  The score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px' });
    
    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // const planet = platforms.create(400, 400, 'planet').setScale(0.3).refreshBody();
    this.planet = this.physics.add.staticImage(400, 400, 'planet').setScale(0.1).refreshBody()
    this.planet.setCircle(250*0.1)
    
    // const N = 100
    // for (let i = 0; i < N; i++) {
    //   const radius = 200 + Math.random() * 200
    //   const theta = Math.random() * 2 * Math.PI
    //   const x = 400 + Math.sin(theta)*radius
    //   const y = 400 + Math.cos(theta)*radius
    //   const asteroid = this.physics.add.sprite(x, y, 'asteroids', Math.floor(Math.random() * 16)).setScale(0.1)
    //   this.asteroids.push(asteroid)
    // }

    this.asteroidsGroup = this.physics.add.group()
    this.physics.add.collider(this.planet, this.asteroidsGroup);
    // // this.physics.add.collider(asteroidsGroup, asteroidsGroup);
    // this.asteroids.forEach(asteroid => {
    //   asteroid.setVelocityX(200 * (Math.random() - 0.5))
    //   asteroid.setVelocityY(200 * (Math.random() - 0.5))
    //   asteroid.setBounce(1.0)
    // })

    // this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
  }

  update() {
    if (this.gameOver || !this.cursors || !this.planet)
    {
        return;
    }

    const now = (new Date())
    const delta = now.valueOf() - this.lastUpdate.valueOf()
    if (delta > 500) {
      this.lastUpdate = now
      const x = 1000
      const y = 200
      const asteroid = this.physics.add.sprite(x, y, 'asteroids', Math.floor(Math.random() * 16)).setScale(0.1)
      this.asteroids.push(asteroid)
      this.asteroidsGroup?.add(asteroid)
      asteroid.setVelocityX(-100)
      asteroid.setVelocityY(-20)
    }
    
    // Calculate gravity as the normalised vector from the ship to the planet
    this.asteroids.forEach(asteroid => {
      if (!this.planet) {
        return
      }
      const delta = new Phaser.Math.Vector2(this.planet.body.center.x - asteroid.body.center.x, this.planet.body.center.y - asteroid.body.center.y);
      const deltaLength = delta.lengthSq()
      delta.normalize()
      delta.divide(new Phaser.Math.Vector2(deltaLength,deltaLength))
      const strength = 10000000.0
      asteroid.body.setGravity(strength*delta.x, strength*delta.y)
    })
  }

  collectStar(player: GameObjectWithBody, star: GameObjectWithBody) {
    if (!this.scoreText) {
      return
    }

    //@ts-ignore
    star.disableBody(true, true);

    //  Add and update the score
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }
}
