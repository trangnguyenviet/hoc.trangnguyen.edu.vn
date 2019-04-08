/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

$(function () {
    var Game = IGame.core;

    var g = new Game({
        container: '#tn-game',
        baseUrl: '/game/NCDC/assets/',
        states: [{
            name: 'Boot',
            state: TVUB.Boot
        }, {
            name: 'Preload',
            state: TVUB.Preload
        }, {
            name: 'Home',
            state: TVUB.Home
        }, {
            name: 'Game',
            state: TVUB.Game
        }, {
            name: 'End',
            state: TVUB.End
        }],
        message: {
            rule: ''
        },
        sound: true,
        autoLoad: true,
        ready: function (game) {
            var data = {
                "title": "Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "deception": "Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "time": 1200,
                "time_left":900,
                "play": 10,
                "score":0,
                "game_id": 4,
                "addScore":10,
                "life":3,
                "count_win":7,
                "game_name": "Hổ con",
                "content" : [
                    [
                        {
                            type: 'text',
                            content: 'Công'
                        },
                        {
                            type: 'text',
                            content: 'Cha'
                        },
                        {
                            type: 'text',
                            content: 'Như'
                        },
                        {
                            type: 'text',
                            content: 'Núi'
                        },
                        {
                            type: 'text',
                            content: 'Thái'
                        },
                        {
                            type: 'text',
                            content: 'Công'
                        },
                        {
                            type: 'text',
                            content: 'Cha'
                        },
                        {
                            type: 'text',
                            content: 'Như'
                        },
                        {
                            type: 'text',
                            content: 'Núi'
                        },
                        {
                            type: 'text',
                            content: 'Thái'
                        }
                    ],
                    [
                        {
                            type: 'text',
                            content: 'Công'
                        },
                        {
                            type: 'text',
                            content: 'Cha'
                        },
                        {
                            type: 'text',
                            content: 'Như'
                        },
                        {
                            type: 'text',
                            content: 'Núi'
                        },
                        {
                            type: 'text',
                            content: 'Thái'
                        },
                        {
                            type: 'text',
                            content: 'Công'
                        },
                        {
                            type: 'text',
                            content: 'Cha'
                        },
                        {
                            type: 'text',
                            content: 'Như'
                        },
                        {
                            type: 'text',
                            content: 'Núi'
                        },
                        {
                            type: 'text',
                            content: 'Thái'
                        }
                    ]
                ],
                "answereds": [
                    [1,3,5],
                    [2,4,6]
                ]
            };

            game.setGameData(data);

            //thong tin ca nhan
            if (typeof userInfo !== 'undefined') {
                game.provide('user', userInfo);
            }

            game.provide('submitAnswer', function (callback, data) {
                console.log(data);
                if(typeof callback === 'function'){
                    callback(true);
                }
            });

            game.provide('onOverGame', function (setEnd, score, timeLeft) {
                console.log("score: " + score + " timeLeft: " + timeLeft);
                if(typeof setEnd === 'function'){
                    setEnd(score, timeLeft);
                }
            });

            game.on('state', function (data) {
                if (data.state === 'End') {
                    data.button.hide = false;
                    data.button.callback = function (options) {
                        console.log('callback', options);
                    }
                }
            });

            game.on('setData', function (data) {
                console.log(data);
            });

            game.on('click.startGame', function () {
                game.goState('Game');
            });

            game.on('error', function (data) {
                console.log(data);
            });

            game.on('click.endGame', function (data) {
                console.log(data);
            });

            game.off('boot');
        }
    });
});