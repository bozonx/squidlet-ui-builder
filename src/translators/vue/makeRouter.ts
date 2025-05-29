import { RouterFile } from '@/types/RouterFile';

export function makeRouter(routerFile: RouterFile) {
  let result = 'import { createRouter, createWebHistory } from "vue-router"\n';

  result += `import Views from "./viewsIndex.js"\n`;
  result += `\nconst router = createRouter({\n`;
  result += `  history: createWebHistory(import.meta.env.BASE_URL),\n`;
  result += `  routes: [\n`;

  for (const route of routerFile.routes) {
    result += `    { path: "${route.path}", name: "${route.name}", component: Views[${route.view}] },\n`;
  }

  result += `  ],\n`;
  result += `})\n`;
  result += `\nexport default router;\n`;

  return result;
}
