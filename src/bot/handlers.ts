import { Context } from 'telegraf';
import { ImageService } from '../services/imageService';

export const startHandler = (ctx: Context) => {
    ctx.reply('¡Hola! Envíame cualquier foto y le quitaré el fondo para convertirla en un sticker.');
};

export const photoHandler = async (ctx: Context) => {
    try {
        // Asegurarnos de que hay una foto
        if (!ctx.message || !('photo' in ctx.message)) return;

        // Avisar al usuario que estamos trabajando en ello
        const waitMessage = await ctx.reply('⏳ Procesando imagen... esto puede tardar unos segundos.');

        // Obtener la foto de mayor resolución (es el último elemento del array)
        const photo = ctx.message.photo[ctx.message.photo.length - 1];

        // Obtener la URL de la foto en los servidores de Telegram
        const fileUrl = await ctx.telegram.getFileLink(photo.file_id);

        // Procesar la imagen
        const stickerBuffer = await ImageService.processImageToSticker(fileUrl.href);

        // Enviar el sticker generado
        await ctx.replyWithSticker({ source: stickerBuffer });

        // Borrar el mensaje de "Procesando"
        await ctx.telegram.deleteMessage(ctx.chat!.id, waitMessage.message_id);

    } catch (error) {
        ctx.reply('❌ Hubo un error al procesar tu imagen. Inténtalo con otra diferente.');
    }
};