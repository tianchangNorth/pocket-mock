import type { MockRule } from '../types';
import type { PostmanCollection, PostmanItem } from './types';

/**
 * Converts a Postman Collection to PocketMock rules.
 */
export function importPostmanCollection(collection: PostmanCollection): MockRule[] {
  const rules: MockRule[] = [];

  function processItems(items: PostmanItem[]) {
    items.forEach(item => {
      if (item.item) {
        // It's a folder, recurse
        processItems(item.item);
      } else if (item.request) {
        // It's a request
        const rule = convertRequestToRule(item);
        if (rule) {
          rules.push(rule);
        }
      }
    });
  }

  if (collection && Array.isArray(collection.item)) {
    processItems(collection.item);
  }

  return rules;
}

function convertRequestToRule(item: PostmanItem): MockRule | null {
  if (!item.request) return null;

  const { request, name } = item;
  
  // 1. Extract URL
  let url = '';
  if (typeof request.url === 'string') {
    url = request.url;
  } else if (request.url && request.url.raw) {
    // Basic normalization: remove protocol and host to make it path-relative if preferred?
    // For now, keep full raw URL or path based on preference.
    // Let's try to keep it relative if it looks like an API call, or just use raw.
    // PocketMock matches against full URL or path.
    
    // Postman raw often includes variables like {{base_url}}/api/v1...
    // We should probably replace {{...}} with * or keep them?
    // Let's keep raw for now, users might need to tweak.
    url = request.url.raw;
  }

  // Handle Postman variables {{id}} -> :id (roughly)
  // This is a heuristic.
  url = url.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, ':$1');

  // 2. Extract Method
  const method = request.method || 'GET';

  // 3. Extract Response (Mock Data)
  let response: any = { status: 'ok', message: 'Imported from Postman' };

  // Try to parse body to see if we can echo it or infer structure?
  if (request.body && request.body.mode === 'raw' && request.body.raw) {
    try {
      const reqBody = JSON.parse(request.body.raw);
      if (method === 'POST' || method === 'PUT') {
         // Enhance the body with smart mock generators
         response = enhanceMockData(reqBody);
         // Ensure ID is present for creation
         if (!response.id) {
            response.id = '@guid';
         }
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    id: generateId(),
    url,
    method,
    status: 200,
    delay: 0,
    enabled: true,
    headers: { 'Content-Type': 'application/json' },
    response: response
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Recursively traverses an object and replaces values with Smart Mock placeholders
 * based on key names (inference).
 */
function enhanceMockData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => enhanceMockData(item));
  }
  if (data !== null && typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = inferMockValue(key, data[key]);
      }
    }
    return result;
  }
  return data;
}

function inferMockValue(key: string, value: any): any {
  // If value is complex, recurse
  if (typeof value === 'object' && value !== null) {
    return enhanceMockData(value);
  }

  // If already a smart mock string, leave it
  if (typeof value === 'string' && value.startsWith('@')) {
    return value;
  }

  const lowerKey = key.toLowerCase();

  // Heuristics for common fields
  if (lowerKey === 'id' || lowerKey.endsWith('_id')) return '@guid';
  if (lowerKey.includes('name')) return '@cname'; // Or @string(5)
  if (lowerKey.includes('avatar') || lowerKey.includes('image') || lowerKey.includes('photo')) return '@image(200x200)';
  if (lowerKey.includes('time') || lowerKey.includes('date') || lowerKey.includes('at')) return '@date';
  if (lowerKey.includes('intro') || lowerKey.includes('desc')) return '@string(20)';
  if (lowerKey.includes('num') || lowerKey.includes('count') || lowerKey.includes('age')) return '@integer(1,100)';
  if (lowerKey.includes('is') || lowerKey.includes('has')) return '@boolean';

  // Default: return original value
  return value;
}

