var MAX_PLAYERS = 4;
var players = Array(MAX_PLAYERS);
var history = [];
console.log("INITIAL: " + JSON.stringify(players));

addToHistory({username: "john"},0);
addToHistory({username: "cindy"},1);

console.log("HISTORY: " + JSON.stringify(history) + "\n");



addNewPlayer({username:"andy"});
addNewPlayer({username:"george"});
addNewPlayer({username:"paul"});
players[2] = null;
console.log(getPlayerCount());
addNewPlayer({username:"cindy"});
addNewPlayer({username:"melo"});
addNewPlayer({username:"john"});



console.log(JSON.stringify(players));

function addToHistory(player, index){
    for(var hist in history){
        if(history[hist].username == player.username){
            history[hist].index = index;
            return;
        }
    }
    history.push({username:player.username, index: index});

}
function addNewPlayer(player){
    if(getPlayerCount() == MAX_PLAYERS) return;
    
    for(var hist in history){
        var cur = history[hist];

        if(cur.username == player.username){ //If the player joined before
            if(players[cur.index] !=null){ //But there is someone already there 
                var temp = players[cur.index]; //Swap the existing player to an empty location
                players[cur.index]= player;
                for(var p = 0;p < players.length; p++){                    
                    if(players[p]==null){                       
                        players[p] = temp;
                        break;
                    }
                }
                return;
            }
            else{//If its empty
                players[cur.index] = player;
                return;
            }
        }
    }
   
    addToEmptySlot(player);
    
}

function getPlayerCount(){
    var count =0;
    for(var i in players){
        count ++;
    }
    return count;
}
function addToEmptySlot(data){
    for(var i = 0;i < players.length; i++){
        if(players[i] == null){
           players[i] = data;
           break;
        }
    }
}

