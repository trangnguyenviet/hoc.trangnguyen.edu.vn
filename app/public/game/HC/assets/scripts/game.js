/**
 * Created by hwngvnd on 7/11/15.
 */

typeof(TVUB) === 'undefined' ? TVUB = {} : '';

TVUB.Game = function (game) {
    /*
     *   _game: game api
     * */
    var _game = game,
        _gameOptions;

    _gameOptions = _game.options;

    //PRELOAD
    this.initState = function () {
    };

    this.initState.prototype = {
        create: function () {
            var gameData = _game.gameData;
            _this = this;

            //check data
            if (!gameData.content || gameData.content.length === 0) {
                _game.triggerEventListener('error', {
                    action: 'NoData',
                    message: 'Không có dữ liệu!'
                });
                return false;
            }
            this.bg = this.add.image(0, 0, 'background');
            this.bg.width = _game.aw;
            this.bg.height = _game.ah;

            _game.hideLoading();
            _game.createUserInfo.apply(this, [this.getTextureAtlas("bgAvatar"), this.getTextureAtlas('avatar')]);

            this.initGame();
        },

        preload: function () {
            _game.sounds.play('transition');
            _game.state = {
                state: _game.stateList.GAME,
                ref: this
            };

            for (var i = 0; i < _game.gameData.content.length; i++) {
                var quest = _game.gameData.content[i];
                for (var j = 0; j < quest.length; j++) {
                    var mcCross = quest[j];
                    if (mcCross.type === 'image') {
                        this.load.image(mcCross.content, mcCross.content);
                    }
                }
            }

        },

        createTiger: function (dau, than, tayPhai, tayTrai) {
            var tiger = _game.createAtlasObject.apply(this, [[
                {
                    image: this.getTextureAtlas(tayTrai),
                    animation: false
                }, {
                    image: this.getTextureAtlas(tayPhai),
                    animation: false
                }, {
                    image: this.getTextureAtlas(than),
                    animation: false
                }, {
                    image: this.getTextureAtlas(dau),
                    animation: true
                }
            ]]);
            tiger.x = 165;
            tiger.y = _game.hh + 190;
            return tiger;
        },

        startTimer: function () {
            this.timerGroup = this.game.add.group();
            this.timerGroup.x = _game.hw - 70;
            this.timerGroup.y = -100;
            this.timerText = this.add.text(0, 0, "00:00", {
                font: "40px Arial",
                fill: "#000",
                align: 'center',
                stroke: '#F2F2F2',
                strokeThickness: 4,
                wordWrapWidth: 200,
                wordWrap: true
            });

            this.timerText.anchor.set(0.5);
            this.timerText.x = 70;
            this.timerText.y = 34;
            this.timerGroup.add(this.timerText);
            this.game.add.tween(this.timerGroup).to({y: 10}, 500, Phaser.Easing.Back.Out, true);
            this.timer = setInterval(function () {
                _this.updateTimer();
            }, Phaser.Timer.SECOND);
        },

        updateTimer: function () {
            this.timmeLeft -= 1;
            var sec_num = parseInt(this.timmeLeft, 10); // don't forget the second param
            if (sec_num > 0) {
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                this.timerText.setText(minutes + ':' + seconds);
            } else {
                clearInterval(this.timer);
                this.finishGame();
            }
        },

        getTextureAtlas: function (name) {
            var sprite = this.add.sprite(0, 0, 'game_atlas');
            sprite.frameName = name;
            return sprite;
        },

        destroyGroup: function (group) {
            if (group && group.destroy) {
                group.destroy();
            }
        },

        hanlerOverButton: function (button) {
            this.game.add.tween(button.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true);
        },

        hanlerOutButton: function (button) {
            this.game.add.tween(button.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);
        },

        finishGame: function () {
            _game.onOverGame(this.setEnd, this.score, this.timmeLeft);

        },

        setEnd: function (score, time_left) {
            _game.sounds.play('transition');

            _game.gameData.score = score;
            _game.gameData.time_left = time_left;

            $('#answer-txt').remove();
            clearTimeout(this.timeout);
            clearTimeout(this.timeoutEndGame);
            clearTimeout(this.timer);
            this.timeoutEndGame = setTimeout(function () {
                _this.game.state.start('End');
            }, 300);
        },

        //==============================================================================================================
        //==============================================================================================================
        //==============================================================================================================
        initGame: function () {
            this.space = 5;
            this.maxCross = 8;
            this.timmeLeft = _game.gameData.time_left;
            this.score =  _game.gameData.score;
            this.life = _game.gameData.life || 3;
            this.addScore = _game.gameData.addScore || 10;
            var countAnswer = _game.gameData.count_win;
            this.curQuest = _game.gameData.content.length - countAnswer;

            this.showStateObject("idle");
            this.playQuest(this.curQuest);
            this.startTimer();
            this.initButtonNextQuest();

            _game.updateScore.apply(this, [this.score]);
        },

        initButtonNextQuest: function () {
            this.btnNextQuest = this.getTextureAtlas("btnNopBai");
            this.btnNextQuest.x = _game.hw + 300;
            this.btnNextQuest.y = _game.hh + 200;
            this.btnNextQuest.anchor.set(0.5);
            this.btnNextQuest.inputEnabled = true;
            this.btnNextQuest.input.pixelPerfectClick = true;
            this.btnNextQuest.input.useHandCursor = true;
            this.btnNextQuest.events.onInputDown.add(this.onNextQuest, this);
            this.btnNextQuest.events.onInputOver.add(this.hanlerOverButton, this);
            this.btnNextQuest.events.onInputOut.add(this.hanlerOutButton, this);
        },

        onEnableDragCross: function (isDrag) {
            for (var i = 0; i < this.ctnStartCross.children.length; i++) {
                var mcCross = this.ctnStartCross.children[i];
                var bg = mcCross.getChildAt(0);
                if (!isDrag) {
                    bg.input.disableDrag();
                } else {
                    bg.input.enableDrag();
                }
            }
        },

        onNextQuest: function () {
            _game.sounds.play('click');
            var arrQuest = [];
            this.btnNextQuest.inputEnabled = false;
            this.btnNextQuest.input.pixelPerfectClick = false;
            this.btnNextQuest.input.useHandCursor = false;
            this.onEnableDragCross(false);

            for (var i = 0; i < this.vtAnswer.length; i++) {
                if (this.vtAnswer[i] !== null) {
                    arrQuest.push(this.vtAnswer[i].group.idxAnswer);
                } else {
                    arrQuest.push(-1);
                }
            }
            _game.submitAnswer(this.reponseAnswer.bind(this), arrQuest);
        },

        reponseAnswer: function (result) {
            this.showAnswer(result);
            if (result) {
                this.score += this.addScore;
                _game.updateScore.apply(this, [this.score]);
                _game.sounds.play('answerOk');
            } else {
                _game.sounds.play('answerFail');
                this.life--;

            }
            this.timeout = setTimeout(function () {
                if(this.life <= 0){
                    this.finishGame();
                    return;
                }
                
                this.curQuest++;
                if (this.curQuest < _game.gameData.content.length) {
                    this.btnNextQuest.inputEnabled = true;
                    this.btnNextQuest.input.pixelPerfectClick = true;
                    this.btnNextQuest.input.useHandCursor = true;
                    this.playQuest(this.curQuest);
                } else {
                    this.finishGame();
                }
            }.bind(this), 2000);
        },

        showAnswer: function (isOk) {
            if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            this.dropText = (isOk) ? this.getTextureAtlas("txtYes") : this.getTextureAtlas("txtNo");
            this.dropText.anchor.set(0.5);
            this.dropText.x = 300;
            this.dropText.y = _game.hh + 100;
            this.game.add.tween(this.dropText).to({y: _game.hh + 180}, 300, Phaser.Easing.Back.Out, true);

            var state = (isOk) ? "happy" : "bad";
            this.showStateObject(state);
            this.timeout = setTimeout(function () {
                this.showStateObject("idle");
                if (this.dropText && this.dropText.destroy) this.dropText.destroy();
            }.bind(this), 2000);
        },


        showStateObject: function (state) {
            if (this.tiger && this.tiger.destroy) {
                this.tiger.destroy();
            }
            switch (state) {
                case "idle":
                    this.tiger = this.createTiger("v_dau", "v_than", "v_phai", "v_trai");
                    break;
                case "happy":
                    this.tiger = this.createTiger("ng_dau", "ng_than", "ng_phai", "ng_trai");
                    break;
                case "bad":
                    this.tiger = this.createTiger("b_dau", "b_than", "b_phai", "b_trai");
                    break;
            }
        },

        playQuest: function (questIndex) {
            this.curQuest = questIndex;
            var quest = _game.gameData.content[questIndex];
            this.destroyGroup(this.ctnStartCross);
            this.destroyGroup(this.ctnEndCross);
            this.vtAnswer = [];

            this.ctnEndCross = this.createCross(quest, false);
            this.ctnStartCross = this.createCross(quest, true);

            this.sortCrossGroupList(this.ctnStartCross);
            this.sortCrossGroupList(this.ctnEndCross);

            var maxWidth = this.ctnStartCross.children[0].width;
            this.ctnStartCross.x = _game.aw / 2 - this.ctnStartCross.width / 2;
            this.ctnStartCross.y = 130;
            this.ctnEndCross.x = this.ctnStartCross.x + maxWidth + this.space;
            this.ctnEndCross.y = 280;

            if (quest.length >= this.maxCross) {
                this.ctnEndCross.x = this.ctnStartCross.x;
            } else if (this.ctnEndCross.x + this.ctnEndCross.width > _game.aw) {
                this.ctnEndCross.x = _game.aw - this.ctnEndCross.width;
            }

            this.hanlerEventListeners();
        },

        hanlerEventListeners: function () {
            for (var i = 0; i < this.ctnStartCross.children.length; i++) {
                var mcCross = this.ctnStartCross.children[i];
                var bg = mcCross.getChildAt(0);
                var content = mcCross.getChildAt(1);
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.physics.arcade.enable(bg);
                bg.content = content;
                bg.group = mcCross;
                bg.inputEnabled = true;
                bg.input.enableDrag();
                bg.originalPosition = bg.position.clone();
                bg.group.originalPosition = bg.group.position.clone();

                bg.events.onDragStart.add(this.startStartDrag, this);
                bg.events.onDragStop.add(this.startStopDrag, this);
            }
        },

        startStartDrag: function (curSprite) {
            if (this.curSprite) {
                this.curSprite.position.copyFrom(this.curSprite.originalPosition);
                // this.curSprite.group.position.copyFrom(this.curSprite.group.originalPosition);
            }
            this.curSprite = curSprite;
            this.ctnStartCross.bringToTop(this.curSprite.group);
            for (var i = 0; i < this.vtAnswer.length; i++) {
                if (this.vtAnswer[i] === this.curSprite) {
                    this.vtAnswer[i] = null;
                }
            }
        },

        startStopDrag: function () {
            var mouseX = _this.game.input.x;
            var mouseY = _this.game.input.y;
            this.curSprite.position.copyFrom(this.curSprite.originalPosition);
            if (mouseX >= this.ctnEndCross.x &&
                mouseX <= this.ctnEndCross.x + this.ctnEndCross.width &&
                mouseY >= this.ctnEndCross.y &&
                mouseY <= this.ctnEndCross.y + this.ctnEndCross.height
            ) {
                var mWidth = this.ctnEndCross.children[0].width + this.space;
                var index = Math.floor((mouseX - this.ctnEndCross.x) / mWidth);
                var mcCross = this.ctnEndCross.children[index];
                var spx = this.ctnEndCross.x - this.ctnStartCross.x;
                var spy = this.ctnEndCross.y - this.ctnStartCross.y;
                if (this.vtAnswer[mcCross.idxAnswer] !== null) {
                    var oldSprite = this.vtAnswer[mcCross.idxAnswer];
                    oldSprite.position.copyFrom(oldSprite.originalPosition);
                    oldSprite.group.position.copyFrom(oldSprite.group.originalPosition);
                    this.updateContentPosition(oldSprite, oldSprite.content);
                }
                this.curSprite.group.x = spx + mcCross.x;
                this.curSprite.group.y = spy;
                this.vtAnswer[mcCross.idxAnswer] = this.curSprite;
            } else {
                this.curSprite.group.position.copyFrom(this.curSprite.group.originalPosition);
            }
            this.updateContentPosition(this.curSprite, this.curSprite.content);
            this.curSprite = null;
        },

        createCross: function (listQuest, isShow) {
            var crossGroupList = _this.game.add.group();

            for (var i = 0; i < listQuest.length; i++) {
                var quest = listQuest[i];
                var crossGroup = _this.game.add.group();
                var bg = this.getTextureAtlas("bgCross");
                var content = null;

                if (quest.type === 'image') {
                    content = _this.game.add.image(0, 0, quest.content);
                    //content.anchor.set(0.5);
                    content.width = bg.width - 12;
                    content.height = bg.height - 12;
                } else {
                    content = _this.game.add.text(0, 0, quest.content, {
                        font: "21px Arial",
                        fill: "#000000",
                        align: 'center',
                        stroke: '#FFFFFF',
                        strokeThickness: 4,
                        wordWrapWidth: 90,
                        wordWrap: true
                    });
                    //content.anchor.set(0.5);
                    content.setShadow(3, 3, 'rgba(0,0,0,0.1)', 5);
                    content.lineSpacing = -10;
                }

                if (isShow) {
                    content.alpha = 1;
                } else {
                    content.alpha = 0;
                    bg.alpha = 1;
                    this.vtAnswer[i] = null;
                }
                this.updateContentPosition(bg, content);
                crossGroup.idxAnswer = i;
                crossGroup.add(bg);
                crossGroup.add(content);
                crossGroupList.add(crossGroup);
            }

            return crossGroupList;
        },

        updateContentPosition: function (bg, content) {
            content.x = bg.x + bg.width / 2 - content.width / 2;
            content.y = bg.y + bg.height / 2 - content.height / 2;
        },

        sortCrossGroupList: function (crossGroupList) {
            for (var i = 0; i < crossGroupList.children.length; i++) {
                var mcCross = crossGroupList.children[i];
                mcCross.x = (mcCross.width + this.space) * i;
                mcCross.alpha = 0;
                _this.game.add.tween(mcCross).to({alpha: 1, y: 0}, 300, Phaser.Easing.Back.Linear, true, i * 100);
            }
        },

        update: function () {
            if (this.curSprite) {
                this.updateContentPosition(this.curSprite, this.curSprite.content);
            }
        }
    };
};