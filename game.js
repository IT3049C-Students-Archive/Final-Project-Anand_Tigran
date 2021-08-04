const config ={
  type: Phaser.AUTO,
  parent: 'game',
  width: 1000,
  height:800,
  scale: {
    mode:Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  },
};

const game = new Phaser.game(config);

function preload(){

}

function create(){

}

function update(){

}