// Entry point
function setup_project_3_page() {
    // TODO: setup references here

    this.page_background_color_1 = "#F56F77"; // TODO: change
    this.page_background_color_2 = "#DF575F"; // TODO: change

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        RESET_ALL_DELTAS() // input_manager.js

        this.isTransitioning = true;
        this.isOpen = true;

        this.subscribe_to_events();

        this.open_anim(animation_options, onComplete_callbackFcn, onComplete_callbackScope);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        this.isTransitioning = true;
        this.isOpen = false;

        this.unsubscribe_from_events();

        this.close_anim(animation_options, onComplete_callbackFcn, onComplete_callbackScope);
    }

    // Load the next page
    this.load_next_page = function() {
        Page.current_page = this.nextPage;
        this.nextPage.open("anim-right", function(){}, this);
    }

    // Load the previous page
    this.load_prev_page = function() {
        Page.current_page = this.prevPage;
        this.prevPage.open("anim-left", function(){}, this);
    }

    // Setups the event subscriptions
    this.subscribe_to_events = function() {
        this.body_ref.on("onScrollChange", 
            (e, percent, direction_vector) => {
                this.update_transition(percent, direction_vector, true);
            }
        );

        this.body_ref.on("onDragXChange", 
            (e, percent, direction_vector) => {
                this.update_transition(percent, direction_vector, false);
            }
        );

        this.body_ref.on("onDragXTrigger onScrollTrigger", 
            (e, percent, direction_vector) => {
                if (percent > 0) {
                    this.close("anim", this.load_prev_page, this);
                }
                else { // percent <= 0 (will really be percent < 0)
                    this.close("anim", this.load_next_page, this);
                }
            }
        );

        this.body_ref.on("onScrollEnd onDragXEnd", 
            (e) => {
                this.reset_transition_anim();
            }
        );
    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events = function() {
        this.body_ref.off("onScrollChange");
        this.body_ref.off("onScrollTrigger");
        this.body_ref.off("onScrollEnd");
        this.body_ref.off("onDragXChange");
        this.body_ref.off("onDragXTrigger");
        this.body_ref.off("onDragXEnd");
    }

    // ---------------------------
    // --- Animation functions ---
    // ---------------------------
    this.open_anim = function(animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        // Set page background color
        TweenMax.to(Page.page_background_ref, 0.5, { backgroundColor: this.page_background_color_1 });

        // Set page to be visible
        TweenMax.set(this.element_ref, {visibility: 'visible'}); 

        TweenMax.set(this.body_ref, {overflow: "show"}); // Show overflow

        // If no animation is wanted
        if (animation_options == "no-anim") { // No opening animation
            TweenMax.set(this.element_ref, { onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope });
            this.isTransitioning = false;
            return;
        }

        var longest_time = 0.5;

        // The callback method (delayed by longest_time)
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope});

        // Transition completion setter
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: () => { this.isTransitioning = false } });

        // ------------------------------
        // --- Custom page animations ---
        // ------------------------------

        if (animation_options == "anim-left") { // Open from the left
            // TODO: add anims here, dont forget the onComplete callback

        }
        else if (animation_options == "anim-right") { // Open from the right
            // TODO: add anims here, dont forget the onComplete callback

        }
        else { // Default animation
            // TODO: add anims here, dont forget the onComplete callback
        }
    }

    this.close_anim = function(animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        if (animation_options == "no-anim") { // No closing animation
            TweenMax.set(this.element_ref, { visibility: 'hidden', onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope });
            this.isTransitioning = false;
            return;
        } 

        var longest_time = 0.2;

        // Page background color
        TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: this.page_background_color_2});

        // Visibility setter
        TweenMax.set(this.element_ref, {delay: longest_time, visibility: 'hidden'}); // Set page to be visible

        // The callback method (delayed by longest_time)
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope});

        // Transition completion setter
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: () => { this.isTransitioning = false } });

        // ------------------------------
        // --- Custom page animations ---
        // ------------------------------

        if (animation_options == "anim-left") { // Close to the left
            // TODO: add anims here

        } 
        else if (animation_options == "anim-right") { // Close to the right
            // TODO: add anims here
            
        } 
        else { // Default animation
            // TODO: add anims here
        }
    }

    this.update_transition = function(percent, direction_vector, animate) {
        // Get color lerp value
        var clr = lerpColor(this.page_background_color_1, this.page_background_color_2, Math.abs(percent));

        // ------------------------------
        // --- Custom page animations ---
        // ------------------------------

        if (animate) {
            // TODO: add animations here

            // Page background color
            if (!this.isTransitioning) { TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: clr}) };
        }
        else {
            // TODO: add setter animations here

            // Page background color
            if (!this.isTransitioning) { TweenMax.set(Page.page_background_ref, {backgroundColor: clr}) };
        } 
    }

    this.reset_transition_anim = function() {
        // Page background color
        TweenMax.to(Page.page_background_ref, 0.5, {backgroundColor: this.page_background_color_1});

        // ------------------------------
        // --- Custom page animations ---
        // ------------------------------

        // TODO: add anims here
    }
}