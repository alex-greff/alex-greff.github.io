$( document ).ready(function() {
    Barba.Pjax.start();
});

// // Detect mobile device
// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//     // TOOD: do some code...
//     window.location.replace("http://stackoverflow.com");
// }

check_loaded_page();

function check_loaded_page() {
    var curr_page_path = document.location.pathname;

    console.log("curr page path " + curr_page_path);

    if (curr_page_path !== "/") {
        sessionStorage.setItem("loadPage", curr_page_path);
        console.log("wrong page"); // TODO: remove
        window.location.replace("/");
    }
}

const PAGE_BACKGROUND = "page-background";

var nav_page = null;
var home_page = null;
var project_pages = [];
var about_page = null;
var project_page_nav = null;

const NUM_PROJECTS = 3;

instantiate_pages();

function instantiate_pages() {

    // Initialize the projects' Page objects
    for (var i = 0; i < NUM_PROJECTS; i++) {
        project_pages.push(new Page("#project-" + (i+1), "/projects/", null, null) ); // nextPage and prevPage get set later
    }

    // Populate the next and previous page references post-object initialization
    for (var i = 0; i < NUM_PROJECTS; i++) {
        var curr_project = project_pages[i];

        var prev_idx = (i-1) % NUM_PROJECTS;
        if (prev_idx == -1) {
            prev_idx = NUM_PROJECTS - 1;
        }
        var next_idx = (i+1) % NUM_PROJECTS;

        curr_project.nextPage = project_pages[next_idx];
        curr_project.prevPage = project_pages[prev_idx];

        curr_project.projectNum = (i+1);

        // curr_project.infoPage = new Page("#project-"+(i+1)+"__info", curr_project.nextPage, curr_project.prevPage);
    }    

    nav_page = new Page("#nav-page", "/", null, null);
    home_page = new Page("#front-page__container", "/", project_pages[0], null);
    about_page = new Page("#about-page__container", "/about/", null, null);
    project_page_nav = new Page("#project-page-nav", "/", null, null);
}


setup_pages();

function setup_pages() {
    setup_home_page.call(home_page);

    setup_project_page.call(project_pages[0], "#9292EA", "#D27ECC");
    setup_project_page.call(project_pages[1], "#0B0C1F", "#110F30");
    setup_project_page.call(project_pages[2], "#4F636C", "#638DA0");

    setup_nav_page.call(nav_page);

    setup_project_page_nav.call(project_page_nav, project_pages.length);

    // setup_project_1_page.call(project_pages[0]);
    // setup_project_2_page.call(project_pages[1]);
    // setup_project_3_page.call(project_pages[2]);
    // setup_project_4_page.call(project_pages[3]);
    // setup_project_5_page.call(project_pages[4]);

    setup_about_page.call(about_page, "#67A4BF", "#72C1CB");
}


init_pages_state();

function init_pages_state() {
    home_page.close("no-anim"); // Direction doesnt matter here

    for (var i = 0; i < NUM_PROJECTS; i++) {
        var curr_project = project_pages[i];
        curr_project.close("no-anim"); // Direction doesnt matter here
    }

    about_page.close("no-anim");
    nav_page.close("no-anim");
    project_page_nav.close("no-anim");
}


var pageAddressToPageObjectMap = {};
pageAddressToPageObjectMap[ "/" ] = home_page;
pageAddressToPageObjectMap[ "/projects/" ] = project_pages[0];
pageAddressToPageObjectMap[ "/about/" ] = about_page;

get_current_page_str(document.location.pathname);
function get_current_page_str(path) {
    //var path = document.location.pathname;
    
    // path = path.replace(/index.html$/, "").replace(/\/$/, "");
    path = path.replace(/index.html$/, "");

    path = (path == "") ? "/" : path;

    return path;
}

function get_current_page_object(str_path) {
    return pageAddressToPageObjectMap[str_path];
}

// ----------------------------------------
// --- Setup initial pending transition ---
// ----------------------------------------

var target_page_path = sessionStorage.getItem("loadPage");
target_page_path = (target_page_path == null) ? "/" : target_page_path;
sessionStorage.removeItem("loadPage");

var pt = Page.pendingTransition;

// console.log("Attempting to get: " + get_current_page_str(target_page_path));
pt.currentPage = get_current_page_object(get_current_page_str(target_page_path));
// console.log(pt.currentPage);
// pt.currentPageAnimOption = "anim";
// var current_page = home_page; // TODO: remove


// --------------------
// --- Loading page ---
// --------------------

// Loading effect
var loading_page = $(".loading-page");
var loading_page_bar = $(".loading-page__bar");
var page_background = $(".page-background");

var stage_interval_min = 0.3;
var stage_interval_max = 0.7;

// var stage_interval_min = 0.0; // TODO: revert
// var stage_interval_max = 0.0;

TweenMax.set(page_background, {backgroundColor: pt.currentPage.page_background_color_1});
TweenMax.set(loading_page_bar, {width: "0%", backgroundColor: pt.currentPage.page_background_color_1 });

// console.log(getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100);

// var tl = new TimelineMax({ onComplete: () => { pt.currentPage.open("anim"); } });
var tl = new TimelineMax({ onComplete: () => {
    if (target_page_path === ("/")) {
        pt.currentPage.open("anim");
    } else {
        loadPageFromPageObj(pt.currentPage); 
    }
} });
tl.to(loading_page_bar, getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100, {width: "20%" });
tl.to(loading_page_bar, getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100, {width: "30%" });
tl.to(loading_page_bar, getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100, {width: "50%" });
tl.to(loading_page_bar, getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100, {width: "100%" });
tl.to(loading_page_bar, getRandomNumber(stage_interval_min * 100, stage_interval_max * 100)/100, {delay: 0.1, height: "100%"});
tl.set(loading_page, { opacity: 0, visibility: "hidden" });


// ---------------------------
// --- Load page functions ---
// ---------------------------

function loadPageFromPath(target_path) {
    loadPageFromPageObj(get_current_page_object(target_path));
}

function loadPageFromPageObj(target_page) {
    var pt = Page.pendingTransition;

    // Setup pending transition
    pt.targetPage = target_page;
    pt.targetPageAnimOption = "anim";

    if (Page.nav_open) { nav_page.close("anim", () => { 
        console.log("attempting to load from nav: " + pt.targetPage.html_location); 
        Barba.Pjax.goTo(pt.targetPage.html_location); 
    }); } // Trigger page load after nav is closed
    else { 
        console.log("attempting to load: " + pt.targetPage.html_location); 
        Barba.Pjax.goTo(pt.targetPage.html_location); 
    } // Trigger page load instantly
}


// Warning: assumes the given page is a project page
function loadNextProject(project_page) {
    project_page.load_next_page();
}

function loadPrevProject(project_page, anim) {
    project_page.load_prev_page();
}