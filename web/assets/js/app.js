(function($) {	
	

//–––––––––––––––––––––––––––––––––––––––––––––––––––––– DOCUMENT READY


$(document).ready(function() {
	gsap.registerPlugin(ScrollTrigger,ScrollSmoother)
	
	
	PageLoadFunctions();
	
	
	//––CLICK FUNCTIONS
	
	
	//Open / Close Menu
	$(document).on('click', '.menu-opener', function(e) {
		
		if(!$('.menu-opener').hasClass('opened')) {
			MenuOpener();
			
			e.stopImmediatePropagation();
		} else {
			MenuCloser();
			
			e.stopImmediatePropagation();
		}
		
	});
	
	//Hovering over homepage splash panels
	$(document).on('mouseenter', '.page-wrap#home-page .splash-panel .side .menu', function(e) {
		
		var thisHomeSplashMenu = $(this),
			thisHomeSplashSide = thisHomeSplashMenu.parent('.side');
		
		thisHomeSplashSide.addClass('hovered');
		
	});
	
	//Hovering off homepage splash panels
	$(document).on('mouseleave', '.page-wrap#home-page .splash-panel .side .menu', function(e) {
		
		var thisHomeSplashMenu = $(this),
			thisHomeSplashSide = thisHomeSplashMenu.parent('.side');
		
		thisHomeSplashSide.removeClass('hovered');
		
	});
	
	//Navigating between slides on tabbed carousel panels
	$(document).on('click', '.tabbed-carousel-panel .nav-panel .nav-menu .nav-block', function(e) {
		
		var thisTbdCarouselNavBlock = $(this),
			thisTbdCarouselSection = thisTbdCarouselNavBlock.closest('.tabbed-carousel-panel'),
			thisTbdCarouselCarousel = thisTbdCarouselSection.find('.tabbed-carousel'),
			thisTbdCarouselNavHook = thisTbdCarouselNavBlock.attr('data-nav-hook'),
			thisTbdCarouselNavHookZerod = thisTbdCarouselNavHook - 1;
		
		thisTbdCarouselCarousel.flickity( 'select', thisTbdCarouselNavHookZerod, true, false );	
			
	});
	
	//Open Person Bio Modal
	$(document).on('click', '.person-bio-opener a', function(e) {
		e.preventDefault();
		
		var personBioOpener = $(this),
			personBioURL = personBioOpener.attr('data-url');
			
		$(".people-popup-overlay").load(personBioURL + " #popup-modal", function(responseTxt, statusTxt, xhr) {
			
			DisableBodyScroll();
			
			$(".people-popup-overlay").fadeIn(600, "easeInOutQuad", function() {
				mediaLazyloading();
				
				$(".people-popup-overlay").addClass('visible');
				
			});
			
		});
		
	});
	
	//Close Person Bio Modal
	$(document).on('click', '.people-popup-overlay .close-button', function(e) {
		
		$(".people-popup-overlay").removeClass('visible');
		setTimeout(function() {
			$(".people-popup-overlay").fadeOut(500, "easeInOutQuad", function() {
				EnableBodyScroll();
				$(".people-popup-overlay").empty();
			});
		}, 500);
		
	});
	
	//For Wider Team, on people page, show more team members
	$(document).on('click', '.page-wrap#people-page .wider-team-panel .view-more-posts', function(e) {
		
		var viewMoreWiderTeam = $(this),
			hiddenWiderTeam = $('.page-wrap#people-page .wider-team-panel .wider-team-grid .person-wrap.hidden');
		
		viewMoreWiderTeam.hide();
		hiddenWiderTeam.show();
		setTimeout(function() {
			hiddenWiderTeam.removeClass('hidden');
		}, 150);
		
	});
	
	//Universe Post Filtering
	$(document).on('click', 'a.universe-filter-button', function(e) {
		e.preventDefault();
		
		var universeFilterHook = $(this).attr('data-hook'),
			selectedUniverseFilters = $('a.universe-filter-button.' + universeFilterHook),
			unselectedUniverseFilters = $('a.universe-filter-button').not(selectedUniverseFilters),
			selectedUniversePosts = $('.universe-block.' + universeFilterHook),
			otherUniversePosts = $('.universe-block').not(selectedUniversePosts);
		
		//adjust menu classes
		unselectedUniverseFilters.removeClass('active');
		selectedUniverseFilters.addClass('active');
		
		//filter universe blocks
		if($(this).hasClass('all')) {
			
			$('.universe-block').removeClass('hidden');
			
		} else {
		
			otherUniversePosts.addClass('hidden');
			selectedUniversePosts.removeClass('hidden');
		
		}
		
		//hide intro statement
		if(!$('.fixed-intro-statement').hasClass('hidden')) {
			$('body.universe .fixed-intro-statement').addClass('hidden');
			$('body.universe .universe-filter-menu').addClass('visible');
		}
		
	});
	

});


//–––––––––––––––––––––––––––––––––––––––––––––––––––––– WINDOW RESIZE


$(window).resize(function () {
	Resize();
});


//–––––––––––––––––––––––––––––––––––––––––––––––––––––– SITE FUNCTIONS


//––PAGE LOAD CONSTANTS

function PageLoadFunctions() {	
	
	//Media Lazyloading
	mediaLazyloading();	
	
	//Out of View
	outOf();
	
	//––CAROUSEL SECTION CAROUSEL
	if ($(".carousel-section-carousel").length) {
		CarouselSectionCarousel();
	}
	
	//––TIMELINE CAROUSEL
	if ($(".timeline-carousel").length) {
		TimelineCarousel();
	}
	
	//––TABBED CAROUSEL
	if ($(".tabbed-carousel").length) {
		TabbedCarousel();
	}
	
	//––GALLERY GRID
	if ($(".gallery-grid").length) {
		GalleryGrid();
	}
	
	//––GALLERY LIGHTBOX CAROUSEL
	if ($(".gallery-lightbox-carousel").length) {
		GalleryLightboxCarousel();
	}
	
	//––UNIVERSE FUNCTION
	if ($('body').hasClass('universe')) {
		Universe();
	}
	
	//––INFINITE SCROLL GRID
	if ($(".infinite-grid").length) {
		infiniteScroll();
	}
	
	//––CUSTOM FILE FIELDS
	if ($("input[type=file]").length) {
		fileFields();
	}
	
	//––OPACITY SCROLL TRIGGER
	if ($(".opacity-on-scroll").length) {
		OpacityScrollTrigger();
	}
	
	//––SHIFT SCROLL TRIGGER
	if ($(".shift-on-scroll").length) {
		ShiftScrollTrigger();
	}
	
	//––SCROLL SMOOTHER START
	SmoothScroller();
	
	//––RESIZE FUNCTION
	Resize();
	$(window).trigger('resize');
	
	setTimeout(function() {
		$('body').addClass('loaded');
	}, 100);

}

//––RESIZE FUNCTION

function Resize() {

	var windowHeight = $(window).height(),
		finalHeight = windowHeight + 'px';        
	var windowWidth = $(window).width(),
		finalWindowWidth = windowWidth + 'px';
		
	$('.fullscreen').css('height', finalHeight);
	$('.min-fullscreen').css('min-height', finalHeight);
	
	//Carousel Section arrow sizing
	if ($(".carousel-section-carousel").length) {
		
		//arrow sizing on carousels
		$('.carousel-section .carousel-section-carousel').each(function () {
			var thisCarouselSectionCarousel = $(this),
				thisCarouselSlideHeight = thisCarouselSectionCarousel.find('.carousel-slide:first-child').find('.image').outerHeight(),
				thisCarouselArrowButtons = thisCarouselSectionCarousel.find('.flickity-prev-next-button');
				
			thisCarouselArrowButtons.css('height', thisCarouselSlideHeight + 'px');
			
		});
		
	}
	
}

//––MENU OPENER

function MenuOpener() {
	
	$('.menu-opener, .menu-overlay').addClass('opened');
	DisableBodyScroll();
}

//––MENU CLOSER

function MenuCloser() {
	
	$('.menu-opener, .menu-overlay').removeClass('opened');
	EnableBodyScroll(); 
	
}

//––SMOOTH SCROLLER

function SmoothScroller() {

	//DESKTOP ONLY
	if($(window).width() > 768) {
		
		// Initialize ScrollSmoother
		const smoother = ScrollSmoother.create({
			wrapper: "#smooth-wrapper",
			content: "#smooth-content",
			smooth: 1.2, // Adjust smoothness
			effects: true,
			onUpdate: (self) => {
				const scrollProgress = self.progress;
			},
		});
	
	//MOBILE ONLY
	} else {
		
	}

}

//––CAROUSEL SECTION CAROUSEL

function CarouselSectionCarousel() {
	
	if($(window).width() > 768) {
		var draggableVar = false;
	} else {
		var draggableVar = true;
	}
	
	var $carouselSectionCarousel = $('.carousel-section-carousel');
	$carouselSectionCarousel.flickity({
		cellSelector: '.carousel-slide',
		fade: false,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: false,
		draggable: draggableVar,
		cellAlign: 'left',
		lazyLoad: 2,
		imagesLoaded: true,
		adaptiveHeight: false,
		prevNextButtons: true,
		setGallerySize: true,
		pageDots: false,
		contain: true,
		accessibility: false,
		arrowShape: 'M 6.1,50L53.1,3.1l-2.6-2.6L.9,50l49.6,49.5,2.6-2.6L6.1,50 Z'
	});
	
	//Lazyload Function
	$carouselSectionCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
		$(cellElement).addClass('image-loaded');
	});
	
}

