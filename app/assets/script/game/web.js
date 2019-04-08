var div_questions = $('#div_questions');
var count_down = $('#count_down');
var bt_endgame = $('#bt_endgame');
var type_id='{{{type_id}}}',round_id=util.parseInt('{{{round_id}}}'),test_id=util.parseInt('{{{test_id}}}'),user_id='{{{user_id}}}';
var t1,t2,tt,itv, lq, law, key_store='';

var setData = function(data,callback){
	tt = data.time;
	t1 = data.timeLeft || data.time;
	var value_store = getDataLocal();
	if (data.content) {
		lq = data.content;
		var html='';
		$.each(lq, function (index, item) {
			html += '<article>';
			html += '<h3> Câu hỏi ' + (index+1) + ':</h3><div class="full-right" id="as-'+index+'"></div>';
			var q = item.question;
			var store_obj = value_store[index];
			if (item.type == undefined || item.type == "1") {
				var matchs = q.match(/\{img:.+\}/gi);
				if (matchs != null) {
					$.each(matchs, function (i, val) {
						var src = val.substr(5, val.length - 6);
						q = q.replace(val, '<img src="' + src + '"/>');
					});
				}
				matchs = q.match(/\$(-)?\d*\\\w+\{\d+\}(\{\d+\})?\$/g);
				if (matchs != null) {
					$.each(matchs, function (i, val) {
						var src = '/latex/' + encodeURI(val.replace(/\$/g,''));
						q = q.replace(val, '<img src="' + src + '"/>');
					});
				}
				var vals = (store_obj && store_obj.type==1)?store_obj.value:null;
				html += '<p>' + q + '</p>';
				// html+='<p class="tn-answer tn-answer-image">';
				$.each(item.answer, function (i, val) {
					html+='<div class="radio icheck-wisteria">';
					if(vals && vals==i) html += '<input qid="'+index+'" id="answer_' + index + '_' + i + '" name="answer_' + index + '" type="radio" value="' + i + '" checked/>';
					else html += '<input qid="'+index+'" id="answer_' + index + '_' + i + '" name="answer_' + index + '" type="radio" value="' + i + '" />';
					matchs = val.match(/\{img:.+\}/gi);
					if (matchs != null) {
						$.each(matchs, function (ix, imgsrc) {
							var src = imgsrc.substr(5, imgsrc.length - 6);
							val = val.replace(val, '<img src="' + src + '"/>');
						});
					}
					matchs = val.match(/\$(-)?\d*\\\w+\{\d+\}(\{\d+\})?\$/g);
					if (matchs != null) {
						$.each(matchs, function (ix, imgsrc) {
							var src = '/latex/' + encodeURI(imgsrc.replace(/\$/g,''));
							val = val.replace(val, '<img src="' + src + '"/>');
						});
					}

					html += '<label for="answer_' + index + '_' + i + '"><span></span>' + val + '</label>';
					html+='</div>';
				});
				// html+='</p>'
			}
			if (item.type == "2") {
				var matchs = q.match(/\{\}/gi);
				var vals = (store_obj && store_obj.type==2)?store_obj.value:'';
				if (matchs != null) {
					$.each(matchs, function (i, val) {
						q = q.replace(val, '<input qid="'+index+'" type="text" value="'+vals+'" class="answer_input_' + index + '"/>');
					});
					matchs = q.match(/\{img:.+\}/gi);
					if (matchs != null) {
						$.each(matchs, function (i, val) {
							var src = val.substr(5, val.length - 6);
							q = q.replace(val, '<img src="{{{server_upload}}}' + src + '"/>');
						});
					}
					matchs = q.match(/\$(-)?\d*\\\w+\{\d+\}(\{\d+\})?\$/g);
					if (matchs != null) {
						$.each(matchs, function (i, val) {
							var src = '/latex/' + encodeURI(val.replace(/\$/g,''));
							q = q.replace(val, '<img src="' + src + '"/>');
						});
					}
					html += '<p class="tn-question">' + q + '</p>';
				}
				else {
					html += '<p class="tn-question"><span style="color:red">#Error</span></p>';
				}
			}
			html += '</article>';
		});
		div_questions.html(html);
		tRun(t1);
		if(callback && typeof callback=='function'){
			callback();
		}
	}
	else{
		Alert('Không có nội dung bài thi');
	}
};

