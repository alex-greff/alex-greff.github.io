// -----------------------------
// --- Delta management code ---
// -----------------------------
var body_ref = $('body');

var drag_delta = [0, 0];
var last_drag_delta = [0, 0];

var drag_Y_isTriggered = false;
var drag_X_isTriggered = false;
var drag_XY_isTriggered = false;
var drag_radius_isTriggered = false;

const DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE = 0.35; // Percent of lower page dimension
var DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // Gets filled later

const DRAG_DELTA_Y_THRESHOLD_PERCENTAGE = 0.35; // The y (veritcal) drag  amount threshold
var DRAG_DELTA_Y_THRESHOLD_PIXEL; // Gets filled

const DRAG_DELTA_X_THRESHOLD_PERCENTAGE = 0.35; // The x (horizontal) drag amount threshold
var DRAG_DELTA_X_THRESHOLD_PIXEL; // Gets filled



var scroll_delta = 0;
var last_scroll_delta = 0;

var scroll_isTriggered = false;

var scroll_deltaResetID;
const SCROLL_RESET_TIME = 250; // milliseconds

const SCROLL_DELTA_THRESHOLD_PERCENTAGE = 0.35; // Percent of page height
var SCROLL_DELTA_THRESHOLD_PIXEL; // Gets filled later


var last_height = -1;
var last_width = -1;



// Run the initial computation for PAGE_TRANSITION_THRESHOLD
recompute_threshold_triggers();

// Listen for the page resize event
$( window ).resize( function() {
    recompute_threshold_triggers();
});

