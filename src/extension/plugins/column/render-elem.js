import React, { useCallback, useMemo } from 'react';
import { useReadOnly, useSelected, useSlateStatic } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { Select } from '../../commons';
import { COLUMNS_ICON_CONFIG } from './constants/column';
import { getColumnByKey, setSeaTableColumn } from './helpers';

const NOT_SUPPORT_COLUMN_TYPES = ['button', 'file'];

const Column = ({ attributes, children, element }) => {

  const editor = useSlateStatic();
  const isSelected = useSelected();
  const { t } = useTranslation();

  const columns = useMemo(() => {
    if (!editor.columns) return [];
    return editor.columns.filter(column => !NOT_SUPPORT_COLUMN_TYPES.includes(column.type));
  }, [editor.columns]);

  const options = useMemo(() => {
    return columns.map(item => {
      const iconClass = COLUMNS_ICON_CONFIG[item.type];
      return {
        value: item.key,
        label: item.name,
        bold: false,
        italic: false,
        iconClass,
      };
    });
  }, [columns]);

  const onColumnChanged = useCallback((option) => {
    const { data } = element;
    const { value: key, label: name, bold, italic } = option;
    const newData = { ...data, ...{ key, name, bold, italic } };
    setSeaTableColumn(editor, newData);
  }, [editor, element]);

  const defaultValue = useMemo(() => {
    const { data } = element || {};  // column model
    const column = getColumnByKey(columns, data.key);
    const value = (column && column.key) || '';
    const optionIndex = options.findIndex(item => item.value === value);
    if (optionIndex === -1) return null;

    // used the old properties
    const option = options[optionIndex];
    const currentOption = { ...option, ...{ bold: data.bold, italic: data.italic } };
    options.splice(optionIndex, 1, currentOption);

    return currentOption;
  }, [columns, element, options]);

  const props = {
    isSelected: isSelected,
    placeholder: t('Select_field'),
    value: defaultValue,
    options,
    onChange: onColumnChanged
  };

  return (
    <span {...attributes}>
      <Select {...props} />
      {children}
    </span>
  );
};

const renderColumn = (props) => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isReadOnly = useReadOnly();
  if (isReadOnly) {
    const { attributes, element } = props;
    const data = element.data || {};
    const columnName = data.name;
    const displayValue = columnName ? `{${columnName}}` : '';
    return (
      <span {...attributes}>{displayValue}</span>
    );
  }

  return <Column {...props} />;
};

export default renderColumn;
