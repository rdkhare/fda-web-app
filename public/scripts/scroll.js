function checkScroll(){
    var startY = $('.navbar').height() * 2;

    if($(window).scrollTop() > startY){
        $('.navbar').addClass("scrolled");
        $('.navbar').addClass("border-bottom");
        $('.navbar').addClass("border-success");
    }else{
        $('.navbar').removeClass("scrolled");
        $('.navbar').removeClass("border-bottom");
        $('.navbar').removeClass("border-success");
    }
}

window.onscroll = function() {checkScroll()};
