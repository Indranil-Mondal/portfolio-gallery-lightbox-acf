# Portfolio Gallery Lightbox - Installation & Usage Guide

## Overview
This plugin creates an AJAX-powered lightbox with Swiper slider for Elementor loop grid portfolio galleries. It uses PhotoSwipe v5 for full-screen image viewing and includes lazy loading, loading indicators, and responsive controls.

## Features
- AJAX request to load gallery images dynamically
- Swiper.js slider with navigation arrows
- PhotoSwipe v5 lightbox for full-screen viewing
- Lazy loading after first 3 images
- Loading indicator with spinner
- Security: WordPress nonces for AJAX protection
- Fully responsive
- Keyboard navigation support
- Close button with ESC key support

---

## Installation Instructions

### Option 1: Plugin Installation (Recommended)

#### Step 1: Create Plugin Directory
1. Connect to your WordPress site via FTP or cPanel File Manager
2. Navigate to `/wp-content/plugins/`
3. Create a new folder named `portfolio-gallery-lightbox`

#### Step 2: Upload Plugin Files
Upload the following files to `/wp-content/plugins/portfolio-gallery-lightbox/`:

```
portfolio-gallery-lightbox/
├── portfolio-gallery-lightbox.php (main plugin file)
├── assets/
│   ├── css/
│   │   └── portfolio-gallery-lightbox.css
│   └── js/
│       └── portfolio-gallery-lightbox.js
└── README.md (this file)
```

#### Step 3: Create Directory Structure
If the `assets`, `css`, and `js` folders don't exist, create them:
- `/wp-content/plugins/portfolio-gallery-lightbox/assets/`
- `/wp-content/plugins/portfolio-gallery-lightbox/assets/css/`
- `/wp-content/plugins/portfolio-gallery-lightbox/assets/js/`

#### Step 4: Activate Plugin
1. Go to WordPress Admin Dashboard
2. Navigate to **Plugins > Installed Plugins**
3. Find **Portfolio Gallery Lightbox**
4. Click **Activate**

---

### Option 2: Functions.php Implementation

If you prefer not to use a plugin, see the "ALTERNATIVE_FUNCTIONS.txt" file for code to paste directly into your theme's functions.php.

---

## Setup Instructions

### Step 1: Verify ACF Gallery Field
Ensure your ACF gallery field is properly configured:
- **Field Name**: `portfolio_gallery`
- **Field Type**: Gallery
- **Return Format**: URL (or Image Array - the plugin handles both)
- **Post Type**: `portfolio`

### Step 2: Configure Elementor Loop Grid
1. Edit your Elementor page with the Loop Grid widget
2. Configure Loop Grid settings:
   - **Source**: Custom Query
   - **Post Type**: portfolio
   - **Items Per Page**: Set as needed

### Step 3: Add Trigger Button to Loop Template
1. Go to **Templates > Theme Builder > Loop**
2. Edit your loop item template
3. Add a **Button** or **HTML** widget where you want the gallery trigger
4. In the button settings, add the shortcode:

   ```
   [portfolio_gallery_trigger]
   ```

   **Or with custom text:**
   ```
   [portfolio_gallery_trigger text="View Photos"]
   ```

5. Optionally, add a custom CSS class to the button if needed (default is `portfolio-gallery-trigger`)

### Step 4: Add CSS Class (Optional)
If you want to customize the button appearance:
1. In Elementor, select the button widget
2. Go to **Advanced > CSS Classes**
3. Add your custom class (e.g., `my-custom-gallery-btn`)
4. Use this class in your custom CSS

---

## Usage

### Basic Usage
Once installed and configured, the plugin works automatically:

1. User clicks the button with `[portfolio_gallery_trigger]` shortcode
2. AJAX request is sent to WordPress backend
3. Loading indicator appears
4. Gallery images are loaded from ACF field
5. Swiper slider appears with navigation arrows
6. Click on any image to open PhotoSwipe full-screen view
7. First 3 images load immediately, remaining images lazy-load

### Shortcode Parameters

