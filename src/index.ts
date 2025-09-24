import type { RsbuildPlugin } from '@rsbuild/core';

export type pluginReactToMdOptions = {
  foo?: string;
  bar?: boolean;
};

export const pluginReactToMd = (
  options: pluginReactToMdOptions = {},
): RsbuildPlugin => ({
  name: 'plugin-react-to-md',

  setup() {
    console.log('React to Markdown plugin loaded!', options);
  },
});

// 导出渲染函数
export { MarkdownNode, renderToMd, TextNode } from './reconciler.js';
