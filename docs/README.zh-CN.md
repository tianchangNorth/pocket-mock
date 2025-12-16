<div align="center">

# PocketMocker

<p>
  <a href="https://www.npmjs.com/package/pocket-mocker" target="_blank">
    <img src="https://img.shields.io/npm/v/pocket-mocker?style=for-the-badge&logo=npm" alt="NPM 版本" />
  </a>
  <a href="https://github.com/tianchangNorth/pocket-mocker/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/tianchangNorth/pocket-mocker?style=for-the-badge&color=blue" alt="开源协议" />
  </a>
  <a href="https://github.com/tianchangNorth/pocket-mocker/actions/workflows/ci.yml" target="_blank">
    <img src="https://img.shields.io/github/actions/workflow/status/tianchangNorth/pocket-mocker/ci.yml?branch=main&style=for-the-badge&logo=github" alt="CI 状态" />
  </a>
</p>

<p>
  <a href="https://tianchangnorth.github.io/pocket-mocker/" target="_blank">
    <strong>🚀 在线演示</strong>
  </a>
  ·
  <a href="#安装">安装</a>
  ·
  <a href="#快速开始">快速开始</a>
  ·
  <a href="#贡献与联系">贡献与联系</a>
  ·
  <a href="https://github.com/tianchangNorth/pocket-mocker/discussions">讨论</a>
</p>

<p>
  <a href="../README.md">English</a> · <strong>中文</strong>
</p>

</div>

## PocketMocker 是什么？

**PocketMocker** 是一款专为前端开发者打造的 **页面内 (In-Page) API Mock 与调试工具**。

它将一个强大的控制面板直接嵌入到你的浏览器中，让你能在开发过程中实时拦截、Mock 和微调 HTTP 响应。它是连接 API 设计与 UI 实现的桥梁。

---

## 核心能力：全方位 HTTP 控制

PocketMocker 赋予你对 HTTP 请求的**上帝视角**。不再被动等待后端，你就是网络的主宰。

### 时序控制 (Timing Control)
*   **网络延迟模拟**：精确设置毫秒级延迟，测试 Loading 状态。
*   **竞态条件测试**：故意让请求 B 比请求 A 先返回，验证你的代码是否处理了异步竞态问题。
*   **无限加载**：将延迟设为极大，专心打磨骨架屏（Skeleton）的动画细节。

### 状态强制 (Status Forcing)
*   **一键报错**：强制接口返回 500、503 或 404，验证错误边界（Error Boundary）和降级 UI。
*   **权限模拟**：强制返回 401（未授权）或 403（禁止访问），测试登录跳转和权限提示逻辑。
*   **空状态锁死**：强制返回 204 或空数组，调整“暂无数据”页面的布局。

### 载荷篡改 (Payload Manipulation)
*   **数据注入**：实时修改响应 JSON，注入超长文本、极端数值或特殊字符，测试 UI 健壮性。
*   **类型混沌**：本该返回 `number` 的字段返回了 `string`？本该有值的字段返回了 `null`？用 PocketMocker 提前复现这些后端“锅”，确保前端不白屏。

---

## 常见调试场景

*   ✅ **“无限 Loading”测试**：设置超长延迟，微调加载动画的每一帧。
*   ✅ **“混沌状态”测试**：随机切换接口的成功/失败状态，测试应用的容错能力。
*   ✅ **“海量数据”测试**：利用智能生成语法，一键生成 1000+ 条列表数据，测试长列表滚动的性能。

---

https://github.com/user-attachments/assets/e7501191-7ef1-4bd4-bd21-6500585fe4ad.mp4

## 为什么选择 PocketMocker？

**什么时候用 Apifox / Postman？**
*   API 设计与文档撰写
*   后端契约测试
*   团队级 API 生命周期管理

**什么时候用 PocketMocker？**
*   **极速 UI 开发**：“我现在就需要让这个列表变空。”
*   **可视化调试**：“为什么我的错误边界（Error Boundary）没有显示？”
*   **零上下文切换**：留在浏览器里，保持心流状态。
*   **Git 友好**：像共享组件代码一样，通过配置文件共享 Mock 规则。

---

## 安装

```bash
npm install pocket-mocker --save-dev
# 或者
yarn add pocket-mocker -D
# 或者
pnpm add pocket-mocker -D
```

---

## 快速开始

### 方式一：零配置使用（本地模式）

适合个人开发或快速尝试。直接在项目的入口文件中引入并启动：

```javascript
import { pocketMock } from 'pocket-mocker';

// 仅在开发环境中启动
if (process.env.NODE_ENV === 'development') {
  pocketMock();
}
```

启动项目后，页面右下角会出现 **PocketMocker** 浮窗。

### 方式二：团队协作模式（Vite 插件）🔥 推荐

适合生产级项目。通过 Vite 插件打通文件系统，将 Mock 规则保存为配置文件，方便团队共享。

**1. 在入口文件引入**

```javascript
import { pocketMock } from 'pocket-mocker';

if (process.env.NODE_ENV === 'development') {
  pocketMock();
}
```

**2. 配置 `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import pocketMockPlugin from 'pocket-mocker/vite-plugin';

export default defineConfig({
  plugins: [
    pocketMockPlugin()
  ]
});
```

**3. 启动开发**

运行 `npm run dev`。PocketMock 会自动检测插件环境并切换到 **服务器模式**。

