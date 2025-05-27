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
 * Extract clean text content from an element while preserving Markdown formatting
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
  
  // Convert HTML structure to Markdown
  let text = convertHtmlToMarkdown(clone);
  
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
  
  // Clean up excessive whitespace while preserving intentional formatting
  return text
    .replace(/[ \t]+/g, ' ')              // Replace multiple spaces/tabs with single space
    .replace(/\n[ \t]+\n/g, '\n\n')       // Clean up whitespace-only lines
    .replace(/\n{3,}/g, '\n\n')           // Replace multiple newlines with double newline
    .trim();
}

/**
 * Convert HTML structure to Markdown format
 */
function convertHtmlToMarkdown(element: Element): string {
  let result = '';
  
  // Walk through all child nodes
  for (let node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Text node - add as is
      result += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();
      
      switch (tagName) {
        case 'pre':
          // Handle code blocks
          const codeElement = el.querySelector('code');
          if (codeElement) {
            const language = getCodeLanguage(codeElement);
            const codeContent = (codeElement.textContent || '').trim();
            if (codeContent) {
              result += `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
            }
          } else {
            const preContent = (el.textContent || '').trim();
            if (preContent) {
              result += `\n\`\`\`\n${preContent}\n\`\`\`\n\n`;
            }
          }
          break;
          
        case 'code':
          // Handle inline code (only if not inside <pre>)
          if (el.parentElement?.tagName.toLowerCase() !== 'pre') {
            result += `\`${el.textContent || ''}\``;
          }
          break;
          
        case 'br':
          // Line break
          result += '\n';
          break;
          
        case 'p':
          // Paragraph
          result += convertHtmlToMarkdown(el) + '\n\n';
          break;
          
        case 'div':
          // Division - treat as paragraph if it contains significant content
          const divContent = convertHtmlToMarkdown(el);
          if (divContent.trim()) {
            result += divContent + '\n';
          }
          break;
          
        case 'span':
          // Span - inline element, no additional formatting
          result += convertHtmlToMarkdown(el);
          break;
          
        case 'strong':
        case 'b':
          // Bold text
          result += `**${convertHtmlToMarkdown(el)}**`;
          break;
          
        case 'em':
        case 'i':
          // Italic text
          result += `*${convertHtmlToMarkdown(el)}*`;
          break;
          
        case 'h1':
          result += `# ${convertHtmlToMarkdown(el)}\n\n`;
          break;
        case 'h2':
          result += `## ${convertHtmlToMarkdown(el)}\n\n`;
          break;
        case 'h3':
          result += `### ${convertHtmlToMarkdown(el)}\n\n`;
          break;
        case 'h4':
          result += `#### ${convertHtmlToMarkdown(el)}\n\n`;
          break;
        case 'h5':
          result += `##### ${convertHtmlToMarkdown(el)}\n\n`;
          break;
        case 'h6':
          result += `###### ${convertHtmlToMarkdown(el)}\n\n`;
          break;
          
        case 'ul':
          // Unordered list
          result += convertListToMarkdown(el, false) + '\n';
          break;
          
        case 'ol':
          // Ordered list
          result += convertListToMarkdown(el, true) + '\n';
          break;
          
        case 'li':
          // List item - handled by convertListToMarkdown
          break;
          
        case 'blockquote':
          // Quote block
          const quoteContent = convertHtmlToMarkdown(el);
          result += quoteContent.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
          break;
          
        default:
          // For other elements, recursively process content
          result += convertHtmlToMarkdown(el);
          break;
      }
    }
  }
  
  return result;
}

/**
 * Extract programming language from code element classes
 */
function getCodeLanguage(codeElement: Element): string {
  const classList = Array.from(codeElement.classList);
  
  for (const className of classList) {
    // Common patterns: language-xxx, lang-xxx, hljs-xxx
    if (className.startsWith('language-')) {
      return className.replace('language-', '');
    }
    if (className.startsWith('lang-')) {
      return className.replace('lang-', '');
    }
    if (className.startsWith('hljs-')) {
      return className.replace('hljs-', '');
    }
  }
  
  return ''; // No language detected
}

/**
 * Convert HTML list to Markdown format
 */
function convertListToMarkdown(listElement: Element, isOrdered: boolean): string {
  const items = Array.from(listElement.querySelectorAll('li'));
  let result = '';
  
  items.forEach((item, index) => {
    const content = convertHtmlToMarkdown(item).trim();
    if (content) {
      const prefix = isOrdered ? `${index + 1}. ` : '- ';
      // Handle multi-line list items
      const lines = content.split('\n');
      result += prefix + lines[0] + '\n';
      
      // Indent continuation lines
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          result += '  ' + lines[i] + '\n';
        }
      }
    }
  });
  
  return result;
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
