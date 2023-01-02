import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  backgroundColor: '#000',
  parent: 'game',
  title: 'Astro defender',
  url: 'https://andeplane.github.io/astrodefender',
  scale: {
    parent: 'game',
    width: 1024,
    height: 1024,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  }
};
