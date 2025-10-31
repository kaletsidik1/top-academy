(function () {
	const WIDGET_IDS = {
		widget: 'chatbot-widget',
		panel: 'chatbot-panel',
		toggle: 'chatbot-toggle',
		close: 'chatbot-close',
		keyBtn: 'chatbot-key-btn',
		messages: 'chat-messages',
		input: 'chat-input',
		send: 'send-button'
	};

	const COMPANY_CONTEXT = (
		"You are the helpful, concise assistant for Top Academy. " +
		"Answer ONLY about Top Academy's services, mission, vision, team, contact, and policies based on the context below. " +
		"If a question is unrelated, politely decline and steer the user back to Top Academy topics.\n\n" +
		"Company: Top Academy\n" +
		"Mission: Empower students through personalized, accessible, practical education with skilled instructors and parent collaboration.\n" +
		"Vision: Every student has the tools, support, and opportunity to thrive in academics, research, and technology.\n" +
		"Services: Academic Tutoring (all core subjects), Research/Thesis Support (topic to defense), Coding Education (from basics to web dev).\n" +
		"Approach: Personalized plans, flexible schedules (online + in-person), affordable, result‑driven, strong parent updates.\n" +
		"Audience: Elementary, high school, and university students; instructors; partners (schools, NGOs).\n" +
		"Location: Addis Ababa, Ethiopia (4 Kilo).\n" +
		"Contact: contact@topacademy.et, +251 909146096, Telegram: https://t.me/Top_Academy_2025\n" +
		"Team: Founder & CEO: Kaletsidik Ayalew; Development Lead: Mekuanint Workie; Communication Lead: Nebiyu Minwuyelet; Senior Instructor: Melkamu Gatew; Coding Instructor: Henok Getahun.\n" +
		"Pricing: Varies by level and frequency; scholarships available for qualifying students.\n" +
		"FAQ highlights: group sessions available; parents can track progress; both online and in‑person sessions supported.\n"
	);

	function getApiKey() {
		return localStorage.getItem('groq_api_key') || '';
	}
	function setApiKey(key) {
		localStorage.setItem('groq_api_key', key.trim());
	}

	function init() {
		const panel = document.getElementById(WIDGET_IDS.panel);
		const toggle = document.getElementById(WIDGET_IDS.toggle);
		const close = document.getElementById(WIDGET_IDS.close);
		const keyBtn = document.getElementById(WIDGET_IDS.keyBtn);
		const send = document.getElementById(WIDGET_IDS.send);
		const input = document.getElementById(WIDGET_IDS.input);

		if (!panel || !toggle || !send || !input) return;

		// Open/close
		toggle.addEventListener('click', () => {
			const isHidden = panel.hasAttribute('hidden');
			if (isHidden) {
				panel.removeAttribute('hidden');
				toggle.setAttribute('aria-expanded', 'true');
				input.focus();
				ensureWelcome();
			} else {
				panel.setAttribute('hidden', '');
				toggle.setAttribute('aria-expanded', 'false');
			}
		});
		if (close) {
			close.addEventListener('click', () => {
				panel.setAttribute('hidden', '');
				toggle.setAttribute('aria-expanded', 'false');
			});
		}
		if (keyBtn) {
			keyBtn.addEventListener('click', () => {
				const current = getApiKey();
				const next = window.prompt('Enter your Groq API Key (stored locally):', current || '');
				if (next) setApiKey(next);
			});
		}

		send.addEventListener('click', () => sendMessage());
		input.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') sendMessage();
		});

		ensureWelcome();
	}

	function ensureWelcome() {
		const messages = document.getElementById(WIDGET_IDS.messages);
		if (!messages) return;
		if (messages.childElementCount === 0) {
			appendMessage(
				"Hi! I'm the Top Academy Assistant. Ask me anything about our services, mission, pricing, schedules, or how to get started.",
				'bot'
			);
		}
	}

	function appendMessage(text, author) {
		const messages = document.getElementById(WIDGET_IDS.messages);
		const item = document.createElement('div');
		item.className = `chat-message ${author === 'user' ? 'user-message' : 'bot-message'}`;
		item.textContent = text;
		messages.appendChild(item);
		messages.scrollTop = messages.scrollHeight;
	}

	async function sendMessage() {
		const input = document.getElementById(WIDGET_IDS.input);
		const userMessage = (input.value || '').trim();
		if (!userMessage) return;
		appendMessage(userMessage, 'user');
		input.value = '';

		const typing = document.createElement('div');
		typing.className = 'chat-message bot-message typing';
		typing.textContent = 'Typing…';
		document.getElementById(WIDGET_IDS.messages).appendChild(typing);
		try {
			const apiKey = getApiKey();
			if (!apiKey) {
				throw new Error('Missing API key');
			}
			const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'llama3-8b-8192',
					temperature: 0.2,
					messages: [
						{ role: 'system', content: COMPANY_CONTEXT },
						{ role: 'user', content: userMessage }
					]
				})
			});
			const data = await res.json();
			const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
				? data.choices[0].message.content
				: 'Sorry, I could not get a response.';
			typing.remove();
			appendMessage(content, 'bot');
		} catch (err) {
			console.error(err);
			typing.remove();
			if (String(err && err.message).includes('Missing API key')) {
				appendMessage('Set your Groq API key by clicking the key icon (🔑).', 'bot');
			} else {
				appendMessage('Sorry, I could not get a response. Please try again later.', 'bot');
			}
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();