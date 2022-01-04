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

## 云端同步

> 可以使用 `rclone` 自动同步到云存储哦

## 细节

- [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf) 
  - `html` 转为 `PDF` 或 图片

