const CANVAS_RESOLUTION_MULTIPLIER = 2;

// Updates the canvas size
function update_canvas_dimensions(canvas_name, addition_width, addition_height) {
	var window_width = $(window).width();
	var window_height = $(window).height();

	var canvas = document.getElementById(canvas_name);

	var canvas_width = window_width + addition_width;
	var canvas_height = window_height + addition_height

	// Change canvas size
	canvas.width = canvas_width * CANVAS_RESOLUTION_MULTIPLIER;
	canvas.height = canvas_height * CANVAS_RESOLUTION_MULTIPLIER;

	// Change canvas resolution
	canvas.style.width = canvas_width + "px";
	canvas.style.height = canvas_height + "px";

	//console.log("New canvas size: width: " + window_width + " height: " + window_height);
}

// Updates the canvas background
function update_canvas_background_color(canvas_name, color) {
	var window_width = $(window).width();
	var window_height = $(window).height();

	var canvas = document.getElementById(canvas_name);
	var ctx = canvas.getContext("2d");

	// Create gradient
	/*var grd = ctx.createLinearGradient(0, 0, window_width, 0);
	grd.addColorStop(0, "black");
	grd.addColorStop(1, "gray");
	// Fill with gradient
	ctx.fillStyle = grd;*/

	ctx.fillStyle = color;

	ctx.fillRect(0, 0, window_width, window_height);

}
