var newsWidget = new function () {
	var intervalId;

	var DEFAULT_CONTAINER_SELECTOR = '.news-widget-container';
	var widgetData = {};
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

	function isObject(obj) {
		return toClass(obj) === '[object Object]';
	}

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

	function finishUpdateIteration(requestObj) {
		var response = JSON.parse(requestObj.response);
		var newsTweet = document.createElement('div');
		newsTweet.className = 'news-tweet';
		var newsTweetAuthorName = document.createElement('div');
		newsTweetAuthorName.className = 'news-tweet-author-name';
		newsTweetAuthorName.innerHTML = response[0].user.name;
		var newsTweetText = document.createElement('div');
		newsTweetText.className = 'news-tweet-text';
		newsTweetText.innerHTML = response[0].text;

		newsTweet.appendChild(newsTweetAuthorName);
		newsTweet.appendChild(newsTweetText);

		// TODO real model for html
		widgetData.html.querySelector('.widget-content').appendChild(newsTweet);
	}

	function startUpdating(url, limit, interval) {
		beginUpdateIteration(url, limit);
		intervalId = setInterval(function () {
			beginUpdateIteration(url, limit);
		}, interval);
	}

	function getWidgetData() {
		return widgetData;
	}

	function getNewWidgetHTML () {
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
		widgetData.html = getNewWidgetHTML();
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
		start: startUpdating,
		widgetData: getWidgetData()
	}
};
