import Phaser from 'phaser';
import config from './config';
import Level1 from './scenes/Level1';
import MainMenu from './scenes/MainMenu';

new Phaser.Game(
  Object.assign(config, {
    scene: [MainMenu, Level1]
  })
);
