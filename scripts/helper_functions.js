function getPosX(width_percent) {
	var window_width = $(window).width();
	
	return window_width * (width_percent/100);
}

function getPosY(height_percent) {
	var window_height = $(window).height();

	return window_height * (height_percent/100);
}


function constrain(val, min, max) {
	return Math.min(Math.max(val, min), max);
}

function getXYDirection(posXYStart, posXYEnd) {
	changePos = [posXYEnd[0]-posXYStart[0], posXYEnd[1], posXYStart[1]];
	changePosLen = Math.sqrt(Math.pow(changePos[0], 2) + Math.pow(changePos[1], 2));

	return [changePos[0]/changePosLen, changePos[1]/changePosLen];
}