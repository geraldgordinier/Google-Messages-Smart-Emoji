// Content script injected into Google Messages
console.log('✨ Smart Emoji Extension initialized successfully.');

let debounceTimeout = null;
let currentTarget = null;
let lastAnalyzedText = '';

// Setup floating suggestion UI
const suggestionBubble = document.createElement('div');
suggestionBubble.id = 'smart-emoji-suggest-bubble';
suggestionBubble.style.cssText = `
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  z-index: 999999;
  font-family: -apple-system, sans-serif;
  font-size: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: opacity 0.2s, transform 0.2s;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
`;

// Small inner elements for the bubble
const emojiSpan = document.createElement('span');
emojiSpan.style.fontSize = '20px';
const actionSpan = document.createElement('span');
actionSpan.textContent = 'Add (Tab)';
actionSpan.style.cssText = 'font-size: 12px; color: #64748b; font-weight: 500;';

suggestionBubble.appendChild(emojiSpan);
suggestionBubble.appendChild(actionSpan);
document.body.appendChild(suggestionBubble);

// Central tracking state
let currentSuggestedEmoji = null;

// Handle injection logic
suggestionBubble.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  insertEmoji();
});

// Hide bubble function
function hideBubble() {
  suggestionBubble.style.opacity = '0';
  suggestionBubble.style.transform = 'translateY(10px)';
  suggestionBubble.style.pointerEvents = 'none';
  currentSuggestedEmoji = null;
}

// Function to handle key strokes globally in the DOM
// Google Messages relies on complex DOM, so global event delegation is robust.
// We use 'true' for capture phase to ensure we intercept keystrokes before they are stopped by Google's rich text editor
document.addEventListener('keyup', (e) => {
  const target = e.target;
  
  // Quick dirty check to see if we're in an editable textarea or div
  if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT' && !target.isContentEditable) {
    return;
  }

  // Handle auto-insertion shortcut (Tab)
  if (e.key === 'Tab' && currentSuggestedEmoji) {
    e.preventDefault();
    e.stopPropagation();
    insertEmoji();
    return;
  }

  // Hide bubble if they start deleting heavily or bubble is stale
  if (e.key === 'Escape' || e.key === 'Enter') {
    hideBubble();
    return;
  }

  // Check the text value
  let text = target.value || target.innerText || target.textContent;
  if (!text || text.trim() === '') {
    hideBubble();
    return;
  }

  // We only trigger inference if they pause typing for 800ms
  // Or if they explicitly typed a punctuation that usually ends a sentence.
  clearTimeout(debounceTimeout);
  currentTarget = target;

  debounceTimeout = setTimeout(() => {
    // If text hasn't really changed since last API call, skip processing
    if (text === lastAnalyzedText) return;
    
    // Only analyze if the sentence ends in a space, punctuation, or they stopped entirely.
    analyzeTextAndSuggest(text, target);
  }, 1000);
}, true);

// Tab interference prevention (to capture Tab when bubble is open)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && currentSuggestedEmoji) {
    e.preventDefault(); // Stop normal tab navigation
    e.stopPropagation();
  }
}, true);


async function analyzeTextAndSuggest(text, activeInput) {
  lastAnalyzedText = text;
  
  // Call our background script to securely request inference
  try {
    const response = await chrome.runtime.sendMessage({ action: 'fetchEmoji', text: text });
    
    if (response && response.success && response.emoji) {
      showSuggestionBubble(response.emoji, activeInput);
    } else if (response && response.error === 'API_KEY_MISSING') {
      console.warn('Smart Emoji: Missing Gemini API Key. Click the extension icon to set it.');
    } else if (response) {
      console.error('Smart Emoji Error:', response.error);
    }
  } catch (err) {
    // This catches the "message channel closed" error safely
    // It usually happens if the page unloads, or if the user types rapidly causing the background to skip.
    console.warn("Smart Emoji Extension interrupted:", err.message);
  }
}

function showSuggestionBubble(emoji, activeInput) {
  currentSuggestedEmoji = emoji;
  emojiSpan.textContent = emoji;
  
  // Calculate position just above the text area
  const rect = activeInput.getBoundingClientRect();
  
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;
  
  // Make it visible first so we can measure it
  suggestionBubble.style.display = 'flex';
  suggestionBubble.style.opacity = '1';
  suggestionBubble.style.transform = 'translateY(0)';
  suggestionBubble.style.pointerEvents = 'auto';
  
  // Wait a frame so offsetWidth is available
  requestAnimationFrame(() => {
    // Position right above the textarea, aligned to the right side
    // Fallback to max(0, val) to ensure it stays on screen
    const topPos = Math.max(0, rect.top + scrollY - 45);
    const leftPos = Math.max(0, rect.right + scrollX - suggestionBubble.offsetWidth - 20);
    
    suggestionBubble.style.top = `${topPos}px`;
    suggestionBubble.style.left = `${leftPos}px`;
  });
}

function insertEmoji() {
  if (!currentTarget || !currentSuggestedEmoji) return;
  
  const emoji = currentSuggestedEmoji;
  hideBubble();
  
  // Insert logic
  currentTarget.focus();
  
  // Check if it's a standard textarea/input or a contenteditable div
  if (typeof currentTarget.selectionStart === 'number') {
    // It's a TEXTAREA or standard INPUT
    const start = currentTarget.selectionStart;
    const end = currentTarget.selectionEnd;
    const val = currentTarget.value;
    
    // Insert with a leading space if needed
    const textToInsert = (val.endsWith(' ') ? '' : ' ') + emoji;
    
    currentTarget.setRangeText(textToInsert, start, end, 'end');
    dispatchReactEvents(currentTarget);
  } else if (currentTarget.isContentEditable) {
    // Content editable
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const spaceNode = document.createTextNode(' ');
      const emojiNode = document.createTextNode(emoji);
      
      range.insertNode(emojiNode);
      range.insertNode(spaceNode);
      range.setStartAfter(emojiNode);
      range.setEndAfter(emojiNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      dispatchReactEvents(currentTarget);
    }
  }
}

// Modern SPAs (React/Angular used by Google) require native events to register the value mutation
function dispatchReactEvents(element) {
  element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
