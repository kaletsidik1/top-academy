document.addEventListener('DOMContentLoaded', function() {
	openAssistantWhenReady();
});

function openAssistantWhenReady(retries = 30) {
	// Prefer global API
	if (window.TopAcademyAssistant && typeof window.TopAcademyAssistant.open === 'function') {
		window.TopAcademyAssistant.open();
		return;
	}
	// Fallback to direct toggle click once elements exist
	const panel = document.getElementById('chatbot-panel');
	const toggle = document.getElementById('chatbot-toggle');
	if (panel && toggle && panel.hasAttribute('hidden')) {
		toggle.click();
		return;
	}
	if (retries > 0) {
		setTimeout(() => openAssistantWhenReady(retries - 1), 200);
	}
}
