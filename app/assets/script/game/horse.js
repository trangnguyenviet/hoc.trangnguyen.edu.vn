$(function(){
	(function(den, type_id, round_id, test_id, user_id, desc, file_static, crt){
		// type_id = util.parseInt(type_id);
		round_id = util.parseInt(round_id);
		test_id = util.parseInt(test_id);
		var t1, t2, tRun;

		var s2m = function(t){
			var m = Math.floor(t / 60);
			var s = t - (m * 60);
			if (m < 10) m = '0' + m;
			if (s < 10) s = '0' + s;
			return m + ':' + s;
		};

		var init = function(div, file_static, callback){
			var Game = IGame.core;
			new Game({
				container: div,//'#tn-game',
				baseUrl: file_static + '/game/NCDC/assets/',
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
					rule: desc
				},
				sound: true,
				autoLoad: true,
				ready: function (game) {
					// game.load.crossOrigin = '';
					callback(game);
					game.off('boot');
				}
			});
		};

		var endGame = function(test_id,data_score,key_store_score){
			if(test_id==3){
				var total_score = 0;
				var total_time = 0;
				var html = '';
				for(var i=1;i<=3;i++){
					if(data_score[i]){
						total_score += util.parseInt(data_score[i].score);
						total_time += util.parseInt(data_score[i].time);
						html += 'Bài: ' + (i) + '- Điểm: ' + data_score[i].score + ' - Thời gian: ' + s2m(data_score[i].time) + '<br/>';
					}
				}
				html = 'Tỗng điểm: ' + total_score + '<br/>' + html;
				html = 'Tổng thời gian: ' + s2m(total_time) + '<br/>' + html;
				var buttons = {};
				if(total_score>150){
					buttons.next = {
						label: "Thi tiếp",
						className: 'btn-warning',
						callback: function(){
							window.location.href='../vong-' + (util.parseInt(round_id) + 1) + '/bai-1.html';
						}
					};
					html += '(Bạn được thi vòng tiếp theo)';
				}
				else{
					buttons.rePlay = {
						label: "Thi lại",
						className: 'btn-warning',
						callback: function(){
							window.location.href='bai-1.html';
						}
					};
					html += '(Bạn chưa qua vòng này)';
				}
				buttons.exit = {
					label: "Thoát",
					className: 'btn-warning',
					callback: function(){
						window.location.href='../..';
					}
				};
				util.DelLocalStore(key_store_score);
				bootbox.dialog({
					title: 'Kết quả vòng thi',
					message: html,
					buttons: buttons
				});
			}
		};

		var saveScore = function(score,time){
			var key_store_score = crt.SHA256(type_id+'-'+round_id+'-'+user_id).toString();
			var data_score = util.ReadLocalStore(key_store_score,{});
			data_score = util.parseJson(data_score) || {};
			data_score[test_id] = {score: score,time: time};
			util.SaveLocalStore(key_store_score,data_score);
			setTimeout(function(){
				endGame(test_id,data_score,key_store_score);
			},1000);
		};

		var n = parseInt(den.substring(den.length-2));
		var key = den.substring(0,n);
		var exam_info = JSON.parse(crt.AES.decrypt(den.substring(n,den.length-2), 'MVT2017' + key).toString(crt.enc.Utf8));
		if(exam_info){
			// var collection_answers = [];
			// var collection_index = [];
			var contents = util.randomArray(exam_info.content,exam_info.play);
			// for(var i = 0; i <contents.length;i++){
			// 	collection_answers = collection_answers.concat(contents[i]);
			// 	for(var j=0;j<2;j++){//2=contents[i].length
			// 		collection_index.push(i);
			// 	}
			// }
			// var questions = util.randomListArray(collection_answers,collection_index,collection_answers.length);

			var listLeft = [], listRight = [];
			var listIndexLeft = [], listIndexRight = [];
			contents.forEach(function(_info, index) {
				listLeft.push(_info[0]);
				listRight.push(_info[1]);
				listIndexLeft.push(index);
				listIndexRight.push(index);
			});

			var objLeft = util.randomListArray(listLeft,listIndexLeft,listLeft.length);
			var objRight = util.randomListArray(listRight,listIndexRight,listRight.length);

			if(objLeft && objRight){
				var data_game = {
					// content: questions.list_1,
					// time:exam_info.time,
					// timeLeft:exam_info.time,
					// currentAnswers:[],
					currentScore:0,
					// play: exam_info.play,
					// currentIndex:0,
					wrongCount:0,
					// answereds: [[],[]]
					time: exam_info.time,
					time_left: exam_info.time,
					play: exam_info.play,
					score: 0,
					game_id: 7,
					addScore: 10,
					life: 3,
					count_win: 10,
					// game_name: 'Ngựa',
					content: [objLeft.list_1, objRight.list_1],
					answereds: [[],[]]
				};

				var listAnswerLeft = objLeft.list_2;
				var listAnswerRight = objRight.list_2;
				var currentScore = data_game.currentScore || 0;
				var wrongCount = data_game.wrongCount || 0;

				init('#tn-game', file_static, function(game){
					game.setGameData({
						title: 'Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.',
						deception: 'Em hãy giúp ngựa con nối các từ trong ô trống ở cột bên trái với ô trống ở cột bên phải để được một câu đúng và phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.',
					});

					var avatar = '{{user.avatar}}';
					game.provide('user', {
						username:'{{user.name}}',
						uid:'{{user._id}}',
						//avatar: (avatar!=''? file_static + '/avatar/' + avatar: 'https://placehold.it/100x100?text=no+avatar')
						avatar: '/game/NCDC/assets/images/avatar.png'//(avatar!=''? file_static + '/avatar/' + avatar: '/images/no_avatar.jpg')
					});

					var setData = function(data, callback){
						var content=data.content;
						for(var i=0;i<content.length;i++){
							for(var j=0;j<content[i].length;j++){
								if(content[i][j].type=='latex'){
									content[i][j].type='image';
									content[i][j].content='/latex/' + encodeURI(content[i][j].content); //.replace(/\$/g,'')
								}
							}
						}
						game.setGameData(data);
						if(callback && typeof callback === 'function') callback();
					};

					game.on('click.startGame', function () {
						setData(data_game, function(){
							t1 = new Date();
							game.goState('Game');
						});
					});

					game.provide('submitAnswer', function (callback, data) {
						//data: {idxLeft: 9, idxRight: 4}
						// console.log(data.idxLeft, listAnswerLeft[data.idxLeft]);
						// console.log(data.idxRight, listAnswerRight[data.idxRight]);
						if(typeof callback === 'function'){
							callback(listAnswerLeft[data.idxLeft] === listAnswerRight[data.idxRight]);
						}
					// 	//{index_1:answer1.index,index_2:answer2.index}
					// 	var result = list_answer[answer1.index] == list_answer[answer2.index];
					// 	callback(result);
					// 	var setEnd = function(){
					// 		t2 = new Date();
					// 		var time = Math.round((t2-t1)/1000);
					// 		game.goState('End',{
					// 			score: currentScore,
					// 			time: data_game.time,
					// 			timeLeft: (data_game.time - time),
					// 			// wrongCount: wrongCount
					// 		});
					// 		saveScore(currentScore, time);
					// 	};
					//
					// 	if(result){
					// 		currentScore+=10;
					// 		if(currentScore==100){
					// 			setEnd();
					// 		}
					// 	}
					// 	else{
					// 		wrongCount++;
					// 		if(wrongCount>3){
					// 			setEnd();
					// 		}
					// 	}
					});

					// game.on('must-finish', function (data_endgame) {
					// 		// console.log('must-finish',data_endgame);
					// 		//khi game xong client sẽ bắn fire báo cần kết thúc game
					// 		//cái này có thể dùng hoặc không
					// 		// data.action: timeup, done (hết giờ, hoàn thành bài)
					// 	console.log('end game:',data_endgame);
					// 		// g.goState('End',data_endgame);
					// 	{action: 'done', mesage: 'Hoàn thành bài!', option:{score: 70, time: 1200, timeLeft: 1181}}
					// });

					game.on('state', function (data) {
						if (data.state === 'End') {
							data.button.hide = false;
							data.button.type = 'dong_y'; //thi_tiep, thi_lai, dong_y
							data.button.callback = function (options) {
								if(test_id<3) window.location.href = 'bai-' + (util.parseInt(test_id)+1) + '.html';
							}
						}
					});

					game.provide('onOverGame', function (setEnd, score, timeLeft) {
						if(typeof setEnd === 'function'){
							setEnd(score, timeLeft);
						}
						saveScore(score, exam_info.time - timeLeft);
					});

					game.on('click.endGame', function () {
						if(test_id<3) window.location.href = 'bai-' + (util.parseInt(test_id)+1) + '.html';
					});
				});
			}
			else{
				//đề lỗi
				Alert('Xin lỗi <br/> đề lỗi hãy báo lại với ban quản trị');
				callback(true,data);
			}
		}
		else{
			Alert('không có bài thi cho vòng này');
		}
	})('{{{exam}}}','{{{type_id}}}', '{{{round_id}}}', '{{{test_id}}}', '{{{user_id}}}','Hãy ghép 2 ô trống chứa nội dung tương đồng hoặc bằng nhau thành cặp đôi. Sai quá 3 lần bài thi kết thúc.','',crt);
});