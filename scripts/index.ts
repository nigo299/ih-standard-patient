import * as memFs from 'mem-fs';
import * as editor from 'mem-fs-editor';
import * as path from 'path';

const store = memFs.create();
const fs = editor.create(store);

fs.copyTpl(
  path.resolve(__dirname, '../templates/default/package.json.tmpl'),
  path.resolve(__dirname, 'packages.json'),
  {
    hisId: 333,
    hisName: 'aaa',
  },
);

fs.commit(() => {
  console.log('done');
});
