class _IM_Event {
    // String, { X, Y, XY, RADIUS }, JQuery Element, function()
    constructor (name, threshold_percent, triggerElement) {
        this._name = name;
        this._lastScreenSize = { height: -1, width: -1 };
        this._EVENTS_LIST = [ "", "X", "Y", "Change", "Trigger", "Start", "End" ];
        this._trigger_ref = triggerElement;

        this._TRIGGER_SCREEN_THRESHOLD_PERCENT = { 
            X: threshold_percent["X"], Y: threshold_percent["Y"], RADIUS: threshold_percent["RADIUS"] };
        this._TRIGGER_SCREEN_THRESHOLD_PIXEL = { X: -1, Y: -1, XY: -1, RADIUS: -1, };

        this._triggered = { X: false, Y: false, RADIUS: false };

        this._delta = { X: 0, Y: 0 };
        this._lastDelta = { X: 0, Y: 0 };

        // Setup threshold triggers
        this._recompute_threshold_triggers();

        // Setup the listeners
        this._setup_listeners();

        // Listen for the page resize event
        $( window ).resize( function() {
            this._recompute_threshold_triggers();
        });
    }

    _setup_listeners() {
        // Nothing here
    }

    _recompute_threshold_triggers() {
        var new_height = $( window ).height();
        var new_width = $ (window ).width();

        if (this._lastScreenSize["height"] != new_height) { // If the height changed
            // Recompute the X pixel threshold pixel amount
            this._TRIGGER_SCREEN_THRESHOLD_PIXEL["Y"] = new_height * this._TRIGGER_SCREEN_THRESHOLD_PERCENT["Y"];
            this._lastScreenSize["height"] = new_height;
        }

        if (this._lastScreenSize["width"] != new_width) { // If the width changed
            this._TRIGGER_SCREEN_THRESHOLD_PIXEL["X"] = new_width * this._TRIGGER_SCREEN_THRESHOLD_PERCENT["X"];
            this._lastScreenSize["width"] = new_width;
        }

        if (new_height < new_width) { 
            // If the height is smaller than the width then use the height to calculate the radius pixel threshold
            this._TRIGGER_SCREEN_THRESHOLD_PIXEL["RADIUS"] = new_height * this._TRIGGER_SCREEN_THRESHOLD_PERCENT["RADIUS"];
        } else {
            // If the width is smaller than or equal to the height then use the width to calculate the radius pixel threshold
            this._TRIGGER_SCREEN_THRESHOLD_PIXEL["RADIUS"] = new_width * this._TRIGGER_SCREEN_THRESHOLD_PERCENT["RADIUS"];
        }
    }

    resetDelta() {
        this._delta = [0, 0];
        this._lastDelta = [0, 0];
    }

    setDelta(newDelta) {
        this._lastDelta = this._delta;
        this._delta = newDelta;

        this.onDeltaChange();
    }

    incrementDelta(deltaAmt) {
        this._lastDelta = this._delta;
        this._delta = [ this._delta[0] + deltaAmt[0], this._delta[1] + deltaAmt[1] ];

        this.onDeltaChange();
    }

    onDeltaStart() {
        this._trigger_ref.trigger("on" + this._name + "XStart");
        this._trigger_ref.trigger("on" + this._name + "YStart");
        this._trigger_ref.trigger("on" + this._name + "XYStart");
        this._trigger_ref.trigger("on" + this._name + "RadiusStart");
    }

    onDeltaEnd() {
        this.resetDelta();

        this._triggered['X'] = this._triggered['Y'] = this._triggered['XY'] = this._triggered['RADIUS'] = false;

        this._trigger_ref.trigger("on" + this._name + "XEnd");
        this._trigger_ref.trigger("on" + this._name + "YEnd");
        this._trigger_ref.trigger("on" + this._name + "XYEnd");
        this._trigger_ref.trigger("on" + this._name + "RadiusEnd");
    }

