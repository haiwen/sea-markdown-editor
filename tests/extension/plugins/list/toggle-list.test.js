/** @jsx jsx */
import { transformsToList } from '../../../../src/extension/plugins/list/transforms';
import { jsx, createSdocEditor, formatChildren } from '../../../core';
import { ORDERED_LIST, UNORDERED_LIST } from '../../../core/constants';

describe('toggle list test', () => {
  it('toggle paragraph to order list', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hp>aa<cursor /></hp>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aa</hlic>
          </hli>
        </hol>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, ORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
  it('toggle order list to paragraph', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aa<cursor /></hlic>
          </hli>
        </hol>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hp>aa</hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, ORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('toggle paragraph to unorder list', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hp>aa<cursor /></hp>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hul>
          <hli>
            <hlic>aa</hlic>
          </hli>
        </hul>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, UNORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
  it('toggle unorder list to paragraph', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hul>
          <hli>
            <hlic>aa<cursor /></hlic>
          </hli>
        </hul>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hp>aa</hp>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, UNORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
  it('toggle unorder list to order list', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hul>
          <hli>
            <hlic>aa<cursor /></hlic>
          </hli>
        </hul>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aa</hlic>
          </hli>
        </hol>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, ORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
  it('toggle order list to unorder list', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aa<cursor /></hlic>
          </hli>
        </hol>
      </editor>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hul>
          <hli>
            <hlic>aa</hlic>
          </hli>
        </hul>
      </editor>
    );

    const editor = createSdocEditor(input);
    transformsToList(editor, UNORDERED_LIST);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
});
