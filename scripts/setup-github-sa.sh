#!/bin/bash
# filepath: /Users/RyoSeah/kyc_client/setup-github-service-account.sh

set -e  # Exit on any error

PROJECT_ID="kyc-dvo-465409"
SERVICE_ACCOUNT_NAME="github-actions"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="github-actions-key.json"

echo "🚀 Setting up GitHub Actions Service Account for project: $PROJECT_ID"

# Check if gcloud is authenticated
if ! gcloud config get-value project &>/dev/null; then
    echo "❌ Please authenticate with gcloud first:"
    echo "   gcloud auth login"
    echo "   gcloud config set project $PROJECT_ID"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable iam.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Check if service account already exists
if gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL &>/dev/null; then
    echo "⚠️  Service account $SERVICE_ACCOUNT_EMAIL already exists. Skipping creation."
else
    echo "👤 Creating service account: $SERVICE_ACCOUNT_NAME..."
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --description="GitHub Actions CI/CD for KYC Client" \
        --display-name="GitHub Actions KYC Client"
fi

# Grant necessary permissions
echo "🔐 Granting IAM permissions..."

# Cloud Run permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/run.admin"

# Container Registry permissions  
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.admin"

# Cloud Build permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/cloudbuild.builds.editor"

# Service Account User (required for Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/containerregistry.ServiceAgent"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/artifactregistry.writer"

# Create and download key
echo "🔑 Creating service account key..."
if [ -f "$KEY_FILE" ]; then
    echo "⚠️  Key file $KEY_FILE already exists. Creating backup..."
    mv "$KEY_FILE" "${KEY_FILE}.backup.$(date +%s)"
fi

gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

echo "✅ Service account setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to your GitHub repository: https://github.com/Ryo-Seah/kyc-client"
echo "2. Navigate to: Settings → Secrets and variables → Actions"
echo "3. Add these secrets:"
echo ""
echo "   Secret Name: GCP_SA_KEY"
echo "   Secret Value: (paste the entire contents of $KEY_FILE)"
echo ""
echo "   Secret Name: BACKEND_URL_KYC"  
echo "   Secret Value: https://kyc-dossier-api-977641841448.asia-southeast1.run.app"
echo ""
echo "4. Delete the key file for security:"
echo "   rm $KEY_FILE"
echo ""
echo "🔒 IMPORTANT: The key file contains sensitive credentials."
echo "   Copy its contents to GitHub Secrets, then delete it immediately!"

# Display the key file contents for easy copying
echo ""
echo "📋 Key file contents (copy this to GitHub Secret GCP_SA_KEY):"
echo "----------------------------------------"
cat $KEY_FILE
echo "----------------------------------------"