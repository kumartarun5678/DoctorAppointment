import {defineconfig} from 'vite';
import react from '@vitejs/plugin-react';

import pluginRewriteAll from 'vite-plugin-rewrite-all';

export default defineconfig({
  plugins: [react(),pluginRewriteAll()],
})