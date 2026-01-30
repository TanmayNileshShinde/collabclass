# CollabClass

A full-stack video calling application built with typescript React (Vite) frontend and Express backend, featuring real-time video conferencing powered by Stream.io and authentication via Clerk.
Can import github repo and has collaborative whiteboard functionality along with real time video / audio call and chat features and screen sharing.  


## Project Structure

```
zoom-clone/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── providers/     # Context providers
│   │   └── lib/           # Utility functions
│   └── public/         # Static assets
└── backend/           # Express backend
    └── src/
        ├── routes/        # API routes
        └── server.ts      # Express server
```

## Features

- 🎥 Real-time video calling with Stream.io
- 🔐 Authentication with Clerk
- 📅 Schedule meetings
- 📹 Join meetings via link
- 🎙️ Personal meeting rooms
- 📊 View call history and recordings
- 📱 Responsive design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Clerk account (for authentication)
- Stream.io account (for video calling)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd zoom-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_BASE_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Copy Public Assets

Make sure to copy the `public` folder from the root directory to the `frontend` directory, or create a symlink:

```bash
# From the root directory
cp -r public frontend/public
```

## Environment Variables

### Backend (.env)

- `PORT`: Backend server port (default: 4000)
- `FRONTEND_URL`: Frontend URL for CORS
- `STREAM_API_KEY`: Stream.io API key
- `STREAM_SECRET_KEY`: Stream.io secret key
- `CLERK_SECRET_KEY`: Clerk secret key

### Frontend (.env)

- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `VITE_STREAM_API_KEY`: Stream.io API key (same as backend)
- `VITE_BASE_URL`: Base URL for the frontend application

## Getting API Keys

### Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your Publishable Key and Secret Key
4. Add `http://localhost:3000` to your allowed origins

### Stream.io Setup

1. Go to [Stream Dashboard](https://dashboard.getstream.io/)
2. Create a new application
3. Copy your API Key and Secret
4. Enable video calling features

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Sign in or sign up using Clerk authentication
4. Create or join meetings
5. Use personal room for instant meetings

## Technologies Used

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Stream.io Video SDK
- Clerk React SDK
- Radix UI

### Backend

- Express.js
- TypeScript
- Stream.io Node SDK
- Clerk Node SDK


### whiteboard 

<img width="1696" height="889" alt="Screenshot 2026-01-08 at 12 33 41 AM" src="https://github.com/user-attachments/assets/88987983-3e57-423c-b9a3-fb93a11e46e0" />


## Troubleshooting

### CORS Issues

Make sure the `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Authentication Issues

Verify your Clerk keys are correct and the frontend URL is added to Clerk's allowed origins.

### Stream.io Issues

Ensure your Stream.io API keys are correct and video features are enabled in your Stream dashboard.
