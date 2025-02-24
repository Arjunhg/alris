import express from 'express';
import { analyzeImage } from '../utils/imageAnalyzer.js';
import sharp from 'sharp';

const router = express.Router();

router.post('/', async(req, res) => {

    try {
        
        const { image, dict_of_vars } = req.body;

        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0...
        // split(',')[0] → "data:image/png;base64"
        // split(',')[1] → "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0..."


        const base64Data = image.split(',')[1];
        // iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0...
        const imageBuffer = Buffer.from(base64Data, 'base64');
        // <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 14 00 00 00 14 08 06 00 00 00>


        // Convert image to JPEG format
        const processedImage = await sharp(imageBuffer)
        .jpeg()//Converts the image to JPEG format (regardless of the original format).
        // If the image is already a JPEG, it may still re-encode it with default quality settings.
        .toBuffer();

        const responses = await analyzeImage(processedImage, dict_of_vars);

        res.json({
            message: "Image processed",
            data: responses,
            status: "success"
        });

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({
          message: "Error processing image",
          error: error.message,
          status: "error"
        });
    }
})

export default router;