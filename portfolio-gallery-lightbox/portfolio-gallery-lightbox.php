<?php
/**
 * Plugin Name: Portfolio Gallery Lightbox
 * Plugin URI: https://github.com/Indranil-Mondal
 * Description: Ajax-powered lightbox with Swiper slider for Elementor loop grid portfolio galleries (Images & Videos)
 * Version: 1.1.0
 * Author: Indranil Mondal
 * Author URI: https://github.com/Indranil-Mondal
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: portfolio-gallery-lightbox
 */

if (!defined('ABSPATH')) {
    exit;
}

class Portfolio_Gallery_Lightbox {

    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_get_portfolio_gallery', array($this, 'ajax_get_portfolio_gallery'));
        add_action('wp_ajax_nopriv_get_portfolio_gallery', array($this, 'ajax_get_portfolio_gallery'));
        add_shortcode('portfolio_gallery_trigger', array($this, 'gallery_trigger_shortcode'));
    }
    
    /**
     * Enqueue necessary scripts and styles
     */
    public function enqueue_scripts() {
        
        // Enqueue Swiper CSS
        wp_enqueue_style(
            'swiper-css',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            array(),
            '11.0.0'
        );
        
        // Enqueue PhotoSwipe CSS
        wp_enqueue_style(
            'photoswipe-css',
            'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css',
            array(),
            '5.4.4'
        );
        
        // Enqueue custom CSS
        wp_enqueue_style(
            'portfolio-gallery-lightbox-css',
            plugin_dir_url(__FILE__) . 'assets/css/portfolio-gallery-lightbox.css',
            array('swiper-css', 'photoswipe-css'),
            '1.1.0'
        );
        
        // Enqueue Swiper JS
        wp_enqueue_script(
            'swiper-js',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
            array(),
            '11.0.0',
            true
        );
        
        // Enqueue PhotoSwipe JS
        wp_enqueue_script(
            'photoswipe-js',
            'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.umd.min.js',
            array(),
            '5.4.4',
            true
        );
        
        // Enqueue PhotoSwipe Lightbox
        wp_enqueue_script(
            'photoswipe-lightbox-js',
            'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.umd.min.js',
            array('photoswipe-js'),
            '5.4.4',
            true
        );
        
        // Enqueue custom JS
        wp_enqueue_script(
            'portfolio-gallery-lightbox-js',
            plugin_dir_url(__FILE__) . 'assets/js/portfolio-gallery-lightbox.js',
            array('jquery', 'swiper-js', 'photoswipe-lightbox-js'),
            '1.1.0',
            true
        );
        
        // Localize script with ajax url and nonce
        wp_localize_script(
            'portfolio-gallery-lightbox-js',
            'portfolioGalleryAjax',
            array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('portfolio_gallery_nonce'),
                'loader_text' => __('Loading gallery...', 'portfolio-gallery-lightbox')
            )
        );
    }
    
    /**
     * Check if file is a video based on extension
     */
    private function is_video($url) {
        $video_extensions = array('mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'm4v');
        $extension = strtolower(pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION));
        return in_array($extension, $video_extensions);
    }
    
    /**
     * Get video mime type
     */
    private function get_video_mime_type($url) {
        $extension = strtolower(pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION));
        $mime_types = array(
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'ogg' => 'video/ogg',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'wmv' => 'video/x-ms-wmv',
            'flv' => 'video/x-flv',
            'm4v' => 'video/mp4'
        );
        return isset($mime_types[$extension]) ? $mime_types[$extension] : 'video/mp4';
    }
    
    /**
     * AJAX handler to get portfolio gallery images and videos
     */
    public function ajax_get_portfolio_gallery() {
        
        // Verify nonce for security
        check_ajax_referer('portfolio_gallery_nonce', 'security');
        
        // Get and sanitize post ID
        $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
        
        if (!$post_id) {
            wp_send_json_error(array(
                'message' => __('Invalid post ID', 'portfolio-gallery-lightbox')
            ));
        }
        
        // Verify post exists and is portfolio type
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'portfolio') {
            wp_send_json_error(array(
                'message' => __('Portfolio item not found', 'portfolio-gallery-lightbox')
            ));
        }
        
        // Get ACF gallery field
        $gallery_items = get_field('portfolio_gallery', $post_id);
        
        if (!$gallery_items || !is_array($gallery_items)) {
            wp_send_json_error(array(
                'message' => __('No gallery items found', 'portfolio-gallery-lightbox')
            ));
        }
        
        // Prepare items data
        $items_data = array();
        foreach ($gallery_items as $item_url) {
            
            // Check if it's a video
            if ($this->is_video($item_url)) {
                // Handle video
                $video_id = attachment_url_to_postid($item_url);
                $video_title = '';
                $video_caption = '';
                
                if ($video_id) {
                    $video_title = get_the_title($video_id);
                    $video_caption = wp_get_attachment_caption($video_id);
                }
                
                $items_data[] = array(
                    'type' => 'video',
                    'id' => $video_id ? $video_id : 0,
                    'url' => $item_url,
                    'mime_type' => $this->get_video_mime_type($item_url),
                    'title' => $video_title,
                    'caption' => $video_caption
                );
            } else {
                // Handle image
                $image_id = attachment_url_to_postid($item_url);
                
                if ($image_id) {
                    $image_meta = wp_get_attachment_metadata($image_id);
                    $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                    $image_title = get_the_title($image_id);
                    $image_caption = wp_get_attachment_caption($image_id);
                    
                    $full_url = wp_get_attachment_image_url($image_id, 'full');
                    $large_url = wp_get_attachment_image_url($image_id, 'large');
                    $medium_url = wp_get_attachment_image_url($image_id, 'medium');
                    
                    $items_data[] = array(
                        'type' => 'image',
                        'id' => $image_id,
                        'full' => $full_url ? $full_url : $item_url,
                        'large' => $large_url ? $large_url : $full_url,
                        'medium' => $medium_url ? $medium_url : $large_url,
                        'width' => isset($image_meta['width']) ? $image_meta['width'] : 1920,
                        'height' => isset($image_meta['height']) ? $image_meta['height'] : 1080,
                        'alt' => $image_alt ? $image_alt : $image_title,
                        'title' => $image_title,
                        'caption' => $image_caption
                    );
                } else {
                    $items_data[] = array(
                        'type' => 'image',
                        'id' => 0,
                        'full' => $item_url,
                        'large' => $item_url,
                        'medium' => $item_url,
                        'width' => 1920,
                        'height' => 1080,
                        'alt' => '',
                        'title' => '',
                        'caption' => ''
                    );
                }
            }
        }
        
        wp_send_json_success(array(
            'items' => $items_data,
            'post_title' => get_the_title($post_id)
        ));
    }
    
    /**
     * Shortcode to create gallery trigger button
     * Usage: [portfolio_gallery_trigger]
     */
    public function gallery_trigger_shortcode($atts) {
        
        $atts = shortcode_atts(array(
            'text' => __('View Gallery', 'portfolio-gallery-lightbox'),
            'class' => 'portfolio-gallery-trigger',
        ), $atts, 'portfolio_gallery_trigger');
        
        $post_id = get_the_ID();
        
        if (!$post_id) {
            return '';
        }
        
        // Check if post has gallery
        $gallery = get_field('portfolio_gallery', $post_id);
        if (!$gallery || !is_array($gallery) || empty($gallery)) {
            return '';
        }
        
        $button_class = esc_attr($atts['class']);
        $button_text = esc_html($atts['text']);
        
        return sprintf(
            '<button type="button" class="%s" data-post-id="%d">%s</button>',
            $button_class,
            $post_id,
            $button_text
        );
    }
}

// Initialize plugin
Portfolio_Gallery_Lightbox::get_instance();