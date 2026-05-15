// Background worker for calling the Gemini API
// This avoids CORS issues and keeps keys safe within the extension context

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchEmoji') {
    // Run the async work inside an immediately invoked function to ensure 
    // we don't accidentally close the message port early.
    (async () => {
      try {
        const emoji = await handleEmojiRequest(request.text);
        sendResponse({ success: true, emoji });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
      
    // Return true to indicate we will send a response asynchronously
    return true; 
  }
});

async function handleEmojiRequest(text) {
  // Read key from extension local storage
  const data = await chrome.storage.local.get(['geminiApiKey']);
  const apiKey = data.geminiApiKey;
  
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemInstruction = `You are a conversational assistant helping to add flair to text messages. 
Given the user's message, reply with EXACTLY ONE single relevant emoji that fits the tone, meaning, or subject of the message. 
Do not output any text, markdown, or explanations. Only output the single emoji character. If no emoji fits perfectly, default to ✨.`;

  const payload = {
    contents: [{
      parts: [{ text: text }]
    }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 5
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  let emoji = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (emoji) {
    return emoji.trim();
  }
  
  throw new Error("Invalid format returned from Gemini");
}
