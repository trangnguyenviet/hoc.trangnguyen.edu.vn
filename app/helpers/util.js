'use strict';

let patent_random_srting = '0123456789abcdefghijklmnopqrstuvwxyz';
let patent_random_srting_length = patent_random_srting.length;

module.exports = {
	sha256: function(s){
		let crypto = require("crypto");
		let sha256 = crypto.createHash("sha256");
		sha256.update(s, "utf8");//utf8 here
		return sha256.digest("hex");
	},
	MD5: function(s){
		let crypto = require("crypto");
		let md5 = crypto.createHash("md5");
		md5.update(s, "utf8");//utf8 here
		return md5.digest("hex");
	},
	isIpV4: function(s){
		let pattern = /^(\-)?\d+(\.\d+)?$/;
		return pattern.test(s);  // returns a boolean
	},
	isOnlyNumber: function(s){
		let pattern = /\d+/;
		return pattern.test(s);  // returns a boolean
	},
	isNumber: function(s){
		let pattern = /^(\-)?\d+(\.\d+)?$/;
		return pattern.test(s);  // returns a boolean
	},
	isInt: function(s){
		let pattern = /^(\-)?\d+$/;
		return pattern.test(s);  // returns a boolean
	},
	isPhoneNumber: function(s){
		let pattern = /^0(9\d{8}|1\d{9})$/;
		return pattern.test(s);  // returns a boolean
	},
	isEmail: function(s){
		let pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return pattern.test(s);  // returns a boolean
	},
	hidenEmail: function(s,char){
		if(s){
			let n = s.indexOf('@');
			if(n>0){
				let s1 = s.substring(0,n);
				let s2 = s.substring(n);
				n = s1.length;
				if(!char) char = '*';
				let s11=s1.substring(0,Math.round(n/2));
				for(let i=Math.round(n/2);i<n;i++){
					s11+=char;
				}
				return s11+s2;
			}
			else
				return s;
		}
		return null;
	},
	isUsername: function(s){
		let pattern = /^[a-z][a-z0-9_]{4,19}$/;
		return pattern.test(s);  // returns a boolean
	},
	isPassword: function(s){
		let pattern = /^.{6,30}$/;
		return pattern.test(s);  // returns a boolean
	},
	isNameVi: function(s){
		let pattern = /^[a-zA-Z\s áàảãạăâắằấầặẵẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịđùúủũụưứửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼÊỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵỷỹ]{3,30}$/gi;
		return pattern.test(s);
	},
	validateUrl: function(url){
		let urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		return urlregex.test(url);
	},
	kodau: function(str){
		str= str.toLowerCase();
		str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
		str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ềrandomString|ế|ệ|ể|ễ/g,"e");
		str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
		str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
		str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
		str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
		str= str.replace(/đ/g,"d");
		str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
		/* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
		str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
		str= str.replace(/^\-+|\-+$/g,"");
		//cắt bỏ ký tự - ở đầu và cuối chuỗi
		return str;
	},

	// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
	isValidDate: function(s){
		// First check for the pattern
		if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s))
			return false;

		// Parse the date parts to integers
		let parts = s.split("/");
		let day = parseInt(parts[0], 10);
		let month = parseInt(parts[1], 10);
		let year = parseInt(parts[2], 10);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month == 0 || month > 12)
			return false;

		let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
			monthLength[1] = 29;

		// Check the range of the day
		return day > 0 && day <= monthLength[month - 1];
	},
	// Validates that the input string is a valid date formatted as "yyyy-mm-dd"
	isValidDate2: function(s){
		// First check for the pattern
		if(!/^\d{4}\-\d{2}\-\d{2}$/.test(s))
			return false;

		// Parse the date parts to integers
		let parts = s.split("-");
		let year = parseInt(parts[0], 10);
		let month = parseInt(parts[1], 10);
		let day = parseInt(parts[2], 10);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month == 0 || month > 12)
			return false;

		let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
			monthLength[1] = 29;

		// Check the range of the day
		return day > 0 && day <= monthLength[month - 1];
	},

	replaceHtml: function(s){
		if(s) return s.replace(/>/g, "&gt;").replace(/</g, "&lt;");
		return "";
	},

	StringFormat: function(s,arg){
		if(s && arg && arg.length && arg.length > 0 && (typeof s === 'string')){
			for(let i=0; i < arg.length; i++) {
				s = s.replace('{' + i + '}', arg[i]);
			}
		}
		return s;
	},

	//*********************parse data***********************//
	parseString: function(s,defaul){
		// let pattern = /^(\-)?\d+(\.\d+)?$/;
		// if(pattern.test(s)) return parseInt(s);
		// else if(defaul) return defaul;
		if(typeof(s)=='string') return s;
		if(s) return s.toString();
		return defaul;
	},

	parseInt: function(s,defaul){
		let pattern = /^(\-)?\d+(\.\d+)?$/;
		if(pattern.test(s)) return parseInt(s);
		else if(defaul) return defaul;
		return 0;
	},

	parseJson: function(s){
		try{
			return JSON.parse(s);
		}
		catch(e){
			return null;
		}
	},

	parseNumber: function(s,defaul){
		let pattern = /^(\-)?\d+(\.\d+)?$/;
		if(pattern.test(s)) return parseFloat(s);
		else if(defaul)return defaul;
		return 0
	},

	toString: function(obj,defaul){
		if(obj){
			return String(obj);
		}
		else{
			if(defaul) return defaul;
			return "";
		}
	},

	//date format dd/mm/yyyy
	parseDate: function(s,defaul){
		if(this.isValidDate(s)){
			let parts = s.split("/");
			let day = parseInt(parts[0], 10);
			let month = parseInt(parts[1], 10);
			let year = parseInt(parts[2], 10);

			return new Date(year,month -1,day);
		}
		if(defaul)return defaul;
		return null;
	},

	//yyyy-MM-dd HH:mm:ss
	date2String: function(date){
		if(date){
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hour = date.getHours();
			let minutes = date.getMinutes();
			let second = date.getSeconds();
			if(month<10) month ='0' + month;
			if(day<10) day='0'+day;
			if(hour<10) hour='0'+hour;
			if(minutes<10) minutes='0'+minutes;
			if(second<10) second='0'+second;
			return  year + '-' + month + '-' + day +' ' + hour + ':' + minutes + ':' + second;
		}
		return '';
	},

	//yyyyMMddHHmmss
	date2String2: function(date){
		if(date){
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hour = date.getHours();
			let minutes = date.getMinutes();
			let second = date.getSeconds();
			if(month<10) month ='0' + month;
			if(day<10) day='0'+day;
			if(hour<10) hour='0'+hour;
			if(minutes<10) minutes='0'+minutes;
			if(second<10) second='0'+second;
			return  year + '' + month + '' + day +'' + hour + '' + minutes + '' + second;
		}
		return '';
	},

	//dd/MM/yyy HH:mm:ss
	date2String3: function(date){
		if(date){
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hour = date.getHours();
			let minutes = date.getMinutes();
			let second = date.getSeconds();
			if(month<10) month ='0' + month;
			if(day<10) day='0'+day;
			if(hour<10) hour='0'+hour;
			if(minutes<10) minutes='0'+minutes;
			if(second<10) second='0'+second;
			return  day + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + second;
		}
		return '';
	},

	getMarks: function() {
		return this.MD5(this.randomString(5) + '-' + new Date().getTime())
	},

	randomString: function(n){
		// let patent = '0123456789abcdefghijklmnopqrstuvwxyz';
		// let patent_length = patent.length;
		let s = '';
		for(let i=0;i<n;i++){
			s+=patent_random_srting[Math.floor(Math.random()*patent_random_srting_length)];
		}
		return s;
	},
	randomInt: function(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	randomNumber: function(n){
		let patent = '0123456789';
		let patent_length = patent.length;
		let s = '';
		for(let i=0;i<n;i++){
			s+=patent[Math.floor(Math.random()*patent_length)];
		}
		return s;
	},

	getTokenCard: function(server_id,card_id,cardnumber,serial,datetime,capacity,key){
		let s = this.StringFormat('VP9@{0}^{1}-{2}-{3}+{4}-{5}|MVT|{6}$',[server_id,card_id,cardnumber.toUpperCase(),serial.toUpperCase(),datetime,capacity,key]);
		return this.sha256(s);
	},

	execFun: function(list_fun,callback){
		if(list_fun && list_fun.length>0){
			let fun_len = list_fun.length;
			let i_done = 0;
			let list_err = [];
			let list_result = [];

			let exec_done = (err,result)=>{
				list_err.push(err);
				list_result.push(result);
				i_done++;
				if(i_done==fun_len) callback(list_err,list_result);
			};

			for(let i=0;i<fun_len;i++){
				try{
					let fun = list_fun[i];
					fun(exec_done);
				}
				catch(err){
					exec_done(err,null);
				}
			}
		}
		else{
			callback(null,null);
		}
	},

	RandomArray: function(arr, n) {
		if (n <= arr.length) {
			let arr_index = [];
			let clone = arr.slice();
			for (let i = 0; i < n; i++) {
				let index = Math.floor(Math.random() * clone.length);
				arr_index.push(clone[index]);
				clone.splice(index, 1);
			}
			return arr_index;
		}
		else {
			console.log('Random array: n not greate than length array!');
			return null;
		}
	},

	RandomListArray: function(arr,arr2, n) {
		if(arr && arr2){
			if (n <= arr.length) {
				let arr_1 = [];
				let arr_2 = [];
				let clone1 = arr.slice();
				let clone2 = arr2.slice();
				for (let i = 0; i < n; i++) {
					let index = Math.floor(Math.random() * clone1.length);

					arr_1.push(clone1[index]);
					arr_2.push(clone2[index]);

					clone1.splice(index, 1);
					clone2.splice(index, 1);
				}
				return {list_1:arr_1,list_2:arr_2};
			}
			else {
				return null;
			}
		}
		else{
			return null;
		}
	},

	RankScore: function(list_id,list_info) {
		if(list_id && list_info){
			let arr_temp = [];
			for (let i = 0; i < list_id.length; i++) {
				for(let j=0;j<list_info.length;j++){
					let user_info = list_info[j];
					if(user_info._id==list_id[i]){
						arr_temp.push(user_info);
						list_info.splice(j, 1);
						break;
					}
				}
			}
			return arr_temp;
		}
		else{
			return null;
		}
	},

	// GenPageHtml = function($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow,$function_name){
	GenPageHtml: function($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow){
		let $numberpage = 0;
		if ($totalrecord % $irecordofpage == 0)
			$numberpage = Math.floor($totalrecord / $irecordofpage);
		else
			$numberpage = Math.floor($totalrecord / $irecordofpage) + 1;

		if ($numberpage == 1)
			return "";

		let $loopend = 0;
		let $loopstart = 0;
		let $istart = false;
		let $iend = false;
		if ($pageindex == 0)
		{
			$loopstart = 0;
			$loopend = $numberpage > ($rshow - 1) ? $rshow : $numberpage;
			if ($numberpage > $rshow)
				$iend = true;
		}
		else
		{
			if ($pageindex < $numberpage - ($rshow - 1) && $pageindex != 0)
			{
				$loopstart = $pageindex - 1;
				$loopend = $pageindex + ($rshow - 1);
				$iend = true;
				if ($pageindex > 1)
					$istart = true;
			}
			else
			{
				if ($numberpage - $rshow > 0)
				{
					$loopstart = $numberpage - $rshow;
					$istart = true;
					$loopend = $numberpage;
				}
				else
				{
					$loopstart = 0;
					$loopend = $numberpage;
				}
			}
		}

		let $sPage = '<ul class="'+ $className +'">';
		if ($istart)
			$sPage += '<li><a href="?trang=0">&lt;&lt;</a></li>';
		if ($pageindex >= 1)
			$sPage += '<li><a href="?trang=' + ($pageindex - 1) + '">&lt;</a></li>';
		for (let $i = $loopstart; $i < $loopend; $i++)
		{
			if ($pageindex == $i)
				$sPage += '<li class="' + $classActive + '"><a href="javascript:void(0);">';
			else
				$sPage += '<li><a href="?trang=' + $i + '">';
			$sPage += ($i+1) + '</a></li>';
		}
		if ($pageindex <= $numberpage - 2)
			$sPage += '<li><a href="?trang=' + ($pageindex + 1) + '">&gt;</a></li>';
		if ($iend)
			$sPage += '<li><a href="?trang=' + ($numberpage - 1) + '">&gt;&gt;</a></li>';
		$sPage += '</ul>';

		return $sPage;
	},

	GenPageHtmlNews: function($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow,$function_name,$prefix){
		let $numberpage = 0;
		if ($totalrecord % $irecordofpage == 0)
			$numberpage = Math.floor($totalrecord / $irecordofpage);
		else
			$numberpage = Math.floor($totalrecord / $irecordofpage) + 1;

		if ($numberpage == 1)
			return "";

		let $loopend = 0;
		let $loopstart = 0;
		let $istart = false;
		let $iend = false;
		if ($pageindex == 0)
		{
			$loopstart = 0;
			$loopend = $numberpage > ($rshow - 1) ? $rshow : $numberpage;
			if ($numberpage > $rshow)
				$iend = true;
		}
		else
		{
			if ($pageindex < $numberpage - ($rshow - 1) && $pageindex != 0)
			{
				$loopstart = $pageindex - 1;
				$loopend = $pageindex + ($rshow - 1);
				$iend = true;
				if ($pageindex > 1)
					$istart = true;
			}
			else
			{
				if ($numberpage - $rshow > 0)
				{
					$loopstart = $numberpage - $rshow;
					$istart = true;
					$loopend = $numberpage;
				}
				else
				{
					$loopstart = 0;
					$loopend = $numberpage;
				}
			}
		}

		let $sPage = '<ul class="'+ $className +'">';
		if ($istart)
			$sPage += '<li><a onclick="javascript:' + $function_name + '(0)" href="'+$prefix+'/?trang=0"><i class="fa fa-fast-backward"></i></a></li>';
		if ($pageindex >= 1)
			$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($pageindex - 1) + ')" href="'+$prefix+'/?trang='+($pageindex - 1)+'"><i class="fa fa-step-backward"></i></a></li>';
		for (let $i = $loopstart; $i < $loopend; $i++)
		{
			if ($pageindex == $i)
				$sPage += '<li><a class="' + $classActive + '" href="javascript:void(0);">';
			else
				$sPage += '<li><a onclick="javascript:' + $function_name + '(' + $i + ')" href="'+$prefix+'/?trang='+$i+'">';
			$sPage += ($i+1) + '</a></li>';
		}
		if ($pageindex <= $numberpage - 2)
			$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($pageindex + 1) + ')" href="'+$prefix+'/?trang='+($pageindex + 1)+'" ><i class="fa fa-step-forward"></i></a></li>';
		if ($iend)
			$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($numberpage - 1) + ')" href="'+$prefix+'/?trang='+($numberpage - 1)+'" ><i class="fa fa-fast-forward"></i></a></li>';
		$sPage += '</ul>';

		return $sPage;
	}
};
