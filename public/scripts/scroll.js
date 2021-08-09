function checkScroll(){
    var startY = $('.navbar').height() * 4;

    if($(window).scrollTop() > startY){
        $('.navbar').addClass("scrolled");
        $('.custom-ul').addClass("scrolled");
        $('.d-flex').addClass("scrolled");
        $('.fas-l').addClass("scrolled");
        $('.home').addClass("scrolled");
    }else{
        $('.navbar').removeClass("scrolled");
        $('.custom-ul').removeClass("scrolled");
        $('.d-flex').removeClass("scrolled");
        $('.fas-l').removeClass("scrolled");
        $('.home').removeClass("scrolled");
    }
}

window.onscroll = function() {checkScroll()};
