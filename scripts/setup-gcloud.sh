#!/bin/bash

echo "🔧 Setting up Google Cloud CLI for project: kyc-dvo-465408"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed."
    echo "📥 Please install it first:"
    echo "   macOS: brew install google-cloud-sdk"
    echo "   Or visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ Google Cloud CLI found"

# Login to Google Cloud
echo "🔐 Logging in to Google Cloud..."
gcloud auth login

# Set the project
echo "📁 Setting project to kyc-dvo..."
gcloud config set project kyc-dvo-465408

# Set the region for Cloud Run
echo "🌏 Setting region to asia-southeast1..."
gcloud config set run/region asia-southeast1
gcloud config set compute/region asia-southeast1
gcloud config set compute/zone asia-southeast1-a

# Verify project is set
echo "🔍 Current project configuration:"
gcloud config get-value project

# Enable required APIs
echo "🚀 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Configure Docker authentication
echo "🐳 Configuring Docker authentication..."
gcloud auth configure-docker

echo "✅ Setup complete! You can now run ./deploy.sh to deploy your app"

# Show current configuration
echo ""
echo "📋 Current Google Cloud Configuration:"
gcloud config list
echo ""
echo "🔑 Active account:"
gcloud auth list --filter=status:ACTIVE --format="value(account)"
