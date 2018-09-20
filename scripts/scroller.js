init_scroll();

$('body').on("onPageLoad", () => { init_scroll() });

function init_scroll() {
    $(".scrollable").each(function() {
        if ($(this).outerHeight() >= $(window).height()) {
            scroll.call(this);
        }
        
    });
}

function scroll() {
    var _this = this;
    var body_ref = $('body');
    body_ref.on("onScrollY", 
        (e, percent, delta) => { 
            var vis = $(this).css("visibility");
            //console.log($(this));
            if (vis == "visible") {
                console.log(delta);
                doScroll.call(this, percent, -1 * delta/4, true);
            }
            
        }
    );

    body_ref.on("onDragY", 
        (e, percent, delta) => { 
            var vis = $(this).css("visibility");
            if (vis == "visible") {
                doScroll.call(this, percent, -1* delta/2, false);
            }
            
        }
    );
}

function doScroll(percent, delta, animate) {
    var scroll_amt = delta;
    console.log(scroll_amt);

    var pos = $(this).position();
    var height = $(this).outerHeight();
    var window_height = $(window).height();

    if (pos.top + scroll_amt <= 0) {
        scroll_amt = -1*pos.top;
    }
    else if (pos.top + height + scroll_amt >= window_height) {
        scroll_amt = Math.min(0, (window_height - (pos.top + height)));
    }

    if (animate) {
        TweenMax.to(this, 0.5, {y: "+="+scroll_amt+"px", ease:Power2.easeOut});
    } else {
        TweenMax.set(this, {y: "+="+scroll_amt+"px"});
    }
    
}