    onDeltaChange() {
        var screen_percent = [ this._delta[0] / this._lastScreenSize["width"], this._delta[1] / this._lastScreenSize["height"] ];

        var progress_percent = [
            HelperFunctions.constrain(this._delta[0] / this._TRIGGER_SCREEN_THRESHOLD_PIXEL["X"], -1, 1), 
            HelperFunctions.constrain(this._delta[1] / this._TRIGGER_SCREEN_THRESHOLD_PIXEL["Y"], -1, 1)
        ];
        

        var changed = [true, true];
        var triggered = [ progress_percent[0] <= -1 || progress_percent[0] >= 1, progress_percent[1] <= -1 || progress_percent[1] >= 1 ];

        var direction_vector = HelperFunctions.getXYDifference(this._lastDelta, this._delta);

        // X only events
        if (changed[0] == true) {
            this._trigger_ref.trigger("on" + this._name + "X", [ screen_percent[0], this._delta[0] ]);

            if (!this._triggered['X']) {
                if (triggered[0] == true) {
                    this._trigger_ref.trigger("on" + this._name + "XTrigger", [progress_percent[0], direction_vector[0]]);
                    this._triggered['X'] = true;
                } else {
                    this._trigger_ref.trigger("on" + this._name + "XChange", [progress_percent[0], direction_vector[0]]);
                }
            }
        }

        // Y only events
        if (changed[1] == true) {
            this._trigger_ref.trigger('on'+ this._name + 'Y', [ screen_percent[1], this._delta[1] ]);

            if (!this._triggered['Y']) {
                if (triggered[1] == true) {
                    this._trigger_ref.trigger("on" + this._name + "YTrigger", [progress_percent[1], direction_vector[1]]);
                    this._triggered['Y'] = true;
                } else {
                    this._trigger_ref.trigger("on" + this._name + "YChange", [progress_percent[1], direction_vector[1]]);
                }
            }
        }

        // X + Y events
        if (changed[0] == true || changed[1] == true) { // If at least one dimension is changed
            this._trigger_ref.trigger("on" + this._name, [ [screen_percent[0], screen_percent[1]], [this._delta[0], this._delta[1]] ]);

            if (!this._triggered['XY']) {
                if (this._triggered[0] == true || this._triggered[1] == true) { // If at least one dimension is triggered
                    this._trigger_ref.trigger("on" + this._name + "XYTrigger", [progress_percent, direction_vector]);
                    this._triggered['XY'] = true;
                } else {
                    this._trigger_ref.trigger("on" + this._name + "XYChange", [progress_percent, direction_vector]);
                }
            }
        }

        // Radius events
        if (changed[0] == true || schanged[1] == true) { // If at least one dimension is changed
            var used_screen_dimension = this._lastScreenSize["width"] > this._lastScreenSize["height"] ? this._lastScreenSize["width"] : this._lastScreenSize["height"];
            var radius_screen_pixels = Math.sqrt(Math.pow(this._delta[0], 2) + Math.pow(this._delta[1], 2));
            var radius_screen_percent = radius_screen_pixels / used_screen_dimension;
            this._trigger_ref.trigger('on' + this._name + 'Radius', [ radius_screen_percent, radius_screen_pixels ]);

            if (!this._triggered['RADIUS']) {
                var radius = Math.sqrt(Math.pow(this._delta[0], 2) + Math.pow(this._delta[1], 2))/this._TRIGGER_SCREEN_THRESHOLD_PIXEL["RADIUS"]; // [0 to 1]
                if (radius >= 1) { // If the scroll radius is triggered
                    this._trigger_ref.trigger("on" + this._name + "RadiusTrigger", [progress_percent, direction_vector]);
                    this._triggered['RADIUS'] = true;
                } else {
                    this._trigger_ref.trigger("on" + this._name + "RadiusChange", [radius, direction_vector]);
                }
            }
        }
    }
}

