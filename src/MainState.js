var GameState = require("./GameState");
var BABYLON = require("babylonjs");


class MainState extends GameState{

    constructor(name, engine, canvas){
        super(name, engine, canvas);
    }
}  
module.exports = MainState;