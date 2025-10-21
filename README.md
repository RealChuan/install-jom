# Install JOM GitHub Action

- [简体中文](README.md)
- [English](README.en.md)

一个简单高效的 GitHub Action，用于在 Windows 环境中安装 [JOM](https://wiki.qt.io/Jom) - Qt 的并行 make 工具替代品。

## 使用方法

### 完整示例

查看 [example-usage.yml](example-usage.yml) 获取完整的工作流程示例，包含实际构建场景。

### 高级配置

```yaml
steps:
  - name: Install JOM to custom location
    uses: RealChuan/install-jom@main
    with:
      install-path: 'C:\tools\jom'    # 自定义安装路径
      cache-enabled: true             # 开启缓存
```

### 输入参数

| 参数 | 描述 | 必需 | 默认值 |
|------|------|------|---------|
| `install-path` | JOM 安装路径 | 否 | `C:\jom` |
| `cache-enabled` | 是否启用缓存 | 否 | `true` |
