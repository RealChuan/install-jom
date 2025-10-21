# Install JOM GitHub Action

-   [简体中文](README.md)
-   [English](README.en.md)

A simple and efficient GitHub Action for installation in Windows environment[COME ON](https://wiki.qt.io/Jom)- Parallel make tool replacement for Qt.

## How to use

### Complete example

Check[example-usage.yml](example-usage.yml)Get a complete workflow example, including real-world build scenarios.

### Advanced configuration

```yaml
steps:
  - name: Install JOM to custom location
    uses: RealChuan/install-jom@main
    with:
      install-path: 'C:\tools\jom'    # 自定义安装路径
      cache-enabled: true             # 开启缓存
```

### input parameters

| parameter       | describe                  | required | default value |
| --------------- | ------------------------- | -------- | ------------- |
| `install-path`  | JOM installation path     | no       | `C:\jom`      |
| `cache-enabled` | Whether to enable caching | no       | `true`        |
