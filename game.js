const config ={
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height:640,
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
var ledge;
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
  ledge.create(815, 195, 'ledge');
  
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

  // add stars to map
  stars = this.physics.add.group({
    key: 'star',
    repeat: 8,
    setXY: { x: 50, y: 0, stepX: 100 }
  });
  // give them a bounce
  stars.children.iterate(function (child) {
  //  Give each star a slightly different bounce
  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

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

  // score count
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  // set collision
  platforms.setCollisionByExclusion(-1, true);
  this.physics.add.collider(this.player, ledge);
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(stars, ledge);
  this.physics.add.collider(stars, spikeObjects);
  // check to see if player overlaps with star
  this.physics.add.overlap(this.player, stars, collectStar, null, this);
  this.cameras.main.setBounds(0, 0, 1200, 600);
  this.cameras.main.startFollow(this.player);
}

function update() {
  // left or right key control
  if (this.cursors.left.isDown || keyA.isDown ) {
    this.player.setVelocityX(-200);
    if(this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } 
  else if (this.cursors.right.isDown || keyD.isDown ) {
    this.player.setVelocityX(200);
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
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }

  // If the player is moving to the right, keep them facing forward
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
    // otherwise, make them face the other side
    this.player.setFlipX(true);
  }
}
function playerHit(player, spike){
  player.setVelocity(0,0);
  player.setX(50);
  player.setY(300);
  player.play('idle', true);
  player.setAlpha(0);
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: "Linear",
    repeat: 5,
  });
} 
function collectStar(player, star){
  star.disableBody(true, true);
  //  Add and update the score
  score += 25;
  scoreText.setText('Score: ' + score);

  // redrop the stars
  if (stars.countActive(true) === 0)
    {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }


}
