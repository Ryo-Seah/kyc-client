# KYC Client

A React + TypeScript frontend application for generating KYC (Know Your Customer) dossiers.

## Features

- **Name Input**: Enter the name of the individual or organisation
- **Category Selection**: Choose between "Individual" or "Organisation" 
- **File Download**: Automatically downloads generated DOCX dossier files
- **Environment Configuration**: Supports both local development and production API endpoints
- **Error Handling**: Comprehensive error handling and user feedback

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

## Backend API

The frontend expects a POST endpoint at `/submit` that:
- Accepts JSON payload: `{"name": "string", "category": "individual|organisation"}`
- Returns a DOCX file as response

Example curl command:
```bash
curl -X POST $VITE_API_BASE_URL/submit \
  -H "Content-Type: application/json" \
  -d '{"name": "Tim Cook", "category": "individual"}' \
  --output dossier.docx
```

## Tech Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI** - UI components
- **Axios** - HTTP client

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
