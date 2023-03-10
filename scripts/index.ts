import * as memFs from 'mem-fs';
import * as editor from 'mem-fs-editor';
import * as path from 'path';
import * as fs from 'fs-extra';

const store = memFs.create();
const mfs = editor.create(store);

fs.copy(
  path.resolve(__dirname, '../templates/default'),
  path.resolve(__dirname, 'default'),
  {
    filter: (src) => {
      return !src.includes('tmpl');
    },
  },
);

mfs.commit(() => {
  console.log('done');
});
