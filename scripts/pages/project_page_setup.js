function setup_project_page(bg_col1, bg_col2) {
    this.page_background_color_1 = bg_col1;
    this.page_background_color_2 = bg_col2;

    // this.page_title = this.element_ref.find(".title");
    // this.page_info = this.element_ref.find(".info");

    // this.more_info_btn = this.element_ref.find(".projects-page__more-info-btn");

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_project_page();

        this.hambuger_btn = this.body_ref.find(".nav-page__hamburger-icon"); // Hamburger button
    }

    this.get_references_custom_project_page = function() {
        this.page_title = this.element_ref.find(this.element_identifier + " .title");
        this.page_info = this.element_ref.find(this.element_identifier + " .info");
        this.more_info_btn = this.element_ref.find(this.element_identifier + " .projects-page__more-info-btn");
    }

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = (animation_options == "anim-left" || animation_options == "anim-right") ? 1.5 : 0.5;
        this.open_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.open_custom_project_page(animation_options);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.3;
        this.close_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.close_custom_project_page(animation_options);
    }

    this.transition_update = function(percent, direction_vector, animate) {
        this.transition_update_base(percent, direction_vector, animate);
        this.transition_update_custom(percent, direction_vector, animate);
    }

    this.transition_update_custom = function(percent, direction_vector, animate) {
        if (this.isTransitioning) { return; }

        var custom_curve_slope = 1;
        var raw_custom_curve = ((-1 * (1/((custom_curve_slope * Math.abs(percent)) + 1))) + 1) * Math.sign(percent);
        
        var x_offset_curve =  raw_custom_curve * 50;
        var opacity_curve = 1 - Math.min(0.5, Math.abs(percent));
        // var scale_curve = 1 - Math.abs(raw_custom_curve) * 1/2;

        if (animate) {
            TweenMax.to(this.element_ref, 0.5, { x: x_offset_curve + "%", opacity: opacity_curve });
        } else {
            TweenMax.set(this.element_ref, { x: x_offset_curve + "%", opacity: opacity_curve});
        }
    }

    this.reset_transition = function() {
        this.reset_transition_base();
        this.reset_transition_custom();
    }

    this.reset_transition_custom = function() {
        if (this.isTransitioning) { return; }
        TweenMax.to(this.element_ref, 1, { x: "0%", ease: Elastic.easeOut});
        TweenMax.to(this.element_ref, 0.5, {opacity: 1})
    }

    // Load the next page
    this.load_next_page = function() {
        this.close("anim-left", function() {
            Page.pendingTransition.currentPage = this.nextPage;
            Page.pendingTransition.currentPageAnimOption = "anim";
            this.nextPage.open("anim-right");
        }, this);
    }

    // Load the previous page
    this.load_prev_page = function() {
        this.close("anim-right", function(){
            Page.pendingTransition.currentPage = this.prevPage;
            Page.pendingTransition.currentPageAnimOption = "anim";
            this.prevPage.open("anim-left");
        }, this);
    }

    this.subscribe_to_events = function() {
        this.subscribe_to_events_base();
        this.subscribe_to_events_custom();
    }

    this.unsubscribe_from_events = function() {
        this.unsubscribe_from_events_base();
        this.unsubscribe_from_events_custom();
    }

    // Setups the event subscriptions
    this.subscribe_to_events_custom = function() {
        this.body_ref.on("onDragXChange onScrollXChange", 
            (e, percent, direction_vector) => {
                if (Page.nav_open) {return;}
                this.transition_update(percent, direction_vector, false);
            }
        );

        this.body_ref.on("onDragXTrigger onScrollXTrigger", 
            (e, percent, direction_vector) => {
                if (Page.nav_open) {return;}
                if (percent > 0) {
                    this.load_prev_page();
                }
                else { // percent <= 0 (will really be percent < 0)
                    this.load_next_page();
                }
            }
        );

        this.body_ref.on("onDragXEnd onScrollXEnd", 
            (e) => {
                this.reset_transition();
            }
        );

        this.more_info_btn.on("click", 
            () => {
                console.log("click");
                // TODO: add functionality
            }
        );
    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events_custom = function() {
        this.body_ref.off("onDragXChange onScrollXChange");
        this.body_ref.off("onDragXTrigger onScrollXTrigger");
        this.body_ref.off("onDragXEnd onScrollXEnd");
    }

    this.open_custom_project_page = function(animation_options) {
        if (animation_options == "no-anim") { 
            TweenMax.set(this.hambuger_btn, {x: 0});
            return; 
        }
        
        // TODO: add anims
        TweenMax.to(this.hambuger_btn, 0.2, {x: 0}); // Hamburger btn

        if (animation_options == "anim-left") {
            TweenMax.fromTo(this.element_ref, 1.5, {x: "-75%"}, { x: "0%", ease: Elastic.easeOut });
            TweenMax.fromTo(this.element_ref, 0.5, { opacity: 0}, { opacity: 1});
        } else if (animation_options == "anim-right") {
            TweenMax.fromTo(this.element_ref, 1.5, {x: "75%"}, { x: "0%", ease: Elastic.easeOut});
            TweenMax.fromTo(this.element_ref, 0.5, { opacity: 0}, { opacity: 1});
        } else {
            TweenMax.fromTo(this.element_ref, 0.5, {opacity: 0}, {opacity: 1}); // TODO: may wanna fancy this up
        }
    }

    this.close_custom_project_page = function(animation_options) {
        if (animation_options == "no-anim") { return; }

        if (animation_options == "anim-left") {
            TweenMax.to(this.element_ref, 0.3, { x: "-75%", opacity: 0 });
        } else if (animation_options == "anim-right") {
            TweenMax.to(this.element_ref, 0.3, { x: "75%", opacity: 0 });
        } else {
            TweenMax.to(this.element_ref, 0.3, { opacity: 0 }); // TODO: may wanna fancy this up
        }
        // TODO: add anims
    }
}