// 🔄 Handles user input and communicates with the backend AI API
async function sendMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    // Append the user's message
    appendMessage('You', message, 'user-message');
    input.value = '';

    // ⏳ Show loader while waiting for the AI response
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

        // ❌ Remove loader before displaying response
        const loaderElement = document.getElementById('loader');
        if (loaderElement) loaderElement.remove();

        // ✅ Append formatted AI message
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
        // Typewriter effect for AI
        typeHTML(div, `<strong>${sender}:</strong><br>${text}`, () => {
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
        });
    } else {
        // Default message
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


// 🎨 Formats raw AI response into rich HTML: code, bold, line breaks
function formatResponse(text) {
    // Escape raw HTML
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Replace multiline code block: ```lang\ncode\n```
	const codeBlocks = [];
	   text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
	       const language = lang || 'javascript';
	       const id = codeBlocks.length;
	       codeBlocks.push({ language, code });
	       return `[[CODE_BLOCK_${id}]]`; // Temporary placeholder
	   });

    // Inline code: `code`
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Line breaks
    text = text.replace(/\n/g, '<br>');

	// Restore code blocks
	    codeBlocks.forEach((block, i) => {
	        const codeHtml = `<pre class="code-editor"><code class="language-${block.language}">${block.code}</code></pre>`;
	        text = text.replace(`[[CODE_BLOCK_${i}]]`, codeHtml);
	    });
    return text;
}


//typing style representation of Responce :
function typeHTML(container, html, callback) {
    let index = 0;
    let temp = '';
    let isTag = false;

    function typeChar() {
        const currentChar = html[index];
        temp += currentChar;

        // Handle HTML tags quickly (no delay inside tags)
        if (currentChar === '<') isTag = true;
        if (currentChar === '>') isTag = false;

        container.innerHTML = temp;
        container.scrollIntoView({ behavior: 'smooth', block: 'end' });

        index++;
        if (index < html.length) {
            setTimeout(typeChar, isTag ? 0 : 4); // Faster inside tags, slower outside
        } else if (callback) {
            callback();
        }
    }

    typeChar();
}

