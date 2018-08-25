let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

// PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application({width: 256, height: 256});

app.view.setAttribute("id", "front-page__canvas");

var window_width = $(window).width();
var window_height = $(window).height();     

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);