var endGame = function(data_score,key_store_score){
	if(test_id==3){
		var total_score = 0;
		var total_time = 0;
		var html = '';

		for(var i=1;i<=3;i++){
			if(data_score[i]){
				total_score += util.parseInt(data_score[i].score);
				total_time += util.parseInt(data_score[i].time);
				html += 'Bài: ' + (i) + '- Điểm: ' + data_score[i].score + ' - Thời gian: ' + data_score[i].time + '<br/>';
			}
		}
		html = 'Tổng thời gian: ' + total_time + '<br/>' + html;
		html = 'Tỗng điểm: ' + total_score + '<br/>' + html;

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
	else{
		var html = 'Bạn thi được: ' + data_score[test_id].score + ' điểm<br/>';
		html += 'Thời gian: ' + s2m(data_score[test_id].time);
		bootbox.dialog({
			title: 'Kết quả bài thi',
			message: html,
			buttons:{
				next: {
					label: "Thi tiếp",
					className: 'btn-warning',
					callback: function(){
						window.location.href='bai-' + (util.parseInt(test_id)+1) + '.html';
					}
				},
				view: {
					label: "Đáp án",
					className: 'btn-warning',
					callback: function(){
						bt_endgame.text('Thi tiếp').unbind('click').click(function(){
							window.location.href='bai-' + (util.parseInt(test_id+1)) + '.html';
						});
					}
				}
			}
		});
	}
};

var nopBai = function(){
	clearInterval(itv);
	div_questions.find('input').prop('disabled',true);
	var score = 0;
	$.each(lq, function (index, question) {
		var answer='';
		if (question.type == undefined || question.type == "1") {
			var selected = $("input[type='radio'][name='answer_" + index + "']:checked");
			if (selected.length > 0) {
				answer=selected.val();
			}
		}
		if (question.type == "2") {
			answer = $('.answer_input_' + index).val();
		}
		var kq = answer.toLocaleLowerCase()==law[index].toLocaleLowerCase();
		if(kq) score+=10;
		$('#as-' + index).text(kq?'(Đúng)':'(sai)');
	});

	var key_store_score = crt.SHA256(type_id+'-'+round_id+'-'+user_id).toString();
	var data_score = util.ReadLocalStore(key_store_score,{});
	data_score = util.parseJson(data_score);
	if(!data_score) data_score = {};
	data_score[test_id] = {score:score,time:(tt-t2)};
	util.SaveLocalStore(key_store_score,data_score);
	endGame(data_score,key_store_score);
	return false;
};

var getDataLocal = function(){
	return {};
	try{
		var data = util.ReadLocalStore(key_store,'');
		if(data && data!=''){
			var store_value = JSON.parse(data);
			if(store_value){
				var date = new Date();
				if(store_value.expire<date.getTime()){
					util.DelLocalStore(key_store);
					return {};
				}
				else{
					return store_value;
				}
			}
		}
		return {};
	}
	catch(e){
		console.error(e);
		return {};
	}
};

// var setDataLocal = function(){
// 	var date = new Date();
// 	date.setSeconds(date.getSeconds()+t2);
// 	value_store.expire = date.getTime();
// 	util.SaveLocalStore(key_store,value_store);
// };

var rla = function(arr,arr2, n){
	if(arr && arr2){
		if (n <= arr.length) {
			var arr_1 = [];
			var arr_2 = [];
			var clone1 = arr.slice();
			var clone2 = arr2.slice();
			for (var i = 0; i < n; i++) {
				var index = Math.floor(Math.random() * clone1.length);
				arr_1.push(clone1[index]);
				arr_2.push(clone2[index]);
				clone1.splice(index, 1);
				clone2.splice(index, 1);
			}
			return {l1:arr_1,l2:arr_2};
		}
		else {
			return null;
		}
	}
	else{
		return null;
	}
};

var tRun = function(time){
	t2 = time;
	itv = setInterval(function () {
		t2--;
		if (t2 <= 0) {
			clearInterval(itv);
			nopBai();
		}
		count_down.text(s2m(t2));
	}, 1000);
};

var s2m = function(t){
	var m = Math.floor(t / 60);
	var s = t - (m * 60);
	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;
	return m + ':' + s;
};

(function(s, c){
	var n = parseInt(s.substring(s.length-2));
	var q = s.substring(0,n);
	var i = JSON.parse(c.AES.decrypt(s.substring(n,s.length-2), 'MVT2017' + q).toString(c.enc.Utf8));
	var q = rla(i.content,i.answers,i.play);
	if(q){
		law=q.l2;
		i.content = q.l1;
		Alert('Bắt đầu làm bài nào!', 'Bạn đã sẵn sàng chưa?', function(){
			setData(i,function(){
				bt_endgame.prop('disabled', false).click(function(){
					Confirm('Bạn chắc chắn muốn nộp bài chứ?', 'Xác nhận', function(result){
						if(result) nopBai();
					});
				});
			});
		});
	}
	else{
		Alert('Không chọn được câu hỏi');
	}
})('{{{exam}}}', crt);