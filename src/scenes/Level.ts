import PlanetFactory from '../objects/Planet'
import TurretFactory from '../objects/Turret'
import Wave from '../waves/Wave';

export default class Level extends Phaser.Scene {
    gameOver: boolean = false
    population: number = 10
    waves: Wave[] = []
    planetFactory?: PlanetFactory
    turretFactory?: TurretFactory
    fire?: Phaser.GameObjects.Particles.ParticleEmitterManager
}