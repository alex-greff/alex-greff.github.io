var PageTransition = Barba.BaseTransition.extend({
    start: function() {
      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.closeOldPage(), this.newContainerLoading])
        .then(this.openNewPage.bind(this));
    },
  
    closeOldPage: function() {
        // Return a promise that is fulfilled after the current page is donec losing
        return new Promise(function(resolve) {
            var pt = Page.pendingTransition;

            var curr_page = pt.currentPage;

            if (curr_page != null) {
                curr_page.close( pt.currentPageAnimOption, function() { resolve(true); }, pt.currentPage);
            } else {
                resolve(true);
            }
        });
    },
  
    openNewPage: function() {
        var pt = Page.pendingTransition;
        var target_page = pt.targetPage;
        var target_anim_option = pt.targetPageAnimOption;

        // By default set the pending target page to the previous page (so the back button works properly)
        pt.targetPage = pt.currentPage;
        pt.targetPageAnimOption = pt.currentPageAnimOption;
        pt.currentPage = target_page;
        pt.currentPageAnimOption = target_anim_option; // Set the target page as the current page in the master script (might wanna remove this later)

        // Open the target page
        target_page.open(target_anim_option, function() { this.done() }, this);
    }
});
  
/**
 * Next step, you have to tell Barba to use the new Transition
 */
  
Barba.Pjax.getTransition = function() {
    // Return our custom transition
    return PageTransition;
};