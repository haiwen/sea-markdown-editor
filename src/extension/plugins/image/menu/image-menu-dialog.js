import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { insertImage } from '../helper';

export const ImageMenuInsertInternetDialog = (props) => {
  const { editor, onToggleImageDialog, className } = props;
  const [url, seturl] = useState('');
  const editorSelection = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    editorSelection.current = editor.selection;
  }, [editor]);

  const handleSubmit = () => {
    insertImage(editor, url);
    onToggleImageDialog();
  };

  return (
    <Modal isOpen={true} toggle={onToggleImageDialog} className={className} zIndex={1071}>
      <ModalHeader toggle={onToggleImageDialog}>{t('insert_image')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="columnName">{t('image_address')}</Label>
            <Input id="columnName" value={url} onChange={e => seturl(e.target.value)} autoFocus={true} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onToggleImageDialog}>{t('cancel')}</Button>
        <Button color="primary" disabled={url.length === 0} onClick={handleSubmit}>{t('submit')}</Button>
      </ModalFooter>
    </Modal>
  );
};

ImageMenuInsertInternetDialog.defaultProps = {
  classname: '',
};

ImageMenuInsertInternetDialog.propTypes = {
  editor: PropTypes.object.isRequired,
  onToggleImageDialog: PropTypes.func.isRequired,
  className: PropTypes.string
};
