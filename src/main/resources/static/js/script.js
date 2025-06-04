// 🔄 Handles user input and communicates with the backend AI API
async function sendMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('You', message, 'user-message');
    input.value = '';

    const loader = document.createElement('div');
    loader.classList.add('message', 'loader-message');
    loader.setAttribute('id', 'loader');
    loader.innerHTML = `<strong>AI:</strong> Sushil's AI typing...`;
    const chatBody = document.getElementById('chatBody');
    chatBody.appendChild(loader);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch('/api/qna/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
        });

        const result = await response.text();

        const loaderElement = document.getElementById('loader');
        if (loaderElement) loaderElement.remove();

        appendMessage('AI', formatResponse(result), 'ai-message', true);
    } catch (error) {
        console.error('Error:', error);
        const loaderElement = document.getElementById('loader');
        if (loaderElement) loaderElement.remove();
        appendMessage('Error', 'Failed to get response from AI.', 'ai-message');
    }
}

// 🧩 Appends a chat message to the UI
function appendMessage(sender, text, className, isHTML = false) {
    const chatBody = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.classList.add('message', className);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (isHTML && sender === 'AI') {
        typeHTML(div, `<strong>${sender}:</strong><br>${text}`, () => {
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
        });
    } else {
        if (isHTML) {
            div.innerHTML = `<strong>${sender}:</strong><br>${text}`;
        } else {
            div.textContent = `${sender}: ${text}`;
        }
        if (isHTML && typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
}

// 🎨 Formats raw AI response into rich HTML
function formatResponse(text) {
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const codeBlocks = [];
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript';
        const id = codeBlocks.length;
        codeBlocks.push({ language, code });
        return `[[CODE_BLOCK_${id}]]`;
    });

    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\n/g, '<br>');

    codeBlocks.forEach((block, i) => {
        const codeHtml = `<pre class="code-editor"><code class="language-${block.language}">${block.code}</code></pre>`;
        text = text.replace(`[[CODE_BLOCK_${i}]]`, codeHtml);
    });
    return text;
}

// ✨ Typing animation for AI response
function typeHTML(container, html, callback) {
    let index = 0;
    let temp = '';
    let isTag = false;

    function typeChar() {
        const currentChar = html[index];
        temp += currentChar;

        if (currentChar === '<') isTag = true;
        if (currentChar === '>') isTag = false;

        container.innerHTML = temp;
        container.scrollIntoView({ behavior: 'smooth', block: 'end' });

        index++;
        if (index < html.length) {
            setTimeout(typeChar, isTag ? 0 : 4);
        } else if (callback) {
            callback();
        }
    }

    typeChar();
}

// 🌗 Theme Toggle Handler
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            body.classList.toggle('light-theme');

            if (body.classList.contains('dark-theme')) {
                toggleBtn.textContent = 'Switch to Light';
                toggleBtn.classList.remove('btn-outline-light');
                toggleBtn.classList.add('btn-outline-warning');
            } else {
                toggleBtn.textContent = 'Switch to Dark';
                toggleBtn.classList.remove('btn-outline-warning');
                toggleBtn.classList.add('btn-outline-light');
            }
        });
    }

    // Chat form submission listener
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', sendMessage);
    }
});
