# sea-markdown-editor

SeaMarkdown editor is a WYSIWYG Markdown editor based on slate.js. It is used in Seafile and SeaTable project.

## Markdown editor UI
![markdown editor](./assets/imgs/demo-markdown-editor.png)

## Integrated markdown editor UI
> An integrated demo. You can customize it according to the style you design.

![markdown editor](./assets/imgs/markdown-editor.png)

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
import { Button } from 'reactstrap';
import { MarkdownEditor } from '@seafile/seafile-editor';
import editorApi from './api';

export default function SimpleMarkdownEditor() {

  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);

  const mathJaxSource = '';

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
      <MarkdownEditor
        ref={editorRef}
        isFetching={isFetching}
        value={fileContent}
        initValue={''}
        editorApi={editorApi}
        onSave={onSave}
        onContentChanged={onContentChanged}
        mathJaxSource={mathJaxSource}
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
* initValue: If value does not exist, a default value can be provided via initValue
* onSave: When the editor content changes, the onSave callback event is triggered externally. The user can save the document by implementing this callback function.
* onContentChanged: When the editor content changes, a change event is triggered to facilitate the user to record whether the document
* mathJaxSource: A static path to access mathJax content. You can download it through http://cdn.mathjax.org/mathjax/latest/MathJax.js and put it on your own server, or use this address directly

## Functions

### `mdStringToSlate(mdString)`
Convert markdown string to data structure supported by editor (slate)

**Params**

* mdString: markdown string

**Returns**

&emsp; Slate nodes


### `slateToMdString(slateNodes)`
Convert editor (slate) supported data structures to markdown string

**Params**

* slateNodes: slate nodes

**Returns**

&emsp; Markdown string

### `processor` processor.process(mdString)
Convert markdown string to html

**Params**

* mdString: markdown string

**Returns**

&emsp;Promise

Demo
```javascript
const string = '# Hello, I am first level title'
processor.process(string).then(result => {
  const html = String(result);
  ...
})

```



