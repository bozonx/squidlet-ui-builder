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

export function loadYamlFileAndParse(filePath: string) {
  if (!existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  return yaml.parse(fileContent);
}

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

export function buildFiles(
  buildDir: string,
  translator: string,
  srcDir: string
) {
  makeAllComponentsFiles(srcDir, buildDir, translator);
  makeAllLayoutsFiles(srcDir, buildDir, translator);
  makeAllViewsFiles(srcDir, buildDir, translator);

  makeComponentIndexFile(srcDir, buildDir);
  makeLayoutsIndexFile(srcDir, buildDir);
  makeViewsIndexFile(srcDir, buildDir);

  // TODO: add css.yaml
  // TODO: add appConfig.yaml
}

/**
 * Рекурсивно удаляет содержимое директории, сохраняя папку node_modules
 * @param dir - путь к директории для очистки
 */
export function cleanDirExceptNodeModules(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);

    // Пропускаем node_modules
    if (item === 'node_modules') {
      continue;
    }

    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Рекурсивно удаляем содержимое поддиректории
      cleanDirExceptNodeModules(itemPath);
      // Удаляем пустую директорию
      fs.rmdirSync(itemPath);
    } else {
      // Удаляем файл
      fs.unlinkSync(itemPath);
    }
  }
}

export function makeComponentIndexFile(srcDir: string, buildDir: string) {
  const componentsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.components
  ) as ComponentsFile;

  makeIndexFile(componentsFile.components, 'components', buildDir);
}

export function makeLayoutsIndexFile(srcDir: string, buildDir: string) {
  const layoutsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.layouts
  ) as LayoutsFile;

  makeIndexFile(layoutsFile.layouts, 'layouts', buildDir);
}

export function makeViewsIndexFile(srcDir: string, buildDir: string) {
  const viewsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.views
  ) as ViewsFile;

  makeIndexFile(viewsFile.views, 'views', buildDir);
}

export function makeAllComponentsFiles(
  srcDir: string,
  buildDir: string,
  translator: string
) {
  const componentsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.components
  ) as ComponentsFile;

  makeComponentFiles(componentsFile.components, srcDir, buildDir, translator);
}

export function makeAllLayoutsFiles(
  srcDir: string,
  buildDir: string,
  translator: string
) {
  const layoutsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.layouts
  ) as LayoutsFile;

  makeComponentFiles(layoutsFile.layouts, srcDir, buildDir, translator);
}

export function makeAllViewsFiles(
  srcDir: string,
  buildDir: string,
  translator: string
) {
  const viewsFile = loadYamlFileAndParse(
    srcDir + '/' + UI_FILES.views
  ) as ViewsFile;

  makeComponentFiles(viewsFile.views, srcDir, buildDir, translator);
}

export function generateRouter(
  buildDir: string,
  translator: string,
  srcDir: string
) {
  const routerFile = loadYamlFileAndParse(srcDir + '/' + UI_FILES.router);
  const trans = TRANSLATORS[translator];
  const router = trans.makeRouter(routerFile);

  fs.writeFileSync(buildDir + '/src/router.js', router);
}

export function makeComponentFiles(
  srcFiles: string[],
  srcDir: string,
  buildDir: string,
  translator: string
) {
  const trans = TRANSLATORS[translator];

  for (const componentFile of srcFiles) {
    const componentFullPath = srcDir + '/' + componentFile + '.yaml';
    const componentDestDir = path.dirname(buildDir + '/src/' + componentFile);
    const componentContent = loadYamlFileAndParse(
      componentFullPath
    ) as ComponentSchema;

    if (!componentContent) {
      console.warn('componentContent is empty', componentFullPath);
      continue;
    }

    const translatedComponent = trans.makeComponent(componentContent);

    // Создаем директорию компонента если она не существует
    if (!fs.existsSync(componentDestDir)) {
      fs.mkdirSync(componentDestDir, { recursive: true });
    }

    fs.writeFileSync(
      buildDir + '/src/' + componentFile + '.vue',
      translatedComponent
    );
  }
}

function makeIndexFile(
  srcFiles: string[],
  outputFileName: string,
  buildDir: string
) {
  // Components index file
  let componentsIndex = '';

  for (const component of srcFiles) {
    const componentName = path.basename(component);

    componentsIndex += `export { default as ${componentName} } from './${component}.vue'\n`;
  }

  fs.writeFileSync(buildDir + `/src/${outputFileName}.js`, componentsIndex);
}

