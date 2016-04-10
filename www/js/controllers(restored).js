var item;

angular.module('app.controllers', [])

    .controller('OnloadCtrl', ['$scope', '$http', 'getData', function($scope, $http, getData) {
        Save({}, "items");
        Save({}, "stores");
        Save({}, "storeitem");
        getData.update();
    }])

    .controller('enterCtrl', ['$scope', '$http', '$ionicSideMenuDelegate', '$ionicActionSheet', '$timeout', 'SimpleData', function($scope, $http, $ionicSideMenuDelegate, $ionicActionSheet, $timeout, SimpleData) {
        console.log("enterCtrl launched");

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.newplayers = Update("newplayers");
        $scope.newgames = Update("newgames");
        $scope.teams = Update("teams");


        // COACH FORM
        $scope.submitCoach = function() {
            var fname = $scope.coach.fname,
                lname = $scope.coach.lname,
                username = $scope.coach.username;


            var link = "http://uwiproject.herokuapp.com/Coach/" + fname + "/" + lname + "/" + username;
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        console.log(response);
                        $scope.response = "successful";
                        console.log(response.coachid[0].Coach_ID);
                        $scope.coachID = response.coachid[0].Coach_ID;
                        $scope.coach = {};
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    console.log("Unable to fetch item data");
                    $scope.response = "error uploading!";
                });
        };


        //TEAM FORM
        $scope.submitTeam = function() {
            var t = $scope.team;
            var link = "http://uwiproject.herokuapp.com/Team/" + t.coachid + "/" + t.tname;
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.team = {};
                        (function() {
                            $http
                                .get('http://uwiproject.herokuapp.com/api/team')
                                .success(function(response) {
                                    Save(response, "teams");
                                })
                                .error(function(data) {
                                    $scope.response = "error uploading!";
                                });
                        })();
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };


        //PLAYER FORM
        $scope.submitPlayer = function() {
            var p = $scope.player;
            var link = "http://uwiproject.herokuapp.com/Player/" + p.fname + "/" + p.lname + "/" + p.position + "/" + p.team.Team_ID.Team_ID;
            console.log(link);
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.player = {};
                        (function() {
                            $http
                                .get('http://uwiproject.herokuapp.com/api/simpleplayer')
                                .success(function(response) {
                                    Save(response, "newplayers");
                                })
                                .error(function(data) {
                                    $scope.response = "error uploading!";
                                });
                        })();
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };


        $scope.showSheet = function() {
            // Show the action sheet
            if ($scope.player == null) {
                $scope.player = {};
            }

            var PlayerPosition;
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Attacker' },
                    { text: 'Defender' },
                    { text: 'Mid Fielder' },
                    { text: 'Goalkeeper' }
                ],
                destructiveText: 'Delete',
                titleText: 'Select Your Position',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) PlayerPosition = 6;
                    else if (index == 1) PlayerPosition = 2;
                    else if (index == 2) PlayerPosition = 4;
                    else if (index == 3) PlayerPosition = 1;
                    else {
                        PlayerPosition = 0;
                    }
                    var pos = $scope.player.position = PlayerPosition;

                    if (pos == 1 || pos == 2 || pos == 4 || pos == 6) {
                        $timeout(function() {
                            hideSheet();
                        }, 150);
                    }

                    return PlayerPosition;
                }
            });
        };

        //GAME FORM
        $scope.submitGame = function() {
            var g = $scope.game;
            var link = "http://uwiproject.herokuapp.com/Game/" + g.date + "/" + g.venue + "/" + g.team1.Team_ID.Team_ID + "/" + g.team2.Team_ID.Team_ID;
            console.log(link);
            if (g.team1.Team_ID.Team_ID == g.team2.Team_ID.Team_ID) {
                $scope.response = "Teams selected are the same!";
            } else {
                $http
                    .get(link)
                    .success(function(response) {
                        if (response.data == 'suc') {
                            $scope.response = "successful";
                            $scope.game = {};
                            (function() {
                                $http
                                    .get('http://uwiproject.herokuapp.com/api/simplegame')
                                    .success(function(response) {
                                        Save(response, "newgames");
                                    })
                                    .error(function(data) {
                                        $scope.response = "error uploading!";
                                    });
                            })();
                        }
                        else {
                            $scope.response = "error uploading!";
                        }
                    })
                    .error(function(data) {
                        $scope.response = "error uploading!";
                    });
            }

        };



        // MATCH FORM
        $scope.submitMatch = function() {
            var m = $scope.match;
            var link = "http://uwiproject.herokuapp.com/Match/" + m.player.Player_ID.Player_ID + "/" + m.game.Game_ID.Game_ID + "/" + m.goals + "/" +
                m.succesfulpasses + "/" + m.unsuccesfulpasses + "/" + m.touches + "/" + m.duelswon + "/" + m.duelslost + "/" +
                m.handballsconceded + "/" + m.penaltiesconceded + "/" + m.yellowcard + "/" + m.redcard;
            console.log(link);
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.match = {};
                        SimpleData.all().then(
                            function(res) {
                                Save(res, "SimpleData");
                            },
                            function(err) {
                                console.log(err);
                            }
                        );
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };
    }])
    // End enterCtrl


    .controller('itemSearchCtrl', ['$scope', '$http', 'Players', 'SimpleData', '$ionicPopover', function($scope, $http, Players, SimpleData, $ionicPopover) {
        console.log("itemSearchCtrl");
        $scope.items = [{ name: 'loading...' }];
        Players.all().then(
            function(res) {
                $scope.items = PosIDToName(res);
            },
            function(err) {
                console.error(err);
            }
        );

        SimpleData.all().then(
            function(res) {
                Save(res, "SimpleData");
            },
            function(err) {
                console.log(err);
            }
        );


        $scope.doRefresh = function() {
            $http.get('http://uwiproject.herokuapp.com/api/simpleplayer')
                .success(function(newItems) {
                    $scope.items = PosIDToName(newItems);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };


        $scope.details = function() {
            item = {};
            item = this.item;
        }

        /////////////////////////////////////////////////////
        // POP OVER

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            item = this.item;
            $scope.name = item;
            var temp = SimplePlayerDetails(item.Player_ID);
            temp = bestPosition(temp, Update("gameavg"));
            $scope.SPD = temp;
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });

        ///////////////////////////////////////////////////////

    }])

    .controller('PLayerDetailsCtrl', ['$scope', 'PlayerDetails', 'PlayerAVG', '$ionicSideMenuDelegate', function($scope, PlayerDetails, PlayerAVG, $ionicSideMenuDelegate) {
        console.log("PlayerDetailsCtrl");

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.stores = [{ name: 'Loading..' }];
        PlayerDetails.all().then(
            function(res) {
                $scope.stores = GameID2Game(res);
            },
            function(err) {
                console.error(err);
            }
        );

        PlayerAVG.all().then(
            function(res) {
                var pos = 0, gameavg = Update("gameavg");
                if (item.Position_ID == 1) pos = 0;
                else if (item.Position_ID == 2) pos = 1;
                else if (item.Position_ID == 4) pos = 2;
                else if (item.Position_ID == 6) pos = 3;
                else {
                    // do nothing
                }
                $scope.labels = ['Goals', 'Successful Passes', 'Unsuccessful Passes', 'Touches', 'Duels won', 'Duels lost', 'Handballs Conceded'];
                $scope.series = ['Average', item.name];
                $scope.data = [
                    [gameavg[pos].Goals, gameavg[pos].Total_Successful_Passes_All, gameavg[pos].Total_Unsuccessful_Passes_All, gameavg[pos].Touches, gameavg[pos].Duels_won, gameavg[pos].Duels_lost, gameavg[pos].Handballs_Conceded],
                    [res[0].Goals, res[0].Total_Successful_Passes_All, res[0].Total_Unsuccessful_Passes_All, res[0].Touches, res[0].sum_duels_won, res[0].sum_duels_lost, res[0].Handballs_Conceded]
                ];
            },
            function(err) {
                console.log(err);
            }
        );


    }])

    .controller('previousListsCtrl', ['$scope', 'CoachPlayers', function($scope, CoachPlayers) {
        console.log("BEST TEAM");
        $scope.BestTeam = function() {
            item = {};
            item.Coach_ID = $scope.Coach_ID
            console.log(item.Coach_ID);
            CoachPlayers.all().then(
                function(res) {
                    //console.log(res)
                    var formation = [1,3,3,3];
                    $scope.team = bestTeam(res,formation);
                },
                function(err) {
                    console.error(err);
                }
            );
        }
    }])

    .controller('homeCtrl', ['$scope', '$http', 'TopGoals', function($scope, $http, TopGoals) {
        console.log("homeCtrl");
        TopGoals.all().then(
            function(stats) {
                //$scope.labels = ['Goals','Successful Passesc','Unsuccessful Passes'];
                $scope.labels = ['1', '2', '3', '4', '5', '6'];
                $scope.series = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
                $scope.data = [
                    [stats[0].Goals, stats[0].Total_Successful_Passes_All, stats[0].Total_Unsuccessful_Passes_All, stats[0].Touches, stats[0].Duels_won, stats[0].Duels_lost],
                    [stats[1].Goals, stats[1].Total_Successful_Passes_All, stats[1].Total_Unsuccessful_Passes_All, stats[1].Touches, stats[1].Duels_won, stats[1].Duels_lost],
                    [stats[2].Goals, stats[2].Total_Successful_Passes_All, stats[2].Total_Unsuccessful_Passes_All, stats[2].Touches, stats[2].Duels_won, stats[2].Duels_lost],
                    [stats[3].Goals, stats[3].Total_Successful_Passes_All, stats[3].Total_Unsuccessful_Passes_All, stats[3].Touches, stats[3].Duels_won, stats[3].Duels_lost]
                ];
            },
            function(err) {
                console.error(err);
            }
        );
    }])