class _SCROLL_IM_EVENT extends _IM_Event {
    constructor (threshold_percent, triggerElement) {
        super("Scroll", threshold_percent, triggerElement);

        this._SCROLL_RESET_TIME = 250;
        this._scroll_reset_ID = -1;
    }

    _setup_listeners() {
        super._setup_listeners();

        var _this = this;

        this._trigger_ref.on('mousewheel DOMMouseScroll', function(e) {
            if (_this._deltaResetID == null) { // If first mousewheel event
                _this.onDeltaStart();
            }
        
            var delta = [e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY];
        
            _this.incrementDelta(delta);
        
            // Stop the previously running reset timer
            clearTimeout(scroll_deltaResetID);
        
            // Set a timeout function that resets the scroll delta
            // amount after a peroid of inactivity
            _this._deltaResetID = setTimeout(function() {
                _this.onDeltaEnd();
            }, SCROLL_RESET_TIME);
        });
    }

    onDeltaEnd() {
        super.onDeltaEnd();
        this._scroll_reset_ID = null;
    }
}


class _DRAG_IM_EVENT extends _IM_Event {
    constructor (threshold_percent, triggerElement) {
        super("Drag", threshold_percent, triggerElement);

        this._mouse_down = false;
        this._mouse_pos_start = [0, 0];
    }

    _setup_listeners() {
        super._setup_listeners();

        var _this = this;

        this._trigger_ref.on('mousedown', function(e) {
            // Check for left click
            if (e.which != 1) { return; }
        
            _this.onDeltaStart();
        
            _this._mouse_down = true;
            _this._mouse_pos_start[0] = e.pageX;
            _this._mouse_pos_start[1] = e.pageY;
        });
        
        this._trigger_ref.on('mousemove', function(e) {
            // Check for left click and mouse is down
            if (e.which != 1 || _this._mouse_down != true) {  return; }
        
            var curr_pos = [e.pageX, e.pageY];
            _this.setDelta([curr_pos[0] - _this._mouse_pos_start[0], curr_pos[1] - _this._mouse_pos_start[1]]);
        });
        
        this._trigger_ref.on('mouseup mouseleave', function(e) {
            // Check for left click
            if (e.which != 1) { return; }
        
            _this._mouse_down = false;
            _this._mouse_pos_start = [0, 0];
            
            _this.onDeltaEnd();
        });
    }
}



class InputManager {
    static initialize() {
        this._body_ref = $('body');

        this._threshold_triggers = {X: 0.35, Y: 0.35, XY: 0.35, RADIUS: 0.35 };

        this._scroll_event = new _SCROLL_IM_EVENT(this._threshold_triggers, this._body_ref);
        this._drag_event = new _DRAG_IM_EVENT(this._threshold_triggers, this._body_ref);
    }

    static RESET_ALL_DELTAS() {
        this._scroll_event.resetDelta();
        this._drag_event.resetDelta();
    }

    constructor(triggerElement) {
        console.warn("InputManager shouldn't be instantiated, it's a static class");
    }
}


// INITIALIZE INPUT MANAGER
InputManager.initialize();


// // -----------------------------
// // --- Delta management code ---
// // -----------------------------
// var body_ref = $('body');

// var drag_delta = [0, 0];
// var last_drag_delta = [0, 0];

// var drag_Y_isTriggered = false;
// var drag_X_isTriggered = false;
// var drag_XY_isTriggered = false;
// var drag_radius_isTriggered = false;

// const DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE = 0.35; // Percent of lower page dimension
// var DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // Gets filled later

// const DRAG_DELTA_Y_THRESHOLD_PERCENTAGE = 0.35; // The y (veritcal) drag  amount threshold
// var DRAG_DELTA_Y_THRESHOLD_PIXEL; // Gets filled

// const DRAG_DELTA_X_THRESHOLD_PERCENTAGE = 0.35; // The x (horizontal) drag amount threshold
// var DRAG_DELTA_X_THRESHOLD_PIXEL; // Gets filled



