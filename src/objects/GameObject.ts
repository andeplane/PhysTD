import Phaser from 'phaser';

export default abstract class GameObjectFactory {
    abstract Preload(): void
    abstract Destroy(): void
    abstract Update(delta: number, celestialBodies: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]): void
}