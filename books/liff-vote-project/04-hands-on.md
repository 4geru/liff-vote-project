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

## 01. LINE Login をみてみよう

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

## 02. プロフィールにユーザー名を表示してみよう

コメントアウトされている部分のコメントを外します。

```javascript:./public/liff.js
const getProfile = async (liffClient) => {
  liffClient(() => {
    liff.getProfile().then((profile) => {
      // 02. プロフィールにユーザー名を表示してみよう
      // document.getElementById('user-name').innerText = profile.displayName
      document.getElementById('icon').src = profile.pictureUrl
      userId = profile.userId
    })
  })
}
```

ヘッダーにユーザー名が表示されます。

![](/images/books/liff-vote-project/04-handson/display-user-name.jpg =300x)

## 03. 投票後のメッセージを変更してみよう

投票後に、 `ユーザーが投票しました` とメッセージをしています。sendMessageを拡張してみましょう。


```javascript:./public/index.js
const submitVoteEvent = async () => {
  ...
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
}
```

### 03-01. Messageを複数メッセージしてみましょう
現在は、 sendMessage に 1つのメッセージが表示されていますが、もう一つ追加してみましょう。

:::details ヒント
sendMessage が配列になっています。メッセージを追加することで、複数メッセージを送信できます。
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

### 03-02. スタンプを送信してみよう
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

## 04. シェアメッセージを変更してみよう

シェアボタンを押すと、 shareTargetPicker を利用して、友達に LINE Message をシェアすることが可能です。

```javascript:./public/index.js
const submitShareEvent = () => {
  const liffClient = setLiffClient()
  liffClient(async () => {
    const question = document.getElementById('question').innerText
    liff.shareTargetPicker([
      // ↓ Button Message などのテンプレートメッセージは、PC版では表示されない
      buttonMessage(question),
      // ↓ Flex Message は、PC版でも表示される
      // flexMessage(question)
    ])
  })
}

const buttonMessage = (question) => {
  const profile = await liff.getProfile()
  return {
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
        },
        {
          "type": "uri",
          "label": "ツイートする",
          "uri": TWEET_URL
        }
      ]
    }
  }
}
```

### 04-01. text に送信者の名前を表示してみましょう
:::details ヒント
liff.getProfile() を利用して、buttons のテンプレートに profile.displayName を記述してみましょう

```javascript
const buttonMessage = (question) => {
  const profile = await liff.getProfile()
  return {
    "type": "template",
    "altText": "アンケートリクエストが送られました",
    "template": {
      "type": "buttons",
      ...
      "text": `${profile.displayName}さんから「${question}」のアンケートリクエストが来ています`,
    }
    ...
  }
  ...
}
```
:::

### 04-02. actionを変えてみよう
[actionについて](https://developers.line.biz/ja/docs/messaging-api/actions/) / [LINE URLスキーム](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/)

- カメラを開く [https://line.me/R/nv/camera/](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-the-camera-and-camera-roll)
- GPSを送る [https://line.me/R/nv/location/](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#sending-the-location-screen)
- 公式アカウントのシェア [https://line.me/R/ti/p/@LINE_ID](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#sharing-line-official-account)
- LINE公式アカウントのプロフィール [https://line.me/R/home/public/profile?id=LINE_ID](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-timeline-and-profile)
- 連携アプリ一覧 [https://line.me/R/nv/connectedApps](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-line-app-settings-screens)
- スタンプショップのホーム [https://line.me/R/nv/stickerShop](https://developers.line.biz/ja/docs/messaging-api/using-line-url-scheme/#opening-the-sticker-shop)

:::details ヒント
```javascript:./public/index.js
const buttonMessage = (question) => {
  ...
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
  ...
}
```
:::

## ☕️ 🍰 ここまでできたらひと休憩 ☕️ 🍰
ここまでの感想をツイートしてみましょう！


### 05. template を Button から [FlexMessage](https://developers.line.biz/ja/docs/messaging-api/using-flex-messages/#sending-hello-world) に変更してみよう
Button Message では、PC版では、「スマートフォンでのみ確認可能なメッセージです。」と表示されます。
しかし、FlexMessageを使うことで、PC版でも確認することができます。
FlexMessageを使ったほうが良いです。
![](/images/books/liff-vote-project/04-handson/compare-button-message-and-liff-message.png =300x)

`buttonMessage(question)` をコメントにして、 `flexMessage(question)` をコメントアウトしてみましょう。

```javascript:./public/index.js
const submitShareEvent = () => {
  ...
  liffClient(async () => {
    const profile = await liff.getProfile()
    const question = document.getElementById('question').innerText
    liff.shareTargetPicker([
      // ↓ Button Message などのテンプレートメッセージは、PC版では表示されない
      buttonMessage(question),
      // ↓ Flex Message は、PC版でも表示される
      // flexMessage(question)
    ])
  })
}
```

Flex Messageについての記事がを貼っておくので、興味があればどんどん触ってください
- [Flex Messageを送信する](https://developers.line.biz/ja/docs/messaging-api/using-flex-messages/)
- [Flex Messageのレイアウト](https://developers.line.biz/ja/docs/messaging-api/flex-message-layout/)
- [Flex Message（APIリファレンス）](https://developers.line.biz/ja/reference/messaging-api/#flex-message)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)