# KYC Client

A React + TypeScript frontend application for generating KYC (Know Your Customer) dossiers with real-time progress tracking and asynchronous processing.

## Features

- **Name Input**: Enter the name of the individual or organisation
- **Category Selection**: Choose between "Individual" or "Organisation"
- **Custom URLs Management**: Add up to 10 custom URLs for enhanced KYC data collection
- **Asynchronous Processing**: Submit dossier requests and track progress in real-time
- **Real-time Progress Tracking**: Live updates via Server-Sent Events (SSE) showing:
  - Overall progress percentage
  - Current processing phase
  - Links scraped and attributes processed
  - Phase-specific details
- **File Download**: Download completed DOCX dossier files when processing is complete
- **Job Management**: Cancel ongoing jobs and retry failed submissions
- **Environment Configuration**: Supports both local development and production API endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **Modular Architecture**: Clean component-based structure for maintainability


## Project Architecture

The application follows a modular, component-based architecture for maintainability and scalability:

```
src/
├── components/
│   ├── NameInput.tsx           # Name input field component
│   ├── CategorySelector.tsx    # Category dropdown component  
│   ├── CustomUrlsManager.tsx   # Custom URLs management (up to 10 URLs)
│   ├── SubmitButton.tsx        # Submit button with loading state
│   ├── StatusMessage.tsx       # Success/error message display
│   ├── ProgressTracker.tsx     # Real-time progress tracking UI
│   └── index.ts                # Barrel exports for clean imports
├── services/
│   ├── api.ts                  # API service for async submission and download
│   ├── auth.ts                 # Firebase authentication service
│   └── progressTracker.ts      # Server-Sent Events progress tracking
├── utils/
│   ├── fileUtils.ts            # File download and naming utilities
│   └── errorHandling.ts        # Centralized error handling
└── App.tsx                     # Main app component with async flow
```

### Component Design Principles

- **Single Responsibility**: Each component has a clear, focused purpose
- **Reusability**: Components are designed to be reusable across the application
- **Type Safety**: Full TypeScript support with proper interface definitions
- **Error Boundaries**: Comprehensive error handling at component and service levels
- **Clean Separation**: Business logic separated from UI components

## Key Features Detail

### Custom URLs Management
- Users can add up to 10 custom URLs for enhanced KYC data collection
- Dynamic add/remove controls with intuitive plus/minus buttons
- Real-time validation and URL formatting
- Seamless integration with the KYC dossier generation process

### Asynchronous Processing & Progress Tracking
- **Job-based Submission**: Submit dossier requests and receive job IDs for tracking
- **Real-time Progress Updates**: Live progress tracking via Server-Sent Events (SSE)
- **Phase-specific Details**: See detailed progress including:
  - Links scraped vs. total links
  - Attributes completed vs. total attributes
  - Current processing phase and task
- **Job Management**: Cancel ongoing jobs and retry failed submissions
- **Progress UI**: Material-UI progress bars and phase indicators

### File Download System
- Download completed DOCX files when processing is complete
- Intelligent file naming based on entity name and category
- Cross-browser compatibility for file downloads
- Secure download with authentication tokens

### Error Handling & User Experience
- Comprehensive error handling with user-friendly messages
- Loading states and progress indicators
- Form validation and input sanitization
- Responsive design for various screen sizes

## Environment Setup

The application uses environment variables to configure the API endpoint:

```env
# Production
VITE_API_BASE_URL="example.com"

# Local Development  
VITE_API_BASE_URL="http://localhost:5050"
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Copy `.env.example` to `.env` (if needed)
   - Set `VITE_API_BASE_URL` to your backend URL

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Deployment to Google Cloud Run**:
   
   Set up Google Cloud authentication and service account:
   ```bash
   # Only needed for initial setup or migrating to different GCP account
   ./scripts/setup-gcloud.sh
   ./scripts/setup-github-sa.sh
   ```
   
   Configure GitHub Actions secrets:
   - Add `GCP_SA_KEY`: Copy contents of `github-actions-key.json` 
   - Add `BACKEND_URL`: Set to your hosted backend URL
   
   Deploy using GitHub Actions or manually:
   ```bash
   ./deploy.sh
   ```
  
## Backend API

The frontend uses an asynchronous API with the following endpoints:

### 1. Submit Dossier Request
**POST** `/submit`
- Accepts JSON payload: `{"name": "string", "category": "individual|organisation", "urls": ["url1", "url2", ...]}`
- Returns job information: `{"job_id": "string", "status": "started|error", "message": "string"}`
- The `urls` field is optional and can contain up to 10 custom URLs

### 2. Progress Tracking
**GET** `/api/progress/{job_id}?token={auth_token}`
- Server-Sent Events (SSE) endpoint for real-time progress updates
- Returns progress updates in JSON format with phase details

### 3. Download Completed Dossier
**GET** `/download/{job_id}`
- Downloads the completed DOCX file when processing is finished
- Requires authentication token in headers

Example API flow:
```bash
# 1. Submit dossier request
curl -X POST $VITE_API_BASE_URL/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Tim Cook", "category": "individual", "urls": ["https://example.com"]}'

