// $(document).ready(function(){
//     console.log("attempting to scroll top");
//     $(this).scrollTop(0);
// });

window.onbeforeunload = function () {
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
}