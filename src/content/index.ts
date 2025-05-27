// Content script for Gemini Chat Exporter
import { extractChatData, debugPageStructure } from './chatExtractor';

console.log('🟢 Gemini Chat Exporter: Content script loaded');
console.log('🔍 Current hostname:', window.location.hostname);
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Document ready state:', document.readyState);

// Check if we're on a Gemini page
if (window.location.hostname === 'gemini.google.com') {
  console.log('✅ Gemini Chat Exporter: Running on Gemini page');
  console.log('🔗 Current URL:', window.location.href);
  
  // Wait for page to load completely
  if (document.readyState === 'loading') {
    console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeExtractor);
  } else {
    console.log('✅ Document already loaded, initializing immediately...');
    initializeExtractor();
  }
} else {
  console.log('❌ Not on Gemini page, hostname:', window.location.hostname);
}

// Add message listener for communication with popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('📨 Content script received message:', message);
  
  // Handle getChatData message from popup
  if (message.type === 'getChatData') {
    console.log('🔍 Extracting chat data...');
    
    try {
      const chatData = extractChatData();
      console.log('✅ Successfully extracted chat data:', chatData);
      
      // Send response back to popup
      sendResponse({
        success: true,
        data: chatData,
        messageCount: chatData.length
      });
    } catch (error) {
      console.error('❌ Error extracting chat data:', error);
      
      // Send error response back to popup
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: []
      });
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
  
  // Handle other message types if needed
  console.log('⚠️ Unknown message type:', message.type);
  sendResponse({
    success: false,
    error: 'Unknown message type',
    data: []
  });
  
  return true;
});

function initializeExtractor() {
  console.log('🚀 Gemini Chat Exporter: Initializing chat extractor');
  
  // Add debug functions to window for manual testing
  (window as any).debugGeminiStructure = debugPageStructure;
  (window as any).extractGeminiChat = extractChatData;
  
  console.log('✅ Debug functions added to window object');
  console.log('💡 You can now run: debugGeminiStructure() or extractGeminiChat()');
  
  // Test extraction after a short delay to ensure page is fully loaded
  setTimeout(() => {
    console.log('🔍 Gemini Chat Exporter: Testing chat extraction...');
    try {
      debugPageStructure();
      
      const chatData = extractChatData();
      console.log('📊 Extracted chat data:', chatData);
      
      if (chatData.length > 0) {
        console.log('✅ Successfully extracted', chatData.length, 'messages');
      } else {
        console.log('⚠️ No chat messages found');
      }
    } catch (error) {
      console.error('❌ Error during extraction test:', error);
    }
  }, 3000);
} 
