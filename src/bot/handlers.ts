import { Context } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import { ImageService } from '../services/imageService.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;

// 1. Creamos el pool de conexión usando la variable de entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// 2. Creamos el adaptador para PostgreSQL
const adapter = new PrismaPg(pool);

// 3. Pasamos el adaptador al constructor (Esto es lo que falta)
export const prisma = new PrismaClient({ adapter });

export const startHandler = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Activamos al usuario en la DB
    await prisma.user.upsert({
        where: { id: userId },
        update: { isActive: true },
        create: { id: userId, isActive: true },
    });

    await ctx.reply('✅ Bot activado. Ahora puedes enviarme una imagen para quitarle el fondo.');
};

export const photoHandler = async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    // BUSCAMOS AL USUARIO: Si no existe o isActive es false, bloqueamos
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
        return ctx.reply('⚠️ El bot está inactivo. Usa /start para activarlo antes de enviar fotos.');
    }

    // Si pasó el filtro, procesamos la imagen
    try {
        if (!ctx.message || !('photo' in ctx.message)) return;

        const waitMsg = await ctx.reply('⏳ Procesando tu sticker...');
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileUrl = await ctx.telegram.getFileLink(photo.file_id);

        const sticker = await ImageService.processImageToSticker(fileUrl.href);
        await ctx.replyWithSticker({ source: sticker });

        await ctx.telegram.deleteMessage(ctx.chat!.id, waitMsg.message_id);
    } catch (e) {
        ctx.reply('❌ Error al procesar.');
    }
};