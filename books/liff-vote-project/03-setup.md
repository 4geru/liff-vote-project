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

[spread sheet]([https://docs.google.com/spreadsheets/u/1/d/1gkb9pAB6qb9KdwxelH0kMtZev1XwDJa9qQtav50FUXE/copy](https://docs.google.com/spreadsheets/u/1/d/1gkb9pAB6qb9KdwxelH0kMtZev1XwDJa9qQtav50FUXE/copy)) からシートをコピーします

ツール > スクリプトエディタ でスクリプトエディタを開きます。

![](/images/books/liff-vote-project/03-setup/spread-sheet-setup.png)

<!-- // TODO: 初回は認証の話がある -->

コピーで作成したシートのURLを `SHEET_URL` に貼り付け、デプロイをします。

初回は、デプロイ > 新しいデプロイ > デプロイ を押し、 `ウェブアプリURL` をコピーします

2回目以降は、デプロイ > デプロイ管理 > 📝 から バージョンを新しいバージョンに変更し、デプロイをします。

<!-- // TODO: 説明を入れる -->

![](/images/books/liff-vote-project/03-setup/set-variable-for-request-url.png)

## LINE の設定

[LINE Developers]([https://developers.line.biz/console/](https://developers.line.biz/console/)) からLINEの設定をしていきます

新規の方は、LINE Providerを作成。LINE Providerが既にある方は、LINE Loginを作成します。

![](/images/books/liff-vote-project/03-setup/create-liff-project.png)


### LIFF の作成

作成した LIFF ID を public/index.html の LIFF_ID に登録します。

![](/images/books/liff-vote-project/03-setup/set-variable-for-liff-id.png)

## サンプルプログラムが動くかを確認

LIFF URL を LINE にコピーし、モバイルから起動します。モバイルのLINEブラウザでのみ動くコードがあるので、気をつけてください。

一度アンケートの登録 → 回答 → シェア まで動くか確かめてみましょう
