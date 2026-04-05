import { setupBot } from './bot/index.js';

const start = () => {
    try {
        const bot = setupBot();

        bot.launch();
        console.log('🤖 Bot de Stickers iniciado correctamente.');

        // Permitir detener el bot gracefully (Ctrl+C)
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    } catch (error) {
        console.error('Error al iniciar el bot:', error);
    }
};

start();