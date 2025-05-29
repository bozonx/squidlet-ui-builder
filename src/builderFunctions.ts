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
  const sourceDir = path.join('./src/translators', translator, 'rootFiles');

  // Рекурсивная функция для копирования файлов и директорий
  function copyRecursive(source: string, destination: string) {
    // Создаем директорию назначения, если она не существует
    if (!existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Получаем список файлов и директорий
    const items = fs.readdirSync(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        // Если это директория, рекурсивно копируем её содержимое
        copyRecursive(sourcePath, destPath);
      } else {
        // Если это файл, копируем его
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }

  // Начинаем копирование с корневой директории
  copyRecursive(sourceDir, buildDir);
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
  const tmplsDir = './src/translators/' + translator + '/tmpls';
  const files = fs.readdirSync(tmplsDir);

  // TODO: сделать рекурсивно
  files.forEach((file) => {
    const sourcePath = path.join(tmplsDir, file);
    const destPath = path.join(buildDir, file);
    const template = fs.readFileSync(sourcePath, 'utf8');

    const parsedTemplate = template
      .replace('{{title}}', indexFile.title)
      .replace('{{name}}', indexFile.name);

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

  fs.writeFileSync(buildDir + '/router.js', router);
}

export function buildFiles(
  buildDir: string,
  translator: string,
  srcDir: string
) {
  const componentsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.components
  ) as ComponentsFile;
  const layoutsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.layouts
  ) as LayoutsFile;
  const viewsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.views
  ) as ViewsFile;

  const trans = TRANSLATORS[translator];

  for (const component of componentsFile.components) {
    const componentPath = srcDir + '/' + component + '.yaml';
    const componentContent = loadYamlFileAndParse(
      componentPath
    ) as ComponentSchema;
    const translatedComponent = trans.makeComponent(componentContent);

    fs.writeFileSync(buildDir + '/' + component + '.js', translatedComponent);
  }

  for (const layout of layoutsFile.layouts) {
    const layoutPath = srcDir + '/' + layout + '.yaml';
    const layoutContent = loadYamlFileAndParse(layoutPath) as ComponentSchema;
    const translatedLayout = trans.makeComponent(layoutContent);

    fs.writeFileSync(buildDir + '/' + layout, translatedLayout);
  }

  for (const view of viewsFile.views) {
    const viewPath = srcDir + '/' + view + '.yaml';
    const viewContent = loadYamlFileAndParse(viewPath) as ComponentSchema;
    const translatedView = trans.makeComponent(viewContent);

    fs.writeFileSync(buildDir + '/' + view + '.js', translatedView);
  }

  // Views index file
  let viewsIndex = '';

  for (const view of viewsFile.views) {
    viewsIndex += `export ${view} from './${view}'\n`;
  }

  fs.writeFileSync(buildDir + '/views.js', viewsIndex);

  // Components index file
  let componentsIndex = '';

  for (const component of componentsFile.components) {
    componentsIndex += `export ${component} from './${component}'\n`;
  }

  fs.writeFileSync(buildDir + '/components.js', componentsIndex);

  // TODO: add css.yaml
}

export function loadYamlFileAndParse(filePath: string) {
  if (!existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  return yaml.parse(fileContent);
}

export function cleanDir(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}