# Response: {"job_id": "abc123", "status": "started", "message": "Job started successfully"}

# 2. Track progress (SSE)
curl -N -H "Authorization: Bearer $TOKEN" \
  "$VITE_API_BASE_URL/api/progress/abc123?token=$TOKEN"

# 3. Download completed file
curl -H "Authorization: Bearer $TOKEN" \
  "$VITE_API_BASE_URL/download/abc123" \
  --output dossier.docx
```

## Tech Stack

- **React 19** - Frontend framework with latest features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server with proxy configuration
- **Material-UI** - Modern, accessible UI components with progress indicators
- **Axios** - HTTP client for API requests with error handling
- **Server-Sent Events (SSE)** - Real-time progress tracking
- **Firebase Auth** - User authentication and token management
- **Google Cloud Run** - Containerized deployment platform

## Development Guidelines

### Code Organization
- Components are grouped by functionality in the `components/` directory
- Business logic is abstracted into services (`services/`)
- Utility functions are centralized in `utils/`
- Type definitions are co-located with their respective components

### Best Practices
- All components use TypeScript interfaces for props
- Error handling is centralized and consistent
- API calls are abstracted through the service layer
- Environment variables are properly typed and validated
- Code follows ESLint and TypeScript strict mode rules

### Testing & Quality
- Components are designed for testability with clear interfaces
- Error boundaries protect against runtime failures
- Comprehensive error handling covers network and validation errors
- Build process includes type checking and linting

## Troubleshooting

### Common Issues

#### CORS Errors in Production
If you encounter CORS errors in production, ensure your backend:
- Handles OPTIONS preflight requests properly (returns 200, not 415)
- Includes proper CORS headers for your frontend domain
- Doesn't require `Content-Type: application/json` for OPTIONS requests

#### Immediate Download Issue
If the app immediately downloads an unopenable file:
- This was caused by CORS errors being treated as successful responses
- Fixed by adding `validateStatus` to axios calls to properly handle HTTP errors
- Ensure your backend CORS configuration is correct

#### Development vs Production URLs
- **Development**: Uses Vite proxy (`/submit`, `/download`, `/api/progress`) → `http://localhost:8080`
- **Production**: Uses full API URLs from `VITE_API_BASE_URL` environment variable
- EventSource (SSE) always uses full URLs as Vite proxy doesn't work with SSE

## Deployment

The application is containerized using Docker and deployed to Google Cloud Run:

- **Build-time environment injection**: Backend URL is injected during build
- **GitHub Actions CI/CD**: Automated deployment on push to main branch
- **Service account authentication**: Secure deployment with minimal permissions
- **Container optimization**: Multi-stage build for minimal image size


## Available Scripts

- `npm run dev` - Start development server with hot reload and CORS proxy
- `npm run build` - Build for production 
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once and exit
- `npm run lint` - Run ESLint for code quality checks
- `./scripts/setup-gcloud.sh` - Set up Google Cloud CLI and project
- `./scripts/setup-github-sa.sh` - Create service account for GitHub Actions
- `./deploy.sh` - Manual deployment to Google Cloud Run

## Project Files

```
kyc_client/
├── src/                    # Source code
├── public/                 # Static assets
├── scripts/                # Deployment and setup scripts
├── dist/                   # Built application (generated)
├── Dockerfile              # Container configuration
├── nginx.conf              # Nginx configuration for production
├── .env                    # Environment variables (local)
├── .env.production         # Production environment variables
└── package.json            # Dependencies and scripts
```

---

# Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
