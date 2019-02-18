# ptosh-ticket

### 概要

PivotalのAPIを使用してデータを取得、整形して、htmlファイルを作成するプログラムです。<br>
descriptionに「# 要求」が存在するかつステータスが「accepted」のチケットを対象としています。

### 手順
.envファイルを直下に作成し、Pivotalのプロフィールページに記載されているAPI tokenを入れてください。
```
API_TOKEN=xxx
```

初回の時はnode_modulesをインストールしてください。
```
yarn
```

dist/main.jsファイルが無いもしくはjavascriptを更新した時はビルドをしてください。
```
npm run build
```

以下のコマンドで```dist/files```内にHTMLファイルが作成されます。（権限がない場合は```chmod +x```を行ってください）
```
./cli.js
```
