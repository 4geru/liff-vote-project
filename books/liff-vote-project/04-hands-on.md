---
title: "ハンズオン"
---
## 今回のプロジェクトについて
### 利用しているLIFFの機能

- liff.login()
- liff.sendMessages()
- liff.shareTargetPicker()
- liff.isInClient(), liff.isLoggedIn()

### ファイル構成
今回は `./public` 以下のファイルを触っていきます

- `./public/index.html` → メインのファイル
- `./public/liff.js` → liff 固有の関数達
- `./public/mode.js` → モード切り替え

## LINE Login をみてみよう

`./public/liff.js` の、liff.login() で LINE ログインをしています。setLiffClient で、liff.init をオーバーラップすることで、引数の function の中で、 liff が使えるようにしています。

```javascript:./public/liff.js
window.addEventListener('load', async () => {
    const liffClient = await setLiffClient()

    liffClient(() => { if(!liff.isLoggedIn())liff.login(); })
    getProfile(liffClient)
});

const setLiffClient = () => {
    return (func) => { liff.init({ liffId: LIFF_ID }).then(func) }
}
```

## 投票後のメッセージを変更してみよう

/public/index.html L169 → message only

message以外にもsticky, image を送れるように拡張しやすくする

## シェアメッセージを変更してみよう

1. text に送信者の名前を表示してみる
2. template を Button から FlexMessage に変更してみよう

```javascript:./public/index.html
const submitShareEvent = () => {
  const liffClient = setLiffClient()
  liffClient(async () => {
    const profile = await liff.getProfile()
    const question = document.getElementById('question').innerText
    liff.shareTargetPicker([
      {
        "type": "template",
        "altText": "アンケートリクエストが送られました",
        "template": {
            "type": "buttons",
            "imageAspectRatio": "rectangle",
            "imageSize": "cover",
            "imageBackgroundColor": "#FFFFFF",
            "title": "アンケートリクエスト",
            "text": `${profile.displayName}さんから「${question}」のアンケートリクエストが来ています`,
            "actions": [
              {
                "type": "uri",
                "label": "投票する",
                "uri": liff.permanentLink.createUrl()
              }
            ]
        }
      }
    ])
  })
}
```