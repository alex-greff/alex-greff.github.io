// Create cross browser requestAnimationFrame method:
window.requestAnimationFrame = window.requestAnimationFrame
 || window.mozRequestAnimationFrame
 || window.webkitRequestAnimationFrame
 || window.msRequestAnimationFrame
 || function(f){setTimeout(f, 1000/60)}

function parallax_element(element_name, speed) {
	var scroll_top = window.pageYOffset // get number of pixels document has scrolled vertically

	var element = document.getElementById(element_name);

	element.style.top = -scroll_top * speed + "px";
}

