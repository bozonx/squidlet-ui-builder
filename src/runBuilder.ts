import { existsSync, unlinkSync } from 'fs';
import { mkdirSync } from 'fs';
import {
  buildFiles,
  copyBaseProject,
  generateTemplates,
  generateRouter,
  installDependencies,
  loadYamlFileAndParse,
  cleanDirExceptNodeModules,
  makeComponentIndexFile,
  makeLayoutsIndexFile,
  makeViewsIndexFile,
  makeComponentFiles,
} from './builderFunctions';
import { UI_FILES } from './constants';
import { watchBuilder } from './watchBuilder';

// Интерфейс для аргументов командной строки
interface CommandLineArgs {
  translator: string;
  sourceDir: string;
  buildDir: string;
  watch: boolean;
}

// Функция для парсинга аргументов командной строки
function parseCommandLineArgs(): CommandLineArgs {
  const args = process.argv.slice(2);

  // Проверяем наличие аргументов
  if (args.length === 0) {
    console.error('Error: Please provide required arguments');
    console.error(
      'Usage: npx tsx ./src/runBuilder.ts -t <translator> [-w] <sourceDir>'
    );
    process.exit(1);
  }

  // Ищем флаг переводчика
  const translatorIndex = args.findIndex((arg) => arg === '-t');
  if (translatorIndex === -1 || !args[translatorIndex + 1]) {
    console.error('Error: Translator not specified');
    console.error(
      'Usage: npx tsx ./src/runBuilder.ts -t <translator> [-w] <sourceDir>'
    );
    process.exit(1);
  }

  // Получаем имя переводчика
  const translator = args[translatorIndex + 1];

  // Проверяем наличие флага watch
  const watch = args.includes('-w');

  // Получаем исходную директорию (последний аргумент)
  const sourceDir = args[args.length - 1];

  // Проверяем существование исходной директории
  if (!existsSync(sourceDir)) {
    console.error(`Error: Source directory "${sourceDir}" does not exist`);
    process.exit(1);
  }

  return {
    translator,
    sourceDir,
    buildDir: 'build', // По умолчанию используем 'build'
    watch,
  };
}

// Парсим аргументы
const { translator, sourceDir, buildDir, watch } = parseCommandLineArgs();
let buildDirExists = false;

// Создаем директорию сборки если она не существует
if (!existsSync(buildDir)) {
  try {
    mkdirSync(buildDir);
    console.log(`Created build directory: ${buildDir}`);
  } catch (err) {
    console.error(`Error creating build directory: ${err}`);
    process.exit(1);
  }
} else {
  buildDirExists = true;
}

const parsedIndexFile = loadYamlFileAndParse(sourceDir + '/' + UI_FILES.index);

cleanDirExceptNodeModules(buildDir);
copyBaseProject(buildDir, translator);
generateTemplates(buildDir, translator, parsedIndexFile);
generateRouter(buildDir, translator, sourceDir);
buildFiles(buildDir, translator, sourceDir);

if (!buildDirExists) {
  installDependencies(buildDir);
}

if (watch) {
  watchBuilder(sourceDir, (path, event) => {
    const filePath = path.replace('src/ui/', '');

    if (event === 'addDir') {
      // skip adding dirs because when files will be placed dir will be created automatically
      console.log('addDir', event, filePath);

      return;
    } else if (event === 'unlinkDir') {
      // TODO: remove dir from buildDir

      console.log('unlinkDir', event, filePath);

      return;
    } else if (event === 'unlink') {
      // TODO: найти файл без указзания расширения vue
      const builtFilePath =
        buildDir + '/' + filePath.replace(/\.yaml$/, '') + '.vue';

      if (existsSync(builtFilePath)) {
        unlinkSync(builtFilePath);
      }

      console.log('unlinked', filePath);

      return;
    } else if (event === 'change' || event === 'add') {
      let isUnknownFile = false;

      switch (filePath) {
        case 'components.yaml':
          makeComponentIndexFile(sourceDir, buildDir);
          break;
        case 'layouts.yaml':
          makeLayoutsIndexFile(sourceDir, buildDir);
          break;
        case 'views.yaml':
          makeViewsIndexFile(sourceDir, buildDir);
          break;
        case 'router.yaml':
          generateRouter(buildDir, translator, sourceDir);
          break;
        case 'index.yaml':
          generateTemplates(buildDir, translator, parsedIndexFile);
          break;
        default:
          if (
            filePath.indexOf('components/') === 0 ||
            filePath.indexOf('views/') === 0 ||
            filePath.indexOf('layouts/') === 0
          ) {
            makeComponentFiles(
              [filePath.replace(/\.yaml$/, '')],
              sourceDir,
              buildDir,
              translator
            );
          } else {
            isUnknownFile = true;
          }
      }

      if (isUnknownFile) {
        console.warn('unknown file', filePath);
      } else {
        console.log('updated', filePath);
      }
    } else {
      console.error('unknown event', event);
    }
  });
}
