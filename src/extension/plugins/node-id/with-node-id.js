import { decorateOperation, replacePastedDataId } from './helpers';

const catchSlateFragment = /data-slate-fragment="(.+?)"/m;

const getSlateFragmentAttribute = (dataTransfer) => {
  const htmlData = dataTransfer.getData('text/html');
  const [, fragment] = htmlData.match(catchSlateFragment) || [];
  return fragment;
};

const withNodeId = (editor) => {
  const { apply } = editor;
  const newEditor = editor;

  newEditor.apply = (op) => {
    const newOp = decorateOperation(op);
    apply(newOp);
  };

  // rewrite insert fragment data
  newEditor.insertFragmentData = (data) => {
    const fragment = data.getData('application/x-slate-fragment') || getSlateFragmentAttribute(data);

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const parsed = JSON.parse(decoded);
      const newData = replacePastedDataId(parsed);
      newEditor.insertFragment(newData);
      return newEditor;
    }
  };

  return newEditor;

};

export default withNodeId;
