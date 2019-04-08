/**
 * Created by tanmv on 03/07/2018.
 */
(function(den, type_id, round_id, test_id, user_id, desc, file_static, crt){
	round_id = util.parseInt(round_id);
	test_id = util.parseInt(test_id);
	// var t1, t2, tRun;

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
			baseUrl: file_static + '/game/HC/assets/',
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
				callback(game);
				game.off('boot');
			}
		});
	};

	var endGame = function(test_id,data_score,key_store_score){
		if(test_id === 3){
			var total_score = 0;
			var total_time = 0;
			var html = '';
			for(var i = 1; i <= 3; i++){
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

	// run application
	var n = parseInt(den.substring(den.length-2));
	var key = den.substring(0,n);
	var exam_info = JSON.parse(crt.AES.decrypt(den.substring(n,den.length-2), 'MVT2017' + key).toString(crt.enc.Utf8));

	if(exam_info){
		var collection_answers = [];
		var collection_index = [];
		var contents = util.randomArray(exam_info.content, exam_info.play);

		contents.forEach(function(q, index) {
			var qlength = q.length;
			var arr = [];
			q.forEach(function(_info, index){
				arr.push(index);
			});
			var qr = util.randomListArray(q, arr, qlength);
			collection_answers.push(qr.list_1);
			collection_index.push(qr.list_2);
		});

		var data_game = {
			// content: questions.list_1,
			// time:exam_info.time,
			// timeLeft:exam_info.time,
			// currentAnswers:[],
			currentScore: 0,
			// play: exam_info.play,
			// currentIndex:0,
			wrongCount: 0,
			// answereds: [[],[]]
			time: exam_info.time,
			time_left: exam_info.time,
			play: exam_info.play,
			score: 0,
			game_id: 7,
			addScore: 10,
			life: 3,
			count_win: 10,
			game_name: 'Hổ con',
			content: collection_answers,
			answereds: []
		};

		init('#tn-game', file_static, function(game){
			game.setGameData({
				title: 'Em hãy giúp Hổ Vàng sắp xếp lại vị trí các ô trống để thành câu hoặc phép tính phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.',
				deception: 'Em hãy giúp gà con sắp xếp các giá trị trong ô trống theo thứ tự từ bé đến lớn hoặc trật tự các từ để tạo câu có nghĩa. Nếu sai quá 3 lần bài thi sẽ dừng lại.'
			});

			// data_game.title = 'Em hãy giúp Hổ Vàng sắp xếp lại vị trí các ô trống để thành câu hoặc phép tính phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.';
			// data_game.deception = 'Em hãy giúp gà con sắp xếp các giá trị trong ô trống theo thứ tự từ bé đến lớn hoặc trật tự các từ để tạo câu có nghĩa. Nếu sai quá 3 lần bài thi sẽ dừng lại.';
			// game.setGameData(data_game);

			var avatar = '{{user.avatar}}';
			game.provide('user', {
				username:'{{user.name}}',
				uid:'{{user._id}}',
				//avatar: (avatar!=''? file_static + '/avatar/' + avatar: 'https://placehold.it/100x100?text=no+avatar')
				avatar: '/game/HC/assets/images/avatar.png'//(avatar!=''? file_static + '/avatar/' + avatar: '/images/no_avatar.jpg')
			});

			var setData = function(data, callback){
				var content = data.content;
				for(var i = 0; i < content.length; i++){
					for(var j = 0; j < content[i].length; j++){
						if(content[i][j].type === 'latex'){
							content[i][j].type = 'image';
							content[i][j].content = '/latex/' + encodeURI(content[i][j].content); //.replace(/\$/g,'')
						}
					}
				}
				game.setGameData(data);
				if(callback && typeof callback === 'function') callback();
			};

			game.on('click.startGame', function () {
				setData(data_game, function(){
					// t1 = new Date();
					game.goState('Game');
				});
			});

			game.provide('submitAnswer', function (callback, data) {
				if(typeof callback === 'function'){
					var aswerRight = collection_index.shift();
					if(data && data.length > 0) {
						var bRight = true;
						for(var i = 0; i < data.length; i++) {
							bRight &= aswerRight[data[i]] === i
							if(!bRight) break;
						}
						callback(bRight);
					} else {
						callback(false);
					}
				}
			});

			game.on('state', function (data) {
				if (data.state === 'End') {
					data.button.hide = false;
					data.button.type = 'dong_y'; //thi_tiep, thi_lai, dong_y
					data.button.callback = function (options) {
						if(test_id < 3) window.location.href = 'bai-' + (util.parseInt(test_id)+1) + '.html';
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
				if(test_id < 3) window.location.href = 'bai-' + (util.parseInt(test_id)+1) + '.html';
			});
		});
	}
	else{
		Alert('không có bài thi cho vòng này');
	}
})('{{{exam}}}','{{{type_id}}}', '{{{round_id}}}', '{{{test_id}}}', '{{{user_id}}}','Em hãy giúp Hổ Vàng sắp xếp lại vị trí các ô trống để thành câu hoặc phép tính phù hợp. Nếu sai quá 3 lần bài thi sẽ dừng lại.','',crt);