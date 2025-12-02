# AWS EKS + New Relic 実装ガイド

## ステップ1: 環境準備

### 1.1 必要なツールのインストール確認

```bash
# AWS CLI
aws --version

# Terraform
terraform --version

# kubectl
kubectl version --client

# Helm（New Relic導入に必要）
helm version
```

### 1.2 AWS認証情報の設定

```bash
aws configure
# 以下の情報を入力
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: ap-northeast-1 (または任意のリージョン)
# Default output format: json
```

### 1.3 認証情報の確認

```bash
aws sts get-caller-identity
```

## ステップ2: Terraformプロジェクトの初期化

### 2.1 ディレクトリ構造の作成

```bash
cd kiro-eks-newrelic
mkdir -p terraform kubernetes scripts
```

### 2.2 Terraformの初期化

```bash
cd terraform
terraform init
```

## ステップ3: Terraformファイルの作成

### 3.1 variables.tf - 変数定義

変数定義ファイルを作成します。

### 3.2 main.tf - プロバイダー設定

AWS プロバイダーの設定を行います。

### 3.3 vpc.tf - VPC とネットワークリソース

EKSクラスタが動作するVPCを作成します。

### 3.4 eks.tf - EKSクラスタとノードグループ

EKSクラスタとワーカーノードを作成します。

### 3.5 outputs.tf - 出力値

クラスタ情報などの出力値を定義します。

### 3.6 terraform.tfvars - 変数値

実際の値を設定します。

## ステップ4: EKSクラスタの構築

### 4.1 計画の確認

```bash
cd terraform
terraform plan
```

### 4.2 リソースの作成

```bash
terraform apply
```

**所要時間**: 約15-20分

### 4.3 作成状況の確認

```bash
# EKSクラスタの確認
aws eks describe-cluster --name <cluster-name> --region <region>

# ノードグループの確認
aws eks list-nodegroups --cluster-name <cluster-name> --region <region>
```

## ステップ5: kubectl の設定

### 5.1 kubeconfig の更新

```bash
aws eks update-kubeconfig \
  --region <region> \
  --name <cluster-name>
```

### 5.2 接続確認

```bash
kubectl cluster-info
kubectl get nodes
kubectl get pods --all-namespaces
```

## ステップ6: New Relic の導入

### 6.1 Helm リポジトリの追加

```bash
helm repo add newrelic https://helm-charts.newrelic.com
helm repo update
```

### 6.2 New Relic namespace の作成

```bash
kubectl create namespace newrelic
```

### 6.3 New Relic License Key の設定

```bash
kubectl create secret generic newrelic-secret \
  --from-literal=licenseKey=<YOUR_NEW_RELIC_LICENSE_KEY> \
  -n newrelic
```

### 6.4 New Relic Kubernetes Integration のインストール

```bash
helm install newrelic-bundle newrelic/nri-bundle \
  --namespace newrelic \
  --set global.licenseKey=<YOUR_NEW_RELIC_LICENSE_KEY> \
  --set global.cluster=<cluster-name> \
  --set newrelic-infrastructure.privileged=true \
  --set kubeEvents.enabled=true \
  --set kubeEvents.integration.enabled=true
```

### 6.5 インストール確認

```bash
# Pod の確認
kubectl get pods -n newrelic

# ログの確認
kubectl logs -n newrelic -l app.kubernetes.io/name=nri-bundle --tail=50
```

## ステップ7: 動作確認

### 7.1 New Relic UI での確認

1. New Relic にログイン
2. Infrastructure > Kubernetes clusters で、クラスタが表示されているか確認
3. Nodes、Pods、Containers の情報が表示されているか確認

### 7.2 サンプルアプリケーションのデプロイ

```bash
kubectl apply -f kubernetes/deployment-example.yaml
```

### 7.3 メトリクスの確認

New Relic UI で、デプロイされたアプリケーションのメトリクスが表示されているか確認します。

## ステップ8: クリーンアップ

### 8.1 New Relic の削除

```bash
helm uninstall newrelic-bundle -n newrelic
kubectl delete namespace newrelic
```

### 8.2 EKSクラスタの削除

```bash
cd terraform
terraform destroy
```

**注意**: リソースの削除には数分かかります。

## トラブルシューティング

### New Relic Pod が起動しない

```bash
# Pod の詳細確認
kubectl describe pod <pod-name> -n newrelic

# ログの確認
kubectl logs <pod-name> -n newrelic
```

### kubectl が接続できない

```bash
# kubeconfig の確認
cat ~/.kube/config

# 再度設定
aws eks update-kubeconfig --region <region> --name <cluster-name>
```

### Terraform エラー

```bash
# 状態ファイルの確認
terraform state list

# 詳細ログの有効化
export TF_LOG=DEBUG
terraform apply
```

## 参考リンク

- [AWS EKS ドキュメント](https://docs.aws.amazon.com/eks/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [New Relic Kubernetes Integration](https://docs.newrelic.com/docs/kubernetes-pixie/kubernetes-integration/installation/kubernetes-integration-install-configure/)
- [Helm Charts - New Relic](https://github.com/newrelic/helm-charts)

---

次のステップ: Terraformファイルの作成に進みます。