#### Default Usage:
```
[portfolio_gallery_trigger]
```

#### Custom Button Text:
```
[portfolio_gallery_trigger text="View Gallery"]
```

#### Custom CSS Class:
```
[portfolio_gallery_trigger text="View Photos" class="my-button-class"]
```

---

## User Controls

### Slider Navigation:
- **Previous/Next Arrows**: Click arrows to navigate
- **Keyboard**: Left/Right arrow keys
- **Touch**: Swipe on mobile devices

### Lightbox Controls:
- **Close**: Click X button in top-right
- **ESC Key**: Press ESC to close
- **Click Overlay**: Click outside slider to close
- **Click Image**: Click any image to open PhotoSwipe full-screen mode

### PhotoSwipe Controls:
- **Zoom**: Pinch or double-tap on mobile, scroll on desktop
- **Navigate**: Swipe or arrow keys
- **Close**: Click X, press ESC, or swipe down

---

## Customization

### Styling the Trigger Button
Add custom CSS in **Appearance > Customize > Additional CSS**:

```css
.portfolio-gallery-trigger {
    background: #your-color;
    color: #your-text-color;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 18px;
}

.portfolio-gallery-trigger:hover {
    background: #your-hover-color;
}
```

### Customizing Lightbox Appearance
Edit `/assets/css/portfolio-gallery-lightbox.css` or add custom CSS:

```css
/* Change overlay opacity */
.pgl-overlay {
    background: rgba(0, 0, 0, 0.98);
}

/* Change navigation button style */
.pgl-swiper .swiper-button-prev,
.pgl-swiper .swiper-button-next {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
}

/* Change close button position */
.pgl-close {
    top: 20px;
    right: 20px;
}
```

### Modifying Lazy Load Threshold
To change how many images load immediately (default is 3), edit line in `portfolio-gallery-lightbox.js`:

Find:
```javascript
const lazyClass = index >= 3 ? 'swiper-lazy' : '';
```

Change `3` to your desired number.

---

## Troubleshooting

### Gallery Button Not Appearing
**Problem**: The shortcode doesn't render a button.

**Solutions**:
1. Verify ACF field name is exactly `portfolio_gallery`
2. Ensure the gallery field has images
3. Check that you're on a portfolio post type
4. Clear Elementor cache: **Elementor > Tools > Regenerate CSS & Data**

### AJAX Request Fails
**Problem**: Loading indicator appears but gallery doesn't load.

**Solutions**:
1. Open browser console (F12) and check for errors
2. Verify nonce is being generated correctly
3. Check if AJAX URL is correct in browser console
4. Ensure WordPress AJAX is not blocked by security plugins
5. Check PHP error logs for server-side errors

### Images Not Loading
**Problem**: Slider appears but images don't load.

**Solutions**:
1. Verify ACF gallery field return format (URL or Array both work)
2. Check if images exist in media library
3. Verify image URLs are accessible
4. Check browser console for 404 errors
5. Clear WordPress cache

### Lightbox Won't Close
**Problem**: Close button doesn't work.

**Solutions**:
1. Check for JavaScript errors in console
2. Ensure jQuery is loaded
3. Check if other plugins are conflicting
4. Try pressing ESC key or clicking outside slider

### Styling Issues
**Problem**: Button or lightbox looks wrong.

**Solutions**:
1. Check if CSS file is loading (view page source)
2. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
3. Check for CSS conflicts with theme/plugins
4. Use browser inspector to identify conflicting styles
5. Add `!important` to your custom CSS if needed

### Mobile Issues
**Problem**: Lightbox not working on mobile.

**Solutions**:
1. Test on actual device, not just browser responsive mode
2. Check if touch events are being blocked
3. Verify mobile CSS is loading
4. Test with different mobile browsers

---

## Performance Optimization

### 1. Lazy Loading
The plugin automatically lazy-loads images after the first 3. To adjust:
- Edit `portfolio-gallery-lightbox.js`
- Find: `index >= 3`
- Change number as needed

