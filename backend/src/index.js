import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { SERVER_URL, PORT } from './constants.js'
import calculateRouter from './routes/calculator.js';

config();

const app = express();

app.use(cors());
app.use(express.json( { limit: '50mb' } ));

app.get('/', (req, res) => {
    res.json({
        message: "Server is running"
    })
})

app.use('/calculate', calculateRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER_URL}:${PORT}`);
})