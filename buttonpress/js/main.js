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
    
    //"use strict";
    
    var game = new Phaser.Game( 700, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, } );
    
    function preload() {
        game.load.image( 'greenbut', 'assets/green_button.png' );
		game.load.image( 'redbut', 'assets/red_button.png' );
		game.load.audio('blip', 'assets/Robot_blip.wav');
    }
    
  
	var text;
	var counter=0;

	var timer=100;
	var highS=0;
	var press;
	var allred;
	function create() {
   		//Sound
		press=game.add.audio('blip');
		//group
		allred=game.add.group();
		
		//Green Button
		var greenbut = game.add.sprite(Math.random() *680+10 , Math.random() *680+10, 'greenbut');
		greenbut.inputEnabled = true;
		greenbut.input.useHandCursor = true;
		greenbut.events.onInputDown.add(gpress, this);

		
		//Timer
		timer = game.time.create(false);
		timer.loop(60000, updateTime, this);
    
		timer.start();

	}
	
	//What happens on pressing the green button
	function gpress (greenbut) {

		press.play();
		counter++;

		greenbut.x=Math.random() *680+10;

		greenbut.y=Math.random() *680+10;
		
		//Makes new redbutton
		var i;
		for(i=0; i<Math.ceil(counter/10); i++){
			var redbut=game.add.sprite(Math.random() *680+10 , Math.random() *680+10, 'redbut');
			redbut.inputEnabled = true;
			redbut.input.useHandCursor = true;
			redbut.events.onInputDown.add(rpress, this);
			allred.add(redbut);
		}

		
	}
	//what happens when red is pressed
	function rpress(redbut) {
		press.play();
		counter--;
		redbut.x=Math.random() *680+10;
		redbut.y=Math.random() *680+10;

	}
	
	//when time runs out
	function updateTime(){
		if(highS<counter){
			highS=counter;
		}
		counter=0;
		allred.destroy(true,true);
	}
	
	//score display
	function update() {
        game.debug.text('Time left: ' + timer.duration.toFixed(0), 32, 32);
    
		game.debug.text("High Score: " + highS, 32, 64);
    
		game.debug.text("You clicked " + counter + " times!", 32, 97);
	}
};
