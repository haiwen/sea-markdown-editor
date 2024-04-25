# sea-markdown-editor

SeaMarkdown editor is a WYSIWYG Markdown editor based on slate.js. It is used in Seafile and SeaTable project.

## Installation
To install via npm:

```bash
npm install @seafile/seafile-editor --save
```

Import the library into your project:
```javascript
import { MarkdownEditor } from '@seafile/seafile-editor';
```


## Provide components and functions

### Components

|Name|Explain|
|-|-|
|MarkdownEditor|Markdown rich text editor component|
|MarkdownViewer|Markdown content preview component|
|SimpleEditor|A simple markdown editor|

### Functions
|Name|Explain|
|-|-|
|mdStringToSlate|Convert markdown strings to the data format used by the editor|
|slateToMdString|Convert the data format used by the editor to a markdown string|
|processor|Convert markdown string to html format content|

## SimpleEditor usage

### Define api

```javascript
import axios from 'axios';

class API {

  getFileContent() {
    const fileUrl = '';
    return axios.get(fileUrl);
  }

  saveFileContent(content) {
    const updateLink = '';
    const formData = new FormData();
    const blob = new Blob([data], { type: 'text/plain' });
    formData.append('file', blob);
    axios.post(updateLink, formData);
  }

  uploadLocalImage(file) {
    const uploadLink = '';
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(uploadLink, formData);
  }

}

const editorApi = new API();

export default editorApi;
```

### Integrate simple into your own page
```javascript
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleEditor } from '@seafile/seafile-editor';
import { Button } from 'reactstrap';
import editorApi from '../api';

export default function SimpleMarkdownEditor() {

  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    editorApi.getFileContent().then(res => {
      setFileContent(res.data);
      setIsFetching(false);
    });
  }, []);

  const onSave = useCallback(() => {
    const content = editorRef.current.getValue();
     editorApi.saveFileContent(content).then(res => {
      window.alert('Saved successfully')
    });
  }, []);

  const onContentChanged = useCallback(() => {
    setContentVersion(contentVersion + 1);
  }, [contentVersion]);

  return (
    <div className='seafile-editor'>
      <SimpleEditor
        ref={editorRef}
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
        onSave={onSave}
        onContentChanged={onContentChanged}
      />
    </div>
  );
}

```

### Props

Common props you may want to specify include:

* ref: A reference to the editor, used to obtain the current content in the editor
  * ref.current.getValue: Get the current markdown string value in the editor
  * ref.current.getSlateValue:  Get the value of the current slate data format in the editor
* isFetching: Whether the value of the editor is being obtained, if the loading effect is displayed while obtaining, and if the acquisition is completed, the corresponding content obtained is displayed in the editor.
* value: The text content obtained
* onSave: When the editor content changes, the onSave callback event is triggered externally. The user can save the document by implementing this callback function.
* onContentChanged: When the editor content changes, a change event is triggered to facilitate the user to record whether the document

## Functions

`mdStringToSlate(mdString)`
Convert markdown string to data structure supported by editor (slate)

Returns

Slate nodes


`slateToMdString(mdString)`
Convert editor (slate) supported data structures to markdown string

Returns

Markdown string

`processor` processor.process(mdFile)
Convert markdown string to html

Returns

Promise



