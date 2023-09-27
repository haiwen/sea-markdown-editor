/** @jsx jsx */
import { Editor } from 'slate';
import { jsx, createSdocEditor, formatChildren } from '../../../core';
import { addMark, removeMark } from '../../../../src/extension/plugins/text-style/helpers';

describe('toggle text-style test', () => {
  it('add bold mark test', () => {
    const input = (
      <editor>
        <hp><htext><cursor /></htext></hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext bold={true}>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    addMark(editor, 'bold');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('add italic mark test', () => {
    const input = (
      <editor>
        <hp><htext>aaa<cursor /></htext></hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext>aaa</htext>
          <htext italic={true}>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    addMark(editor, 'italic');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('add bold and italic mark test', () => {
    const input = (
      <editor>
        <hp><htext><cursor /></htext></hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext bold={true} italic={true}>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    addMark(editor, 'bold');
    addMark(editor, 'italic');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('remove bold mark test', () => {
    const input = (
      <editor>
        <hp>
          <htext bold={true}>aaa<cursor /></htext>
        </hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext bold={true}>aaa</htext>
          <htext>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    removeMark(editor, 'bold');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('remove italic mark test', () => {
    const input = (
      <editor>
        <hp>
          <htext italic={true}>aaa<cursor /></htext>
        </hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext italic={true}>aaa</htext>
          <htext>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    removeMark(editor, 'italic');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('remove bold and italic mark test', () => {
    const input = (
      <editor>
        <hp><htext bold={true} italic={true}>aaa<cursor /></htext></hp>
      </editor>
    );

    const output = (
      <editor>
        <hp>
          <htext bold={true} italic={true}>aaa</htext>
          <htext>bbb</htext>
        </hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    removeMark(editor, 'bold');
    removeMark(editor, 'italic');
    Editor.insertText(editor, 'bbb');

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
});