//––TIMELINE CAROUSEL

function TimelineCarousel() {
	
	var $timelineCarousel = $('.timeline-carousel');
	$timelineCarousel.flickity({
		cellSelector: '.timeline-slide',
		fade: false,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: false,
		draggable: false,
		cellAlign: 'left',
		lazyLoad: 2,
		imagesLoaded: true,
		adaptiveHeight: false,
		prevNextButtons: true,
		setGallerySize: true,
		pageDots: false,
		contain: true,
		accessibility: false,
		arrowShape: 'M 6.1,50L53.1,3.1l-2.6-2.6L.9,50l49.6,49.5,2.6-2.6L6.1,50 Z'
	});
	
	//Lazyload Function
	$timelineCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
		$(cellElement).addClass('image-loaded');
	});
	
}

//––CAPABILITIES CAROUSEL

function TabbedCarousel() {
	
	if($(window).width() > 768) {
		var adaptHeightVar = false;
	} else {
		var adaptHeightVar = true;
	}
	
	var $TabbedCarousel = $('.tabbed-carousel');	
	$TabbedCarousel.flickity({
		cellSelector: '.carousel-slide',
		fade: true,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: true,
		draggable: false,
		cellAlign: 'center',
		lazyLoad: 2,
		imagesLoaded: true,
		adaptiveHeight: adaptHeightVar,
		prevNextButtons: true,
		setGallerySize: true,
		pageDots: true,
		contain: false,
		accessibility: false,
		arrowShape: 'M 6.1,50L53.1,3.1l-2.6-2.6L.9,50l49.6,49.5,2.6-2.6L6.1,50 Z'
	});
	
	var flktyTabbedCarousel = $TabbedCarousel.data('flickity');

	function updateStatus() {
		var tabbedCarouselCellNumber = flktyTabbedCarousel.selectedIndex + 1;
		var selectedTabbedCarouselNavBlock = $('.tabbed-carousel-panel .nav-panel .nav-menu .nav-block.nav-block-' + tabbedCarouselCellNumber);
		
		$('.tabbed-carousel-panel .nav-panel .nav-menu .nav-block').not(selectedTabbedCarouselNavBlock).removeClass('selected');
		selectedTabbedCarouselNavBlock.addClass('selected');
	}
	updateStatus();
	
	$TabbedCarousel.on( 'select.flickity', function( event, index ) {
		updateStatus();
	});
	
	//on image lazyload
	$TabbedCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
		$(cellElement).addClass('image-loaded');
	});

}

