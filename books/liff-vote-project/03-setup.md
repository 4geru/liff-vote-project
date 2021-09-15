---
title: "環境構築"
---

## GitPodの拡張の導入

Google Chromeにて、[gitpod]([https://chrome.google.com/webstore/detail/gitpod-always-ready-to-co/dodmmooeoklaejobgleioelladacbeki](https://chrome.google.com/webstore/detail/gitpod-always-ready-to-co/dodmmooeoklaejobgleioelladacbeki)) の拡張を追加します。

## GitPodの追加

[https://github.com/4geru/liff-vote-project](https://github.com/4geru/liff-vote-project) にアクセスし、GitPodに追加します

![](/images/books/liff-vote-project/03-setup/github-liff-vote-project.png)

Githubからログインし、プロジェクトを作成します

## spreadsheetの作成

[spread sheet](https://docs.google.com/spreadsheets/u/1/d/1gkb9pAB6qb9KdwxelH0kMtZev1XwDJa9qQtav50FUXE/copy) からシートをコピーします

ツール > スクリプトエディタ でスクリプトエディタを開きます。

:::message
googleに複数ログインしたでは、script editorを開けない場合があります。
一度アカウントをログアウトしていただくと解消できる可能性があります。
:::

![](/images/books/liff-vote-project/03-setup/spread-sheet-setup.png)

初回アクセスの場合は、アプリを承認する必要があるので、承認をします。

![](/images/books/liff-vote-project/03-setup/google-spread-sheet-first-deploy-access.png =450x)

`アクセス承認` を押すと 安全ではないページ にリンクが飛びますが、アクセスし許可をします。

![](/images/books/liff-vote-project/03-setup/google-spread-sheet-first-deploy-not-allowed-url.png =450x)

コピーで作成したシートのURLを `REQUEST_URL` に貼り付け、デプロイをします。

![](/images/books/liff-vote-project/03-setup/google-spread-sheet-first-deploy-after-page.png =450x)

:::message
2回目以降は、デプロイ > デプロイ管理 > 📝 から バージョンを新しいバージョンに変更し、デプロイをします。
:::

コピーした `REQUEST_URL` は Gitpod の `./public/index.html` の 15行目に貼り付けます。

![](/images/books/liff-vote-project/03-setup/set-variable-for-request-url.png)

## LINE の設定

[LINE Developers]([https://developers.line.biz/console/](https://developers.line.biz/console/)) からLINEの設定をしていきます

:::message
新規の方は、LINE Providerを作成。LINE Providerが既にある方は、LINE Loginを作成します。
:::

![](/images/books/liff-vote-project/03-setup/create-liff-project.png)


### LIFF の作成

作成した LIFF ID を public/index.html の LIFF_ID に登録します。

![](/images/books/liff-vote-project/03-setup/set-variable-for-liff-id.png)

<!-- TODO: 書く -->

## サンプルプログラムが動くかを確認

LIFF URL を LINE にコピーし、モバイルから起動します。モバイルのLINEブラウザでのみ動くコードがあるので、気をつけてください。

一度アンケートの登録 → 回答 → シェア まで動くか確かめてみましょう

:::message
- ローディング中はくるくる状態になりますが、お待ちください
- 期待通り動かない場合は、コピー間違いなどを確認してください
:::