import React from 'react';
import { Node } from 'slate';
import { Placeholder, getNodeType } from '../../core';
import { ELementTypes } from '../../constants';
import { useTranslation } from 'react-i18next';

export const renderHeader = (props, editor) => {
  const { element, attributes, children, isComposing } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  const HeaderTagName = `h${getHeaderTagName(element)}`;
  const style = {
    textAlign: element.align,
  };

  let isShowPlaceHolder = false;
  const firstChild = editor.children[0];
  if (firstChild.id === element.id && Node.string(element) === '' && !isComposing) {
    isShowPlaceHolder = true;
  }

  function getHeaderTagName(element) {
    const curerntNodeType = getNodeType(element);
    if (curerntNodeType.indexOf(ELementTypes.HEADER) > -1) {
      return curerntNodeType.split(ELementTypes.HEADER)[1];
    }
    return 'p';
  }
  return (
    <HeaderTagName
      data-id={element.id}
      id={element.id} // used for click left outline item, page scroll this element
      data-root='true'
      {...attributes}
      style={{ position: isShowPlaceHolder ? 'relative' : '', ...style }}
    >
      {isShowPlaceHolder && <Placeholder title={t('Please_enter_title')} />}
      {children}
    </HeaderTagName>
  );
};