//––GALLERY GRID FUNCTION

function GalleryGrid() {
	
	var $galleryGrid = $('.gallery-grid');
	
	$galleryGrid.imagesLoaded(function() {
		$galleryGrid.isotope({
			layoutMode: 'packery',
			percentPosition: true,
			itemSelector: '.gallery-module',
			packery: {
				gutter: '.gallery-grid .gutter-sizer'
			}
		});					
	});	
	
}

//––GALLERY LIGHTBOX CAROUSEL

function GalleryLightboxCarousel() {
	
	var $galleryLightboxCarousel = $('.gallery-lightbox-carousel');
	$galleryLightboxCarousel.flickity({
		cellSelector: '.gallery-lightbox-slide',
		fade: true,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: true,
		draggable: false,
		cellAlign: 'center',
		lazyLoad: 2,
		imagesLoaded: true,
		adaptiveHeight: false,
		prevNextButtons: false,
		setGallerySize: false,
		pageDots: false,
		contain: true,
		accessibility: false,
	});
	
	//Lazyload Function
	$galleryLightboxCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
		$(cellElement).addClass('image-loaded');
	});
	
	//Click to go to next
	$( ".gallery-lightbox-carousel .gallery-lightbox-slide .gallery-lightbox-img img.next-arrow" ).on( "click", function() {
		
		$galleryLightboxCarousel.flickity('next');
		
	});
	
	//Open Gallery Lightbox Overlay
	$( ".gallery-panel .gallery-grid .gallery-module" ).on( "click", function() {
		
		var galleryLightboxOverlay = $('.gallery-lightbox-overlay'),
			galleryLightboxCarousel = galleryLightboxOverlay.find('.gallery-lightbox-carousel'),
			galleryLightboxOpenerIndex = $(this).closest('.page-wrap').find('.gallery-module').index(this);
		
			galleryLightboxCarousel.flickity( 'selectCell', galleryLightboxOpenerIndex, false, true );
			
			DisableBodyScroll();
			
			setTimeout(function() {
				galleryLightboxOverlay.addClass('visible');
			}, 100);		
	
	});
	
	//Close Gallery Lightbox Overlay
	$( ".gallery-lightbox-overlay img.close-button" ).on( "click", function() {
		
		var galleryLightboxOverlay = $('.gallery-lightbox-overlay');
		
		EnableBodyScroll();
		galleryLightboxOverlay.removeClass('visible');
		
	});
	
}

