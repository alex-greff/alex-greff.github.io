// $(function(){
// 	var $window = $(window);		//Window object
	
// 	var scrollTime = 0.5;			//Scroll time
// 	var scrollDistance = 170;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll
		
// 	$window.on("mousewheel DOMMouseScroll", function(event){
		
// 		event.preventDefault();	
										
// 		var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
// 		var scrollTop = $window.scrollTop();
// 		var finalScroll = scrollTop - parseInt(delta*scrollDistance);
			
// 		TweenMax.to($window, scrollTime, {
// 			scrollTo : { y: finalScroll, autoKill:true },
// 				ease: Power1.easeOut,	//For more easing functions see https://api.greensock.com/js/com/greensock/easing/package-detail.html
// 				autoKill: true,
// 				overwrite: 5							
// 			});
        
//         clearTimeout(deltaYResetID);
        
//         deltaYResetID = setTimeout(function() { 
//             console.log("Reset deltaY");

//             var curr_page = $("." + page_items[curr_item_idx]);

//             // $('html,body').stop(true, false).animate({
//             //     scrollTop: curr_page.offset().top
//             // }, 'slow');
//         }, RESET_TIME);

// 	});
// });