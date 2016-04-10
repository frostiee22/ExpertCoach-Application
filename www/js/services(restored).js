angular.module('app.services', [])

    .factory('getData', function($http) {
        return {
            update: function() {

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/team')
                        .success(function(response) {
                            Save(response, "teams");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 200);

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/simplegame')
                        .success(function(response) {
                            Save(response, "newgames");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 400);

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/simpleplayer')
                        .success(function(response) {
                            Save(response, "newplayers");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 600);

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/gameavg')
                        .success(function(response) {
                            Save(response, "gameavg");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 600);
            }
        }
    })

    .service('BlankService', [function() {

    }])

    .factory('Players', function($http, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();
            d.resolve(Update("newplayers"));
            return d.promise;
        }
        results.all = _all;
        return results;
    })

    .factory('PlayerDetails', function($http, $timeout, $q) {
        var results = {};
        function _all() {
            var d = $q.defer();
            $http
                .get("http://uwiproject.herokuapp.com/api/details/player/" + item.Player_ID)
                .success(function(response) {
                    //caching data
                    Save(response, "playerdetails");
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch item data");
                    console.log("Unable to fetch item data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })


    .factory('PlayerAVG', function($http, $timeout, $q) {
        var results = {};
        function _all() {
            var d = $q.defer();
            $http
                .get("http://uwiproject.herokuapp.com/api/playeravg/" + item.Player_ID)
                .success(function(response) {
                    d.resolve(response);
                })
                .error(function(data) {
                    console.log("Unable to fetch playeravg data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })


    .factory('TopGoals', function($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/gameavg")
                .success(function(response) {
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch");
                    console.log("Unable to fetch");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })

    .factory('SimpleData', function($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/playeravg")
                .success(function(response) {
                    //Save(response, "SimpleData");
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch simple data");
                    console.log("Unable to fetch simple data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })


    // get coach players
    .factory('CoachPlayers', function($http, $timeout, $q) {
        var results = {};
        function _all() {
            var d = $q.defer();
            $http
                .get("http://uwiproject.herokuapp.com/api/coach/players/" + item.Coach_ID)
                .success(function(response) {
                    d.resolve(response);
                })
                .error(function(data) {

                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })




////////////////////////////////////////////////////////


// saving data to a given key
function Save(data, key) {
    console.log("Attempting to save: " + key);
    var DataStored = localStorage.getItem(key);
    if (!DataStored) DataStored = [];
    else DataStored = JSON.parse(DataStored);
    DataStored = data;
    localStorage.setItem(key, JSON.stringify(DataStored));
    data = {};
}

// recieving data from a given key
function Update(key) {
    console.log("Attempting to Fetch from LocalStorage : " + key);
    return JSON.parse(localStorage.getItem(key));
}




function forEach(arr, operation) {
    for (var i = 0; i < arr.length; i += 1) {
        operation(arr[i]);
    }
}

function getItemStores(ItemID) {
    var StoresItems = Update("storeitem"),
        data = [];
    forEach(StoresItems, function(storeitem) {
        if (storeitem.itemid == ItemID) {
            var temp = {};
            temp = getStoreName(storeitem.storeid);
            temp.itemname = item.name;
            temp.price = storeitem.price;
            data.push(temp);
        }
    });
    return data;
}

// getting storeNmae
function getStoreName(StoreID) {
    var stores = Update("stores"),
        temp = {};
    forEach(stores, function(store) {
        if (store.storeid == StoreID) {
            temp = store;
        }
    });
    return temp;
}


// get itemName
function getItemName(ItemId) {
    var items = Update("items"),
        temp = {};
    forEach(items, function(item) {
        if (item.itemid = ItemId) {
            temp = item;
        }
    });
    return temp;
}

// item details given barcode
function itemDetails(barcode) {
    var items = Update("items"),
        temp = {};
    forEach(items, function(item) {
        if (item.barcode == barcode) {
            temp = item;
        }
    });
    return temp;
}


function SimplePlayerDetails(Player_ID) {
    var SPD = Update("SimpleData"),
        temp = {};
    forEach(SPD, function(s) {
        if (s.Player_ID == Player_ID) {
            temp = s;
        }
    });
    console.log("return :" + SPD);
    return temp;
}


function GameID2Game(games) {
    forEach(games, function(game) {
        game.name = GameID(game.Game_ID);
    });
    return games;
}

function GameID(gameid) {
    var simplegames = Update("newgames"),
        temp = {};
    forEach(simplegames, function(game) {
        if (game.Game_ID == gameid) {
            temp = game.game;
        }
    });
    return temp;
}


function PosIDToName(players) {
    var temp = {}, name;
    forEach(players, function(player) {
        if (player.Position_ID == 1 || player.Position_Id == 1)
            name = 'GoalKeeper';
        else if (player.Position_ID == 2 || player.Position_Id == 2)
            name = 'Defender';
        else if (player.Position_ID == 4 || player.Position_Id == 4)
            name = 'Mid Fielder';
        else if (player.Position_ID == 6 || player.Position_Id == 6)
            name = 'Attacker';
        else {
            name = 'not define'
        }
        player.pos = name;
    });
    return players;
}


////////////////////////////////////////////////////////////////////////
// EXPERT ALGORITHM

var keeper = 0, defender = 0, midfielder = 0, attacker = 0, none = 0;


function pos(id) {
    if (id == 0) keeper++;
    else if (id == 1) defender++;
    else if (id == 2) midfielder++;
    else if (id == 3) attacker++;
    else {
        console.log("id : " + id);
    }
}



function bestPositionPlayers(PlayersData, data) {
    forEach(PlayersData, function(player) {
        bestPosition(player, data);
    });
}


function bestPosition(player, d) {
    keeper = 0;
    defender = 0;
    midfielder = 0;
    attacker = 0;

    var arr = [0, 0, 0, 0];


    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Goals - d[i].Goals);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Touches - d[i].Touches);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Total_Successful_Passes_All - d[i].Total_Successful_Passes_All);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Total_Unsuccessful_Passes_All - d[i].Total_Unsuccessful_Passes_All);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.sum_duels_won - d[i].Duels_won);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.sum_duels_lost - d[i].Duels_lost);
    pos(arr.indexOf(Math.min.apply(Math, arr)));


    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Handballs_Conceded - d[i].Handballs_Conceded);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Penalties_Conceded - d[i].Penalties_Conceded);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Yellow_Cards - d[i].Yellow_Cards);
    pos(arr.indexOf(Math.min.apply(Math, arr)));

    for (var i = 0; i < 4; i++)
        arr[i] = Math.abs(player.Red_Cards - d[i].Red_Cards);
    pos(arr.indexOf(Math.min.apply(Math, arr)));


    var col = 10;
    player.stat = {};
    player.stat.keeper = (keeper / col);
    player.stat.defender = (defender / col);
    player.stat.midfielder = (midfielder / col);
    player.stat.attacker = (attacker / col);
    return player;
}


var formation = [1, 3, 3, 3];
//console.log(bestTeam(PlayersData, data, formation));
function bestTeam(Players, formation) {
    var PlayersData = PosIDToName(Players);
    var data = Update("gameavg");
    var keepersData = [], defendersData = [], midfieldersData = [], attackersData = [];
    forEach(PlayersData, function(Player) {
        if (Player.Position_Id == 1)
            keepersData.push(Player);
        else if (Player.Position_Id == 2)
            defendersData.push(Player);
        else if (Player.Position_Id == 4)
            midfieldersData.push(Player);
        else if (Player.Position_Id == 6)
            attackersData.push(Player);
        else {
            // Position don't exist
        }
    });


    var kTeam = bestKeeper(keepersData, data);
    var dTeam = bestDefender(defendersData, data);
    var mTeam = bestMidfielder(midfieldersData, data);
    var aTeam = bestAttacker(attackersData, data);

    var team = [],i;
    team.k = [], team.d = [], team.m = [], team.a = [];
    
    for (i = 0; i < formation[0]; i++)
        team.push(kTeam[i]);

    for (i = 0; i < formation[1]; i++)
        team.push(dTeam[i]);

    for (i = 0; i < formation[2]; i++)
        team.push(mTeam[i]);

    for (i = 0; i < formation[3]; i++)
        team.push(aTeam[i]);

    return team;


}

function bestKeeper(playersData, gameavg) {

    var best = 0;
    var v = 0.0;
    for (var i = 0; i < playersData.length; i++) {

        v += (playersData[i].Touches / gameavg[0].Touches);
        v += (playersData[i].sum_duels_won / gameavg[0].Duels_won);
        //v += (playersData[i].Blocks / gameavg[0].Blocks);
        v -= (playersData[i].Penalties_Conceded / gameavg[0].Penalties_Conceded);
        // v -= (playersData[i].Goals_Conceded / gameavg[0].Goals_Conceded);
        // v == (playersData[i].Goals_Saved / gameavg[0].Goals_Saved);

        playersData[i].rank = v;
        v = 0.0;
    }

    playersData.sort(function(a, b) {
        return parseFloat(b.rank) - parseFloat(a.rank);
    });
    return playersData;
}

function bestDefender(playersData, gameavg) {

    var best = 0;
    var v = 0.0;
    for (var i = 0; i < playersData.length; i++) {

        v += (playersData[i].Touches / gameavg[1].Touches);
        v += (playersData[i].sum_duels_won / gameavg[1].Duels_won);
        // v += (playersData[i].Blocks / gameavg[1].Blocks);


        playersData[i].rank = v;
        v = 0.0;
    }

    playersData.sort(function(a, b) {
        return parseFloat(b.rank) - parseFloat(a.rank);
    });
    return playersData;
}

function bestMidfielder(playersData, gameavg) {

    var best = 0;
    var v = 0.0;
    for (var i = 0; i < playersData.length; i++) {
        v += (playersData[i].Goals / gameavg[2].Goals);
        // v += (playersData[i].Assists / gameavg[2].Assists);
        v += (playersData[i].Touches / gameavg[2].Touches);
        v += (playersData[i].sum_duels_won / gameavg[2].Duels_won);
        // v += (playersData[i].Blocks / gameavg[2].Blocks);
        v -= (playersData[i].Blocked_Shots / gameavg[2].Blocked_Shots);

        playersData[i].rank = v;
        v = 0.0;
    }

    playersData.sort(function(a, b) {
        return parseFloat(b.rank) - parseFloat(a.rank);
    });
    return playersData;
}

function bestAttacker(playersData, gameavg) {

    var best = 0;
    var v = 0.0;
    for (var i = 0; i < playersData.length; i++) {
        v += (playersData[i].Goals / gameavg[3].Goals);
        // v += (playersData[i].Assists / gameavg[3].Assists);
        v += (playersData[i].Touches / gameavg[3].Touches);
        v += (playersData[i].sum_duels_won / gameavg[3].Duels_won);
        // v -= (playersData[i].Blocked_Shots / gameavg[3].Blocked_Shots);

        playersData[i].rank = v;
        v = 0.0;
    }

    playersData.sort(function(a, b) {
        return parseFloat(b.rank) - parseFloat(a.rank);
    });
    return playersData;
}



//////////////////////////////////////////////////////////////////////