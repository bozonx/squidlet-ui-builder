import fs, { existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as vueTranslator from './translators/vue/index';
import { IndexFileSchema } from './types/IndexFileSchema';
import yaml from 'yaml';

const TRANSLATORS = {
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

export function generateProjectFiles(
  buildDir: string,
  translator: string,
  indexFile: IndexFileSchema
) {
  // TODO: do it
}

export function generateRouter(
  buildDir: string,
  translator: string,
  indexFile: IndexFileSchema
) {
  // TODO: do it
}

// TODO: сбилдить по шаблонам

export function buildFiles(
  buildDir: string,
  translator: string,
  indexFile: IndexFileSchema
) {
  // TODO: do it
}

export function loadYamlFileAndParse(filePath: string) {
  if (!existsSync(filePath)) {
    console.error(`Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  return yaml.parse(fileContent);
}
