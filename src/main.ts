import Dashboard from './lib/dashboard.svelte'
import { initInterceptor } from './core/interceptor'
import { initStore } from './core/store';
import axios from 'axios';

// 1. Initialize interceptor core
initInterceptor();
initStore();
// 2. Mount Svelte application to document.body
const app = new Dashboard({
  target: document.body,
});

export default app;

// 创建测试按钮
const testBtn = document.createElement('button');
testBtn.textContent = "测试：fetch 请求 /todos/1";
testBtn.style.position = "fixed";
testBtn.style.bottom = "20px";
testBtn.style.left = "20px";
testBtn.style.padding = "10px 15px";
testBtn.style.backgroundColor = "#007bff";
testBtn.style.color = "white";
testBtn.style.border = "none";
testBtn.style.borderRadius = "5px";
testBtn.style.cursor = "pointer";
testBtn.style.zIndex = "999999";
document.body.appendChild(testBtn);

const axiosTestBtn = document.createElement('button');
axiosTestBtn.textContent = "测试：axios 请求 /api/demo?id=1";
axiosTestBtn.style.position = "fixed";
axiosTestBtn.style.bottom = "70px";
axiosTestBtn.style.left = "20px";
axiosTestBtn.style.padding = "10px 15px";
axiosTestBtn.style.backgroundColor = "#28a745";
axiosTestBtn.style.color = "white";
axiosTestBtn.style.border = "none";
axiosTestBtn.style.borderRadius = "5px";
axiosTestBtn.style.cursor = "pointer";
axiosTestBtn.style.zIndex = "999999";
document.body.appendChild(axiosTestBtn);

const axiosTestBtn2 = document.createElement('button');
axiosTestBtn2.textContent = "测试：axios 请求 /todos/1";
axiosTestBtn2.style.position = "fixed";
axiosTestBtn2.style.bottom = "120px";
axiosTestBtn2.style.left = "20px";
axiosTestBtn2.style.padding = "10px 15px";
axiosTestBtn2.style.backgroundColor = "#dc3545";
axiosTestBtn2.style.color = "white";
axiosTestBtn2.style.border = "none";
axiosTestBtn2.style.borderRadius = "5px";
axiosTestBtn2.style.cursor = "pointer";
axiosTestBtn2.style.zIndex = "999999";
document.body.appendChild(axiosTestBtn2);

// 测试按钮功能
async function testFetch() {
  console.log("=== fetch 测试 ===");
  console.log("发起 fetch 请求到 /todos/1");
  try {
    const res = await fetch('/todos/1');
    const data = await res.json();
    console.log("fetch 响应数据:", data);

    alert(`Fetch 收到响应数据:\n${JSON.stringify(data, null, 2)}`);
  } catch (e) {
    console.error("fetch 请求失败:", e);
    alert('Fetch 请求失败');
  }
}

async function testAxiosDemo() {
  console.log("=== axios 测试1 - /api/demo (应该被mock) ===");

  try {
    const res = await axios.get('/api/demo?id=1');
    console.log("✅ axios /api/demo 响应数据:", res.data);
    console.log("✅ axios 响应状态:", res.status);

    alert(`✅ Axios /api/demo 收到响应:\n${JSON.stringify(res.data, null, 2)}\n\n状态码: ${res.status}`);
  } catch (e: any) {
    console.error("❌ axios /api/demo 请求失败:", e.message);
    alert(`❌ Axios /api/demo 请求失败:\n${e.message}`);
  }
}

async function testAxiosTodos() {
  console.log("=== axios 测试2 - /todos/1 (真实请求) ===");
  console.log("发起 axios 请求到 https://jsonplaceholder.typicode.com/todos/1");
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log("axios /todos/1 响应数据:", res.data);
    console.log("axios 响应状态:", res.status);

    alert(`Axios /todos/1 收到响应:\n${JSON.stringify(res.data, null, 2)}\n\n状态码: ${res.status}`);
  } catch (e: any) {
    console.error("axios /todos/1 请求失败:", e);
    if (e.response) {
      console.error("错误响应:", e.response.data);
      console.error("错误状态:", e.response.status);
    }
    alert(`Axios /todos/1 请求失败:\n${e.message}`);
  }
}

testBtn.onclick = testFetch;
axiosTestBtn.onclick = testAxiosDemo;
axiosTestBtn2.onclick = testAxiosTodos;

// 自动测试请求
setTimeout(async () => {
  try {
    const res = await axios.get('/api/demo?id=1');
    console.log("🎉 自动测试成功! 响应数据:", res.data);
  } catch (e: any) {
    console.error("❌ 自动测试失败:", e.message);
  }
}, 1500);