// var scroll_delta = [0, 0];
// var last_scroll_delta = [0, 0];

// var scroll_X_isTriggered = false;
// var scroll_Y_isTriggered = false;
// var scroll_XY_isTriggered = false;
// var scroll_radius_isTriggered = false;

// var scroll_deltaResetID;
// const SCROLL_RESET_TIME = 250; // milliseconds

// const SCROLL_DELTA_Y_THRESHOLD_PERCENTAGE = 0.35; // Percent of page height
// var SCROLL_DELTA_Y_THRESHOLD_PIXEL; // Gets filled later

// const SCROLL_DELTA_X_THRESHOLD_PERCENTAGE = 0.35;
// var SCROLL_DELTA_X_THRESHOLD_PIXEL;

// const SCROLL_DELTA_RADIUS_THRESHOLD_PERCENTAGE = 0.35;
// var SCROLL_DELTA_RADIUS_THRESHOLD_PIXEL;



// var last_height = -1;
// var last_width = -1;



// // Run the initial computation for PAGE_TRANSITION_THRESHOLD
// recompute_threshold_triggers();

// // Listen for the page resize event
// $( window ).resize( function() {
//     recompute_threshold_triggers();
// });

// // Recalculates the thresholds based off the new window height (if it is changed)
// function recompute_threshold_triggers() {
//     var new_height = $( window ).height();
//     var new_width = $ (window ).width();

//     if (last_height != new_height) { // If the height changed
//         // Recompute the scroll event threshold
//         SCROLL_DELTA_Y_THRESHOLD_PIXEL = (new_height * SCROLL_DELTA_Y_THRESHOLD_PERCENTAGE); // Converts the percent variable to pixels

//         // Recompute the drag Y event threshold
//         DRAG_DELTA_Y_THRESHOLD_PIXEL = (new_height * DRAG_DELTA_Y_THRESHOLD_PERCENTAGE);

//         last_height = new_height;
//     }

//     if (last_width != new_width) { // If the width changed
//         SCROLL_DELTA_X_THRESHOLD_PIXEL = (new_width * SCROLL_DELTA_X_THRESHOLD_PERCENTAGE);

//         // Recompute the drag X event threshold
//         DRAG_DELTA_X_THRESHOLD_PIXEL = (new_width * DRAG_DELTA_X_THRESHOLD_PERCENTAGE);

//         last_width = new_width;
//     }

//     if (new_height < new_width) { 
//         // If the height is smaller than the width then use the height to calculate the radius pixel threshold
//         DRAG_DELTA_RADIUS_THRESHOLD_PIXEL = (new_height * DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
//         SCROLL_DELTA_RADIUS_THRESHOLD_PIXEL = (new_height * SCROLL_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
//     } else {
//         // If the width is smaller than or equal to the height then use the width to calculate the radius pixel threshold
//         DRAG_DELTA_RADIUS_THRESHOLD_PIXEL = (new_width * DRAG_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
//         SCROLL_DELTA_RADIUS_THRESHOLD_PIXEL = (new_width * SCROLL_DELTA_RADIUS_THRESHOLD_PERCENTAGE);
//     }
// }


// function resetScrollDelta() {
//     last_scroll_delta = [0,0];
//     scroll_delta = [0,0];
//     scroll_deltaResetID = null;
// }

// function setScrollDelta(newScrollDelta) {
//     last_scroll_delta = scroll_delta;
//     scroll_delta = newScrollDelta;

//     onScrollDeltaChange();
// }

// function incrementScrollDelta(incrementAmt) {
//     last_scroll_delta = scroll_delta;
//     scroll_delta[0] += incrementAmt[0];
//     scroll_delta[1] += incrementAmt[1];

//     onScrollDeltaChange();
// }

