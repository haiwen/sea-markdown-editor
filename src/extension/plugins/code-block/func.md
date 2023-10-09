# 插件调研

## Code Block插件

* 禁用条件
  * `readonly` false
  * `selection` null
  * selected elements contain `void element`

* 启用条件
  * selected elements contain `CODE_BLOCK`,`PARAGRAPH`

* 快捷键
  * `mod+enter` exit_code_block
  * `tab` increase_code_block_indent
  * `mod+a` select entire code block

* 问题与实现
  * 在插入代码块时会检测下方是否有空行，如果没有则自动插入一行`Paragraph`，此操作为避免无法结束代码块，或无法在代码块后插入新的`Paragraph`。

* 与seafile-editor的区别
  * code-line不会存在于code-block中
  * quote-block不会存在于code-block中

Todo:

* [ ] 加粗，斜体，代码块选中后光标没有自动归位
* [ ] 在代码块中禁用代码块
* [ ] 加粗、斜体选中后一直连续触发再取消，选中内容会变少
* [ ] 在code Block中，加粗斜体，代码行 禁用
* [ ]  123
