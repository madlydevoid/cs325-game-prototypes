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
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, } );
    
    function preload() {
        game.load.image( 'greenbut', 'assets/green_button.png' );
	game.load.image( 'redbut', 'assets/red_button.jpg' );
	game.load.audio('blip', 'assets/Robot_blip.wav');
    }
    
  
	var text;
	var counter=0;

	var timer=100;
	var highS=0;
	
function create() {
   
		//press=game.add.audio('blip');
		var greenbut = game.add.sprite(Math.random() *800 , Math.random() *800, 'greenbut');

		greenbut.inputEnabled = true;

		greenbut.input.useHandCursor = true;

		greenbut.events.onInputDown.add(gpress, this);

		
		//can make 10 and ever time a green is pressed move a new red in...
		//var spriters=game.addgroup();
		//spriters.inputEnabled = true;

		//spriters.input.useHandCursor = true;
		//spriters.events.onInputDown.add(rpress, this);
		//var spriter=spriters.create(Math.random() *800 , Math.random() *800, 'redbut');
		
	
		timer_text=game.add.text(20,20, '', { fill: '#ffffff' });

		timer = game.time.create(false);


		//  Set a TimerEvent to occur after 1 second

		timer.loop(10000, updateTime, this);


		//  Start the timer running
    
		timer.start();

	}
	
	

function gpress (greenbut) {

		//playFx(press);
		counter++;

		greenbut.x=Math.random() *800;

		greenbut.y=Math.random() *800;

		
	}
	//function rpress(spriter) {
	//	playFx(press);
	//	counter--;
	//	spriteg.x=Math.random() *800;

	//	spriteg.y=Math.random() *800;

	//}
	
function updateTime(){

		if(highS<counter){
        
			highS=counter;
    
		}

		counter=0;
	
}
function update() {
        game.debug.text('Time left: ' + timer.duration.toFixed(0), 32, 32);
    
		game.debug.text("High Score: " + highS, 32, 64);
    
		game.debug.text("You clicked " + counter + " times!", 32, 97);
}
};
