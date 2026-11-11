import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createEditor, Transforms } from 'slate';
import Toolbar from '../../../src/extension/toolbar/header-toolbar';
import InlineToolbar from '../../../src/extension/toolbar/inline-toolbar';
import EventBus from '../../../src/utils/event-bus';
import { INTERNAL_EVENTS } from '../../../src/constants/event-types';
import * as dividerHelpers from '../../../src/extension/plugins/divider/helper';
import withImages from '../../../src/extension/plugins/image/plugin';

jest.mock('react-i18next', () => {
  const React = require('react');
  const t = (key) => key;
  return {
    useTranslation: () => ({ t }),
    withTranslation: () => Component => function TranslatedComponent(props) {
      return React.createElement(Component, { ...props, t });
    },
  };
});

describe.each([
  { name: 'header', Component: Toolbar },
  { name: 'inline', Component: InlineToolbar },
])('$name toolbar table menus', ({ Component }) => {
  let container;
  let root;
  let editor;
  let previousActEnvironment;

  beforeEach(() => {
    jest.useFakeTimers();
    previousActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    editor = withImages(createEditor());
    editor.children = [
      { type: 'paragraph', children: [{ text: 'before' }] },
      {
        type: 'table',
        children: [{
          type: 'table_row',
          children: [
            { type: 'table_cell', children: [{ text: 'first' }] },
            { type: 'table_cell', children: [{ text: 'second' }] },
          ],
        }],
      },
      { type: 'paragraph', children: [{ text: 'after' }] },
    ];
    Transforms.select(editor, { path: [1, 0, 0, 0], offset: 1 });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.restoreAllMocks();
    jest.useRealTimers();
    global.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  });

  const renderToolbar = async (readonly = false) => {
    await act(async () => root.render(
      <Component editor={editor} readonly={readonly} isSupportFormula={true} isSupportColumn={true} />
    ));
  };

  const click = async (element) => {
    await act(async () => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      jest.advanceTimersByTime(0);
    });
  };

  const openInsertMenu = () => click(document.getElementById('sf-insert-toolbar-btn'));
  const getItem = type => document.getElementById(`seafile_${type}`);

  const expectDisabledInsertMenus = () => {
    for (const type of ['table', 'code_block', 'divider', 'formula']) {
      expect(getItem(type).classList.contains('disabled')).toBe(true);
      expect(getItem(type).getAttribute('aria-disabled')).toBe('true');
    }
  };

  it('disables unsupported elements and keeps inline elements available in a cell', async () => {
    await renderToolbar();
    expect(container.querySelector('.sf-header-toggle').classList.contains('header-toggle-disabled')).toBe(true);
    expect(getItem('blockquote').disabled).toBe(true);
    expect(document.getElementById('seafle_check_list_item').disabled).toBe(true);
    expect(getItem('bold').disabled).toBe(false);
    expect(getItem('link').disabled).toBe(false);

    if (Component === InlineToolbar) {
      await click(getItem('more_operation'));
    }
    expect(getItem('ordered_list').disabled).toBe(true);
    expect(getItem('unordered_list').disabled).toBe(true);

    await openInsertMenu();
    expectDisabledInsertMenus();
    for (const type of ['image', 'column']) {
      expect(getItem(type).classList.contains('disabled')).toBe(false);
    }
  });

  it('does not insert a divider or open the formula dialog through disabled items', async () => {
    await renderToolbar();
    await openInsertMenu();
    const insertDivider = jest.spyOn(dividerHelpers, 'insertDivider').mockImplementation(() => {});
    const dispatch = jest.spyOn(EventBus.getInstance(), 'dispatch');
    const originalChildren = JSON.stringify(editor.children);

    for (const type of ['divider', 'formula']) {
      const item = getItem(type);
      await act(async () => {
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      });
    }

    expect(insertDivider).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(INTERNAL_EVENTS.INSERT_ELEMENT, expect.anything());
    expect(JSON.stringify(editor.children)).toBe(originalChildren);
    expect(document.querySelector('.modal')).toBeNull();
  });

  it('updates open menu items when the selection moves into and out of a table', async () => {
    await renderToolbar();
    await openInsertMenu();
    expectDisabledInsertMenus();

    Transforms.select(editor, { path: [2, 0], offset: 1 });
    await act(async () => EventBus.getInstance().dispatch('change'));
    for (const type of ['table', 'code_block', 'divider', 'formula']) {
      expect(getItem(type).classList.contains('disabled')).toBe(false);
    }

    Transforms.select(editor, { path: [1, 0, 1, 0], offset: 1 });
    await act(async () => EventBus.getInstance().dispatch('change'));
    expectDisabledInsertMenus();
  });

  it('disables unsupported elements for a selection spanning multiple cells', async () => {
    Transforms.select(editor, {
      anchor: { path: [1, 0, 0, 0], offset: 1 },
      focus: { path: [1, 0, 1, 0], offset: 2 },
    });
    await renderToolbar();
    await openInsertMenu();
    expectDisabledInsertMenus();
  });

  it('disables unsupported elements for a selection extending outside a table', async () => {
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [1, 0, 0, 0], offset: 2 },
    });
    await renderToolbar();
    await openInsertMenu();
    expectDisabledInsertMenus();
  });

  it('keeps block elements disabled when an inline image in a cell is selected', async () => {
    const children = JSON.parse(JSON.stringify(editor.children));
    children[1].children[0].children[0].children = [
      { text: '' },
      { type: 'image', data: { src: '/image.png' }, children: [{ text: '' }] },
      { text: '' },
    ];
    editor.children = children;
    Transforms.select(editor, { path: [1, 0, 0, 1, 0], offset: 0 });
    await renderToolbar();
    expect(getItem('blockquote').disabled).toBe(true);
    expect(container.querySelector('.sf-header-toggle').classList.contains('header-toggle-disabled')).toBe(true);
    await openInsertMenu();
    expectDisabledInsertMenus();
  });
});
