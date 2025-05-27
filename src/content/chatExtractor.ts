// Chat data extraction functions for Gemini

export interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

/**
 * Extract chat data from the current Gemini page
 * @returns Array of chat messages in DOM order
 */
export function extractChatData(): ChatMessage[] {
  const chatMessages: ChatMessage[] = [];
  
  try {
    // Try to find all conversation elements in DOM order
    const allConversationElements = document.querySelectorAll('user-query, model-response, dual-model-response');
    
    console.log(`Found ${allConversationElements.length} conversation elements in total`);
    
    if (allConversationElements.length === 0) {
      console.log('Primary selectors found no elements, trying fallback method...');
      return extractFromConversationContainers();
    }
    
    // Extract messages in DOM order
    allConversationElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const text = extractTextFromElement(element);
      
      if (text.trim()) {
        const messageType = tagName === 'user-query' ? 'user' : 'assistant';
        
        chatMessages.push({
          type: messageType,
          content: text.trim(),
          timestamp: new Date().toISOString()
        });
        
        console.log(`[${index}] Extracted ${messageType}: ${text.substring(0, 50)}...`);
      }
    });
    
    console.log(`✅ Successfully extracted ${chatMessages.length} messages in DOM order`);
    return chatMessages;
    
  } catch (error) {
    console.error('Error extracting chat data:', error);
    return [];
  }
}

/**
 * Fallback method: Extract from conversation containers
 */
function extractFromConversationContainers(): ChatMessage[] {
  const chatMessages: ChatMessage[] = [];
  
  try {
    // Look for all possible conversation elements in DOM order
    const allPossibleElements = document.querySelectorAll([
      '.conversation-container',
      '.user-query-container', '.user-query-bubble-container',
      '.response-container', '[class*="response"]',
      '[data-role="user"]', '[data-role="assistant"]'
    ].join(', '));
    
    console.log(`Trying fallback method with ${allPossibleElements.length} potential conversation elements`);
    
    allPossibleElements.forEach((element, index) => {
      const className = element.className;
      const text = extractTextFromElement(element);
      
      if (text.trim()) {
        // Determine message type based on class names or other attributes
        let messageType: 'user' | 'assistant' = 'assistant'; // default
        
        if (className.includes('user') || element.getAttribute('data-role') === 'user') {
          messageType = 'user';
        }
        
        chatMessages.push({
          type: messageType,
          content: text.trim(),
          timestamp: new Date().toISOString()
        });
        
        console.log(`[${index}] Fallback extracted ${messageType}: ${text.substring(0, 50)}...`);
      }
    });
    
    console.log(`✅ Fallback method extracted ${chatMessages.length} messages`);
    return chatMessages;
    
  } catch (error) {
    console.error('Error in fallback extraction:', error);
    return [];
  }
}

/**
 * Extract clean text content from an element
 */
function extractTextFromElement(element: Element): string {
  if (!element) return '';
  
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as Element;
  
  // Remove script and style elements
  const scriptsAndStyles = clone.querySelectorAll('script, style');
  scriptsAndStyles.forEach(el => el.remove());
  
  // Remove specific Gemini UI elements that shouldn't be included in chat content
  const uiElements = clone.querySelectorAll([
    '[data-test-id*="thinking"]',           // Thinking process indicators
    '.thinking-indicator',                   // Thinking indicators
    '[data-test-id="thinking-indicator"]',   // Specific thinking indicators
    'button',                               // Buttons
    '.gemini-toolbar',                      // Toolbar elements
    '.action-buttons',                      // Action buttons
    '.copy-button',                         // Copy buttons
    '.feedback-buttons'                     // Feedback buttons
  ].join(', '));
  
  uiElements.forEach(el => el.remove());
  
  // Get text content and clean it up
  let text = clone.textContent || (clone as HTMLElement).innerText || '';
  
  // Remove specific UI text patterns that appear in Gemini
  const uiTextPatterns = [
    /^思考プロセスを表示/,                    // "思考プロセスを表示" at the beginning
    /思考プロセスを表示$/,                    // "思考プロセスを表示" at the end
    /^コピー$/,                             // "コピー" button text
    /^Copy$/,                              // "Copy" button text
    /^共有$/,                              // "共有" button text
    /^Share$/,                             // "Share" button text
    /^いいね$/,                            // "いいね" button text
    /^よくない$/,                          // "よくない" button text
    /^編集$/,                              // "編集" button text
    /^Edit$/,                              // "Edit" button text
    /^続行$/,                              // "続行" button text
    /^Continue$/,                          // "Continue" button text
    /^再生成$/,                            // "再生成" button text
    /^Regenerate$/                         // "Regenerate" button text
  ];
  
  // Apply UI text pattern removal
  uiTextPatterns.forEach(pattern => {
    text = text.replace(pattern, '');
  });
  
  // Clean up whitespace and line breaks
  return text
    .replace(/\s+/g, ' ')                 // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n')           // Replace multiple newlines with single newline
    .trim();
}

/**
 * Get detailed debugging information about the page structure
 */
export function debugPageStructure(): void {
  console.group('Gemini Page Structure Debug');
  
  console.log('=== Chat History Containers ===');
  console.log('chat-history:', document.querySelectorAll('#chat-history').length);
  console.log('chat-history-scroll-container:', document.querySelectorAll('.chat-history-scroll-container').length);
  console.log('chat-history class:', document.querySelectorAll('.chat-history').length);
  
  console.log('=== User Elements ===');
  console.log('user-query tags:', document.querySelectorAll('user-query').length);
  console.log('user-query-container:', document.querySelectorAll('.user-query-container').length);
  console.log('user-query-bubble-container:', document.querySelectorAll('.user-query-bubble-container').length);
  
  console.log('=== AI Response Elements ===');
  console.log('model-response tags:', document.querySelectorAll('model-response').length);
  console.log('dual-model-response tags:', document.querySelectorAll('dual-model-response').length);
  console.log('response-container:', document.querySelectorAll('.response-container').length);
  
  console.log('=== Conversation Containers ===');
  console.log('conversation-container:', document.querySelectorAll('.conversation-container').length);
  
  console.groupEnd();
}

// Add debug function to window for manual testing
if (typeof window !== 'undefined') {
  (window as any).debugGeminiStructure = debugPageStructure;
  (window as any).extractGeminiChat = extractChatData;
} 
