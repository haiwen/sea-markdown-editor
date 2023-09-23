<<<<<<< HEAD
import React, { useState, useRef, useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import isUrl from 'is-url';
import { insertImage } from '../helper';

const ImageMenuInsertInternetDialog = ({ editor, onToggleImageDialog, className }) => {
  const [imageUrl, setSetImageUrl] = useState('');
  const imgUrlInputRef = useRef(null);
  const { t } = useTranslation();

  const isCommitBtnDisabled = useMemo(() => {
    if (imageUrl.length === 0) return true;
    if (!isUrl(imageUrl)) return true;
    return false;
  }, [imageUrl]);

  const onModalOpened = () => {
    imgUrlInputRef?.current?.focus();
  };

  const handleSubmit = (e) => {
    if (!isUrl(imageUrl)) return false;
    if (imageUrl.length === 0) return;
    insertImage(editor, imageUrl);
    onToggleImageDialog();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Modal isOpen={true} toggle={onToggleImageDialog} className={className} zIndex={1071} onOpened={onModalOpened} onClosed={onToggleImageDialog}>
=======
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
>>>>>>> 8397516 (feat: image-plugin)
      <ModalHeader toggle={onToggleImageDialog}>{t('Insert_image')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
<<<<<<< HEAD
            <Label for="imageUrlInput" >{t('Image_address')}</Label>
            <Input invalid={imageUrl && isCommitBtnDisabled} type='url' onKeyDown={handleInputKeyDown} id="imageUrlInput" innerRef={imgUrlInputRef} value={imageUrl} onChange={e => setSetImageUrl(e.target.value.trim())} />
            <FormFeedback>
              {t('Image_address_invalid')}
            </FormFeedback>
=======
            <Label for="columnName">{t('Image_address')}</Label>
            <Input id="columnName" value={url} onChange={e => seturl(e.target.value)} autoFocus={true} />
>>>>>>> 8397516 (feat: image-plugin)
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onToggleImageDialog}>{t('Cancel')}</Button>
<<<<<<< HEAD
        <Button color="primary" disabled={isCommitBtnDisabled} onClick={handleSubmit}>{t('Submit')}</Button>
=======
        <Button color="primary" disabled={url.length === 0} onClick={handleSubmit}>{t('Submit')}</Button>
>>>>>>> 8397516 (feat: image-plugin)
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
<<<<<<< HEAD

export default ImageMenuInsertInternetDialog;
=======
>>>>>>> 8397516 (feat: image-plugin)
