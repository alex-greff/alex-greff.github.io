function setup_nav_page() {

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_project_page();
    }

    this.get_references_custom_project_page = function() {
        // this.page_title = this.element_ref.find(this.element_identifier + " .title");
        // TODO: get references here
        this.close_btn = this.element_ref.find(".nav-page__close-icon");
        this.hambuger_btn = this.body_ref.find(".nav-page__hamburger-icon");
        this.home_btn = this.element_ref.find(".nav-page__home-btn");
        this.projects_btn = this.element_ref.find(".nav-page__projects-btn");
        this.about_btn = this.element_ref.find(".nav-page__about-btn");
        this.btns = this.home_btn.add(this.projects_btn).add(this.about_btn);
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
        // TODO: setup event subscriptions
        this.close_btn.on("click", () => { 
            console.log("close click");
            this.close("anim");
        });

        this.hambuger_btn.on("click", () => {
            console.log("hamburger click");
            this.open("anim");
        });

        this.home_btn.on("click", () => {
            console.log("home click");
        });

        this.projects_btn.on("click", () => {
            console.log("projects click")
        });

        this.about_btn.on("click", () => {
            console.log("about click");
        });
    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events_custom = function() {
        // TODO: unsubscribe from events
    }

    this.open_hamburger = function() {
        var t = 0.2;

        TweenMax.set(this.hambuger_btn, {opacity: 0, visibility: "visible", x: -50});
        TweenMax.to(this.hambuger_btn, t, {opacity: 1, x:0});
    }   

    this.close_hamburger = function() {
        var t = 0.2;

        TweenMax.set(this.hambuger_btn, {delay: t, visibility: "hidden"});
        TweenMax.to(this.hambuger_btn, t, {opacity: 0, x: -50});
    }

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = 0.3 + 0.1*3; 
        this.open_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);
        this.open_custom(animation_options, longest_time);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = ((0.3 + 0.1*3) + 0.2) + 0.2;
        this.close_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);
        this.close_custom(animation_options, longest_time);
    }

    this.open_custom = function(animation_options, longest_time) {
        Page.nav_open = true;

        if (animation_options == "no-anim") { 
            TweenMax.set(this.element_ref, {opacity: 1}); // Bg fade
            TweenMax.set(this.btns, {opacity: 1, x:0}); // Nav btns
            TweenMax.set(this.close_btn, {opacity: 1}); // Close btn
            TweenMax.set(this.hambuger_btn, {opacity: 0, x: 0, visibility:'hidden'}); // Hamburger btn
            return; 
        }
        
        TweenMax.to(this.element_ref, 0.2, {opacity: 1}); // Bg fade
        TweenMax.staggerFromTo(this.btns, 0.2, { x: -50, opacity: 0}, {delay: 0.3, x: 0, opacity: 1}, 0.1); // Nav buttons
        TweenMax.fromTo(this.close_btn, 0.2, {opacity: 0, x: 50}, {opacity: 1, x:0}); // Close btn

        this.close_hamburger()
    }

    this.close_custom = function(animation_options, longest_time) {
        Page.nav_open = false;

        if (animation_options == "no-anim") { 
            TweenMax.set(this.element_ref, {opacity: 0}); // Bg fade
            TweenMax.set(this.btns, {opacity: 0, x:0}); // Nav btns
            TweenMax.set(this.close_btn, {opacity: 0}); // Close btn
            TweenMax.set(this.hambuger_btn, {opacity: 1, x: 0, visibility:"visible"}); // Hamburger btn
            return; 
        }

        TweenMax.staggerTo(this.btns, 0.2, { delay: 0.3, x: 50, opacity: 0}, 0.1); // Nav buttons
        TweenMax.to(this.element_ref, 0.2, {opacity: 0, delay: (0.3+0.1*3+0.2)}); // Bg fade
        TweenMax.to(this.close_btn, 0.3, {opacity: 0, x: 50}); // Close btn

        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: function() {this.open_hamburger()}, onCompleteScope: this});
    }

    
    this.get_references();
    this.subscribe_to_events();
}