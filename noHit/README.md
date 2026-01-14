# 🔍 Google Search Filter

<div align="center">

**Google検索結果から不要なサイトを非表示にするChrome拡張機能**

[![Chrome](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)](https://www.google.com/chrome/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ 特徴

- 🚫 **ドメイン単位でブロック** - 特定のドメインからの検索結果を自動的に非表示
- ⚡ **リアルタイムフィルタリング** - ページ読み込み時と動的な結果追加に即座に対応
- 🎨 **直感的なUI** - シンプルで使いやすいポップアップ画面
- 🔔 **視覚的なフィードバック** - フィルタリングされた件数を通知で表示
- ☁️ **デバイス間同期** - Chrome Sync Storageで設定を複数デバイスで共有
- 🌐 **サブドメイン対応** - `blog.example.com` も `example.com` で一括ブロック可能

## 📸 スクリーンショット

<!-- TODO: スクリーンショットを追加 -->
```
ここにポップアップUIのスクリーンショットを配置
ここにフィルタリング前後の比較画像を配置
```

## 🚀 インストール

### 方法1: Chrome Web Store（公開後）

<!-- TODO: Chrome Web Storeのリンクを追加 -->
```
Chrome Web Storeから直接インストール（準備中）
```

### 方法2: 開発者モードでインストール

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/google-search-filter.git
   cd google-search-filter
   ```

2. **アイコンファイルを準備**（必須）
   - 以下の3つのアイコンファイルを用意してください：
     - `icon16.png` (16×16px)
     - `icon48.png` (48×48px)
     - `icon128.png` (128×128px)
   - 無料アイコン素材：[Flaticon](https://www.flaticon.com/) / [Icons8](https://icons8.com/)

3. **Chromeに読み込む**
   - Chrome で `chrome://extensions/` を開く
   - 右上の「デベロッパーモード」をON
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - クローンしたフォルダを選択

## 📖 使い方

### ドメインをブロックリストに追加

1. Chromeツールバーの拡張機能アイコンをクリック
2. テキストボックスにブロックしたいドメインを入力
   ```
   例: example.com
   例: blog.example.com
   ```
3. 「追加」ボタンをクリック、またはEnterキーを押す

> **💡 Tips:** `www.` や `https://` は自動的に削除されます

### ドメインを削除

1. 拡張機能のポップアップを開く
2. ブロック中のドメインリストから「削除」ボタンをクリック

### 検索結果の確認

- Google検索を実行すると、ブロックしたドメインが自動的に非表示になります
- 右上に「X件の検索結果を非表示にしました」という通知が表示されます

## 🛠️ 技術スタック

- **Manifest Version:** V3
- **言語:** JavaScript (Vanilla)
- **API:**
  - Chrome Storage API (Sync)
  - Chrome Extension API
  - MutationObserver
- **対応ブラウザ:** Google Chrome
- **対応サイト:** Google検索 (google.com, google.co.jp)

## 📁 ファイル構成

```
google-search-filter/
├── manifest.json       # 拡張機能の設定ファイル
├── content.js          # コンテンツスクリプト（検索結果フィルタリング）
├── popup.html          # ポップアップUI
├── popup.js            # ポップアップのロジック
├── popup.css           # ポップアップのスタイル
├── README.md           # このファイル
└── icon*.png           # 拡張機能のアイコン
```

## 🔧 開発

### ローカルでの開発

1. リポジトリをクローン
2. コードを編集
3. `chrome://extensions/` で「更新」ボタンをクリックして変更を反映

### デバッグ

- **コンソールログを確認:**
  - Google検索ページでF12を押す
  - Console タブで `[検索結果フィルター]` のログを確認

### ビルド（Chrome Web Store用）

```bash
# 不要なファイルを除外してZIPを作成
zip -r extension.zip . -x "*.git*" -x "README.md" -x "*.md"
```

## 🐛 トラブルシューティング

<details>
<summary><b>拡張機能が読み込めない</b></summary>

- アイコンファイル（icon16.png, icon48.png, icon128.png）が存在するか確認
- manifest.json にエラーがないか確認
- Chromeのバージョンが最新か確認
</details>

<details>
<summary><b>フィルタリングが動作しない</b></summary>

- 拡張機能が有効になっているか確認
- ブロックリストにドメインが正しく追加されているか確認
- ページを再読み込み（Ctrl+R / Cmd+R）
- F12でコンソールログを確認
</details>

<details>
<summary><b>ドメインを追加できない</b></summary>

正しいドメイン形式で入力してください：
- ✅ 正しい: `example.com`
- ✅ 正しい: `blog.example.com`
- ❌ 間違い: `https://example.com/page`
- ❌ 間違い: `www.example.com/path`
</details>

## 🤝 コントリビューション

プルリクエストを歓迎します！以下の手順でコントリビュートしてください：

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## ⚠️ 注意事項

- この拡張機能はGoogle検索のみに対応しています
- 検索結果を完全に削除するわけではなく、CSSで非表示にしています
- ブロックリストはChrome Sync Storageに保存され、同じGoogleアカウントでログインしている他のChromeブラウザと同期されます
- この拡張機能はGoogleによって公式にサポートまたは承認されていません

## 📮 サポート・お問い合わせ

- 🐛 バグ報告: [Issues](https://github.com/yourusername/google-search-filter/issues)
- 💡 機能リクエスト: [Issues](https://github.com/yourusername/google-search-filter/issues)
- 📧 その他: [メールアドレス]

---

<div align="center">

**⭐ このプロジェクトが役に立ったら、スターをつけてください！**

Made with ❤️ by [Your Name]

</div>
