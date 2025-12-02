#!/bin/bash

# AWS EKS + New Relic クリーンアップスクリプト
# このスクリプトは、構築したリソースをすべて削除します

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

# 確認
confirm_cleanup() {
    log_warn "このスクリプトは、すべてのリソースを削除します"
    log_warn "この操作は取り消せません"
    
    read -p "本当に削除しますか？ (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "キャンセルされました"
        exit 0
    fi
}

# サンプルアプリケーションの削除
cleanup_sample_app() {
    log_info "サンプルアプリケーションを削除中..."
    
    kubectl delete namespace demo-app --ignore-not-found=true || true
    
    log_info "サンプルアプリケーションの削除が完了しました"
}

# New Relic の削除
cleanup_new_relic() {
    log_info "New Relic を削除中..."
    
    helm uninstall newrelic-bundle -n newrelic || log_warn "New Relic Bundle は既に削除されています"
    
    kubectl delete namespace newrelic --ignore-not-found=true || true
    
    log_info "New Relic の削除が完了しました"
}

# EKSクラスタの削除
cleanup_eks_cluster() {
    log_info "EKSクラスタを削除中..."
    
    cd terraform
    
    log_info "Terraform destroy を実行中..."
    terraform destroy -auto-approve
    
    log_info "EKSクラスタの削除が完了しました"
    
    cd ..
}

# kubeconfig の削除
cleanup_kubeconfig() {
    log_info "kubeconfig を削除中..."
    
    CLUSTER_NAME=$(grep "cluster_name" terraform/terraform.tfvars | grep -oP '"\K[^"]+')
    
    # kubeconfig から該当するクラスタを削除
    kubectl config delete-cluster $CLUSTER_NAME || log_warn "クラスタ設定は既に削除されています"
    kubectl config delete-context arn:aws:eks:*:*:cluster/$CLUSTER_NAME || log_warn "コンテキストは既に削除されています"
    
    log_info "kubeconfig の削除が完了しました"
}

# メイン処理
main() {
    log_info "AWS EKS + New Relic クリーンアップを開始します"
    
    confirm_cleanup
    cleanup_sample_app
    cleanup_new_relic
    cleanup_eks_cluster
    cleanup_kubeconfig
    
    log_info "クリーンアップが完了しました"
}

# スクリプト実行
main