---

## 进阶功能

### 智能 Mock 数据生成

PocketMock 内置强大的 **智能 Mock 生成器**，使用简单语法即可生成逼真的测试数据。

#### 速查表

| 语法 | 描述 | 示例 |
|:---|:---|:---|
| **基础类型** |
| `@guid` | UUID | `"f47ac-..."` |
| `@integer(min,max)` | 随机整数 | `@integer(1,100)` → `42` |
| `@float(min,max,decimals)` | 随机浮点数 | `@float(0,1,2)` → `0.57` |
| `@boolean` | 随机布尔值 | `true` |
| `@string(length)` | 随机字符串 | `@string(8)` → `"aX9bK2pQ"` |
| **个人信息** |
| `@name` | 随机姓名 | `"张三"` |
| `@email(domains)` | 随机邮箱 | `@email(gmail.com,yahoo.com)` |
| `@phone(countryCode)` | 电话号码 | `@phone(+86)` → `+86139********` |
| **日期时间** |
| `@date(start,end)` | 随机日期 | `@date(2023-01-01,2024-12-31)` |
| **媒体资源** |
| `@image(width,height)` | 占位图片 | `@image(200x200)` |
| `@color` | 随机颜色 | `"#a3f4c2"` |
| **文本内容** |
| `@text(wordCount)` | 随机文本 | `@text(15)` → `"这是一个随机生成的文本..."` |
| `@pick(A,B,C)` | 随机选择 | `@pick(苹果,香蕉,橙子)` |
| **地理位置** |
| `@address(countries)` | 地址对象 | `@address(中国,美国)` |
| **商业信息** |
| `@company(industries)` | 公司对象 | `@company(科技,金融)` |
| `@url(tlds)` | 随机 URL | `@url(com,cn)` → `"https://example.com"` |
| **数组语法** |
| 见下方示例 | 数组生成语法 | 使用代码块避免格式冲突 |

**数组语法示例:**
```javascript
{
  "users|3-5": {       // 生成3到5个用户
    "id": "@guid",
    "name": "@name"
  },
  "scores|10": "@integer(60,100)"  // 生成10个分数的数组
}
```

#### 使用示例

```javascript
{
  "code": 0,
  "data": {
    "users|5": { // 生成包含 5 个用户的数组
      "id": "@guid",
      "name": "@name",
      "avatar": "@image(100x100)",
      "role": "@pick(管理员,访客,编辑)",
      "score": "@integer(60,100)"
    }
  }
}
```

### 配置导入

支持直接导入 API 文档，自动转换并生成智能 Mock 数据。

- **支持格式**: Postman Collection v2.1.0, OpenAPI 3.0 (Swagger)
- **智能转换**:
  - `user_id` -> `@guid`
  - `avatar` -> `@image`
  - `{{baseUrl}}/users` -> `/users`

**使用方法**: 点击控制台顶部的"导入"按钮，选择 JSON 文件即可。

### 动态响应（函数 Mock）

不再局限于静态 JSON！你可以编写 JavaScript 函数来根据请求动态生成响应。

```javascript
(req) => {
  // 根据 Query 参数动态返回
  if (req.query.id === '1') {
    return { id: 1, name: '管理员', role: 'admin' };
  }

  // 根据 Body 内容判断
  if (req.body?.type === 'error') {
    return {
      status: 400,
      body: { message: '参数错误' }
    };
  }

  // 默认返回
  return { id: 2, name: '访客' };
}
```

### 功能全面的网络面板

内置的网络面板将实时记录所有网络请求（包括 Mocked 和真实请求），提供强大的调试功能：

- **查看详情**: 点击日志查看完整的 Request/Response Body
- **一键 Mock**: 点击日志上的"Mock"按钮，将真实请求直接转换为 Mock 规则
- **筛选**: 支持按 URL、方法、Mock 状态筛选

---

## 技术原理

- **猴子补丁**: 通过重写 `window.fetch` 和扩展 `XMLHttpRequest` 原型链来拦截请求
- **Shadow DOM**: 使用 Shadow Root 封装调试 UI，实现样式完全沙箱化
- **Vite 库模式**: 使用 Vite 的库模式和 `css: 'injected'` 策略，将 CSS 内联到 JS 中，实现**单文件导入**体验

---

## 项目路线图

查看我们的 [项目路线图](ROADMAP.zh-CN.md)，了解 PocketMocker 的未来规划以及如何参与贡献！

---

## 贡献与联系

我们欢迎所有对 PocketMocker 的贡献！无论是报告 Bug、提出新功能建议、改进文档还是提交代码，您的帮助都将使 PocketMocker 变得更好。

请阅读我们的 [贡献指南](CONTRIBUTING.zh-CN.md) 了解如何参与项目。

### 联系我

如果您有任何疑问、建议或想加入交流，欢迎通过以下方式联系：

- **Twitter (X)**: [https://x.com/tiancha79267301](https://x.com/tiancha79267301)
- **微信**
<div align="center">
  <img src="https://res.oafimg.cn/-/f69b6474980d7347/wechat.jpg" alt="我的微信" width="150px">
</div>

---

## 开源协议

MIT © [tianchangNorth](https://github.com/tianchangNorth)

---

<div align="center">

**掌控 HTTP，主宰你的前端！**

</div>