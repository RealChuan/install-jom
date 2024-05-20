# Install jom on windows

这个GitHub Action旨在在Windows系统上安装`jom`。`jom`是一个轻量级的构建工具，通常用作`nmake`的替代品。

## 使用方法

要在您的工作流程中使用此操作，请将以下步骤添加到您的`.github/workflows`目录中：

```yaml
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: RealChuan/install-jom@main
```
