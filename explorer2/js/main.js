"use strict";
//Want it to be that based on pick, 1,2, or 3 thats you character.
//Archer Shoots arrows special multishot, Mage shoots water, special fire, knight stabs for 1 sec,
// special blocks. 3 health, need all cups to win teleport else 'this doesnt looked charged'. 
//Boss in boss room. Walking in room triggers cup to move and boss to spawn.

function make_main_game_state( game )
{
    function preload() {
        //game.load.spritesheet(35/35)
        game.load.tilemap( 'Tmap', 'assets/demap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/map.png');
        game.load.image('man', 'assets/dude.png');
        game.load.image('c1', 'assets/cup1.png');
        game.load.image('c2', 'assets/cup2.png');
        game.load.image('c3', 'assets/cup3.png');
        game.load.image('c4real', 'assets/cup4.png');
        game.load.image('c5', 'assets/cup5.png');
        game.load.image('arrow', 'assets/archerarrow.png');
        game.load.image('ball', 'assets/fireball.png');
        game.load.image('map', 'assets/minimap.png');
        game.load.image('death', 'assets/death.png');
        game.load.audio('traps','assets/trap.mp3');
        game.load.audio('ddsound','assets/deathsdeath.wav');
        game.load.image('port', 'assets/port.png');
        game.load.audio('noise','assets/dung.mp3');
        game.load.spritesheet('skele','assets/sprites/skeleman.png',64,64);
        game.load.spritesheet('archer','assets/sprites/archer.png',65,65);
		game.load.spritesheet('mage','assets/sprites/mage.png',64,64);
    }
    var health;
    var lock;
    var cursors;
    var temp1;
    var check;
    var cupsFound;
    var direction;
    var map;
    
    var trm;
    var enemies;
    var shots;
    var layer;
    var man,map;
    var port;
    var c4real, c1,c2,c3,c5,c6;
    var attack;
    var text;
    var style, death,ddsound;
    function create() { 
    	var exs=game.add.audio('noise');
    	trm=game.add.audio('traps');
    	ddsound=game.add.audio('ddsound');
    	health=10;
		exs.play();
    	check=0;
    	cupsFound=0;
    	lock=0;
    	//tilemap black magic
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.world.setBounds(0,0,6000,6000);
        map = game.add.tilemap('Tmap');
        map.addTilesetImage('map', 'tiles');
        layer=map.createLayer('Tile Layer 1');
        
        //add player
        if(view==1){
        	man=game.add.sprite(2000, 2000, 'archer',1);
   			man.animations.add('attackup', Phaser.ArrayUtils.numberArray(209,220), 20);
   			man.animations.add('attackleft', Phaser.ArrayUtils.numberArray(221,232), 20);
   			man.animations.add('attackdown', Phaser.ArrayUtils.numberArray(233,244), 20);
   			man.animations.add('attackright', Phaser.ArrayUtils.numberArray(245,256), 20);
		}
		if(view==2){
   			man=game.add.sprite(2000, 2000, 'mage');
   			man.animations.add('attackup', Phaser.ArrayUtils.numberArray(157,161), 10);
   			man.animations.add('attackleft', Phaser.ArrayUtils.numberArray(170,174), 10);
   			man.animations.add('attackdown', Phaser.ArrayUtils.numberArray(183,187), 10);
   			man.animations.add('attackright', Phaser.ArrayUtils.numberArray(196,200), 10);
    	}
    	man.animations.add('walkup', Phaser.ArrayUtils.numberArray(105,112), 10);
   		man.animations.add('walkleft', Phaser.ArrayUtils.numberArray(118,125), 10);
   		man.animations.add('walkdown', Phaser.ArrayUtils.numberArray(131,138), 10);
   		man.animations.add('walkright', Phaser.ArrayUtils.numberArray(144,151), 10);
   		//was for 3rd character
    	if(view==3){}
    	game.physics.arcade.enable(man);
    	cursors = game.input.keyboard.createCursorKeys();
    	game.camera.follow(man);

    	//add collision to walls idk how to optimize
    	var loop=0;
    	var count=1;
    	for(loop=0; loop<60; loop++){
    		for(count=0; count<60; count++){
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
    	//add death
    	death=game.add.sprite(1400,5000,'death');
    	game.physics.arcade.enable(death);
    	
    	//make cups, 900x400y for grail,  4650x550y  4200x3800y 2252/937, 200/3400
 		//1150, 4750. if nongrail is ran over complains 
 		enemies=game.add.group();
 		c4real=game.add.sprite(900, 400, 'c4real');
 		spawnSkele(900, 400);
 		c1=game.add.sprite(4650, 550, 'c1');
 		spawnSkele(4650, 550);
 		c2=game.add.sprite(1150, 4750, 'c2');
 		spawnSkele(1150, 4750);
 		c3=game.add.sprite(2252, 937, 'c3');
 		spawnSkele(2252, 937);
 		c5=game.add.sprite(200, 3400, 'c5');
 		spawnSkele(200, 3400);
 		c6=game.add.sprite(2800, 2150, 'c4real');
 		game.physics.arcade.enable(c4real);
 		game.physics.arcade.enable(c2);
 		game.physics.arcade.enable(c3);
 		game.physics.arcade.enable(c1);
 		game.physics.arcade.enable(c5);
 		game.physics.arcade.enable(c6);
 		style = { font: "20px Arial", fill: "#ff0044", align: "center" };
    	text = game.add.text(0, 0, "This inferior cup can't sate me", style); 
    	text.visable=false;
    	direction=3;
    	
		shots=game.add.group();
		map=game.add.sprite(man-450, man-300, 'map');
    }
    //teleport to end if all cups found
    function teleport(){
    	//if not all found
    	if(cupsFound!=5){
    		check=1;
    		text.text="This portal seems closed";
    		game.time.events.add(Phaser.Timer.SECOND * 4, vanishText, this);
    	}
    	else{
    		man.x=2300;
    		man.y=400;
    	}
    }
    //non final cup found
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
    //trap cup
    function spawnSkele(x,y){
    	var enemy;
    	enemy=game.add.sprite(x, y, 'skele',1);
    	enemy.animations.add('walkup', Phaser.ArrayUtils.numberArray(105,112), 10);
   		enemy.animations.add('walkleft', Phaser.ArrayUtils.numberArray(118,125), 10);
   		enemy.animations.add('walkdown', Phaser.ArrayUtils.numberArray(131,138), 10);
   		enemy.animations.add('walkright', Phaser.ArrayUtils.numberArray(144,151), 10);
   		game.physics.arcade.enable(enemy);
   		enemies.add(enemy);
   	}
    function trap(cup){
    	trm.play();
    	check=1;
    	cup.kill();
    	cupsFound++;
    	text.text="A trap!";
    	game.time.events.add(Phaser.Timer.SECOND * 4, vanishText, this);
		var i;
		var angle=0;
    	for(i=0; i<=8; i++){
    		var enemy;
    		spawnSkele(man.x+340*Math.cos(angle), man.y+340*Math.sin(angle));
   			angle+=Math.PI/4;
    	}
    }
    //move text helper funct
    function vanishText(){
    	check=0;
    }
    //win game, change states
    function win(){
    	game.state.start("over");
    }
    function unlock(){
    	lock=0;
    }
    function dlt(temp){
    	temp.kill();
    }
    function kills(a,b){
    	a.kill();
    	b.kill();
    }
    function loss(){
    	game.state.start("lose");
    }
    function follow(d){
    	var ang = game.physics.arcade.angleBetween(d, man);    
    	var deg = ang * (180/Math.PI);    
    	game.physics.arcade.velocityFromAngle(deg, 90, d.body.velocity);
    	if(deg<45 && deg>=-45){d.animations.play('walkright');}
    	if(deg<-45 && deg>=-135){d.animations.play('walkup');}
    	if(deg<-135 || deg>135){d.animations.play('walkleft');}
    	if(deg>45 && deg<=135){d.animations.play('walkdown');}
    }
    function deathHurt(shot, dd){
    	console.log("x");
    	dd.kill();
    	health--;
    	if(health==0){
    		death.kill();
    		ddsound.play();
    	}
    	else{
    		var i;
			var angle=0;
    		for(i=0; i<=8; i++){
    			spawnSkele(death.x+50*Math.cos(angle), death.y+50*Math.sin(angle));
   				angle+=Math.PI/4;
   			}
    	}
    }
    function update() {
 		map.x=man.x-420;   
		map.y=man.y-280;    
    	enemies.forEach(follow, this, this);
    	follow(death);
    	game.physics.arcade.overlap(death, man, loss, null, null);
    	//checks
    	game.physics.arcade.overlap(enemies,shots, kills,  null, this);
    	game.physics.arcade.overlap(port, man, teleport, null, this);
    	game.physics.arcade.overlap(enemies, man, loss, null, this);
    	game.physics.arcade.overlap(shots, death, deathHurt, null, this);
    	
    	game.physics.arcade.overlap(c4real, man, win, null, this);
    	game.physics.arcade.overlap(c1, man, cry, null, c1);
    	game.physics.arcade.overlap(c2, man, cry, null, c2);
    	game.physics.arcade.overlap(c3, man, cry, null, c3);
    	game.physics.arcade.overlap(c5, man, cry, null, c5);
    	game.physics.arcade.overlap(c6, man, trap, null, c6);
    	
    	//movement
    	man.body.velocity.y=0;
    	man.body.velocity.x=0;
    	man.body.angularVelocity=0;
    	game.physics.arcade.collide(enemies, layer);
		game.physics.arcade.collide(man, layer);
		game.physics.arcade.collide(shots, layer, dlt, null, this);
		if(lock==0){
			var temp;
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				man.animations.play('attackup');
				if(view==1){
					temp= game.add.sprite(man.x+50, man.y, 'arrow');
				}
				if(view==2){
					temp= game.add.sprite(man.x+50, man.y, 'ball');
				}
				temp.angle=90;
				game.physics.arcade.enable(temp);
				temp.body.velocity.y = -800;
				lock=1;
				game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
				temp.events.onOutOfBounds.add(dlt,temp);
				shots.add(temp);
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
				man.animations.play('attackright');
				if(view==1){
					temp= game.add.sprite(man.x+60, man.y+60, 'arrow');
				}
				if(view==2){
					temp= game.add.sprite(man.x+60, man.y+60, 'ball');
				}
				temp.angle=180;
				game.physics.arcade.enable(temp);
				temp.body.velocity.x = 800;
				lock=1;
				game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
				temp.events.onOutOfBounds.add(dlt,temp);
				shots.add(temp);
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
				man.animations.play('attackdown');
				if(view==1){
					temp= game.add.sprite(man.x+10, man.y+60, 'arrow');
				}
				if(view==2){
					temp= game.add.sprite(man.x+10, man.y+60, 'ball');
				}
				temp.angle=270;
				game.physics.arcade.enable(temp);
				temp.body.velocity.y = 800;
				lock=1;
				game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
				temp.events.onOutOfBounds.add(dlt,temp);
				shots.add(temp);
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
				man.animations.play('attackleft');
				if(view==1){
					temp= game.add.sprite(man.x-10, man.y+22, 'arrow');
				}
				if(view==2){
					temp= game.add.sprite(man.x-10, man.y+22, 'ball');
				}
				game.physics.arcade.enable(temp);
				temp.body.velocity.x = -800;
				lock=1;
				game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
				temp.events.onOutOfBounds.add(dlt,temp);
				shots.add(temp);
			}
			
		}
		if(cursors.left.isDown==false && cursors.up.isDown==false && cursors.down.isDown==false && cursors.right.isDown==false){
			//if(direction==1){man.frame=0;}if(direction==2){man.frame=40;}if(direction==3){man.frame=27;}if(direction==4){man.frame=14;}
		}
    	if (cursors.left.isDown){
        	man.body.velocity.x = -600;
        	if(lock==0){
				man.animations.play('walkleft');
			}
			direction=4;
    	}
    	else if (cursors.right.isDown){
        	man.body.velocity.x = 600;
        	if(lock==0){
        		man.animations.play('walkright');	
        	}
        	direction=2;
    	}
    	if (cursors.up.isDown){
        	man.body.velocity.y = -600;
        	if((cursors.left.isDown||cursors.right.isDown||lock==1)==false){
        		man.animations.play('walkup');
        		direction=1;
        	}
    	}
    	else if (cursors.down.isDown){
        	man.body.velocity.y = 600;
        	if((cursors.left.isDown||cursors.right.isDown||lock==1)==false){
        		man.animations.play('walkdown');
        		direction=3;
        	}
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
function lose( game ){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(450, 300, "R.I.P", style);
    	text.anchor.set(0.5);
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "main" );
   	}
    return { "create": create };
}
var view;
//I want intro to be a rotating character select
function intro(game){
	var text;
	var cursors;
	var lock;
	var arch,mage,knight;
	var loc, map;
	function preload(){
		//char images
		game.load.spritesheet('archer','assets/sprites/archer.png',65,65);
		game.load.spritesheet('mage','assets/sprites/mage.png',64,64);
		game.load.image('fmap','assets/fmap.png');
	}
	function create(){
		map=game.add.sprite(0,0,'fmap');
		map.alpha=.5;
		loc=0;
		var style = { font: "30px Arial", fill: "#008000", align: "center" };
    	text = game.add.text(game.world.centerX, game.world.centerY, '"I require a specific kind of cup.\nCall me a cup snob if you must.\nMy search has led me here,\n a dungeon that holds many secrets"\nClick to start', style);
    	text.anchor.set(0.5);
   		game.input.onTap.addOnce(charSelect);
   		cursors = game.input.keyboard.createCursorKeys();
   	}
   	function charSelect(){
   		loc=1;
   		lock=0;
   		arch=game.add.sprite(2000, 2000, 'archer',1);
   		arch.animations.add('shoot', [221,222,223,224,225,226,227,228,229,230,231,232], 20,true);
   		arch.animations.play('shoot');
		
   		mage=game.add.sprite(2000, 2000, 'mage');
   		mage.animations.add('basic', Phaser.ArrayUtils.numberArray(170,174), 10,true);
   		mage.animations.play('basic');
   		
   		//Phaser.ArrayUtils.numberArray(170,175)
   		text.text= "Choose a player\nLeft/Right to choose\nWASD to shoot\nDown to start";
   		text.y=100;
   		text.x=game.world.centerX;
   		//game.input.onTap.addOnce(rstart());
   		showArch();
   		//PUT ARROWS ON EITHER SIDE
   	}
   	function rstart(){game.state.start( "main" );}
   	function showArch(){
   		view=1;
   		arch.x=game.world.centerX;
   		arch.y=game.world.centerY;
   	}
   	function showMage(){
   		view=2;
   		mage.x=game.world.centerX;
   		mage.y=game.world.centerY;
   	}
   	function update(){
   		if(loc==1){
   		if (cursors.left.isDown && lock==0){
   			lock=1;
        	game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
        	view-=1;    
        	if(view<1){view=2}    
        	change();		
    	}
    	if (cursors.down.isDown && lock==0){
    		rstart();
    		map.kill();
    	}
    	else if (cursors.right.isDown && lock==0){
    		lock=1;
    		game.time.events.add(Phaser.Timer.SECOND * .5, unlock, this);
    		view+=1;
    		if(view>2){view=1}
    		change();
    	}
    	}
    }
    function change(){
    	arch.x=2000;
   		arch.y=2000;
   		mage.x=2000;
   		mage.y=2000;
   		if(view==1){showArch()}
   		if(view==2){showMage()}
   	}
    function unlock(){
    	lock=0;
    }
    return { "preload": preload, "create": create, "update": update };
}
window.onload = function() {
    var game = new Phaser.Game( 900, 600, Phaser.AUTO, 'game' );
    game.state.add( "main", make_main_game_state( game ) );
    game.state.add( "over", gameOver( game ) );
    game.state.add( "lose", lose( game ) );
    game.state.add( "intro", intro( game ) );
    game.state.start( "intro" );
};
