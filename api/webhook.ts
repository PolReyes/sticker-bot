import { VercelRequest, VercelResponse } from '@vercel/node';
import { setupBot } from '../src/bot'; // Importamos la configuración del bot
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client/index';

// Configuración del Cliente de Prisma (Adaptado a Prisma 7)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Inicializamos el bot
const bot = setupBot();

export default async (req: VercelRequest, res: VercelResponse) => {
    // Solo aceptamos peticiones POST (que es lo que envía Telegram)
    if (req.method === 'POST') {
        try {
            // Le pasamos el cuerpo del mensaje (body) a Telegraf para que lo procese
            await bot.handleUpdate(req.body);

            // Respondemos 200 OK para que Telegram sepa que recibimos el mensaje
            return res.status(200).send('OK');
        } catch (err) {
            console.error('Error procesando update:', err);
            return res.status(500).send('Error interno');
        }
    } else {
        // Si alguien entra desde el navegador, verá esto
        return res.status(200).send('El bot está vivo y esperando mensajes de Telegram.');
    }
};