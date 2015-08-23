var newsWidget = new function () {
	var intervalId,
		DEFAULT_CONTAINER_SELECTOR = '.news-widget-container',
		widgetData = {
			tweetIdLib: []
		};

	var XMLHttpFactories = [
		function () {
			return new XMLHttpRequest()
		},
		function () {
			return new ActiveXObject("Msxml2.XMLHTTP")
		},
		function () {
			return new ActiveXObject("Msxml3.XMLHTTP")
		},
		function () {
			return new ActiveXObject("Microsoft.XMLHTTP")
		}
	];

	function addWindowLoadEvent(callback) {
		if (window.addEventListener) { // W3C standard
			window.addEventListener('load', callback, false);
		} else if (window.attachEvent) {  // Microsoft
			window.attachEvent('onload', callback);
		}

	}

	function isNode(node) {
		return node && node.nodeType &&
			(node.nodeType === 1 || node.nodeType === 11);
	}

	function toClass(obj) {
		return Object.prototype.toString.call(obj);
	}

/*	function isObject(obj) {
		return toClass(obj) === '[object Object]';
	}*/

	function createXMLHTTPObject() {
		var xmlhttp = false;
		for (var i = 0; i < XMLHttpFactories.length; i++) {
			try {
				xmlhttp = XMLHttpFactories[i]();
			}
			catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}

	function sendRequest(url, callback, postData) {
		var req = createXMLHTTPObject();
		if (!req) return;
		var method = (postData) ? "POST" : "GET";
		req.open(method, url, true);
		//req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
		if (postData)
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		req.onreadystatechange = function () {
			if (req.readyState != 4) return;
			if (req.status != 200 && req.status != 304) {
				//TODO: error handler
				return;
			}
			callback(req);
		};
		if (req.readyState == 4) return;
		req.send(postData);
	}

	function beginUpdateIteration(url, limit) {
		var urlWithParams = url + '?limit=' + limit;
		sendRequest(urlWithParams, finishUpdateIteration);
	}

	function saveTweetId(id) {
		if (widgetData.tweetIdLib.length == widgetData.limit) {
			widgetData.tweetIdLib.pop();
		}
		widgetData.tweetIdLib.unshift(id);
	}


	function isIdExists(id) {
		return widgetData.tweetIdLib.indexOf(id) >= 0;
	}

	function getNewTweetHTML (tweetData) {
		var tweetHTML = document.createElement('div');
		tweetHTML.className = 'tweet';
		var tweetAuthorNameHTML = document.createElement('div');
		tweetAuthorNameHTML.className = 'tweet-author-name';
		tweetAuthorNameHTML.innerHTML = tweetData.user.name;
		var tweetTextHTML = document.createElement('div');
		tweetTextHTML.className = 'tweet-text';
		tweetTextHTML.innerHTML = tweetData.text;

		tweetHTML.appendChild(tweetAuthorNameHTML);
		tweetHTML.appendChild(tweetTextHTML);

		return tweetHTML;
	}
	
	function treatResponseData(responseData) {
		var responseLen = responseData.length;
		var newTweetsHTML = document.createDocumentFragment();
		for (var i = 0; i < responseLen; i++) {
			var id = responseData[i].id;
			if (!isIdExists(id)) {
				saveTweetId(id);
				newTweetsHTML.appendChild(getNewTweetHTML(responseData[i]));
			}
		}

		var newTweetsLen = newTweetsHTML.childNodes.length;
		if(newTweetsLen) {
			var widgetContentElement = widgetData.html.querySelector('.widget-content');
			for (var j =0; j < newTweetsLen; j++){
				var lastChild = widgetContentElement.lastChild;
				if (lastChild){
					lastChild.remove();
				} else break;
			}
			widgetContentElement.appendChild(newTweetsHTML);
		}
	}

	function finishUpdateIteration(requestObj) {
		var responceData = JSON.parse(requestObj.response);
		if (!responceData || !Array.isArray(responceData) || !responceData.length) return;
		widgetData.responseData = responceData;

		treatResponseData(widgetData.responseData);
	}

	function startUpdating(url, limit, interval) {
		widgetData.url = url;
		widgetData.limit = limit;
		widgetData.interval = interval;

		beginUpdateIteration(widgetData.url, widgetData.limit);
		intervalId = setInterval(function () {
			beginUpdateIteration(widgetData.url, widgetData.limit);
		}, widgetData.interval);
		//TODO: interval lib
	}

/*	function getWidgetData() {
		return widgetData;
	}*/

	function getWidgetTemplate() {
		var widgetHTML = document.createElement('div');
		widgetHTML.className = 'widget';
		var widgetHeader = document.createElement('div');
		widgetHeader.className = 'widget-header';
		widgetHeader.innerHTML = 'News Widget';
		var widgetContent = document.createElement('div');
		widgetContent.className = 'widget-content';

		widgetHTML.appendChild(widgetHeader);
		widgetHTML.appendChild(widgetContent);

		return widgetHTML;
	}

	function createWidget(container) {
		if (!isNode(container)) return;
		widgetData.container = container;
		widgetData.html = getWidgetTemplate();
		container.appendChild(widgetData.html);
	}

	function initWidget(container) {
		container = container || document.querySelector(DEFAULT_CONTAINER_SELECTOR);
		createWidget(container);
	}

	function windowLoadHandler(event, container) {
		event = event || window.event;
		//auto init of widget
		initWidget(container);
	}

	addWindowLoadEvent(windowLoadHandler);

	return {
		init: initWidget,
		start: startUpdating/*,
		widgetData: getWidgetData()*/
	}
};
