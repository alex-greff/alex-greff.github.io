function setup_project_page_nav(num_projects) {
    this.num_projects = num_projects;

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_project_page();
    }

    this.get_references_custom_project_page = function() {
        // TODO: get references here
        this.slide_indicator_current = $('.project-page-nav__slide-indicator__current');
        this.slide_indicator_total = $(".project-page-nav__slide-indicator__total");

        this.hard_subscribe(); // Hard subscribe to events
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

    this.hard_subscribe = function() {
        this.body_ref.on("pageOpen", (e, page_identifier, page_ref) => {
            // Special cases to be stopped
            if (page_identifier === "#project-page-nav" || page_identifier === "#nav-page") { return; }

            if (page_identifier.startsWith("#project-")) { // If its a project page
                this.update_tracker(page_ref);

                if (!this.isOpen) {
                    this.open("anim"); // Open itself it not already open
                }
            } else { // If its not (and also not a nav page)
                if (this.isOpen) {
                    this.close("anim"); // Close itself if not already closed
                }
            }
        });

        this.body_ref.on("pageClose", (e, page_identifier) => {
            // Might just wanna remove this
        });
    }

    this.update_tracker = function(curr_project_page) {
        this.slide_indicator_total.html(this.num_projects + "");
        this.slide_indicator_current.html(curr_project_page.projectNum + "");
    }

    // Setups the event subscriptions
    this.subscribe_to_events = function() {

    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events = function() {
        
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