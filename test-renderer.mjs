import React from 'react';
import { renderToMd } from './dist/index.js';

// 测试基本元素
console.log('=== 测试 1: 基本元素 ===');
const basicElements = React.createElement('div', null,
  React.createElement('h1', null, '标题'),
  React.createElement('p', null, 
    '这是一个',
    React.createElement('strong', null, '粗体'),
    '文本。'
  )
);

console.log(renderToMd(basicElements));
console.log('\n');

// 测试链接和图片
console.log('=== 测试 2: 链接和图片 ===');
const linksAndImages = React.createElement('div', null,
  React.createElement('a', { href: 'https://example.com' }, 'Example Link'),
  React.createElement('br'),
  React.createElement('img', { src: 'image.jpg', alt: 'Sample Image' })
);

console.log(renderToMd(linksAndImages));
console.log('\n');

// 测试列表
console.log('=== 测试 3: 列表 ===');
const lists = React.createElement('div', null,
  React.createElement('ul', null,
    React.createElement('li', null, '无序列表项 1'),
    React.createElement('li', null, '无序列表项 2')
  ),
  React.createElement('ol', null,
    React.createElement('li', null, '有序列表项 1'),
    React.createElement('li', null, '有序列表项 2')
  )
);

console.log(renderToMd(lists));
console.log('\n');

// 测试代码块
console.log('=== 测试 4: 代码块 ===');
const codeBlocks = React.createElement('div', null,
  React.createElement('p', null, 
    '内联代码: ',
    React.createElement('code', null, 'const x = 1;')
  ),
  React.createElement('pre', { language: 'javascript' },
    'function hello() {\n  console.log("Hello, World!");\n}'
  )
);

console.log(renderToMd(codeBlocks));