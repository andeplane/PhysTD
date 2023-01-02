import Phaser from 'phaser';
import { Planet } from './Planet';
import { Asteroid } from './Asteroid';

export default abstract class GameObjectFactory {
    group: Phaser.GameObjects.Group

    constructor(scene: Phaser.Scene) {
        this.group = scene.physics.add.group()
    }
    abstract destroy(): void
    abstract update(delta: number, planets: Planet[], asteroids?: Asteroid[]): void
}