### 2. Image Sizes
For better performance, use optimized image sizes:
- The plugin uses 'large' size for slider
- Full size only loads in PhotoSwipe
- Ensure WordPress generates proper image sizes

### 3. CDN Usage
The plugin loads Swiper and PhotoSwipe from CDN:
- Fast global delivery
- Cached across websites
- To use local copies, download libraries and update paths

### 4. Caching
Compatible with most caching plugins:
- Clear cache after installation
- Exclude AJAX endpoint if issues occur

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (latest)

---

## Security

### Nonce Verification
The plugin uses WordPress nonces to prevent CSRF attacks:
- Nonce is generated for each page load
- Verified on server before processing AJAX requests
- Expires after 12 hours (WordPress default)

### Input Sanitization
All user inputs are sanitized:
- Post IDs are validated with `absint()`
- Image URLs are escaped properly
- HTML output is escaped to prevent XSS

### Permission Checks
- Works for both logged-in and logged-out users
- No special permissions required for viewing
- Post type verification ensures only portfolio items load

---

## Developer Hooks & Filters

### Filter: Modify Image Data
```php
add_filter('portfolio_gallery_lightbox_image_data', function($image_data, $image_id) {
    // Modify image data before sending to frontend
    $image_data['custom_field'] = get_post_meta($image_id, 'custom_field', true);
    return $image_data;
}, 10, 2);
```

### Filter: Modify AJAX Response
```php
add_filter('portfolio_gallery_lightbox_ajax_response', function($response, $post_id) {
    // Add custom data to AJAX response
    $response['custom_data'] = get_post_meta($post_id, 'custom_field', true);
    return $response;
}, 10, 2);
```

### Action: Before Gallery Load
```php
add_action('portfolio_gallery_lightbox_before_load', function($post_id) {
    // Execute code before gallery loads
    error_log('Gallery loading for post: ' . $post_id);
});
```

---

## Advanced Configuration

### Using Different ACF Field Name
If your gallery field is named differently, edit line in `portfolio-gallery-lightbox.php`:

Find:
```php
$gallery_images = get_field('portfolio_gallery', $post_id);
```

Change to:
```php
$gallery_images = get_field('your_field_name', $post_id);
```

### Using Different Post Type
If not using 'portfolio' post type, edit line in `portfolio-gallery-lightbox.php`:

Find:
```php
if (!$post || $post->post_type !== 'portfolio') {
```

Change to:
```php
if (!$post || $post->post_type !== 'your_post_type') {
```

### Multiple Gallery Fields
To support multiple gallery fields per post, modify the shortcode:

```php
[portfolio_gallery_trigger field="portfolio_gallery" text="Main Gallery"]
[portfolio_gallery_trigger field="behind_scenes" text="Behind the Scenes"]
```

Then update the PHP to accept field parameter.

---

## Updates & Maintenance

### Updating the Plugin
1. Backup your site
2. Upload new files via FTP
3. Clear all caches
4. Test functionality

### Checking for Conflicts
If issues arise after updating WordPress/plugins:
1. Disable other plugins temporarily
2. Switch to default theme
3. Test if lightbox works
4. Re-enable plugins one by one

---

## Support & Debugging

### Enable WordPress Debug Mode
Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check `/wp-content/debug.log` for errors.

### Browser Console
Press F12 and check Console tab for JavaScript errors.

### Network Tab
Check Network tab in browser dev tools to see AJAX requests/responses.

---

## Credits
- **Swiper.js**: https://swiperjs.com/ (v11)
- **PhotoSwipe**: https://photoswipe.com/ (v5.4.4)
- **Advanced Custom Fields**: https://www.advancedcustomfields.com/

---

## License
GPL v2 or later

---

## Changelog

### Version 1.0.0
- Initial release
- Swiper.js slider integration
- PhotoSwipe v5 lightbox
- AJAX gallery loading
- Lazy loading support
- Responsive design
- Security: Nonce verification
- Keyboard navigation
- Touch support

# CLICKABLE LOOP ITEM SETUP GUIDE

