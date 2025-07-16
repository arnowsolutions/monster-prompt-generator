// Tab switching functionality for Monster Prompt Generator

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    // Set initial active tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        switchTab(activeTab.dataset.tab);
    }
}

function switchTab(tabId) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
            button.classList.remove('text-gray-500', 'border-transparent');
            button.classList.add('text-blue-600', 'border-blue-500');
        } else {
            button.classList.remove('active');
            button.classList.remove('text-blue-600', 'border-blue-500');
            button.classList.add('text-gray-500', 'border-transparent');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update generate button visibility and functionality
    updateGenerateButton(tabId);
    
    // Save current tab to localStorage
    localStorage.setItem('monsterPromptGenerator_activeTab', tabId);
}

function updateGenerateButton(tabId) {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;
    
    // Update button text based on active tab
    const buttonTexts = {
        'image-generation': '🚀 Generate Monster Prompt',
        'writing': '✍️ Generate Writing Prompt',
        'web-design': '💻 Generate Design Brief',
        'coding': '👨‍💻 Generate Code Prompt',
        'logo-design': '🎯 Generate Logo Brief',
        'trending': '🔥 View Trending Prompts'
    };
    
    const buttonText = buttonTexts[tabId] || '🚀 Generate Monster Prompt';
    generateBtn.innerHTML = buttonText;
    
    // Show/hide generate button for trending tab
    if (tabId === 'trending') {
        generateBtn.style.display = 'none';
    } else {
        generateBtn.style.display = 'inline-block';
    }
}

// Load saved tab on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const savedTab = localStorage.getItem('monsterPromptGenerator_activeTab');
        if (savedTab && document.getElementById(savedTab)) {
            switchTab(savedTab);
        }
    }, 100);
});

// Responsive tab handling for mobile
function setupResponsiveTabs() {
    const tabContainer = document.querySelector('nav .flex');
    if (!tabContainer) return;
    
    // Add scroll behavior for mobile
    tabContainer.style.scrollBehavior = 'smooth';
    
    // Auto-scroll to active tab on mobile
    function scrollToActiveTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && window.innerWidth < 768) {
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    // Call on tab switch and window resize
    const observer = new MutationObserver(() => {
        setTimeout(scrollToActiveTab, 100);
    });
    
    observer.observe(tabContainer, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });
    
    window.addEventListener('resize', scrollToActiveTab);
}

// Initialize responsive tabs
document.addEventListener('DOMContentLoaded', setupResponsiveTabs);

// Export functions for external use
window.MonsterPromptTabs = {
    switchTab,
    updateGenerateButton
};