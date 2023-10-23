/** @jsx jsx */
import { ListPlugin } from '../../../../src/extension/plugins';
import { jsx, createSdocEditor, formatChildren } from '../../../core';

describe('toggle list test', () => {
  it('toggle paragraph to order list', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>a<cursor />a</hlic>
          </hli>
        </hol>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>a</hlic>
          </hli>
          <hli>
            <hlic>a</hlic>
          </hli>
        </hol>
      </editor>
    );


    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertBreak(editor);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

});
