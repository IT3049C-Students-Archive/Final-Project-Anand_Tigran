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
var cursors
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

  
  
  
  //creation of player
  this.player = this.physics.add.sprite(50,300,'player');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  // created physics with map objects
  this.physics.add.collider(this.player, platforms);
  this.physics.add.collider(this.player,ledge);
  // animation of the player
  // walking animation
  this.anims.create({
    key:'walk',
    frames: this.anims.generateFramesNames('player',{
      prefix: 'robo_player_',
      start: 2,
      end: 3,
    }),
    frameRate: 15,
    repeat: -1
  });
  // idle animation
  this.anims.create({
    key: 'walk',
    frames: [{key:'player', frame:'robo_player_0'}],
    frameRate: 15,
  });
  //jump animation
  this.anims.create({
    key: 'jump',
    frames: [{ key:'player', frame:'robo_player_1'}],
    frameRate: 15,
  });
// enable cursor key events
cursors = this.input.keyboard.createCursorKeys();


  // set collision
  platforms.setCollisionByExclusion(-1, true);
  this.physics.add.collider(this.player, ledge);
}

function update(){

}