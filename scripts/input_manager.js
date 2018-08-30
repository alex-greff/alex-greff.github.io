// -----------------------------
// --- Delta management code ---
// -----------------------------
var body_ref = $('body');

var drag_delta = [0, 0];
var last_drag_delta = [0, 0];


const DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE = 0.35; // Percent of lower page dimension
var DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // Gets filled later

const DRAG_DELTA_Y_THRESHOLD_PERCENTAGE = 0.35; // The y (veritcal) drag  amount threshold
var DRAG_DELTA_Y_THRESHOLD_PIXEL; // Gets filled

const DRAG_DELTA_X_THRESHOLD_PERCENTAGE = 0.35; // The x (horizontal) drag amount threshold
var DRAG_DELTA_X_THRESHOLD_PIXEL; // Gets filled



var scroll_delta = 0;
var last_scroll_delta = 0;

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
    last_scroll_delta = scroll_delta;
    scroll_delta = 0;

    onScrollDeltaChange(true);
}

function setScrollDelta(newScrollDelta, animate) {
    last_scroll_delta = scroll_delta;
    scroll_delta = newScrollDelta;

    onScrollDeltaChange(animate);
}

function incrementScrollDelta(incrementAmt, animate) {
    last_scroll_delta = scroll_delta;
    scroll_delta += incrementAmt;

    onScrollDeltaChange(animate);
}

function onScrollDeltaChange(animate) {
    var scroll_progress_percent = constrain(scroll_delta / SCROLL_DELTA_THRESHOLD_PIXEL, -1, 1); // range [-1, 1]

    if (scroll_delta == last_scroll_delta ) {
        return;
    }

    if (scroll_progress_percent >= 1 || scroll_progress_percent <= -1) {
        // Stop the previously running reset timer
        clearTimeout(scroll_deltaResetID);

        body_ref.trigger("onScrollTrigger", [scroll_progress_percent, animate]); // Trigger scroll tigger event
    } else { // -1 <= scroll_progress_percent <= 1
        body_ref.trigger("onScrollChange", [scroll_progress_percent, animate]); // Trigger scroll change event
    }
}



function resetDragDelta() {
    last_drag_delta = drag_delta;
    drag_delta = [0, 0];

    onDragDeltaChange(true);
}

// ( [int, int], bool )
function setDragDelta(newDragDeltaXY, animate) {
    last_drag_delta = drag_delta;
    drag_delta = [ newDragDeltaXY[0], newDragDeltaXY[1] ]; 

    onDragDeltaChange(animate);
}

function incrementDragDelta(newDragDeltaXY, animate) {
    last_drag_delta = drag_delta;
    drag_delta[0] += newDragDeltaXY[0];
    drag_delta[1] += newDragDeltaXY[1];

    onDragDeltaChange(animate);
}

function onDragDeltaChange(animate) {
    var drag_progress_percent = [ constrain(drag_delta[0] / DRAG_DELTA_X_THRESHOLD_PIXEL, -1, 1), constrain(drag_delta[1] / DRAG_DELTA_Y_THRESHOLD_PIXEL, -1, 1) ];

    // console.log("X: " + drag_progress_percent[0] * 100 + "% Y: " + drag_progress_percent[1] * 100 + "%"); // TODO: remove

    var drag_changed = [ drag_delta[0] != last_drag_delta[0], drag_delta[1] != last_drag_delta[1] ];

    var drag_triggered = [ drag_progress_percent[0] <= -1 || drag_progress_percent[0] >= 1, drag_progress_percent[1] <= -1 || drag_progress_percent[1] >= 1 ];

    // Drag X only events
    if (drag_changed[0] == true) {

        if (drag_triggered[0] == true) {
            body_ref.trigger("onDragXTrigger", [drag_progress_percent[0], true]);
        } else {
            body_ref.trigger("onDragXChange", [drag_progress_percent[0], animate]);
        }
    }

    // Drag Y only events
    if (drag_changed[1] == true) {

        if (drag_triggered[1] == true) {
            body_ref.trigger("onDragYTrigger", [drag_progress_percent[1], true]);
        } else {
            body_ref.trigger("onDragYChange", [drag_progress_percent[1], animate]);
        }
    }

    // Drag X + Y events
    if (drag_changed[0] == true || drag_changed[1] == true) { // If at least one drag dimension is changed
        if (drag_triggered[0] == true || drag_triggered[1] == true) { // If at least one drag dimension is triggered
            body_ref.trigger("onDragXYTrigger", [drag_progress_percent, true]);
        } else {
            body_ref.trigger("onDragXYChange", [drag_progress_percent, animate]);
        }
    }

    // Drag radius events
    if (drag_changed[0] == true || drag_changed[1] == true) { // If at least one drag dimension is changed
        var drag_radius = Math.sqrt(Math.pow(drag_delta[0], 2) + Math.pow(drag_delta[1], 2))/DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // [0 to 1]

        if (drag_radius >= 1) { // If the drag radius is triggered
            body_ref.trigger("onDragRadiusTrigger", [drag_progress_percent, true]);
        } else {
            body_ref.trigger("onDragRadiusChange", [drag_radius, animate]);
        }
    }
}

// function __transition_page(nextPage, type) {
//     isTransitioning = true;
//     total_deltaY = 0;
//     // Stop the running reset timer
//     clearTimeout(deltaYResetID);

//     current_page.close(type, function() {
//         nextPage.open(type, function(){
//             current_page = nextPage;
//             isTransitioning = false;
//         });
//     });
// }

// --------------------------
// --- Event trigger code ---
// --------------------------

// Mousewheel swipe code

body_ref.on('mousewheel DOMMouseScroll', function(e) {

    var delta = e.originalEvent.wheelDeltaY;
    incrementScrollDelta(delta, true);

    // Stop the previously running reset timer
    clearTimeout(scroll_deltaResetID);

    // Set a timeout function that resets the scroll delta
    // amount after a peroid of inactivity
    scroll_deltaResetID = setTimeout(function() {
        resetScrollDelta();
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
    setDragDelta([curr_pos[0] - mouse_pos_start[0], curr_pos[1] - mouse_pos_start[1] ], false);
});

body_ref.on('mouseup mouseleave', function(e) {
    // Check for left click
    if (e.which != 1) {
        return;
    }

    mouse_down = false;
    mouse_pos_start = [0, 0];
    
    resetDragDelta();
});

// Touch swipe code

var touch_pos_start = [0, 0];

body_ref.on('touchstart', function (e) {

    touch_pos_start = [ e.touches[0].clientX, e.touches[0].clientY ];
});

body_ref.on('touchmove', function (e) {

    var curr_pos = [e.touches[0].clientX, e.touches[0].clientY];

    setDragDelta([curr_pos[0] - touch_pos_start[0], curr_pos[1] - touch_pos_start[1] ], false);
});

body_ref.on('touchend touchcancel', function (e) {

    touch_posY_start = 0;

    resetDragDelta();
});




// body_ref.on("onDragXChange", function (e, percent, animate) {
//     //console.log("Read DragXYChange: X: " + percentXY[0] * 100 + "% Y: " + percentXY[1] * 100 + "%");
//     //console.log("Read DragXChange: X: " + percent * 100 + "%");
// });