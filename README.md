# Carbon Foodprint Estimator API

A production-ready NestJS backend API that estimates the carbon footprint of dishes using AI-powered ingredient extraction and carbon footprint calculation.

## 🚀 Features

- **Text-based Estimation**: Extract ingredients and estimate carbon footprint from dish names
- **Image-based Estimation**: Analyze uploaded images to identify ingredients and calculate carbon footprint
- **AI-Powered**: Uses OpenAI GPT models for intelligent ingredient extraction and carbon estimation
- **Production Ready**: Includes proper error handling, validation, logging, and configuration management
- **RESTful API**: Clean, documented endpoints with proper HTTP status codes

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Controller    │───▶│   Estimate       │───▶│   AI Service    │
│   (REST API)    │    │   Service        │    │   (OpenAI)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

## 🛠️ Installation

1. **Clone and navigate to the project:**
   ```bash
   cd carbon-foodprint-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

4. **Configure your API keys in `.env`:**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   PORT=3000
   NODE_ENV=development
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Test Mode
```bash
npm run test
npm run test:e2e
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Carbon Foodprint Estimator API",
  "version": "1.0.0"
}
```

#### 2. Estimate from Dish Name
```http
POST /estimate
Content-Type: application/json
```

**Request Body:**
```json
{
  "dish": "Chicken Biryani"
}
```

**Response:**
```json
{
  "dish": "Chicken Biryani",
  "estimated_carbon_kg": 4.2,
  "ingredients": [
    { "name": "Rice", "carbon_kg": 1.1 },
    { "name": "Chicken", "carbon_kg": 2.5 },
    { "name": "Spices", "carbon_kg": 0.2 },
    { "name": "Oil", "carbon_kg": 0.4 }
  ]
}
```

#### 3. Estimate from Image
```http
POST /estimate/image
Content-Type: multipart/form-data
```

**Request Body:**
```
image: [image file]
```

**File Requirements:**
- Format: JPEG, JPG, PNG
- Max Size: 200MB

**Response:**
```json
{
  "dish": "Dish from Image",
  "estimated_carbon_kg": 3.8,
  "ingredients": [
    { "name": "Rice", "carbon_kg": 1.1 },
    { "name": "Vegetables", "carbon_kg": 0.6 },
    { "name": "Spices", "carbon_kg": 0.2 },
    { "name": "Oil", "carbon_kg": 0.4 }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI services | - | Yes |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` | No |
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` | No |

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 📁 Project Structure

```
src/
├── controllers/          # API endpoints
│   ├── estimate.controller.ts
│   └── health.controller.ts
├── services/            # Business logic
│   ├── estimate.service.ts
│   └── ai.service.ts
├── dto/                 # Data transfer objects
│   └── estimate.dto.ts
├── app.module.ts        # Main application module
├── app.controller.ts    # Default controller
├── app.service.ts       # Default service
└── main.ts             # Application entry point
```

## 🔒 Security Features

- Input validation using class-validator
- File type and size validation
- CORS configuration
- Environment variable management
- Error handling without exposing sensitive information

## 🚀 Production Deployment

### Docker (Recommended)
```bash
# Build the image
docker build -t carbon-foodprint-api .

# Run the container
docker run -p 3000:3000 --env-file .env carbon-foodprint-api
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure proper `ALLOWED_ORIGINS`
3. Use production-grade OpenAI API keys
4. Set up proper logging and monitoring
