// Core prompt generation logic for Monster Prompt Generator

class MonsterPromptGenerator {
    constructor() {
        this.currentTab = 'image-generation';
        this.generatedPrompts = [];
    }

    // Generate prompt based on current tab
    generatePrompt(tabId = null) {
        const activeTab = tabId || this.getCurrentTab();
        
        switch (activeTab) {
            case 'image-generation':
                return this.generateImagePrompt();
            case 'writing':
                return this.generateWritingPrompt();
            case 'web-design':
                return this.generateWebDesignPrompt();
            case 'coding':
                return this.generateCodingPrompt();
            case 'logo-design':
                return this.generateLogoPrompt();
            case 'research-trending':
                return this.generateResearchPrompt();
            default:
                return this.generateImagePrompt();
        }
    }

    // Get current active tab
    getCurrentTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        return activeTab ? activeTab.dataset.tab : 'image-generation';
    }

    // Generate Image Generation Prompt
    generateImagePrompt() {
        const form = document.getElementById('image-generation');
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Collect multi-select button data
        const selectedStyles = this.getSelectedMultiSelectValues('style-buttons');
        const selectedLighting = this.getSelectedMultiSelectValues('lighting-buttons');

        // Build prompt sections
        const sections = {
            subject: this.buildSubjectSection(data),
            style: this.buildStyleSection(selectedStyles, data),
            lighting: this.buildLightingSection(selectedLighting),
            camera: this.buildCameraSection(data),
            composition: this.buildCompositionSection(data),
            technical: this.buildTechnicalSection(data),
            character: this.buildCharacterSection(data),
            quality: this.buildQualitySection(data),
            negative: this.buildNegativeSection(data)
        };

        // Assemble final prompt
        const prompt = this.assembleImagePrompt(sections);
        
        // Validate and return
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Build subject section
    buildSubjectSection(data) {
        const subject = data.subject || '';
        const action = data.action || '';
        const setting = data.setting || '';

        let section = subject;
        if (action) section += ` ${action}`;
        if (setting) section += ` in ${setting}`;

        return section.trim();
    }

    // Build style section
    buildStyleSection(selectedStyles, data) {
        const mainStyle = data.style || '';
        const styles = [mainStyle, ...selectedStyles].filter(Boolean);
        
        if (styles.length === 0) return '';
        
        return styles.join(', ');
    }

    // Build lighting section
    buildLightingSection(selectedLighting) {
        if (selectedLighting.length === 0) return '';
        return selectedLighting.join(', ');
    }

    // Build camera section
    buildCameraSection(data) {
        const elements = [];
        
        if (data.camera_angle) elements.push(data.camera_angle);
        if (data.camera_shot) elements.push(data.camera_shot);
        if (data.lens) elements.push(`shot with ${data.lens}`);
        
        return elements.join(', ');
    }

    // Build composition section
    buildCompositionSection(data) {
        const elements = [];
        
        if (data.composition) elements.push(data.composition);
        if (data.depth_of_field) elements.push(data.depth_of_field);
        
        return elements.join(', ');
    }

    // Build technical section
    buildTechnicalSection(data) {
        const technical = [];
        
        if (data.resolution) technical.push(data.resolution);
        if (data.render_engine) technical.push(`rendered in ${data.render_engine}`);
        
        return technical.join(', ');
    }

    // Build character reference section
    buildCharacterSection(data) {
        const charRef = data.character_reference;
        const charWeight = data.character_weight || '100';
        
        if (!charRef) return '';
        
        return `--cref ${charRef} --cw ${charWeight}`;
    }

    // Build quality section
    buildQualitySection(data) {
        const quality = data.quality || '';
        const version = data.version || 'v6';
        
        const qualityMap = {
            'standard': '--q 1',
            'high': '--q 2',
            'ultra': '--q 2'
        };

        const params = [];
        if (quality && qualityMap[quality]) {
            params.push(qualityMap[quality]);
        }
        params.push(`--${version}`);
        
        return params.join(' ');
    }

    // Build negative prompts section
    buildNegativeSection(data) {
        const negative = data.negative_prompts || '';
        if (!negative) return '';
        
        return `--no ${negative}`;
    }

    // Assemble final image prompt
    assembleImagePrompt(sections) {
        const promptParts = [];
        
        // Main description
        const mainDescription = [
            sections.subject,
            sections.style,
            sections.lighting,
            sections.camera,
            sections.composition,
            sections.technical
        ].filter(Boolean).join(', ');
        
        if (mainDescription) promptParts.push(mainDescription);
        
        // Technical parameters
        const technicalParams = [
            sections.character,
            sections.quality,
            sections.negative
        ].filter(Boolean);
        
        if (technicalParams.length > 0) {
            promptParts.push(...technicalParams);
        }
        
        return promptParts.join(' ').trim();
    }

    // Get selected values from multi-select buttons
    getSelectedMultiSelectValues(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const selectedButtons = container.querySelectorAll('.multi-select-btn.selected');
        return Array.from(selectedButtons).map(btn => btn.textContent.trim());
    }

    // Generate Writing Prompt (RACE Framework)
    generateWritingPrompt() {
        const form = document.getElementById('writing');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build RACE framework prompt
        const sections = {
            role: data.role || 'Expert Writer',
            action: data.action || 'Create content',
            context: data.context || 'General purpose',
            expectation: data.expectation || 'High quality output'
        };

        // Additional details
        const details = {
            topic: data.topic || '',
            wordCount: data.word_count || '',
            style: data.style || '',
            audience: data.audience || '',
            tone: data.tone || '',
            format: data.format || ''
        };

        const prompt = this.assembleWritingPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Web Design Prompt (CO-STAR Framework)
    generateWebDesignPrompt() {
        const form = document.getElementById('web-design');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build CO-STAR framework prompt
        const sections = {
            context: data.context || 'Modern website',
            objective: data.objective || 'Create engaging user experience',
            style: data.style || 'Clean and modern',
            tone: data.tone || 'Professional',
            audience: data.audience || 'General users',
            response: data.response || 'Responsive design'
        };

        // Additional details
        const details = {
            websiteType: data.website_type || '',
            features: data.features || '',
            colors: data.colors || '',
            layout: data.layout || '',
            pages: data.pages || ''
        };

        const prompt = this.assembleWebDesignPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Coding Prompt (CRISPE Framework)
    generateCodingPrompt() {
        const form = document.getElementById('coding');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build CRISPE framework prompt
        const sections = {
            capacity: data.capacity || 'Senior Developer',
            role: data.role || 'Problem solver',
            insight: data.insight || 'Best practices',
            statement: data.statement || 'Implement feature',
            personality: data.personality || 'Efficient',
            experiment: data.experiment || 'Test thoroughly'
        };

        // Additional details
        const details = {
            language: data.language || '',
            projectType: data.project_type || '',
            requirements: data.requirements || '',
            framework: data.framework || '',
            complexity: data.complexity || ''
        };

        const prompt = this.assembleCodingPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Logo Design Prompt (CO-STAR Framework)
    generateLogoPrompt() {
        const form = document.getElementById('logo-design');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build CO-STAR framework prompt
        const sections = {
            context: data.context || 'Modern business',
            objective: data.objective || 'Create memorable brand identity',
            style: data.style || 'Modern and clean',
            tone: data.tone || 'Professional',
            audience: data.audience || 'Target customers',
            response: data.response || 'Scalable vector design'
        };

        // Additional details
        const details = {
            industry: data.industry || '',
            logoType: data.logo_type || '',
            colors: data.colors || '',
            typography: data.typography || '',
            elements: data.design_elements || ''
        };

        const prompt = this.assembleLogoPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Research & Trending Prompt
    generateResearchPrompt() {
        const form = document.getElementById('research-trending');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build Research framework prompt
        const sections = {
            methodology: data.methodology || 'Systematic approach',
            researchType: data.research_type || 'Comprehensive analysis',
            scope: data.scope || 'Focused investigation',
            domain: data.domain || 'Subject area',
            depth: data.depth || 'Thorough examination'
        };

        // Additional details
        const details = {
            dataSources: data.data_sources || '',
            outputFormat: data.output_format || '',
            timeframe: data.timeframe || '',
            audience: data.audience || '',
            objectives: data.objectives || ''
        };

        const prompt = this.assembleResearchPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Extract form data utility
    extractFormData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    // Assemble Writing Prompt (RACE Framework)
    assembleWritingPrompt(sections, details) {
        const parts = [];
        
        // Role
        parts.push(`**Role:** Act as a ${sections.role}`);
        
        // Action & Context
        parts.push(`**Task:** ${sections.action} for ${sections.context}`);
        
        // Topic and specifics
        if (details.topic) {
            parts.push(`**Topic:** ${details.topic}`);
        }
        
        if (details.wordCount) {
            parts.push(`**Length:** ${details.wordCount} words`);
        }
        
        if (details.style) {
            parts.push(`**Style:** ${details.style}`);
        }
        
        if (details.audience) {
            parts.push(`**Target Audience:** ${details.audience}`);
        }
        
        if (details.tone) {
            parts.push(`**Tone:** ${details.tone}`);
        }
        
        if (details.format) {
            parts.push(`**Format:** ${details.format}`);
        }
        
        // Expectation
        parts.push(`**Expectation:** The output should be ${sections.expectation}`);
        
        return parts.join('\n\n');
    }

    // Assemble Web Design Prompt (CO-STAR Framework)
    assembleWebDesignPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Context:** Design a ${sections.context}`);
        parts.push(`**Objective:** ${sections.objective}`);
        parts.push(`**Style:** ${sections.style}`);
        parts.push(`**Tone:** ${sections.tone}`);
        parts.push(`**Audience:** ${sections.audience}`);
        
        if (details.websiteType) {
            parts.push(`**Website Type:** ${details.websiteType}`);
        }
        
        if (details.features) {
            parts.push(`**Key Features:** ${details.features}`);
        }
        
        if (details.colors) {
            parts.push(`**Color Scheme:** ${details.colors}`);
        }
        
        if (details.layout) {
            parts.push(`**Layout:** ${details.layout}`);
        }
        
        if (details.pages) {
            parts.push(`**Pages:** ${details.pages}`);
        }
        
        parts.push(`**Expected Response:** ${sections.response}`);
        
        return parts.join('\n\n');
    }

    // Assemble Coding Prompt (CRISPE Framework)
    assembleCodingPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Capacity:** Act as a ${sections.capacity}`);
        parts.push(`**Role:** Your role is as a ${sections.role}`);
        parts.push(`**Insight:** Focus on ${sections.insight}`);
        parts.push(`**Statement:** ${sections.statement}`);
        parts.push(`**Personality:** Approach this with a ${sections.personality} mindset`);
        
        if (details.language) {
            parts.push(`**Programming Language:** ${details.language}`);
        }
        
        if (details.projectType) {
            parts.push(`**Project Type:** ${details.projectType}`);
        }
        
        if (details.requirements) {
            parts.push(`**Requirements:** ${details.requirements}`);
        }
        
        if (details.framework) {
            parts.push(`**Framework/Library:** ${details.framework}`);
        }
        
        if (details.complexity) {
            parts.push(`**Complexity Level:** ${details.complexity}`);
        }
        
        parts.push(`**Experiment:** ${sections.experiment}`);
        
        return parts.join('\n\n');
    }

    // Assemble Logo Design Prompt (CO-STAR Framework)
    assembleLogoPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Context:** Design a logo for ${sections.context}`);
        parts.push(`**Objective:** ${sections.objective}`);
        parts.push(`**Style:** ${sections.style}`);
        parts.push(`**Tone:** ${sections.tone}`);
        parts.push(`**Audience:** ${sections.audience}`);
        
        if (details.industry) {
            parts.push(`**Industry:** ${details.industry}`);
        }
        
        if (details.logoType) {
            parts.push(`**Logo Type:** ${details.logoType}`);
        }
        
        if (details.colors) {
            parts.push(`**Color Palette:** ${details.colors}`);
        }
        
        if (details.typography) {
            parts.push(`**Typography:** ${details.typography}`);
        }
        
        if (details.elements) {
            parts.push(`**Design Elements:** ${details.elements}`);
        }
        
        parts.push(`**Expected Response:** ${sections.response}`);
        
        return parts.join('\n\n');
    }

    // Assemble Research Prompt
    assembleResearchPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Research Methodology:** ${sections.methodology}`);
        parts.push(`**Research Type:** ${sections.researchType}`);
        parts.push(`**Scope:** ${sections.scope}`);
        parts.push(`**Domain:** ${sections.domain}`);
        parts.push(`**Depth:** ${sections.depth}`);
        
        if (details.dataSources) {
            parts.push(`**Data Sources:** ${details.dataSources}`);
        }
        
        if (details.outputFormat) {
            parts.push(`**Output Format:** ${details.outputFormat}`);
        }
        
        if (details.timeframe) {
            parts.push(`**Timeframe:** ${details.timeframe}`);
        }
        
        if (details.audience) {
            parts.push(`**Target Audience:** ${details.audience}`);
        }
        
        if (details.objectives) {
            parts.push(`**Research Objectives:** ${details.objectives}`);
        }
        
        return parts.join('\n\n');
    }

    // Validate generated prompt
    validatePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') return false;
        if (prompt.trim().length < 10) return false;
        return true;
    }

    // Save prompt to history
    savePrompt(prompt, metadata = {}) {
        const promptData = {
            id: Date.now(),
            prompt: prompt,
            timestamp: new Date().toISOString(),
            tab: this.getCurrentTab(),
            ...metadata
        };
        
        this.generatedPrompts.unshift(promptData);
        
        // Keep only last 50 prompts
        if (this.generatedPrompts.length > 50) {
            this.generatedPrompts = this.generatedPrompts.slice(0, 50);
        }
        
        // Save to localStorage
        this.saveToLocalStorage();
        
        return promptData;
    }

    // Get prompt history
    getPromptHistory() {
        return this.generatedPrompts;
    }

    // Save to localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('monsterPromptGenerator_history', JSON.stringify(this.generatedPrompts));
        } catch (error) {
            console.warn('Failed to save prompt history:', error);
        }
    }

    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('monsterPromptGenerator_history');
            if (saved) {
                this.generatedPrompts = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load prompt history:', error);
            this.generatedPrompts = [];
        }
    }

    // Clear history
    clearHistory() {
        this.generatedPrompts = [];
        localStorage.removeItem('monsterPromptGenerator_history');
    }

    // Export prompt
    exportPrompt(prompt, format = 'text') {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `monster-prompt-${timestamp}`;
        
        let content = prompt;
        let mimeType = 'text/plain';
        
        if (format === 'json') {
            content = JSON.stringify({
                prompt: prompt,
                generated: new Date().toISOString(),
                generator: 'Monster Prompt Generator'
            }, null, 2);
            mimeType = 'application/json';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${format === 'json' ? 'json' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize global instance
const promptGenerator = new MonsterPromptGenerator();

// Load saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    promptGenerator.loadFromLocalStorage();
});

// Export for external use
window.MonsterPromptGenerator = MonsterPromptGenerator;
window.promptGenerator = promptGenerator;