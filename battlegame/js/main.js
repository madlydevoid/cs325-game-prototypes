"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.tilemap( 'Tmap', 'assets/demap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/map.png');
        game.load.image('man', 'assets/red_button.png');
        game.load.image('c1', 'assets/cup1.png');
        game.load.image('c2', 'assets/cup2.png');
        game.load.image('c3', 'assets/cup3.png');
        game.load.image('c4real', 'assets/cup4.png');
        game.load.image('c5', 'assets/cup5.png');
        game.load.image('port', 'assets/port.png');
        game.load.audio('noise','assets/dung.mp3');
    }
    
    var map;
    var layer;
    var man;
    var cursors;
    var temp1;
    var port;
    var c4real;
    var c1,c2,c3,c5;
    var text;
    var style;
    var check;
    var cupsFound;
    function create() {
    	var exs=game.add.audio('noise');
		exs.play();
		
    	check=0;
    	cupsFound=0;
    	//tilemap black magic
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.world.setBounds(0,0,6000,6000);
        map = game.add.tilemap('Tmap');
        map.addTilesetImage('map', 'tiles');
        layer=map.createLayer('Tile Layer 1');
        
        //add player
        man=game.add.sprite(3500, 2200, 'man');
    	game.physics.arcade.enable(man);
    	cursors = game.input.keyboard.createCursorKeys();
    	game.camera.follow(man);
    	
    	//add collision to walls
    	var loop=0;
    	var count=1;
    	for(loop=0; loop<58; loop++){
    		for(count=0; count<58; count++){
    			var temp= map.getTile(count, loop, layer);
    			if(temp.properties.Collision==true){
    				temp.setCollision(true,true,true,true);
    				game.physics.arcade.collide(man, temp);
    			}
    		}
    	}
    	//make teleport @300x3100y
    	port=game.add.sprite(200, 3000, 'port');
    	game.physics.arcade.enable(port);
    	port.alpha=false;
    	
    	//make cups, 900x400y for grail,  4650x550y  4200x3800y 2252/937, 200/3400
 		//1150, 4750. if nongrail is ran over complains 
 		c4real=game.add.sprite(900, 400, 'c4real');
 		c1=game.add.sprite(4650, 550, 'c1');
 		c2=game.add.sprite(1150, 4750, 'c2');
 		c3=game.add.sprite(2252, 937, 'c3');
 		c5=game.add.sprite(200, 3400, 'c5');
 		game.physics.arcade.enable(c4real);
 		game.physics.arcade.enable(c2);
 		game.physics.arcade.enable(c3);
 		game.physics.arcade.enable(c1);
 		game.physics.arcade.enable(c5);
 		style = { font: "20px Arial", fill: "#ff0044", align: "center" };
    	text = game.add.text(0, 0, "This inferior cup can't sate me", style); 
    	text.visable=false;
    }
    //teleport to end
    function teleport(){
    	man.x=2300;
    	man.y=400;
    }
    function cry(cup){
    	check=1;
    	if(cupsFound==1){
    		text.text="Maybe this dungeon hides a secret?";
    	}
    	if(cupsFound==2){
    		text.text="Perhaps I should go to the alter room\n and pray for an answer";
    	}
    	if(cupsFound==3){
    		text.text="The pool in the alter room seemed very\n suspicious";
    	}
    	if(cupsFound==4){
    		text.text="The pool in the alter room seemed very\n suspicious";
    	}
    	cup.kill();
    	cupsFound++;
    	game.time.events.add(Phaser.Timer.SECOND * 4, vanishText, this);
    }
    function vanishText(){
    	check=0;
    }
    
    function win(){
    	game.state.start("over");
    }
    function update() {
    	//checks
    	game.physics.arcade.overlap(port, man, teleport, null, this);
    	
    	game.physics.arcade.overlap(c4real, man, win, null, this);
    	game.physics.arcade.overlap(c1, man, cry, null, c1);
    	game.physics.arcade.overlap(c2, man, cry, null, c2);
    	game.physics.arcade.overlap(c3, man, cry, null, c3);
    	game.physics.arcade.overlap(c5, man, cry, null, c5);
    	
    	//movement
    	man.body.velocity.y=0;
    	man.body.velocity.x=0;
    	man.body.angularVelocity=0
		game.physics.arcade.collide(man, layer);
    	if (cursors.left.isDown){
        	man.body.velocity.x = -600;
        	
    	}
    	else if (cursors.right.isDown){
        	man.body.velocity.x = 600;	
    	}
    	if (cursors.up.isDown){
        	man.body.velocity.y = -600;
    	}
    	else if (cursors.down.isDown){
        	man.body.velocity.y = 600;
    	}
    	
    	//text
    	if(check==1){
    		text.x = Math.floor(man.x + man.width / 2);
    		text.y = Math.floor(man.y + man.height / 2);
    	}
    	else{
    		text.x = 0;
    		text.y = 0;
    	}
    }
    
    return { "preload": preload, "create": create, "update": update };
}
function gameOver( game ){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(450, 300, "A worthy cup!", style);
    	text.anchor.set(0.5);
    
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "main" );
   	}
    return { "create": create };
}
function intro(game){
	function create(){
		var style = { font: "30px Arial", fill: "#008000", align: "center" };
    	var text = game.add.text(game.world.centerX, game.world.centerY, '"I require a specific kind of cup.\nCall me a cup snob if you must.\nMy search has led me here,\n a dungeon that holds many secrets"\nClick to start', style);
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
    
    var game = new Phaser.Game( 900, 600, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    game.state.add( "over", gameOver( game ) );
    game.state.add( "intro", intro( game ) );
    game.state.start( "intro" );
};
