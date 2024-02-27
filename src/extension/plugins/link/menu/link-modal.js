import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { insertLink, isLinkType, updateLink } from '../helper';
import { isUrl } from '../../../../utils/common';

const LinkModal = ({ editor, onCloseModal, linkTitle, linkUrl }) => {
  const [formData, setFormData] = useState({ linkUrl: linkUrl ?? '', linkTitle: linkTitle ?? '', });
  const [validatorErrorMessage, setValidatorErrorMessage] = useState({ linkUrl: '', linkTitle: '', });
  const linkAddressRef = useRef(null);
  const { t } = useTranslation();

  const isSubmitDisabled = useMemo(() => {
    const isFormDataEmpty = Object.values(formData).some((value) => value.length === 0);
    if (isFormDataEmpty) return true;
    const isValidatorErrorMessage = Object.values(validatorErrorMessage).some((value) => value.length > 0);
    if (isValidatorErrorMessage) return true;
    return false;
  }, [formData, validatorErrorMessage]);

  const onOpened = useCallback(() => {
    linkAddressRef.current?.focus();
  }, []);

  /**
   * @param {String} formItemName  form item name
   * @param {String} formItemValue form item value
   * @returns if validate passed, return Promise.resolve(); else return Promise.reject(error message);
   */
  const validateFormData = useCallback((formItemName, formItemValue) => {
    if (formItemName === 'linkUrl') {
      if (formItemValue.length === 0) return Promise.reject('Link_address_required');
      if (!isUrl(formItemValue)) return Promise.reject('Link_address_invalid');
    }
    if (formItemName === 'linkTitle') {
      if (!formItemValue.length) return Promise.reject('Link_title_required');
      if (!formItemValue.trim().length) return Promise.reject('Blank_title_not_allowed');
    }
    return Promise.resolve();
  }, []);

  const preProcessBeforeOnchange = useCallback((formItemName, formItemValue) => {
    if (formItemName === 'linkUrl') {
      return formItemValue.trim();
    }
    return formItemValue;
  }, []);

  const onFormValueChange = useCallback((e) => {
    const formItemName = e.target.name;
    let formItemValue = e.target.value;
    // pre-process form item value
    formItemValue = preProcessBeforeOnchange(formItemName, formItemValue);
    validateFormData(formItemName, formItemValue).then(
      () => setValidatorErrorMessage({ ...validatorErrorMessage, [formItemName]: '' }),
      (errMsg) => setValidatorErrorMessage({ ...validatorErrorMessage, [formItemName]: errMsg })
    );
    setFormData({ ...formData, [formItemName]: formItemValue });
  }, [formData, preProcessBeforeOnchange, validateFormData, validatorErrorMessage]);

  const onSubmit = useCallback((e) => {
    // re-validate form data before submit
    Object.entries(formData)
      .forEach(([key, value]) => validateFormData(key, value)
        .catch((errMsg) => setValidatorErrorMessage(prev => ({ ...prev, [key]: errMsg })))
      );
    if (!isSubmitDisabled) {
      const isLinkActive = isLinkType(editor);
      isLinkActive
        ? updateLink(editor, formData.linkUrl, formData.linkTitle)
        : insertLink({ editor, url: formData.linkUrl, title: formData.linkTitle });
      onCloseModal();
    }
    e.preventDefault();
    e.stopPropagation();
  }, [editor, formData, isSubmitDisabled, onCloseModal, validateFormData]);

  const onKeydown = useCallback((e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  }, [onSubmit]);

  return (
    <Modal isOpen={true} toggle={onCloseModal} onOpened={onOpened}>
      <ModalHeader toggle={onCloseModal}>{t('Insert_link')}</ModalHeader>
      <ModalBody>
        <Form onChange={onFormValueChange}>
          <FormGroup >
            <Label for='linkUrl'>{t('Link_address')}</Label>
            <Input
              onKeyDown={onKeydown}
              // `onChange={() => void 0}`  to fix reactstrap error which need `onChange` when `value` setteled, (`onChange` has been listened at `<Form>` )
              onChange={() => void 0}
              value={formData.linkUrl}
              invalid={!!validatorErrorMessage.linkUrl}
              name='linkUrl'
              innerRef={linkAddressRef}
              type='url'
              id='linkUrl'
            />
            <FormFeedback>{t(validatorErrorMessage.linkUrl)}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for='linkTitle'>{t('Link_title')}</Label>
            <Input
              onKeyDown={onKeydown}
              // `onChange={() => void 0}`  to fix reactstrap error which need `onChange` when `value` setteled, (`onChange` has been listened at `<Form>` )
              onChange={() => void 0}
              value={formData.linkTitle}
              invalid={!!validatorErrorMessage.linkTitle}
              name='linkTitle'
              id='linkTitle'
            />
            <FormFeedback>{t(validatorErrorMessage.linkTitle)}</FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onCloseModal} color="secondary">{t('Cancel')}</Button>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} color="primary">{t('Add_link')}</Button>
      </ModalFooter>
    </Modal>
  );
};

LinkModal.propTypes = {
  editor: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  linkTitle: PropTypes.string,
  linkUrl: PropTypes.string,
};

export default LinkModal;