// function onScrollDeltaStart() {
//     body_ref.trigger("onScrollXStart");
//     body_ref.trigger("onScrollYStart");
//     body_ref.trigger("onScrollXYStart");
//     body_ref.trigger("onScrollRadiusStart");
// }

// function onScrollDeltaEnd() {
//     resetScrollDelta();

//     scroll_X_isTriggered = scroll_Y_isTriggered = scroll_XY_isTriggered = scroll_radius_isTriggered = false;

//     body_ref.trigger("onScrollXEnd");
//     body_ref.trigger("onScrollYEnd");
//     body_ref.trigger("onScrollXYEnd");
//     body_ref.trigger("onScrollRadiusEnd");
// }

// function onScrollDeltaChange() {

//     var scroll_screen_percent = [ scroll_delta[0] / last_width, scroll_delta[1] / last_height ];

//     var scroll_progress_percent = [ constrain(scroll_delta[0] / SCROLL_DELTA_X_THRESHOLD_PIXEL, -1, 1), constrain(scroll_delta[1] / SCROLL_DELTA_Y_THRESHOLD_PIXEL, -1, 1) ];
//     //var scroll_changed = [ scroll_delta[0] != last_scroll_delta[0], scroll_delta[1] != last_scroll_delta[1] ];
//     var scroll_changed = [true, true];
//     var scroll_triggered = [ scroll_progress_percent[0] <= -1 || scroll_progress_percent[0] >= 1, scroll_progress_percent[1] <= -1 || scroll_progress_percent[1] >= 1 ];

//     var scroll_direction_vector = getXYDifference(last_scroll_delta, scroll_delta);

//     // Scroll X only events
//     if (scroll_changed[0] == true) {
//         body_ref.trigger("onScrollX", [ scroll_screen_percent[0], scroll_delta[0] ]);

//         if (!scroll_X_isTriggered) {
//             if (scroll_triggered[0] == true) {
//                 body_ref.trigger("onScrollXTrigger", [scroll_progress_percent[0], scroll_direction_vector[0]]);
//                 scroll_X_isTriggered = true;
//             } else {
//                 body_ref.trigger("onScrollXChange", [scroll_progress_percent[0], scroll_direction_vector[0]]);
//             }
//         }
//     }

//     // Scroll Y only events
//     if (scroll_changed[1] == true) {
//         body_ref.trigger('onScrollY', [ scroll_screen_percent[1], scroll_delta[1] ]);

//         if (!scroll_Y_isTriggered) {
//             if (scroll_triggered[1] == true) {
//                 body_ref.trigger("onScrollYTrigger", [scroll_progress_percent[1], scroll_direction_vector[1]]);
//                 scroll_Y_isTriggered = true;
//             } else {
//                 body_ref.trigger("onScrollYChange", [scroll_progress_percent[1], scroll_direction_vector[1]]);
//             }
//         }
//     }

//     // Scroll X + Y events
//     if (scroll_changed[0] == true || scroll_changed[1] == true) { // If at least one scroll dimension is changed
//         body_ref.trigger("onScroll", [ [scroll_screen_percent[0], scroll_screen_percent[1]], [scroll_delta[0], scroll_delta[1]] ]);

//         if (!scroll_XY_isTriggered) {
//             if (scroll_triggered[0] == true || scroll_triggered[1] == true) { // If at least one scroll dimension is triggered
//                 body_ref.trigger("onScrollXYTrigger", [scroll_progress_percent, scroll_direction_vector]);
//                 scroll_XY_isTriggered = true;
//             } else {
//                 body_ref.trigger("onScrollXYChange", [scroll_progress_percent, scroll_direction_vector]);
//             }
//         }
//     }

//     // Scroll radius events
//     if (scroll_changed[0] == true || scroll_changed[1] == true) { // If at least one scroll dimension is changed
//         var used_screen_dimension = last_width > last_height ? last_width : last_height;
//         var scroll_radius_screen_pixels = Math.sqrt(Math.pow(scroll_delta[0], 2) + Math.pow(scroll_delta[1], 2));
//         var scroll_radius_screen_percent = scroll_radius_screen_pixels / used_screen_dimension;
//         body_ref.trigger('onScrollRadius', [ scroll_radius_screen_percent, scroll_radius_screen_pixels ]);

