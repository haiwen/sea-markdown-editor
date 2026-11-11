import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import DropdownMenuItem from '../../../src/extension/commons/dropdown-menu-item';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }));

describe('dropdown menu item disabled state', () => {
  let container;
  let root;
  let previousActEnvironment;

  beforeEach(() => {
    previousActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    global.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  });

  it.each([true, false])('blocks both event handlers only when disabled=%s', (disabled) => {
    const onClick = jest.fn();
    const onMousedown = jest.fn();
    act(() => root.render(
      <DropdownMenuItem
        disabled={disabled}
        menuConfig={{ id: 'test-item', text: 'Item' }}
        onClick={onClick}
        onMousedown={onMousedown}
      />
    ));
    const item = container.querySelector('#test-item');
    act(() => {
      item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1);
    expect(onMousedown).toHaveBeenCalledTimes(disabled ? 0 : 1);
    expect(item.getAttribute('aria-disabled')).toBe(String(disabled));
  });
});
