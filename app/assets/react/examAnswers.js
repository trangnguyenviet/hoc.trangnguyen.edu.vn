/**
 * Created by tanmv on 06/06/2017.
 */
(function(){
	var gameBody, gameFooter, gameScore, gameCount, gameTime;
	var GameBody = React.createClass({
		set(q){
			q.o=false;
			q.u=false;
			q.uas = undefined;
			q.question = q.question.replace(/\{\}/g,'...');
			if(q.type==1) {
				$('#game input[name="mvt"]').prop('checked', false);
			}else{
				$('#game input[type="text"]').val('');
			}
			this.setState(q);
		},

		getInitialState(){
			return {
				question:'',
				answer:['','','',''],
				answered:'0',
				the_answer:'',
				type:'1',
				o: false, // true: open | false: close
				u: false, // kết quả đáp án true/false
				b: false, // begin
			}
		},

		setBegin(){
			this.state.b = true;
		},

		as(cb){
			var state = this.state;
			var uas = (this.state.type==1)?$('#game input[name="mvt"]:checked').val(): this.refs.uas.value.trim();
			state.u = state.answered == uas;
			state.o = true;
			cb(state.u);
			this.setState(state);
		},

		answerChanged(index){
			gameFooter.has(true);
		},

		keyup(e){
			if(this.refs.uas.value.trim()!=''){
				gameFooter.has(true);
				if(e.keyCode==13){
					gameFooter.answer();
				}
			}
			else{
				gameFooter.has(false);
			}
		},

		getHtml(html){
			return {__html: html};
		},

		render(){
			var self = this;
			var show = this.state.o && !this.state.u;
			return(
				<div className="panel-body">
					{
						this.state.b?(
								<div>
									<div className="row">
										<div className="col-xs-12 question" dangerouslySetInnerHTML={this.getHtml(this.state.question)}></div>
									</div>
									<div className="row">
										<div className="col-xs-12">
											{
												(this.state.type==1)?
													this.state.answer.map(function(val,index){
														return (
															<div className="radio icheck-nephritis" key={index}>
																<label>
																	<input type="radio" onChange={()=>self.answerChanged(index)} disabled={self.state.o} value={index} name="mvt"/>
																	{
																		(show && index == self.state.answered)? (<i className="fa fa-check text-success" ></i>):('')
																	}
																	<span dangerouslySetInnerHTML={self.getHtml(val)}></span>
																</label>
															</div>
														);
													}):(
														<div className="form-group">
															<label>Đáp &nbsp; án của bạn:</label>
															<input ref="uas" onKeyUp={e=>this.keyup(e)} disabled={show} className="form-control input-lg" type="text"/>
														</div>
													)
											}
										</div>
									</div>
									{
										show?(
												<div>
													<div className="row">
														<div className="col-xs-12">
															<div className="alert alert-danger alert-dismissable" role="alert">
																<a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
																<strong>Ôi!</strong> &nbsp;Câu&nbsp; trả&nbsp; lời&nbsp; sai&nbsp; rồi
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-xs-12 the-answer" dangerouslySetInnerHTML={this.getHtml(this.state.the_answer)}></div>
													</div>
												</div>
											):(
												''
											)
									}
								</div>
							):(
								<div class="jumbotron">
									<h1>{{name}}</h1>
									<p dangerouslySetInnerHTML={this.getHtml('{{{description}}}')}></p>
								</div>
							)
					}

				</div>
			);
		},
		componentDidMount(){
			gameBody = this;
		}
	});

	var GameFooter = React.createClass({
		getInitialState(){
			return {
				s: false, //show answer
				e: false, //end game
				h: false, //has answer
				b: false //begin
			}
		},
		has(h){
			if(this.state.h!=h){
				this.state.h = h;
				this.setState(this.state);
			}
		},
		answer(){
			var self = this;
			gameBody.as(function(result){
				if(!result){
					self.state.s = !result;
					self.setState(self.state);
				}
				else{
					gameScore.add({{spq}});
					setTimeout(function(){
						self.next();
					},100);
				}
			});
		},
		next(){
			var q = this.state.content.shift(); //question
			if(q){
				this.state.s = false;
				this.state.h = false;
				this.setState(this.state);
				gameCount.next();
				gameBody.set(q);
			}
			else{
				this.state.e=true;
				this.setState(this.state);
				this.end();
			}
		},
		exit(){
			if(window.history) window.history.go(-1);
			else{
				var l = window.location.pathname.split(/\//g);
				l.pop();
				window.location.href=l.join('/');
			}
		},
		begin(){
			var self = this;
			this.state.b = true;
			this.setState(this.state);
			gameBody.setBegin();
			setTimeout(function(){
				var q = self.state.content.shift();
				if(q){
					gameBody.set(q);
					gameCount.set(1,{{play}});
					gameTime.set({{time}},function(){
						self.end();
					});
				}
				else{
					Alert('Không có câu hỏi');
				}
			},100);
		},
		end(){
			gameTime.stop();
			var time = gameTime.get();
			var score = gameScore.get();
			Alert('Điểm: ' + score + '<br/>Thời gian: ' + gameTime.s2m(time), 'Điểm thi');
		},
		ra(arr, n) { //random array
			if (n <= arr.length) {
				var out = [];
				var clone = arr.slice();
				for (var i = 0; i < n; i++) {
					var id = Math.floor(Math.random() * clone.length);
					out.push(clone[id]);
					clone.splice(id, 1);
				}
				return out;
			}
			else {
				return null;
			}
		},
		render(){
			return(
				<div className="panel-footer text-center">
					{
						this.state.b?(
								this.state.e?(
										<button onClick={this.exit} type="button" className="btn btn-danger btn-lg"><i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp; Trở &nbsp; về</button>
									):(
										this.state.s?(
												<button onClick={this.next} type="button" className="btn btn-warning btn-lg"><i className="fa fa-step-forward" aria-hidden="true"></i>&nbsp; Câu &nbsp; tiếp&nbsp; theo</button>
											):(
												<button disabled={!this.state.h} onClick={this.answer} type="button" className="btn btn-success btn-lg"><i className="fa fa-check" aria-hidden="true"></i>&nbsp; Trả&nbsp; lời</button>
											)
									)
							):(
								<button onClick={this.begin} type="button" className="btn btn-success btn-lg"><i className="fa fa-play" aria-hidden="true"></i>&nbsp; Bắt&nbsp; đầu</button>
							)
					}
				</div>
			);
		},
		componentDidMount(){
			gameFooter = this;
			var c = crt;
			var s= '{{{info}}}';
			var n = parseInt(s.substring(s.length-2));
			var q = s.substring(0,n);
			this.i = JSON.parse(c.AES.decrypt(s.substring(n,s.length-2), 'MVT2017' + q).toString(c.enc.Utf8));
			this.state.content = this.ra(this.i.content,{{play}});
		}
	});

	var GameScore = React.createClass({
		add(o){
			this.state.score+=o;
			this.setState(this.state);
		},
		get(){
			return this.state.score;
		},
		getInitialState: function(){
			return {score: 0}
		},
		render: function(){
			return(
				<div className="panel-body">
					<h2 className="text-center">{this.state.score}</h2>
				</div>
			);
		},
		componentDidMount(){
			gameScore = this;
		}
	});

	var GameCount = React.createClass({
		set(c,t){
			this.state.c = c;
			this.state.t = t;
			this.setState(this.state);
		},
		next(){
			this.state.c++;
			this.setState(this.state);
		},
		getInitialState: function(){
			return {c: 0, t: 0}
		},
		render: function(){
			return(
				<div className="panel-body">
					<h2 className="text-center">{this.state.c}/{this.state.t}</h2>
				</div>
			);
		},
		componentDidMount(){
			gameCount = this;
		}
	});

	var GameTime = React.createClass({
		set(t,cb){
			var self = this;
			this.state.tRun = setInterval(function () {
				var state = self.state;
				state.time++;
				state.d=self.s2m(t-state.time);
				self.setState(state);
				if(state.time==t){
					self.stop();
					cb();
				}
			},1000);
		},
		get(){
			return this.state.time;
		},
		stop(){
			clearInterval(this.state.tRun);
		},
		s2m(t) {
			var m = Math.floor(t / 60);
			var s = t - (m * 60);
			if (m < 10) m = '0' + m;
			if (s < 10) s = '0' + s;
			return m + ':' + s;
		},
		getInitialState: function(){
			return {time: 0, d: '00:00'}
		},
		render: function(){
			return(
				<div className="panel-body">
					<h2 className="text-center">{this.state.d}</h2>
				</div>
			);
		},
		componentDidMount(){
			gameTime = this;
		}
	});

	ReactDOM.render(
		<div>
			<div className="col-xs-10">
				<div className="panel panel-warning">
					<div className="panel-heading"><strong>{{name}}</strong></div>
					<GameBody/>
					<GameFooter/>
				</div>
			</div>
			<div className="col-xs-2">
				<div className="panel panel-danger">
					<div className="panel-heading text-center"><strong>Điểm thi</strong></div>
					<GameScore/>
				</div>
				<div className="panel panel-danger">
					<div className="panel-heading text-center"><strong>Câu hỏi</strong></div>
					<GameCount/>
				</div>
				<div className="panel panel-danger">
					<div className="panel-heading text-center"><strong>Thời gian</strong></div>
					<GameTime/>
				</div>
			</div>
		</div>,document.querySelector('#game'));
})();