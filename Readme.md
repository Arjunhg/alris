# ALRIS

## Backend

### Used
* Used node.js, express.js and google generative ai
* Used gemini flash model to identify the writing text on canvas and process it for recognition  

### How to run
* npm install
  - This will install all the dependancy
* Make .env and add GEMINI_API_KEY=AIzaSyC6RKSL1Jrb_lRwpfNiLocwe5IWaTOW8aM . This will be your gemini api key(I will delete after hackathon ends)
* npm run dev || npm run start
  - This will start the server

## Frontend
- After starting backend switch to frontend folder
    
### How to run
* npm install
  - This will install all the dependancy
* Add VITE_API_URL=http://localhost:3000 to .env
* npm run dev || npm run start
  - This will start the server

## Test
- Now when opening  http://localhost:5173/ (as it's configured in vite) a canvas will be rendered
- Use this canvas and tools present on the canvas to draw and generate latex equation.
- These equation will be read by backend and processed.

### Demo Screenshots
![Canvas Interface](canvas-interface.png)
![Drawing Example](drawing-example.png)
![Generated Equation](generated.png)