import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const entry = {
  "components/index": "src/components/index.ts",
  "components/buttons/index": "src/components/buttons/index.ts",
  "components/inputs/index": "src/components/inputs/index.ts",
  "components/display/index": "src/components/display/index.ts",
  "components/data/index": "src/components/data/index.ts",
  "components/charts/index": "src/components/charts/index.ts",
  "components/feedback/index": "src/components/feedback/index.ts",
  "components/overlays/index": "src/components/overlays/index.ts",
  "components/navigation/index": "src/components/navigation/index.ts",
  "components/layout/index": "src/components/layout/index.ts",
  "components/chat/index": "src/components/chat/index.ts",
  "components/collab/index": "src/components/collab/index.ts",
  "components/media/index": "src/components/media/index.ts",
  "components/dev/index": "src/components/dev/index.ts",
  "components/sections/index": "src/components/sections/index.ts",
  "components/backgrounds/index": "src/components/backgrounds/index.ts",
  "components/motion/index": "src/components/motion/index.ts",
  "recipes/index": "src/recipes/index.ts",
  "lib/theme/index": "src/lib/theme/index.ts",
  "lib/a11y/index": "src/lib/a11y/index.ts",
  "lib/i18n/index": "src/lib/i18n/index.ts",
  "lib/form/index": "src/lib/form/index.ts",
  "lib/schema/index": "src/lib/schema/index.ts",
  "lib/cursor": "src/lib/cursor.tsx",
  "lib/z": "src/lib/z.ts",
  "lib/cn": "src/lib/cn.ts",
  "lib/Portal": "src/lib/Portal.tsx",
  "lib/responsive": "src/lib/responsive.ts",
};

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: true,
    lib: {
      entry,
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/server",
        "framer-motion",
        "react-router-dom",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
