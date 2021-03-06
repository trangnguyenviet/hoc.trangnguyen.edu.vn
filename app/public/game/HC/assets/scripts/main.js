/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

(function () {
    var Game = IGame.core;

    var g = new Game({
        container: '#container',
        baseUrl: 'assets/',
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
            rule: 'Em hãy giúp Hổ Vàng sắp xếp lại vị trí các ô trống để thành câu hoặc phép tính phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.'
        },
        sound: true,
        autoLoad: true,
        ready: function (game) {
            var data = {
                "title": "Em hãy giúp Hổ Vàng sắp xếp lại vị trí các ô trống để thành câu hoặc phép tính phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "deception": "Em hãy giúp gà con sắp xếp các giá trị trong ô trống theo thứ tự từ bé đến lớn hoặc trật tự các từ để tạo câu có nghĩa. Nếu sai quá 3 lần bài thi sẽ dừng lại.",
                "time": 1200,
                "time_left":900,
                "play": 10,
                "score":0,
                "game_id": 4,
                "game_name": "Hổ con",
                "addScore":10,
                "life":3,
                "count_win":10,
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
                            content: 'Sơn'
                        },
                        {
                            type: 'text',
                            content: 'Sơn'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
                    [
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '3'
                        },
                        {
                            type: 'image',
                            content: 'assets/images/orientation.jpg'
                        },
                        {
                            type: 'text',
                            content: '2'
                        }
                    ],
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
                    callback(false);
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
})();