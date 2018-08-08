const PROGRESS_BAR_NAME = "loading-page-progress-bar";
const PROGRESS_PERCENT_DISPLAY_NAME = "loading-page-progress-percent-display";

function initialize_loading_page() {
    progres_percent_bar_effect();
}

function onResizeEvent_loading_page() {

}


function progres_percent_bar_effect() {
    var id = setInterval(frame, 10);

    function frame() {
        var width = $('.loading-page-progress-bar').width();
        var parentWidth = $('.loading-page-progress-bar').offsetParent().width();
        var percent = Math.round(100 * width / parentWidth);

        $('.loading-page-progress-percent-display').html(percent + "%");

        if (percent >= 100) {
            clearInterval(id);
        }
    }    
}