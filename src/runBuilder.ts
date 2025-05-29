import { existsSync } from 'fs'
import { mkdirSync } from 'fs'
import {
  buildFiles,
  copyBaseProject,
  generateProjectFiles,
  generateRouter,
  installDependencies,
  loadYamlFileAndParse,
} from './builderFunctions';

// Получаем аргументы командной строки
const args = process.argv.slice(2);
const BUILD_DIR = 'build';
const translatorIndex = args.findIndex((arg) => arg === '-t');
let translatorName;

if (translatorIndex !== -1 && args[translatorIndex + 1]) {
  translatorName = args[translatorIndex + 1];
} else {
  console.error('Translator not specified');
  process.exit(1);
}

// Проверяем наличие аргументов
if (args.length === 0) {
  console.error('Error: Please provide a source directory as an argument');
  process.exit(1);
}

const parsedIndexFile = loadYamlFileAndParse(args[0]);

// Создаем директорию сборки если она не существует
if (!existsSync(BUILD_DIR)) {
  try {
    mkdirSync(BUILD_DIR);
    console.log(`Created build directory: ${BUILD_DIR}`);
  } catch (err) {
    console.error(`Error creating build directory: ${err}`);
    process.exit(1);
  }
}

copyBaseProject(BUILD_DIR, translatorName);
generateRouter(BUILD_DIR, translatorName, parsedIndexFile);
generateProjectFiles(BUILD_DIR, translatorName, parsedIndexFile);
buildFiles(BUILD_DIR, translatorName, parsedIndexFile);
installDependencies(BUILD_DIR);
