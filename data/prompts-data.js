// Data configuration for Monster Prompt Generator
// Contains all dropdown options, presets, and framework definitions

const PromptsData = {
    // Image Generation Data
    imageGeneration: {
        subjects: [
            'Portrait of a person',
            'Landscape scene',
            'Abstract concept',
            'Animal or creature',
            'Architectural structure',
            'Vehicle or machine',
            'Fantasy character',
            'Sci-fi element',
            'Food or cuisine',
            'Nature scene',
            'Urban environment',
            'Interior space',
            'Underwater scene',
            'Space or cosmic',
            'Historical figure',
            'Mythological being',
            'Robot or android',
            'Plant or flower',
            'Jewelry or accessory',
            'Weapon or tool',
            'Clothing or fashion',
            'Book or manuscript',
            'Musical instrument',
            'Sports or activity',
            'Weather phenomenon'
        ],

        actions: [
            'standing',
            'walking',
            'running',
            'sitting',
            'flying',
            'dancing',
            'fighting',
            'sleeping',
            'reading',
            'writing',
            'singing',
            'playing',
            'working',
            'cooking',
            'swimming',
            'climbing',
            'jumping',
            'falling',
            'meditating',
            'laughing',
            'crying',
            'shouting',
            'whispering',
            'thinking',
            'exploring'
        ],

        settings: [
            'a mystical forest',
            'a bustling city',
            'an ancient temple',
            'a modern office',
            'a cozy bedroom',
            'a vast desert',
            'a snowy mountain',
            'an underwater city',
            'a space station',
            'a medieval castle',
            'a futuristic laboratory',
            'a peaceful garden',
            'a dark alley',
            'a bright beach',
            'a foggy moor',
            'a crystal cave',
            'a floating island',
            'a haunted mansion',
            'a bustling market',
            'a serene lake',
            'a volcanic landscape',
            'a cyberpunk street',
            'a royal palace',
            'a post-apocalyptic wasteland',
            'a magical library'
        ],

        styles: [
            'Photorealistic',
            'Cinematic',
            'Anime',
            'Oil Painting',
            'Watercolor',
            'Digital Art',
            'Pencil Sketch',
            'Charcoal Drawing',
            'Pixel Art',
            'Impressionist',
            'Surrealist',
            'Art Nouveau',
            'Baroque',
            'Renaissance',
            'Gothic',
            'Minimalist',
            'Abstract',
            'Pop Art',
            'Street Art',
            'Graffiti',
            'Steampunk',
            'Cyberpunk',
            'Art Deco',
            'Comic Book',
            'Manga'
        ],

        lighting: [
            'Golden Hour',
            'Blue Hour',
            'Dramatic',
            'Soft',
            'Natural',
            'Studio',
            'Neon',
            'Candlelight',
            'Moonlight',
            'Sunlight',
            'Artificial',
            'Backlighting',
            'Side Lighting',
            'Top Lighting',
            'Ambient',
            'Moody',
            'High Key',
            'Low Key',
            'Chiaroscuro',
            'Volumetric',
            'God Rays',
            'Rim Lighting',
            'Practical',
            'Fluorescent',
            'LED'
        ],

        cameraAngles: [
            'Eye Level',
            'Low Angle',
            'High Angle',
            'Bird\'s Eye View',
            'Worm\'s Eye View',
            'Dutch Angle',
            'Over the Shoulder',
            'Point of View',
            'Profile',
            'Three-Quarter',
            'Frontal',
            'Rear View'
        ],

        cameraShots: [
            'Extreme Close-up',
            'Close-up',
            'Medium Close-up',
            'Medium Shot',
            'Medium Long Shot',
            'Long Shot',
            'Extreme Long Shot',
            'Full Body',
            'Head and Shoulders',
            'Bust Shot',
            'Cowboy Shot',
            'Two Shot'
        ],

        lenses: [
            '14mm ultra-wide lens',
            '24mm wide lens',
            '35mm lens',
            '50mm lens',
            '85mm lens',
            '100mm macro lens',
            '135mm lens',
            '200mm telephoto lens',
            '300mm telephoto lens',
            '400mm super telephoto lens',
            'Fisheye lens',
            'Tilt-shift lens'
        ],

        compositions: [
            'Rule of Thirds',
            'Golden Ratio',
            'Center Composition',
            'Symmetrical',
            'Asymmetrical',
            'Leading Lines',
            'Frame within Frame',
            'Diagonal',
            'Triangular',
            'Radial',
            'Pattern',
            'Negative Space'
        ],

        depthOfField: [
            'Shallow Depth of Field',
            'Deep Depth of Field',
            'Bokeh Background',
            'Sharp Focus',
            'Selective Focus',
            'Tilt-shift Effect',
            'Rack Focus',
            'Split Focus'
        ],

        resolutions: [
            '4K',
            '8K',
            '16K',
            'Ultra HD',
            'HD',
            'Cinema 4K',
            'IMAX',
            'Retina Display'
        ],

        renderEngines: [
            'Unreal Engine',
            'Unity',
            'Blender Cycles',
            'V-Ray',
            'Octane Render',
            'Arnold',
            'Redshift',
            'Corona',
            'KeyShot',
            'Cinema 4D'
        ],

        aspectRatios: [
            { label: 'Square (1:1)', value: '1:1' },
            { label: 'Portrait (4:5)', value: '4:5' },
            { label: 'Portrait (3:4)', value: '3:4' },
            { label: 'Portrait (2:3)', value: '2:3' },
            { label: 'Landscape (3:2)', value: '3:2' },
            { label: 'Landscape (4:3)', value: '4:3' },
            { label: 'Landscape (5:4)', value: '5:4' },
            { label: 'Widescreen (16:9)', value: '16:9' },
            { label: 'Ultra-wide (21:9)', value: '21:9' },
            { label: 'Cinematic (2:1)', value: '2:1' }
        ],

        versions: [
            { label: 'Version 6 (Latest)', value: 'v6' },
            { label: 'Version 5.2', value: 'v5.2' },
            { label: 'Version 5.1', value: 'v5.1' },
            { label: 'Version 5', value: 'v5' },
            { label: 'Version 4', value: 'v4' }
        ],

        qualityPresets: {
            standard: {
                label: 'Standard Quality',
                description: 'Balanced speed and quality',
                params: '--q 1'
            },
            high: {
                label: 'High Quality',
                description: 'Better quality, slower generation',
                params: '--q 2'
            },
            ultra: {
                label: 'Ultra Quality',
                description: 'Maximum quality, slowest generation',
                params: '--q 2 --chaos 0'
            }
        },

        negativePromptTemplates: [
            'blurry, low quality, pixelated',
            'distorted, deformed, ugly',
            'extra limbs, missing limbs, bad anatomy',
            'watermark, signature, text',
            'overexposed, underexposed, bad lighting',
            'duplicate, multiple, cloned',
            'cartoon, anime (for realistic images)',
            'realistic (for stylized images)',
            'nsfw, inappropriate content',
            'poor composition, cropped badly'
        ]
    },

    // Writing Prompts Framework (RACE)
    writing: {
        framework: 'RACE',
        description: 'Role, Action, Context, Expectation framework for writing prompts',
        fields: {
            role: [
                'Creative Writer',
                'Technical Writer',
                'Copywriter',
                'Journalist',
                'Academic Writer',
                'Content Creator',
                'Screenwriter',
                'Novelist',
                'Blogger',
                'Editor'
            ],
            action: [
                'Write an article',
                'Create a story',
                'Draft a script',
                'Compose a blog post',
                'Develop content',
                'Edit text',
                'Rewrite content',
                'Summarize information',
                'Generate ideas',
                'Create an outline'
            ],
            context: [
                'Business website',
                'Personal blog',
                'Academic paper',
                'Marketing campaign',
                'Social media',
                'Newsletter',
                'Product description',
                'Press release',
                'Creative portfolio',
                'Educational content'
            ],
            expectation: [
                'Engaging and informative',
                'Professional tone',
                'Conversational style',
                'SEO optimized',
                'Concise and clear',
                'Detailed and comprehensive',
                'Creative and original',
                'Data-driven',
                'Persuasive',
                'Educational'
            ]
        }
    },

    // Web Design Prompts Framework (CO-STAR)
    webDesign: {
        framework: 'CO-STAR',
        description: 'Context, Objective, Style, Tone, Audience, Response framework for web design',
        fields: {
            context: [
                'E-commerce website',
                'Corporate website',
                'Portfolio site',
                'Blog platform',
                'Landing page',
                'Mobile app',
                'Dashboard',
                'SaaS platform',
                'Educational site',
                'Non-profit website'
            ],
            objective: [
                'Increase conversions',
                'Improve user experience',
                'Showcase portfolio',
                'Generate leads',
                'Sell products',
                'Share information',
                'Build community',
                'Provide services',
                'Educate users',
                'Entertain visitors'
            ],
            style: [
                'Modern and minimalist',
                'Bold and vibrant',
                'Classic and elegant',
                'Playful and fun',
                'Professional and clean',
                'Artistic and creative',
                'Tech-focused',
                'Luxury and premium',
                'Eco-friendly',
                'Retro and vintage'
            ],
            tone: [
                'Professional',
                'Friendly',
                'Authoritative',
                'Casual',
                'Inspiring',
                'Trustworthy',
                'Innovative',
                'Welcoming',
                'Sophisticated',
                'Energetic'
            ],
            audience: [
                'Young professionals',
                'Business executives',
                'Creative professionals',
                'Students',
                'Seniors',
                'Tech enthusiasts',
                'Parents',
                'Entrepreneurs',
                'Artists',
                'General public'
            ],
            response: [
                'Clean and modern design',
                'Responsive layout',
                'User-friendly interface',
                'Fast loading times',
                'Mobile-first approach',
                'Accessibility compliant',
                'SEO optimized',
                'Conversion focused',
                'Brand consistent',
                'Interactive elements'
            ]
        }
    },

    // Coding Prompts Framework (CRISPE)
    coding: {
        framework: 'CRISPE',
        description: 'Capacity, Role, Insight, Statement, Personality, Experiment framework for coding',
        fields: {
            capacity: [
                'Senior Developer',
                'Full-Stack Developer',
                'Frontend Developer',
                'Backend Developer',
                'DevOps Engineer',
                'Data Scientist',
                'Mobile Developer',
                'Game Developer',
                'System Architect',
                'Technical Lead'
            ],
            role: [
                'Code reviewer',
                'Problem solver',
                'Feature implementer',
                'Bug fixer',
                'Performance optimizer',
                'Security auditor',
                'Documentation writer',
                'Testing specialist',
                'API designer',
                'Database architect'
            ],
            insight: [
                'Best practices',
                'Performance optimization',
                'Security considerations',
                'Scalability factors',
                'Maintainability',
                'Code readability',
                'Testing strategies',
                'Error handling',
                'Design patterns',
                'Code organization'
            ],
            statement: [
                'Implement new feature',
                'Fix critical bug',
                'Optimize performance',
                'Refactor code',
                'Add tests',
                'Improve security',
                'Update documentation',
                'Design API',
                'Setup CI/CD',
                'Database migration'
            ],
            personality: [
                'Detail-oriented',
                'Efficient',
                'Collaborative',
                'Innovative',
                'Methodical',
                'Pragmatic',
                'Quality-focused',
                'User-centric',
                'Performance-minded',
                'Security-conscious'
            ],
            experiment: [
                'Try new frameworks',
                'Test different approaches',
                'Benchmark solutions',
                'Prototype ideas',
                'A/B test features',
                'Load test system',
                'Security test',
                'User test interface',
                'Performance test',
                'Integration test'
            ]
        }
    },

    // Logo Design Prompts Framework (CO-STAR)
    logoDesign: {
        framework: 'CO-STAR',
        description: 'Context, Objective, Style, Tone, Audience, Response framework for logo design',
        fields: {
            context: [
                'Tech startup',
                'Healthcare company',
                'Restaurant chain',
                'Fashion brand',
                'Educational institution',
                'Non-profit organization',
                'Financial services',
                'Entertainment company',
                'Sports team',
                'Creative agency'
            ],
            objective: [
                'Build brand recognition',
                'Convey trust',
                'Show innovation',
                'Express creativity',
                'Communicate values',
                'Stand out from competitors',
                'Appeal to target market',
                'Reflect company culture',
                'Show professionalism',
                'Create memorable identity'
            ],
            style: [
                'Minimalist',
                'Modern',
                'Classic',
                'Playful',
                'Bold',
                'Elegant',
                'Geometric',
                'Organic',
                'Vintage',
                'Futuristic'
            ],
            tone: [
                'Professional',
                'Friendly',
                'Authoritative',
                'Approachable',
                'Sophisticated',
                'Energetic',
                'Trustworthy',
                'Innovative',
                'Reliable',
                'Creative'
            ],
            audience: [
                'Business professionals',
                'Young consumers',
                'Families',
                'Tech enthusiasts',
                'Creative professionals',
                'Healthcare patients',
                'Students',
                'Luxury market',
                'Local community',
                'Global market'
            ],
            response: [
                'Scalable vector design',
                'Works in black and white',
                'Memorable and unique',
                'Appropriate for industry',
                'Timeless design',
                'Versatile applications',
                'Clear at small sizes',
                'Reflects brand values',
                'Professional execution',
                'Multiple format options'
            ]
        }
    },

    // Common prompt enhancement keywords
    enhancement: {
        quality: [
            'masterpiece',
            'best quality',
            'ultra detailed',
            'highly detailed',
            'extremely detailed',
            'intricate details',
            'sharp focus',
            'professional',
            'award winning',
            'trending on artstation'
        ],
        style: [
            'artstation',
            'deviantart',
            'concept art',
            'matte painting',
            'digital painting',
            'illustration',
            'artwork',
            'fine art',
            'gallery quality',
            'museum piece'
        ],
        technical: [
            '4k',
            '8k',
            'ultra hd',
            'high resolution',
            'hdr',
            'ray tracing',
            'global illumination',
            'subsurface scattering',
            'ambient occlusion',
            'depth of field'
        ]
    },

    // Trending categories for filtering
    trending: {
        categories: [
            'All',
            'Fantasy',
            'Sci-Fi',
            'Portrait',
            'Landscape',
            'Architecture',
            'Animals',
            'Abstract',
            'Steampunk',
            'Cyberpunk',
            'Nature',
            'Urban',
            'Vintage',
            'Minimalist',
            'Surreal'
        ],
        sources: [
            'Reddit',
            'Discord',
            'Community',
            'Instagram',
            'Twitter',
            'Midjourney',
            'StableDiffusion'
        ]
    }
};

