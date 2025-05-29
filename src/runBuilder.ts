import { existsSync } from 'fs'
import { mkdirSync } from 'fs'
import {
  buildFiles,
  copyBaseProject,
  generateTemplates,
  generateRouter,
  installDependencies,
  loadYamlFileAndParse,
  cleanDir,
} from './builderFunctions';
import { UI_FILES } from './constants';

// Интерфейс для аргументов командной строки
interface CommandLineArgs {
  translator: string;
  sourceDir: string;
  buildDir: string;
}

// Функция для парсинга аргументов командной строки
function parseCommandLineArgs(): CommandLineArgs {
  const args = process.argv.slice(2);

  // Проверяем наличие аргументов
  if (args.length === 0) {
    console.error('Error: Please provide required arguments');
    console.error(
      'Usage: npx tsx ./src/runBuilder.ts -t <translator> <sourceDir>'
    );
    process.exit(1);
  }

  // Ищем флаг переводчика
  const translatorIndex = args.findIndex((arg) => arg === '-t');
  if (translatorIndex === -1 || !args[translatorIndex + 1]) {
    console.error('Error: Translator not specified');
    console.error(
      'Usage: npx tsx ./src/runBuilder.ts -t <translator> <sourceDir>'
    );
    process.exit(1);
  }

  // Получаем имя переводчика
  const translator = args[translatorIndex + 1];

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
  };
}

// Парсим аргументы
const { translator, sourceDir, buildDir } = parseCommandLineArgs();

// Создаем директорию сборки если она не существует
if (!existsSync(buildDir)) {
  try {
    mkdirSync(buildDir);
    console.log(`Created build directory: ${buildDir}`);
  } catch (err) {
    console.error(`Error creating build directory: ${err}`);
    process.exit(1);
  }
}

const parsedIndexFile = loadYamlFileAndParse(sourceDir + '/' + UI_FILES.index);

cleanDir(buildDir);
copyBaseProject(buildDir, translator);
generateTemplates(buildDir, translator, parsedIndexFile);
generateRouter(buildDir, translator, sourceDir);
buildFiles(buildDir, translator, sourceDir);
//installDependencies(buildDir);
