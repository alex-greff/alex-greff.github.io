function setup_about_page(bg_col1, bg_col2) {
    this.page_background_color_1 = bg_col1;
    this.page_background_color_2 = bg_col2;

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_about_page();

        this.hambuger_btn = this.body_ref.find(".nav-page__hamburger-icon"); // Hamburger button
    }

    this.get_references_custom_about_page = function() {
        
    }

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.3;
        this.open_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.open_custom_about_page(animation_options);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.3;
        this.close_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.close_custom_about_page(animation_options);
    }

    this.transition_update = function(percent, direction_vector, animate) {
        this.transition_update_base(percent, direction_vector, animate);
    }

    this.reset_transition = function() {
        this.reset_transition_base();
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

    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events_custom = function() {
    }

    this.open_custom_about_page = function(animation_options) {
        if (animation_options == "no-anim") { 
            TweenMax.set(this.hambuger_btn, {x: 0});
            return; 
        }
        TweenMax.to(this.hambuger_btn, 0.2, {x: 0}); // Hamburger btn

        TweenMax.fromTo(this.element_ref, 0.3, {opacity: 0}, { opacity:1 });
    }

    this.close_custom_about_page = function(animation_options) {
        if (animation_options == "no-anim") { return; }

        TweenMax.to(this.element_ref, 0.3, { opacity:0 });
    }
}