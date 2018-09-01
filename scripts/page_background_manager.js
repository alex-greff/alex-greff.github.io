function PageBackgroundManager () {
    PageBackgroundManager.currPos = [50, 50];

    if (typeof PageBackgroundManager.page_background_ref === 'undefined') { 
        PageBackgroundManager.page_background_ref = $(".page-background");
    }

    // PageBackgroundManager.setPosition(animate) {

    // }
}