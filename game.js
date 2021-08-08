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
var ledge
const game = new Phaser.Game(config);

function preload(){
  // loaded the background image
  this.load.image("background", "assets/images/background.png");
  //loading the map
  this.load.image("spike","assets/images/spike.png");
  //load player
  this.load.atlas("player","assets/images/kenney_player.png","assets/images/kenney_player_atlas.json");
  this.load.image('ledge', 'assets/images/ledge.png');
  // load tiles
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
  // load map
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
}

function create(){
  const backgroundImage = this.add.image(0,0,"background").setOrigin(0,0);
  backgroundImage.setScale(2.5, 1);
  // create map and ledges
  const map = this.make.tilemap({ key:"map"});
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const platforms = map.createStaticLayer('Platforms', tileset,0,200);
  //addition of ledge
  ledge = this.physics.add.staticGroup();
  ledge.create(800, 180, 'ledge');


}

function update(){

}