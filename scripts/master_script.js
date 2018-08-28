const PAGE_BACKGROUND = "page-background";
const RESET_TIME = 250; // milliseconds

const SCROLL_DIVISOR = 3;

var page_items = [ "#front-page__container", "#education-page__container", "#projects-page__container" ];
var curr_item_idx = 0;

var total_deltaY = 0;
var deltaYResetID;

const PAGE_TRANSITION_SPEED = 2; // seconds
const PAGE_TRANSITION_THRESHOLD = 400; // pixels?

var isTransitioning = false;


class Page {
    // String, ScrollableElement[], Page, Page, function(int, String), function(bool, String, function()), function(bool, String, function())
    constructor (element_identifier, scrollable_elements, nextPage, prevPage) {
        this.element_identifier = element_identifier;
        this.scrollable_elements = scrollable_elements;
        this.nextPage = nextPage;
        this.prevPage = prevPage;

        this.element_ref = $(element_identifier); 

        // Default on delta change function
        this.onDeltaYChange = function (total_deltaY, animate) {
            if (animate) {
                TweenMax.to(this.element_ref, 0.2, { y: total_deltaY, ease: Power2.easeOut });
            }
            else {
                TweenMax.set(this.element_ref, { y: total_deltaY});
            }

            
        }

        this.onDeltaYReset = function(deltaY, animate) {
            var element = $(element_identifier);
            if (animate) {
                TweenMax.to(this.element_ref, 0.5, { y: total_deltaY, ease: Elastic.easeOut.config(1.2, 0.4) });
            }
            else {
                TweenMax.set(this.element_ref, { y: total_deltaY});
            }
        }

        // Default open function (type = ["nextPage", "prevPage", "none"] )
        this.open = function (animate, type, onComplete) {
            
        }

        // Default close function
        this.close = function (animate, type, onComplete) {

        }
    }

    hasNext() {
        return this.nextPage != null;
    }

    hasPrev() {
        return this.prevPage != null;
    }
}

class ScrollableElement {
    // String, int
    constructor (element_identifier, scroll_speed_deviation) {
        this.element_identifier = element_identifier;
        this.scroll_speed_deviation = scroll_speed_deviation;
    }
}

var home_page = null;
var project_pages = [];
var about_page = null;

const NUM_PROJECTS = 3;

initialize_pages();

function initialize_pages() {    
    for (var i = 0; i < NUM_PROJECTS; i++) {
        project_pages.push(new Page (
            "#project-" + (i+1),
            [ new ScrollableElement("#project-" + (i+1)) ],
            null, // Gets populated after
            null
        ));
    }

    // Populate the next and previous page references post-object initialization
    for (var i = 0; i < NUM_PROJECTS; i++) {
        var curr_project = project_pages[i];

        var prev_idx = (i-1) % NUM_PROJECTS;
        if (prev_idx == -1) {
            prev_idx = NUM_PROJECTS - 1;
        }
        var next_idx = (i+1) % NUM_PROJECTS;

        curr_project.prevPage = project_pages[prev_idx];
        curr_project.nextPage = project_pages[next_idx];
    }

    home_page = new Page(
        "#front-page__container", // Main element identifier
        [ new ScrollableElement("#front-page__container", 0) ], // Scrollable elements within the page
        project_pages[0], // Next page
        null // Prev page
    );

    about_page = new Page(
        "#about-page__container", // Main element identifier
        [ new ScrollableElement("#about-page__container", 0) ], // Scrollable elements within the page
        null, // Next page
        null // Prev page
    );
}

//init_pages_state();

// function init_pages_state() {
//     home_page.close_fcn(false, "up", function(){}); // Direction doesnt matter here

//     for (var i = 0; i < NUM_PROJECTS; i++) {
//         var curr_project = project_pages[i];
//         curr_project.close_fcn(false, "up", function(){}); // Direction doesnt matter here
//     }

//     about_page.close_fcn(false, "up", function(){}); // Direction doesnt matter here
// }

var current_page = home_page;
// current_page.open_fcn(true, "none", function(){});

// function standard_scroll_function(element_identifier, duration, transition_fcn, posX, posY) {
//     // console.log("std scroll fcn running for: " + element_identifier + " duration: " + duration + " trans fcn: " + transition_fcn);

//     var curr_item = $(element_identifier);

