---
title: "TerraformでAWS EKSクラスタを構築し、New Relicを導入する"
emoji: "☸️"
type: "tech"
topics: ["AWS", "EKS", "Kubernetes", "Terraform", "NewRelic"]
published: false
---

# TerraformでAWS EKSクラスタを構築し、New Relicを導入する

このガイドでは、Terraformを使用してAWS EKSクラスタを構築し、New Relicを導入する手順を解説します。

## はじめに

AWS EKS（Elastic Kubernetes Service）は、AWSが提供するマネージドKubernetesサービスです。本記事では、以下の内容を実装します：

- Terraformを使用したIaC（Infrastructure as Code）
- VPCとネットワークの構築
- EKSクラスタとワーカーノードの構築
- New Relicによるモニタリング導入

## 前提条件

- AWSアカウント
- AWS CLI（v2以上）
- Terraform（v1.0以上）
- kubectl
- Helm
- New Relicアカウント

## ステップ1: 環境準備

### 必要なツールのインストール確認

```bash
aws --version
terraform --version
kubectl version --client
helm version
```

### AWS認証情報の設定

```bash
aws configure
```

以下の情報を入力します：
- AWS Access Key ID
- AWS Secret Access Key
- Default region name: `ap-northeast-1`
- Default output format: `json`

### 認証情報の確認

```bash
aws sts get-caller-identity
```

## ステップ2: Terraformプロジェクトの構成

### ディレクトリ構造

```
kiro-eks-newrelic/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── vpc.tf
│   ├── eks.tf
│   ├── outputs.tf
│   ├── terraform.tfvars
│   └── .gitignore
├── kubernetes/
│   ├── new-relic-values.yaml
│   └── deployment-example.yaml
└── scripts/
    ├── setup.sh
    └── cleanup.sh
```

### Terraformファイルの説明

#### main.tf
プロバイダーの設定とデータソースの定義

#### variables.tf
変数の定義（リージョン、クラスタ名、ノード数など）

#### vpc.tf
VPC、サブネット、ルートテーブル、セキュリティグループの構築

#### eks.tf
EKSクラスタ、ノードグループ、IAMロールの構築

#### outputs.tf
クラスタ情報などの出力値

## ステップ3: EKSクラスタの構築

### Terraformの初期化

```bash
cd terraform
terraform init
```

### 変数の確認・編集

`terraform.tfvars` を確認し、必要に応じて編集します：

```hcl
aws_region     = "ap-northeast-1"
cluster_name   = "kiro-eks-cluster"
cluster_version = "1.28"
desired_size   = 2
instance_types = ["t3.medium"]
```

### リソースの作成

```bash
terraform plan
terraform apply
```

**所要時間**: 約15-20分

### 作成状況の確認

```bash
aws eks describe-cluster --name kiro-eks-cluster --region ap-northeast-1
```

## ステップ4: kubectl の設定

### kubeconfig の更新

```bash
aws eks update-kubeconfig --region ap-northeast-1 --name kiro-eks-cluster
```

### 接続確認

```bash
kubectl cluster-info
kubectl get nodes
```

## ステップ5: New Relic の導入

### Helm リポジトリの追加

```bash
helm repo add newrelic https://helm-charts.newrelic.com
helm repo update
```

### New Relic namespace の作成

```bash
kubectl create namespace newrelic
```

### License Key の設定

```bash
kubectl create secret generic newrelic-secret \
  --from-literal=licenseKey=<YOUR_NEW_RELIC_LICENSE_KEY> \
  -n newrelic
```

### New Relic Bundle のインストール

```bash
helm install newrelic-bundle newrelic/nri-bundle \
  --namespace newrelic \
  --set global.licenseKey=<YOUR_NEW_RELIC_LICENSE_KEY> \
  --set global.cluster=kiro-eks-cluster \
  --set newrelic-infrastructure.privileged=true \
  --set kubeEvents.enabled=true \
  --set kubeEvents.integration.enabled=true
```

### インストール確認

```bash
kubectl get pods -n newrelic
kubectl logs -n newrelic -l app.kubernetes.io/name=nri-bundle --tail=50
```

## ステップ6: 動作確認

### New Relic UI での確認

1. [New Relic](https://one.newrelic.com) にログイン
2. Infrastructure > Kubernetes clusters でクラスタを確認
3. Nodes、Pods、Containers の情報が表示されているか確認

### サンプルアプリケーションのデプロイ

```bash
kubectl apply -f kubernetes/deployment-example.yaml
```

### メトリクスの確認

New Relic UI で、デプロイされたアプリケーションのメトリクスが表示されているか確認します。

## トラブルシューティング

### New Relic Pod が起動しない

```bash
kubectl describe pod <pod-name> -n newrelic
kubectl logs <pod-name> -n newrelic
```

### kubectl が接続できない

```bash
aws eks update-kubeconfig --region ap-northeast-1 --name kiro-eks-cluster
```

### Terraform エラー

```bash
export TF_LOG=DEBUG
terraform apply
```

## リソースのクリーンアップ

```bash
# New Relic の削除
helm uninstall newrelic-bundle -n newrelic
kubectl delete namespace newrelic

# EKSクラスタの削除
cd terraform
terraform destroy
```

## まとめ

このガイドでは、Terraformを使用してAWS EKSクラスタを構築し、New Relicを導入する手順を解説しました。

主なポイント：
- IaCによる再現可能なインフラ構築
- VPCとセキュリティグループの適切な設定
- マネージドKubernetesサービスの活用
- 包括的なモニタリング環境の構築

このプロジェクトは学習用です。本番環境での使用には、追加のセキュリティ設定やコスト最適化が必要です。

## 参考リンク

- [AWS EKS ドキュメント](https://docs.aws.amazon.com/eks/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [New Relic Kubernetes Integration](https://docs.newrelic.com/docs/kubernetes-pixie/kubernetes-integration/installation/kubernetes-integration-install-configure/)
- [Helm Charts - New Relic](https://github.com/newrelic/helm-charts)

---

**注意**: このガイドは学習用です。EKSクラスタの実行にはコストが発生します。不要になったら必ずリソースを削除してください。
