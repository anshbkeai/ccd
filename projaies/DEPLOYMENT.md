# AWS ECS Deployment Guide - Fraud Detection API with Kafka

## Overview
This guide covers deploying the fraud detection API to AWS ECS with Kafka configuration.

## Prerequisites
- AWS CLI installed and configured
- Docker installed
- AWS ECR repository created
- Kafka cluster accessible from ECS (MSK, self-hosted, or third-party)
- Trained models in the `models/` directory

## Environment Variables

The application requires these Kafka configuration variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker addresses (comma-separated) | `broker1:9092,broker2:9092` |
| `KAFKA_CONSUMER_TOPIC` | Topic to consume transactions from | `model-txn` |
| `KAFKA_PRODUCER_TOPIC` | Topic to publish results to | `model-resp-txn` |
| `KAFKA_CONSUMER_GROUP` | Consumer group ID | `fraud-detection-group` |

## Local Testing

### 1. Test with Docker Compose (includes Kafka):
```bash
docker-compose up --build
```

### 2. Test the API:
```bash
# Health check
curl http://localhost:8000/health

# Test prediction endpoint
curl -X POST http://localhost:8000/predict_real_world \
  -H "Content-Type: application/json" \
  -d @sample_transaction.json
```

## AWS ECS Deployment

### Step 1: Build and Push Docker Image to ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build the image
docker build -t fraud-detection-api .

# Tag the image
docker tag fraud-detection-api:latest \
  <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fraud-detection-api:latest

# Push to ECR
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fraud-detection-api:latest
```

### Step 2: Configure ECS Task Definition

Update `ecs-task-definition.json` with:
1. Your ECR image URI
2. Your Kafka broker addresses
3. Your AWS region
4. CloudWatch log group name

```json
{
  "environment": [
    {
      "name": "KAFKA_BOOTSTRAP_SERVERS",
      "value": "b-1.msk-cluster.abc123.kafka.us-east-1.amazonaws.com:9092,b-2.msk-cluster.abc123.kafka.us-east-1.amazonaws.com:9092"
    }
  ]
}
```

### Step 3: Register Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json
```

### Step 4: Create ECS Service

```bash
aws ecs create-service \
  --cluster your-cluster-name \
  --service-name fraud-detection-service \
  --task-definition fraud-detection-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancer targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=fraud-detection-container,containerPort=8000
```

## AWS MSK (Managed Kafka) Configuration

If using AWS MSK:

1. **Security Group**: Ensure ECS tasks can access MSK on port 9092
2. **Bootstrap Servers**: Get from MSK console → "View client information"
3. **Example**:
   ```
   KAFKA_BOOTSTRAP_SERVERS=b-1.cluster.kafka.us-east-1.amazonaws.com:9092,b-2.cluster.kafka.us-east-1.amazonaws.com:9092
   ```

## Monitoring

### CloudWatch Logs
```bash
aws logs tail /ecs/fraud-detection-api --follow
```

### Health Check
```bash
curl http://<ALB_DNS_NAME>/health
```

## Troubleshooting

### Kafka Connection Issues
1. Check security groups allow ECS → Kafka on port 9092
2. Verify Kafka brokers are accessible from ECS VPC
3. Check CloudWatch logs for connection errors

### Container Health Check Failing
```bash
# Check logs
aws logs get-log-events \
  --log-group-name /ecs/fraud-detection-api \
  --log-stream-name <stream-name>
```

## Scaling

Update desired task count:
```bash
aws ecs update-service \
  --cluster your-cluster \
  --service fraud-detection-service \
  --desired-count 5
```

## Clean Up

```bash
# Delete service
aws ecs delete-service --cluster your-cluster --service fraud-detection-service --force

# Deregister task definition
aws ecs deregister-task-definition --task-definition fraud-detection-api:1
```
