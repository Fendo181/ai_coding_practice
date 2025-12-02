#!/bin/bash

# AWS EKS + New Relic セットアップスクリプト
# このスクリプトは、EKSクラスタの構築とNew Relicの導入を自動化します

set -e

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 前提条件の確認
check_prerequisites() {
    log_info "前提条件を確認中..."
    
    # AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI がインストールされていません"
        exit 1
    fi
    log_info "AWS CLI: $(aws --version)"
    
    # Terraform
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform がインストールされていません"
        exit 1
    fi
    log_info "Terraform: $(terraform --version | head -n 1)"
    
    # kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl がインストールされていません"
        exit 1
    fi
    log_info "kubectl: $(kubectl version --client --short)"
    
    # Helm
    if ! command -v helm &> /dev/null; then
        log_error "Helm がインストールされていません"
        exit 1
    fi
    log_info "Helm: $(helm version --short)"
    
    log_info "前提条件の確認が完了しました"
}

# AWS認証情報の確認
check_aws_credentials() {
    log_info "AWS認証情報を確認中..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS認証情報が設定されていません"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    log_info "AWS Account ID: $ACCOUNT_ID"
}

# Terraformの初期化と実行
setup_eks_cluster() {
    log_info "EKSクラスタを構築中..."
    
    cd terraform
    
    log_info "Terraform を初期化中..."
    terraform init
    
    log_info "Terraform プランを確認中..."
    terraform plan -out=tfplan
    
    read -p "リソースを作成しますか？ (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Terraform を実行中..."
        terraform apply tfplan
        log_info "EKSクラスタの構築が完了しました"
    else
        log_warn "キャンセルされました"
        exit 0
    fi
    
    cd ..
}

# kubeconfig の設定
configure_kubectl() {
    log_info "kubectl を設定中..."
    
    CLUSTER_NAME=$(cd terraform && terraform output -raw cluster_id)
    AWS_REGION=$(cd terraform && terraform output -raw cluster_id | cut -d'-' -f1)
    
    # 正しいリージョンを取得
    AWS_REGION=$(grep "aws_region" terraform/terraform.tfvars | grep -oP '"\K[^"]+')
    
    log_info "クラスタ名: $CLUSTER_NAME"
    log_info "リージョン: $AWS_REGION"
    
    aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
    
    log_info "kubectl の設定が完了しました"
}

# クラスタの確認
verify_cluster() {
    log_info "クラスタを確認中..."
    
    log_info "クラスタ情報:"
    kubectl cluster-info
    
    log_info "ノード情報:"
    kubectl get nodes
    
    log_info "Pod情報:"
    kubectl get pods --all-namespaces
}

# New Relic のセットアップ
setup_new_relic() {
    log_info "New Relic を導入中..."
    
    read -p "New Relic License Key を入力してください: " -r NEW_RELIC_LICENSE_KEY
    
    if [ -z "$NEW_RELIC_LICENSE_KEY" ]; then
        log_error "License Key が入力されていません"
        exit 1
    fi
    
    # Helm リポジトリの追加
    log_info "Helm リポジトリを追加中..."
    helm repo add newrelic https://helm-charts.newrelic.com
    helm repo update
    
    # Namespace の作成
    log_info "newrelic namespace を作成中..."
    kubectl create namespace newrelic || log_warn "newrelic namespace は既に存在します"
    
    # Secret の作成
    log_info "New Relic License Key を設定中..."
    kubectl create secret generic newrelic-secret \
        --from-literal=licenseKey=$NEW_RELIC_LICENSE_KEY \
        -n newrelic \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # New Relic Bundle のインストール
    log_info "New Relic Bundle をインストール中..."
    CLUSTER_NAME=$(cd terraform && terraform output -raw cluster_id)
    
    helm install newrelic-bundle newrelic/nri-bundle \
        --namespace newrelic \
        --set global.licenseKey=$NEW_RELIC_LICENSE_KEY \
        --set global.cluster=$CLUSTER_NAME \
        --set newrelic-infrastructure.privileged=true \
        --set kubeEvents.enabled=true \
        --set kubeEvents.integration.enabled=true
    
    log_info "New Relic の導入が完了しました"
}

# New Relic の確認
verify_new_relic() {
    log_info "New Relic Pod を確認中..."
    
    sleep 10
    
    kubectl get pods -n newrelic
    
    log_info "New Relic ログを確認中..."
    kubectl logs -n newrelic -l app.kubernetes.io/name=nri-bundle --tail=20 || true
}

# サンプルアプリケーションのデプロイ
deploy_sample_app() {
    read -p "サンプルアプリケーションをデプロイしますか？ (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "サンプルアプリケーションをデプロイ中..."
        kubectl apply -f kubernetes/deployment-example.yaml
        
        log_info "デプロイメント情報:"
        kubectl get deployments -n demo-app
        
        log_info "Pod情報:"
        kubectl get pods -n demo-app
        
        log_info "Service情報:"
        kubectl get svc -n demo-app
    fi
}

# メイン処理
main() {
    log_info "AWS EKS + New Relic セットアップを開始します"
    
    check_prerequisites
    check_aws_credentials
    setup_eks_cluster
    configure_kubectl
    verify_cluster
    setup_new_relic
    verify_new_relic
    deploy_sample_app
    
    log_info "セットアップが完了しました！"
    log_info "New Relic UI で https://one.newrelic.com にアクセスしてください"
}

# スクリプト実行
main
