// Chat data extraction functions for Gemini

export interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

/**
 * Extract chat data from the current Gemini page
 * @returns Array of chat messages
 */
export function extractChatData(): ChatMessage[] {
  const chatMessages: ChatMessage[] = [];
  
  try {
    // Try primary selectors first
    const userQueries = document.querySelectorAll('user-query');
    const modelResponses = document.querySelectorAll('model-response, dual-model-response');
    
    console.log(`Found ${userQueries.length} user queries and ${modelResponses.length} model responses`);
    
    // If primary selectors don't work, try conversation container approach
    if (userQueries.length === 0 && modelResponses.length === 0) {
      return extractFromConversationContainers();
    }
    
    // Extract user queries
    userQueries.forEach((element) => {
      const text = extractTextFromElement(element);
      if (text.trim()) {
        chatMessages.push({
          type: 'user',
          content: text.trim(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Extract model responses
    modelResponses.forEach((element) => {
      const text = extractTextFromElement(element);
      if (text.trim()) {
        chatMessages.push({
          type: 'assistant',
          content: text.trim(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Sort messages by their DOM order
    return sortMessagesByDOMOrder(chatMessages);
    
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
    const containers = document.querySelectorAll('.conversation-container');
    console.log(`Trying fallback method with ${containers.length} conversation containers`);
    
    containers.forEach(container => {
      // Look for user queries in container
      const userElements = container.querySelectorAll('.user-query-container, .user-query-bubble-container');
      userElements.forEach(element => {
        const text = extractTextFromElement(element);
        if (text.trim()) {
          chatMessages.push({
            type: 'user',
            content: text.trim(),
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Look for model responses in container
      const responseElements = container.querySelectorAll('.response-container, [class*="response"]');
      responseElements.forEach(element => {
        const text = extractTextFromElement(element);
        if (text.trim()) {
          chatMessages.push({
            type: 'assistant',
            content: text.trim(),
            timestamp: new Date().toISOString()
          });
        }
      });
    });
    
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
  
  // Get text content and clean it up
  const text = clone.textContent || (clone as HTMLElement).innerText || '';
  
  // Clean up whitespace and line breaks
  return text
    .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines with single newline
    .trim();
}

/**
 * Sort messages by their appearance order in the DOM
 */
function sortMessagesByDOMOrder(messages: ChatMessage[]): ChatMessage[] {
  // For now, return as-is since we're extracting in DOM order
  // This can be enhanced later if needed
  return messages;
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
