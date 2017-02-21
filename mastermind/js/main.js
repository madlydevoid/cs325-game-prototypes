"use strict";

function make_main_game_state( game )
{
	
    function preload() {
        // Load 6 buttons
        game.load.image( 'red', 'assets/red.png' ); 
        game.load.image( 'white', 'assets/white.png' ); 
        game.load.image( 'green', 'assets/green.png' ); 
        game.load.image( 'black', 'assets/black.png' ); //0
        game.load.image( 'blue', 'assets/blue.png' ); //1
        game.load.image( 'orange', 'assets/orange.png' ); //2
        game.load.image( 'yellow', 'assets/yellow.png' ); //3
        game.load.image( 'teal', 'assets/teal.png' ); //4
        game.load.image( 'purple', 'assets/purple.png' ); //5
        //game.load.image( 'board', 'assets/phaser.png' );
    }
    var key=[];
    var input=[];
    var butbk;
    var butbu;
    var butor;
    var butye;
    var buttl;
    var butpr;
    var count=0;
    var tries=0;
    function create() {
        //place 6 buttons on side, place bomb, generate key.
        // When button is pressed add color to 4 array and table, when full compare
        //if compare fails check if end,
        var i;
        var rand;
        for(i=0; i<3 ;i++){
        	rand=Math.round(Math.random()*5);
        	//black,blue,orange,yellow,teal,purple
        	key[i]=rand;
        }
        butbk= game.add.button(10, 30, 'black', clickBk, this, 2, 1, 0);
        butbu= game.add.button(50, 30, 'blue', clickBu, this, 2, 1, 0);
        butor= game.add.button(90, 30, 'orange', clickOr, this, 2, 1, 0);
        butye= game.add.button(130, 30, 'yellow', clickYe, this, 2, 1, 0);
        buttl= game.add.button(170, 30, 'teal', clickTl, this, 2, 1, 0);
        butpr= game.add.button(210, 30, 'purple', clickPr, this, 2, 1, 0);
    }
    function clickBk(){
    	input[count]=1;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    function clickBu(){
    	input[count]=2;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    function clickOr(){
    	input[count]=3;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    function clickYe(){
    	input[count]=4;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    function clickTl(){
    	input[count]=5;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    function clickPr(){
    	input[count]=6;
    	count++;
    	if(count==4){
    		newrow();
    	}
    }
    
    function newrow(){
    	//compare
    	var i;
    	var j;
    	var rightplace=0;
    	var wrongplace=0;
    	for(i=0;i<4;i++){
    		for(j=0;j<4;j++){
    			if(input[i]==key[j]){
    				if(i==j){
    					rightplace++;
    				}
    				else{
    					wrongplace++;
    				}
    			}
    		}
    	}
    	count=0;
    	tries++;
    	if(rightplace==4){
    		game.state.start("won");
    	}
    	if(tries==10){
    		game.state.start("lost");
    	}
    	
    	//display
    	var spot=0;
    	for(i=0;i<4;i++){
    		if(rightplace>0){
    			rightplace--;
    			var sprite = game.add.sprite(200+(30*spot), 10+(40*tries), 'green');
    			spot++;
    		}
    		else if(wrongplace>0){
    			wrongplace--;
    			var sprite = game.add.sprite(200+(30*spot), 10+(40*tries), 'red');
    			spot++;
    		}
    		else{
    			var sprite = game.add.sprite(200+(30*spot), 10+(40*tries), 'white');
    			spot++;
    		}
    	}
    }
    
    function update() {
       
    }
    
    return { "preload": preload, "create": create, "update": update };
}
function intro(game){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(game.world.centerX, game.world.centerY, "Defuse the bomb\nGuess the correct order of colors\nGreen=right color in right place\nRed=right color wrong place\nClick to start", style);
    	text.anchor.set(0.5);
    
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "main" );
   	}
    return { "create": create };
}
function won(game){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(game.world.centerX, game.world.centerY, "You defused the bomb!", style);
    	text.anchor.set(0.5);
    
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "intro" );
   	}
    return { "create": create };
}
function lost(game){
	function create(){
		var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    	var text = game.add.text(game.world.centerX, game.world.centerY, "You lose", style);
    	text.anchor.set(0.5);
    
   		game.input.onTap.addOnce(playGame);
   	}
   	function playGame(){
   		game.state.start( "intro" );
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
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    game.state.add( "intro", intro(game) );
    game.state.add("lost",lost(game));
    game.state.add("won",won(game));
    
    game.state.start( "intro" );
};
