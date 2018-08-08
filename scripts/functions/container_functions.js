/*
Centers the container position.

(string, float, float, float) -> float
Returns the window height.
*/
function center_container_position (container_name, last_window_height, vertical_center_offset, height_delta_threshold) {
	// Get the window width and height
	var window_width = $(window).width();
	var window_height = $(window).height();

	// Check if the window height has changed enough to update the centering
	if (Math.abs(window_height - last_window_height) < height_delta_threshold){
		return window_height;
	}

	// Get the parent node
	var parentNode = document.getElementById(container_name);

	// Initialize the total child height tracker
	var totalChildHeight = 0;

	// Iterate through each child node to get the total height
	var childrenNodes = parentNode.children;
	for (var c of childrenNodes) {
		totalChildHeight += c.clientHeight;
	}

	// Compute the height padding
	var paddingHeight = (window_height - totalChildHeight)/2 - vertical_center_offset;

	// console.log("Height: " + window_height + " Padding height: " + paddingHeight);

	// Apply the height padding to the parent
	parentNode.style.paddingTop = paddingHeight + "px";

	return window_height;
}

function set_container_offset(container_name, multiplier, addition) {
	var window_width = $(window).width();
	var window_height = $(window).height();

	var container = document.getElementById(container_name);

	container.style.top = ((window_height*multiplier)+addition) + "px";

	// container.clientHeight = window_height;
}

function set_container_height(container_name, multiplier, addition) {
	var window_height = $(window).height();	
	var container = document.getElementById(container_name);

	container.style.height = ((multiplier*window_height) + addition) + "px";
}