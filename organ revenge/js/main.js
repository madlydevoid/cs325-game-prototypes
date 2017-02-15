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
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'bad', 'assets/red_button.png' );
        game.load.image( 'phaser', 'assets/green_button.png' );
    }
    var timer;
    var time=0;
    var enemies;
    var me;
    var cursors;
    var stateText;
    var gameOn=1;
    var score;
    function create() {
        me=game.add.sprite(game.world.centerX,game.world.centerX, 'phaser');
        game.physics.enable(me, Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();
        
        enemies=game.add.group();
        
        //stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '42px Arial', fill: '#fff' });
    	//stateText.anchor.setTo(0.5, 0.5);
    	//stateText.visible = false;
        
        timer = game.time.create(false);
		timer.loop(1000, updateTime, this);
		timer.start()
    }
    function killGame(){
    	//show game over, show score
    	score=time;
    	//stateText.text=" GAME OVER \n Score: Click to restart";
        //stateText.visible = true;
        gameOn=0;
        me.kill();
        game.input.onTap.addOnce(restart);
    }
    function update() {
    if(gameOn==1){
		game.physics.arcade.overlap(enemies, me, killGame);
    	
        if (cursors.left.isDown){
       		me.x -= 8;
       	}
    	else if (cursors.right.isDown){
        	me.x += 8;
    	}

    	if (cursors.up.isDown)
    	{
        	me.y -= 8;
    	}
    	else if (cursors.down.isDown)
    	{
        	me.y += 8;
    	}
    }
    else{
    	game.debug.text(" GAME OVER \n Score:" +score+"\n Click to restart", game.world.centerX,game.world.centerY,' ', { font: '42px Arial', fill: '#fff' });
    }
    }
    function restart(){
    	time=0;
    	gameOn=1;
    	enemies.destroy(true,true);
    	me.revive();
    	me.x=game.world.centerX;
    	me.y=game.world.centerY;
    	//stateText.visable=false;
    }
    function ded(sprite){
    	sprite.kill();
    }
    function updateTime(){
    	time++;
    	var sect=time/5;
    	if(time%1===0){
    		//spawn
    		var rand;
    		rand=Math.round(Math.random()*3);
    		var newE;
    		switch(rand){
    			//from left
    			case(0):
    				newE=game.add.sprite(0, game.world.randomY, 'bad');
    				game.physics.enable(newE, Phaser.Physics.ARCADE);
    				newE.body.velocity.x=200+(sect*40);
    				newE.events.onOutOfBounds.add(ded,newE);
    				break;
    			//from right
    			case(1):
    				newE=game.add.sprite(game.world.width,game.world.randomY, 'bad');
    				game.physics.enable(newE, Phaser.Physics.ARCADE);
    				newE.body.velocity.x=-200-(sect*40);
    				newE.events.onOutOfBounds.add(ded,newE);
    				break;
    			//from up
    			case(2):
    				newE=game.add.sprite(game.world.randomX,0, 'bad');
    				game.physics.enable(newE, Phaser.Physics.ARCADE);
    				newE.body.velocity.y=200+(sect*40);
    				newE.events.onOutOfBounds.add(ded,newE);
    				break;
    			//from down
    			case(3):
    				newE=game.add.sprite(game.world.randomX,600, 'bad');
    				game.physics.enable(newE, Phaser.Physics.ARCADE);
    				newE.body.velocity.y=-200-(sect*40);
    				newE.events.onOutOfBounds.add(ded,newE);
    				break;
    		}
    		enemies.add(newE);
    	}
    }
};
