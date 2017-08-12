var chai = require('chai');
var sinon = require('sinon')
var sinonTestFactory = require('sinon-test');
var sinonTest = sinonTestFactory(sinon);
var expect = chai.expect; // we are using the "expect" style of Chai


var PlayerManager = require("../../src/PlayerManager.js")

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
    
    it('Ensure correct addUser() callbacks are fired', sinonTest(function(done){
        var manager = new PlayerManager();
        var callback = sinon.spy();
        var userAddSpy = sinon.spy(manager, 'registerUserAddCallback');  
        
        var id = 403345;
        var data = {userName: "John"}

        manager.registerUserAddCallback(callback);  
        manager.addUser(id, data);
        
        sinon.assert.calledOnce(userAddSpy);
        sinon.assert.calledOnce(callback);
        sinon.assert.calledWithMatch(callback, id,data);    
        expect(manager.userAddCallbacks.length).to.equal(1);
        done();
        
    }));

    it('Ensure correct userDisconnect() callbacks are fired', sinonTest(function(done){
        var manager = new PlayerManager();
        var callbackDisconnect = sinon.spy();
        var callbackGameState = sinon.spy();
        var userDisconnectSpy = sinon.spy(manager, 'registerUserDisconnectCallback');
        var gameStateSpy = sinon.spy(manager, 'registerGameStateChangeCallback');  
        
        var id = 403345;
        var data = {userName: "John"}

        manager.registerUserDisconnectCallback(callbackDisconnect); 
        manager.registerGameStateChangeCallback(callbackGameState);  
        sinon.assert.calledOnce(userDisconnectSpy);
        expect(manager.gameStateChangeCallbacks.length).to.equal(1);
        expect(manager.userDisconnectCallbacks.length).to.equal(1);


        manager.addUser(id, data);
        manager.userDisconnect(id,data);        
        
        sinon.assert.calledOnce(callbackDisconnect);
        sinon.assert.calledWithMatch(callbackDisconnect, id,data);   
        sinon.assert.notCalled(callbackGameState); 

        manager.currentGameState = manager.gameState.GAME;
        manager.addUser(id, data);
        manager.userDisconnect(id,data);
        
        sinon.assert.calledOnce(callbackGameState);
        sinon.assert.calledWithMatch(callbackGameState, manager.gameState.DISCONNECT);

        done();
        
    }));

});

