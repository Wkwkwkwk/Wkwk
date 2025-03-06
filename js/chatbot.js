document.addEventListener('DOMContentLoaded', async function () {
    const askBtn = document.getElementById('ask-btn');
    const userQuestionInput = document.getElementById('user-question');
    const chatHistory = document.getElementById('chat-history');
    const systemPromptInput = document.getElementById('system-prompt');
    const typingSpeed = 20; // Set default typing speed (milliseconds per character)
    let defaultPrompts = [];

    // Load default prompts from JSON file
    async function loadDefaultPrompts() {
        try {
            const response = await fetch('assets/list/chatbot.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            defaultPrompts = data.defaultPrompts.map(item => item.prompt);
        } catch (error) {
            console.error('Failed to load default prompts:', error);
        }
    }

    await loadDefaultPrompts();

    // Function to handle sending a question
    async function sendQuestion() {
        const userQuestion = userQuestionInput.value;
        if (!userQuestion) {
            alert('Please ask a question.');
            return;
        }

        const additionalPrompt = systemPromptInput.value;
        const systemPrompt = defaultPrompts.join('\n') + (additionalPrompt ? `\n${additionalPrompt}` : '');
        const model = 'llama3-8b-8192'; // Set default model
        const memoryLength = '10'; // Set default memory length to maximum

        try {
            addMessageToHistory(userQuestion, 'user'); 
            const response = await getGroqChatCompletion(userQuestion, systemPrompt, model);
            addMessageToHistory(response, 'bot', true);

            // Check if the response indicates that the bot doesn't know the answer or user requested Google search
            if (response.toLowerCase().includes("tidak tahu") || userQuestion.toLowerCase().includes("cari saja di google") || userQuestion.toLowerCase().includes("search google") || userQuestion.toLowerCase().includes("cari di google") || userQuestion.toLowerCase().includes("cari") || userQuestion.toLowerCase().includes("coba cari") || userQuestion.toLowerCase().includes("jelaskan")) {
                const googleResponse = await searchGoogle(userQuestion);
                addMessageToHistory(googleResponse, 'bot', false);
            }
        } catch (error) {
            console.error('Error calling Groq API or Google API:', error);
            alert('Error calling Groq API or Google API. Please try again.');
        } finally {
            userQuestionInput.value = '';  // Clear the input field
        }
    }

    askBtn.addEventListener('click', sendQuestion);

    // Add event listener for 'Enter' key press
    userQuestionInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevent newline in textarea
            sendQuestion();
        }
    });

    function addMessageToHistory(message, sender, isTyping = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        chatHistory.appendChild(messageElement);

        if (isTyping && sender === 'bot') {
            typeWriter(message, messageElement, typingSpeed);
        } else {
            messageElement.innerHTML = sender === 'user' ? `${message.replace(/\n/g, '<br>')}` : formatMessage(message);
        }

        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function typeWriter(text, element, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.innerHTML = formatMessage(element.innerHTML); // Ensure final formatting
            }
        }
        type();
    }

    function formatMessage(message) {
        const codeBlockPattern = /```([\s\S]*?)```/g;
        message = message.replace(codeBlockPattern, '<pre><code>$1</code></pre>');

        const lines = message.split('\n');
        let formattedMessage = '';
        let inTable = false;
        let tableMarkdown = '';

        lines.forEach(line => {
            if (line.startsWith('|')) {
                inTable = true;
                tableMarkdown += line + '\n';
            } else {
                if (inTable) {
                    formattedMessage += markdownTableToHtml(tableMarkdown);
                    tableMarkdown = '';
                    inTable = false;
                }
                formattedMessage += line.replace(/\n/g, '<br>') + '<br>';
            }
        });

        if (inTable) {
            formattedMessage += markdownTableToHtml(tableMarkdown);
        }

        return formattedMessage;
    }

    function markdownTableToHtml(markdown) {
        const lines = markdown.trim().split('\n');
        let table = '<table>';
        lines.forEach((line, index) => {
            if (index === 0) {
                // Header row
                table += '<thead><tr>';
                const headers = line.split('|').filter(header => header.trim());
                headers.forEach(header => {
                    table += `<th>${header.trim()}</th>`;
                });
                table += '</tr></thead><tbody>';
            } else if (index !== 1) {
                // Data rows
                table += '<tr>';
                const cells = line.split('|').filter(cell => cell.trim());
                cells.forEach(cell => {
                    table += `<td>${cell.trim()}</td>`;
                });
                table += '</tr>';
            }
        });
        table += '</tbody></table>';
        return table;
    }

    async function getGroqChatCompletion(userQuestion, systemPrompt, model) {
        const apiKey = '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';
        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        const payload = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userQuestion }
            ],
            max_tokens: 10000,
            temperature: 0.7,
            top_p: 1,
            stop: null,
            stream: false
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${response.statusText}. ${errorData.message || ''}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "No response from the API";
    }

    async function searchGoogle(query) {
        const apiKey = 'AIzaSyDixbn07HtpKUoaDT4BRjAzXYkIAhAPFsI'; // API Key Google Anda
        const searchEngineId = '668bac6c6a0004f46'; // ID mesin telusur Anda
        const apiUrl = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Google search failed: ${response.statusText}`);
        }

        const data = await response.json();
        let result = 'Berikut adalah hasil pencarian dari Google:<br><br>';
        let references = '';
        data.items.forEach((item, index) => {
            result += `<strong>${index + 1}. <a href="${item.link}" target="_blank">${item.title}</a></strong><br>${item.snippet}<br><br>`;
        });

        // Add the references to the result
        result += `<br>${references}`;
        
        return result;
    }
});
