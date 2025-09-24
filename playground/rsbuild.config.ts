import { defineConfig } from '@rsbuild/core';
import { pluginReactToMd } from '../src';

export default defineConfig({
  plugins: [pluginReactToMd()],
});
