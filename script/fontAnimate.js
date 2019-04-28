(function(){
	// 默认属性
	var options = {
		fragment: true, // 是否分段执行， 否就是所有段落一起执行  默认为true
		delay: 0, // 当前段落执行延迟
		fontDelay: 100,  // 文字之间执行延迟
		className: "bounceIn" // 动画类名
	};
	var api = {
		init: function(obj){
			var _this = this;
			if(obj.el === undefined){
				console.error("el参数不能为空");
				return ;
			}
			
			if(obj.el instanceof Object){
				this.el = obj.el;
				if(this.el.length === 1){
					this.el = this.el[0];
				}
			}else{
				if(obj.el.indexOf(".") >= 0 || obj.el.indexOf("#") === -1){
					this.el = document.querySelectorAll(obj.el);
					if(this.el.length === 1){
						this.el = this.el[0];
					}
				}else{
					this.el = document.querySelector(obj.el);
				}
			}
			
			this.isNodeList(function(){
				Array.prototype.slice.call(_this.el).forEach(function(ele, index){
					ele.style.opacity = 0;
				})	
			},function(){
				_this.el.style.opacity = 0;
			});
			
			// 判断是否有延迟执行
			if(obj.delay){
				setTimeout(function(){
					_this.start(obj);
				},obj.delay);
			}else{
				this.start(obj);
			}
		},
		start: function(obj){
			this.fragment = obj.fragment === false ? false : true; // 是否分段执行动画（默认为true, 分开执行动画）
			this.className = obj.className || options.className; // 字体显示动画
			this.fontDelay = parseInt(obj.fontDelay) || options.fontDelay; // 每个字的延迟时间
			this.textArr = this.cutting(this.el); // 获取字数组
			this.createElemet(); // 创建每个的标签
			this.useTestAnim(); // 准备每个的字动画所需元素
		},
		cutting: function(el){ // 字体切割成数组
			var textArr = [];
			this.isNodeList(function(){
				for(var i=0, len=el.length; i<len; i++){
					var arr = el[i].innerText.split("");
					textArr.push(arr)
				}
			},function(){
				textArr = el.innerText;
			});
			return textArr;
		},
		createElemet: function(){ // 为对应的字创建对应的标签
			var _this = this,
				html = "",
				arr = this.textArr,
				fontDelay = this.fontDelay,
				fragment = this.fragment;
			this.isNodeList(function(){
				if(fragment){ // 判断是一段段  还是  所有段落一起执行动画
					// 分段执行动画
					var delayTime = 0;
					for(var i=0, len=arr.length; i<len; i++){
						html = "";
						for(var j=0, twoLen=arr[i].length; j<twoLen; j++){
							delayTime += fontDelay;
							html += "<span class='ani' data-delayTime='"+ delayTime +"'>"+ arr[i][j] +"</span>";
						}
						_this.el[i].innerHTML = html;
					}
				}else{
					// 所有段落一起执行动画
					for(var i=0, len=arr.length; i<len; i++){
						html = "";
						for(var j=0, twoLen=arr[i].length; j<twoLen; j++){
							html += "<span class='ani' data-delayTime='"+ (parseInt(fontDelay* j)) +"'>"+ arr[i][j] +"</span>";
						}
						_this.el[i].innerHTML = html;
					}
				}
			},function(){
				for(var i=0, len=arr.length; i<len; i++){
					html += "<span class='ani' data-delayTime='"+ (parseInt(fontDelay* i)) +"'>"+ arr[i] +"</span>";
				}
				_this.el.innerHTML = html;
			});
		},
		testAnim: function(ele, className, time) { // 执行当前文字的动画
			var _this = this;
			setTimeout(function() { // 延迟
				ele.style.opacity = 1;
				ele.className += " " + className + ' animated';
				_this.once(ele, "animationend", function(){ // 删除无用的类名、自定义属性、行内样式
					this.removeAttribute("data-delayTime");
					this.removeAttribute("class");
					this.removeAttribute("style");
				});
			}, time);
		},
		useTestAnim: function() { // 执行动画前的准备（获取延迟时间， 动画效果）
			var _this = this,
				el = this.el;
			var className = this.className;
			this.isNodeList(function(){
				Array.prototype.slice.call(el).forEach(function(ele, index){
					ele.removeAttribute("style");
					var currDom = ele.children;
					for(var i=0; i<currDom.length; i++){
						var time = _this.attr(currDom[i], "data-delayTime") || 0;
						_this.testAnim(currDom[i], className, time);
					}
				});
			},function(){
				el.removeAttribute("style");
				var currDom = el.children;
				for(var i=0; i<currDom.length; i++){
					var time = _this.attr(currDom[i], "data-delayTime") || 0;
					_this.testAnim(currDom[i], className, time);
				}
			});
		},
		attr: function(ele, attr, value){ // 设置属性值和返回属性值
			if(Boolean(value)){
				ele.setAttribute(attr, value);
			}else{
				return ele.getAttribute(attr);
			}
		},
		isNodeList: function(fnA, fnB){ // 判断当前el是一个dom类数组还是一个dom
			if(this.el instanceof NodeList){ // 类数组执行
				fnA();
			}else{ // 单个dom执行
				fnB();
			}
		},
		once: function(dom, type, callback){ // 一次性监听， 监听过后 删掉监听
			var handle = function() {  
		        callback = callback.call(this);
		        dom.removeEventListener(type, handle); // 删除监听
		    }
			dom.addEventListener(type, handle);
		}
	}
	this.fontAnimate = api;
})();
