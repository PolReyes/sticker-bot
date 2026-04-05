import dotenv from 'dotenv';

dotenv.config();

export const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY || ''
};

if (!config.TELEGRAM_BOT_TOKEN) {
    throw new Error('Falta TELEGRAM_BOT_TOKEN en el archivo .env');
}
if (!config.REMOVE_BG_API_KEY) {
    throw new Error('Falta REMOVE_BG_API_KEY en el archivo .env');
}