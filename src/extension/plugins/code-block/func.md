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


Todo:
* [ ] 加粗，斜体，代码块选中后光标没有自动归位
* [ ] 在代码块中禁用代码块 