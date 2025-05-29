import { Route, RouterFile } from '@/types/RouterFile';

export function makeRouter(routerFile: RouterFile) {
  let result = 'import { createRouter, createWebHistory } from "vue-router"\n';

  result += `import * as views from "./views.js"\n`;
  result += `import * as layouts from "./layouts.js"\n\n`;
  result += `const viewsAndLayouts = { ...views, ...layouts }\n`;
  result += `const router = createRouter({\n`;
  result += `  history: createWebHistory(import.meta.env.BASE_URL),\n`;
  result += `  routes: [\n`;

  result += makeRouteItems(routerFile.routes);

  result += `  ],\n`;
  result += `})\n`;
  result += `\nexport default router;\n`;

  return result;
}

function makeRouteItems(routes: Route[]) {
  let result = '';
  let name = '';

  for (const route of routes) {
    let children = '';

    if (route.children?.length) {
      children = `children: [\n${makeRouteItems(route.children)}\n    ]`;
    }

    if (route.name) {
      name = `, name: "${route.name}"`;
    }

    result += `    {path: "${route.path}"${name}, component: viewsAndLayouts["${route.view}"], ${children} },\n`;
  }

  return result;
}
