var chai = require('chai');
var sinon = require('sinon')
var sinonTestFactory = require('sinon-test');
var sinonTest = sinonTestFactory(sinon);
var expect = chai.expect; // we are using the "expect" style of Chai


var PlayerManager = require("../../src/PlayerManager").PlayerManager
var GameState = require("../../src/PlayerManager").GameState

describe('Player Manager Unit Tests', function() {      

    //Stub out the important methods in the socket.io class
    class IO{
        constructor(){}
        connect(){            
            return {
                emit: this.emit,
                on: this.on
            }
        }
        emit(a,b){}
        on(a,b){}
    }    

    global.io = new IO();      
    var ids = ["403345","1234","123145","HelloWorld"];
    var datas = [{userName: "John"}, {userName: "Mello"},{userName: "Jello"},{userName: "Hello"}] 

    
    it('Manager Socket Setup and Callback Hooks Initialization', sinonTest(function(done) {        
        var connectSpy = sinon.spy(global.io, 'connect');
        var emitSpy = sinon.spy(global.io, 'emit');
        var onSpy = sinon.spy(global.io, 'on');        
        var manager = new PlayerManager();
        
        sinon.assert.calledOnce(connectSpy);
        sinon.assert.calledWithMatch(emitSpy, 'newRoom',{room:"game_test"});
        sinon.assert.calledWithMatch(onSpy, 'addUser');
        sinon.assert.calledWithMatch(onSpy, 'userDisconnect');
        sinon.assert.calledWithMatch(onSpy, 'userUpdate');
        sinon.assert.calledWithMatch(onSpy, 'controllerUpdate');            
        done();
    }));

    it("[PUBLIC API] Testing getPlayer()", sinonTest((done)=>{
        var manager = new PlayerManager();
        var id = 403345;
        var data = {userName: "John"}
        manager.addUser(id, data);

        let player = manager.getPlayer(0);
        expect(player.id).to.equal(id);
        expect(player.userName).to.equal(data.userName);

        let player1 = manager.getPlayer(1);
        expect(player1==null).to.be.true;

        done();
    }));

    it("[PUBLIC API] Testing getPlayerIndex()", sinonTest((done)=>{
        var manager = new PlayerManager();
        var id = 403345;
        var data = {userName: "John"}
        manager.addUser(id, data);

        let index = manager.getPlayerIndex(id);
        expect(index).to.equal(0);

        let index2 = manager.getPlayerIndex("DONT EXIST");
        expect(index2).to.be.null;

        done();
    }));

    it("[PUBLIC API] Testing getPlayerById()", sinonTest((done)=>{
        var manager = new PlayerManager();
        var id = 403345;
        var data = {userName: "John"}
        manager.addUser(id, data);

        let player = manager.getPlayerById(id);
        expect(player.userName).to.equal(data.userName);
        expect(player.id).to.equal(id);

        let index2 = manager.getPlayerIndex("DONT EXIST");
        expect(index2).to.be.null;

        done();
    }));

    it("[PUBLIC API] Testing getAllPlayers()", sinonTest((done)=>{
        var manager = new PlayerManager();       
        
        var expectedNum = (manager.maxPlayers > datas.length) ? datas.length: manager.maxPlayers;
        for(let [index, id] of ids.entries()){
            manager.addUser(id, datas[index]);
        }        

        var users = manager.getAllPlayers();
        expect(users.length).to.equal(expectedNum);
        users.forEach((user, index)=>{
            expect(user.userName).to.equal(datas[index].userName);
            expect(user.id).to.equal(ids[index]);
        });

        done();
    }));

    it("[PUBLIC API] Testing getPlayerCount()", sinonTest((done)=>{
        var manager = new PlayerManager();
        var id = ["403345","1234","123145","HelloWorld"];
        var data = [{userName: "John"}, {userName: "Mello"},{userName: "Jello"},{userName: "Hello"}]
        
        var expectedNum = (manager.maxPlayers > data.length) ? data.length: manager.maxPlayers;
        for(let [index, ids] of id.entries()){
            manager.addUser(ids, data[index]);
        }        
        
        var count = manager.getPlayerCount();
        expect(count).to.equal(expectedNum);

        done();
    }));

    /**
     * End-to-End Testing for connection workflow
     */
    it('Ensure simple user connect and disconnect workflow and callbacks', sinonTest(function(done){
        var manager = new PlayerManager();

        //Setup Spies
        var callbackDisconnect = sinon.spy();
        var callbackGameState = sinon.spy();
        var callbackAddUser = sinon.spy();
        var userDisconnectSpy = sinon.spy(manager, 'registerUserDisconnectCallback');
        var gameStateSpy = sinon.spy(manager, 'registerGameStateChangeCallback');  
        var userAddSpy = sinon.spy(manager, 'registerUserAddCallback');
        
        var id = 403345;
        var data = {userName: "John"}

        //Ensure all callbacks are registered properly
        manager.registerUserDisconnectCallback(callbackDisconnect); 
        manager.registerGameStateChangeCallback(callbackGameState); 
        manager.registerUserAddCallback(callbackAddUser); 
        sinon.assert.calledOnce(userDisconnectSpy);
        sinon.assert.calledOnce(gameStateSpy);
        sinon.assert.calledOnce(userAddSpy);    
        expect(manager.gameStateChangeCallbacks.length).to.equal(1);
        expect(manager.userDisconnectCallbacks.length).to.equal(1);
        expect(manager.userAddCallbacks.length).to.equal(1);

        //Add User
        manager.addUser(id, data);
        manager.getAllPlayers().forEach((player, index)=>{
            if(player){
                expect(player.id).to.equal(id);
            }
        });
        sinon.assert.calledOnce(callbackAddUser);
        expect(manager.getPlayerIndex(id)).to.equal(0);
        expect(manager.getPlayerCount()).to.equal(1);        

        //Disconnect User
        manager.userDisconnect(id,data);  
        expect(manager.getPlayerCount()).to.equal(0);              
        sinon.assert.calledOnce(callbackDisconnect);
        sinon.assert.calledWithMatch(callbackDisconnect, id,data);   
        sinon.assert.notCalled(callbackGameState); 

        //Add and Remove user while in game state
        manager.currentGameState =GameState.GAME;
        manager.addUser(id, data);
        expect(manager.getPlayerCount()).to.equal(1);   

        //Remove user, we should be back to DISCONNECT state now.
        manager.userDisconnect(id,data);
        manager.getAllPlayers().forEach((player, index)=>{
            expect(player).to.be.null;
        });        
        expect(manager.getPlayerCount()).to.equal(0);    
        sinon.assert.calledOnce(callbackGameState);
        sinon.assert.calledWithMatch(callbackGameState, GameState.DISCONNECT);

        done();
        
    }));

    it('Ensure max player connect -> ready -> game start -> disconnect phase', sinonTest((done)=>{
        var manager = new PlayerManager();

        var maxPlayers = (ids.length < manager.maxPlayers)? ids.length: manager.maxPlayers;
        
        //Setup Spies
        var callbackAddUser = sinon.spy();
        var callbackDisconnect = sinon.spy();
        var callbackGameState = sinon.spy();
        var callbackUserUpdate = sinon.spy();
        manager.registerUserAddCallback(callbackAddUser); 
        manager.registerUserDisconnectCallback(callbackDisconnect); 
        manager.registerGameStateChangeCallback(callbackGameState); 
        manager.registerUserUpdateCallback(callbackUserUpdate);

        //Add max players and ensure callbacks are fired
        for( let [index, id] of ids.entries()){
            if(index < maxPlayers){
                manager.addUser(id, datas[index]);
            }
        }
        sinon.assert.callCount(callbackAddUser, maxPlayers);
        
        //Get all players ready and make sure user updates and
        //game state change is called
        for( let [index, id] of ids.entries()){
            if(index < maxPlayers){
                manager.userUpdate(id, {userReady:true});
            }
        }
        sinon.assert.callCount(callbackUserUpdate, maxPlayers);
        sinon.assert.calledWithExactly(callbackGameState, GameState.GAME);

        //Disconnect a user 
        manager.userDisconnect(ids[0], datas[0] );
        sinon.assert.calledWithExactly(callbackDisconnect, ids[0], datas[0]);
        sinon.assert.calledWithExactly(callbackGameState, GameState.DISCONNECT);
        expect(manager.history.length).to.equal(1);
        expect(manager.history[0].userName).to.equal(datas[0].userName);
        expect(manager.history[0].index).to.equal(0);

        //Add completely new player (we'll test history later)
        var new_id = "NEW PLAYER";
        manager.addUser(new_id, {userName: "Portebello"});
        manager.userUpdate(new_id, {userReady:true});
        sinon.assert.calledWithExactly(callbackGameState, GameState.GAME);

        done();
    }));

    it('Test History Join Functionality', sinonTest((done)=>{
        var manager = new PlayerManager();

        //We force the players array to be of this size, normally this
        //is not possible and needs to be defined ahead of time.
        manager.maxPlayers = 4;        
        var maxPlayers = manager.maxPlayers;
        manager.players = Array(maxPlayers);
        manager.players.fill(null);
        
        //Setup Spies        
        var callbackGameState = sinon.spy();        
        manager.registerGameStateChangeCallback(callbackGameState);       

        //Add max players
        for( let [index, id] of ids.entries()){
            if(index < maxPlayers){                
                manager.addUser(id, datas[index]);
                manager.userUpdate(id, {userReady:true});
            }
        }        
        expect(manager.getPlayerCount()).to.equal(maxPlayers);
        sinon.assert.calledWithExactly(callbackGameState, GameState.GAME);

        //Disconnect the third player and fourth player
        manager.userDisconnect(ids[2], datas[2]);
        manager.userDisconnect(ids[3], datas[3]);
        sinon.assert.calledWithExactly(callbackGameState, GameState.DISCONNECT);

        //Check history length
        expect(manager.history.length).to.equal(2);
      
        //Add compeltely new player to the game
        id = "RANDOM";
        data = {userName: "RANDOMMAN"};
        manager.addUser(id, data);
        expect(manager.getPlayerIndex(id)).to.equal(2);

        //Add back player 3 and he should be back to where he was before
        manager.addUser(ids[2], datas[2]);
        expect(manager.getPlayerIndex(ids[2])).to.equal(2);
        expect(manager.getPlayerIndex(id)).to.equal(3);
        
        done();
    }));


});



