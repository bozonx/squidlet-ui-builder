import fs, { existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import vueTranslator from './translators/vue/index';
import { IndexFileSchema } from './types/IndexFileSchema';
import yaml from 'yaml';
import { UI_FILES } from './constants';
import { Translator } from './types/Translator';
import { ComponentsFile } from './types/ComponentsFile';
import { LayoutsFile } from './types/LayoutsFile';
import { ViewsFile } from './types/ViewsFile';
import { ComponentSchema } from './types/ComponentSchema';

const TRANSLATORS: Record<string, Translator> = {
  vue: vueTranslator,
};

export function copyBaseProject(buildDir: string, translator: string) {
  const sourceDir = path.join('translators', translator, 'rootFiles');
  const files = fs.readdirSync(sourceDir);

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(buildDir, file);

    fs.copyFileSync(sourcePath, destPath);
  });
}

export function installDependencies(buildDir: string) {
  try {
    // Запускаем npm install в указанной директории
    execSync('npm install', {
      cwd: buildDir,
      stdio: 'inherit', // Показываем вывод в консоль
    });
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error}`);
  }
}

export function generateTemplates(
  buildDir: string,
  translator: string,
  indexFile: IndexFileSchema
) {
  const tmplsDir = 'translators/' + translator + '/tmpls';
  const files = fs.readdirSync(tmplsDir);

  // TODO: сделать рекурсивно
  files.forEach((file) => {
    const sourcePath = path.join(tmplsDir, file);
    const destPath = path.join(buildDir, file);
    const template = fs.readFileSync(sourcePath, 'utf8');

    const parsedTemplate = template.replace('{{title}}', indexFile.title);

    fs.writeFileSync(destPath, parsedTemplate);
  });
}

export function generateRouter(
  buildDir: string,
  translator: string,
  srcDir: string
) {
  const routerFile = loadYamlFileAndParse(srcDir + '/' + UI_FILES.router);
  const trans = TRANSLATORS[translator];
  const router = trans.makeRouter(routerFile);

  fs.writeFileSync(buildDir + '/' + UI_FILES.router, router);
}

export function buildFiles(
  buildDir: string,
  translator: string,
  srcDir: string
) {
  const componentsFile = loadYamlFileAndParse(srcDir + '/' + UI_FILES.components) as ComponentsFile;
  const layoutsFile = loadYamlFileAndParse(srcDir + '/' + UI_FILES.layouts) as LayoutsFile;
  const viewsFile = loadYamlFileAndParse(srcDir + '/' + UI_FILES.views) as ViewsFile;
  
  // TODO: add css.yaml
  // TODO: создать файл viewsIndex.js

  const trans = TRANSLATORS[translator];

  for (const component of componentsFile.components) {
    const componentPath = srcDir + '/' + component;
    const componentContent = loadYamlFileAndParse(componentPath) as ComponentSchema;
    const translatedComponent = trans.makeComponent(componentContent);

    fs.writeFileSync(buildDir + '/' + component, translatedComponent);
  }

  for (const layout of layoutsFile.layouts) {
    const layoutPath = srcDir + '/' + layout;
    const layoutContent = loadYamlFileAndParse(layoutPath) as ComponentSchema;
    const translatedLayout = trans.makeComponent(layoutContent);

    fs.writeFileSync(buildDir + '/' + layout, translatedLayout);
  }

  for (const view of viewsFile.views) {
    const viewPath = srcDir + '/' + view;
    const viewContent = loadYamlFileAndParse(viewPath) as ComponentSchema;
    const translatedView = trans.makeComponent(viewContent);

    fs.writeFileSync(buildDir + '/' + view, translatedView);
  }
}

export function loadYamlFileAndParse(filePath: string) {
  if (!existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  return yaml.parse(fileContent);
}
