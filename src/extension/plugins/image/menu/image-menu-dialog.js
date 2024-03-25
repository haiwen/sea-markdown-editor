import React, { useState, useRef, useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import isUrl from 'is-url';
import { insertImage } from '../helper';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

const ImageMenuInsertInternetDialog = ({ editor, onToggleImageDialog, className }) => {
  const [imageUrl, setSetImageUrl] = useState('');
  const imgUrlInputRef = useRef(null);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

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

  const onModalContainerMouseDown = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <Modal onMouseDown={onModalContainerMouseDown} isOpen={true} toggle={onToggleImageDialog} className={className} zIndex={1071} onOpened={onModalOpened} onClosed={onToggleImageDialog}>
      <ModalHeader toggle={onToggleImageDialog}>{t('Insert_image')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="imageUrlInput" >{t('Image_address')}</Label>
            <Input invalid={!!imageUrl && isCommitBtnDisabled} type='url' onKeyDown={handleInputKeyDown} id="imageUrlInput" innerRef={imgUrlInputRef} value={imageUrl} onChange={e => setSetImageUrl(e.target.value.trim())} />
            <FormFeedback>
              {t('Image_address_invalid')}
            </FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onToggleImageDialog}>{t('Cancel')}</Button>
        <Button color="primary" disabled={isCommitBtnDisabled} onClick={handleSubmit}>{t('Submit')}</Button>
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

export default ImageMenuInsertInternetDialog;
