document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQs 
    initFaqAccordion();

    const showFaqsButton = document.getElementById('show-faqs');
    const showAssistantButton = document.getElementById('show-assistant');
    const faqSection = document.getElementById('faq-section');

    showFaqsButton.addEventListener('click', () => {
        faqSection.style.display = 'block';
        showFaqsButton.classList.add('active');
        showAssistantButton.classList.remove('active');
    });

    showAssistantButton.addEventListener('click', () => {
        faqSection.style.display = 'none';
        showFaqsButton.classList.remove('active');
        showAssistantButton.classList.add('active');
        // Open the global chatbot widget
        const panel = document.getElementById('chatbot-panel');
        const toggle = document.getElementById('chatbot-toggle');
        if (panel && toggle && panel.hasAttribute('hidden')) {
            toggle.click();
        }
    });
});

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if current item is already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}