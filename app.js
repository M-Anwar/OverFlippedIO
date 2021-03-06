const path = require('path');
const fs = require('fs');
var express = require("express");
var socket = require('socket.io');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var winston = require('winston');
var ip = require('ip');
require('winston-daily-rotate-file');



var webserverSettings = {
    port: process.env.port || 3000,
    devBuild: ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'), 
    logWebServer: false,
    maxPlayers: 4
}

var app = express();
app.set('port', webserverSettings.port);
var server = app.listen(webserverSettings.port);

/** Logging Webserver info **/
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var transports =[new (winston.transports.Console)({ timestamp: tsFormat, level: 'debug', colorize: true })];
if(!webserverSettings.devBuild){
    transports.push(new (winston.transports.DailyRotateFile)({
      filename: `${logDirectory}/log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: webserverSettings.devBuild ? 'debug' : 'error',
    }));
}
var logger = new (winston.Logger)({
  transports
});

if(webserverSettings.devBuild && webserverSettings.logWebServer){
    app.use(morgan('dev'));
}else if(webserverSettings.logWebServer){
    app.use(morgan('tiny'));
}

//Serve the static content in the public file
app.use(express.static('build'));

//Setup custom template at simple routes
app.engine(".hbs", exphbs(
    {
        defaultLayout: 'main',
        extname: '.hbs'
    }
))
app.set('view engine', '.hbs');

app.get('/debug', function(req,res){
    data={
        serverSettings: webserverSettings,
        rooms: JSON.stringify(rooms.map((i)=> [i.roomId, i.mobileSockets.map((j)=>j.id + " : " + j.userName)])),
        connections: JSON.stringify(connections)
    }
    res.render('debug',data );
})
app.get('/', function(req, res){
    res.render('index');
});
app.get('/address', function(req,res){
    res.json({address: ip.address(), port: webserverSettings.port});
});


/** Socket IO Configurations **/
var rooms = [];
var connections = [];

function room(roomSocket, roomId){
    this.roomSocket = roomSocket;
    this.roomId = roomId;
    this.mobileSockets = [];
}
rooms.push(new room(new socket(), "test"));

var io = socket(server);
io.sockets.on('connection', function(client){
    logger.debug('a user connected: ' + client.id);
    connections.push(client.id);
    io.emit('connected', "A user has connected");

    client.on("newRoom", function(data){
        logger.debug("New Room being made: " + data.room);
        rooms.push(new room(client,data.room));
    });

    client.on('mobileConnect', function(data, fn){
        logger.debug(client.id + ' connecting to Room: ' + data.room);
        var desktopRoom = null;
        for(var i = 0; i < rooms.length; i++){
            if(rooms[i].roomId == data.room){
                desktopRoom = i;
            }
        }
        if(desktopRoom !== null){
            if(rooms[desktopRoom].mobileSockets.length >= webserverSettings.maxPlayers){
                logger.warn("Rejecting user ... room already has " + webserverSettings.maxPlayers + " players");
                fn({registered: false, error: "The requested game is full"});
            }else{
                //Make sure that the username doesn't already exist on the room
                for(var users in rooms[desktopRoom].mobileSockets){
                   
                    if(rooms[desktopRoom].mobileSockets[users].userName == data.userName){
                        logger.warn("Rejecting user ... user already exists: " + data.userName);
                        fn({registered: false, error: "User already exists in the game"});
                        return;
                    }
                }

                rooms[desktopRoom].mobileSockets.push(client);
                client.roomId = desktopRoom;
                client.userName = data.userName;
                fn({registered: true});            
                rooms[client.roomId].roomSocket.emit('addUser', client.id, data);
            }
        }else{
            logger.warn("Rejecting user ... no desktop connection found for " + data.room)
            fn({registered: false, error: "No live desktop connection found"});
        }
    });
    
    client.on('mobileUpdate', function(data){        
        if(typeof client.roomId !== 'undefined'){
            if(typeof rooms[client.roomId] !== 'undefined'){
                logger.silly('message: ' + JSON.stringify(data));    
                rooms[client.roomId].roomSocket.emit('controllerUpdate', client.id, data);
            }
        }    
    });

    client.on('userReady', function(data){
        if(typeof client.roomId !== 'undefined'){
            if(typeof rooms[client.roomId] !== 'undefined'){
                data.userName = client.userName;
                logger.debug('message: ' + JSON.stringify(data));    
                rooms[client.roomId].roomSocket.emit('userUpdate', client.id, data);
                
            }
        }  
    });

    client.on('disconnect', function(){
        logger.debug("user disconnected: " + client.id + ", " + client.userName);
        connections.splice(connections.indexOf(client.id),1);
        var destroyThis = null;

        if(typeof client.roomId == 'undefined'){ //Desktop sockets have no roomId assigned to them
            for(var i in rooms){
                if(rooms[i].roomSocket.id == client.id){
                    destroyThis = i;
                }
            }
            if(destroyThis !== null){
                logger.debug("Destroying Room : " + rooms[destroyThis].roomId);
                logger.debug("\tRemoving " +rooms[destroyThis].mobileSockets.length + " mobile users");

                //Copy over sockets to local array, so it dosn't get interefered with on the disconnect signal
                var removeSockets = [];
                for(var i in rooms[destroyThis].mobileSockets){
                    removeSockets.push(rooms[destroyThis].mobileSockets[i]);
                }              
                for(var i =0; i< removeSockets.length; i++){  //disconnect each socket                  
                    removeSockets[i].disconnect();
                }                
                rooms.splice(destroyThis, 1); //Finally remove the room
            }
            
        }
        else{
            var roomId = client.roomId;
            for(var i in rooms[roomId].mobileSockets){
                if(rooms[roomId].mobileSockets[i] == client){
                    destroyThis = i;
                }
            }
            if(destroyThis !== null){
                logger.debug("Destroying Socket Connection " + destroyThis + " for room: " + rooms[roomId].roomId);
                rooms[roomId].mobileSockets.splice(destroyThis, 1);               
            }
            rooms[roomId].roomSocket.emit('userDisconnect', client.id,{userName: client.userName});
        }
        
    });

    
    
});

logger.info("Webserver is running on port: " +app.get('port') + " -> "+ (webserverSettings.devBuild==true? "Development": "Production"))

