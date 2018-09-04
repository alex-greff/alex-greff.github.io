function Page(element_identifier, nextPage, prevPage) {
    this.element_identifier = element_identifier;
    this.nextPage = nextPage;
    this.prevPage = prevPage;

    this.element_ref = $(element_identifier);
    this.body_ref = $('body');

    // Setup static variables
    if (typeof Page.current_page === 'undefined') { Page.current_page = null; }
    if (typeof Page.page_background_ref === 'undefined') { Page.page_background_ref = $(".page-background"); }

    this.isOpen = false;
    this.isTransitioning = false;

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) { 
        RESET_ALL_DELTAS() // input_manager.js

        this.isTransitioning = true;
        this.isOpen = true;

        this.subscribe_to_events();
        this.open_anim_base(animation_options, onComplete_callbackFcn, onComplete_callbackScope);

        console.warn(this.element_identifier + ": Unimplemented open() method"); 
    }
    this.close = function(animation_options, onComplete_callbackFcn, onComplete_callbackScope) { 
        this.isTransitioning = true;
        this.isOpen = false;

        this.unsubscribe_from_events();
        this.close_anim_base(animation_options, onComplete_callbackFcn, onComplete_callbackScope);

        console.warn(this.element_identifier + ": Unimplemented close() method"); 
    }
    this.transitionUpdate = function() { console.warn(this.element_identifier + ": Unimplemented close() method"); };

    this.hasNext = function () { this.nextPage != null; };
    this.hasPrev = function () { this.prevPage != null; };

    this.subscribe_to_events = function() {
        // TODO: implement
    }

    this.unsubscribe_to_events = function() {
        // TODO: implement
    }

    // ---------------------------
    // --- Animation functions ---
    // ---------------------------

    // For each page we can make add-on animation functions

    this.open_anim_base = function(animation_options, longest_time) {
        // Set page background color
        TweenMax.to(Page.page_background_ref, 0.5, { backgroundColor: this.page_background_color_1 });

        // Set page to be visible
        this.visibility_setter(0, "visibile");

        // If no animation is wanted
        if (animation_options == "no-anim") { // No opening animation
            this.onComplete_caller(0, onComplete_callbackFcn, onComplete_callbackScope);
            this.isTransitioning = false;
            return;
        }

        this.onComplete_caller(longest_time, onComplete_callbackFcn, onComplete_callbackScope);
        this.isTransitioning_setter(longest_time, false);
    }

    this.close_anim_base = function(animation_options, longest_time) {
        // Page background color
        TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: this.page_background_color_2});

        if (animation_options == "no-anim") { // No closing animation
            this.visibility_setter(0, 'hidden');
            this.onComplete_caller(0, onComplete_callbackFcn, onComplete_callbackScope);
            this.isTransitioning = false;
            return;
        } 

        this.onComplete_caller(longest_time, onComplete_callbackFcn, onComplete_callbackScope);
        this.isTransitioning_setter(longest_time, false);
        this.visibility_setter(longest_time, 'hidden');
    }

    this.transition_anim_base = function(percent, direction_vector, animate) {
        // Color animation
        var clr = lerpColor(this.page_background_color_1, this.page_background_color_2, Math.abs(percent)); // Get color lerp value
        if (!this.isTransitioning) {
            if (animate) { TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: clr}); }
            else { TweenMax.set(Page.page_background_ref, {backgroundColor: clr}); }
        }
    }

    this.reset_transition_anim_base = function() {
        // Reset page color
        TweenMax.to(Page.page_background_ref, 0.5, {backgroundColor: this.page_background_color_1});
    }



    this.onComplete_caller = function(delay_time, onComplete_callbackFcn, onComplete_callbackScope) {
        // Call the onComplete function after the delay time
        TweenMax.set(this.element_ref, {delay: delay_time, onComplete: onComplete_callbackFcn, onCompeteScope: onComplete_callbackScope});
    }

    this.isTransitioning_setter = function(delay_time, bool_value) {
        TweenMax.set(this.element_ref, {delay: delay_time, onComplete: () => { this.isTransitioning = bool_value } });
    }

    this.visibility_setter = function(delay_time, visibility_val) {
        TweenMax.set(this.element_ref, {delay:delay_time, visibility: visibility_val});
    }
}