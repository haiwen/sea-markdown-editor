# sea-markdown-editor

SeaMarkdown editor is a WYSIWYG Markdown editor based on slate.js. It is used in Seafile and SeaTable project.

## Provide components

|Name|Explain|
|-|-|
|MarkdownEditor|markdown Rich text editor component|
|MarkdownViewer|markdown Content preview component|

## Instructions

1. npm install @seafile/seafile-editor
2. code demo
```javascript
import { MarkdownEditor } from '@seafile/seafile-editor';

export default Editor = (props) => {

  return <MarkdownEditor {...props} />;
  
}
```


