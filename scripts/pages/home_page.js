// Entry point
function setup_home_page() {
    this.header = $(".header");
    this.header_primary = $(".header__primary");
    this.header_primary_firstName = $(".header__primary-firstName");
    this.header_primary_lastName = $(".header__primary-lastName");

    this.header_secondary = $(".header__secondary");
    this.header_line = $(".header__line hr");
    this.social_media_icons = $(".social-media-icons");
    this.social_media_icons__icons = this.social_media_icons.find(".icon");
    this.socal_media_icons_hide_anim = null;

    // Find letters in first name section and last name section and put them in separate sub-span elements
    this.header_primary_firstName.html(this.header_primary_firstName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    this.header_primary_lastName.html(this.header_primary_lastName.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    
    // Get all the sub-span elements of the first and last name headers
    this.header_primary_spans = this.header_primary_firstName.find("span").add(this.header_primary_lastName.find("span"));

    this.page_background_color_1 = "#00D1FF";
    this.page_background_color_2 = "#0068FF";

    this.open_old = this.open;

    this.open = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        // this.open(animation_options, function() {}, this);
        //console.warn(this.element_identifier + ": Unimplemented open() method");
        this.open_old(animation_options, function(){}, this);        

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


    // Loads the next page
    this.load_next_page = function() {
        Page.current_page = this.nextPage;
        this.nextPage.open("anim", function() {}, this.nextPage);
    }

    // Setups the event subscriptions
    this.subscribe_to_events = function() {
        this.body_ref.on("onScrollChange", 
            (e, percent, direction_vector) => {
                this.update_transition(percent, direction_vector, true);
            }
        );

        this.body_ref.on("onDragRadiusChange", 
            (e, percent, direction_vector) => {
                this.update_transition(percent, direction_vector, false);
            }
        );

        this.body_ref.on("onDragRadiusTrigger onScrollTrigger", 
            (e, percent, direction_vector) => {
                this.close("anim", this.load_next_page, this);
            }
        );

        this.body_ref.on("onScrollEnd onDragRadiusEnd", 
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
        this.body_ref.off("onDragRadiusChange");
        this.body_ref.off("onDragRadiusTrigger");
        this.body_ref.off("onDragRadiusEnd");
    }


    // ---------------------------
    // --- Animation functions ---
    // ---------------------------

    this.open_anim = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var longest_time = delay_stage3 + 0.1*4; 

        TweenMax.set(this.element_ref, {visibility: 'visible' }); // Set page to be visible

        // If no animation is wanted
        if (animation_options == "no-anim") {
            TweenMax.set(this.header_primary_spans, { x: 0, opacity: 1, rotationY: 0 });
            TweenMax.set(this.header_line, { scaleX: 1 });
            TweenMax.set(this.header_secondary, { opacity: 1, letterSpacing: "0.5rem" });
            TweenMax.set(this.social_media_icons__icons, { opacity: 1, y: 0, 
                onComplete: onComplete_callbackFcn, 
                onCompleteScope: onComplete_callbackScope });
            TweenMax.set(Page.page_background_ref, {backgroundColor: this.page_background_color_1 });
            this.isTransitioning = false;
            return;
        }

        // Set page background color
        TweenMax.to(Page.page_background_ref, 0.5, { backgroundColor: this.page_background_color_1 });

        // onComplete callback
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope});

        // Transition completion setter
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: () => { this.isTransitioning = false } });

        var delay_stage1 = 1.5;
        var delay_stage2 = delay_stage1 + 0.3;
        var delay_stage3 = delay_stage1 + 0.5;
        
        // Primary header anim
        TweenMax.staggerFromTo(this.header_primary_spans, 0.5, 
            {
                x: -50,
                opacity: 0,
                rotationY: 90
            }, 
            {
                x: 0,
                opacity: 1,
                rotationY: 0,
                ease: Power3.easeOut
            },
            0.1
        );

        // Header line anim
        TweenMax.fromTo(this.header_line, 1.5, 
            {
                scaleX: 0
            },
            {
                delay: delay_stage1,
                scaleX: 1,
            }
        );

        // Secondary header anim
        TweenMax.fromTo(this.header_secondary, 1, 
            {
                opacity: 0,
                letterSpacing: "0.1rem"
            },
            {
                delay: delay_stage2,
                opacity: 1,
                letterSpacing: "0.5rem"
            }
        );

        // Social media icons anim
        TweenMax.staggerFromTo(this.social_media_icons__icons, 2, 
            {
                opacity: 0,
                x: -20,
            }, 
            {
                delay: delay_stage3,
                opacity: 1,
                x: 0, 
                ease: Elastic.easeOut,
            }, 
            0.1
        );
    }

    this.close_anim = function (animation_options, onComplete_callbackFcn, onComplete_callbackScope) {
        var anim_time = 0.3;
        var longest_time = anim_time;

        // If no animation is wanted
        if (animation_options == "no-anim") {
            TweenMax.set(this.element_ref, {
                visibility: 'hidden',
                onComplete: onComplete_callbackFcn,
                onCompleteScope: onComplete_callbackScope
            });
            this.isTransitioning = false;
            return;
        } 

        // Page background color
        TweenMax.to(Page.page_background_ref, anim_time, {backgroundColor: this.page_background_color_2});

        // onComplete callback
        TweenMax.set(this.element_ref, {delay: longest_time, visibility: "hidden", onComplete: onComplete_callbackFcn, onCompleteScope: onComplete_callbackScope});

        // Transition completion setter
        TweenMax.set(this.element_ref, {delay: longest_time, onComplete: () => { this.isTransitioning = false } });



        // Primary header
        TweenMax.to(this.header_primary_spans, anim_time, 
            {
                scale: 2,
            }
        );

        // Page element
        TweenMax.to(this.header, anim_time,
            {
                scale: 3,
                opacity: 0,
            }
        );
    }

    this.update_transition = function (percent, direction_vector, animate) {
        var scale_curve1 = (1 + Math.abs(percent)/2);
        var opacity_curve = (1 - Math.max(0, (Math.abs(percent)-0.3)/2));
        var x_offset_curve = 50 * Math.pow(3 * Math.abs(percent), 1/2);

        // Get color lerp value
        var clr = lerpColor(this.page_background_color_1, this.page_background_color_2, Math.abs(percent));

        if (animate) {
            // Header
            TweenMax.to(this.header, 0.2,
                {
                    scale: scale_curve1,
                    opacity: opacity_curve,
                }
            );

            // Social media icons
            TweenMax.to(this.social_media_icons__icons, 0.2, {x: x_offset_curve } );

            // Page background color
            TweenMax.to(Page.page_background_ref, 0.2, {backgroundColor: clr});
        }
        else {
            // Header
            TweenMax.set(this.header,
                {
                    scale: scale_curve1,
                    opacity: opacity_curve
                }
            );

            // Social media icons
            TweenMax.set(this.social_media_icons__icons, {x: x_offset_curve } );

            // Page background color
            TweenMax.set(Page.page_background_ref, {backgroundColor: clr});
        } 
    }

    this.reset_transition_anim = function () {
        var easing_curve = Elastic.easeOut.config(1, 0.4);

        // Header
        TweenMax.to(this.header, 1,
            {
                scale: 1,
                opacity: 1,
                ease: easing_curve
            }
        );

        // Kill the hide social media icon animation
        if (this.socal_media_icons_hide_anim != null) {
            this.socal_media_icons_hide_anim.forEach( function(element){ element.kill() });
            this.socal_media_icons_hide_anim = null;
        }

        // Socal media icons
        TweenMax.to(this.social_media_icons__icons, 1, 
            {
                x: 0,
                ease: easing_curve
            }
        );

        // Page background color
        TweenMax.to(Page.page_background_ref, 0.5, {backgroundColor: this.page_background_color_1});
    }
}












// Extra shit

// TweenMax.staggerFromTo(this.header_primary.find("span"), 0.5, 
//         {
//             x: -50,
//             opacity: 0,
//             rotationY: 90
//         }, 
//         {
//             x: 0,
//             opacity: 1,
//             rotationY: 0,
//             ease: Power4.easeOut
//         },
//         0.1
//     );

// TweenMax.fromTo(this.header_primary.find("span"), 0.4, 
//         {
//             opacity: 0,
//             scaleY: 2,
//         }, 
//         {
//             opacity: 1,
//             scaleY: 1,
//         }
//     );