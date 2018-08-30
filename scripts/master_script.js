const PAGE_BACKGROUND = "page-background";

var isTransitioning = false;


function Page(element_identifier, nextPage, prevPage) {
    this.element_identifier = element_identifier;
    this.nextPage = nextPage;
    this.prevPage = prevPage;

    this.element_ref = $(element_identifier);
    this.body_ref = $('body');

    this.isOpen = false;

    this.open = function (animation_options, onComplete_callbackFcn) { 
        console.warn("Unimplemented open() method"); 
        this.isOpen = true;
        
    }
    this.close = function(animation_options, onComplete_callbackFcn) { console.warn(this.element_identifier + ": Unimplemented close() method"); }
    this.transitionUpdate = function() { console.warn(this.element_identifier + ": Unimplemented close() method"); };
    this.openNextPage = function(animation_options, onComplete_callbackFcn) { console.warn(this.element_identifier + ": Unimplemented openNextPage() method"); }
    this.openPrevPage = function(animation_options, onComplete_callbackFcn) { console.warn(this.element_identifier + ": Unimplemented openNextPage() method"); }

    this.hasNext = function () { this.nextPage != null; };
    this.hasPrev = function () { this.prevPage != null; };

    // this.run_test_method = function() { test_thing.call(this) };
}


var home_page = null;
var project_pages = [];
var about_page = null;

const NUM_PROJECTS = 3;

instantiate_pages();

function instantiate_pages() {
    // Initialize the projects' Page objects
    for (var i = 0; i < NUM_PROJECTS; i++) {
        project_pages.push(new Page("#project-" + (i+1), null, null) ); // nextPage and prevPage get set later
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

    home_page = new Page("#front-page__container", project_pages[0], null);

    about_page = new Page("#about-page__container", null, null);
}


setup_pages();

function setup_pages() {
    setup_home_page.call(home_page);
}



init_pages_state();

function init_pages_state() {
    home_page.close("none", function(){}); // Direction doesnt matter here

    for (var i = 0; i < NUM_PROJECTS; i++) {
        var curr_project = project_pages[i];
        curr_project.close("none", function(){}); // Direction doesnt matter here
    }

    about_page.close("none", function(){}); // Direction doesnt matter here
}

var current_page = home_page;
current_page.open("none", function(){});












// class Page {
//     // String, ScrollableElement[], Page, Page, function(int, String), function(bool, String, function()), function(bool, String, function())
//     constructor (element_identifier, scrollable_elements, nextPage, prevPage) {
//         this.element_identifier = element_identifier;
//         this.scrollable_elements = scrollable_elements;
//         this.nextPage = nextPage;
//         this.prevPage = prevPage;

//         this.element_ref = $(element_identifier); 

//         // Default on delta change function
//         // [int, int], bool
//         this.onDeltaYChange = function (total_deltaY, animate) {
//             if (animate) {
//                 TweenMax.to(this.element_ref, 0.2, { y: total_deltaY, ease: Power2.easeOut });
//             }
//             else {
//                 TweenMax.set(this.element_ref, { y: total_deltaY});
//             }
//         }

//         this.onDeltaYReset = function(deltaY, animate) {
//             var element = $(element_identifier);
//             if (animate) {
//                 TweenMax.to(this.element_ref, 0.5, { y: total_deltaY, ease: Elastic.easeOut.config(1.2, 0.4) });
//             }
//             else {
//                 TweenMax.set(this.element_ref, { y: total_deltaY});
//             }
//         }

//         // Default open function (type = ["nextPage", "prevPage", "none", default="regular"] )
//         this.open = function (type, onComplete_fcn) {
//             if (type == "none") {
//                 TweenMax.set(this.element_ref, { y: 0, onComplete: onComplete_fcn });
//             }
//             else if (type == "nextPage") {
//                 // From bottom of page
//                 TweenMax.fromTo(this.element_ref, 1,
//                     { y: "100vh" }, 
//                     { y: 0, onComplete: onComplete_fcn }
//                 );
//             }
//             else if (type == "prevPage") {
//                 // From top of page
//                 TweenMax.fromTo(this.element_ref, 1,
//                     { y: "-100vh" }, 
//                     { y: 0, onComplete: onComplete_fcn  }
//                 );
//             } else {
//                 // TODO: some cool fade animation
//             }
//         }

//         // Default close function
//         this.close = function (type, onComplete_fcn) {
//             if (type == "none") {
//                 TweenMax.set(this.element_ref, { y: "-100vh", onComplete: onComplete_fcn });
//             }
//             else if (type == "nextPage") {
//                 // To top of page
//                 TweenMax.to(this.element_ref, 1, 
//                     { y: "-100vh", onComplete: onComplete_fcn }
//                 );
//             }
//             else if (type == "prevPage") {
//                 // To bottom of page
//                 TweenMax.to(this.element_ref, 1, 
//                     { y: "100vh", onComplete: onComplete_fcn }
//                 );
//             } else {
//                 // TODO: some cool fade animation
//             }
//         }
//     }

//     hasNext() {
//         return this.nextPage != null;
//     }

//     hasPrev() {
//         return this.prevPage != null;
//     }
// }

// class ScrollableElement {
//     // String, int
//     constructor (element_identifier, deltaY_change_multiplier) {
//         this.element_identifier = element_identifier;
//         this.deltaY_change_multiplier = deltaY_change_multiplier;

//         this.element_ref = $(element_identifier);
//     }
// }