//         if (!scroll_radius_isTriggered) {
//             var scroll_radius = Math.sqrt(Math.pow(scroll_delta[0], 2) + Math.pow(scroll_delta[1], 2))/SCROLL_DELTA_RADIUS_THRESHOLD_PIXEL; // [0 to 1]
//             if (scroll_radius >= 1) { // If the scroll radius is triggered
//                 body_ref.trigger("onScrollRadiusTrigger", [scroll_progress_percent, scroll_direction_vector]);
//                 scroll_radius_isTriggered = true;
//             } else {
//                 body_ref.trigger("onScrollRadiusChange", [scroll_radius, scroll_direction_vector]);
//             }
//         }
//     }
// }

// // function onScrollDeltaChange() {
// //     // Scroll change events
// //     if (scroll_isTriggered) { return; }

// //     var scroll_progress_percent = constrain(scroll_delta / SCROLL_DELTA_THRESHOLD_PIXEL, -1, 1); // range [-1, 1]

// //     if (scroll_delta == last_scroll_delta ) { return; }

// //     var scroll_direction_vector = getXYDifference([0, 0], [scroll_delta, scroll_delta]);

// //     if (scroll_progress_percent >= 1 || scroll_progress_percent <= -1) {
// //         // Stop the previously running reset timer
// //         clearTimeout(scroll_deltaResetID);

// //         body_ref.trigger("onScrollTrigger", [scroll_progress_percent, scroll_direction_vector]); // Trigger scroll tigger event
// //         scroll_isTriggered = true;

// //     } else { // -1 <= scroll_progress_percent <= 1
// //         body_ref.trigger("onScrollChange", [scroll_progress_percent, scroll_direction_vector]); // Trigger scroll change event
// //     }
// // }

// function resetDragDelta() {
//     last_drag_delta = [0, 0];
//     drag_delta = [0, 0];
// }

// // ( [int, int], bool )
// function setDragDelta(newDragDeltaXY) {
//     last_drag_delta = drag_delta;
//     drag_delta = [ newDragDeltaXY[0], newDragDeltaXY[1] ]; 

//     onDragDeltaChange();
// }

// function incrementDragDelta(newDragDeltaXY) {
//     last_drag_delta = drag_delta;
//     drag_delta[0] += newDragDeltaXY[0];
//     drag_delta[1] += newDragDeltaXY[1];

//     onDragDeltaChange();
// }

// function onDragDeltaStart() {
//     body_ref.trigger("onDragXStart");
//     body_ref.trigger("onDragYStart");
//     body_ref.trigger("onDragXYStart");
//     body_ref.trigger("onDragRadiusStart");
// }

// function onDragDeltaEnd() {
//     drag_X_isTriggered = drag_Y_isTriggered = drag_XY_isTriggered = drag_radius_isTriggered = false;

//     body_ref.trigger("onDragXEnd");
//     body_ref.trigger("onDragYEnd");
//     body_ref.trigger("onDragXYEnd");
//     body_ref.trigger("onDragRadiusEnd");

//     // drag_X_isTriggered ? drag_X_isTriggered = false : body_ref.trigger("onDragXEnd");
//     // drag_Y_isTriggered ? drag_Y_isTriggered = false : body_ref.trigger("onDragYEnd");
//     // drag_XY_isTriggered ? drag_XY_isTriggered = false : body_ref.trigger("onDragXYEnd");
//     // drag_radius_isTriggered ? drag_radius_isTriggered = false : body_ref.trigger("onDragRadiusEnd");
// }

// function RESET_ALL_DELTAS () {
//     mouse_down = false;