//––UNIVERSE FUNCTIONS

function Universe() {
	
	ScrollTrigger.create({
		trigger: 'body.universe',
		start: "2 top",
		end: "110% bottom",
		pin: false,
		pinSpacing:false,
		markers: false,
		onEnter: () => {
			$('body.universe .fixed-intro-statement').addClass('hidden');
			$('body.universe .universe-filter-menu').addClass('visible');
		},
		onLeave: () => {
			$('body.universe .fixed-intro-statement').removeClass('hidden');
			$('body.universe .universe-filter-menu').removeClass('visible');
		},
		onLeaveBack: () => {
			$('body.universe .fixed-intro-statement').removeClass('hidden');
			$('body.universe .universe-filter-menu').removeClass('visible');
		},
		onEnterBack: () => {
			$('body.universe .fixed-intro-statement').addClass('hidden');
			$('body.universe .universe-filter-menu').addClass('visible');
		}
	});
	
}

//––INFINITE SCROLL GRID

function infiniteScroll() {
	
	$('.infinite-grid').infiniteScroll({
		// options
		path: 'nav.pagination a',
		append: 'article',
		history: false,
		checkLastPage: true,
		button: '.view-more-posts',
		scrollThreshold: false,
		hideNav: 'nav.pagination'
	});
	
	$('.infinite-grid').on( 'append.infiniteScroll', function( event, body, path, items, response ) {
		mediaLazyloading();
	});
	
}

//––CUSTOM FILE FIELDS

function fileFields() {
	
	$("input[type=file]").nicefileinput({
		label : ''
	});
	
	$('.NFI-filename').attr('placeholder', 'CV / Portfolio / Cover Letter');
	
}
	
//––LAZYLOADING

function mediaLazyloading() {
	
	var myLazyLoad = new LazyLoad({
		threshold: 500,
		callback_loaded: (el) => {
			
			//Fade out loading overlays
			setTimeout(function() {
				$(el).siblings('.loading-overlay').addClass('hidden');
				$(el).children('.loading-overlay').addClass('hidden');
			}, 50);
			
			setTimeout(function() {
				$(el).siblings('.video-placeholder').addClass('hidden');
				$(el).children('.video-placeholder').addClass('hidden');
			}, 300);
			
		}
	});
	
}

//––OPACITY ON SCROLL

function OpacityScrollTrigger() {
	
	gsap.utils.toArray(".opacity-on-scroll").forEach(function(elem) {
	
		var opacityScrollElement = elem;
		
		ScrollTrigger.create({
			trigger: elem,
			start:'top 70%',
			end:'bottom 70%',
			onEnter: () => {
				opacityScrollElement.classList.add('visible');
			},
			onLeave: () => {
	
			},
			onLeaveBack: () => {
	
			},
			onEnterBack: () => {
	
			},
			markers:false
		});
	
	});
	
}

//––SHIFT ON SCROLL

function ShiftScrollTrigger() {
	
	gsap.utils.toArray(".shift-on-scroll").forEach(function(elem) {
	
		var shiftScrollElement = elem;
		
		ScrollTrigger.create({
			trigger: elem,
			start:'top 70%',
			end:'bottom 70%',
			onEnter: () => {
				shiftScrollElement.classList.add('visible');
			},
			onLeave: () => {
	
			},
			onLeaveBack: () => {
	
			},
			onEnterBack: () => {
	
			},
			markers:false
		});
	
	});
	
}

//OUT OF VIEW FUNCTION

function outOf() {

	$('.out-of-view').inViewport(
	function() {
		$(this).addClass("am-in-view");
	},
	function() {}
	);
	
	//Animated Stats
	$('span.animated-number').inViewport(
	function() {
		
		var animatedStatElement = $(this);
		var animatedStat = animatedStatElement.attr('data-stat');
		var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
		
		animatedStatElement.animateNumber(
			{
				number: animatedStat,
				numberStep: comma_separator_number_step
			},
			{
				easing: 'swing',
				duration: 4000,
				complete: function(){
				}
			}
		);
		
	},
	function() {}
	);

}

//ENABLE BODY SCROLL

function EnableBodyScroll() {
	$("body").css({"position": "static", "overflow": "auto"});
}

//DISABLE BODY SCROLL

function DisableBodyScroll() {
	$("body").css({"position": "sticky", "overflow": "hidden"});
}

})(jQuery);