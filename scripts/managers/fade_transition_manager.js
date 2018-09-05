var PageTransition = Barba.BaseTransition.extend({
    start: function() {
      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.closeOldPage()])
        .then(this.openNewPage.bind(this));
    },
  
    closeOldPage: function() {
        // Return a promise that is fulfilled after the current page is donec losing
        return new Promise(function(resolve) {
            current_page.close(
                current_page.pending_transition_anim_option, 
                function() { console.log(this.element_identifier + ": close Resolving"); resolve(true); }, current_page);
        });
    },
  
    openNewPage: function() {
        var target_page = current_page.pending_transition_target_page;
        var target_anim_option = current_page.pending_transition_target_page_anim_option;

        // Open the target page
        target_page.open(target_anim_option, function() { console.log("open done"); this.done() }, this);

        // Set the target page as the current page
        current_page = target_page;
    }
});
  
  /**
   * Next step, you have to tell Barba to use the new Transition
   */
  
Barba.Pjax.getTransition = function() {
    // Return our custom transition
    return PageTransition;
};