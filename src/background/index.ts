// Background Script for Gemini Chat Exporter
// This serves as the service worker for the Chrome extension

console.log('Gemini Chat Exporter Background Script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('Background received message:', message);
  
  // For future expansion - currently popup handles everything directly
  return false;
}); 
