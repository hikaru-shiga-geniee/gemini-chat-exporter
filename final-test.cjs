/**
 * Gemini Chat Exporter - Final Test Script
 * 
 * このスクリプトは、Chrome拡張機能が正しくビルドされ、
 * 必要なファイルがすべて揃っているかを確認します。
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Gemini Chat Exporter - Final Test');
console.log('=====================================\n');

const distPath = path.join(__dirname, 'dist');

// 必要なファイルのリスト
const requiredFiles = [
  'manifest.json',
  'popup.html',
  'popup/index.js',
  'content/index.js',
  'background/index.js',
  'icons/icon16.svg'
];

let allTestsPassed = true;

console.log('📁 Checking dist directory structure...\n');

// 各ファイルの存在確認
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allTestsPassed = false;
  }
});

console.log('\n📋 Checking manifest.json content...\n');

// manifest.jsonの内容確認
try {
  const manifestPath = path.join(distPath, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // 必要なフィールドの確認
  const requiredFields = [
    'manifest_version',
    'name',
    'version',
    'description',
    'permissions',
    'host_permissions',
    'action',
    'background',
    'content_scripts'
  ];
  
  requiredFields.forEach(field => {
    if (manifest[field]) {
      console.log(`✅ ${field}: ${typeof manifest[field] === 'object' ? 'configured' : manifest[field]}`);
    } else {
      console.log(`❌ ${field}: MISSING`);
      allTestsPassed = false;
    }
  });
  
  // 特定の設定の確認
  console.log('\n🔍 Detailed configuration check...\n');
  
  if (manifest.manifest_version === 3) {
    console.log('✅ Manifest V3 format');
  } else {
    console.log('❌ Not using Manifest V3');
    allTestsPassed = false;
  }
  
  if (manifest.host_permissions && manifest.host_permissions.includes('https://gemini.google.com/*')) {
    console.log('✅ Gemini host permissions configured');
  } else {
    console.log('❌ Gemini host permissions missing');
    allTestsPassed = false;
  }
  
  if (manifest.background && manifest.background.service_worker === 'background/index.js') {
    console.log('✅ Background script configured');
  } else {
    console.log('❌ Background script not properly configured');
    allTestsPassed = false;
  }
  
  if (manifest.content_scripts && manifest.content_scripts.length > 0) {
    const contentScript = manifest.content_scripts[0];
    if (contentScript.matches && contentScript.matches.includes('https://gemini.google.com/*')) {
      console.log('✅ Content script configured for Gemini');
    } else {
      console.log('❌ Content script not configured for Gemini');
      allTestsPassed = false;
    }
  } else {
    console.log('❌ Content scripts not configured');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log(`❌ Error reading manifest.json: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n🎯 Final Test Results');
console.log('====================\n');

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ Your Chrome extension is ready to be loaded!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode" (toggle in top right)');
  console.log('3. Click "Load unpacked" button');
  console.log('4. Select the "dist" folder from this project');
  console.log('5. Navigate to gemini.google.com and test the extension');
  console.log('');
  console.log('🔧 To test the extension:');
  console.log('- Open a Gemini chat conversation');
  console.log('- Click the extension icon in the toolbar');
  console.log('- Click the "Export Chat" button');
  console.log('- Check if a .txt file downloads with your chat history');
} else {
  console.log('❌ SOME TESTS FAILED!');
  console.log('');
  console.log('Please fix the issues above and run "npm run build" again.');
}

console.log('\n====================================='); 
