import * as memFs from 'mem-fs';
import * as editor from 'mem-fs-editor';
import * as path from 'path';
import { default as inquirer } from 'inquirer';
import * as fs from 'fs-extra';

const store = memFs.create();
const mfs = editor.create(store);

const prompt = [
  {
    type: 'input',
    name: 'hisId',
    message: '请输入医院ID',
    validate(value: string) {
      if (value) {
        return true;
      }
      return "'请输入医院ID'";
    },
  },
  {
    type: 'input',
    name: 'hisName',
    message: '请输入医院名称',
    validate(value: string) {
      if (value) {
        return true;
      }
      return "'请输入医院名称'";
    },
  },
];

inquirer.prompt(prompt).then((answers: { hisId: string; hisName: string }) => {
  const { hisId } = answers;
  const templatePath = path.resolve(__dirname, '../templates/default');
  const targetPath = path.resolve(__dirname, `../packages/${hisId}`);
  fs.copy(templatePath, targetPath, {
    filter: (src) => {
      return !src.includes('tmpl');
    },
  });

  mfs.copyTpl(`${templatePath}/**/*.tmpl`, targetPath, answers);

  mfs.commit(() => {
    console.log('done');
  });
});
