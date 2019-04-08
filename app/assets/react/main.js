/**
 * Created by tanmv on 19/05/2017.
 */
function getName(name){
	alert('-> ' + name);
}
var Menu = React.createClass({
	add(){
		var state = this.state;
		state.total++;
		this.setState(state);
	},
	name(){
		getName(this.props.ten);
	},
	laythongtin(){
		alert(this.props.children);
	},
	getInitialState(){
		return {
			total: this.props.total,
			name: this.props.ten
		};
	},
	render(){
		return(
			<div>
				<h1>Trangnguyen.edu.vn {this.props.ten} - {this.props.children} - {this.state.total}</h1>
				<button onClick={this.laythongtin}>Click</button>
				<button onClick={this.name}>Click 2</button>
				<button onClick={()=>{getName(this.props.ten)}}>Click 3</button>
				<button onClick={this.add}>+1</button>
			</div>
		);
	},
	componentDidMount(){
		//ajax get state
		var self = this;
		setInterval(function () {
			var state = self.state;
			state.total++;
			self.setState(state);
		},1000);
	}
});

var InputTag = React.createClass({
	show(){
		alert(this.refs.txt.value);
	},
	change(){
		var state = this.state;
		state.ddl = this.refs.ddl.value;
		this.setState(state);
	},
	getInitialState(){
		return {
			ddl: 1
		};
	},
	render(){
		return(<div>
			<input type="text" ref="txt"/>
			<select ref="ddl" onChange={this.change}>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
			</select>
			<button onClick={this.show}>Hien thi</button> - {this.state.ddl}
		</div>
		);
	}
});

var Wrapper = React.createClass({
	getInitialState(){
		return {a: [1,2,3,4]};
	},
	render: function(){
		return(
			<div>
				<h1>Trangnguyen</h1>
				{
					this.state.a.map(function(val,index){
						return (<span key={index}> {val}</span>);
					})
				}
			</div>
		);
	}
});

//ReactDOM.unmountComponentAtNode(document.querySelector('#'));

ReactDOM.render(
		<div>
			<Wrapper/>
			<Menu ten="name1" total="10">a</Menu>
			<Menu ten="name2" total="20">b</Menu>
			<InputTag/>
		</div>
	,document.querySelector('#root'));