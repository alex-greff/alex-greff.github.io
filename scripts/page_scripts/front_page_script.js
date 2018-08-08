const FRONT_PAGE_CANVAS_NAME = "canvas-front-page";
const FRONT_PAGE_CONTAINER_NAME = "front-page-container";

const FRONT_PAGE_CANVAS_PARALLAX_SPEED = 0.2;
const FRONT_PAGE_CONTAINER_PARALLAX_SPEED = 0.4;

var last_window_height_front_page = 0;

function initialize_front_page() {
	update_front_page();
	run_canvas_line_effect(FRONT_PAGE_CANVAS_NAME);
}

function onResizeEvent_front_page() {
	update_front_page();
}

function update_front_page() {
	update_canvas_dimensions(FRONT_PAGE_CANVAS_NAME, 0, 50);
	update_canvas_background_color(FRONT_PAGE_CANVAS_NAME, "#000000");

	//last_window_height_front_page = center_container_position(FRONT_PAGE_CONTAINER_NAME, last_window_height_front_page, 0, 1);
}

function parallax_front_page_canvas() {
	parallax_element(FRONT_PAGE_CANVAS_NAME, FRONT_PAGE_CANVAS_PARALLAX_SPEED);
	
	// parallax_element(FRONT_PAGE_CONTAINER_NAME, FRONT_PAGE_CONTAINER_PARALLAX_SPEED);
}

// Bind the canvas to the parallax effect on the scroll event
window.addEventListener('scroll', function() {
	requestAnimationFrame(parallax_front_page_canvas);
}, false);

/*function draw_canvas_front_page_lines_styling(canvas_name) {
	var canvas = document.getElementById(canvas_name);
	var ctx = canvas.getContext("2d");

	// Left top to right top
	var grad_lt_to_rt= ctx.createLinearGradient(getPosX(0), getPosY(0), getPosX(100), getPosY(0));
	grad_lt_to_rt.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_lt_to_rt.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_lt_to_rt.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Left top to right bottom
	var grad_lt_to_rb= ctx.createLinearGradient(getPosX(0), getPosY(0), getPosX(100), getPosY(100));
	grad_lt_to_rb.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_lt_to_rb.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_lt_to_rb.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Left bottom to right bottom
	var grad_lb_to_rb= ctx.createLinearGradient(getPosX(0), getPosY(100), getPosX(100), getPosY(100));
	grad_lb_to_rb.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_lb_to_rb.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_lb_to_rb.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Left bottom to right top
	var grad_lb_to_rt= ctx.createLinearGradient(getPosX(0), getPosY(100), getPosX(100), getPosY(0));
	grad_lb_to_rt.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_lb_to_rt.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_lb_to_rt.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Right top to left top
	var grad_rt_to_lt = ctx.createLinearGradient(getPosX(100), getPosY(0), getPosX(0), getPosY(0));
	grad_rt_to_lt.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_rt_to_lt.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_rt_to_lt.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Right top to left bottom
	var grad_rt_to_lb = ctx.createLinearGradient(getPosX(100), getPosY(0), getPosX(0), getPosY(100));
	grad_rt_to_lb.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_rt_to_lb.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_rt_to_lb.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Right bottom to left bottom
	var grad_rb_to_lb = ctx.createLinearGradient(getPosX(100), getPosY(100), getPosX(0), getPosY(100));
	grad_rb_to_lb.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_rb_to_lb.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_rb_to_lb.addColorStop(1, "rgba(0, 148, 255, 0)");


	var grad_rb_to_lt = ctx.createLinearGradient(getPosX(100), getPosY(100), getPosX(0), getPosY(0));
	grad_rb_to_lt.addColorStop(0, "rgba(0, 148, 255, 1)");
	grad_rb_to_lt.addColorStop(0.3, "rgba(0, 148, 255, 1)");
	grad_rb_to_lt.addColorStop(1, "rgba(0, 148, 255, 0)");


	ctx.beginPath();
	ctx.strokeStyle = grad_lt_to_rb;
	ctx.moveTo(getPosX(0), getPosY(10));
	ctx.lineTo(getPosX(100), getPosY(75));
	ctx.lineWidth = 0.5;
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = grad_lb_to_rt;
	ctx.moveTo(getPosX(0), getPosY(70));
	ctx.lineTo(getPosX(100), getPosY(45));
	ctx.lineWidth = 0.5;
	ctx.stroke();
}*/