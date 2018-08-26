const PAGE_BACKGROUND = "page-background";
const SCROLL_SPEED = 500;
const RESET_TIME = 250;

const SCROLL_DIVISOR = 3;

var page_items = [ "front-page__container" ];
var curr_item_idx = 0;

var total_deltaY = 0;
var deltaYResetID;


$('body').on('mousewheel DOMMouseScroll', function(e) {
    var deltaY = e.originalEvent.wheelDeltaY;
    incrementDeltaY(deltaY);

    // Stop the previously running reset timer
    clearTimeout(deltaYResetID);

    // Set a timeout function that resets the delta Y
    // amount after a peroid of inactivity
    deltaYResetID = setTimeout(function() {
        setDeltaY(0);
    }, RESET_TIME);
});



$('body').on('mousedown', function(e) {
    console.log("mouse down");
});

$('body').on('mouseup', function(e) {
    console.log("mouse up");
});

$('body').on('swipedown', function(){
    console.log("swipe down");
});

$('body').on('swipeup', function(){
    console.log("swipe up");
});

function setDeltaY (newDeltaY) {
    total_deltaY = newDeltaY;

    onDeltaYChange();
}

function incrementDeltaY (incrementAmt) {
    total_deltaY += incrementAmt;

    onDeltaYChange();
}

function onDeltaYChange () {
    var curr_item = $("#" + page_items[curr_item_idx]);

    curr_item.css("transform", "translate(0px, "+ total_deltaY/SCROLL_DIVISOR +"px)");
}
