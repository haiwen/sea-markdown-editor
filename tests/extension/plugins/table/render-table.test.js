import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createEditor } from 'slate';
import RenderTableContainer from '../../../../src/extension/plugins/table/render-elem';

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

describe('table scrolling and context menu', () => {
  let container;
  let root;
  let previousActEnvironment;

  beforeEach(() => {
    previousActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    container.className = 'article';
    document.body.appendChild(container);
    root = createRoot(container);

    const element = {
      id: 'table',
      type: 'table',
      children: [{
        type: 'table_row',
        children: [{ type: 'table_cell', children: [{ text: 'cell' }] }],
      }],
    };
    const editor = createEditor();
    editor.children = [element];
    const Table = () => RenderTableContainer({
      element,
      attributes: {},
      children: <tr><td>cell</td></tr>,
    }, editor);

    act(() => root.render(<Table />));
    container.querySelector('.sf-table-wrapper').getBoundingClientRect = () => ({
      left: 80, top: 40, right: 400, bottom: 100, width: 320, height: 60,
    });
    container.querySelector('table').getBoundingClientRect = () => ({
      left: -120, top: 40, right: 680, bottom: 100, width: 800, height: 60,
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    global.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  });

  const openMenu = () => {
    act(() => {
      container.querySelector('td').dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: 160,
        clientY: 80,
      }));
    });
    return container.querySelector('.sf-context-menu-wrapper');
  };

  it('positions the menu relative to the wrapper after horizontal scrolling', () => {
    const menu = openMenu();

    expect(menu.style.left).toBe('80px');
    expect(menu.style.top).toBe('40px');
    expect(menu.closest('.sf-table-scroll')).toBeNull();
  });

  it('closes the context menu when the table scrolls', () => {
    expect(openMenu()).not.toBeNull();
    const scroller = container.querySelector('.sf-table-scroll');
    expect(scroller).not.toBeNull();

    act(() => scroller.dispatchEvent(new Event('scroll')));

    expect(container.querySelector('.sf-context-menu-wrapper')).toBeNull();
  });
});
