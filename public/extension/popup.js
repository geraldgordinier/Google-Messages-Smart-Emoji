document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load existing key if there is one
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
      showMessage('Please enter an API key', true);
      return;
    }

    // Save configuration
    chrome.storage.local.set({ geminiApiKey: key }, () => {
      showMessage('API Configuration saved successfully!', false);
      
      // Clear message after 2 seconds
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 2000);
    });
  });

  function showMessage(msg, isError) {
    statusDiv.textContent = msg;
    statusDiv.className = isError ? 'error' : 'success';
  }
});