// Utility functions for data manipulation
const PromptsDataUtils = {
    // Get random item from array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Get multiple random items
    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Filter items by search term
    filterItems(array, searchTerm) {
        return array.filter(item => 
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },

    // Get framework fields for specific type
    getFrameworkFields(type) {
        const frameworks = {
            'writing': PromptsData.writing.fields,
            'web-design': PromptsData.webDesign.fields,
            'coding': PromptsData.coding.fields,
            'logo-design': PromptsData.logoDesign.fields
        };
        return frameworks[type] || {};
    },

    // Generate random prompt based on type
    generateRandomPrompt(type) {
        switch (type) {
            case 'image-generation':
                return this.generateRandomImagePrompt();
            case 'writing':
                return this.generateRandomWritingPrompt();
            case 'web-design':
                return this.generateRandomWebDesignPrompt();
            case 'coding':
                return this.generateRandomCodingPrompt();
            case 'logo-design':
                return this.generateRandomLogoPrompt();
            default:
                return this.generateRandomImagePrompt();
        }
    },

    // Generate random image prompt
    generateRandomImagePrompt() {
        const data = PromptsData.imageGeneration;
        const subject = this.getRandomItem(data.subjects);
        const action = this.getRandomItem(data.actions);
        const setting = this.getRandomItem(data.settings);
        const style = this.getRandomItem(data.styles);
        const lighting = this.getRandomItem(data.lighting);
        
        return `${subject} ${action} ${setting}, ${style} style, ${lighting} lighting, highly detailed --v6 --ar 16:9`;
    },

    // Generate random writing prompt
    generateRandomWritingPrompt() {
        const data = PromptsData.writing.fields;
        const role = this.getRandomItem(data.role);
        const action = this.getRandomItem(data.action);
        const context = this.getRandomItem(data.context);
        const expectation = this.getRandomItem(data.expectation);
        
        return `As a ${role}, ${action} for ${context}. The content should be ${expectation}.`;
    },

    // Generate random web design prompt
    generateRandomWebDesignPrompt() {
        const data = PromptsData.webDesign.fields;
        const context = this.getRandomItem(data.context);
        const objective = this.getRandomItem(data.objective);
        const style = this.getRandomItem(data.style);
        const audience = this.getRandomItem(data.audience);
        
        return `Design a ${context} to ${objective}. Style should be ${style} targeting ${audience}.`;
    },

    // Generate random coding prompt
    generateRandomCodingPrompt() {
        const data = PromptsData.coding.fields;
        const capacity = this.getRandomItem(data.capacity);
        const statement = this.getRandomItem(data.statement);
        const insight = this.getRandomItem(data.insight);
        
        return `As a ${capacity}, ${statement} while considering ${insight}.`;
    },

    // Generate random logo prompt
    generateRandomLogoPrompt() {
        const data = PromptsData.logoDesign.fields;
        const context = this.getRandomItem(data.context);
        const style = this.getRandomItem(data.style);
        const tone = this.getRandomItem(data.tone);
        
        return `Design a logo for a ${context} with a ${style} style and ${tone} tone.`;
    }
};

// Export data and utilities
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { PromptsData, PromptsDataUtils };
} else {
    // Browser environment
    window.PromptsData = PromptsData;
    window.PromptsDataUtils = PromptsDataUtils;
    
    // Load keywords database if available
    if (typeof KeywordsDatabase !== 'undefined') {
        window.PromptsData.keywordsDatabase = KeywordsDatabase;
        window.PromptsDataUtils.keywordsDatabase = KeywordsDatabaseUtils;
    }
}