## Making Your Entire Elementor Loop Item Clickable

This guide shows you how to make the entire portfolio loop item clickable to open the gallery lightbox.

---

## Method 1: Using CSS Class (Recommended - Easiest)

### Step 1: Edit Your Loop Template
1. Go to **Templates > Theme Builder > Loop**
2. Click **Edit** on your portfolio loop template
3. Click on the **outermost container** of your loop item (the main container that wraps everything)

### Step 2: Add CSS Class
1. With the container selected, go to **Advanced** tab in the left panel
2. Scroll down to **CSS Classes** field
3. Add this class:
   ```
   portfolio-loop-item
   ```

### Step 3: Add Dynamic Data Attribute
1. Still in the **Advanced** tab
2. Scroll down to **Attributes**
3. Add a new attribute:
   - **Key**: `data-post-id`
   - **Value**: Click the dynamic tag icon and select **Post ID**

**It should look like this:**
```
Attribute Name: data-post-id
Attribute Value: [Dynamic] Post ID
```

### Step 4: Save and Test
1. Click **Update** to save your template
2. Go to your page with the loop grid
3. Click anywhere on a loop item
4. The gallery lightbox should open!

---

## Method 2: Using Data Attribute Only

If you prefer not to use the CSS class, you can use just the data attribute:

### Step 1: Edit Loop Template
1. Go to **Templates > Theme Builder > Loop**
2. Edit your loop template
3. Select the main container

### Step 2: Add Data Attribute
1. Go to **Advanced** tab
2. In **Attributes**, add:
   - **Key**: `data-portfolio-id`
   - **Value**: Click dynamic tag icon → **Post ID**

### Step 3: Save and Test
1. Update template
2. Click on loop item to test

---

## Method 3: Manual HTML (Advanced)

If you're using custom HTML in your loop:

```html
<div class="portfolio-loop-item" data-post-id="<?php echo get_the_ID(); ?>">
    <!-- Your loop item content -->
</div>
```

---

## Visual Guide: Where to Add the Class

```
Loop Template Structure:
┌─────────────────────────────────────┐
│ CONTAINER (Main)                    │  ← ADD CLASS HERE
│ ├─ Class: portfolio-loop-item       │
│ ├─ Attribute: data-post-id = [ID]   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Image Widget                 │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Heading Widget (Title)       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Text Widget (Excerpt)        │   │
│  └──────────────────────────────┘   │
│                                      │
└─────────────────────────────────────┘
```

---

## Important Notes

### Preventing Conflicts
The JavaScript automatically ignores clicks on:
- Links (`<a>` tags)
- Buttons
- Form inputs
- Select dropdowns
- Textareas

So if you have a "Read More" button or link in your loop item, clicking it will still work normally and won't trigger the lightbox.

### Hover Effect
When you add the `portfolio-loop-item` class, the item will automatically:
- Show a cursor pointer on hover
- Lift up slightly (translateY)
- Add a subtle shadow
- Add a slight overlay

You can customize this in the CSS file.

---

## Troubleshooting

### Problem: Loop Item Not Clickable

**Check:**
1. Class is added to the MAIN/OUTER container, not inner elements
2. Class name is exactly: `portfolio-loop-item` (no spaces, no typos)
3. Data attribute is: `data-post-id` with dynamic Post ID value
4. Template is saved and published
5. All caches are cleared

**To Debug:**
1. Right-click on a loop item on the frontend
2. Select "Inspect" or "Inspect Element"
3. Look for the container with class `portfolio-loop-item`
4. Check if it has `data-post-id="123"` (with a number)

### Problem: Clicking Opens Wrong Gallery

**Solution:**
Make sure the `data-post-id` attribute is using the dynamic **Post ID** tag, not a static number.

### Problem: Links Inside Loop Item Not Working

**This should work automatically**, but if you have issues:
1. The JavaScript ignores clicks on links/buttons
2. If still not working, check browser console for errors
3. Make sure you're using the updated JavaScript file

### Problem: No Hover Effect

