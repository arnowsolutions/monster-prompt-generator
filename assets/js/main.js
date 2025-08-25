// Monster Prompt Generator - Main JavaScript
// Handles initialization, form interactions, and core functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeFormHandlers();
    initializeMultiSelectButtons();
    initializeSlider();
    initializeCustomInputs();
    initializeCopyFunctionality();
    initializeModules();
    
    console.log('Monster Prompt Generator initialized successfully');
}

// Initialize additional modules
function initializeModules() {
    // Initialize Keywords Database first
    if (typeof KeywordsDatabase !== 'undefined') {
        console.log('Keywords Database available with', KeywordsDatabaseUtils.getCategoryStats());
    }
    
    // Initialize ImagePreviewManager if available
    if (typeof ImagePreviewManager !== 'undefined') {
        window.imagePreviewManager = new ImagePreviewManager();
        console.log('ImagePreviewManager initialized');
    } else {
        console.log('ImagePreviewManager not available, retrying...');
        // Retry after a short delay in case the script is still loading
        setTimeout(() => {
            if (typeof ImagePreviewManager !== 'undefined') {
                window.imagePreviewManager = new ImagePreviewManager();
                console.log('ImagePreviewManager initialized (delayed)');
            } else {
                console.warn('ImagePreviewManager could not be initialized');
            }
        }, 100);
    }
    
    // Initialize prompt generator with keywords database
    if (window.promptGenerator && typeof KeywordsDatabase !== 'undefined') {
        window.promptGenerator.initializeKeywordsDatabase();
    }
}

// Form Handlers
function initializeFormHandlers() {
    const generateBtn = document.getElementById('generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateMonsterPrompt();
        });
    }
}

// Multi-select button functionality
function initializeMultiSelectButtons() {
    // Style buttons
    const styleButtons = document.querySelectorAll('.style-btn');
    styleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMultiSelectButton(this);
        });
    });
    
    // Lighting buttons
    const lightingButtons = document.querySelectorAll('.lighting-btn');
    lightingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMultiSelectButton(this);
        });
    });
}

function toggleMultiSelectButton(button) {
    button.classList.toggle('selected');
    
    // Add visual feedback
    if (button.classList.contains('selected')) {
        button.style.transform = 'scale(1.02)';
    } else {
        button.style.transform = 'scale(1)';
    }
}

// Character weight slider
function initializeSlider() {
    const slider = document.getElementById('char-weight');
    const valueDisplay = document.getElementById('weight-value');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

// Custom input handlers
function initializeCustomInputs() {
    // Main subject custom input
    const subjectSelect = document.getElementById('main-subject');
    const customSubjectInput = document.getElementById('custom-subject');
    
    if (subjectSelect && customSubjectInput) {
        subjectSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customSubjectInput.classList.remove('hidden');
                customSubjectInput.focus();
            } else {
                customSubjectInput.classList.add('hidden');
            }
        });
    }
    
    // Action/pose custom input
    const actionSelect = document.getElementById('action-pose');
    const customActionInput = document.getElementById('custom-action');
    
    if (actionSelect && customActionInput) {
        actionSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customActionInput.classList.remove('hidden');
                customActionInput.focus();
            } else {
                customActionInput.classList.add('hidden');
            }
        });
    }
}

// Copy to clipboard functionality
function initializeCopyFunctionality() {
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard();
        });
    }
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            generateMonsterPrompt();
        });
    }
}

