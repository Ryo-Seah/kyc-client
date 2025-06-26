# Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud SDK**: Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. **Docker**: Install [Docker](https://docs.docker.com/get-docker/)
3. **Google Cloud Project**: Create a project in [Google Cloud Console](https://console.cloud.google.com/)

## Setup Steps

### 1. Configure Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID (replace with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker
```

### 2. Update Configuration

Edit `deploy.sh` and replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID:

```bash
PROJECT_ID="your-actual-project-id"
```

### 3. Deploy Options

#### Option A: Manual Deployment (Recommended for first time)

1. **Build and test locally**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Deploy using the script**:
   ```bash
   ./deploy.sh
   ```

#### Option B: Using Cloud Build (Automated)

1. **Trigger build from command line**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

2. **Set up automated builds** (optional):
   - Connect your GitHub repository to Cloud Build
   - Set up triggers for automatic deployment on push

### 4. Environment Variables

The deployment uses these environment variables:
- `VITE_API_BASE_URL`: Set to your production API endpoint

Update in:
- `deploy.sh` (for manual deployment)
- `cloudbuild.yaml` (for automated deployment)
- `.env.production` (for local production builds)

## Deployment Commands

### Quick Deploy
```bash
# Make sure you're in the project directory
cd /path/to/kyc_client

# Run the deployment script
./deploy.sh
```

### Manual Steps
```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/kyc-client .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/kyc-client

# Deploy to Cloud Run
gcloud run deploy kyc-client \
  --image gcr.io/YOUR_PROJECT_ID/kyc-client \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## Monitoring and Management

### View Logs
```bash
gcloud run logs tail kyc-client --region us-central1
```

### Update Service
```bash
# After making changes, redeploy with:
./deploy.sh
```

### View Service Details
```bash
gcloud run services describe kyc-client --region us-central1
```

## Custom Domain (Optional)

1. **Map custom domain**:
   ```bash
   gcloud run domain-mappings create --service kyc-client --domain yourdomain.com --region us-central1
   ```

2. **Update DNS records** as instructed by the command output

## Troubleshooting

### Common Issues

1. **Authentication errors**: Run `gcloud auth login`
2. **Project not set**: Run `gcloud config set project YOUR_PROJECT_ID`
3. **API not enabled**: Enable required APIs using the commands above
4. **Build failures**: Check your Dockerfile and ensure all files are present

### Check Service Status
```bash
gcloud run services list --region us-central1
```

### View Build History
```bash
gcloud builds list
```

## Cost Optimization

Cloud Run pricing is pay-per-request with the following optimizations:
- **Min instances**: Set to 0 (scales to zero when not in use)
- **Max instances**: Set to 10 (adjust based on expected traffic)
- **Memory**: 512Mi (sufficient for React app)
- **CPU**: 1 (adequate for serving static files)

Your app will be available at a URL like: `https://kyc-client-[hash].a.run.app`
