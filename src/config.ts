import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  backgroundColor: '#33A5E7',
  title: 'Astro defender',
  url: 'https://andeplane.github.io/astrodefender',
  scale: {
    width: 800,
    height: 800,
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
