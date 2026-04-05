import { Telegraf } from 'telegraf';
import { config } from '../config/env.js';
import { startHandler, photoHandler, stopHandler } from './handlers.js'; // 1. Importamos el stopHandler

export const setupBot = () => {
    const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    // Registrar comandos
    bot.start(startHandler);
    bot.command('stop', stopHandler); // 2. Registramos el comando /stop

    // Registrar eventos de mensajes
    // El bot solo llegará aquí si el mensaje no fue un comando (/start o /stop)
    bot.on('photo', photoHandler);

    // Manejo de errores global
    bot.catch((err, ctx) => {
        console.error(`Error de Telegraf para ${ctx.updateType}`, err);
    });

    return bot;
};