import { beforeAll, afterAll } from 'vitest';
import fs from 'fs';

const MOCK_PATH = 'lemon-tree.yaml';
const MOCK_CONTENT = `languages:\n  - en\n  - es\nsourceLanguage: en\ncliLanguage: en\ndefault:\n  filePattern: ./src/translations/{{lang.toLowerCase()}}/{{lang.toLowerCase()}}.json\n  protectionPattern: "{{key}}"\n  typeDefinition:\n    file: ./src/translations/translations.types.ts\n    exportName: Translations\napi:\n  provider: google\n  key: "my api key"\n`;

let originalReadFileSync: typeof fs.readFileSync;
let originalExistsSync: typeof fs.existsSync;

beforeAll(() => {
  originalReadFileSync = fs.readFileSync;
  originalExistsSync = fs.existsSync;
  fs.readFileSync = ((path: fs.PathOrFileDescriptor, ...args: any[]) => {
    if (typeof path === 'string' && path.endsWith(MOCK_PATH)) {
      return MOCK_CONTENT;
    }
    // @ts-ignore
    return originalReadFileSync(path, ...args);
  }) as typeof fs.readFileSync;
  fs.existsSync = ((path: fs.PathLike) => {
    if (typeof path === 'string' && path.endsWith(MOCK_PATH)) {
      return true;
    }
    return originalExistsSync(path);
  }) as typeof fs.existsSync;
});
