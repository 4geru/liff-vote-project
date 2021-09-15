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

`./public/liff.js` の、liff.login() で LINE ログインをしています。setLiffClient で、`liff.init` をオーバーラップすることで、引数の function の中で、 liff が使えるようにしています。

```javascript:./public/liff.js
window.addEventListener('load', async () => {
  const liffClient = await setLiffClient()

  liffClient(() => { if(!liff.isLoggedIn())liff.login(); })
  getProfile(liffClient)
});

const setLiffClient = () => {
  return (func) => { liff.init({ liffId: LIFF_ID }).then(func) }
}

// * setLiffClient の使い方
// const liffClient = await setLiffClient()
// liffClient(async () => {
//   const profile = await liff.getProfile()
//   ...
// })
```

## 投票後のメッセージを変更してみよう

投票後に、 `ユーザーが投票しました` とメッセージをしています。sendMessageを拡張してみましょう。


```javascript:./public/index.html
// 投票したことをLINEメッセージで送る
const liffClient = await setLiffClient()
liffClient(async () => {
  // LINE の inbrowser でない場合はメッセージが送れない
  if(liff.isInClient()) {
    const profile = await liff.getProfile()
    await sendMessage([
      {
        'type': 'text',
        'text': `${profile.displayName}が投票しました`
      }
    ])
  }
})
```

### 1. Messageを複数メッセージしてみましょう
:::details ヒント
sendMessage が配列になっているので、複数メッセージを送信してみましょう
```javascript
await sendMessage([
  {
    'type': 'text',
    'text': `${profile.displayName}が投票しました`
  },
  {
    'type': 'text',
    'text': '投票ありがとうございます'
  }
])
```
:::

### 2. スタンプを送信してみよう
[API ドキュメント](https://developers.line.biz/ja/reference/messaging-api/#text-message) / [スタンプリスト](https://developers.line.biz/ja/docs/messaging-api/sticker-list/)
:::details ヒント
sticker オブジェクトを追加してみましょう
```javascript
await sendMessage([
  {
    'type': 'text',
    'text': `${profile.displayName}が投票しました`
  },
  {
  "type": "sticker",
    "packageId": "11537",
    "stickerId": "52002735"
  }
])
```
:::

## シェアメッセージを変更してみよう

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
          "text": `「${question}」のアンケートリクエストが来ています`,
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

### 1. text に送信者の名前を表示してみましょう
:::details ヒント
buttons のテンプレートに profile.displayName を記述しましょう
```javascript
liff.shareTargetPicker([
  {
    "type": "template",
    "altText": "アンケートリクエストが送られました",
    "template": {
      "type": "buttons",
      ...
      "text": `${profile.displayName}さんから「${question}」のアンケートリクエストが来ています`,
    }
    ...
  }
])
```
:::

### 2. actionを変えてみよう
[actionについて](https://developers.line.biz/ja/docs/messaging-api/actions/) / [LINE URLスキーム](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/)

- カメラを開く [https://line.me/R/nv/camera/](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-the-camera-and-camera-roll)
- GPSを送る [https://line.me/R/nv/location/](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#sending-the-location-screen)
- 公式アカウントのシェア [https://line.me/R/ti/p/@LINE_ID](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#sharing-line-official-account)
- LINE公式アカウントのプロフィール [https://line.me/R/home/public/profile?id=LINE_ID](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-timeline-and-profile)
- 連携アプリ一覧 [https://line.me/R/nv/connectedApps](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-line-app-settings-screens)
- スタンプショップのホーム [https://line.me/R/nv/stickerShop](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-the-sticker-shop)

:::details ヒント
"actions": [
  {
    "type": "uri",
    "label": "投票する",
    "uri": liff.permanentLink.createUrl()
  },
  {
    "type": "uri",
    "label": "連携アプリ一覧をみる",
    "uri": 'https://line.me/R/nv/connectedApps'
  }
]
:::


### 3. template を Button から [FlexMessage](https://developers.line.biz/ja/docs/messaging-api/using-flex-messages/#sending-hello-world) に変更してみよう
<!-- TODO: FlexMessageの良さを伝える -->
[API ドキュメント](https://developers.line.biz/ja/reference/messaging-api/#template-messages)
:::details ヒント
TODO
:::