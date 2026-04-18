// ─── API Configuration ───────────────────────────────────────────
const API_BASE_URL = 'http://localhost:8000'; 

// ─── Word Origins (Did You Know) ──────────────────────────────
async function loadDailyOrigin() {
    const loader = document.getElementById('origin-loader');
    const content = document.getElementById('origin-content');
    const wordTitle = document.getElementById('origin-word-title');
    const textPreview = document.getElementById('origin-text-preview');
    const storyText = document.getElementById('origin-story-text');
    const expandBtn = document.getElementById('expand-origin-btn');
    const fullStory = document.getElementById('origin-full-story');

    try {
        const response = await fetch(`${API_BASE_URL}/api/vocab/daily-origin`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        loader.classList.add('hidden');
        content.classList.remove('hidden');
        
        wordTitle.innerHTML = `<span style="color: var(--primary)">${data.word}</span>`;
        textPreview.textContent = data.short_preview;
        storyText.textContent = data.full_story;

        expandBtn.addEventListener('click', () => {
            const isHidden = fullStory.classList.toggle('hidden');
            expandBtn.textContent = isHidden ? 'Read Full Story ▾' : 'Close Story ▴';
        });

    } catch (error) {
        console.error('Failed to load origin:', error);
        loader.textContent = 'Stay tuned for today\'s word origin!';
    }
}

// ─── Coach Priya Demo Chat ──────────────────────────────────────
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('demo-chat-input');
const sendBtn = document.getElementById('send-demo-chat');

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.rate = 0.9;
        msg.pitch = 1.1;
        // Select a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female'));
        if (femaleVoice) msg.voice = femaleVoice;
        window.speechSynthesis.speak(msg);
    }
}

function addMessage(text, isAi = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isAi ? 'ai' : 'user'}`;
    chatMessages.appendChild(bubble);
    
    if (isAi) {
        let i = 0;
        const speed = 30;
        function typeWriter() {
            if (i < text.length) {
                bubble.textContent += text.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                speak(text); 
            }
        }
        typeWriter();
    } else {
        bubble.textContent = text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function handleChat() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, false);
    chatInput.value = '';
    
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble ai pulse';
    loadingBubble.textContent = '...';
    chatMessages.appendChild(loadingBubble);

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/demo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, user_level: 'B1' })
        });
        
        const data = await response.json();
        chatMessages.removeChild(loadingBubble);
        addMessage(data.coach_reply, true);
    } catch (error) {
        chatMessages.removeChild(loadingBubble);
        addMessage('Sorry, I am having trouble connecting right now. Please try again later!', true);
    }
}

sendBtn.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

// ─── Initialize ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadDailyOrigin();
});

// Waitlist Form Handling
document.querySelector('.waitlist-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    this.innerHTML = `<span style="color: white; font-weight: 700; font-size: 1.2rem;">🚀 Thanks! We'll reach out to ${email} soon.</span>`;
});

// Simple Scroll Reveal Animation
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .cta-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
