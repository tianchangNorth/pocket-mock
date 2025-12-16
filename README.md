<div align="center">

# PocketMocker

<p>
  <a href="https://www.npmjs.com/package/pocket-mocker" target="_blank">
    <img src="https://img.shields.io/npm/v/pocket-mocker?style=for-the-badge&logo=npm" alt="NPM Version" />
  </a>
  <a href="https://github.com/tianchangNorth/pocket-mocker/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/tianchangNorth/pocket-mocker?style=for-the-badge&color=blue" alt="License" />
  </a>
  <a href="https://github.com/tianchangNorth/pocket-mocker/actions/workflows/ci.yml" target="_blank">
    <img src="https://img.shields.io/github/actions/workflow/status/tianchangNorth/pocket-mocker/ci.yml?branch=main&style=for-the-badge&logo=github" alt="CI Status" />
  </a>
</p>

<p>
  <a href="https://tianchangnorth.github.io/pocket-mocker/" target="_blank">
    <strong>Live Demo</strong>
  </a>
  ·
  <a href="#installation">Installation</a>
  ·
  <a href="#quick-start">Quick Start</a>
  .
  <a href="#contributing--contact">Contributing & Contact</a>
  ·
  <a href="https://github.com/tianchangNorth/pocket-mocker/discussions"> Discussions</a>
</p>

<p>
  <strong>English</strong> · <a href="docs/README.zh-CN.md">中文</a>
</p>

</div>

## What is PocketMocker?

**PocketMocker** is the **In-Page API Mocking & Debugging Tool** built for frontend developers.

It embeds a powerful control panel directly into your browser, allowing you to intercept, mock, and tweak HTTP responses in real-time. It bridges the gap between API design and UI implementation.

---

## Core Capabilities: Total HTTP Control

PocketMocker gives you **God-mode access** to your HTTP requests. Stop waiting for the backend—you are the master of your network.

### Timing Control
*   **Latency Simulation**: Set precise millisecond delays to test loading states.
*   **Race Condition Testing**: Deliberately make request B return before request A to verify if your code handles async race conditions correctly.
*   **Infinite Loading**: Set a massive delay to focus on polishing your Skeleton screens and loading animations.

### Status Forcing
*   **Instant Errors**: Force endpoints to return 500, 503, or 404 to verify Error Boundaries and fallback UIs.
*   **Auth Simulation**: Force return 401 (Unauthorized) or 403 (Forbidden) to test login redirects and permission guards.
*   **Lock Empty State**: Force return 204 or an empty array to tweak the layout of your "No Data" pages.

### Payload Manipulation
*   **Data Injection**: Inject extremely long text, boundary values, or special characters in real-time to test UI robustness.
*   **Type Chaos**: Field expected a `number` but got a `string`? Value expected to be present but is `null`? Reproduce these backend "surprises" instantly to ensure your frontend doesn't crash.

---

## Common Debugging Scenarios

*   ✅ **The "Infinite Loading" Test**: Set a huge delay to fine-tune every frame of your loading animation.
*   ✅ **The "Chaos Monkey" Test**: Randomly toggle success/failure states to test app resilience.
*   ✅ **The "Massive Data" Test**: Use smart generation syntax to create lists with 1000+ items instantly to test virtualization and scrolling performance.

---

https://github.com/user-attachments/assets/e7501191-7ef1-4bd4-bd21-6500585fe4ad.mp4

## Why PocketMocker?

**Use Apifox / Postman for:**
*   API Design & Documentation
*   Backend Contract Testing
*   Team-level API Management

**Use PocketMocker for:**
*   **Rapid UI Development**: "I need this list to be empty *right now*."
*   **Visual Debugging**: "Why is my error boundary not showing up?"
*   **Zero Context Switching**: Stay in your browser, stay in the flow.
*   **Git-Friendly**: Share mock rules via config files, just like your code.

---

## Installation

```bash
npm install pocket-mocker --save-dev
# or
yarn add pocket-mocker -D
# or
pnpm add pocket-mocker -D
```

---

## Quick Start

### Method 1: Zero Configuration (Local Mode)

Perfect for individual development or quick experimentation. Simply import and start in your project's entry file:

```javascript
import { pocketMock } from 'pocket-mocker';

// Only start in development environment
if (process.env.NODE_ENV === 'development') {
  pocketMock();
}
```

After starting your project, you'll see the **PocketMock** floating panel in the bottom-right corner.

### Method 2: Team Collaboration Mode (Vite Plugin) 🔥 Recommended

Ideal for production-level projects. The Vite plugin integrates with the file system, saving Mock rules to config files for team sharing.

**1. Import and start in your project's entry file:**

```javascript
import { pocketMock } from 'pocket-mocker';

if (process.env.NODE_ENV === 'development') {
  pocketMock();
}
```

**2. Configure `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import pocketMockPlugin from 'pocket-mocker/vite-plugin';

export default defineConfig({
  plugins: [
    pocketMockPlugin()
  ]
});
```

**3. Start Development**

