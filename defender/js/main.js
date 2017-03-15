"use strict";
var displayT;
function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'baby', 'assets/baby.png' );
        game.load.image( 'shield', 'assets/shield.png' );
        game.load.image('player','assets/protector.png');
        game.load.image('bad','assets/port.png');
        game.load.image('shot','assets/shot.png');
    }
    var shield;
    var baby;
    var cursors;
    var player;
    var check;
    var enemies;
    var shots;
    var time;
    function create() {
    	displayT=0;
    	check=0;
    	enemies=game.add.group();
    	shots=game.add.group();
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.stage.backgroundColor = "#FFFFFF"
    	cursors = game.input.keyboard.createCursorKeys();
        baby = game.add.sprite( game.world.centerX, game.world.centerY, 'baby' );
        baby.anchor.setTo( 0.5, 0.5 );
        baby.alpha=0;
        game.physics.enable( baby, Phaser.Physics.ARCADE );
        
        player = game.add.sprite( game.world.centerX, game.world.centerY, 'player' );
        player.anchor.setTo( 0.5, 0.5 );
        player.pivot.x=-70;
        game.physics.enable( player, Phaser.Physics.ARCADE );
        
        shield = game.add.sprite( game.world.centerX, game.world.centerY, 'shield' );
        shield.anchor.setTo( 0.5, 0.5 );
        shield.pivot.x=90;
        game.physics.enable( shield, Phaser.Physics.ARCADE );
        shield.body.immovable = true;
        game.time.events.loop(Phaser.Timer.SECOND * 2, attack, this);
        
        time = game.time.create(false);
		time.loop(1000, updateTime, this);
		time.start()
    }
    function updateTime(){
    	displayT++;
    }
    function unlock(){check=0;}
    function shoot(){
    	var newS;
    	check=1;
    	game.time.events.add(Phaser.Timer.SECOND * 3, unlock, this);
    	newS=game.add.sprite(player.x,player.y, 'shot');
    	game.physics.enable(newS, Phaser.Physics.ARCADE);
    	var radians = player.angle;
    	console.log(radians);
    	game.physics.arcade.velocityFromAngle(radians, 60, newS.body.velocity);
    	shots.add(newS);
    }
    function attack(){
    	//spawn on edge
    	var rand;
    	rand=Math.round(Math.random()*3);
    	var newE;
    	switch(rand){
    		//from left
    		case(0):
    			newE=game.add.sprite(0, game.world.randomY, 'bad');
    			game.physics.enable(newE, Phaser.Physics.ARCADE);
    			break;
    		//from right
    		case(1):
    			newE=game.add.sprite(game.world.width,game.world.randomY, 'bad');
    			game.physics.enable(newE, Phaser.Physics.ARCADE);
    			break;
    		//from up
    		case(2):
    			newE=game.add.sprite(game.world.randomX,0, 'bad');
    			game.physics.enable(newE, Phaser.Physics.ARCADE);
    			break;
    		//from down
    		case(3):
    			newE=game.add.sprite(game.world.randomX,600, 'bad');
    			game.physics.enable(newE, Phaser.Physics.ARCADE);
    			break;
    	}
    	game.physics.arcade.accelerateToObject(newE, baby, 40);
    	newE.body.bounce.setTo(1, 1);
    	newE.body.collideWorldBounds = true;
    	enemies.add(newE);	
    }
    function ded(){
    	game.state.start( "lose" );
    }
    function colis(d){
    	game.physics.arcade.collide(d, shield);
    	//game.physics.arcade.collide(d, player);
    }
    function dest(x,c){
    	x.kill();
    	c.kill();
    }
    function update() {
    	//timer
    	game.debug.text('Time: ' + displayT, 32, 32);
    	//when hitby block reset 
    	game.physics.arcade.overlap(shots, enemies,dest, null, this);
    	game.physics.arcade.overlap(player, enemies,ded, null, this);
    	enemies.forEach(colis, this, this);
    	if (cursors.left.isDown)
    	{
        	shield.rotation -= .1;
        	player.rotation-=.1;
    	}
    	else if (cursors.right.isDown)
    	{
        	shield.rotation += .1;
        	player.rotation+=.1;
    	}
    	if(cursors.up.isDown){
    		if(check==0){
    			shoot();
    		}
    	}
    	//up shoots
    }
    
    return { "preload": preload, "create": create, "update": update };
}

function lose( game ){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(450, 300, "R.I.P\n"+displayT+" seconds", style);
    	text.anchor.set(0.5);
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "main" );
   	}
    return { "create": create };
}
window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 900, 700, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    game.state.add( "lose", lose( game ) );
    game.state.start( "main" );
};
