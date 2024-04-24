import isUrl from 'is-url';
import slugid from 'slugid';
import { deserializeHtml } from '../../../slate-convert';
import { CODE_LINE } from '../../constants/element-types';
import { isInCodeBlock } from '../code-block/helpers';

const withHtml = (editor) => {
  const { insertData } = editor;
  const newEditor = editor;

  newEditor.insertData = (data) => {
    // If the text is a link and is not within the code_block block, it is processed as link
    const text = data.getData('text/plain') || '';
    if (isUrl(text) && !isInCodeBlock(newEditor)) {
      insertData(data);
      return;
    }

    // If the copied content contains files, proceed as shown in the image
    if (data.types.includes('Files')) {
      insertData(data);
      return;
    }

    // If code_block is selected, the copied content will be processed according to code_block
    if (!data.types.includes('text/code-block') && isInCodeBlock(newEditor)) {
      const plaintext = data.getData('text/plain') || '';
      if (plaintext) {
        let fragmentData = [];
        plaintext.split('\n').forEach((item) => {
          const codeLine = {
            id: slugid.nice(),
            type: CODE_LINE,
            children: [{ text: item, id: slugid.nice() }],
          };
          fragmentData.push(codeLine);
        });
        newEditor.insertFragment(fragmentData);
      }
      return;
    }

    // If it is in slate format, it will be processed in slate format.
    if (newEditor.insertFragmentData(data)) {
      return;
    }

    // If it is in html format, it will be processed in html format.
    const htmlContent = data.getData('text/html') || '';
    if (htmlContent) {
      const content = deserializeHtml(htmlContent);
      editor.insertFragment(content);
      return;
    }

    insertData(data);
  };

  return newEditor;

};

export default withHtml;
