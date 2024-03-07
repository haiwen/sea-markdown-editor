import React, { Fragment } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';

import './style.css';

const isMac = window.navigator.platform.indexOf('Win') < 0 ? true : false;
const controlKey = isMac ? '⌘' : 'CTRL';

class KeyboardShortcuts extends React.PureComponent {

  renderShortcut = (keys) => {
    return (
      <Fragment>
        <span className="keyboard-shortcut">
          {keys.map((key, index) => {
            return <kbd key={index}>{key}</kbd>;
          })}
        </span><br/>
      </Fragment>
    );
  };

  renderContainer = (keys, description) => {
    return (
      <div className="keyboard-shortcut-container">
        <div className="col-4">{this.renderShortcut(keys)}</div>
        <div className="col-8">{description}</div>
      </div>
    );
  };

  render() {
    let { t, toggleShortcutDialog } = this.props;
    const userHelp = t('userHelp', { returnObjects: true });
    const userHelpData = userHelp.userHelpData;
    return (
      <Modal isOpen={true} toggle={toggleShortcutDialog} className="keyboard-shortcut-dialog" zIndex={1071}>
        <ModalHeader toggle={toggleShortcutDialog}>
          <span className="mr-2">{t(userHelp.title)}</span>
        </ModalHeader>
        <ModalBody>
          <div>
            {/* Title */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[1]['shortcutType'])}</div>
              {this.renderContainer(['#', 'space'], t(userHelpData[1].shortcutData['Heading_1']))}
              {this.renderContainer(['##', 'space'], t(userHelpData[1].shortcutData['Heading_2']))}
              {this.renderContainer(['###', 'space'], t(userHelpData[1].shortcutData['Heading_3']))}
              {this.renderContainer(['####', 'space'], t(userHelpData[1].shortcutData['Heading_4']))}
              {this.renderContainer(['#####', 'space'], t(userHelpData[1].shortcutData['Heading_5']))}
              {this.renderContainer(['######', 'space'], t(userHelpData[1].shortcutData['Heading_6']))}
            </div>
            {/* List */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[0]['shortcutType'])}</div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['*', 'space'])}
                  {this.renderShortcut(['-', 'space'])}
                </div>
                <div className="col-8">{t(userHelpData[0].shortcutData['Make_list'])}</div>
              </div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['1.', 'space'])}
                </div>
                <div className="col-8">{t(userHelpData[0].shortcutData['Make_ordered_list'])}</div>
              </div>
              {this.renderContainer(['Tab'], t(userHelpData[0].shortcutData['Increase_depth']))}
              {this.renderContainer(['Shift', 'Enter'], t(userHelpData[0].shortcutData['Insert_child_in_item']))}
              {this.renderContainer(['Enter'], t(userHelpData[0].shortcutData['Insert_new_item']))}
            </div>
            {/* Inline */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[6]['shortcutType'])}</div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['**bold**', 'space'])}
                  {this.renderShortcut(['__bold__', 'space'])}
                </div>
                <div className="col-8">{t(userHelpData[6].shortcutData['Bold'])}</div>
              </div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['*italic*', 'space'])}
                  {this.renderShortcut(['_italic_', 'space'])}
                </div>
                <div className="col-8">{t(userHelpData[6].shortcutData['Italic'])}</div>
              </div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['***italic***', 'space'])}
                  {this.renderShortcut(['___italic___', 'space'])}
                </div>
                <div className="col-8">{t(userHelpData[6].shortcutData['Italic_Bold'])}</div>
              </div>
              {this.renderContainer(['`code`', 'space'], t(userHelpData[6].shortcutData['Inline_code']))}
            </div>
            {/* Code block */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[2]['shortcutType'])}</div>
              <div className="keyboard-shortcut-container">
                <div className="col-4">
                  {this.renderShortcut(['```'])}
                  {this.renderShortcut(['space*4'])}
                </div>
                <div className="col-8">{t(userHelpData[2].shortcutData['Make_code_block'])}</div>
              </div>
              {this.renderContainer(['Tab'], t(userHelpData[2].shortcutData['Insert_indent']))}
              {this.renderContainer(['Enter'], t(userHelpData[2].shortcutData['Insert_new_line']))}
              {this.renderContainer([controlKey, 'Enter'], t(userHelpData[2].shortcutData['Escape_code_block']))}
            </div>
            {/* Block quote */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[3]['shortcutType'])}</div>
              {this.renderContainer(['>', 'space'], t(userHelpData[3].shortcutData['Make_Block_quote']))}
              {this.renderContainer(['Enter'], t(userHelpData[3].shortcutData['Escape_Block_quote']))}
            </div>
            {/* Table */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[4]['shortcutType'])}</div>
              {this.renderContainer(['Enter'], t(userHelpData[4].shortcutData['Insert_Table_Row']))}
              {this.renderContainer([controlKey, 'Enter'], t(userHelpData[4].shortcutData['Escape_table']))}
            </div>
            {/* Save */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[7]['shortcutType'])}</div>
              {this.renderContainer([controlKey, 's'], t(userHelpData[7].shortcutData['Save_file']))}
            </div>
            {/* Image */}
            <div className="pb-2">
              <div className="keyboard-shortcut-title pb-1">{t(userHelpData[8]['shortcutType'])}</div>
              {this.renderContainer([controlKey, 'v'], t(userHelpData[8].shortcutData['Paste_screen_shot']))}
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation('seafile-editor')(KeyboardShortcuts);

