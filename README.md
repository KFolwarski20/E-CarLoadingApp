# Charging Optimizer

App for finding the best time to charge an EV based on clean energy mix.

## Tech stack
- Frontend: Vue.js
- Backend: Node.js
- Docker

## Run project

### Backend
- cd ./Backend
- docker build -t e-carLoadingApp
- docker run -p 3000:3000 e-carLoadingApp

Backend runs on http://localhost:3000

### Frontend
- cd ./Frontend
- npm install
- npm run dev

Frontend runs on http://localhost:5173