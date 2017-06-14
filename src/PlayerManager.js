var logger = require("js-logger");

/**
 * Player manager class which is responsible for handling all player connections
 * and data being sent by the controller server. This class handles players connecting
 * to the game, their controller inputs and any other events emanating from the server
 */

class PlayerManager{
    constructor(){
        logger.debug("Connecting to server and joining room");
        this.socket = io.connect();
        this.socket.emit('newRoom', {room:"index"});
        var self = this;
        
        //Register socket callbacks
        this.socket.on("addUser", function(id, data){
            logger.info("addUser: " + id + " " + JSON.stringify(data));
            self.addUser(id, data);
        });
        this.socket.on("userDisconnect", function(id,data){        
            logger.info("userDisconnect: " + id + " " + JSON.stringify(data));
            self.userDisconnect(id, data);
        });
        this.socket.on("userUpdate", function(id, data){        
            logger.debug("userUpdate: " + id + " " + JSON.stringify(data));
            self.userUpdate(id, data);
        });
        this.socket.on("controllerUpdate", function(id, data){        
            logger.debug("controllerUpdate: " + id + " " + JSON.stringify(data));
            self.controllerUpdate(id, data);
        });
        
        //Data structures for managing players
        this.players = [];
        this.userAddCallbacks = [];
        this.userDisconnectCallbacks = [];
        this.userUpdateCallbacks = [];
        this.controllerUpdateCallbacks = [];

    }
    registerUserAddCallback(cb){this.addUserCallbacks.push(cb);}
    registerUserDisconnectCallback(cb){this.addUserCallbacks.push(cb);}
    registerUserUpdateCallback(cb){this.addUserCallbacks.push(cb);}    

    addUser(id, data){
        this.players.push({id: id, userName: data.userName});
        for(let cb of this.userAddCallbacks){cb();}
    }
    userDisconnect(id, data){

    }
    userUpdate(id, data){

    }
    controllerUpdate(id, data){

    }
}

module.exports = PlayerManager;