import Phaser from 'phaser';

export default abstract class GameObjectFactory {
    abstract Preload(): void
    abstract Destroy(): void
    abstract Update(): void
}