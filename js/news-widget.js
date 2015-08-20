var newsWidget = new function () {
	var DEFAULT_CONTAINER_SELECTOR = '.news-widget-container';

	var widgetData = {};

	var XMLHttpFactories = [
		function () {return new XMLHttpRequest()},
		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
		function () {return new ActiveXObject("Microsoft.XMLHTTP")}
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
		for (var i=0;i<XMLHttpFactories.length;i++) {
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

	function sendRequest(url,callback,postData) {
		var req = createXMLHTTPObject();
		if (!req) return;
		var method = (postData) ? "POST" : "GET";
		req.open(method, url, true);
		req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
		if (postData)
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		req.onreadystatechange = function () {
			if (req.readyState != 4) return;
			if (req.status != 200 && req.status != 304) {
//          alert('HTTP error ' + req.status);
				return;
			}
			callback(req);
		};
		if (req.readyState == 4) return;
		req.send(postData);
	}

	function beginUpdateData () {
		sendRequest()
	}

	function finishUpdateData () {

	}

	function startUpdating (url, limit, interval) {

	}

	function createWidget(container) {
		if (!isNode(container)) return;
		var widgetHTML = document.createElement('div');
		container.newsWidget = isObject(container.newsWidget) ? container.newsWidget : widgetData;
		container.appendChild(widgetHTML);
	}

	function initWidget(container) {
		container = container || document.querySelector(DEFAULT_CONTAINER_SELECTOR);
		createWidget(container);
	}

	function windowLoadHandler(event, container) {
		event = event || window.event;
		initWidget(container);
	}

	addWindowLoadEvent(windowLoadHandler);

	return {
		init: initWidget,
		start:
	}
};
