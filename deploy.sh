#!/bin/bash

# Deploy to Google Cloud Run
PROJECT_ID="kyc-dvo"
SERVICE_NAME="kyc-client"
REGION="asia-southeast1"

# Check if gcloud is configured
if ! gcloud config get-value project &>/dev/null; then
    echo "❌ gcloud is not configured. Please run the following commands first:"
    echo ""
    echo "1. Login to Google Cloud:"
    echo "   gcloud auth login"
    echo ""
    echo "2. Set your project:"
    echo "   gcloud config set project $PROJECT_ID"
    echo ""
    echo "3. Enable required APIs:"
    echo "   gcloud services enable cloudbuild.googleapis.com"
    echo "   gcloud services enable run.googleapis.com"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "🚀 Deploying KYC Client to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Service Name: $SERVICE_NAME"
echo "Region: $REGION"

# Build and push to Google Container Registry
echo "📦 Building and pushing image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars VITE_API_BASE_URL="https://kyc-dossier-api-977641841448.us-central1.run.app" \
  --port 8080

echo "✅ Deployment complete!"
echo "🌍 Your app is available at:"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
