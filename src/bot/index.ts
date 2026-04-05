import { Telegraf } from 'telegraf';
import { config } from '../config/env';
import { startHandler, photoHandler } from './handlers.js';

export const setupBot = () => {
    const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    // Registrar comandos y eventos
    bot.start(startHandler);
    bot.on('photo', photoHandler);

    // Manejo de errores global
    bot.catch((err, ctx) => {
        console.error(`Error de Telegraf para ${ctx.updateType}`, err);
    });

    return bot;
};