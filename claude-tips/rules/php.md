---
paths: "**/*.php"
---

# PHP コーディング規約

## PHP実行コマンドの選択

プロジェクトの依存管理ツールに応じて、適切なPHP実行コマンドを使用します。

### 優先順位

1.  **Composer使用時** - `composer.json` ファイルが存在する場合
    -   スクリプト実行: `composer run-script <script-name>` または `composer <script-name>`
    -   テスト実行: `composer test` (または `scripts` で定義されたテストコマンド)
    -   PHPUnit直接実行: `./vendor/bin/phpunit`

2.  **スタンドアロン** - Composerが使われていない、または `vendor` ディレクトリがない場合
    -   `php <script.php>`

### 確認方法

プロジェクトルートで `composer.json` ファイルの有無を確認します。

```bash
ls composer.json 2>/dev/null
```

`composer.json` の `scripts` セクションに、プロジェクト固有のコマンドが定義されていることが多いです。

例: `composer.json`
```json
{
    "scripts": {
        "test": "phpunit",
        "post-install-cmd": [
            "@php artisan optimize"
        ]
    }
}
```
この場合、 `composer test` でテストを実行できます。
