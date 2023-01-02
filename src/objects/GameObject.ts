import Phaser from 'phaser';
import Level from '../scenes/Level';
import { Planet } from './Planet';
import { Asteroid } from './Asteroid';

export default abstract class GameObjectFactory {
    group: Phaser.GameObjects.Group

    constructor(scene: Phaser.Scene) {
        this.group = scene.physics.add.group()
    }
    abstract destroy(): void
    abstract update(delta: number, level: Level): void
}