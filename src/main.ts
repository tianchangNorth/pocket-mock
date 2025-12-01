import Dashboard from './lib/dashboard.svelte'
import { initInterceptor } from './core/interceptor'
import { initStore, rules, addRule, deleteRule, updateRuleResponse } from './core/store';
import { importPostmanCollection } from './core/importers/postman';
import { importOpenAPI } from './core/importers/openapi';
import axios from 'axios';
import { get } from 'svelte/store';

// 1. Initialize interceptor core
initInterceptor();
initStore();

// 2. Mount Svelte application to document.body
const app = new Dashboard({
  target: document.body,
});

export default app;

// === Integration Testing Suite ===

async function runIntegrationTests() {
  console.group('%c 🧪 PocketMock Integration Tests ', 'background: #222; color: #bada55; font-size: 14px; padding: 4px;');
  
  let passed = 0;
  let failed = 0;
  const testIds: string[] = [];

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`%c ✅ PASS: ${message}`, 'color: green');
      passed++;
    } else {
      console.error(`%c ❌ FAIL: ${message}`, 'color: red; font-weight: bold');
      failed++;
    }
  };

  try {
    // --- Test 1: Basic Rule CRUD & Fetch Interception ---
    console.group('Test 1: Basic Rule CRUD & Fetch Interception');
    const testUrl = '/api/test-crud-' + Date.now();
    addRule(testUrl, 'GET', { msg: 'crud-success' });
    
    // Find the rule we just added to track it
    let currentRules = get(rules);
    const rule = currentRules.find(r => r.url === testUrl);
    if (rule) testIds.push(rule.id);
    
    assert(!!rule, 'Rule should be added to store');

    const res = await fetch(testUrl);
    const data = await res.json();
    assert(data.msg === 'crud-success', 'Fetch should interpret basic JSON response');
    console.groupEnd();

    // --- Test 2: XHR Interception ---
    console.group('Test 2: XHR Interception');
    const xhrPromise = new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', testUrl);
      xhr.onload = () => resolve(JSON.parse(xhr.responseText));
      xhr.onerror = reject;
      xhr.send();
    });
    const xhrData = await xhrPromise;
    assert(xhrData.msg === 'crud-success', 'XHR should intercept and return JSON');
    console.groupEnd();

    // --- Test 3: Dynamic Function Response ---
    console.group('Test 3: Dynamic Function Response');
    const dynUrl = '/api/test-dynamic-' + Date.now();
    // We need to pass the function as a string because addRule might serialize it or we want to simulate UI input
    // But addRule takes `any`. If we pass a function, it should work.
    const dynFn = `(req) => ({ 
      body: { 
        received_id: req.query.id, 
        method: req.method 
      } 
    })`;
    addRule(dynUrl, 'GET', dynFn);
    currentRules = get(rules);
    const dynRule = currentRules.find(r => r.url === dynUrl);
    if (dynRule) testIds.push(dynRule.id);

    const dynRes = await fetch(`${dynUrl}?id=999`);
    const dynData = await dynRes.json();
    assert(dynData.received_id === '999', 'Dynamic response should parse query params');
    assert(dynData.method === 'GET', 'Dynamic response should receive method');
    console.groupEnd();

    // --- Test 4: Smart Mock Data ---
    console.group('Test 4: Smart Mock Data');
    const smartUrl = '/api/test-smart-' + Date.now();
    const smartTemplate = {
      "users|2": [
        {
          "id": "@guid",
          "name": "@cname",
          "avatar": "@image(100x100)"
        }
      ]
    };
    addRule(smartUrl, 'POST', smartTemplate);
    currentRules = get(rules);
    const smartRule = currentRules.find(r => r.url === smartUrl);
    if (smartRule) testIds.push(smartRule.id);

    const smartRes = await axios.post(smartUrl);
    const smartData = smartRes.data;
    
    assert(Array.isArray(smartData.users), 'Smart mock should generate array');
    assert(smartData.users.length === 2, 'Smart mock should respect count |2');
    assert(smartData.users[0].id.length > 10, 'Smart mock should generate GUID');
    assert(smartData.users[0].avatar.includes('100x100'), 'Smart mock should generate Image URL with args');
    console.groupEnd();

    // --- Test 5: Import Postman ---
    console.group('Test 5: Postman Import');
    const postmanJson = {
      info: { name: 'Test Collection', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
      item: [{
        name: 'Postman Req',
        request: {
          method: 'PUT',
          url: { raw: 'https://api.example.com/postman/test' },
          body: { mode: 'raw', raw: '{"status":"imported"}' }
        }
      }]
    };
    const importedPostmanRules = importPostmanCollection(postmanJson as any);
    assert(importedPostmanRules.length === 1, 'Postman import should return 1 rule');
    assert(importedPostmanRules[0].method === 'PUT', 'Postman import should map method');
    assert(importedPostmanRules[0].url === 'https://api.example.com/postman/test', 'Postman import should map URL');
    // We don't add these to store to avoid clutter, just checking logic
    console.groupEnd();

    // --- Test 6: Import OpenAPI ---
    console.group('Test 6: OpenAPI Import');
    const openApiJson = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0' },
      paths: {
        '/openapi/users': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    const importedOpenApiRules = importOpenAPI(openApiJson as any);
    assert(importedOpenApiRules.length === 1, 'OpenAPI import should return 1 rule');
    assert(importedOpenApiRules[0].response.id === '@guid', 'OpenAPI import should infer smart mock');
    console.groupEnd();

  } catch (e: any) {
    console.error('Test Suite Crashed:', e);
    failed++;
  } finally {
    // Cleanup
    console.log('Cleaning up test rules...');
    testIds.forEach(id => deleteRule(id));
    
    console.groupEnd();
    console.log(`%c Test Summary: ${passed} Passed, ${failed} Failed `, failed === 0 ? 'background: green; color: white; padding: 4px;' : 'background: red; color: white; padding: 4px;');
    
    if (failed === 0) {
      alert(`🎉 All ${passed} tests passed! Check console for details.`);
    } else {
      alert(`⚠️ ${failed} tests failed. Check console for details.`);
    }
  }
}

// UI Button for Tests
const runTestBtn = document.createElement('button');
runTestBtn.textContent = "▶ Run Integration Tests";
runTestBtn.style.position = "fixed";
runTestBtn.style.bottom = "20px";
runTestBtn.style.left = "20px";
runTestBtn.style.padding = "10px 15px";
runTestBtn.style.backgroundColor = "#646cff";
runTestBtn.style.color = "white";
runTestBtn.style.border = "none";
runTestBtn.style.borderRadius = "6px";
runTestBtn.style.cursor = "pointer";
runTestBtn.style.zIndex = "999999";
runTestBtn.style.fontWeight = "bold";
runTestBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
runTestBtn.onclick = runIntegrationTests;
document.body.appendChild(runTestBtn);

