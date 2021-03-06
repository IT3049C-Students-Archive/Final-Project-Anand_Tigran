const config ={
  type: Phaser.AUTO,
  parent: 'game',
  width: 4100,
  height:900,
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
      debug: false
    },
  }
};
var endGameText;
var scoreText;
var score = 0;
var keyA;
var keyD;
var keyW;
const game = new Phaser.Game(config);

function preload(){
  // load of images
  this.load.image('gameTitle', "assets/images/gameTitle.png");
  this.load.image("background", "assets/images/background.png");
  this.load.image("spike","assets/images/spike.png");
  this.load.image("Door","assets/images/Door.png");
  this.load.image("diamond","assets/images/diamond.png");
  this.load.atlas("player","assets/images/kenney_player.png","assets/images/kenney_player_atlas.json");
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
}
function create(){
  
  this.add.image(400, 300, 'gameTitle');
  // added background scene
  const backgroundImage = this.add.image(0,0,"background").setOrigin(0,0);
  backgroundImage.setScale(5, 1);
  // added platform and laoded tileset map
  const map = this.make.tilemap({ key:"map"});
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const platforms = map.createStaticLayer('Platforms', tileset,0,200);
  this.player = this.physics.add.sprite(50,550,'player');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(false);
  this.physics.add.collider(this.player, platforms);
  // animations for player
  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'robo_player_',
      start: 2,
      end: 3,
    }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    frameRate: 15,
  });
  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    frameRate: 15,
  });
  // cursor and key binds created
  this.cursors = this.input.keyboard.createCursorKeys();
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // spikes created and added into map
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  const spikeObjects = map.getObjectLayer('Spikes')['objects'];
  spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width, spike.height - 30).setOffset(0, 30);
  });
  // diamonds created and added into the map
  this.diamond = this.physics.add.group({
    allowGravity: false,
    immovable: false
  });
  const diamondObjects = map.getObjectLayer('Diamonds')['objects'];
  diamondObjects.forEach(diamondObject => {
    const diamond = this.diamond.create(diamondObject.x, diamondObject.y + 150 - diamondObject.height, 'diamond').setOrigin(0, 0);
    diamond.body.setSize(diamond.width - 59, diamond.height - 60).setOffset(28.5, 32);
  });
  // creation of door and added into map
  this.door = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  const doorObjects = map.getObjectLayer('Door')['objects'];
  doorObjects.forEach(doorObject => {
    const door = this.door.create(doorObject.x, doorObject.y + 195 - doorObject.height, 'Door').setOrigin(0, 0);
    door.body.setSize(door.width, door.height).setOffset(0, 0);
  });
  // name of game and score text
  scoreText = this.add.text(565, 20, 'Score: 0', { fontSize: '32px', fill: '#000' });
  gameName = this.add.text(20, 20, 'Diamond Dash', { fontSize: '32px', fill: '#000' });
  platforms.setCollisionByExclusion(-1, true);

  this.physics.add.collider(this.diamond, platforms);
  this.physics.add.collider(this.door, platforms);
  this.physics.add.collider(this.diamond, spikeObjects);
  this.physics.add.overlap(this.player, this.diamond, collectDiamonds, null, this);
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
  this.physics.add.collider(this.player, this.door, goThroughDoor, null, this);
  // camera to follow player
  this.cameras.main.setBounds(0, 0, 4100, 840);
  this.cameras.main.startFollow(this.player);
}
function update() {
  // text to follow camera scrolling
  scoreText.setScrollFactor(0,0);
  gameName.setScrollFactor(0,0);
  // movement input
  if (this.cursors.left.isDown || keyA.isDown ) {
    this.player.setVelocityX(-150);
    if(this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } 
  else if (this.cursors.right.isDown || keyD.isDown ) {
    this.player.setVelocityX(150);
    if(this.player.body.onFloor()) {
      this.player.play('walk', true);
    } 
  }
  else {
    this.player.setVelocityX(0);
    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }
  if ((this.cursors.space.isDown || this.cursors.up.isDown || keyW.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-450);
    this.player.play('jump', true);
  }
  // make character face right direction
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    this.player.setFlipX(true);
  }
  if(this.player.body.y > 800 ){
    revive(this.player);
    let tw = this.tweens.add({
      targets: this.player,
      alpha: 1,
      duration: 100,
      ease: "Linear",
      repeat: 5,
    });
  }
}
// respawn poiint for player
function revive(player){
  player.setVelocity(0,0);
  player.setX(50);
  player.setY(550);
  player.play('idle', true);
  player.setAlpha(0);
}
// when player hit spike 
function playerHit(player, spike){
  // decrease score
  score -= 150;
  scoreText.setText('Score: ' + score);
  revive(player);
  // animation for player respawning
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: "Linear",
    repeat: 5,
  });
}
// when player hits diamonds
function collectDiamonds(player, diamond){
 diamond.disableBody(true, true);
  score += 150;
  scoreText.setText('Score: ' + score);
}
// when player collects all the diamonds and hits door
function goThroughDoor (player, door){
  if(this.diamond.countActive(true) === 0)
  {
    door.disableBody(true, true);
    endGameText = this.add.text(150, 100, 'Thank You for Playing! \n Refresh Page to Play Again!', { fontSize: '32px', fill: '#000' });
    endGameText.setScrollFactor(0,0); 
  }
}






