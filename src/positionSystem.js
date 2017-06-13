function positionLogger(entity, elapsed){    
    var position = entities.getComponent(entity, "position");
    position.x ++;
    console.log(position);
}

module.exports = positionLogger;