//     drag_delta = [0, 0];
//     last_drag_delta = [0, 0];

//     scroll_delta = [0, 0];
//     last_scroll_delta = [0, 0];

//     clearTimeout(scroll_deltaResetID);
//     scroll_deltaResetID = null;

//     scroll_X_isTriggered = false;
//     scroll_Y_isTriggered = false;
//     scroll_XY_isTriggered = false;
//     scroll_radius_isTriggered = false;

//     drag_X_isTriggered = false;
//     drag_Y_isTriggered = false;
//     drag_XY_isTriggered = false;
//     drag_radius_isTriggered = false;
// }

// function onDragDeltaChange() {
//     var drag_screen_percent = [ drag_delta[0] / last_width, drag_delta[1] / last_height ];

//     var drag_progress_percent = [ constrain(drag_delta[0] / DRAG_DELTA_X_THRESHOLD_PIXEL, -1, 1), constrain(drag_delta[1] / DRAG_DELTA_Y_THRESHOLD_PIXEL, -1, 1) ];
//     var drag_changed = [ drag_delta[0] != last_drag_delta[0], drag_delta[1] != last_drag_delta[1] ];
//     var drag_triggered = [ drag_progress_percent[0] <= -1 || drag_progress_percent[0] >= 1, drag_progress_percent[1] <= -1 || drag_progress_percent[1] >= 1 ];

//     // var drag_triggered = [ 
//     //     floatCompare("<= ", drag_progress_percent[0], -1, 0.05) || floatCompare(">=", drag_progress_percent[0], 1, 0.05), 
//     //     floatCompare("<=", drag_progress_percent[1], -1, 0.05) || floatCompare(">=", drag_progress_percent[1], 1, 0.05) ];

//     var drag_direction_vector = getXYDifference(last_drag_delta, drag_delta);

//     // Drag X only events
//     if (drag_changed[0] == true) {
//         body_ref.trigger("onDragX", [ drag_screen_percent[0], drag_delta[0] ]);

//         if (!drag_X_isTriggered) {
//             if (drag_triggered[0] == true) {
//                 body_ref.trigger("onDragXTrigger", [drag_progress_percent[0], drag_direction_vector[0]]);
//                 drag_X_isTriggered = true;
//             } else {
//                 body_ref.trigger("onDragXChange", [drag_progress_percent[0], drag_direction_vector[0]]);
//             }
//         }
//     }

//     // Drag Y only events
//     if (drag_changed[1] == true) {
//         body_ref.trigger('onDragY', [ drag_screen_percent[1], drag_delta[1] ]);

//         if (!drag_Y_isTriggered) {
//             if (drag_triggered[1] == true) {
//                 body_ref.trigger("onDragYTrigger", [drag_progress_percent[1], drag_direction_vector[1]]);
//                 drag_Y_isTriggered = true;
//             } else {
//                 body_ref.trigger("onDragYChange", [drag_progress_percent[1], drag_direction_vector[1]]);
//             }
//         }
//     }

//     // Drag X + Y events
//     if (drag_changed[0] == true || drag_changed[1] == true) { // If at least one drag dimension is changed
//         body_ref.trigger("onDrag", [ [drag_screen_percent[0], drag_screen_percent[1]], [drag_delta[0], drag_delta[1]] ]);

//         if (!drag_XY_isTriggered) {
//             if (drag_triggered[0] == true || drag_triggered[1] == true) { // If at least one drag dimension is triggered
//                 body_ref.trigger("onDragXYTrigger", [drag_progress_percent, drag_direction_vector]);
//                 drag_XY_isTriggered = true;
//             } else {
//                 body_ref.trigger("onDragXYChange", [drag_progress_percent, drag_direction_vector]);
//             }
//         }
//     }