**Solution:**
1. Make sure the CSS file is loaded
2. Clear browser cache (Ctrl+F5)
3. Check if other CSS is overriding the hover styles

---

## Customizing the Hover Effect

Add this to **Appearance > Customize > Additional CSS**:

### Change Lift Amount
```css
.portfolio-loop-item:hover {
    transform: translateY(-10px); /* Change -5px to -10px */
}
```

### Change Shadow
```css
.portfolio-loop-item:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}
```

### Remove Overlay Effect
```css
.portfolio-loop-item::after {
    display: none;
}
```

### Add Border on Hover
```css
.portfolio-loop-item {
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.portfolio-loop-item:hover {
    border-color: #000000;
}
```

### Change Cursor
```css
.portfolio-loop-item {
    cursor: zoom-in; /* or: grab, pointer, help */
}
```

---

## Alternative: Keep Links but Make Background Clickable

If you want links to work AND the background to open the gallery:

```css
.portfolio-loop-item a,
.portfolio-loop-item button {
    position: relative;
    z-index: 2;
}
```

This ensures links stay clickable while the background opens the gallery.

---

## Both Methods Work Together!

You can use BOTH approaches:
- ✅ Click on the loop item = Opens gallery
- ✅ Click on button with shortcode = Opens gallery

This gives you maximum flexibility!

---

## Testing Checklist

- [ ] Class `portfolio-loop-item` added to main container
- [ ] Attribute `data-post-id` added with dynamic Post ID value
- [ ] Template saved and published
- [ ] Elementor cache cleared (Tools > Regenerate CSS & Data)
- [ ] WordPress cache cleared (if using cache plugin)
- [ ] Browser cache cleared (Ctrl+F5)
- [ ] Tested clicking on loop item
- [ ] Gallery opens correctly
- [ ] Links/buttons inside loop still work
- [ ] Hover effect appears

---

## Quick Reference

**CSS Class to Add:**
```
portfolio-loop-item
```

**Data Attribute:**
```
Key: data-post-id
Value: [Dynamic] Post ID
```

**Where to Add:**
- Main/outer container of loop item
- In Elementor: Advanced > CSS Classes
- In Elementor: Advanced > Attributes

---

## Example Final HTML Output

When set up correctly, your loop item HTML should look like this:

```html
<div class="portfolio-loop-item elementor-element" data-post-id="123">
    <div class="portfolio-image">
        <img src="image.jpg" alt="Portfolio Item">
    </div>
    <h3 class="portfolio-title">Project Name</h3>
    <p class="portfolio-excerpt">Description here...</p>
</div>
```

Notice:
- `class="portfolio-loop-item"` on main container
- `data-post-id="123"` with actual post ID number

---

## Video Tutorial Steps

1. Open Elementor editor
2. Go to Templates > Theme Builder > Loop
3. Edit your loop template
4. Click Navigator icon (left sidebar, bottom)
5. Select the top-level container
6. Go to Advanced tab
7. Add CSS class: `portfolio-loop-item`
8. Scroll to Attributes section
9. Click "Add Item"
10. Key: `data-post-id`
11. Value: Click dynamic icon, select Post ID
12. Update template
13. View frontend and test

---

## Need Both Shortcode AND Clickable Item?

**Yes! Both work together:**

**Scenario 1:** User clicks anywhere on the item → Gallery opens
**Scenario 2:** User clicks the "View Gallery" button → Gallery opens

The JavaScript handles both cases automatically!

---

## Advanced: Multiple Click Areas

You can have multiple elements with the class:

```html
<div class="portfolio-loop-item" data-post-id="123">
    <div class="portfolio-image portfolio-loop-item" data-post-id="123">
        <!-- Click image only -->
    </div>
    <h3>Title</h3>
    <button class="portfolio-gallery-trigger" data-post-id="123">
        View Gallery
    </button>
</div>
```

In this example:
- Clicking the image opens gallery
- Clicking the button opens gallery
- Clicking title does nothing (no class)

---

That's it! Your loop items are now fully clickable and will open the gallery lightbox.