Run `npm run dev`. PocketMock automatically detects the plugin environment and switches to **Server Mode**.

---

## Advanced Features

### Smart Mock Data Generation

PocketMock includes a powerful **Smart Mock Generator** that allows you to create realistic test data with simple template syntax.

#### Cheat Sheet

| Syntax | Description | Example |
|:---|:---|:---|
| **Basic** |
| `@guid` | UUID | `"f47ac-..."` |
| `@integer(min,max)` | Random Integer | `@integer(1,100)` → `42` |
| `@float(min,max,decimals)` | Random Float | `@float(0,1,2)` → `0.57` |
| `@boolean` | Random Boolean | `true` |
| `@string(length)` | Random String | `@string(8)` → `"aX9bK2pQ"` |
| **Personal** |
| `@name` | Random Name | `"John"` |
| `@email(domains)` | Random Email | `@email(gmail.com,yahoo.com)` |
| `phone(countryCode)` | Phone Number | `@phone(+1)` → `+1234567890` |
| **Date/Time** |
| `@date(start,end)` | Random Date | `@date(2023-01-01,2024-12-31)` |
| **Media** |
| `@image(width,height)` | Placeholder Image | `@image(200x200)` |
| `@color` | Random Color | `"#a3f4c2"` |
| **Text** |
| `@text(wordCount)` | Random Text | `@text(15)` → `"The quick brown fox..."` |
| `@pick(A,B,C)` | Random Pick | `@pick(apple,banana,orange)` |
| **Location** |
| `@address(countries)` | Address Object | `@address(US,UK)` |
| **Business** |
| `@company(industries)` | Company Object | `@company(Tech,Finance)` |
| `@url(tlds)` | Random URL | `@url(com,io)` → `"https://example.com"` |
| **Array** |
| See examples below | Array generation syntax | Use code blocks to avoid format conflicts |

**Array Syntax Examples:**
```javascript
{
  "users|3-5": {       // 3 to 5 users
    "id": "@guid",
    "name": "@name"
  },
  "scores|10": "@integer(60,100)"  // Array of 10 scores
}
```

#### Usage Example

```javascript
{
  "code": 0,
  "data": {
    "users|5": { // Generate array with 5 users
      "id": "@guid",
      "name": "@name",
      "avatar": "@image(100x100)",
      "role": "@pick(admin,guest,editor)",
      "score": "@integer(60,100)"
    }
  }
}
```

### Config Import

Import mock rules directly from popular API documentation formats with auto-conversion.

- **Supported Formats**: Postman Collection v2.1.0, OpenAPI 3.0 (Swagger)
- **Smart Conversion**:
  - `user_id` -> `@guid`
  - `avatar` -> `@image`
  - `{{baseUrl}}/users` -> `/users`

**How to use**: Click the "Import" button in the dashboard header and select your JSON file.

### Dynamic Response (Function Mock)

You are not limited to static JSON. You can write JavaScript functions to generate responses dynamically based on request!

```javascript
(req) => {
  // Dynamic response based on Query parameters
  if (req.query.id === '1') {
    return { id: 1, name: 'Admin', role: 'admin' };
  }

  // Dynamic response based on Body content
  if (req.body?.type === 'error') {
    return {
      status: 400,
      body: { message: 'Invalid Parameter' }
    };
  }

  // Default response
  return { id: 2, name: 'Guest' };
}
```

### Comprehensive Network Panel

The built-in Network panel logs all network requests (both mocked and real) in real-time, providing powerful debugging capabilities:

- **View Details**: Click logs to view full Request/Response Body.
- **One-Click Mock**: Click the "Mock" button on any log to instantly convert a real request into a mock rule.
- **Filter**: Filter logs by URL, Method, or Mock status.

---

## Technical Architecture

- **Monkey Patching**: Intercepts requests by overriding `window.fetch` and extending `XMLHttpRequest` prototype chain.
- **Shadow DOM**: Encapsulates debugging UI in Shadow Root for complete style sandboxing.
- **Vite Library Mode**: Uses Vite's library mode with `css: 'injected'` strategy to inline all CSS into JS for **single-file import** experience.

---

## Roadmap

Check out our [Roadmap](ROADMAP.md) to see what's next for PocketMocker and how you can contribute to its future!

---

## Contributing & Contact

We welcome all contributions to PocketMocker! Whether it's reporting bugs, suggesting new features, improving documentation, or submitting code, your help is greatly appreciated.

Please read our [Contribution Guidelines](CONTRIBUTING.md) for details on how to get started.

### Contact Me

If you have any questions, suggestions, or would like to connect, feel free to reach out:

- **Twitter (X)**: [https://x.com/tiancha79267301](https://x.com/tiancha79267301)
- **WeChat**
<div align="center">
  <img src="https://res.oafimg.cn/-/f69b6474980d7347/wechat.jpg" alt="My WeChat" width="150px">
</div>

---

## License

MIT © [tianchangNorth](https://github.com/tianchangNorth)

---

<div align="center">

**Master HTTP, Master Your Frontend!**

</div>