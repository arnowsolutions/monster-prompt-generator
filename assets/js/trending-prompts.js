// Trending prompts functionality for Monster Prompt Generator

class TrendingPromptsManager {
    constructor() {
        this.apiEndpoints = {
            reddit: 'https://www.reddit.com/r/midjourney+stablediffusion+aiart/hot.json',
            discord: null, // Placeholder for Discord bot integration
            community: null // Placeholder for community API
        };
        this.cache = {
            data: [],
            timestamp: 0,
            ttl: 6 * 60 * 60 * 1000 // 6 hours in milliseconds
        };
        this.samplePrompts = this.getSamplePrompts();
        this.init();
    }

    init() {
        this.loadFromCache();
        this.setupEventListeners();
        this.renderTrendingPrompts();
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-trending');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshTrendingPrompts();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('trending-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Search functionality
        const searchInput = document.getElementById('trending-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPrompts(e.target.value);
            });
        }
    }

    // Load cached data
    loadFromCache() {
        try {
            const cached = localStorage.getItem('monsterPromptGenerator_trending');
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.cache.ttl) {
                    this.cache = data;
                    return true;
                }
            }
        } catch (error) {
            console.warn('Failed to load trending prompts cache:', error);
        }
        return false;
    }

    // Save to cache
    saveToCache() {
        try {
            localStorage.setItem('monsterPromptGenerator_trending', JSON.stringify(this.cache));
        } catch (error) {
            console.warn('Failed to save trending prompts cache:', error);
        }
    }

    // Get sample prompts for demo purposes
    getSamplePrompts() {
        return [
            {
                id: 1,
                prompt: "A majestic dragon perched on a crystal mountain peak, cinematic lighting, golden hour, shot with 85mm lens, photorealistic, ultra detailed --v6 --ar 16:9",
                category: "Fantasy",
                likes: 342,
                source: "Community",
                timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
                tags: ["dragon", "fantasy", "mountain", "cinematic"],
                author: "PromptMaster_AI"
            },
            {
                id: 2,
                prompt: "Cyberpunk street scene with neon reflections on wet pavement, dramatic lighting, wide angle shot, blade runner style, highly detailed --v6 --ar 21:9",
                category: "Sci-Fi",
                likes: 287,
                source: "Reddit",
                timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
                tags: ["cyberpunk", "neon", "street", "sci-fi"],
                author: "NeonDreamer"
            },
            {
                id: 3,
                prompt: "Portrait of a wise elderly wizard with a long flowing beard, soft natural lighting, painted in oil painting style, renaissance art, masterpiece --v6 --ar 4:5",
                category: "Portrait",
                likes: 198,
                source: "Discord",
                timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
                tags: ["wizard", "portrait", "oil painting", "fantasy"],
                author: "ArtisticVisions"
            },
            {
                id: 4,
                prompt: "Underwater coral reef teeming with colorful fish, volumetric lighting, national geographic style, ultra realistic, 8K resolution --v6 --ar 16:9",
                category: "Nature",
                likes: 156,
                source: "Community",
                timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
                tags: ["underwater", "coral reef", "nature", "photography"],
                author: "OceanExplorer"
            },
            {
                id: 5,
                prompt: "Minimalist modern living room with floor-to-ceiling windows, Scandinavian design, natural lighting, architectural photography --v6 --ar 3:2",
                category: "Architecture",
                likes: 134,
                source: "Reddit",
                timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
                tags: ["interior", "minimalist", "scandinavian", "architecture"],
                author: "DesignPro"
            },
            {
                id: 6,
                prompt: "Steampunk airship floating above Victorian city, golden hour lighting, detailed mechanical elements, fantasy art style --v6 --ar 16:9",
                category: "Steampunk",
                likes: 289,
                source: "Community",
                timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
                tags: ["steampunk", "airship", "victorian", "mechanical"],
                author: "SteamCraftAI"
            }
        ];
    }

    // Refresh trending prompts
    async refreshTrendingPrompts() {
        const refreshBtn = document.getElementById('refresh-trending');
        const originalText = refreshBtn ? refreshBtn.innerHTML : '';
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '🔄 Refreshing...';
            refreshBtn.disabled = true;
        }

        try {
            // In a real implementation, this would fetch from actual APIs
            await this.fetchTrendingPrompts();
            this.renderTrendingPrompts();
            this.showNotification('Trending prompts updated!', 'success');
        } catch (error) {
            console.error('Failed to refresh trending prompts:', error);
            this.showNotification('Failed to refresh prompts', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }
        }
    }

    // Fetch trending prompts from APIs (placeholder implementation)
    async fetchTrendingPrompts() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo purposes, we'll use sample data with some randomization
        const shuffled = [...this.samplePrompts].sort(() => Math.random() - 0.5);
        const updated = shuffled.map(prompt => ({
            ...prompt,
            likes: prompt.likes + Math.floor(Math.random() * 20),
            timestamp: Date.now() - Math.random() * 1000 * 60 * 60 * 6 // Random time in last 6 hours
        }));

        this.cache.data = updated;
        this.cache.timestamp = Date.now();
        this.saveToCache();

        return updated;
    }

    // Render trending prompts
    renderTrendingPrompts() {
        const container = document.getElementById('trending-prompts-list');
        if (!container) return;

        const prompts = this.cache.data.length > 0 ? this.cache.data : this.samplePrompts;
        
        container.innerHTML = prompts.map(prompt => this.createPromptCard(prompt)).join('');
        
        // Setup event listeners for new cards
        this.setupCardEventListeners();
    }

    // Create prompt card HTML
    createPromptCard(prompt) {
        const timeAgo = this.getTimeAgo(prompt.timestamp);
        const truncatedPrompt = prompt.prompt.length > 150 
            ? prompt.prompt.substring(0, 150) + '...' 
            : prompt.prompt;

        return `
            <div class="trending-prompt-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300" data-prompt-id="${prompt.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ${prompt.category}
                            </span>
                            <span class="text-sm text-gray-500">${prompt.source}</span>
                            <span class="text-sm text-gray-400">•</span>
                            <span class="text-sm text-gray-500">${timeAgo}</span>
                        </div>
                        <p class="text-gray-700 mb-3 leading-relaxed">${truncatedPrompt}</p>
                        <div class="flex flex-wrap gap-2 mb-3">
                            ${prompt.tags.map(tag => 
                                `<span class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">#${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-600">👤 ${prompt.author}</span>
                        <span class="text-sm text-gray-600 flex items-center gap-1">
                            ❤️ ${prompt.likes}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <button class="copy-prompt-btn px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200" 
                                data-prompt="${this.escapeHtml(prompt.prompt)}">
                            📋 Copy
                        </button>
                        <button class="import-prompt-btn px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                data-prompt="${this.escapeHtml(prompt.prompt)}">
                            📥 Import
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup event listeners for prompt cards
    setupCardEventListeners() {
        // Copy prompt buttons
        document.querySelectorAll('.copy-prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const prompt = btn.dataset.prompt;
                this.copyPromptToClipboard(prompt);
            });
        });

        // Import prompt buttons
        document.querySelectorAll('.import-prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const prompt = btn.dataset.prompt;
                this.importPrompt(prompt);
            });
        });
    }

    // Copy prompt to clipboard
    async copyPromptToClipboard(prompt) {
        try {
            await navigator.clipboard.writeText(prompt);
            this.showNotification('Prompt copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showNotification('Failed to copy prompt', 'error');
        }
    }

    // Import prompt to form
    importPrompt(prompt) {
        // Switch to image generation tab
        if (window.MonsterPromptTabs) {
            window.MonsterPromptTabs.switchTab('image-generation');
        }

        // Parse and populate form fields
        this.parseAndPopulateForm(prompt);
        this.showNotification('Prompt imported to form!', 'success');
    }

    // Parse prompt and populate form fields
    parseAndPopulateForm(prompt) {
        // Extract technical parameters
        const params = this.extractParameters(prompt);
        
        // Remove parameters from main prompt
        let cleanPrompt = prompt;
        Object.values(params).forEach(param => {
            if (param) cleanPrompt = cleanPrompt.replace(param, '').trim();
        });

        // Try to populate form fields based on content
        this.populateFormFromPrompt(cleanPrompt, params);
    }

    // Extract technical parameters from prompt
    extractParameters(prompt) {
        const params = {};
        
        // Extract version
        const versionMatch = prompt.match(/--v(\d+)/);
        if (versionMatch) {
            params.version = `--v${versionMatch[1]}`;
        }

        // Extract aspect ratio
        const arMatch = prompt.match(/--ar (\d+:\d+)/);
        if (arMatch) {
            params.aspectRatio = `--ar ${arMatch[1]}`;
        }

        // Extract quality
        const qualityMatch = prompt.match(/--q (\d+)/);
        if (qualityMatch) {
            params.quality = `--q ${qualityMatch[1]}`;
        }

        // Extract negative prompts
        const noMatch = prompt.match(/--no (.+?)(?:--|\s*$)/);
        if (noMatch) {
            params.negative = `--no ${noMatch[1]}`;
        }

        return params;
    }

    // Populate form fields from parsed prompt
    populateFormFromPrompt(cleanPrompt, params) {
        // This is a simplified implementation
        // In a real app, you'd have more sophisticated parsing logic
        
        // Set custom prompt field if available
        const customPromptField = document.getElementById('custom-prompt');
        if (customPromptField) {
            customPromptField.value = cleanPrompt;
        }

        // Set version if extracted
        if (params.version) {
            const versionSelect = document.querySelector('select[name="version"]');
            if (versionSelect) {
                const version = params.version.replace('--', '');
                versionSelect.value = version;
            }
        }
    }

    // Filter prompts by category
    filterByCategory(category) {
        const cards = document.querySelectorAll('.trending-prompt-card');
        
        cards.forEach(card => {
            const cardCategory = card.querySelector('.bg-blue-100').textContent.trim();
            
            if (category === 'all' || cardCategory.toLowerCase() === category.toLowerCase()) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Search prompts
    searchPrompts(query) {
        const cards = document.querySelectorAll('.trending-prompt-card');
        const searchTerm = query.toLowerCase();
        
        cards.forEach(card => {
            const promptText = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.bg-gray-100')).map(tag => tag.textContent.toLowerCase());
            const category = card.querySelector('.bg-blue-100').textContent.toLowerCase();
            
            const matches = promptText.includes(searchTerm) || 
                           tags.some(tag => tag.includes(searchTerm)) ||
                           category.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
        });
    }

    // Get time ago string
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    }

    // Escape HTML for safe insertion
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Get trending stats
    getStats() {
        const prompts = this.cache.data.length > 0 ? this.cache.data : this.samplePrompts;
        
        return {
            totalPrompts: prompts.length,
            categories: [...new Set(prompts.map(p => p.category))].length,
            totalLikes: prompts.reduce((sum, p) => sum + p.likes, 0),
            sources: [...new Set(prompts.map(p => p.source))],
            lastUpdate: new Date(this.cache.timestamp).toLocaleString()
        };
    }

    // Clear cache
    clearCache() {
        this.cache = {
            data: [],
            timestamp: 0,
            ttl: 6 * 60 * 60 * 1000
        };
        localStorage.removeItem('monsterPromptGenerator_trending');
    }
}

// Initialize trending prompts manager
let trendingPromptsManager;

document.addEventListener('DOMContentLoaded', function() {
    trendingPromptsManager = new TrendingPromptsManager();
});

// Export for external use
window.TrendingPromptsManager = TrendingPromptsManager;
window.trendingPromptsManager = () => trendingPromptsManager;