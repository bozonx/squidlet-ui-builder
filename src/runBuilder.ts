import { existsSync } from 'fs'
import { mkdirSync } from 'fs'
import { buildFiles, copyBaseProject, installDependencies } from './builderFunctions'


// Получаем аргументы командной строки
const args = process.argv.slice(2)
const BUILD_DIR = 'build'
// Получаем параметр транслятора из аргументов командной строки
const translatorIndex = args.findIndex(arg => arg === '-t')
let translatorName

if (translatorIndex !== -1 && args[translatorIndex + 1]) {
  translatorName = args[translatorIndex + 1]
} else {
  console.error('Translator not specified')
  process.exit(1)
}

// Проверяем наличие аргументов
if (args.length === 0) {
  console.error('Error: Please provide a file name as an argument')
  process.exit(1)
}

// Получаем имя файла из первого аргумента
const fileName = args[0]

// Проверяем что файл существует и загружаем его содержимое
if (!existsSync(fileName)) {
  console.error(`Error: File "${fileName}" does not exist`)
  process.exit(1)
}

let indexFile: string
try {
  indexFile = require('fs').readFileSync(fileName, 'utf8')
} catch (err) {
  console.error(`Error reading file "${fileName}": ${err}`)
  process.exit(1)
}

// Парсим YAML файл
let parsedIndexFile
try {
  const yaml = require('yaml')
  parsedIndexFile = yaml.parse(indexFile)
  
  // Проверяем что файл не пустой
  if (!parsedIndexFile) {
    console.error('Error: YAML file is empty')
    process.exit(1)
  }
} catch (err) {
  console.error(`Error parsing YAML file: ${err}`)
  process.exit(1)
}

parsedIndexFile


// Создаем директорию сборки если она не существует
if (!existsSync(BUILD_DIR)) {
  try {
    mkdirSync(BUILD_DIR)
    console.log(`Created build directory: ${BUILD_DIR}`)
  } catch (err) {
    console.error(`Error creating build directory: ${err}`)
    process.exit(1)
  }
}

copyBaseProject(BUILD_DIR)
installDependencies(BUILD_DIR)
buildFiles(BUILD_DIR, translatorName, parsedIndexFile)
