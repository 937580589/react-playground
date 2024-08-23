import { Files } from './PlaygroundContext'
import importMap from './template/import-map.json?raw'
import AppCss from './template/App.css?raw'
import App from './template/App.tsx?raw'
import main from './template/main.tsx?raw'
import { fileNameLanguage } from './utils'

export const APP_COMPONENT_FILE_NAME = 'App.tsx'

export const IMPORT_MAP_FILE_NAME = 'import-map.json'

export const ENTRY_FILE_NAME = 'main.tsx'

export const initFiles: Files = {
  [ENTRY_FILE_NAME]: {
    name: ENTRY_FILE_NAME,
    language: fileNameLanguage(ENTRY_FILE_NAME),
    value: main,
  },
  [APP_COMPONENT_FILE_NAME]: {
    name: APP_COMPONENT_FILE_NAME,
    language: fileNameLanguage(APP_COMPONENT_FILE_NAME),
    value: App,
  },
  'App.css': {
    name: 'App.css',
    language: 'css',
    value: AppCss,
  },
  [IMPORT_MAP_FILE_NAME]: {
    name: IMPORT_MAP_FILE_NAME,
    language: fileNameLanguage(IMPORT_MAP_FILE_NAME),
    value: importMap,
  }
}