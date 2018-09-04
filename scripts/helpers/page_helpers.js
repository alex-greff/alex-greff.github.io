function page_onComplete(delayTime, onComplete_fcn, onComplete_scope) {
    TweenMax.set(this.element_ref, { delay: delayTime, onComplete: onComplete_fcn, onCompleteScope: onComplete_scope });
}

function page_open__visibility() {
    TweenMax.set(this.element_ref, { visibility: "visible" });
}

function page_close__visibility(delayTime) {
    TweenMax.set(this.element_ref, { delay: delayTime, visibility: "hidden" });
}

// -----------------------------
// --- page scrolling script ---
// -----------------------------
function page_scroll(scrollOnOverflow, target_elem, delta_px) {
    // If the scroller is undefined then set it up
    if (this.scroller == null) {
        this.scroller = {
            target : target_elem,
            ease: 0.1, // scroll speed
            curr_pos : 0,
            target_pos : 0,
            run_anim : true,
            animID : null,
        };
    }

    var outerHeight = target_elem.outerHeight(true);

    if (outerHeight < Utilities.page_height && scrollOnOverflow) {
        return;
    }

    var s = this.scroller;

    s.target_pos += delta_px;

    s.target_pos = constrain(s.target_pos, -1* (Utilities.page_height), Utilities.page_height);

    s.run_anim = true;
    if (s.animID == null) {
        s.animID = requestAnimationFrame(updateScroller.bind(this));
    }
}

function updateScroller() {
    var s = this.scroller;

    s.curr_pos += (s.target_pos - s.curr_pos) * s.ease;

    if (Math.abs(s.target_pos - s.curr_pos) < 0.05) {
        s.curr_pos = s.target_pos;
        s.run_anim = false;
    }

    TweenMax.set(s.target, {y: -s.curr_pos});

    s.animID = s.run_anim ? requestAnimationFrame(updateScroller.bind(this)) : null;
}


// ------------------------------
// --- Utilities static class ---
// ------------------------------

$( window ).resize( function() {
    Utilities.page_height = $(window).height();
    Utilities.page_width = $(window).width();
});

new Utilities();

function Utilities () {
    Utilities.page_height = $(window).height();
    Utilities.page_width = $(window).width();
}

