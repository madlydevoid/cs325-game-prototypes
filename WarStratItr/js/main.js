//would like to show range+ show selected
//tank fortification, extra defense
//sniper can go on mountain
//solider continued assult?...medic?
//knight death blocks location
"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.tilemap( 'Tmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tank', 'assets/tank.png' );
        game.load.image('Knight', 'assets/knight.png' );
        game.load.image('Solider', 'assets/solider.png' );
        game.load.image('Scout', 'assets/scout.png' );
        game.load.image('mount', 'assets/mountain.png');
        game.load.image('grass', 'assets/tile.png');
        game.load.image('bluecirc', 'assets/bluecirc.png');
        game.load.audio('Tankshot','assets/tankshot.mp3');
        game.load.audio('Knightshot','assets/knightshot.mp3');
        game.load.audio('Solidershot','assets/solidershot.mp3');
        game.load.audio('Scoutshot','assets/scoutshot.mp3');
        game.load.audio('blip','assets/blip.wav');
    }
    
    var turn;
	var tank;
    var tank2;
    var heavy;
    var heavy2;
    var solider;
    var solider2;
    var scout;
    var scout2;
	var map;
	var layer;
	var selected;
	var pieces;
	var endKey;
	var selected2;
	var overlap;
	var ktimer;
	var circselect, firstturn;
	var blip,tanksh,knightsh,solidersh,scoutsh;
    function create() {
        //spawn tiles map
        //spawn 4 units on each corner,
        blip=game.add.audio('blip');
        tanksh=game.add.audio('Tankshot');
        knightsh=game.add.audio('Knightshot');
        solidersh=game.add.audio('Solidershot');
        scoutsh=game.add.audio('Scoutshot');
        map = game.add.tilemap('Tmap');
        map.addTilesetImage('mountain', 'mount');
		map.addTilesetImage('land', 'grass');
        layer=map.createLayer('map');	
        overlap=0;
        endKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		turn=1;
		pieces=game.add.group();
		//var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100};
        tank = {fort:0, type:1, player: 1, dmg: 2, hp: 50, haveatked: 0, mv: 2, mvmax:3, img: game.add.sprite(100,100,'Tank'), txt: game.add.text(110,110,"hp:50\n mv:2",{fill:"#ffffff"})};
        tank2 = {fort:0, type:1, player: 2, dmg: 2, hp: 50, haveatked: 0, mv: 3, mvmax: 3, img: game.add.sprite(600,600,'Tank'), txt: game.add.text(610,610,"hp:50\n mv:3",{fill:"#ffffff"})};
        heavy = {type:2, player: 1, dmg: 3, hp: 40, haveatked: 0, mv: 2, mvmax: 3, img: game.add.sprite(0,100,'Knight'), txt: game.add.text(10,110,"hp:40\n mv:2",{fill:"#ffffff"})};
        heavy2 = {type:2, player: 2, dmg: 3, hp: 40,haveatked: 0, mv: 3, mvmax: 3, img: game.add.sprite(700,600,'Knight'), txt: game.add.text(710,610,"hp:40\n mv:3",{fill:"#ffffff"})};
        solider = {type:3, player: 1, dmg: 3, hp: 30,haveatked: 0, mv: 2, mvmax: 4, img: game.add.sprite(0,0,'Solider'), txt: game.add.text(10,10,"hp:30\n mv:2",{fill:"#ffffff"})};
        solider2 = {type:3, player: 2, dmg: 3, hp: 30, haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite(700,700,'Solider'), txt: game.add.text(710,710,"hp:30\n mv:4",{fill:"#ffffff"})};
        scout = {type:4, player: 1, dmg: 4, hp: 20, haveatked: 0, mv: 2, mvmax: 4, img: game.add.sprite(100,0,'Scout'), txt: game.add.text(110,10,"hp:20\n mv:2",{fill:"#ffffff"})};
        scout2 = {type:4, player: 2, dmg: 4, hp: 20, haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite(600,700,'Scout'), txt: game.add.text(610,710,"hp:20\n mv:4",{fill:"#ffffff"})};
		pieces.add(tank.img);
		pieces.add(tank2.img);
		pieces.add(heavy.img);
		pieces.add(heavy2.img);
		pieces.add(solider.img);
		pieces.add(solider2.img);
		pieces.add(scout.img);
		pieces.add(scout2.img);
		tank.txt.x+=10;
		ktimer=0;
    }
    function update(){
    	if (endKey.isDown && ktimer==0){
    		ktimer=1;
    		game.time.events.add(Phaser.Timer.SECOND * 1, resettime, this);
    		endTurn();
    	}
        game.input.onDown.add(click,this);
        
    }
    function click(pointer, event){ 
        	//if ovelap on any try grabbing that instead 
        	var xt=Math.floor(pointer.x / 100) * 100;
			var yt=Math.floor(pointer.y / 100) * 100;
			overlap=0;
			selected2=overlapcheck(xt,yt);
			if(overlap==1){
				if(selected2.player==turn){
					console.log('selected');
					blip.play();
					selected=selected2;
					if(circselect!=null){
						circselect.kill();
					}
					circselect=game.add.sprite(selected.img.x, selected.img.y, 'bluecirc');
					return;
				}
				else{
					if(selected==null){return;}
					attack(selected,selected2);
					return;
				}
			}
			if(selected==null){return;}
        	if(inrange(selected, xt, yt)==0){return;}
        	moveunit(selected,xt,yt);
        	return;
    }
    function resettime(){
    	ktimer=0;
    	return;
    }
    function endTurn(){
    	selected=null;
    	if(turn==1){
    		if(tank.mv==tank.mvmax){
    			tank.fort=1;
    		}
    		else{
    			tank.fort=0;
    		}
    		if(solider.hp<20){
    			solider2.hp+=6;
    		}
    	}
    	if(turn==2){
    		if(tank2.mv==tank2.mvmax){
    			tank2.fort=1;
    		}
    		else{
    			tank2.fort=0;
    		}
    		if(solider2.hp<20){
    			solider2.hp+=6;
    		}
    	}
    	if(turn==1){
    		turn=2;
    	}
    	else{
    		turn=1;
    	}
    	tank.mv=tank.mvmax;
    	tank.haveatked=0;
    	tank2.mv=tank.mvmax;
    	tank2.haveatked=0;
    	heavy.mv=heavy.mvmax;
    	heavy.haveatked=0;
    	heavy2.mv=heavy.mvmax;
    	heavy2.haveatked=0;
    	solider.mv=solider.mvmax;
    	solider.haveatked=0;
    	solider2.mv=solider.mvmax;
    	solider2.haveatked=0;
    	scout.mv=scout.mvmax;
    	scout.haveatked=0;
    	scout2.mv=scout.mvmax;
    	scout2.haveatked=0;
    	tank.txt.text="  hp: "+tank.hp+"\n mv:"+tank.mv;
    	tank2.txt.text="  hp: "+tank2.hp+"\n mv:"+tank2.mv;
    	heavy.txt.text="  hp: "+heavy.hp+"\n mv:"+heavy.mv;
    	heavy2.txt.text="  hp: "+heavy2.hp+"\n mv:"+heavy2.mv;
    	solider.txt.text="  hp: "+solider.hp+"\n mv:"+solider.mv;
    	solider2.txt.text="  hp: "+solider2.hp+"\n mv:"+solider2.mv;
    	scout.txt.text="  hp: "+scout.hp+"\n mv:"+scout.mv;
    	scout2.txt.text="  hp: "+scout2.hp+"\n mv:"+scout2.mv;
    }
    function attack(team, enemy){
    	if(team.haveatked==1){return;}
    	var dist=Math.abs(team.img.x-enemy.img.x);
    	dist=dist+Math.abs(team.img.y-enemy.img.y);
    	if(dist!=100){return;}
    	team.mv=0;
    	var i;
		var curdmg=0;
    	for(i=0;i<team.dmg;i++){
    		curdmg=curdmg+Math.floor(Math.random() * 6) + 1;
    	}
    	team.haveatked=1;
    	if(enemy.type==1 && enemy.fort==1){
    		curdmg=curdmg*0.75;
    	}
    	if(team.type==1){
    		tanksh.play();
    	}
    	if(team.type==2){
    		knightsh.play();
    	}
    	if(team.type==3){
    		solidersh.play();
    	}
    	if(team.type==4){
    		scoutsh.play();
    	}
    	enemy.hp=enemy.hp-curdmg;
    	enemy.txt.text="  hp: "+enemy.hp+"\n mv:"+enemy.mv;
    	if(enemy.hp<=0 && enemy.type!=2){enemy.img.x=1000;enemy.txt.x=1000}
    	return;    
    }
    //move unit to xy, 
    function moveunit(selected,xt,yt){
    	selected.img.x=xt;
    	selected.img.y=yt;
    	selected.txt.x=xt+10;
    	selected.txt.y=yt+10;
    	selected.txt.text="  hp: "+selected.hp+"\n mv:"+selected.mv;
    	circselect.x=selected.img.x;
    	circselect.y=selected.img.y;
    }
    //function onEnemy
    function overlapcheck(xcor, ycor){
    	overlap=1;
    	if(tank.img.x==xcor && tank.img.y==ycor){return tank;}
    	if(tank2.img.x==xcor && tank2.img.y==ycor){return tank2;}
    	if(heavy.img.x==xcor && heavy.img.y==ycor){return heavy;}
    	if(heavy2.img.x==xcor && heavy2.img.y==ycor){return heavy2;}
    	if(solider.img.x==xcor && solider.img.y==ycor){return solider;}
    	if(solider2.img.x==xcor && solider2.img.y==ycor){return solider2;}
    	if(scout.img.x==xcor && scout.img.y==ycor){return scout;}
    	if(scout2.img.x==xcor && scout2.img.y==ycor){return scout2;}
    	overlap=0;
    	return;
    }
    function inrange(item,x2,y2){
    	//in range if move remaining*100>= abs(x1-x2)+abs(y1-y2) and tile is not impassable
    	if(map.getTile(x2/100,y2/100,layer).properties.Passable==false && item.type!=4){
    		return 0;
    	}
    	var x1=item.img.x;
    	var y1=item.img.y;
    	var dist=Math.abs(x1-x2);
    	dist=dist+Math.abs(y1-y2);
    	if(item.mv>=(dist/100)){
    		item.mv-=dist/100;
    		return 1;
    	}
    	return 0;
    }
    return { "preload": preload, "create": create, "update": update };
}
function intro(game){
	var meme;
	var icon;
	function preload(){
		game.load.image('Tank', 'assets/tank.png' );
        game.load.image('Knight', 'assets/knight.png' );
        game.load.image('Solider', 'assets/solider.png' );
        game.load.image('Scout', 'assets/scout.png' );
    }
	function create(){
		meme=game.add.text(10,100,"Instructions:\nPlayer 1 starts in the top left corner and goes first\nThe movement speed is halved for the first player\njust for the first turn.\nSpace ends your turn\nClick on a unit then click on the destination.\nYou must first move to an enemy then click on it to attack.\nAttacking uses the rest of that units movement so be carful.\n Each unit also has a unique ability.",{fill:"#ffffff"});
		game.input.onTap.addOnce(start2);
	}
	function update(){}
	function start2(){
		icon=game.add.sprite(400,100,'Tank');
		icon.anchor.set(0.5);
		meme.y=400;
		meme.text="The tank is the highest health unit,\nit's special is called fortify, which\nmakes it 75% damage when it didn't move\nin the previous turn.";
		game.input.onTap.addOnce(start3);
	}
	function start3(){
		icon.kill();
		icon=game.add.sprite(400,100,'Knight');
		icon.anchor.set(0.5);
		meme.text="The knight has slightly more damage\nbut less health than the tank.\nIt's ability is deaths stand, this makes\nit so when the unit dies he stays and blocks the spot.";
		game.input.onTap.addOnce(start4);	
	}
	function start4(){
		icon.kill();
		icon=game.add.sprite(400,100,'Solider');
		icon.anchor.set(0.5);
		meme.text="The solider is decent damage with\nsome health. It's special is medic.\nThis heals the unit a bit each turn when it goes\nbelow 20 health.";
		game.input.onTap.addOnce(start5);
	}
	function start5(){
		icon.kill();
		icon=game.add.sprite(400,100,'Scout');
		icon.anchor.set(0.5);
		meme.text="The sniper is high damage low health.\nIt's special is recon which lets\nit climb on mountains.";
		game.input.onTap.addOnce(start);
	}
	function start(){
		icon.kill();
		game.state.start( "main" );
	}
	return { "preload": preload, "create": create, "update": update };
}
function gameOver(){}
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
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    game.state.add( "intro", intro( game ) );
    game.state.add( "over", gameOver( game ) );
    game.state.start( "intro" );
};
