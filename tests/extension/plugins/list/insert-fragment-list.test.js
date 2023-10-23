/** @jsx jsx */
import { ListPlugin } from '../../../../src/extension/plugins';
import { jsx, createSdocEditor, formatChildren } from '../../../core';

describe('insert fragment list', () => {
  it('copy checkbox into empty list item', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic><cursor/></hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <htodoli>aaa</htodoli>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aaa</hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy checkbox into list item not empty', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>ccc<cursor/></hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <htodoli>aaa</htodoli>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>
              <htext>cccaaa</htext>
            </hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy listItem into paragraph', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hp><cursor /></hp>
      </editor>
    );

    const fragment = (
      <fragment>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
          </hli>
        </hol>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy listItem(no ol child) into listItem, and listItem(no ol child) lic is empty', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic><cursor /></hlic>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
          </hli>
        </hol>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy listItem(no ol child) into listItem, and listItem(has ol child) lic is empty', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic><cursor /></hlic>
            <hol>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
          </hli>
        </hol>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
            <hol>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy listItem(has ol child) into listItem, and listItem(has ol child) lic is empty', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic><cursor /></hlic>
            <hol>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
            <hol>
              <hli>
                <hlic>1111111</hlic>
              </hli>
              <hli>
                <hlic>222222</hlic>
              </hli>
            </hol>
          </hli>
        </hol>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
            <hol>
              <hli>
                <hlic>1111111</hlic>
              </hli>
              <hli>
                <hlic>222222</hlic>
              </hli>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });

  it('copy listItem(has ol child) into listItem, and listItem(has ol child) lic not empty', () => {
    const input = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aaa<cursor /></hlic>
            <hol>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const fragment = (
      <fragment>
        <hol>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
            <hol>
              <hli>
                <hlic>1111111</hlic>
              </hli>
              <hli>
                <hlic>222222</hlic>
              </hli>
            </hol>
          </hli>
        </hol>
      </fragment>
    );

    const output = (
      <editor>
        <hh1>aa</hh1>
        <hol>
          <hli>
            <hlic>aaa</hlic>
            <hol>
              <hli>
                <hlic>aaabbbccc</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>
              <htext>ccc</htext>
              <htext>aaa</htext>
            </hlic>
            <hol>
              <hli>
                <hlic>1111111</hlic>
              </hli>
              <hli>
                <hlic>222222</hlic>
              </hli>
            </hol>
          </hli>
          <hli>
            <hlic>aaabbbccc</hlic>
          </hli>
        </hol>
      </editor>
    );

    const plugins = [ListPlugin.editorPlugin];
    const editor = createSdocEditor(input, plugins);
    editor.insertFragment(fragment);

    expect(formatChildren(editor.children)).toEqual(formatChildren(output.children));
  });
});
