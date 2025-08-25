// Core prompt generation logic for Monster Prompt Generator

class MonsterPromptGenerator {
    constructor() {
        this.currentTab = 'image-generation';
        this.generatedPrompts = [];
        this.promptPrinciples = this.initializePromptPrinciples();
    }

    // Initialize core prompt engineering principles
    initializePromptPrinciples() {
        return {
            general: {
                clarity: 'Use clear, specific language avoiding vague terms',
                context: 'Provide relevant background information',
                rolePlay: 'Assign specific persona or expertise to AI',
                outputFormat: 'Specify desired response format',
                constraints: 'Define limitations and exclusions',
                examples: 'Provide input-output examples when needed',
                iteration: 'Be prepared to refine based on results',
                breakdown: 'Divide complex tasks into manageable steps'
            },
            chainOfThought: 'Think step by step and explain your reasoning',
            iterativeImprovement: 'Draft, critique, and improve based on feedback'
        };
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

    // Generate Enhanced Image Generation Prompt
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

        // Build enhanced prompt sections with comprehensive fields
        const sections = {
            subject: this.buildSubjectSection(data),
            details: this.buildDetailsSection(data),
            style: this.buildStyleSection(selectedStyles, data),
            lighting: this.buildLightingSection(selectedLighting),
            mood: this.buildMoodSection(data),
            framing: this.buildFramingSection(data),
            camera: this.buildCameraSection(data),
            composition: this.buildCompositionSection(data),
            colors: this.buildColorSection(data),
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

    // Build enhanced subject section with specificity
    buildSubjectSection(data) {
        let subject = data.subject || '';
        const action = data.action || '';
        const setting = data.setting || '';
        const customSubject = document.getElementById('custom-subject')?.value || '';
        const customAction = document.getElementById('custom-action')?.value || '';
        
        // Use custom inputs if provided
        if (customSubject) subject = customSubject;
        const finalAction = customAction || action;

        // Build detailed subject description
        let section = subject;
        if (finalAction) section += ` ${finalAction}`;
        if (setting) section += ` in ${setting}`;
        
        // Add specificity enhancement
        if (section && !section.includes('detailed') && !section.includes('specific')) {
            section += ', highly detailed and specific';
        }

        return section.trim();
    }

    // Build details/modifiers section
    buildDetailsSection(data) {
        const details = [];
        
        // Add descriptive modifiers
        if (data.texture) details.push(`${data.texture} texture`);
        if (data.material) details.push(`made of ${data.material}`);
        if (data.age) details.push(`${data.age} appearance`);
        if (data.condition) details.push(`${data.condition} condition`);
        
        return details.join(', ');
    }

    // Build mood/emotion section
    buildMoodSection(data) {
        const mood = data.mood || '';
        const emotion = data.emotion || '';
        const atmosphere = data.atmosphere || '';
        
        const moodElements = [mood, emotion, atmosphere].filter(Boolean);
        return moodElements.length > 0 ? moodElements.join(', ') + ' atmosphere' : '';
    }

    // Build framing/composition section
    buildFramingSection(data) {
        const framing = [];
        
        if (data.shot_type) framing.push(data.shot_type);
        if (data.angle) framing.push(data.angle);
        if (data.perspective) framing.push(data.perspective);
        
        return framing.join(', ');
    }

    // Build color section
    buildColorSection(data) {
        const colors = [];
        
        if (data.color_scheme) colors.push(`${data.color_scheme} color scheme`);
        if (data.dominant_color) colors.push(`dominant ${data.dominant_color}`);
        if (data.color_temperature) colors.push(`${data.color_temperature} tones`);
        
        return colors.join(', ');
    }
    // Build enhanced style section
    buildStyleSection(selectedStyles, data) {
        const mainStyle = data.style || '';
        const styles = [mainStyle, ...selectedStyles].filter(Boolean);
        
        if (styles.length === 0) return '';
        
        // Add art form specification
        let styleSection = styles.join(', ');
        
        // Enhance with art form details
        if (styleSection && !styleSection.includes('style')) {
            styleSection += ' style';
        }
        
        // Add trending keywords for better results
        if (styleSection.includes('digital') || styleSection.includes('art')) {
            styleSection += ', trending on ArtStation';
        }
        
        return styleSection;
    }

    // Build enhanced lighting section
    buildLightingSection(selectedLighting) {
        if (selectedLighting.length === 0) return '';
        
        let lightingSection = selectedLighting.join(', ');
        
        // Add lighting quality descriptors
        if (lightingSection && !lightingSection.includes('lighting')) {
            lightingSection += ' lighting';
        }
        
        return lightingSection;
    }

    // Build enhanced camera section
    buildCameraSection(data) {
        const elements = [];
        
        // Get camera settings from form
        const shotView = document.getElementById('shot-view')?.value;
        const lensType = document.getElementById('lens-type')?.value;
        
        if (shotView && shotView !== '') elements.push(shotView);
        if (lensType && lensType !== '') elements.push(`shot with ${lensType}`);
        
        // Add camera quality descriptors
        if (elements.length > 0) {
            elements.push('professional photography');
        }
        
        return elements.join(', ');
    }

    // Build enhanced composition section
    buildCompositionSection(data) {
        const elements = [];
        
        if (data.composition) elements.push(data.composition);
        if (data.depth_of_field) elements.push(data.depth_of_field);
        if (data.focus_point) elements.push(`focus on ${data.focus_point}`);
        
        return elements.join(', ');
    }

    // Build enhanced technical section
    buildTechnicalSection(data) {
        const technical = [];
        
        // Add quality enhancers
        technical.push('ultra detailed', 'highly detailed', 'sharp focus');
        
        // Add resolution if specified
        const aspectRatio = document.getElementById('aspect-ratio')?.value;
        if (aspectRatio && aspectRatio !== '') {
            // This will be handled in quality section as --ar parameter
        }
        
        // Add render quality
        technical.push('professional quality', '8k resolution');
        
        return technical.join(', ');
    }

    // Build enhanced character reference section
    buildCharacterSection(data) {
        const charRef = document.getElementById('cref-url')?.value;
        const charWeight = document.getElementById('char-weight')?.value || '100';
        
        if (!charRef) return '';
        
        return `--cref ${charRef} --cw ${charWeight}`;
    }

    // Build enhanced quality section with parameters
    buildQualitySection(data) {
        const params = [];
        
        // Add version (default to v6)
        params.push('--v6');
        
        // Add aspect ratio
        const aspectRatio = document.getElementById('aspect-ratio')?.value;
        if (aspectRatio && aspectRatio !== '') {
            params.push(`--ar ${aspectRatio}`);
        }
        
        // Add quality setting
        params.push('--q 2');
        
        // Add style parameter for better consistency
        params.push('--style raw');

        return params.join(' ');
    }

    // Build enhanced negative prompts section
    buildNegativeSection(data) {
        const customNegative = document.getElementById('negative-prompt')?.value || '';
        const defaultNegatives = [
            'blurry', 'low quality', 'distorted', 'deformed', 
            'bad anatomy', 'watermark', 'signature', 'text'
        ];
        
        let negatives = [...defaultNegatives];
        if (customNegative) {
            negatives.push(...customNegative.split(',').map(n => n.trim()));
        }
        
        return negatives.length > 0 ? `--no ${negatives.join(', ')}` : '';
    }

    // Assemble enhanced final image prompt
    assembleImagePrompt(sections) {
        const promptParts = [];
        
        // Main description
        const mainDescription = [
            sections.subject,
            sections.details,
            sections.style,
            sections.lighting,
            sections.mood,
            sections.framing,
            sections.camera,
            sections.composition,
            sections.colors,
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

    // Generate Enhanced Writing Prompt (RACE Framework)
    generateWritingPrompt() {
        const form = document.getElementById('writing');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build enhanced RACE framework prompt with comprehensive fields
        const sections = {
            role: data.role || 'Expert Writer',
            action: data.action || 'Create content',
            context: data.context || 'General purpose',
            expectation: data.expectation || 'High quality output'
        };

        // Enhanced additional details
        const details = {
            topic: data.topic || '',
            goal: data.goal || '',
            targetAudience: data.target_audience || '',
            wordCount: data.word_count || '',
            style: data.style || '',
            tone: data.tone || '',
            format: data.format || '',
            language: data.language || '',
            constraints: data.constraints || '',
            examples: data.examples || '',
            background: data.background || '',
            exclusions: data.exclusions || '',
            chainOfThought: data.chain_of_thought === 'true',
            iterativeImprovement: data.iterative_improvement === 'true'
        };

        const prompt = this.assembleWritingPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Enhanced Web Design Prompt (CO-STAR Framework)
    generateWebDesignPrompt() {
        const form = document.getElementById('web-design');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build enhanced CO-STAR framework prompt
        const sections = {
            context: data.context || 'Modern website',
            objective: data.objective || 'Create engaging user experience',
            style: data.style || 'Clean and modern',
            tone: data.tone || 'Professional',
            audience: data.audience || 'General users',
            response: data.response || 'Responsive design'
        };

        // Enhanced additional details for web design
        const details = {
            pageSection: data.page_section || '',
            purpose: data.purpose || '',
            keyElements: data.key_elements || '',
            visualAesthetics: data.visual_aesthetics || '',
            colorPalette: data.color_palette || '',
            industryType: data.industry_type || '',
            placement: data.placement || '',
            uxOptimization: data.ux_optimization || '',
            accessibility: data.accessibility || '',
            websiteType: data.website_type || '',
            features: data.features || '',
            colors: data.colors || '',
            layout: data.layout || '',
            pages: data.pages || ''
        };

        const prompt = this.assembleWebDesignPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Enhanced Coding Prompt (CRISPE Framework)
    generateCodingPrompt() {
        const form = document.getElementById('coding');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build enhanced CRISPE framework prompt
        const sections = {
            capacity: data.capacity || 'Senior Developer',
            role: data.role || 'Problem solver',
            insight: data.insight || 'Best practices',
            statement: data.statement || 'Implement feature',
            personality: data.personality || 'Efficient',
            experiment: data.experiment || 'Test thoroughly'
        };

        // Enhanced additional details for coding
        const details = {
            functionality: data.functionality || '',
            language: data.language || '',
            framework: data.framework || '',
            keyRequirements: data.key_requirements || '',
            codeStructure: data.code_structure || '',
            outputDetails: data.output_details || '',
            existingCode: data.existing_code || '',
            security: data.security || '',
            projectType: data.project_type || '',
            requirements: data.requirements || '',
            complexity: data.complexity || '',
            errorHandling: data.error_handling || '',
            performance: data.performance || '',
            testing: data.testing || ''
        };

        const prompt = this.assembleCodingPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Enhanced Logo Design Prompt (CO-STAR Framework)
    generateLogoPrompt() {
        const form = document.getElementById('logo-design');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build enhanced CO-STAR framework prompt for logo design
        const sections = {
            context: data.context || 'Modern business',
            objective: data.objective || 'Create memorable brand identity',
            style: data.style || 'Modern and clean',
            tone: data.tone || 'Professional',
            audience: data.audience || 'Target customers',
            response: data.response || 'Scalable vector design'
        };

        // Enhanced additional details for logo design
        const details = {
            companyName: data.company_name || '',
            industry: data.industry || '',
            coreValues: data.core_values || '',
            visualStyle: data.visual_style || '',
            imagery: data.imagery || '',
            colorScheme: data.color_scheme || '',
            fontStyle: data.font_style || '',
            application: data.application || '',
            logoType: data.logo_type || '',
            colors: data.colors || '',
            typography: data.typography || '',
            elements: data.design_elements || '',
            symbolism: data.symbolism || '',
            competitors: data.competitors || ''
        };

        const prompt = this.assembleLogoPrompt(sections, details);
        return this.validatePrompt(prompt) ? prompt : null;
    }

    // Generate Enhanced Research & Trending Prompt
    generateResearchPrompt() {
        const form = document.getElementById('research-trending');
        if (!form) return null;

        const formData = new FormData(form);
        const data = this.extractFormData(formData);

        // Build enhanced Research framework prompt
        const sections = {
            centralConcept: data.central_concept || '',
            desiredOutput: data.desired_output || '',
            rolePlay: data.role_play || '',
            specificViewpoints: data.specific_viewpoints || '',
            timeAnchoredRole: data.time_anchored_role || '',
            methodology: data.methodology || 'Systematic approach',
            researchType: data.research_type || 'Comprehensive analysis',
            scope: data.scope || 'Focused investigation',
            domain: data.domain || 'Subject area',
            depth: data.depth || 'Thorough examination'
        };

        // Enhanced additional details for research
        const details = {
            dilemmaScenario: data.dilemma_scenario || '',
            breakdownElements: data.breakdown_elements || '',
            evidenceSupport: data.evidence_support || '',
            clarityQuestion: data.clarity_question || '',
            webSearch: data.web_search || '',
            criticalThinking: data.critical_thinking || '',
            decomposition: data.decomposition || '',
            reflection: data.reflection || '',
            iterativeLearning: data.iterative_learning || '',
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

    // Assemble Enhanced Writing Prompt (RACE Framework)
    assembleWritingPrompt(sections, details) {
        const parts = [];
        
        // Role
        parts.push(`**Role:** Act as a ${sections.role}`);
        
        // Add chain-of-thought if requested
        if (details.chainOfThought) {
            parts.push(`**Approach:** Think step by step and explain your reasoning process`);
        }
        
        // Action & Context
        parts.push(`**Task:** ${sections.action} for ${sections.context}`);
        
        // Goal/Purpose
        if (details.goal) {
            parts.push(`**Goal:** ${details.goal}`);
        }
        
        // Topic and specifics
        if (details.topic) {
            parts.push(`**Topic:** ${details.topic}`);
        }
        
        // Target Audience (enhanced)
        if (details.targetAudience) {
            parts.push(`**Target Audience:** ${details.targetAudience}`);
        }
        
        // Background/Context
        if (details.background) {
            parts.push(`**Background Information:** ${details.background}`);
        }
        
        if (details.wordCount) {
            parts.push(`**Length:** ${details.wordCount} words`);
        }
        
        if (details.style) {
            parts.push(`**Style:** ${details.style}`);
        }
        
        if (details.tone) {
            parts.push(`**Tone:** ${details.tone}`);
        }
        
        if (details.language) {
            parts.push(`**Language/Terminology:** ${details.language}`);
        }
        
        if (details.format) {
            parts.push(`**Format:** ${details.format}`);
        }
        
        // Constraints and exclusions
        if (details.constraints) {
            parts.push(`**Constraints:** ${details.constraints}`);
        }
        
        if (details.exclusions) {
            parts.push(`**Exclusions:** ${details.exclusions}`);
        }
        
        // Examples if provided
        if (details.examples) {
            parts.push(`**Examples/References:** ${details.examples}`);
        }
        
        // Expectation
        parts.push(`**Expectation:** The output should be ${sections.expectation}`);
        
        // Add iterative improvement instruction if requested
        if (details.iterativeImprovement) {
            parts.push(`**Process:** Draft your response, then critique it, and provide an improved version based on your critique`);
        }
        
        return parts.join('\n\n');
    }

    // Assemble Enhanced Web Design Prompt (CO-STAR Framework)
    assembleWebDesignPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Context:** Design a ${sections.context}`);
        parts.push(`**Objective:** ${sections.objective}`);
        
        // Enhanced page/section focus
        if (details.pageSection) {
            parts.push(`**Page/Section Focus:** ${details.pageSection}`);
        }
        
        // Purpose/Goal
        if (details.purpose) {
            parts.push(`**Purpose:** ${details.purpose}`);
        }
        
        // Key elements to include
        if (details.keyElements) {
            parts.push(`**Key Elements:** ${details.keyElements}`);
        }
        
        parts.push(`**Style:** ${sections.style}`);
        
        // Visual aesthetics
        if (details.visualAesthetics) {
            parts.push(`**Visual Aesthetics:** ${details.visualAesthetics}`);
        }
        
        // Color palette
        if (details.colorPalette) {
            parts.push(`**Color Palette:** ${details.colorPalette}`);
        }
        
        parts.push(`**Tone:** ${sections.tone}`);
        parts.push(`**Audience:** ${sections.audience}`);
        
        // Industry/Business type
        if (details.industryType) {
            parts.push(`**Industry/Business Type:** ${details.industryType}`);
        }
        
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
        
        // Placement/Application
        if (details.placement) {
            parts.push(`**Placement/Application:** ${details.placement}`);
        }
        
        // UX Optimization
        if (details.uxOptimization) {
            parts.push(`**UX Optimization:** ${details.uxOptimization}`);
        }
        
        // Accessibility
        if (details.accessibility) {
            parts.push(`**Accessibility:** ${details.accessibility}`);
        }
        
        parts.push(`**Expected Response:** ${sections.response}`);
        
        return parts.join('\n\n');
    }

    // Assemble Enhanced Coding Prompt (CRISPE Framework)
    assembleCodingPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Capacity:** Act as a ${sections.capacity}`);
        parts.push(`**Role:** Your role is as a ${sections.role}`);
        parts.push(`**Insight:** Focus on ${sections.insight}`);
        parts.push(`**Statement:** ${sections.statement}`);
        parts.push(`**Personality:** Approach this with a ${sections.personality} mindset`);
        
        // Specific functionality
        if (details.functionality) {
            parts.push(`**Specific Functionality:** ${details.functionality}`);
        }
        
        if (details.language) {
            parts.push(`**Programming Language:** ${details.language}`);
        }
        
        if (details.framework) {
            parts.push(`**Framework/Library:** ${details.framework}`);
        }
        
        // Key requirements
        if (details.keyRequirements) {
            parts.push(`**Key Requirements:** ${details.keyRequirements}`);
        }
        
        // Code structure requirements
        if (details.codeStructure) {
            parts.push(`**Code Structure:** ${details.codeStructure}`);
        }
        
        if (details.projectType) {
            parts.push(`**Project Type:** ${details.projectType}`);
        }
        
        if (details.requirements) {
            parts.push(`**Requirements:** ${details.requirements}`);
        }
        
        if (details.complexity) {
            parts.push(`**Complexity Level:** ${details.complexity}`);
        }
        
        // Error handling
        if (details.errorHandling) {
            parts.push(`**Error Handling:** ${details.errorHandling}`);
        }
        
        // Performance considerations
        if (details.performance) {
            parts.push(`**Performance:** ${details.performance}`);
        }
        
        // Security requirements
        if (details.security) {
            parts.push(`**Security:** ${details.security}`);
        }
        
        // Testing requirements
        if (details.testing) {
            parts.push(`**Testing:** ${details.testing}`);
        }
        
        // Output details
        if (details.outputDetails) {
            parts.push(`**Output Details:** ${details.outputDetails}`);
        }
        
        // Existing code (for optimization/testing)
        if (details.existingCode) {
            parts.push(`**Existing Code:**\n\`\`\`\n${details.existingCode}\n\`\`\``);
        }
        
        parts.push(`**Experiment:** ${sections.experiment}`);
        
        return parts.join('\n\n');
    }

    // Assemble Enhanced Logo Design Prompt (CO-STAR Framework)
    assembleLogoPrompt(sections, details) {
        const parts = [];
        
        parts.push(`**Context:** Design a logo for ${sections.context}`);
        parts.push(`**Objective:** ${sections.objective}`);
        
        // Company name
        if (details.companyName) {
            parts.push(`**Company Name:** ${details.companyName}`);
        }
        
        // Industry/Business type
        if (details.industry) {
            parts.push(`**Industry/Business Type:** ${details.industry}`);
        }
        
        // Core values/concept
        if (details.coreValues) {
            parts.push(`**Core Values/Concept:** ${details.coreValues}`);
        }
        
        parts.push(`**Style:** ${sections.style}`);
        
        // Visual style/aesthetic
        if (details.visualStyle) {
            parts.push(`**Visual Style/Aesthetic:** ${details.visualStyle}`);
        }
        
        // Imagery/Elements
        if (details.imagery) {
            parts.push(`**Imagery/Elements:** ${details.imagery}`);
        }
        
        parts.push(`**Tone:** ${sections.tone}`);
        parts.push(`**Audience:** ${sections.audience}`);
        
        if (details.logoType) {
            parts.push(`**Logo Type:** ${details.logoType}`);
        }
        
        // Color scheme/hues
        if (details.colorScheme) {
            parts.push(`**Color Scheme/Hues:** ${details.colorScheme}`);
        }
        
        if (details.colors) {
            parts.push(`**Color Palette:** ${details.colors}`);
        }
        
        // Font style
        if (details.fontStyle) {
            parts.push(`**Font Style:** ${details.fontStyle}`);
        }
        
        if (details.typography) {
            parts.push(`**Typography:** ${details.typography}`);
        }
        
        if (details.elements) {
            parts.push(`**Design Elements:** ${details.elements}`);
        }
        
        // Application/Usage
        if (details.application) {
            parts.push(`**Application/Usage:** ${details.application}`);
        }
        
        // Symbolism
        if (details.symbolism) {
            parts.push(`**Symbolism:** ${details.symbolism}`);
        }
        
        // Competitor analysis
        if (details.competitors) {
            parts.push(`**Competitor Considerations:** ${details.competitors}`);
        }
        
        parts.push(`**Expected Response:** ${sections.response}`);
        parts.push(`**Note:** Provide multiple concept variations and be prepared for iteration and refinement`);
        
        return parts.join('\n\n');
    }

    // Assemble Enhanced Research Prompt
    assembleResearchPrompt(sections, details) {
        const parts = [];
        
        // Central concept/topic
        if (sections.centralConcept) {
            parts.push(`**Central Concept/Topic:** ${sections.centralConcept}`);
        }
        
        // Desired output
        if (sections.desiredOutput) {
            parts.push(`**Desired Output:** ${sections.desiredOutput}`);
        }
        
        // Role-play
        if (sections.rolePlay) {
            parts.push(`**Role-Play:** Assume the role of a ${sections.rolePlay}`);
        }
        
        // Specific viewpoints/lenses
        if (sections.specificViewpoints) {
            parts.push(`**Analysis Perspective:** ${sections.specificViewpoints}`);
        }
        
        // Time-anchored role
        if (sections.timeAnchoredRole) {
            parts.push(`**Time-Anchored Perspective:** ${sections.timeAnchoredRole}`);
        }
        
        parts.push(`**Research Methodology:** ${sections.methodology}`);
        parts.push(`**Research Type:** ${sections.researchType}`);
        parts.push(`**Scope:** ${sections.scope}`);
        parts.push(`**Domain:** ${sections.domain}`);
        parts.push(`**Depth:** ${sections.depth}`);
        
        // Dilemma/Scenario
        if (details.dilemmaScenario) {
            parts.push(`**Dilemma/Scenario:** ${details.dilemmaScenario}`);
        }
        
        // Breakdown elements
        if (details.breakdownElements) {
            parts.push(`**Breakdown Elements:** ${details.breakdownElements}`);
        }
        
        // Evidence/Support
        if (details.evidenceSupport) {
            parts.push(`**Evidence/Support:** ${details.evidenceSupport}`);
        }
        
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
        
        // Critical thinking prompts
        if (details.criticalThinking) {
            parts.push(`**Critical Thinking:** ${details.criticalThinking}`);
        }
        
        // Decomposition/Chain-of-thought
        if (details.decomposition) {
            parts.push(`**Approach:** Break down complex problems, explore distinct solution branches, evaluate quality, and justify choices`);
        }
        
        // Reflection/Self-critique
        if (details.reflection) {
            parts.push(`**Process:** Provide your analysis, then identify potential flaws or limitations, and offer an improved perspective`);
        }
        
        // Iterative learning
        if (details.iterativeLearning) {
            parts.push(`**Learning Approach:** ${details.iterativeLearning}`);
        }
        
        // Web search guidance
        if (details.webSearch) {
            parts.push(`**Research Focus:** Use recent, contextual, and search-friendly terms. Focus on latest developments and trends`);
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