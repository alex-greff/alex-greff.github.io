// Entry point
function setup_home_page() {
    // this.header = $(".header");
    // this.header_primary = $(".header__primary");
    // this.header_primary_firstName = $(".header__primary-firstName");
    // this.header_primary_lastName = $(".header__primary-lastName");

    // this.header_secondary = $(".header__secondary");
    // this.header_line = $(".header__line hr");
    // this.social_media_icons = $(".social-media-icons");
    // this.social_media_icons__icons = this.social_media_icons.find(".icon");


    // Find letters in first name section and last name section and put them in separate sub-span elements
    // this.header_primary_firstName.html(this.header_primary_firstName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    // this.header_primary_lastName.html(this.header_primary_lastName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    
    // // Get all the sub-span elements of the first and last name headers
    // this.header_primary_spans = this.header_primary_firstName.find("span").add(this.header_primary_lastName.find("span"));

    this.page_background_color_1 = "#00D1FF";
    this.page_background_color_2 = "#0068FF";

    this.get_references = function() {
        this.get_references_base();
        this.get_references_custom_home_page();
    }

    this.get_references_custom_home_page = function() {
        this.header = $(".header");
        this.header_primary = $(".header__primary");
        this.header_primary_firstName = $(".header__primary-firstName");
        this.header_primary_lastName = $(".header__primary-lastName");

        this.header_secondary = $(".header__secondary");
        this.header_line = $(".header__line hr");
        this.social_media_icons = $(".social-media-icons");
        this.social_media_icons__icons = this.social_media_icons.find(".icon");

        // Find letters in first name section and last name section and put them in separate sub-span elements
        this.header_primary_firstName.html(this.header_primary_firstName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
        this.header_primary_lastName.html(this.header_primary_lastName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
        
        // Get all the sub-span elements of the first and last name headers
        this.header_primary_spans = this.header_primary_firstName.find("span").add(this.header_primary_lastName.find("span"));

        this.hambuger_btn = this.body_ref.find(".nav-page__hamburger-icon"); // Hamburger button
    }

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var delay_stage1 = 1.5;
        var delay_stage2 = delay_stage1 + 0.3;
        var delay_stage3 = delay_stage1 + 0.5;

        var longest_time = delay_stage3 + 0.1*4; 

        this.open_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.open_custom_home_page(animation_options, delay_stage1, delay_stage2, delay_stage3);
    }

    this.close = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var anim_time = 0.3;
        var longest_time = anim_time;

        this.close_base(animation_options, longest_time, onComplete_callbackFcn, onComplete_callbackScope);

        this.close_custom_home_page(animation_options, anim_time);
    }

    this.transition_update = function (percent, direction_vector, animate) {
        var scale_curve1 = (1 + Math.abs(percent)/2); // [1, 1.5]
        var opacity_curve = (1 - Math.max(0, (Math.abs(percent)-0.3)/2)); // [1, (1-0.7/2) = 0.65 ]
        var x_offset_curve = 50 * Math.pow(3 * Math.abs(percent), 1/2); // [0, 50 * root(3)]

        // Get color lerp value
        var clr = lerpColor(this.page_background_color_1, this.page_background_color_2, Math.abs(percent));

        if (animate) {
            TweenMax.to(this.header, 0.2, { scale: scale_curve1, opacity: opacity_curve, } ); // Header
            TweenMax.to(this.social_media_icons__icons, 0.2, {x: x_offset_curve } ); // Social media icons
            TweenMax.to(this.hambuger_btn, 0.2, {x: -1 * x_offset_curve}); // Hamburger button
            TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: clr}); // Page background color
        }
        else {
            TweenMax.set(this.header, { scale: scale_curve1, opacity: opacity_curve } ); // Header
            TweenMax.set(this.social_media_icons__icons, {x: x_offset_curve } ); // Social media icons
            TweenMax.set(this.hambuger_btn, {x: -1 * x_offset_curve}); // Hamburger button
            TweenMax.set(Page.page_background_ref, {backgroundColor: clr}); // Page background color
        } 
    }

    this.reset_transition = function () {
        var easing_curve = Elastic.easeOut.config(1, 0.4);

        TweenMax.to(this.header, 1, { scale: 1, opacity: 1, ease: easing_curve } ); // Header
        TweenMax.to(this.social_media_icons__icons, 1, { x: 0, ease: easing_curve } ); // Socal media icons
        TweenMax.to(this.hambuger_btn, 1, {x: 0, ease: easing_curve}); // Hamburger button
        TweenMax.to(Page.page_background_ref, 0.5, {backgroundColor: this.page_background_color_1}); // Page background color
    }

    // Loads the next page
    this.load_next_page = function() {
        var pt = Page.pendingTransition;

        // Setup pending transition
        pt.targetPage = this.nextPage;
        pt.targetPageAnimOption = "anim";
        pt.currentPage = this;
        pt.currentPageAnimOption = "anim";

        // Trigger the new page load
        Barba.Pjax.goTo(pt.targetPage.html_location)
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
        this.body_ref.on("onScrollRadiusChange", 
            (e, percent, direction_vector) => {
                if (Page.nav_open) {return;}
                this.transition_update(percent, direction_vector, true);
            }
        );

        this.body_ref.on("onDragRadiusChange", 
            (e, percent, direction_vector) => {
                if (Page.nav_open) {return;}
                this.transition_update(percent, direction_vector, false);
            }
        );

        this.body_ref.on("onDragRadiusTrigger onScrollRadiusTrigger", 
            (e, percent, direction_vector) => {
                if (Page.nav_open) {return;}
                //this.close("anim", this.load_next_page, this);
                this.load_next_page();
            }
        );

        this.body_ref.on("onScrollRadiusEnd onDragRadiusEnd", 
            (e) => {
                this.reset_transition();
            }
        );

        this.social_media_icons__icons.find("a").hover(
            function(){ // In
                // console.log(this);
        
                var tl = new TimelineMax();
                tl.add( TweenMax.to(this.parentElement, 0.2, { x: -5, ease: Power4.easeOut } ));
                tl.add( TweenMax.to(this.parentElement, 1, { x: 0, ease: Elastic.easeOut } ));
            }, 
            function() { // Out
        
            }
        );

        
    }

    // Unsubsribes from the subscribed events
    this.unsubscribe_from_events_custom = function() {
        this.body_ref.off("onScrollRadiusChange");
        this.body_ref.off("onScrollRadiusTrigger");
        this.body_ref.off("onScrollRadiusEnd");
        this.body_ref.off("onDragRadiusChange");
        this.body_ref.off("onDragRadiusTrigger");
        this.body_ref.off("onDragRadiusEnd");

        this.body_ref.off("navOpen");
        this.body_ref.off("navClose");
    }


    // ----------------------------------
    // --- Custom Animation functions ---
    // ----------------------------------

    this.open_custom_home_page = function (animation_options, delay_stage1, delay_stage2, delay_stage3) {
        // If no animation is wanted
        if (animation_options == "no-anim") {
            TweenMax.set(this.header_primary_spans, { x: 0, opacity: 1, rotationY: 0 });
            TweenMax.set(this.header_line, { scaleX: 1 });
            TweenMax.set(this.header_secondary, { opacity: 1, letterSpacing: "0.5rem" });
            TweenMax.set(this.social_media_icons__icons, { opacity: 1, y: 0 });
            return;
        }

        // Primary header anim
        TweenMax.staggerFromTo(this.header_primary_spans, 0.5, 
            { x: -50, opacity: 0, rotationY: 90 }, 
            { x: 0, opacity: 1, rotationY: 0, ease: Power3.easeOut },
            0.1
        );

        // Header line anim
        TweenMax.fromTo(this.header_line, 1.5, 
            { scaleX: 0 },
            { delay: delay_stage1, scaleX: 1 }
        );

        // Secondary header anim
        TweenMax.fromTo(this.header_secondary, 1, 
            { opacity: 0, letterSpacing: "0.1rem" },
            { delay: delay_stage2, opacity: 1, letterSpacing: "0.5rem" }
        );

        // Social media icons anim
        TweenMax.staggerFromTo(this.social_media_icons__icons, 2, 
            { opacity: 0, x: -20, }, 
            { delay: delay_stage3, opacity: 1, x: 0, ease: Elastic.easeOut, }, 
            0.1
        );
    }

    this.close_custom_home_page = function (animation_option, anim_time) {
        if (animation_option == "no-anim") { return; }

        // Primary header
        TweenMax.to(this.header_primary_spans, anim_time, { scale: 2, } );

        // Page element
        TweenMax.to(this.header, anim_time, { scale: 3, opacity: 0, } );
    }
}
