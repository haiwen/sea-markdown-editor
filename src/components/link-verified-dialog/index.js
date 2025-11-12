/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useMemo } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import ModalHeader from '../modal-header';
import { TRANSLATE_NAMESPACE } from '../../constants';

import './index.css';

const LinkVerifiedDialog = ({
  onToggle,
  link,
}) => {
  const url = useMemo(() => decodeURIComponent(link), [link]);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const copyLink = useCallback(() => {
    copy(url);
    onToggle && onToggle();
  }, [url, onToggle]);

  const openLink = useCallback(() => {
    window.open(url);
    onToggle && onToggle();
  }, [url, onToggle]);

  const { host, protocol, pathname } = new URL(url);

  return (
    <Modal isOpen={true} toggle={onToggle} className="sf-link-verified-dialog" zIndex={1071}>
      <ModalHeader toggle={onToggle}>
        <span className="mr-2">{t('This_link_is_not_verified')}</span>
      </ModalHeader>
      <ModalBody>
        <p className="sf-tip-default mb-5">
          {t('This_link_is_not_verified_tip')}
        </p>
        <div className="sf-verify-link">
          <span className="sf-tip-default">{protocol + '//'}</span>
          <span>{host}</span>
          <span className="sf-tip-default">{pathname ? decodeURIComponent(pathname) : ''}</span>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={copyLink} className="m-0 mr-2">{t('Copy_link')}</Button>
        <Button color="primary" className="m-0" onClick={openLink}>{t('Open_link')}</Button>
      </ModalFooter>
    </Modal>
  );
};

export default LinkVerifiedDialog;
