(function($) {
    'use strict';

    class PortfolioGalleryLightbox {
        
        constructor() {
            this.lightboxOpen = false;
            this.swiperInstance = null;
            this.currentVideos = [];
            this.init();
        }
        
        init() {
            this.createLightboxHTML();
            this.bindEvents();
        }
        
        /**
         * Create lightbox HTML structure
         */
        createLightboxHTML() {
            if ($('#portfolio-gallery-lightbox').length > 0) {
                return;
            }
            
            const lightboxHTML = `
                <div id="portfolio-gallery-lightbox" class="pgl-lightbox" style="display: none;">
                    <div class="pgl-overlay"></div>
                    <div class="pgl-content">
                        <button class="pgl-close" aria-label="Close gallery">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        
                        <div class="pgl-loader">
                            <div class="pgl-spinner"></div>
                            <p class="pgl-loader-text">${portfolioGalleryAjax.loader_text}</p>
                        </div>
                        
                        <div class="pgl-slider-wrapper" style="display: none;">
                            <div class="swiper pgl-swiper">
                                <div class="swiper-wrapper"></div>
                                <div class="swiper-button-prev"></div>
                                <div class="swiper-button-next"></div>
                            </div>
                        </div>
                        
                        <div class="pgl-error" style="display: none;">
                            <p class="pgl-error-message"></p>
                        </div>
                    </div>
                </div>
            `;
            
            $('body').append(lightboxHTML);
        }
        
        /**
         * Bind click events to trigger buttons and loop items
         */
        bindEvents() {
            const self = this;
            
            // Handle trigger button clicks (shortcode)
            $(document).on('click', '.portfolio-gallery-trigger', function(e) {
                e.preventDefault();
                const postId = $(this).data('post-id');
                if (postId) {
                    self.openLightbox(postId);
                }
            });
            
            // Handle loop item clicks
            $(document).on('click', '.portfolio-loop-item', function(e) {
                e.preventDefault();
                
                if ($(e.target).closest('a, button, input, select, textarea').length > 0) {
                    return;
                }
                
                const postId = $(this).data('post-id');
                if (postId) {
                    self.openLightbox(postId);
                }
            });
            
            // Alternative selector
            $(document).on('click', '[data-portfolio-id]', function(e) {
                if ($(this).hasClass('portfolio-loop-item')) {
                    return;
                }
                
                e.preventDefault();
                
                if ($(e.target).closest('a, button, input, select, textarea').length > 0) {
                    return;
                }
                
                const postId = $(this).data('portfolio-id');
                if (postId) {
                    self.openLightbox(postId);
                }
            });
            
            // Handle close button
            $(document).on('click', '.pgl-close', function(e) {
                e.preventDefault();
                self.closeLightbox();
            });
            
            // Handle overlay click
            $(document).on('click', '.pgl-overlay', function(e) {
                e.preventDefault();
                self.closeLightbox();
            });
            
            // Handle ESC key
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' && self.lightboxOpen) {
                    self.closeLightbox();
                }
            });
        }
        
        /**
         * Open lightbox and load gallery via AJAX
         */
        openLightbox(postId) {
            const self = this;
            const $lightbox = $('#portfolio-gallery-lightbox');
            
            $lightbox.fadeIn(300);
            $('.pgl-loader').show();
            $('.pgl-slider-wrapper').hide();
            $('.pgl-error').hide();
            $('body').css('overflow', 'hidden');
            
            this.lightboxOpen = true;
            
            $.ajax({
                url: portfolioGalleryAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_portfolio_gallery',
                    post_id: postId,
                    security: portfolioGalleryAjax.nonce
                },
                success: function(response) {
                    if (response.success && response.data.items) {
                        self.initializeSlider(response.data.items);
                    } else {
                        self.showError(response.data.message || 'Failed to load gallery');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    self.showError('An error occurred while loading the gallery. Please try again.');
                }
            });
        }
        
        /**
         * Close lightbox
         */
        closeLightbox() {
            const $lightbox = $('#portfolio-gallery-lightbox');
            
            // Pause all videos
            this.pauseAllVideos();
            
            $lightbox.fadeOut(300, () => {
                if (this.swiperInstance) {
                    this.swiperInstance.destroy(true, true);
                    this.swiperInstance = null;
                }
                
                $('.swiper-wrapper').empty();
                this.currentVideos = [];
                $('body').css('overflow', '');
            });
            
            this.lightboxOpen = false;
        }
        
        /**
         * Show error message
         */
        showError(message) {
            $('.pgl-loader').hide();
            $('.pgl-error-message').text(message);
            $('.pgl-error').show();
        }
        
        /**
         * Pause all videos
         */
        pauseAllVideos() {
            this.currentVideos.forEach(video => {
                if (video && !video.paused) {
                    video.pause();
                }
            });
        }
        
        /**
         * Initialize Swiper slider with images and videos
         */
        initializeSlider(items) {
            const self = this;
            const $swiperWrapper = $('.swiper-wrapper');
            
            $swiperWrapper.empty();
            this.currentVideos = [];
            
            // Build all slides
            items.forEach((item, index) => {
                let slideHTML = '';
                
                if (item.type === 'video') {
                    slideHTML = `
                        <div class="swiper-slide" data-slide-type="video">
                            <div class="pgl-video-container">
                                <video 
                                    class="pgl-video" 
                                    controls 
                                    playsinline
                                    preload="metadata"
                                    data-index="${index}"
                                >
                                    <source src="${item.url}" type="${item.mime_type}">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            ${item.caption ? `<div class="pgl-caption">${this.escapeHtml(item.caption)}</div>` : ''}
                        </div>
                    `;
                } else {
                    // Load all images immediately - no lazy loading
                    slideHTML = `
                        <div class="swiper-slide" data-slide-type="image">
                            <div class="pgl-image-container">
                                <img 
                                    src="${item.large}" 
                                    alt="${this.escapeHtml(item.alt)}" 
                                    class="pgl-image"
                                    data-full-src="${item.full}"
                                    data-width="${item.width}"
                                    data-height="${item.height}"
                                />
                            </div>
                            ${item.caption ? `<div class="pgl-caption">${this.escapeHtml(item.caption)}</div>` : ''}
                        </div>
                    `;
                }
                
                $swiperWrapper.append(slideHTML);
            });
            
            $('.pgl-loader').hide();
            $('.pgl-slider-wrapper').show();
            
            // Store video elements
            $('.pgl-video').each(function() {
                self.currentVideos.push(this);
            });
            
            // Initialize Swiper
            this.swiperInstance = new Swiper('.pgl-swiper', {
                loop: items.length > 1,
                speed: 600,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: false
                },
                on: {
                    slideChange: function(swiper) {
                        self.handleSlideChange(swiper);
                    },
                    slideChangeTransitionEnd: function(swiper) {
                        self.autoplayVideo(swiper);
                    }
                }
            });
            
            // Autoplay first video if it's a video
            setTimeout(() => {
                this.autoplayVideo(this.swiperInstance);
            }, 100);
            
            // Add click handler for images to open PhotoSwipe
            $(document).on('click', '.pgl-image', function(e) {
                const imageItems = items.filter(item => item.type === 'image');
                const $slide = $(this).closest('.swiper-slide');
                const allSlides = $('.swiper-slide');
                const clickedIndex = allSlides.index($slide);
                
                // Find the actual index in image-only array
                let imageOnlyIndex = 0;
                let foundIndex = 0;
                for (let i = 0; i <= clickedIndex; i++) {
                    const $currentSlide = $(allSlides[i]);
                    if ($currentSlide.data('slide-type') === 'image') {
                        if (i === clickedIndex) {
                            foundIndex = imageOnlyIndex;
                        }
                        imageOnlyIndex++;
                    }
                }
                
                self.openPhotoSwipe(imageItems, foundIndex);
            });
        }
        
        /**
         * Handle slide change - pause videos
         */
        handleSlideChange(swiper) {
            this.pauseAllVideos();
        }
        
        /**
         * Autoplay video on active slide
         */
        autoplayVideo(swiper) {
            if (!swiper) return;
            
            const $activeSlide = $(swiper.slides[swiper.activeIndex]);
            const slideType = $activeSlide.data('slide-type');
            
            if (slideType === 'video') {
                const video = $activeSlide.find('.pgl-video')[0];
                if (video) {
                    video.play().catch(err => {
                        console.log('Video autoplay prevented:', err);
                    });
                }
            }
        }
        
        /**
         * Open PhotoSwipe for full-screen image viewing
         */
        openPhotoSwipe(images, startIndex) {
            const items = images.map(image => ({
                src: image.full,
                width: image.width,
                height: image.height,
                alt: image.alt,
                caption: image.caption
            }));
            
            const options = {
                dataSource: items,
                index: startIndex,
                bgOpacity: 0.95,
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                showHideAnimationType: 'fade',
                closeOnVerticalDrag: true,
                pinchToClose: true,
                closeTitle: 'Close (Esc)',
                zoomTitle: 'Zoom',
                arrowPrevTitle: 'Previous',
                arrowNextTitle: 'Next',
                errorMsg: 'The image cannot be loaded'
            };
            
            const pswp = new PhotoSwipe(options);
            const self = this;
            
            pswp.on('close', function() {
                if (self.swiperInstance) {
                    // Find the slide index that corresponds to this image
                    const slides = $('.swiper-slide');
                    let targetSlideIndex = 0;
                    let imageCount = 0;
                    
                    for (let i = 0; i < slides.length; i++) {
                        if ($(slides[i]).data('slide-type') === 'image') {
                            if (imageCount === pswp.currIndex) {
                                targetSlideIndex = i;
                                break;
                            }
                            imageCount++;
                        }
                    }
                    
                    self.swiperInstance.slideTo(targetSlideIndex, 0, false);
                }
            });
            
            pswp.init();
        }
        
        /**
         * Escape HTML to prevent XSS
         */
        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
    
    // Initialize on document ready
    $(document).ready(function() {
        new PortfolioGalleryLightbox();
    });
    
})(jQuery);