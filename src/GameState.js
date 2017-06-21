class GameState{
    constructor(name, engine, canvas){
        this.name = name;
        this.engine = engine;
        this.canvas = canvas;
    }
    update(delta){}
    render(){}

}

module.exports = GameState;