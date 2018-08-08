initialize();
document.getElementsByTagName("BODY")[0].onresize = function() { onResizeEvent() };

function initialize() {
	init_canvas_line_effect();
	
	initialize_loading_page();
	initialize_front_page();
	initialize_education_page();
	initialize_projects_page();
}

function onResizeEvent() {
	onResizeEvent_loading_page();
	onResizeEvent_front_page();
	onResizeEvent_education_page();
	onResizeEvent_projects_page();
}