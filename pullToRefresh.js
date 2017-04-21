var pullToRefresh = function(element, callback) {
	var config = {
		max: 30,
		cubic:"cubic-bezier(0, 1.09, 0.22, 0.93)"
	};
	
	if(!element || element.nodeType !== 1) {
		return;
	}
	
	//用来记录数据，程序运行的时候各事件内部共享数据
	var _temp = {};
	
	//记录手指最初碰到屏幕的位置
	element.addEventListener("touchstart", function(event) {
		var touch = event.touches[0];
		_temp.startY = touch.pageY;
	}, false);
	
	//控制元素随着手指下拉而位移
	element.addEventListener("touchmove", function(event) {
		var touch = event.touches[0];
		_temp.endY = touch.pageY;
		_temp.distance = _temp.endY - _temp.startY;

		//判断顶部下拉还是底部上拉
		if(element.getBoundingClientRect().top  == 0) {
			_temp.direction = 0;
		}else if(document.documentElement.clientHeight - (element.getBoundingClientRect().bottom + window.pageYOffset) < 50) {
			_temp.direction = 1;
		}

		if(_temp.direction == 0 && _temp.distance > 0) {
			element.style.cssText = element.style.cssText + "margin-top:"+ damping(_temp.distance) + "px";
		}else if(_temp.direction == 1 && _temp.distance < 0) {
			element.style.cssText = element.style.cssText + "margin-bottom:"+ damping(-(_temp.distance)) + "px";
		}

		console.log(_temp)
	}, false);
	
	//用移动后的手指位置和最初位置对比确定是不是发生了拖动动作
	element.addEventListener("touchend", function(event) {
		//下拉
		if(_temp.direction == 0) {
			callback();
			//让拖动的元素复位
			element.style.cssText = element.style.cssText + "margin-top:0px;transition:all 600ms "+config.cubic;
		//上拉
		}else if(_temp.direction == 1) {
			callback();
			//让拖动的元素复位
			element.style.cssText = element.style.cssText + "margin-bottom:0px;transition:all 600ms "+config.cubic;
		}
	}, false);
	
	//阻尼计算，增加阻力拉的时候像拉弹簧一样，不然就变成平移了
	var damping = function (value) {
		var step = [20, 40, 60, 80, 100];
		var rate = [0.5, 0.4, 0.3, 0.2, 0.1];

		var scaleedValue = value;
		var valueStepIndex = step.length;

		while (valueStepIndex--) {
			if (value > step[valueStepIndex]) {
				scaleedValue = (value - step[valueStepIndex]) * rate[valueStepIndex];
				for (var i = valueStepIndex; i > 0; i--) {
					scaleedValue += (step[i] - step[i - 1]) * rate[i - 1];
				}
				scaleedValue += step[0] * 1;
				break;
			}
		}
		return scaleedValue;
	};
}
