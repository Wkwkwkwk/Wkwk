document.addEventListener('DOMContentLoaded', function () {
    const askBtn = document.getElementById('ask-btn');
    const userQuestionInput = document.getElementById('user-question');
    const chatHistory = document.getElementById('chat-history');
    const systemPromptInput = document.getElementById('system-prompt');
    const memoryLengthInput = document.getElementById('memory-length');

    let chatMessages = [];
    let apiKeys = [];
    let apiKeyIndex = 0;
    let defaultPrompts = [];
    let combinedDefaultPrompt = "";
    let isTyping = false;

    console.log("Document loaded and script running.");

    async function loadApiKeys() {
        try {
            const response = await fetch('assets/list/apikey.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            apiKeys = Object.values(data);
            console.log("API keys loaded:", apiKeys);
        } catch (error) {
            console.error('Error loading API keys:', error);
            alert('Error loading API keys. Please try again later.');
        }
    }

    async function loadDefaultPrompts() {
        try {
            const response = await fetch('assets/list/chatbot.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            defaultPrompts = data.defaultPrompts || [];
            combinedDefaultPrompt = defaultPrompts.map(p => p.prompt).join('\n\n');
            console.log("Default prompts loaded:", combinedDefaultPrompt);
        } catch (error) {
            console.error('Error loading default prompts:', error);
            alert('Error loading default prompts. Please try again later.');
        }
    }

    async function handleAsk() {
        console.log("handleAsk called. isTyping:", isTyping);

        if (isTyping) {
            console.log("Chatbot is currently typing. Exiting handleAsk.");
            return; // If chatbot is typing, prevent new questions
        }

        const userQuestion = userQuestionInput.value.trim(); // Trim whitespace
        if (!userQuestion) {
            alert('Please ask a question.');
            return;
        }

        const userPrompt = systemPromptInput.value.trim();
        const systemPrompt = combinedDefaultPrompt + (userPrompt ? '\n\n' + userPrompt : '');
        const memoryLength = memoryLengthInput ? memoryLengthInput.value : '10'; // Default memory length to 10

        chatMessages.push({ role: 'user', content: userQuestion });

        if (chatMessages.length > memoryLength) {
            chatMessages = chatMessages.slice(-memoryLength);
        }

        console.log("Sending user question:", userQuestion);
        console.log("System prompt:", systemPrompt);
        console.log("Chat messages:", chatMessages);

        isTyping = true; // Set typing status to true
        addMessageToHistory(userQuestion, 'user');
        addTypingMessageToHistory();

        try {
            const response = await getGroqChatCompletion(systemPrompt, userQuestion);
            console.log("Received response from API:", response);
            removeTypingMessageFromHistory();
            addMessageToHistory(response, 'bot');
            chatMessages.push({ role: 'bot', content: response });
        } catch (error) {
            console.error('Error calling Groq API:', error);
            removeTypingMessageFromHistory();
        } finally {
            userQuestionInput.value = '';  // Clear the input field
            isTyping = false; // Reset typing status to false
            console.log("isTyping reset to false.");
        }
    }

    askBtn.addEventListener('click', handleAsk);

    userQuestionInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleAsk();
        }
    });

    function addMessageToHistory(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = sender === 'user' ? `You: ${message}` : `Chatbot: ${message}`;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addTypingMessageToHistory() {
        const typingMessageElement = document.createElement('div');
        typingMessageElement.classList.add('message', 'bot');
        typingMessageElement.textContent = "sedang mengetik....";
        typingMessageElement.id = 'typing-message';
        chatHistory.appendChild(typingMessageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function removeTypingMessageFromHistory() {
        const typingMessageElement = document.getElementById('typing-message');
        if (typingMessageElement) {
            chatHistory.removeChild(typingMessageElement);
        }
    }

    async function getGroqChatCompletion(systemPrompt, userQuestion) {
        const apiKey = apiKeys[apiKeyIndex];
        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        const payload = {
            model: 'llama3-8b-8192', // Default model
            messages: [
                { role: 'system', content: systemPrompt },
                ...chatMessages,
                { role: 'user', content: userQuestion }
            ],
            max_tokens: 100, // Limit the number of tokens in the response
            temperature: 0.7, // Adjust the creativity of the responses
            top_p: 1, // Controls diversity via nucleus sampling
            stop: null, // No stop sequence
            stream: false // No streaming
        };

        console.log('Payload being sent to API:', JSON.stringify(payload, null, 2)); // Log the payload for debugging

        try {
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
                console.error('API response not ok:', errorData);
                handleApiError(response.status, errorData);
                return "Error from API";
            }

            const data = await response.json();
            console.log('Response from API:', JSON.stringify(data, null, 2)); // Log the response for debugging
            return data.choices[0]?.message?.content || "No response from the API";
        } catch (error) {
            console.error(`Error with API key ${apiKey}:`, error);
            apiKeyIndex++;
            if (apiKeyIndex >= apiKeys.length) {
                throw new Error('All API keys have been exhausted.');
            }
            return "Error with API key";
        }
    }

    function handleApiError(status, errorData) {
        console.error(`API Error [${status}]:`, errorData); // Log the API error for debugging
        switch (status) {
            case 400:
                alert(`Bad Request: The server could not understand the request due to invalid syntax. Details: ${errorData.error.message}`);
                break;
            case 404:
                alert('Not Found: The requested resource could not be found.');
                break;
            case 422:
                alert('Unprocessable Entity: The request was well-formed but could not be followed due to semantic errors.');
                break;
            case 429:
                alert('Too Many Requests: You have sent too many requests in a given timeframe. Please try again later.');
                break;
            case 500:
                alert('Internal Server Error: A generic error occurred on the server. Please try again later.');
                break;
            case 502:
                alert('Bad Gateway: The server received an invalid response from an upstream server. Please try again later.');
                break;
            case 503:
                alert('Service Unavailable: The server is not ready to handle the request. Please try again later.');
                break;
            default:
                alert(`Unexpected Error: ${errorData.message}`);
                break;
        }
    }

    // Load API keys and default prompts on page load
    loadApiKeys();
    loadDefaultPrompts();
});
