import * as logger from 'js-logger';
declare var io;

/**
 * The current state of the game given the player states.
 */
export enum GameState{
    LOBBY, GAME, DISCONNECT 
}

/**
 * Simple data structure holding all the information required for 
 * representing a user connected to the game.
 */
export class User{
    id: string
    userName: string
    tilt_LR: number
    tilt_FB: number
    boosted: boolean
    userReady: boolean
}

class HistoryElement{
    userName: string;
    index: number;
}

/**
 * Player manager class which is responsible for handling all player connections
 * and data being sent by the controller server. This class handles players connecting
 * to the game, their controller inputs and any other events emanating from the server
 */
export class PlayerManager{
    public maxPlayers:number = 2;
    
    private socket: any
    private currentGameState: GameState;

    private players = Array<User>(this.maxPlayers);
    private history = Array<HistoryElement>();
    private userAddCallbacks = [];
    private userDisconnectCallbacks = [];
    private userUpdateCallbacks = [];
    private controllerUpdateCallbacks = [];
    private gameStateChangeCallbacks = [];

    constructor(){
        logger.debug("Connecting to server and joining room");
        this.socket = io.connect();
        this.socket.emit('newRoom', {room:"game_test"});        

        this.currentGameState = GameState.LOBBY;
        
        var self = this;
        
        //Register socket callbacks
        this.socket.on("addUser", function(id, data){
            logger.debug("addUser: " + id + " " + JSON.stringify(data));
            self.addUser(id, data);
        });
        this.socket.on("userDisconnect", function(id,data){        
            logger.debug("userDisconnect: " + id + " " + JSON.stringify(data));
            self.userDisconnect(id, data);
        });
        this.socket.on("userUpdate", function(id, data){        
            logger.debug("userUpdate: " + id + " " + JSON.stringify(data));
            self.userUpdate(id, data);
        });
        this.socket.on("controllerUpdate", function(id, data){        
            //logger.debug("controllerUpdate: " + id + " " + JSON.stringify(data));
            self.controllerUpdate(id, data);
        });          
        
        this.players.fill(null);
    }
    public registerUserAddCallback(cb){this.userAddCallbacks.push(cb);}
    public registerUserDisconnectCallback(cb){this.userDisconnectCallbacks.push(cb);}
    public registerUserUpdateCallback(cb){this.userUpdateCallbacks.push(cb);} 
    public registerGameStateChangeCallback(cb){this.gameStateChangeCallbacks.push(cb);}   
    public returnToLobby(){
        this.history.splice(0,history.length);
        this.currentGameState = GameState.LOBBY; 
    }

    private addUser(id, data){
        this.addNewPlayer({id: id, userName: data.userName, tilt_LR: 0, tilt_FB:0, boosted: false, userReady:false})           
        for(let cb of this.userAddCallbacks){cb(id, data);}     
                   
    }
    private userDisconnect(id, data){
        var playerIdx = this.getPlayerIndex(id);
        if(this.currentGameState==GameState.GAME){
            this.currentGameState=GameState.DISCONNECT;
            for(let cb of this.gameStateChangeCallbacks){cb(this.currentGameState);}
        }

        //Only add to history when we in the DISCONNECT state
        if(this.currentGameState==GameState.DISCONNECT){ 
            var name = this.players[playerIdx].userName;        
            this.addToHistory(name, playerIdx);   
        }
       
        for(let cb of this.userDisconnectCallbacks){cb(id, data);}  
        this.players[playerIdx] = null;        
              
    }
    private userUpdate(id, data){        
        var playerElement = this.getPlayerById(id);      
        playerElement.userReady = !playerElement.userReady;
        for(let cb of this.userUpdateCallbacks){cb(id, data);}  
        
        var count =0;
        for (var i in this.players){            
            if(this.players[i]!=null && this.players[i].userReady){
                count++;
            }
        }    

        if(count ==this.maxPlayers){
            this.currentGameState = GameState.GAME;
            for(let cb of this.gameStateChangeCallbacks){cb(this.currentGameState);}
        }

    }
    private controllerUpdate(id, data){        
        var playerElement = this.getPlayerById(id);
        playerElement.tilt_LR = data.tilt_LR;
        playerElement.tilt_FB = data.tilt_FB;
        playerElement.boosted = data.boosted;        
    }

   /**
    * Get the player corresponding to the actual game index.
    * @param index the index of the player to retrieve
    */
    public getPlayer(index: number): User{
        return this.players[index];       
    }
    public getPlayerIndex(id:string):number{                
        for(let [index, player] of this.players.entries()){            
            if(player!=null && player.id == id){                               
                return index;
            }
        }                    
        logger.error("Invalid user requested from getPlayerIndex(id)");
        return null;          
    }
    public getPlayerById(id:string):User {
        for(let player of this.players){            
            if(player!=null && player.id == id){
                return player;
            }
        }       
        
        logger.error("Invalid user requested from getPlayer(id)");
        return null;        
    }
    public getAllPlayers():Array<User>{
        return this.players;
    }    
    public getPlayerCount():number{
        var count =0;

        for(let player of this.players){
            if(player!=null){
                count++;
            }
        }        
        return count;
    }


    private addToHistory(player:string, idx:number): void{
        
        //Update the history index if the player already exists
        for(var hist in this.history){
            if(this.history[hist].userName == player){
                this.history[hist].index = idx;
                return;
            }
        }
        
        //Else push a new history entry
        this.history.push({userName: player, index: idx});

    }
    private addNewPlayer(player: User): void{        
        if(this.getPlayerCount() == this.maxPlayers) {return;}
        
        for(let hist in this.history){
            var cur = this.history[hist];
            
            if(cur.userName == player.userName){ //If the player joined before
                if(this.players[cur.index] !=null){ //But there is someone already there 
                    var temp = this.players[cur.index]; //Swap the existing player to an empty location
                    this.players[cur.index]= player;
                    for(var p = 0;p < this.players.length; p++){                    
                        if(this.players[p]==null){                       
                            this.players[p] = temp;
                            break;
                        }
                    }
                    return;
                }
                else{//If its empty
                    this.players[cur.index] = player;
                    return;
                }
            }
        }
    
        this.addToEmptySlot(player);
        
    }

    private addToEmptySlot(data:User): void{      
        for(var i = 0;i < this.players.length; i++){
            if(this.players[i] == null){
                this.players[i] = data;
                return;
            }
        }        
    }
    
   
}
