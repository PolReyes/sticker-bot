import { Telegraf } from 'telegraf';
import { setupBot } from '../src/bot'; // Importas tu lógica
import { VercelRequest, VercelResponse } from '@vercel/node';

const bot = setupBot();

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        // Procesar la actualización que envía Telegram
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (err) {
        console.error('Error en el webhook:', err);
        res.status(500).send('Error');
    }
};