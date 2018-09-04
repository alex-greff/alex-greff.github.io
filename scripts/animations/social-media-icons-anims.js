var icons = $(".social-media-icons").find(".icon");

icons.find("a").hover(
    function(){ // In
        // console.log(this);

        var tl = new TimelineMax();
        tl.add( TweenMax.to(this.parentElement, 0.2, { x: -5, ease: Power4.easeOut } ));
        tl.add( TweenMax.to(this.parentElement, 1, { x: 0, ease: Elastic.easeOut } ));
    }, 
    function() { // Out

    });