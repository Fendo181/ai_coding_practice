# AWS Region
aws_region = "ap-northeast-1"

# Cluster Configuration
cluster_name    = "kiro-eks-cluster"
cluster_version = "1.28"
environment     = "learning"

# Network Configuration
vpc_cidr              = "10.0.0.0/16"
public_subnet_cidrs   = ["10.0.101.0/24", "10.0.102.0/24"]
private_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]

# Node Group Configuration
desired_size = 2
min_size     = 1
max_size     = 3
instance_types = ["t3.medium"]

# Tags
tags = {
  Project     = "kiro-eks-newrelic"
  Environment = "learning"
  ManagedBy   = "Terraform"
}