//     // Drag radius events
//     if (drag_changed[0] == true || drag_changed[1] == true) { // If at least one drag dimension is changed
//         var used_screen_dimension = last_width > last_height ? last_width : last_height;
//         var drag_radius_screen_pixels = Math.sqrt(Math.pow(drag_delta[0], 2) + Math.pow(drag_delta[1], 2));
//         var drag_radius_screen_percent = drag_radius_screen_pixels / used_screen_dimension;
//         body_ref.trigger('onDragRadius', [ drag_radius_screen_percent, drag_radius_screen_pixels ]);

//         if (!drag_radius_isTriggered) {
//             var drag_radius = Math.sqrt(Math.pow(drag_delta[0], 2) + Math.pow(drag_delta[1], 2))/DRAG_DELTA_RADIUS_THRESHOLD_PIXEL; // [0 to 1]

//             if (drag_radius >= 1) { // If the drag radius is triggered
//                 body_ref.trigger("onDragRadiusTrigger", [drag_progress_percent, drag_direction_vector]);
//                 drag_radius_isTriggered = true;
//             } else {
//                 body_ref.trigger("onDragRadiusChange", [drag_radius, drag_direction_vector]);
//             }
//         }
//     }
// }

// // --------------------------
// // --- Event trigger code ---
// // --------------------------

// // Mousewheel swipe code

// body_ref.on('mousewheel DOMMouseScroll', function(e) {
//     if (scroll_deltaResetID == null) { // If first mousewheel event
//         onScrollDeltaStart();
//     }

//     var delta = [e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY];

//     // console.log(delta);

//     // onScroll event
//     var scroll_screen_percent = [ delta[0] / last_width, delta[1] / last_height ];
//     body_ref.trigger("onScrollX", [ scroll_screen_percent[0], delta[0] ]);
//     body_ref.trigger("onScrollY", [ scroll_screen_percent[1], delta[1] ]);
//     body_ref.trigger("onScroll", [ scroll_screen_percent, delta ]);

//     incrementScrollDelta(delta);

//     // Stop the previously running reset timer
//     clearTimeout(scroll_deltaResetID);

//     // Set a timeout function that resets the scroll delta
//     // amount after a peroid of inactivity
//     scroll_deltaResetID = setTimeout(function() {
//         onScrollDeltaEnd();
//     }, SCROLL_RESET_TIME);
// });

// // Mouse swipe code

// var mouse_pos_start = [0, 0];
// var mouse_down = false;

// body_ref.on('mousedown', function(e) {
//     // Check for left click
//     if (e.which != 1) {
//         return;
//     }

//     onDragDeltaStart();

//     mouse_down = true;
//     mouse_pos_start[0] = e.pageX;
//     mouse_pos_start[1] = e.pageY;
// });

// body_ref.on('mousemove', function(e) {
//     // Check for left click and mouse is down
//     if (e.which != 1 || mouse_down != true) { 
//         return;
//     }

//     var curr_pos = [e.pageX, e.pageY];
//     setDragDelta([curr_pos[0] - mouse_pos_start[0], curr_pos[1] - mouse_pos_start[1] ]);
// });

// body_ref.on('mouseup mouseleave', function(e) {
//     // Check for left click
//     if (e.which != 1) {
//         return;
//     }

//     mouse_down = false;
//     mouse_pos_start = [0, 0];
    
//     onDragDeltaEnd();
//     resetDragDelta();
// });

// // Touch swipe code

// var touch_pos_start = [0, 0];

// body_ref.on('touchstart', function (e) {
//     touch_pos_start = [ e.touches[0].clientX, e.touches[0].clientY ];

//     onDragDeltaStart();
// });

// body_ref.on('touchmove', function (e) {

//     var curr_pos = [e.touches[0].clientX, e.touches[0].clientY];

//     setDragDelta([curr_pos[0] - touch_pos_start[0], curr_pos[1] - touch_pos_start[1] ]);
// });

// body_ref.on('touchend touchcancel', function (e) {

//     touch_posY_start = 0;

//     onDragDeltaEnd();
//     resetDragDelta();
// });