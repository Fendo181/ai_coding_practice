# AWS EKS + New Relic 構築ガイド

このプロジェクトは、Terraformを使用してAWS EKSクラスタを構築し、New Relicを導入するための学習用ガイドです。

## 前提条件

- AWSアカウント（既に用意済み）
- AWS CLI がインストール済み
- Terraform がインストール済み（v1.0以上推奨）
- kubectl がインストール済み
- New Relic アカウント（既に用意済み）
- New Relic License Key

## ディレクトリ構成

```
kiro-eks-newrelic/
├── README.md                 # このファイル
├── IMPLEMENTATION_GUIDE.md   # 詳細な実装手順
├── terraform/
│   ├── main.tf              # メインのTerraform設定
│   ├── variables.tf         # 変数定義
│   ├── outputs.tf           # 出力値定義
│   ├── vpc.tf               # VPC関連リソース
│   ├── eks.tf               # EKS関連リソース
│   ├── terraform.tfvars     # 変数値（.gitignoreに追加）
│   └── .gitignore           # Terraform用gitignore
├── kubernetes/
│   ├── new-relic-values.yaml # New Relic Helm values
│   └── deployment-example.yaml # サンプルデプロイメント
└── scripts/
    ├── setup.sh             # セットアップスクリプト
    └── cleanup.sh           # クリーンアップスクリプト
```

## クイックスタート

1. **前提条件の確認**
   ```bash
   aws --version
   terraform --version
   kubectl version --client
   ```

2. **AWS認証情報の設定**
   ```bash
   aws configure
   ```

3. **Terraformの初期化**
   ```bash
   cd terraform
   terraform init
   ```

4. **変数の設定**
   `terraform.tfvars` を編集して、必要な値を設定します。

5. **リソースの作成**
   ```bash
   terraform plan
   terraform apply
   ```

6. **kubectl の設定**
   ```bash
   aws eks update-kubeconfig --region <region> --name <cluster-name>
   ```

7. **New Relic の導入**
   詳細は `IMPLEMENTATION_GUIDE.md` を参照してください。

## 注意事項

- このガイドは学習用です。本番環境での使用には追加のセキュリティ設定が必要です。
- EKSクラスタの実行にはコストが発生します。不要になったら必ずリソースを削除してください。
- `terraform.tfvars` には機密情報が含まれるため、`.gitignore` に追加してください。

## 次のステップ

1. `IMPLEMENTATION_GUIDE.md` で詳細な手順を確認
2. Terraformファイルを確認・カスタマイズ
3. クラスタを構築
4. New Relic を導入
5. 動作確認

## リソースのクリーンアップ

```bash
cd terraform
terraform destroy
```

---

詳細な実装手順は `IMPLEMENTATION_GUIDE.md` を参照してください。
