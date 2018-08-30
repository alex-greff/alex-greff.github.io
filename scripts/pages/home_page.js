function setup_home_page() {
    this.header_primary = $(".header__primary");
    this.header_secondary = $(".header__secondary");
    this.header_line = $(".header__line hr");
    this.social_media_icons = $(".social-media-icons");

    this.header_primary.html(this.header_primary.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
    this.header_primary_spans = this.header_primary.find("span");

    this.transitioning = false;

    this.open = function (animation_options, onComplete_callbackFcn) {
        subscribe_to_events.call(this);
        
        open_anim.call(this, animation_options, onComplete_callbackFcn);
    }


    this.close = function (animation_options, onComplete_callbackFcn) {
        unsubscribe_from_events.call(this);

        close_anim.call(this, animation_options, onComplete_callbackFcn);
    }
}


function subscribe_to_events() {

    this.body_ref.on("onScrollChange", 
        (e, percent, animate) => {
            console.log("trying to run update transition");

            update_transition.call(this, percent, animate);
        }
    );

    this.body_ref.on("onScrollTrigger", 
        (e, percent, animate) => {
            
            next_page_anim.call(this);
        }
    );


    this.body_ref.on("onDragRadiusChange", 
        (e, radius, animate) => {
            // console.log(this.element_identifier + " read DragRadiusChange: r: " + radius * 100 + "% animate: " + animate);

            update_transition.call(this, radius, animate);
        }
    );

    this.body_ref.on("onDragRadiusTrigger", 
        (e, percentXY, animate) => {

            next_page_anim.call(this);
        }
    );
}

function unsubscribe_from_events() {
    this.body_ref.off("onScrollChange");
    this.body_ref.off("onScrollTrigger");
    this.body_ref.off("onDragRadiusChange");
    this.body_ref.off("onDragRadiusTrigger");
}

function update_transition(percent, animate) {
    if (this.transitioning) {
        return;
    }

    var scale_curve1 = (1 + Math.abs(percent)/2);
    var opacity_curve = (1 - Math.max(0, (Math.abs(percent)-0.3)/2));
    var easing_curve = Elastic.easeOut.config(1, 0.4);

    // var scale_curve2 = (1 + Math.max(0, (Math.abs(percent)-0.3/2)));

    if (animate) {
        // TweenMax.to(this.header_primary_spans, 1, 
        //     {
        //         scale: scale_curve2,
        //         ease: easing_curve
        //     }
        // );
        TweenMax.to(this.element_ref, 1,
            {
                scale: scale_curve1,
                opacity: opacity_curve,
                ease: easing_curve
            }
        );
    } 
    else {
        // TweenMax.set(this.header_primary_spans,
        //     {
        //         scale: scale_curve2
        //     }
        // );
        TweenMax.set(this.element_ref,
            {
                scale: scale_curve1,
                opacity: opacity_curve
            }
        ); 
    }
}

function next_page_anim() {
    if (this.transitioning) {
        return;
    }

    this.transitioning = true;

    TweenMax.to(this.header_primary_spans, 0.2, 
        {
            scale: 2,
        }
    );
    TweenMax.to(this.element_ref, 0.2,
        {
            scale: 3,
            opacity: 0,
        }
    );

}

function open_anim(animation_options, onComplete_callbackFcn) {
    var delay_stage1 = 1.5;
    var delay_stage2 = delay_stage1 + 0.5;
    
    // Main header anim
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

    console.log(this.header_line);
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
            letterSpacing: "2rem"
        },
        {
            delay: delay_stage2,
            opacity: 1,
            letterSpacing: "0.5rem"
        }
    );

    // Social media icons anim
    TweenMax.staggerFromTo(this.social_media_icons.find(".icon"), 2, 
        {
            opacity: 0,
            y: 20,
        }, 
        {
            delay: delay_stage2,
            opacity: 1,
            y: 0, 
            ease: Elastic.easeOut
        }, 
        0.1
    );
}

function close_anim(animation_options, onComplete_callbackFcn) {

}

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