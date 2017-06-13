var EntityComponentSystem = require("entity-component-system").EntityComponentSystem
var EntityPool = require("entity-component-system").EntityPool;
var ecs = new EntityComponentSystem();

var PositionSystem = require('./positionSystem');

// function positionLogger(entity, elapsed){    
//     var position = entities.getComponent(entity, "position");
//     console.log(position);
// }
ecs.addEach(PositionSystem, "position");

window.entities = new EntityPool();
function positionFactory(){
    return {
        "x": 0,
        "y": 0
    };
}
entities.registerComponent("position", positionFactory);

var dummyPosition = entities.create();
entities.addComponent(dummyPosition, "position");

ecs.run(entities, 0.01);
ecs.run(entities, 0.01);