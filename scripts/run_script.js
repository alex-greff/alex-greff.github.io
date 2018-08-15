initialize();
document.getElementsByTagName("BODY")[0].onresize = function() { onResizeEvent() };

function initialize() {
	initialize_loading_page();
	initialize_front_page();
}

function onResizeEvent() {
	onResizeEvent_front_page();
}