async function copyToClipboard() {
    const promptText = document.getElementById('generated-prompt');
    if (!promptText) return;
    
    try {
        await navigator.clipboard.writeText(promptText.textContent);
        showNotification('Prompt copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Prompt copied to clipboard!', 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Main prompt generation function
function generateMonsterPrompt() {
    setLoadingState(true);
    
    try {
        // Get form data and validate
        const formData = getFormData();
        const errors = validateFormData(formData);
        
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            setLoadingState(false);
            return;
        }
        
        // Generate prompt using the prompt generator
        const generatedPrompt = promptGenerator.generatePrompt();
        
        if (!generatedPrompt) {
            showNotification('Failed to generate prompt. Please check your inputs.', 'error');
            setLoadingState(false);
            return;
        }
        
        // Display the generated prompt
        displayGeneratedPrompt(generatedPrompt);
        
        // Save to history
        promptGenerator.savePrompt(generatedPrompt);
        
        // Show success message
        showNotification('Prompt generated successfully!', 'success');
        
        // Scroll to output
        scrollToOutput();
        
    } catch (error) {
        console.error('Error generating prompt:', error);
        showNotification('An error occurred while generating the prompt.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Display generated prompt
function displayGeneratedPrompt(prompt) {
    const outputSection = document.getElementById('output-section');
    const promptDisplay = document.getElementById('generated-prompt');
    
    if (!outputSection || !promptDisplay) return;
    
    // Show the output section
    outputSection.classList.remove('hidden');
    
    // Display the prompt
    promptDisplay.textContent = prompt;
    
    // Enable action buttons
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    
    if (copyBtn) copyBtn.disabled = false;
    if (regenerateBtn) regenerateBtn.disabled = false;
}

// Get form data utility
function getFormData() {
    const data = {};
    
    // Get active tab
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return data;
    
    data.activeTab = activeTab.id;
    
    // Image generation specific data
    if (activeTab.id === 'image-generation') {
        // Main subject
        const subjectSelect = document.getElementById('main-subject');
        const customSubject = document.getElementById('custom-subject');
        data.subject = subjectSelect.value === 'custom' ? customSubject.value : subjectSelect.value;
        
        // Action/pose
        const actionSelect = document.getElementById('action-pose');
        const customAction = document.getElementById('custom-action');
        data.action = actionSelect.value === 'custom' ? customAction.value : actionSelect.value;
        
        // Character reference
        data.crefUrl = document.getElementById('cref-url').value;
        data.charWeight = document.getElementById('char-weight').value;
        
        // Selected styles
        data.styles = Array.from(document.querySelectorAll('.style-btn.selected')).map(btn => btn.dataset.value);
        
        // Selected lighting
        data.lighting = Array.from(document.querySelectorAll('.lighting-btn.selected')).map(btn => btn.dataset.value);
        
        // Camera settings
        data.shotView = document.getElementById('shot-view').value;
        data.lensType = document.getElementById('lens-type').value;
        
        // Technical parameters
        data.aspectRatio = document.getElementById('aspect-ratio').value;
        data.negativePrompt = document.getElementById('negative-prompt').value;
    }
    
    // For other tabs, form data will be collected directly by the prompt generator
    
    return data;
}

// Validation
function validateFormData(data) {
    const errors = [];
    
    if (data.activeTab === 'image-generation') {
        if (!data.subject) {
            errors.push('Please select or enter a main subject');
        }
        if (!data.action) {
            errors.push('Please select or enter an action/pose');
        }
    }
    
    // For other tabs, basic validation is handled by the prompt generator
    // More specific validation can be added here if needed
    
    return errors;
}

// Loading state management
function setLoadingState(isLoading) {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;
    
    if (isLoading) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="animate-spin mr-2">⏳</span> Generating...';
    } else {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🚀 Generate Monster Prompt';
    }
}

// Scroll to output
function scrollToOutput() {
    const outputSection = document.getElementById('output-section');
    if (outputSection) {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Auto-save functionality (localStorage)
function saveFormState() {
    const data = getFormData();
    localStorage.setItem('monsterPromptGenerator_formState', JSON.stringify(data));
}

function loadFormState() {
    try {
        const saved = localStorage.getItem('monsterPromptGenerator_formState');
        if (saved) {
            const data = JSON.parse(saved);
            restoreFormState(data);
        }
    } catch (error) {
        console.log('No saved form state found');
    }
}

function restoreFormState(data) {
    if (data.activeTab === 'image-generation') {
        // Restore form values
        if (data.subject) {
            const subjectSelect = document.getElementById('main-subject');
            if (subjectSelect) {
                if (subjectSelect.querySelector(`option[value="${data.subject}"]`)) {
                    subjectSelect.value = data.subject;
                } else {
                    subjectSelect.value = 'custom';
                    document.getElementById('custom-subject').value = data.subject;
                    document.getElementById('custom-subject').classList.remove('hidden');
                }
            }
        }
        
        // Restore action
        if (data.action) {
            const actionSelect = document.getElementById('action-pose');
            if (actionSelect) {
                if (actionSelect.querySelector(`option[value="${data.action}"]`)) {
                    actionSelect.value = data.action;
                } else {
                    actionSelect.value = 'custom';
                    document.getElementById('custom-action').value = data.action;
                    document.getElementById('custom-action').classList.remove('hidden');
                }
            }
        }
        
        // Restore other fields
        if (data.crefUrl) document.getElementById('cref-url').value = data.crefUrl;
        if (data.charWeight) document.getElementById('char-weight').value = data.charWeight;
        if (data.shotView) document.getElementById('shot-view').value = data.shotView;
        if (data.lensType) document.getElementById('lens-type').value = data.lensType;
        if (data.aspectRatio) document.getElementById('aspect-ratio').value = data.aspectRatio;
        if (data.negativePrompt) document.getElementById('negative-prompt').value = data.negativePrompt;
        
        // Restore multi-select buttons
        if (data.styles) {
            data.styles.forEach(style => {
                const btn = document.querySelector(`.style-btn[data-value="${style}"]`);
                if (btn) btn.classList.add('selected');
            });
        }
        
        if (data.lighting) {
            data.lighting.forEach(light => {
                const btn = document.querySelector(`.lighting-btn[data-value="${light}"]`);
                if (btn) btn.classList.add('selected');
            });
        }
    }
}

// Auto-save on form changes
document.addEventListener('change', saveFormState);
document.addEventListener('input', saveFormState);

// Load saved state on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadFormState, 500);
});