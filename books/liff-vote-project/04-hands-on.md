---
title: "ハンズオン"
---
## 今回のプロジェクトについて
<!-- TODO remove public/index.js public/liff-starter.js -->
<!-- TODO: githubのLIFF_ID, REQUEST_URL の名前を変える -->

### 利用しているLIFFの機能

- liff.login()
- liff.sendMessages()
- liff.shareTargetPicker()
- liff.isInClient(), liff.isLoggedIn()

### ファイル構成

- /public/index.html → メインのファイル
- /public/liff.js → liff 固有の関数達
- /public/mode.js → モード切り替え

## LINE Login をみてみよう

/public/liff.js の、liff.login() で LINE ログインをしています。setLiffClient で、liff.init をオーバーラップすることで、引数の function の中で、 liff が使えるようにしています。

![](/images/books/liff-vote-project/04-hands-on/line-login-sample.png)

## 投票後のメッセージを変更してみよう

/public/index.html L169 → message only

message以外にもsticky, image を送れるように拡張しやすくする

## シェアメッセージを変更してみよう

1. text に送信者の名前を表示してみる
2. template を Button から FlexMessage に変更してみよう

![](/images/books/liff-vote-project/04-hands-on/share-target-picker.png)