//     if (duration != null) {
//         curr_item.css("transition-duration", duration + "s");
//     }
//     if (transition_fcn != null) {
//         curr_item.css("transition-timing-function", transition_fcn);
//     }

//     curr_item.css("transform", "translate("+ posX + "px, " + posY + "px)");
// }



// -----------------------
// --- Delta Y setters ---
// -----------------------

function resetDeltaY() {
    total_deltaY = 0;

    current_page.onDeltaYReset(total_deltaY, true);
}

function setDeltaY (newDeltaY, animate) {
    total_deltaY = newDeltaY;

    onDeltaYChange(total_deltaY, animate);
}

function incrementDeltaY (incrementAmt, animate) {
    total_deltaY += incrementAmt;

    onDeltaYChange(total_deltaY, animate);
}

function onDeltaYChange (total_deltaY, animate) {

    // If we scrolled down and the current page does not have a previous page then stop the scroll
    if (total_deltaY > 0 && current_page.hasPrev() == false) {
        //return;
    }

    // If we scrolled up and the current page does not have a next page then stop the scroll
    if (total_deltaY < 0 && current_page.hasNext() == false) {
        //return;
    }

    // If the scroll delta is large enough then transition the page
    if (total_deltaY < -1 * PAGE_TRANSITION_THRESHOLD) { // Transition to next page
        //nextPage();
        //return;
    } 
    else if (total_deltaY > PAGE_TRANSITION_THRESHOLD) { // Transition to previous page
        //prevPage();
        //return;
    }

    // Signal the page to scroll
    current_page.onDeltaYChange(total_deltaY, animate);
}


function nextPage() {
    __transition_page(current_page.nextPage, "nextPage");
}

function prevPage() {
    __transition_page(current_page.prevPage, "prevPage");
}


function __transition_page(nextPage, type) {
    isTransitioning = true;
    // Stop the running reset timer
    clearTimeout(deltaYResetID);

    current_page.close(true, type, function() {
        nextPage.open(true, type, function(){
            current_page = nextPage;
            isTransitioning = false;
        });
    });
}

// ------------------------------
// --- Scroll implementations ---
// ------------------------------

// Mousewheel swipe code

$('body').on('mousewheel DOMMouseScroll', function(e) {
    // Checks (is not transitioning)
    if (isTransitioning == true) {
        return;
    }

    var deltaY = e.originalEvent.wheelDeltaY;
    incrementDeltaY(deltaY, true);

    // Stop the previously running reset timer
    clearTimeout(deltaYResetID);

    // Set a timeout function that resets the delta Y
    // amount after a peroid of inactivity
    deltaYResetID = setTimeout(function() {
        if (isTransitioning != true) {
            resetDeltaY();
        }
    }, RESET_TIME);
});

// Mouse swipe code

var mouse_posY_start = 0;
var mouse_down = false;

$('body').on('mousedown', function(e) {
    // Checks (must be left click and not transitioning)
    if (e.which != 1 || isTransitioning){ 
        return;
    }

    mouse_down = true;
    mouse_posY_start = e.pageY;
});

$('body').on('mousemove', function(e) {
    // Checks (must be left click, mouse is down and not transitioning)
    if (e.which != 1 || mouse_down != true || isTransitioning){ 
        return;
    }

    var curr_posY = e.pageY;
    setDeltaY(curr_posY - mouse_posY_start, false);
});

$('body').on('mouseup mouseleave', function(e) {
    // Checks (must be left click and not transitioning)
    if (e.which != 1 || isTransitioning){
        return;
    }

    mouse_down = false;
    mouse_posY_start = 0;
    
    resetDeltaY();
});

// Touch swipe code

var touch_posY_start = 0;

$('body').on('touchstart', function (e) {
    // Checks (is not transitioning)
    if (isTransitioning) {
        return;
    }

    touch_posY_start = e.touches[0].clientY;
});

$('body').on('touchmove', function (e) {
    // Checks (is not transitioning)
    if (isTransitioning) {
        return;
    }

    var curr_posY = e.touches[0].clientY;

    setDeltaY(curr_posY - touch_posY_start, false);
});

$('body').on('touchend touchcancel', function (e) {
    // Checks (is not transitioning)
    if (isTransitioning) {
        return;
    }

    touch_posY_start = 0;

    resetDeltaY();
});
