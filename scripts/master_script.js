/*$(document).scroll(function() {
    console.log($(document).scrollTop());
})*/

$('body').on('mousewheel DOMMouseScroll', function(e){
    console.log("Delta X: " + e.originalEvent.wheelDeltaX + " Delta Y: " + e.originalEvent.wheelDeltaY);
});