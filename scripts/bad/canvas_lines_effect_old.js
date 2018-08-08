var CANVAS_LINE_EFFECT_CANVAS_NAME = "";
var GRADIENT_GRANULARITY = 10;
const NUM_LINES = 3;

const PERIOD = 5; // The time of a period (seconds)

// var init_line_offsets = [0 * 1000, 0.05 * 1000, 0 * 1000, 1 * 1000, 1.05 * 1000, 1 * 1000];
// var init_line_widths = [0.5, 1, 1.5];
// var init_line_widths = [7, 7, 7, 7, 7, 7];

// var line_positions = [
	// 	[[getPosX(0), getPosY(10)], [getPosX(100), getPosY(75)]],
	// 	[[getPosX(0), getPosY(70)], [getPosX(100), getPosY(45)]],
	// 	[[getPosX(10), getPosY(100)], [getPosX(30), getPosY(0)]],
	// 	[[getPosX(100), getPosY(50)], [getPosX(60), getPosY(100)]],
	// 	[[getPosX(40), getPosY(0)], [getPosX(75), getPosY(100)]],
	// 	[[getPosX(20), getPosY(0)], [getPosX(100), getPosY(75)]]
	// ];

function init_canvas_line_effect() {
	/*for (var i = 0; i < NUM_LINES; i++) {
		init_line_offsets[i] = Math.random() * 1000 * 60; // Random range from 0 to 60 seconds from the current time
	}*/
}

class Line {
	/*
	period: the period of one cycle (seconds)
	offset: the offset of the line (seconds)
	(start_pos_X, start_pos_Y): the start position (percent of canvas)
	(end_pos_X, end_pos_Y): the end position (percent of canvas)
	*/
	constructor (period, offset, width, start_pos_X, start_pos_Y, end_pos_X, end_pos_Y) {
		this.period = period;
		this.offset = offset;
		this.width = width;
		this.start_pos[0] = start_pos_X;
		this.start_pos[1] = start_pos_Y;
		this.end_pos[0] = end_pos_X;
		this.end_pos[1] = end_pos_Y;
	}
}

var lines = init_lines();

function init_lines() {
	var lines = [];
	// period, offset, start_pos_X, start_pos_Y, end_pos_X, end_pos_Y
	lines[0] = new Line(5, 0, 0, 7, 10, 100, 75);
	lines[1] = new Line(5, 0, 0, 7, 70, 100, 45);
	lines[3] = new Line(5, 0, 0, 7, 70, 100, 45);
}

function run_canvas_line_effect(canvas_name) {
	CANVAS_LINE_EFFECT_CANVAS_NAME = canvas_name;

	window.requestAnimationFrame(draw_canvas_lines_effect);
}

function draw_canvas_lines_effect(lines) {
	var canvas = document.getElementById(CANVAS_LINE_EFFECT_CANVAS_NAME);
	var ctx = canvas.getContext("2d");

	

	ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var time = new Date();



	for (var i = 0; i < lines.length; i++) {
		//var t = time.getTime()/100/64 + init_line_offsets[i];
		// var t = time.getTime()/1000*Math.PI/6 + init_line_offsets[i];

		var line = lines[i];

		var t = time.getTime()/500*Math.PI(1000*line.peroid) + line.offset; // By default it's 

		var curr_line_anim_cruve_points = [];

		for (var j = 0; j < GRADIENT_GRANULARITY; j++) {
			// https://www.desmos.com/calculator/276lkeyu0t
			// var x = (t + j/(GRADIENT_GRANULARITY-1));

			// var curve = 1 - Math.abs(2*  (2 * x % 2 - 1 ) )
			// var boundary = x % 4;

			// var curve = 0;	
			// if (boundary < 2) {
			// 	curve = 1 - Math.abs((2 * x % 2 - 1 ) )
			// }

			var x = (t + j/(GRADIENT_GRANULARITY-1));			
			var boundary = x % Math.PI;
			var curve = 0;
	
			if (boundary < Math.PI) {
				curve = Math.sin(x);
			}

			curr_line_anim_cruve_points[j] =  curve ; // Offset forward
		}

		// Line 1
		var curr_line_grad = ctx.createLinearGradient(line_positions[i][0][0], line_positions[i][0][1], line_positions[i][1][0], line_positions[i][1][1]);
		// var curr_line_grad_shadow = ctx.createLinearGradient(line_positions[i][0][0], line_positions[i][0][1], line_positions[i][1][0], line_positions[i][1][1]);
		for (var j = 0; j < GRADIENT_GRANULARITY; j++) { 
			curr_line_grad.addColorStop(j/GRADIENT_GRANULARITY, "rgba(0, 148, 255, " + curr_line_anim_cruve_points[j]/2 + ")");
			// curr_line_grad_shadow.addColorStop(j/GRADIENT_GRANULARITY, "rgba(45, 209, 255, " + curr_line_anim_cruve_points[j]/10 + ")")
		}

		// ctx.beginPath();
		// ctx.strokeStyle = curr_line_grad_shadow;
		// ctx.moveTo(line_positions[i][0][0], line_positions[i][0][1]);
		// ctx.lineTo(line_positions[i][1][0], line_positions[i][1][1]);
		// ctx.lineWidth = init_line_widths[i] + 5;
		// ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = curr_line_grad;
		ctx.moveTo(line_positions[i][0][0], line_positions[i][0][1]);
		ctx.lineTo(line_positions[i][1][0], line_positions[i][1][1]);
		ctx.lineWidth = init_line_widths[i];
		ctx.stroke();

		

}
	window.requestAnimationFrame(draw_canvas_lines_effect);


	// Extra
	// Left to right
	/*var grad_left_to_right = ctx.createLinearGradient(getPosX(100), getPosY(50), getPosX(0), getPosY(50));
	grad_left_to_right.addColorStop(0, "rgba(0, 148, 255, 0)");
	grad_left_to_right.addColorStop(0.5, "rgba(0, 148, 255, 1)");
	grad_left_to_right.addColorStop(1, "rgba(0, 148, 255, 0)");

	// Right to left
	var grad_left_to_right = ctx.createLinearGradient(getPosX(0), getPosY(50), getPosX(100), getPosY(50));
	grad_left_to_right.addColorStop(0, "rgba(0, 148, 255, 0)");
	grad_left_to_right.addColorStop(0.5, "rgba(0, 148, 255, 1)");
	grad_left_to_right.addColorStop(1, "rgba(0, 148, 255, 0)");	*/
}

function getPosX(width_percent) {
	//var window_width = $(window).width();

	var canvas = document.getElementById(CANVAS_LINE_EFFECT_CANVAS_NAME);
	var canvas_width = canvas.width;
	
	return canvas_width * (width_percent/100);
}

function getPosY(height_percent) {
	//var window_height = $(window).height();
	var canvas = document.getElementById(CANVAS_LINE_EFFECT_CANVAS_NAME);
	var canvas_height = canvas.height;

	return canvas_height * (height_percent/100);
}