/*! inViewport 0.0.1 
 *  jQuery plugin by Moob
 * ======================== 
 *  (requires jQuery) 
 */  
(function ($) {

    var vph=0;
    function getViewportDimensions(){
        vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewportDimensions();    
    //on resize/scroll
    $(window).on('resize orientationChanged', function(){
        getViewportDimensions();
    });            
    
    $.fn.inViewport = function (whenInView, whenNotInView) {                  
        return this.each(function () {
            var el = $(this),
                inviewalreadycalled = false,
                notinviewalreadycalled = false;                            
            //on resize/scroll
            $(window).on('resize orientationChanged scroll', function(){
                checkInView();
            });               
            function checkInView(){
                var rect = el[0].getBoundingClientRect(),
                    t = rect.top,
                    b = rect.bottom;
                if(t<vph && b>0){
                    if(!inviewalreadycalled){
                        whenInView.call(el);
                        inviewalreadycalled = true;
                        notinviewalreadycalled = false;
                    }
                } else {
                    if(!notinviewalreadycalled){
                        whenNotInView.call(el);
                        notinviewalreadycalled = true;
                        inviewalreadycalled = false;
                    }
                }
            }
            //initial check
            checkInView();                
        });
    }             
}(jQuery));