import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownViewer } from '@seafile/seafile-editor';
import { Button } from 'reactstrap';
import editorApi from '../api';
import { serverConfig } from '../setting';

import '../assets/css/seafile-editor.css';

export default function SeafileViewer() {

  const [fileContent, setFileContent] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [isShowOutline, setIsShowOutLine] = useState(true);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileContent(`To run the Garbage Collection (GC) command in a Docker-based Seafile installation, follow these steps:
1. **Access the Docker Container**: First, you need to get into the running Seafile Docker container. You can do this by using the following command:
   \`\`\`
    docker exec -it seaf_container /bin/bash
   \`\`\`

2. **Stop Seafile Service**: Before running the garbage collection script, you need to stop the Seafile service within the container using:
   \`\`\`
/opt/seafile/seafile-server-latest/seafile.sh stop
   \`\`\`

3. **Run the Garbage Collection**: Now you can run the garbage collection script. Use the following command:
   \`\`\`
/opt/seafile/seafile-server-latest/seaf-gc.sh
   \`\`\`

4. **Start Seafile Service Again**: After the garbage collection process is complete, you need to restart the Seafile service with:
   \`\`\`
/opt/seafile/seafile-server-latest/seafile.sh start
   \`\`\`

5. **Verify**: Optionally, you can check the logs or use the Docker command to see the status of usage after garbage collection, if needed.

This method will help you clear up unused blocks and reduce the storage used by deleted files in your Seafile Docker installation.`);
      setIsFetching(false);
    });
  }, []);

  const onOutlineToggle = useCallback(() => {
    setIsShowOutLine(!isShowOutline);
  }, [isShowOutline]);

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <Button className='helper' onClick={onOutlineToggle}>{isShowOutline ? 'Close outline' : 'Show outline'}</Button>
      </div>
      <div className='markdown-viewer-container'>
        <MarkdownViewer
          isFetching={isFetching}
          value={fileContent}
          editorApi={editorApi}
          isShowOutline={isShowOutline}
          mathJaxSource={serverConfig.mathJaxSource}
        />
      </div>
    </div>
  );
}