// Recalculates the thresholds based off the new window height (if it is changed)
function recompute_threshold_triggers() {
    var new_height = $( window ).height();
    var new_width = $ (window ).width();

    if (last_height != new_height) { // If the height changed
        // Recompute the scroll event threshold
        SCROLL_DELTA_THRESHOLD_PIXEL = (new_height * SCROLL_DELTA_THRESHOLD_PERCENTAGE); // Converts the percent variable to pixels

        // Recompute the drag Y event threshold
        DRAG_DELTA_Y_THRESHOLD_PIXEL = (new_height * DRAG_DELTA_Y_THRESHOLD_PERCENTAGE);

        last_height = new_height;
    }

    if (last_width != new_width) { // If the width changed
        // Recompute the drag X event threshold
        DRAG_DELTA_X_THRESHOLD_PIXEL = (new_width * DRAG_DELTA_X_THRESHOLD_PERCENTAGE);

        last_width = new_width;
    }

    if (new_height < new_width) { 
        // If the height is smaller than the width then use the height to calculate the radius pixel threshold
        DRAG_DELTA_RADIUS_THRESHOLD_PIXEL = (new_height * DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
    } else {
        // If the width is smaller than or equal to the height then use the width to calculate the radius pixel threshold
        DRAG_DELTA_RADIUS_THRESHOLD_PIXEL = (new_width * DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
    }
}


function resetScrollDelta() {
    last_scroll_delta = 0;
    scroll_delta = 0;
    scroll_deltaResetID = null;
}

function setScrollDelta(newScrollDelta) {
    last_scroll_delta = scroll_delta;
    scroll_delta = newScrollDelta;

    onScrollDeltaChange();
}

function incrementScrollDelta(incrementAmt) {
    last_scroll_delta = scroll_delta;
    scroll_delta += incrementAmt;

    onScrollDeltaChange();
}

function onScrollDeltaStart() {
    body_ref.trigger("onScrollStart");
}

function onScrollDeltaEnd() {
    resetScrollDelta();

    if (scroll_isTriggered) {
        scroll_isTriggered = false;
        return;
    }

    body_ref.trigger("onScrollEnd");
}

function onScrollDeltaChange() {
    if (scroll_isTriggered) {
        return;
    }

    var scroll_progress_percent = constrain(scroll_delta / SCROLL_DELTA_THRESHOLD_PIXEL, -1, 1); // range [-1, 1]

    if (scroll_delta == last_scroll_delta ) {
        return;
    }

    var scroll_direction_vector = getXYDifference([0, 0], [scroll_delta, scroll_delta]);

    if (scroll_progress_percent >= 1 || scroll_progress_percent <= -1) {
        // Stop the previously running reset timer
        clearTimeout(scroll_deltaResetID);

        body_ref.trigger("onScrollTrigger", [scroll_progress_percent, scroll_direction_vector]); // Trigger scroll tigger event
        scroll_isTriggered = true;

    } else { // -1 <= scroll_progress_percent <= 1
        body_ref.trigger("onScrollChange", [scroll_progress_percent, scroll_direction_vector]); // Trigger scroll change event
    }
}

function resetDragDelta() {
    last_drag_delta = [0, 0];
    drag_delta = [0, 0];
}

// ( [int, int], bool )
function setDragDelta(newDragDeltaXY) {
    last_drag_delta = drag_delta;
    drag_delta = [ newDragDeltaXY[0], newDragDeltaXY[1] ]; 

    onDragDeltaChange();
}

function incrementDragDelta(newDragDeltaXY) {
    last_drag_delta = drag_delta;
    drag_delta[0] += newDragDeltaXY[0];
    drag_delta[1] += newDragDeltaXY[1];

    onDragDeltaChange();
}

function onDragDeltaStart() {
    body_ref.trigger("onDragXStart");
    body_ref.trigger("onDragYStart");
    body_ref.trigger("onDragXYStart");
    body_ref.trigger("onDragRadiusStart");
}

function onDragDeltaEnd() {
    drag_X_isTriggered ? drag_X_isTriggered = false : body_ref.trigger("onDragXEnd");
    drag_Y_isTriggered ? drag_Y_isTriggered = false : body_ref.trigger("onDragYEnd");
    drag_XY_isTriggered ? drag_XY_isTriggered = false : body_ref.trigger("onDragXYEnd");
    drag_radius_isTriggered ? drag_radius_isTriggered = false : body_ref.trigger("onDragRadiusEnd");
}

function RESET_ALL_DELTAS () {
    mouse_down = false;

    drag_delta = [0, 0];
    last_drag_delta = [0, 0];

    scroll_delta = 0;
    last_scroll_delta = 0;

    clearTimeout(scroll_deltaResetID);
    scroll_deltaResetID = null;

    scroll_isTriggered = false;
    drag_X_isTriggered = false;
    drag_Y_isTriggered = false;
    drag_XY_isTriggered = false;
    drag_radius_isTriggered = false;
}

function onDragDeltaChange() {

    var drag_progress_percent = [ constrain(drag_delta[0] / DRAG_DELTA_X_THRESHOLD_PIXEL, -1, 1), constrain(drag_delta[1] / DRAG_DELTA_Y_THRESHOLD_PIXEL, -1, 1) ];

    var drag_changed = [ drag_delta[0] != last_drag_delta[0], drag_delta[1] != last_drag_delta[1] ];

    var drag_triggered = [ drag_progress_percent[0] <= -1 || drag_progress_percent[0] >= 1, drag_progress_percent[1] <= -1 || drag_progress_percent[1] >= 1 ];

    // var drag_triggered = [ 
    //     floatCompare("<= ", drag_progress_percent[0], -1, 0.05) || floatCompare(">=", drag_progress_percent[0], 1, 0.05), 
    //     floatCompare("<=", drag_progress_percent[1], -1, 0.05) || floatCompare(">=", drag_progress_percent[1], 1, 0.05) ];

    var drag_direction_vector = getXYDifference(last_drag_delta, drag_delta);

    // Drag X only events
    if (drag_changed[0] == true && !drag_X_isTriggered) {

        if (drag_triggered[0] == true) {
            body_ref.trigger("onDragXTrigger", [drag_progress_percent[0], drag_direction_vector[0]]);
            drag_X_isTriggered = true;
        } else {
            body_ref.trigger("onDragXChange", [drag_progress_percent[0], drag_direction_vector[0]]);
        }
    }

    // Drag Y only events
    if (drag_changed[1] == true && !drag_Y_isTriggered) {

        if (drag_triggered[1] == true) {
            body_ref.trigger("onDragYTrigger", [drag_progress_percent[1], drag_direction_vector[1]]);
            drag_Y_isTriggered = true;
        } else {
            body_ref.trigger("onDragYChange", [drag_progress_percent[1], drag_direction_vector[1]]);
        }
    }

    // Drag X + Y events
    if (drag_changed[0] == true || drag_changed[1] == true && !drag_XY_isTriggered) { // If at least one drag dimension is changed

        if (drag_triggered[0] == true || drag_triggered[1] == true) { // If at least one drag dimension is triggered
            body_ref.trigger("onDragXYTrigger", [drag_progress_percent, drag_direction_vector]);
            drag_XY_isTriggered = true;
        } else {
            body_ref.trigger("onDragXYChange", [drag_progress_percent, drag_direction_vector]);
        }
    }

    // Drag radius events
    if (drag_changed[0] == true || drag_changed[1] == true && !drag_radius_isTriggered) { // If at least one drag dimension is changed

        var drag_radius = Math.sqrt(Math.pow(drag_delta[0], 2) + Math.pow(drag_delta[1], 2))/DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // [0 to 1]

        if (drag_radius >= 1) { // If the drag radius is triggered
            body_ref.trigger("onDragRadiusTrigger", [drag_progress_percent, drag_direction_vector]);
            drag_radius_isTriggered = true;
        } else {
            body_ref.trigger("onDragRadiusChange", [drag_radius, drag_direction_vector]);
        }
    }
}

// --------------------------
// --- Event trigger code ---
// --------------------------

// Mousewheel swipe code

body_ref.on('mousewheel DOMMouseScroll', function(e) {
    if (scroll_deltaResetID == null) { // If first mousewheel event
        onScrollDeltaStart();
    }

    var delta = e.originalEvent.wheelDeltaY;
    incrementScrollDelta(delta);

    // Stop the previously running reset timer
    clearTimeout(scroll_deltaResetID);

    // Set a timeout function that resets the scroll delta
    // amount after a peroid of inactivity
    scroll_deltaResetID = setTimeout(function() {
        onScrollDeltaEnd();
    }, SCROLL_RESET_TIME);
});

// Mouse swipe code

var mouse_pos_start = [0, 0];
var mouse_down = false;

body_ref.on('mousedown', function(e) {
    // Check for left click
    if (e.which != 1) {
        return;
    }

    onDragDeltaStart();

    mouse_down = true;
    mouse_pos_start[0] = e.pageX;
    mouse_pos_start[1] = e.pageY;
});

body_ref.on('mousemove', function(e) {
    // Check for left click and mouse is down
    if (e.which != 1 || mouse_down != true) { 
        return;
    }

    var curr_pos = [e.pageX, e.pageY];
    setDragDelta([curr_pos[0] - mouse_pos_start[0], curr_pos[1] - mouse_pos_start[1] ]);
});

body_ref.on('mouseup mouseleave', function(e) {
    // Check for left click
    if (e.which != 1) {
        return;
    }

    mouse_down = false;
    mouse_pos_start = [0, 0];
    
    onDragDeltaEnd();
    resetDragDelta();
});

// Touch swipe code

var touch_pos_start = [0, 0];

body_ref.on('touchstart', function (e) {
    touch_pos_start = [ e.touches[0].clientX, e.touches[0].clientY ];

    onDragDeltaStart();
});

body_ref.on('touchmove', function (e) {

    var curr_pos = [e.touches[0].clientX, e.touches[0].clientY];

    setDragDelta([curr_pos[0] - touch_pos_start[0], curr_pos[1] - touch_pos_start[1] ]);
});

body_ref.on('touchend touchcancel', function (e) {

    touch_posY_start = 0;

    onDragDeltaEnd();
    resetDragDelta();
});