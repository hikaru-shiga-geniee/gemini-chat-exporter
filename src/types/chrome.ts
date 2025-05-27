// Chrome extension API type definitions

/// <reference types="chrome" />

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export interface ChromeTab {
  id?: number;
  url?: string;
  active?: boolean;
  windowId?: number;
}

export interface ChromeMessage {
  type: string;
  [key: string]: any;
}

export interface ChromeResponse {
  success: boolean;
  data?: any;
  error?: string;
  [key: string]: any;
} 
