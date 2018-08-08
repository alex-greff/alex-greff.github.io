function getPosX(width_percent) {
	var window_width = $(window).width();
	
	return window_width * (width_percent/100);
}

function getPosY(height_percent) {
	var window_height = $(window).height();

	return window_height * (height_percent/100);
}