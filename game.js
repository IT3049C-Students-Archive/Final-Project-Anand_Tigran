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
      debug: true
    },
  }
};
var scoreText;
var score = 0;
var stars;
var keyA;
var keyD;
var keyW;
const game = new Phaser.Game(config);

function preload(){
  // loaded the background image
  this.load.image("background", "assets/images/background.png");
  //load star
  this.load.image("star","assets/images/star.png");
  //loading the map
  this.load.image("spike","assets/images/spike.png");
  this.load.image("Door","assets/images/Door.png");
  this.load.image("diamond","assets/images/diamond.png");
  
  //load player
  this.load.atlas("player","assets/images/kenney_player.png","assets/images/kenney_player_atlas.json");
  // load tiles
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
  // load map
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
}

function create(){
  const backgroundImage = this.add.image(0,0,"background").setOrigin(0,0);
  backgroundImage.setScale(5, 1);
  // create map and ledges
  const map = this.make.tilemap({ key:"map"});
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const platforms = map.createStaticLayer('Platforms', tileset,0,200);
  
  //creation of player
  
  this.player = this.physics.add.sprite(50,550,'player');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(false);
// this.player.setCollideWorldBounds(false); 
  // created physics with map objects
  this.physics.add.collider(this.player, platforms);
  // animation of the player
  // walking animation
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
  // idle animation
  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    frameRate: 15,
  });
  //jump animation
  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    frameRate: 15,
  });
  // enable cursor key events
  this.cursors = this.input.keyboard.createCursorKeys();
  // WASD Movement
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  // addition of spikes
  // set properties of the spikes
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  // spike objects
  const spikeObjects = map.getObjectLayer('Spikes')['objects'];

  // add to map
  spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width, spike.height - 30).setOffset(0, 30);
  });
  this.diamond = this.physics.add.group({
    allowGravity: false,
    immovable: false
  });
  const diamondObjects = map.getObjectLayer('Diamonds')['objects'];
  diamondObjects.forEach(diamondObject => {
    const diamond = this.diamond.create(diamondObject.x, diamondObject.y + 150 - diamondObject.height, 'diamond').setOrigin(0, 0);
    diamond.body.setSize(diamond.width - 59, diamond.height - 60).setOffset(28.5, 32);
  });
  this.door = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  const doorObjects = map.getObjectLayer('Door')['objects'];
  doorObjects.forEach(doorObject => {
    const door = this.door.create(doorObject.x, doorObject.y + 260 - doorObject.height, 'Door').setOrigin(0, 0);
    door.body.setSize(door.width, door.height).setOffset(0, 0);
  });
  // score count
  scoreText = this.add.text(50, 50, 'score: 0', { fontSize: '32px', fill: '#000' });


  // set collision
  platforms.setCollisionByExclusion(-1, true);
  
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
  this.physics.add.collider(this.diamond, platforms);
  this.physics.add.collider(this.diamond, spikeObjects);
  this.physics.add.overlap(this.player, this.diamond, collectDiamonds, null, this);
  // check to see if player overlaps with star
  this.cameras.main.setBounds(0, 0, 4100, 840);
  this.cameras.main.startFollow(this.player);
}
function update() {
  //scoreText.x = this.player.body.position.x; 
  //scoreText.y = this.player.body.position.y - 150;
  // fixes score to camera
  scoreText.setScrollFactor(0,0);
  // left or right key control
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
    // idle animation
    this.player.setVelocityX(0);
    // only when on ledge or platform
    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }
  // Player jump ip when spacebar or up arrow is clicked
  if ((this.cursors.space.isDown || this.cursors.up.isDown || keyW.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-450);
    this.player.play('jump', true);
  }

  // If the player is moving to the right, keep them facing forward
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    // otherwise, make them face the other side
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
function revive(player){
  player.setVelocity(0,0);
  player.setX(50);
  player.setY(550);
  player.play('idle', true);
  player.setAlpha(0);
}
function playerHit(player, spike, spinner){
  score -= 150;
  scoreText.setText('Score: ' + score);
  revive(player);
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: "Linear",
    repeat: 5,
  });
}
function collectDiamonds(player, diamond){
 diamond.disableBody(true, true);
  score += 150;
  scoreText.setText('Score: ' + score);
}





