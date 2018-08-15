// Updates the canvas resolution to a multiplier of it's on screen size
function update_canvas_resolution(canvas_name, resolution_multiplier) {

	var window_width = $(window).width();
	var window_height = $(window).height();

	var canvas = document.getElementById(canvas_name);

	var canvas_width = canvas.offsetWidth;
	var canvas_height = canvas.offsetHeight;

	// Change canvas size
	canvas.width = canvas_width * resolution_multiplier;
	canvas.height = canvas_height * resolution_multiplier;
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
