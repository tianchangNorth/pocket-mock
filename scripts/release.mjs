#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

// 获取当前版本号
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log('🚀 开始发布流程...');
console.log(`📦 当前版本: ${currentVersion}`);

// 1. 检查构建状态
console.log('🔧 检查构建中...');
try {
  const buildResult = execSync('npm run build', { encoding: 'utf8' });
  // Check if build contains error keywords, not just warnings
  if (buildResult.includes('ERROR') || buildResult.includes('error') || buildResult.includes('failed')) {
    console.error('❌ 构建失败，请修复错误后重试');
    console.error(buildResult);
    process.exit(1);
  }
  console.log('✅ 构建成功');
} catch (error) {
  console.error('❌ 构建失败，请修复错误后重试');
  console.error(error.message);
  process.exit(1);
}

// 2. 运行测试
console.log('🧪 运行测试中...');
try {
  const testResult = execSync('npm test', { encoding: 'utf8' });
  // Check if test contains error keywords, not just warnings
  if (testResult.includes('FAIL') || testResult.includes('failed') || testResult.includes('error')) {
    console.error('❌ 测试失败，请修复测试用例后重试');
    console.error(testResult);
    process.exit(1);
  }
  console.log('✅ 测试通过');
} catch (error) {
  console.error('❌ 测试失败，请修复测试用例后重试');
  console.error(error.message);
  process.exit(1);
}

// 3. 更新版本号（补丁版本）
console.log('📝 更新版本号...');
const timestamp = Math.floor(Date.now() / 1000);
const patchVersion = `${currentVersion}.${timestamp}`;
console.log(`📦 新版本: ${patchVersion}`);

// 更新 package.json 版本
const packageJsonPath = './package.json';
const packageData = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageData.version = patchVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));
console.log('✅ 版本已更新到 package.json');

// 4. 提交并推送更改
console.log('📝 提交更改中...');
execSync('git add .', { encoding: 'utf8' });
execSync(`git commit -m "feat: 发布v${patchVersion}版本 - 更新GIF演示和修复TypeScript错误"`, { encoding: 'utf8' });

// 5. 创建发布标签
console.log('📦 创建发布标签...');
execSync(`git tag v${patchVersion} -m "发布v${patchVersion}"`, { encoding: 'utf8' });

// 6. 发布到npm
console.log('🚀 发布到npm...');
execSync('npm publish --registry https://registry.npmjs.org/', { encoding: 'utf8' });

// 7. 清理
console.log('✅ 发布完成！');
console.log(`📦 包名: pocket-mocker`);
console.log(`📦 版本: ${patchVersion}`);