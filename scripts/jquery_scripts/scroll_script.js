$(document).ready(function () {
	const SCROLL_SPEED = 800;
	const SCROLLABLE_CLASS_FLAG = '.scrollable';

    var divs = $(SCROLLABLE_CLASS_FLAG);
    var dir = 'up'; // wheel scroll direction
    var div = 0; // current div
    var divs_len = divs.length;

    $(document.body).on('DOMMouseScroll mousewheel', function (e) {
        if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
            dir = 'down';
        } else {
            dir = 'up';
        }

        // find currently visible div :
        div = -1;
        divs.each(function(i){
            if (div<0 && ($(this).offset().top >= $(window).scrollTop())) {
                div = i;
            }
        });
        if (dir == 'up' && div > 0) {
            div--;

            if (div < 0) { // Stop div from going below 0
            	div = 0;
            }
        }
        if (dir == 'down' && div < divs.length) {
            div++;

            if (div >= divs_len) { // Stop div form going out of range
            	div = divs_len - 1;
            }
        }

        $('html,body').stop().animate({
            scrollTop: divs.eq(div).offset().top
        }, SCROLL_SPEED);
        return false;
    });
    $(window).resize(function () {
        $('html,body').scrollTop(divs.eq(div).offset().top);
    });
});