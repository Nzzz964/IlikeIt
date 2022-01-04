# IlikeIt 公众号好文保存

## Why

> 存在了本地就是看过了！🥰

## Feature

- 自定义请求 `Secret`
- 单线程
- 公众号好文转存为 `PDF`

## 自定义 `Secret` 验证

> 修改 `config.js` 中 `valid` 函数

```javascript
module.exports = {
    /**
     * @returns {boolean}
     */
    valid(secret) {
        //返回 true 验证通过
        return true;
    }
}
```

## 使用

```bash
curl -X GET -G 'http://localhost:3000/ilikeit' \
 -d 'url=https://mp.weixin.qq.com' \
 -d 'secret=your secret here'
```

> 文件默认保存在 当前工作目录 `data` 文件夹下

## 环境构建

> 使用 Docker 构建运行环境

```bash
docker build -t ilikeit:latest .

# 构建出的镜像居然达到了惊人的 430M (逃
```
### 挂载点

> PS: `wkhtmltopdf` 可构建在容器中 放在项目根目录 `bin/wkhtmltopdf` 下

|       挂载点       |     作用      |
| :----------------: | :-----------: |
|      /root/ilikeit/bin/wkhtmltopdf      | wkhtmltopdf 可执行文件 |

[wkhtmltopdf executable](https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz) 请自行下载

### 匿名卷

|        目录        |        作用         |
| :----------------: | :-----------------: |
| /root/ilikeit/data | 保存 pdf 文件的目录 |

## 使用

```bash
docker run --name ilikeit \
-p 3000:3000 \
-v $(pwd)/data:/root/ilikeit/data \
-v $(pwd)/cache:/root/ilikeit/cache \
-d ilikeit
```

## 云端同步

> 可以使用 `rclone` 自动同步到云存储哦

## 细节

- [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf) 
  - `html` 转为 `PDF` 或 图片

