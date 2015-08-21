window.onload = function () {
	var url = 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json',
		limit = 5,
		interval = 4000; // ms
	// or without auto init by className there should be newsWidget.init(container)
	newsWidget.start(url,limit, interval);

};