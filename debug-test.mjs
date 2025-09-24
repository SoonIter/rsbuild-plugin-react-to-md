import React from 'react';
import { renderToMd } from './dist/index.js';

// 最简单的测试
console.log('=== 测试简单文本 ===');
try {
  const simpleText = React.createElement('h1', null, 'Hello World');
  console.log('Element created:', simpleText);
  
  const result = renderToMd(simpleText);
  console.log('Result:', result);
  console.log('Result length:', result.length);
} catch (error) {
  console.error('Error:', error);
}