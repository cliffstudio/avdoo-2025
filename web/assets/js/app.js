(function($) {	

if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
	sessionStorage.removeItem("homepageVisited");
}


//–––––––––––––––––––––––––––––––––––––––––––––––––––––– DOCUMENT READY


$(document).ready(function() {
	gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,ScrollSmoother)
	
	
	PageLoadFunctions();
	
	
	//––SCROLL FUNCTIONS
	
	
	var lastScrollTop = 0;
			
	$(window).on( 'scroll', function() {
		var scrollAmount = $(this).scrollTop();
		
		//IF SCROLLING UPWARDS OR DOWNWARDS
		if($(window).width() > 768) {
			var headerHiddenMarker = $('header').outerHeight();
		} else {
			if($('body').hasClass('home')) {
				var headerHiddenMarker = $(window).height() * 0.75;
			} else {
				var headerHiddenMarker = $('header').outerHeight();
			}
		}
		
		if (scrollAmount > lastScrollTop && (scrollAmount > headerHiddenMarker )) {
			
			$('header').addClass('hidden');
		
		} else if (scrollAmount < lastScrollTop) {
			
			$('header').removeClass('hidden');
		
		}
		lastScrollTop = scrollAmount;
		
		//HOMEPAGE SPECIFIC (MOBILE LOGO LOCKING)
		if($(window).width() < 768) {
			if($('body').hasClass('home')) {
				
				if(scrollAmount < 0) {
					var scrollAmount = 0;	
				}
				
				var scrollWindowWidth = $(window).width();
				var smallLogoWidth = $('header .logo-wrap').outerWidth(),
					largeLogoWidth = $('.page-wrap#home-page .splash-panel .logo-wrap.dummy').outerWidth(),
					smallLogoTop = parseInt($('header').css('padding-top'), 10),
					largeLogoTop = $('.page-wrap#home-page .splash-panel .logo-wrap.scaling').position().top;				
				
				var logoWidthDifference = largeLogoWidth - smallLogoWidth,
					logoTopDifference = largeLogoTop - smallLogoTop;
				
				var scrollLogoDifference = logoWidthDifference / logoTopDifference,
					scrollLogoWidthDiff = scrollAmount * scrollLogoDifference,
					scrollLogoFinalWidth = largeLogoWidth - scrollLogoWidthDiff,
					scrollLogoFinalWidth = Math.floor(scrollLogoFinalWidth);
				var scrollLogoFinalVW = (scrollLogoFinalWidth / scrollWindowWidth) * 100;
				
				$('.page-wrap#home-page .splash-panel .logo-wrap.scaling img').css('width', scrollLogoFinalVW + 'vw');
				
				if(scrollLogoFinalWidth < smallLogoWidth) {
					$('body.home').addClass('logo-scaled');
				} else {
					$('body.home').removeClass('logo-scaled');
				}								
			
			}
		}
		
	});
	
	
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
	
	//Hover over Menu Items
	$(document).on('mouseenter', '.menu-overlay .menu-side .main-menu .main-menu-item a', function(e) {
		var thisMenuItem = $(this).closest('.main-menu-item'),
			thisMenuItemHook = thisMenuItem.attr('data-hook'),
			thisMenuItemBG = thisMenuItem.attr('data-bg-color'),
			selectedMenuImage = $('.menu-overlay .image-side .menu-image.' + thisMenuItemHook),
			otherMenuImages = $('.menu-overlay .image-side .menu-image').not(selectedMenuImage);
		
		otherMenuImages.removeClass('visible');
		selectedMenuImage.addClass('visible');
		$('.menu-overlay').css('background-color', thisMenuItemBG);
		
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
	
	//Open / Close Menu
	$(document).on('click', '.page-wrap#home-page .splash-panel .down-arrow', function(e) {
		
		var homepageScrollToAmount = $(window).height();
		
		//scroll to carousel
		if($(window).width() > 768) {
			let previouslyCreatedSmoother = ScrollSmoother.get();	
			previouslyCreatedSmoother.scrollTo(homepageScrollToAmount, true);
		} else {
			$('html, body').animate({
				scrollTop: homepageScrollToAmount
			}, {
				duration: 800,
				easing: 'easeInOutCubic'
			});	
		}
		
	});
	
	//Navigating between slides on tabbed carousel panels
	$(document).on('click', '.tabbed-carousel-panel .nav-panel .nav-menu .nav-block', function(e) {		
		
		var thisTbdCarouselNavBlock = $(this),
			thisTbdCarouselSection = thisTbdCarouselNavBlock.closest('.tabbed-carousel-panel'),
			thisTbdCarouselCarousel = thisTbdCarouselSection.find('.tabbed-carousel'),
			thisTbdCarouselCarouselTop = thisTbdCarouselCarousel.offset().top - 85,
			thisTbdCarouselNavHook = thisTbdCarouselNavBlock.attr('data-nav-hook'),
			thisTbdCarouselNavHookZerod = thisTbdCarouselNavHook - 1;
		
		thisTbdCarouselCarousel.flickity( 'select', thisTbdCarouselNavHookZerod, true, false );	
		
		//scroll to carousel
		if($(window).width() > 768) {
			let previouslyCreatedSmoother = ScrollSmoother.get();	
			previouslyCreatedSmoother.scrollTo(thisTbdCarouselCarouselTop, true);
		} else {
			$('html, body').animate({
				scrollTop: thisTbdCarouselCarouselTop
			}, {
				duration: 800,
				easing: 'easeInOutCubic'
			});	
		}
			
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
	
	//Hovering over number facts to animate them again
	// $(document).on('mouseenter', '.page-wrap#expertise-page .facts-panel .facts .fact.animation-complete', function(e) {
	// 	
	// 	var thisAnimatedFactWrap = $(this);
	// 	var thisAnimatedFact = thisAnimatedFactWrap.find('span.animated-number');
	// 	var animatedStat = parseFloat(thisAnimatedFact.attr('data-stat'));
	// 	var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
	// 
	// 	// Remove animation-complete class
	// 	thisAnimatedFactWrap.removeClass('animation-complete');
	// 
	// 	// Properly reset animateNumber internal state to zero
	// 	thisAnimatedFact.prop('number', 0).text('0');
	// 
	// 	// Slight delay ensures DOM updates
	// 	setTimeout(function() {
	// 		thisAnimatedFact.animateNumber(
	// 			{
	// 				number: animatedStat,
	// 				numberStep: comma_separator_number_step
	// 			},
	// 			{
	// 				easing: 'swing',
	// 				duration: 8000,
	// 				complete: function(){
	// 					thisAnimatedFactWrap.addClass('animation-complete');
	// 				}
	// 			}
	// 		);
	// 	}, 50);
	// 
	// });
	
	//Open Universe Modal
	$(document).on('click', '.page-wrap#universe-page .universe-grid .universe-block.popup-post-type', function(e) {
		
		var universeModalOpener = $(this),
			universePostURL = universeModalOpener.attr('data-url');
			
		$(".universe-popup-overlay").load(universePostURL + " #popup-modal", function(responseTxt, statusTxt, xhr) {
			
			DisableBodyScroll();
			
			$(".universe-popup-overlay").fadeIn(600, "easeInOutQuad", function() {
				mediaLazyloading();
				
				$(".universe-popup-overlay").addClass('visible');
				
			});
			
		});
		
	});
	
	//Close Universe Modal
	$(document).on('click', '.universe-popup-overlay .close-button', function(e) {
		
		$(".universe-popup-overlay").removeClass('visible');
		setTimeout(function() {
			$(".universe-popup-overlay").fadeOut(500, "easeInOutQuad", function() {
				EnableBodyScroll();
				$(".universe-popup-overlay").empty();
			});
		}, 500);
		
	});
	
	//Universe Post Filtering
	$(document).on('click', 'a.universe-filter-button', function(e) {
		e.preventDefault();
		
		var thisUniverseFilter = $(this);
		var universeFilterHook = $(this).attr('data-hook'),
			selectedUniverseFilters = $('a.universe-filter-button.' + universeFilterHook),
			unselectedUniverseFilters = $('a.universe-filter-button').not(selectedUniverseFilters),
			selectedUniversePosts = $('.universe-block.' + universeFilterHook),
			otherUniversePosts = $('.universe-block').not(selectedUniversePosts);
				
		//adjust menu classes
		unselectedUniverseFilters.removeClass('active');
		selectedUniverseFilters.addClass('active');
		
		//first hide all blocks
		$('.universe-block').addClass('hidden');
		
		setTimeout(function() {
			
			//then remove all unselected ones
			if(thisUniverseFilter.hasClass('all')) {
				$('.universe-block').show();
			} else {
				otherUniversePosts.hide();
				selectedUniversePosts.show();
			}
			
			DisableBodyScroll();
			
			//scroll to top of page
			if($(window).width() > 768) {
				let previouslyCreatedSmoother = ScrollSmoother.get();	
				previouslyCreatedSmoother.scrollTo('6', false);
				
				ScrollTrigger.refresh();
			} else {
				$('html, body').animate({
					scrollTop: 6
				}, {
					duration: 1,
					easing: 'easeInOutCubic'
				});	
			}
			
			//then fade the selected ones back in
			setTimeout(function() {
				$('.universe-block').removeClass('hidden');
				
				EnableBodyScroll();
			}, 50);
			
		}, 600);
		
		//hide intro statement
		if(!$('.fixed-intro-statement').hasClass('hidden')) {
			$('body.universe .fixed-intro-statement').addClass('hidden');
			$('body.universe .universe-filter-menu').addClass('visible');
		}
		
	});
	
	//Scroll back to top of page
	$(document).on('click', '.back-to-top', function(e) {		
		
		//scroll to carousel
		if($(window).width() > 768) {
			let previouslyCreatedSmoother = ScrollSmoother.get();	
			previouslyCreatedSmoother.scrollTo(0, true);
		} else {
			$('html, body').animate({
				scrollTop: 0
			}, {
				duration: 800,
				easing: 'easeInOutCubic'
			});	
		}
		
	});
	
	jQuery('body').on('click', '.page-wrap#contact-page .button a', function (e) {
		if (/#/.test(this.href)) {
			var thisHref = $(this).attr('href');
			var topOfElement = $(thisHref).offset().top;
			
			if($(window).width() > 768) {
				let previouslyCreatedSmoother = ScrollSmoother.get();	
				previouslyCreatedSmoother.scrollTo(topOfElement, true);
			} else {
				$('html, body').animate({
					scrollTop: topOfElement
				}, {
					duration: 800,
					easing: 'easeInOutCubic'
				});	
			}
			
			e.preventDefault();
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
	
	//Media Lazyloading - delay slightly to avoid ScrollSmoother interference
	setTimeout(() => {
		mediaLazyloading();
	}, 50);
	
	//––SCROLL SMOOTHER START
	SmoothScroller();
	
	//––HOMEPAGE SPECIFIC
	if($('body').hasClass('home')) {
		const hasVisited = sessionStorage.getItem("homepageVisited") === "true";
		
		if (!hasVisited) {
			Homepage();
		} else {
			$('body').addClass("loader-has-run");
		}

	}
	
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
	
	//––HIGHLIGHTS SECTION CAROUSEL
	if ($(".highlights-section-carousel").length) {
		HighlightsSectionCarousel();
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
	
	//––ANIMATED NUMBER TRIGGER
	if ($(".animated-number-wrapper").length) {
		AnimatedNumberTrigger();
	}
	
	//––OPACITY SCROLL TRIGGER
	if ($(".opacity-on-scroll").length) {
		OpacityScrollTrigger();
	}
	
	//––SHIFT SCROLL TRIGGER
	if ($(".shift-on-scroll").length) {
		ShiftScrollTrigger();
	}
	
	//––SOLID HEADER
	if(!$('body').hasClass('universe')) {
		SolidHeader();
	}
	
	//––DARK HEADER OVERRIDE TRIGGER
	if ($(".dark-header-override").length) {
		DarkHeaderOverride();
	}

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
	$('header').addClass('menu-opened-override');
	DisableBodyScroll();
}

//––MENU CLOSER

function MenuCloser() {
	
	$('.menu-opener, .menu-overlay').removeClass('opened');
	$('header').removeClass('menu-opened-override');
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

//––HOMEPAGE LOADING VIDEO FUNCTION

function HomepageLoadingVideoFunction() {
	var splashLeftSide = $('.page-wrap#home-page .splash-panel .side.left');
	var splashRightSide = $('.page-wrap#home-page .splash-panel .side.right');
	
	//––DESKTOP SPECIFIC
	if($(window).width() > 768) {
		const desktopLoadingVideo = document.getElementById('home-loading-video_desktop');

		desktopLoadingVideo.play().then(() => {
			// Playback started successfully
			setTimeout(() => {
				splashLeftSide.addClass('visible');
			}, 5000);
		
			setTimeout(() => {
				splashRightSide.addClass('visible');
			}, 5550);
			
			//unblur content into view
			setTimeout(() => {
				
				//scale down logo on desktop
				$('.page-wrap#home-page .splash-panel .logo-wrap').addClass('desktop-scaled');
				
				$('body.home').addClass('unblurred');
				
				setTimeout(() => {
					EnableBodyScroll();
					
					sessionStorage.setItem("homepageVisited", "true");
					$('body').addClass("loader-has-run");
					
				}, 1200);
				
			}, 6400);
		
		//if error (e.g. low power mode) don't run animation	
		}).catch(error => {
			console.error('Video failed to play:', error);
			
			EnableBodyScroll();
			
			sessionStorage.setItem("homepageVisited", "true");
			$('body').addClass("loader-has-run");
			
		});
		
	//––MOBILE SPECIFIC
	} else {
		const mobileLoadingVideo = document.getElementById('home-loading-video_mobile');
		
		mobileLoadingVideo.play().then(() => {
			// Playback started successfully
			setTimeout(() => {
				splashLeftSide.addClass('visible');
			}, 4200);
		
			setTimeout(() => {
				splashRightSide.addClass('visible');
			}, 4900);
			
			//unblur content into view
			setTimeout(() => {
				$('body.home').addClass('unblurred');
				
				setTimeout(function() {
					EnableBodyScroll();
					
					sessionStorage.setItem("homepageVisited", "true");
					$('body').addClass("loader-has-run");
					
				}, 1200);
				
			}, 5500);
		
		//if error (e.g. low power mode) don't run animation	
		}).catch(error => {
			console.error('Video failed to play:', error);
			
			EnableBodyScroll();
			
			sessionStorage.setItem("homepageVisited", "true");
			$('body').addClass("loader-has-run");
			
		});
		
	}
	
}

//––HOMEPAGE SPECIFIC FUNCTION

function Homepage() {
	
	//Disable Scroll
	DisableBodyScroll();
	
	//scroll to top of page
	if($(window).width() > 768) {
		let previouslyCreatedSmoother = ScrollSmoother.get();	
		previouslyCreatedSmoother.scrollTo('0', true);
	} else {
		$('html, body').animate({
			scrollTop: 0
		}, {
			duration: 1,
			easing: 'easeInOutCubic'
		});	
	}
		
}

//––CAROUSEL SECTION CAROUSEL

function CarouselSectionCarousel() {
	
	if($(window).width() > 768) {
		var draggableVar = false;
	} else {
		var draggableVar = true;
	}
	
	$('.carousel-section-carousel').each(function () {
	
		var $carouselSectionCarousel = $(this);
		$carouselSectionCarousel.flickity({
			cellSelector: '.carousel-slide',
			fade: false,
			autoPlay: false,
			pauseAutoPlayOnHover: false,
			wrapAround: true,
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
		var flktyCarousels = $carouselSectionCarousel.data('flickity');
		
		//hide arrows if there aren't many slides
		var totalSlides = flktyCarousels.slides.length;
		if(totalSlides < 4) {
			$carouselSectionCarousel.addClass('hide-nav');
		}
		
		//Lazyload Function
		$carouselSectionCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
			$(cellElement).addClass('image-loaded');
		});
		
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
	
	// Add 'image-loaded' class on lazyload
	$timelineCarousel.on('lazyLoad.flickity', function(event, cellElement) {
		$(cellElement).addClass('image-loaded');
	});
	
	// Manually check if navigation buttons should be disabled
	function updateButtonStates() {
		const flkty = $timelineCarousel.data('flickity');
		if (!flkty) return;
	
		const $prevButton = $timelineCarousel.find('.flickity-prev-next-button.previous');
		const $nextButton = $timelineCarousel.find('.flickity-prev-next-button.next');
		
		if (flkty.slides.length <= 1 || flkty.size.innerWidth >= flkty.slideableWidth) {
			$prevButton.attr('disabled', 'true');
			$nextButton.attr('disabled', 'true');
		} else {
			$prevButton.removeAttr('disabled');
			$nextButton.removeAttr('disabled');
		}
	}
	
	$timelineCarousel.on( 'select.flickity', function( event, index ) {
		updateButtonStates();
	});
	
}

//––CAPABILITIES CAROUSEL

function TabbedCarousel() {
	
	if($(window).width() > 768) {
		var adaptHeightVar = false;
		var draggableVar = false;
	} else {
		var adaptHeightVar = true;
		var draggableVar = true;
	}
	
	var $TabbedCarousel = $('.tabbed-carousel');	
	$TabbedCarousel.flickity({
		cellSelector: '.carousel-slide',
		fade: true,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: true,
		draggable: draggableVar,
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
	
	// Hook into Isotope's layout complete event
	$galleryGrid.on('arrangeComplete', function() {
		// Refresh ScrollTrigger after Isotope layout
		ScrollTrigger.refresh();
	});
	
	$galleryGrid.on('layoutComplete', function() {
		ScrollTrigger.refresh();
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
	
	//Click to go to prev
	$( ".gallery-lightbox-carousel .gallery-lightbox-slide .gallery-lightbox-img img.prev-arrow" ).on( "click", function() {
		
		$galleryLightboxCarousel.flickity('previous');
		
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

//––HIGHLIGHTS SECTION CAROUSEL

function HighlightsSectionCarousel() {
	
	var $highlightsSectionCarousel = $('.highlights-section-carousel');
	$highlightsSectionCarousel.flickity({
		cellSelector: '.carousel-slide',
		fade: true,
		autoPlay: false,
		pauseAutoPlayOnHover: false,
		wrapAround: true,
		draggable: false,
		cellAlign: 'left',
		lazyLoad: 2,
		imagesLoaded: true,
		adaptiveHeight: false,
		prevNextButtons: true,
		setGallerySize: false,
		pageDots: false,
		contain: true,
		accessibility: false,
		arrowShape: 'M 6.1,50L53.1,3.1l-2.6-2.6L.9,50l49.6,49.5,2.6-2.6L6.1,50 Z'
	});
	
	//Lazyload Function
	$highlightsSectionCarousel.on( 'lazyLoad.flickity', function( event, cellElement ) {
		$(cellElement).addClass('image-loaded');
	});
	
}

//––UNIVERSE FUNCTIONS

function Universe() {
	
	ScrollTrigger.create({
		trigger: 'body.universe',
		start: "5 top",
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
		threshold: 800, // Reduced from 1200 to load closer to viewport
		callback_loaded: (el) => {
			
			// Ensure the element is fully loaded before hiding overlay
			const $el = $(el);
			const $loadingOverlay = $el.siblings('.loading-overlay').add($el.children('.loading-overlay'));
			const $videoPlaceholder = $el.siblings('.video-placeholder').add($el.children('.video-placeholder'));
			
			// Force a small delay to ensure the image/video is actually rendered
			requestAnimationFrame(() => {
				// Hide loading overlay with increased timeout
				setTimeout(function() {
					$loadingOverlay.addClass('hidden');
				}, 100); // Increased from 30ms to 100ms
				
				// Hide video placeholder with increased timeout
				setTimeout(function() {
					$videoPlaceholder.addClass('hidden');
				}, 200); // Increased from 150ms to 200ms
			});
			
			//HOME LOADING VIDEO SPECIFICS
			if($el.hasClass('home-loading-video')) {
				const hasVisited = sessionStorage.getItem("homepageVisited") === "true";
				
				if (!hasVisited) {
					HomepageLoadingVideoFunction();
				}
				
			}
			
		},
		callback_error: (el) => {
			// Handle loading errors by still hiding the overlay
			const $el = $(el);
			const $loadingOverlay = $el.siblings('.loading-overlay').add($el.children('.loading-overlay'));
			const $videoPlaceholder = $el.siblings('.video-placeholder').add($el.children('.video-placeholder'));
			
			setTimeout(function() {
				$loadingOverlay.addClass('hidden');
				$videoPlaceholder.addClass('hidden');
			}, 200);
		}
	});
	
}

//––SOLID HEADER

function SolidHeader() {
	
	if ($(".dark-header-override").length) {
		
		ScrollTrigger.create({
			trigger: '.dark-header-override',
			start: "-50 top",
			end: "110% bottom",
			pin: false,
			pinSpacing:false,
			markers: false,
			onEnter: () => {
				$('header').addClass('solid-header');
			},
			onLeave: () => {
			},
			onLeaveBack: () => {
			},
			onEnterBack: () => {
				$('header').removeClass('solid-header');
			}
		});
		
	} else {
	
		ScrollTrigger.create({
			trigger: 'body',
			start: "2 top",
			end: "110% bottom",
			pin: false,
			pinSpacing:false,
			markers: false,
			onEnter: () => {
				$('header').addClass('solid-header');
			},
			onLeave: () => {
				$('header').removeClass('solid-header');
			},
			onLeaveBack: () => {
				$('header').removeClass('solid-header');
			},
			onEnterBack: () => {
				$('header').addClass('solid-header');
			}
		});
	
	}
	
}

//––DARK HEADER OVERRIDE

function DarkHeaderOverride() {
	
	ScrollTrigger.create({
		trigger: '.dark-header-override',
		start: "-50 top",
		end: "110% bottom",
		pin: false,
		pinSpacing:false,
		markers: false,
		onEnter: () => {
			$('header').addClass('dark-header-override');
		},
		onLeave: () => {},
		onLeaveBack: () => {},
		onEnterBack: () => {
			$('header').removeClass('dark-header-override');
		}
	});
	
}

//––ANIMATED NUMBER TRIGGER

function AnimatedNumberTrigger() {
	
	ScrollTrigger.create({
		trigger: '.facts-panel',
		start: 'top 80%',
		end: 'bottom 80%',
		onEnter: () => scrambleThenCount(),
		markers: false
	});
	
}

function scrambleThenCount(duration = 2.5) {
	$('.animated-number').each(function(_, el) {
		const $el = $(el);
		var extraText = $(this).siblings('.extra-text');
		if ($el.data('animated')) return;

		const finalValue = parseInt($el.data('stat'), 10);
		const digits = finalValue.toString().length;

		$el.data('animated', true);

		let progress = { value: 0 };
		let lastUpdate = 0;

		// Animate progress with ease
		gsap.to(progress, {
			value: 1,
			duration: duration,
			ease: "expo.inOut", // creates a slow finish
			onUpdate: () => {
				const now = performance.now();
				const timeSinceLast = now - lastUpdate;

				// Flicker frequency modulated by current progress
				// Starts fast, slows near the end
				const flickerInterval = gsap.utils.mapRange(0, 1, 30, 200, progress.value);

				if (timeSinceLast >= flickerInterval) {
					let scrambled = '';
					for (let i = 0; i < digits; i++) {
						scrambled += Math.floor(Math.random() * 10);
					}
					$el.text(scrambled);
					lastUpdate = now;
				}
			},
			onComplete: () => {
				$el.text(finalValue);
				$el.siblings('.extra-text').addClass('visible');
			}
		});
	});
}

//––OPACITY ON SCROLL

function OpacityScrollTrigger() {
	
	gsap.utils.toArray(".opacity-on-scroll").forEach(function(elem) {
	
		var opacityScrollElement = elem;
		
		ScrollTrigger.create({
			trigger: elem,
			start:'top 85%',
			end:'bottom 85%',
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
			start:'top 85%',
			end:'bottom 85%',
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

//ENABLE BODY SCROLL

function EnableBodyScroll() {
	$("body").css({"position": "static", "overflow": "auto"});
}

//DISABLE BODY SCROLL

function DisableBodyScroll() {
	$("body").css({"position": "sticky", "overflow": "hidden"});
}

})(jQuery);