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
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
    },
  }
};

const game = new Phaser.Game(config);

function preload(){
  // loaded the background image
  this.load.image("background", "assets/background.png");
}

function create(){
  const backgroundImage = this.add.image(0,0,"background").setOrigin(0,0);
  backgroundImage.setScale(2.5, 1);
}

function update(){

}