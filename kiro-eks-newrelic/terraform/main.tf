terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # ローカル状態ファイルを使用
  # 本番環境ではS3バックエンドの使用を推奨
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "eks/terraform.tfstate"
  #   region         = "ap-northeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# データソース: 利用可能なAZを取得
data "aws_availability_zones" "available" {
  state = "available"
}
