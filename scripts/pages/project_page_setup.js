function setup_project_page(bg_col1, bg_col2) {
    this.page_background_color_1 = bg_col1;
    this.page_background_color_2 = bg_col2;

    // this.page_title = this.element_ref.find(".title");
    // this.page_info = this.element_ref.find(".info");

    // this.more_info_btn = this.element_ref.find(".projects-page__more-info-btn");

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_project_page();

        // console.log("project page: got references");
    }

    this.get_references_custom_project_page = function() {
        this.page_title = this.element_ref.find(this.element_identifier + " .title");
        this.page_info = this.element_ref.find(this.element_identifier + " .info");
        this.more_info_btn = this.element_ref.find(this.element_identifier + " .projects-page__more-info-btn");
    }

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.2;
        this.open_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.open_custom_project_page(animation_options);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.2;
        this.close_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.close_custom_project_page(animation_options);
    }

    this.transition_update = function(percent, direction_vector, animate) {
        this.transition_update_base(percent, direction_vector, animate);
    }

    this.reset_transition = function() {
        this.reset_transition_base();
    }

    // Load the next page
    this.load_next_page = function() {
        Page.pendingTransition.currentPage = this.nextPage;
        Page.pendingTransition.currentPageAnimOption = "anim";
        this.nextPage.open("anim-right");
    }

    // Load the previous page
    this.load_prev_page = function() {
        Page.pendingTransition.currentPage = this.prevPage;
        Page.pendingTransition.currentPageAnimOption = "anim";
        this.prevPage.open("anim-left");
    }

    // Setups the event subscriptions
    this.subscribe_to_events = function() {
        this.body_ref.on("onDragXChange", 
            (e, percent, direction_vector) => {
                this.transition_update(percent, direction_vector, false);
            }
        );

        this.body_ref.on("onDragXTrigger", 
            (e, percent, direction_vector) => {
                if (percent > 0) {
                    this.close("anim", this.load_prev_page, this);
                }
                else { // percent <= 0 (will really be percent < 0)
                    this.close("anim", this.load_next_page, this);
                }
            }
        );

        this.body_ref.on("onDragXEnd", 
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
    this.unsubscribe_from_events = function() {
        this.body_ref.off("onDragXChange");
        this.body_ref.off("onDragXTrigger");
        this.body_ref.off("onDragXEnd");
    }

    this.open_custom_project_page = function(animation_options) {
        if (animation_options == "no-anim") { return; }
        
        // TODO: add anims
    }

    this.close_custom_project_page = function(animation_options) {
        if (animation_options == "no-anim") { return; }

        // TODO: add anims
    }
}