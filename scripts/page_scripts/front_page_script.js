const FRONT_PAGE_CANVAS_NAME = "canvas-front-page";
const FRONT_PAGE_CONTAINER_NAME = "front-page-container";

const FRONT_PAGE_CANVAS_PARALLAX_SPEED = 0.2;
const FRONT_PAGE_CONTAINER_PARALLAX_SPEED = 0.4;


const CANVAS_RESOLUTION_MULTIPLIER = 1;


function initialize_front_page() {
	update_front_page();
	// run_canvas_line_effect(FRONT_PAGE_CANVAS_NAME);
}

function onResizeEvent_front_page() {
	update_front_page();
}

function update_front_page() {
	update_canvas_resolution(FRONT_PAGE_CANVAS_NAME, CANVAS_RESOLUTION_MULTIPLIER);
	
	// update_canvas_background_color(FRONT_PAGE_CANVAS_NAME, "#000000");
}




function parallax_front_page_canvas() {
	parallax_element(FRONT_PAGE_CANVAS_NAME, FRONT_PAGE_CANVAS_PARALLAX_SPEED);
	
	// parallax_element(FRONT_PAGE_CONTAINER_NAME, FRONT_PAGE_CONTAINER_PARALLAX_SPEED);
}

// Bind the canvas to the parallax effect on the scroll event
window.addEventListener('scroll', function() {
	requestAnimationFrame(parallax_front_page_canvas);
}, false);
