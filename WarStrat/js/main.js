"use strict";

function make_main_game_state( game )
{
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
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
    function create() {
        //spawn tiles map
        //spawn 4 units on each corner,
		turn=1;
        tank = {player: 1, dmg: 1, hp: 50, haveatked: 0, mv: 2, mvmax:2, img: game.add.sprite("Tankb", 100, 100)};
        tank2 = {player: 2, dmg: 1, hp: 50, haveatked: 0, mv: 2, mvmax: 2, img: game.add.sprite("Tankb", 600, 600)};
        heavy = {player: 1, dmg: 2, hp: 40, haveatked: 0, mv: 3, mvmax: 3, img: game.add.sprite("Tankb", 0, 100)};
        heavy2 = {player: 2, dmg: 2, hp: 40,haveatked: 0, mv: 3, mvmax: 3, img: game.add.sprite("Tankb", 700, 600)};
        solider = {player: 1, dmg: 3, hp: 30,haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite("Tankb", 0, 0)};
        solider2 = {player: 2, dmg: 3, hp: 30, haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite("Tankb", 700, 700)};
        scout = {player: 1, dmg: 4, hp: 20, haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite("Tankb", 100, 0)};
        scout2 = {player: 2, dmg: 4, hp: 20, haveatked: 0, mv: 4, mvmax: 4, img: game.add.sprite("Tankb", 600, 700)};
		
		map = game.add.tilemap('Tmap');
        map.addTilesetImage('map', 'mount');
		map.addTilesetImage('map', 'grass');
        layer=map.createLayer('Tile Layer 1');
		
    }
    
    function update() {
        //if click on own unit (show area?) then destination, move there if able
    }
    
    return { "preload": preload, "create": create, "update": update };
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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "main" );
};
