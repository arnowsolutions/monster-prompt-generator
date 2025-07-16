// Image preview functionality using Unsplash API for Monster Prompt Generator

class ImagePreviewManager {
    constructor() {
        this.unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key
        this.cache = new Map();
        this.fallbackImages = {
            style: [
                'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
            ],
            lighting: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop'
            ]
        };
        this.loadedImages = new Set();
        this.init();
    }

    init() {
        this.setupPreviewButtons();
        this.loadInitialPreviews();
    }

    // Setup click handlers for preview buttons
    setupPreviewButtons() {
        // Style preview buttons
        const styleButtons = document.querySelectorAll('#style-buttons .multi-select-btn');
        styleButtons.forEach((button, index) => {
            this.addPreviewImage(button, 'style', index);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showExampleInPreview(button, 'style');
            });
        });

        // Lighting preview buttons
        const lightingButtons = document.querySelectorAll('#lighting-buttons .multi-select-btn');
        lightingButtons.forEach((button, index) => {
            this.addPreviewImage(button, 'lighting', index);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showExampleInPreview(button, 'lighting');
            });
        });
    }

    // Add preview image to button
    addPreviewImage(button, type, index) {
        if (button.querySelector('.preview-image')) return; // Already has preview

        const img = document.createElement('img');
        img.className = 'preview-image w-full h-16 object-cover rounded-t-lg opacity-80 transition-opacity duration-300';
        img.loading = 'lazy';
        
        // Set initial image
        const fallbackUrl = this.getFallbackImage(type, index);
        img.src = fallbackUrl;
        img.alt = `${type} preview`;

        // Add loading placeholder
        img.addEventListener('load', () => {
            img.style.opacity = '0.8';
        });

        img.addEventListener('error', () => {
            img.src = this.getFallbackImage(type, index);
        });

        // Insert at the beginning of button
        button.insertBefore(img, button.firstChild);

        // Update button styling
        button.classList.add('preview-enabled');
        
        // Load actual preview if available
        this.loadPreviewImage(button, type);
    }

    // Get fallback image
    getFallbackImage(type, index) {
        const images = this.fallbackImages[type] || this.fallbackImages.style;
        return images[index % images.length];
    }

    // Load preview image from Unsplash
    async loadPreviewImage(button, type) {
        const query = this.getSearchQuery(button, type);
        const cacheKey = `${type}_${query}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            this.updateButtonImage(button, this.cache.get(cacheKey));
            return;
        }

        try {
            const imageUrl = await this.fetchUnsplashImage(query);
            if (imageUrl) {
                this.cache.set(cacheKey, imageUrl);
                this.updateButtonImage(button, imageUrl);
            }
        } catch (error) {
            console.warn('Failed to load preview image:', error);
            // Fallback image is already set
        }
    }

    // Get search query from button text
    getSearchQuery(button, type) {
        const text = button.textContent.trim();
        
        // Map specific terms to better search queries
        const queryMappings = {
            'Cinematic': 'cinematic photography movie scene',
            'Photorealistic': 'realistic photography portrait',
            'Anime': 'anime art illustration',
            'Oil Painting': 'oil painting classical art',
            'Watercolor': 'watercolor painting art',
            'Digital Art': 'digital art illustration',
            'Golden Hour': 'golden hour sunset lighting',
            'Dramatic': 'dramatic lighting photography',
            'Soft': 'soft natural lighting portrait',
            'Neon': 'neon lights cyberpunk',
            'Natural': 'natural daylight photography'
        };

        return queryMappings[text] || `${text} ${type} photography`;
    }

    // Fetch image from Unsplash API
    async fetchUnsplashImage(query) {
        // If no API key, return null to use fallback
        if (!this.unsplashAccessKey || this.unsplashAccessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
            return null;
        }

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${this.unsplashAccessKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.small;
        }

        return null;
    }

    // Update button image
    updateButtonImage(button, imageUrl) {
        const img = button.querySelector('.preview-image');
        if (img && imageUrl) {
            img.src = imageUrl;
        }
    }

    // Refresh preview image
    async refreshPreview(button, type) {
        const img = button.querySelector('.preview-image');
        if (!img) return;

        // Add loading state
        img.style.opacity = '0.5';
        
        try {
            const query = this.getSearchQuery(button, type);
            const imageUrl = await this.fetchUnsplashImage(query);
            
            if (imageUrl) {
                img.src = imageUrl;
                // Update cache
                const cacheKey = `${type}_${query}`;
                this.cache.set(cacheKey, imageUrl);
            }
        } catch (error) {
            console.warn('Failed to refresh preview:', error);
        } finally {
            img.style.opacity = '0.8';
        }
    }

    // Load initial previews for visible buttons
    loadInitialPreviews() {
        const visibleButtons = document.querySelectorAll('.multi-select-btn.preview-enabled');
        
        // Load images progressively to avoid rate limiting
        visibleButtons.forEach((button, index) => {
            setTimeout(() => {
                const type = button.closest('#style-buttons') ? 'style' : 'lighting';
                this.loadPreviewImage(button, type);
            }, index * 200); // Stagger requests
        });
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Get cache size
    getCacheSize() {
        return this.cache.size;
    }

    // Preload images for better performance
    preloadImages() {
        // Preload fallback images
        Object.values(this.fallbackImages).flat().forEach(url => {
            if (!this.loadedImages.has(url)) {
                const img = new Image();
                img.src = url;
                this.loadedImages.add(url);
            }
        });
    }

    // Update API key
    setUnsplashKey(key) {
        this.unsplashAccessKey = key;
        this.clearCache(); // Clear cache when key changes
    }

    // Check if API is available
    isApiAvailable() {
        return this.unsplashAccessKey && this.unsplashAccessKey !== 'YOUR_UNSPLASH_ACCESS_KEY';
    }

    // Get preview statistics
    getStats() {
        return {
            cacheSize: this.cache.size,
            loadedImages: this.loadedImages.size,
            apiAvailable: this.isApiAvailable()
        };
    }

    // Show example in preview section when button is clicked
    showExampleInPreview(button, type) {
        const buttonText = button.textContent.trim();
        const previewContainer = document.getElementById(`${type}-preview`);
        
        if (!previewContainer) return;

        // Create example content
        const exampleContent = this.createExampleContent(buttonText, type);
        
        // Show the preview container and add content
        previewContainer.style.display = 'block';
        previewContainer.innerHTML = exampleContent;
        
        // Add fade-in animation
        previewContainer.classList.add('fade-in');
        setTimeout(() => {
            previewContainer.classList.remove('fade-in');
        }, 300);
    }

    // Create example content for preview
    createExampleContent(optionText, type) {
        const examples = this.getExamplesForOption(optionText, type);
        
        return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h4 class="font-medium text-gray-900 mb-3">${optionText} Examples</h4>
                <div class="space-y-4">
                    ${examples.textExamples.map(example => `
                        <div class="bg-gray-50 rounded-lg p-3">
                            <p class="text-sm text-gray-700">${example}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-4">
                    <h5 class="font-medium text-gray-800 mb-2">Visual Examples:</h5>
                    <div class="grid grid-cols-2 gap-2">
                        ${examples.visualExamples.map(img => `
                            <img src="${img}" alt="${optionText} example"
                                 class="w-full h-20 object-cover rounded-lg border border-gray-200"
                                 loading="lazy">
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Get examples for specific option
    getExamplesForOption(optionText, type) {
        const styleExamples = {
            'Photorealistic': {
                textExamples: [
                    'Ultra-realistic photography with precise detail and natural lighting',
                    'Lifelike rendering with accurate proportions and textures',
                    'Documentary-style capture with authentic colors and sharp focus'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
                ]
            },
            'Cinematic': {
                textExamples: [
                    'Movie-quality dramatic lighting with depth and atmosphere',
                    'Professional film aesthetic with rich color grading',
                    'Epic cinematography with dynamic composition'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1489599511229-a8b5b9b9d4b5?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
                ]
            },
            'Anime': {
                textExamples: [
                    'Japanese animation style with vibrant colors and expressive features',
                    'Manga-inspired artwork with clean lines and stylized proportions',
                    'Studio Ghibli-esque quality with beautiful backgrounds'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
                ]
            },
            'Oil Painting': {
                textExamples: [
                    'Classical oil painting technique with rich textures and brushstrokes',
                    'Renaissance-style artwork with deep colors and luminous quality',
                    'Impressionist-inspired painting with visible brush techniques'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=200&fit=crop'
                ]
            },
            'Watercolor': {
                textExamples: [
                    'Soft, flowing watercolor technique with translucent layers',
                    'Delicate paint washes with natural bleeding and blending',
                    'Ethereal quality with light, airy brushwork'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
                ]
            },
            'Digital Art': {
                textExamples: [
                    'Modern digital illustration with clean lines and vibrant colors',
                    'Computer-generated artwork with precision and detail',
                    'Contemporary digital painting with gradient effects'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
                ]
            },
            'Cyberpunk': {
                textExamples: [
                    'Futuristic neon-lit cityscapes with high-tech aesthetics',
                    'Dark, moody atmosphere with electric blue and pink lighting',
                    'Dystopian urban environments with advanced technology'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
                ]
            },
            'Steampunk': {
                textExamples: [
                    'Victorian-era technology with brass gears and steam-powered machinery',
                    'Retro-futuristic aesthetic with copper and bronze elements',
                    'Industrial revolution meets science fiction styling'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
                ]
            },
            'Minimalist': {
                textExamples: [
                    'Clean, simple compositions with maximum impact',
                    'Stripped-down aesthetic focusing on essential elements',
                    'Geometric simplicity with negative space utilization'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
                ]
            },
            'Surreal': {
                textExamples: [
                    'Dreamlike, impossible scenarios with reality-bending elements',
                    'Surrealist art style with unexpected juxtapositions',
                    'Mind-bending visual concepts that challenge perception'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
                ]
            }
        };

        const lightingExamples = {
            'Golden Hour': {
                textExamples: [
                    'Warm, soft lighting during the hour after sunrise or before sunset',
                    'Beautiful golden tones that enhance skin and create romantic atmosphere',
                    'Long shadows and rim lighting that add depth and dimension'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Dramatic Shadows': {
                textExamples: [
                    'High contrast lighting with strong shadows and highlights',
                    'Moody atmosphere with selective illumination',
                    'Bold chiaroscuro effects for emotional impact'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
                ]
            },
            'Soft Studio': {
                textExamples: [
                    'Gentle, diffused lighting that flatters subjects',
                    'Even illumination with minimal harsh shadows',
                    'Professional studio setup with softbox lighting'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
                ]
            },
            'Neon Lighting': {
                textExamples: [
                    'Vibrant neon lighting with electric colors and glowing effects',
                    'Cyberpunk-style illumination with pink, blue, and purple tones',
                    'Urban nighttime aesthetic with artificial light sources'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
                ]
            },
            'Natural Lighting': {
                textExamples: [
                    'Daylight illumination with balanced color temperature',
                    'Organic lighting from sun or sky without artificial sources',
                    'True-to-life colors and realistic shadow patterns'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Backlit': {
                textExamples: [
                    'Light source positioned behind the subject creating silhouettes',
                    'Rim lighting that outlines the subject with glowing edges',
                    'Dreamy, ethereal quality with light bleeding around subjects'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Rim Lighting': {
                textExamples: [
                    'Light positioned to create a glowing outline around the subject',
                    'Subtle edge lighting that separates subject from background',
                    'Professional portrait lighting technique for dramatic effect'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Volumetric': {
                textExamples: [
                    'Light rays visible in atmosphere creating depth and dimension',
                    'Dust particles or fog illuminated by directional light',
                    'Cinematic lighting with visible light beams and atmospheric effects'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Moonlight': {
                textExamples: [
                    'Cool, blue-tinted night lighting from moon illumination',
                    'Mysterious and romantic nighttime atmosphere',
                    'Soft, ethereal glow with deep shadows and cool color palette'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Candlelight': {
                textExamples: [
                    'Warm, flickering light from candles creating intimate atmosphere',
                    'Golden-orange glow with dramatic shadows and highlights',
                    'Romantic, cozy lighting with natural flame movement'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            }
        };

        const lensExamples = {
            '50mm lens': {
                textExamples: [
                    'Standard focal length providing natural perspective similar to human vision',
                    'Versatile lens perfect for portraits and general photography',
                    'Sharp details with beautiful bokeh at wide apertures'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop'
                ]
            },
            '85mm lens': {
                textExamples: [
                    'Portrait lens with flattering compression and background blur',
                    'Telephoto focal length ideal for headshots and close-ups',
                    'Professional portrait photography with creamy bokeh'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
                ]
            },
            '24mm lens': {
                textExamples: [
                    'Wide-angle lens capturing expansive scenes and landscapes',
                    'Dramatic perspective with strong foreground-background relationship',
                    'Architectural and environmental photography'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Macro lens': {
                textExamples: [
                    'Extreme close-up photography revealing intricate details',
                    '1:1 magnification for capturing tiny subjects and textures',
                    'Sharp focus on minute details with beautiful background blur'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=200&fit=crop'
                ]
            }
        };

        const shotExamples = {
            'Wide Shot': {
                textExamples: [
                    'Expansive view showing subject in full environmental context',
                    'Establishing shot that sets the scene and scale',
                    'Cinematic wide-angle composition with dramatic perspective'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            },
            'Close-up': {
                textExamples: [
                    'Intimate framing focusing on specific details or expressions',
                    'Emotional impact through proximity and detail emphasis',
                    'Professional portrait-style composition with shallow depth of field'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
                ]
            },
            'Bird\'s Eye View': {
                textExamples: [
                    'Overhead perspective looking directly down on the subject',
                    'Unique aerial viewpoint creating abstract compositions',
                    'Architectural photography from elevated position'
                ],
                visualExamples: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop'
                ]
            }
        };

        // Handle different types
        if (type === 'style') {
            return styleExamples[optionText] || this.createGenericExample(optionText, 'style');
        } else if (type === 'lighting') {
            return lightingExamples[optionText] || this.createGenericExample(optionText, 'lighting');
        } else if (type === 'lens') {
            return lensExamples[optionText] || this.createGenericExample(optionText, 'lens');
        } else if (type === 'shot') {
            return shotExamples[optionText] || this.createGenericExample(optionText, 'shot');
        }
        
        return this.createGenericExample(optionText, type);
    }

    // Create generic example for missing options
    createGenericExample(optionText, type) {
        const typeMap = {
            'style': 'artistic style',
            'lighting': 'lighting technique',
            'lens': 'photography equipment',
            'shot': 'camera angle'
        };
        
        return {
            textExamples: [
                `${optionText} ${typeMap[type]} with professional quality`,
                `Expert-level ${optionText.toLowerCase()} approach`,
                `High-quality ${optionText.toLowerCase()} ${typeMap[type]} rendering`
            ],
            visualExamples: [
                this.getFallbackImage(type, 0),
                this.getFallbackImage(type, 1)
            ]
        };
    }
}

// Image lazy loading utility
class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
        }
    }

    observe(img) {
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadImage(img);
        }
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }
}

// Initialize preview manager
let imagePreviewManager;
let lazyImageLoader;

document.addEventListener('DOMContentLoaded', function() {
    imagePreviewManager = new ImagePreviewManager();
    lazyImageLoader = new LazyImageLoader();
    
    // Preload images after initial load
    setTimeout(() => {
        imagePreviewManager.preloadImages();
    }, 1000);
});

// Export for external use
window.ImagePreviewManager = ImagePreviewManager;
window.LazyImageLoader = LazyImageLoader;

// Make instances globally available
window.imagePreviewManager = () => imagePreviewManager;
window.lazyImageLoader = () => lazyImageLoader;

// Add CSS for preview images
const previewStyles = `
<style>
.multi-select-btn.preview-enabled {
    overflow: hidden;
    position: relative;
}

.multi-select-btn .preview-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rem;
    z-index: 1;
}

.multi-select-btn.preview-enabled span {
    position: relative;
    z-index: 2;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin-top: 3rem;
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
}

.multi-select-btn.preview-enabled.selected span {
    background: rgba(59, 130, 246, 0.9);
}

.multi-select-btn.preview-enabled:hover .preview-image {
    opacity: 1 !important;
}

@media (max-width: 768px) {
    .multi-select-btn .preview-image {
        height: 3rem;
    }
    
    .multi-select-btn.preview-enabled span {
        margin-top: 2rem;
        font-size: 0.75rem;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', previewStyles);