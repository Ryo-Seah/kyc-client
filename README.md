# KYC Client

A React + TypeScript frontend application for generating KYC (Know Your Customer) dossiers.

## Features

- **Name Input**: Enter the name of the individual or organisation
- **Category Selection**: Choose between "Individual" or "Organisation"
- **Custom URLs Management**: Add up to 10 custom URLs for enhanced KYC data collection
- **File Download**: Automatically downloads generated DOCX dossier files
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
│   └── index.ts                # Barrel exports for clean imports
├── services/
│   └── api.ts                  # API service for backend requests
├── utils/
│   ├── fileUtils.ts            # File download and naming utilities
│   └── errorHandling.ts        # Centralized error handling
└── App.tsx                     # Main app component
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

### File Download System
- Automatic DOCX file download upon successful dossier generation
- Intelligent file naming based on entity name and category
<!-- - Progress indicators and download status feedback -->
- Cross-browser compatibility for file downloads

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

The frontend expects a POST endpoint at `/submit` that:
- Accepts JSON payload: `{"name": "string", "category": "individual|organisation", "urls": ["url1", "url2", ...]}`
- Returns a DOCX file as response
- The `urls` field is optional and can contain up to 10 custom URLs

Example curl command:
```bash
curl -X POST $VITE_API_BASE_URL/submit \
  -H "Content-Type: application/json" \
  -d '{"name": "Tim Cook", "category": "individual", "urls": ["https://example.com", "https://company.com"]}' \
  --output dossier.docx
```

## Tech Stack

- **React 19** - Frontend framework with latest features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Material-UI** - Modern, accessible UI components
- **Axios** - HTTP client for API requests
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

## Deployment

The application is containerized using Docker and deployed to Google Cloud Run:

- **Build-time environment injection**: Backend URL is injected during build
- **GitHub Actions CI/CD**: Automated deployment on push to main branch
- **Service account authentication**: Secure deployment with minimal permissions
- **Container optimization**: Multi-stage build for minimal image size


## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production 
- `npm run preview` - Preview production build locally
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
