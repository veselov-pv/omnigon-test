var newsWidget = new function () {

	var widgetData = {};

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

	function createWidget(container) {
		if (!isNode(container)) return;
		var widgetHTML = document.createElement('div');
		container.newsWidget = isObject(container.newsWidget) ? container.newsWidget : widgetData;
		container.appendChild(widgetHTML);
	}

	function initWidget(container) {
		container = container || document.querySelector('.news-widget-container');
		createWidget(container);
	}

	function windowLoadHandler(event, container) {
		initWidget(container);
	}

	addWindowLoadEvent(windowLoadHandler);

	return {
		init: initWidget
	}
};
