import axios from 'axios';
import sharp from 'sharp';
import FormData from 'form-data';
import { config } from '../config/env.js';

export class ImageService {
    /**
     * Elimina el fondo de una imagen usando Remove.bg y la devuelve en formato WebP
     */
    static async processImageToSticker(imageUrl: string): Promise<Buffer> {
        try {
            // 1. Descargar la imagen de Telegram
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');

            // 2. Enviar a Remove.bg
            const formData = new FormData();
            formData.append('size', 'auto');
            formData.append('image_file', imageBuffer, { filename: 'image.jpg' });

            const removeBgResponse = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'X-Api-Key': config.REMOVE_BG_API_KEY,
                },
                responseType: 'arraybuffer',
            });

            const noBgBuffer = Buffer.from(removeBgResponse.data, 'binary');

            // 3. Convertir a formato WebP (requerido por Telegram para stickers) y redimensionar
            const stickerBuffer = await sharp(noBgBuffer)
                .resize({ width: 512, height: 512, fit: 'inside' }) // Telegram prefiere un lado de 512px
                .webp({ quality: 80 })
                .toBuffer();

            return stickerBuffer;
        } catch (error) {
            console.error('Error procesando la imagen:', error);
            throw new Error('No se pudo procesar la imagen.');
        }
    }
}