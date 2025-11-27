// src/index.ts
import Dashboard from './lib/dashboard.svelte';
import { initInterceptor } from './core/interceptor';
import { initStore } from './core/store';
// Import global styles as string (Vite will convert CSS to string and assign it to this variable)
import globalStyles from './app.css?inline';
// Import types
import type { MockRule } from './core/types';

let app: Dashboard | null = null;
let shadowHost: HTMLElement | null = null;

export interface PocketMockOptions {
  enable?: boolean;
}

// Export types for TypeScript users
export type { MockRule, MockRequest, DynamicResponseFunction } from './core/types';

/**
 * A utility function to define mock rules with type safety.
 * This function does nothing at runtime, it's purely for TypeScript type inference.
 * @param config An array of MockRule objects.
 * @returns The same array of MockRule objects.
 */
export function defineConfig(config: MockRule[]): MockRule[] {
  return config;
}

export function start(options: PocketMockOptions = {}) {
  // 1. Initialize interceptor core
  initInterceptor();

  // 2. Try to connect to Dev Server to load configuration
  // (If user didn't configure Vite plugin, this request will 404, but doesn't affect basic usage)
  initStore();

  // 3. Mount UI (Shadow DOM)
  mountUI();

  console.log('%c PocketMock Started 🚀', 'color: #00d1b2; font-weight: bold;');
}

function mountUI() {
  if (app) return; // Prevent duplicate mounting

  // Create host
  const hostId = 'pocket-mock-host';
  shadowHost = document.getElementById(hostId);
  if (!shadowHost) {
    shadowHost = document.createElement('div');
    shadowHost.id = hostId;
    shadowHost.style.position = 'fixed';
    shadowHost.style.zIndex = '99999';
    document.body.appendChild(shadowHost);
  }

  const shadow = shadowHost.attachShadow({ mode: 'open' });

  // === Key: Auto-inject styles ===
  // This way users don't need to manually import CSS files
  const styleTag = document.createElement('style');
  styleTag.textContent = globalStyles;
  shadow.appendChild(styleTag);

  // Mount Svelte component
  app = new Dashboard({
    target: shadow,
  });
}