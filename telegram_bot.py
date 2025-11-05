#!/usr/bin/env python3
"""
Simple Telegram Bot
This bot responds to basic commands and messages.
"""

import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    await update.message.reply_text(
        f'Halo {user.first_name}! 👋\n\n'
        'Selamat datang di bot saya!\n'
        'Gunakan /help untuk melihat perintah yang tersedia.'
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    help_text = (
        "🤖 *Perintah Bot:*\n\n"
        "/start - Memulai bot\n"
        "/help - Menampilkan bantuan\n"
        "/info - Informasi tentang bot\n"
        "/echo <pesan> - Bot akan mengulangi pesan Anda\n\n"
        "Kirim pesan apa saja dan bot akan merespons!"
    )
    await update.message.reply_text(help_text, parse_mode='Markdown')


async def info_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send information about the bot."""
    info_text = (
        "ℹ️ *Informasi Bot:*\n\n"
        "Ini adalah bot Telegram sederhana yang dibuat dengan Python.\n"
        "Bot ini dapat merespons perintah dan pesan dari pengguna.\n\n"
        "Versi: 1.0\n"
        "Dibuat dengan: python-telegram-bot"
    )
    await update.message.reply_text(info_text, parse_mode='Markdown')


async def echo_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Echo the user's message."""
    if context.args:
        message = ' '.join(context.args)
        await update.message.reply_text(f'🔊 Echo: {message}')
    else:
        await update.message.reply_text('Gunakan: /echo <pesan yang ingin diulangi>')


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle normal messages."""
    user_message = update.message.text
    response = f'Anda mengirim: "{user_message}"\n\nGunakan /help untuk melihat perintah yang tersedia.'
    await update.message.reply_text(response)


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log errors caused by updates."""
    logger.error(f'Update {update} caused error {context.error}')


def main() -> None:
    """Start the bot."""
    # Get the bot token from environment variable
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    
    if not token:
        print("❌ Error: TELEGRAM_BOT_TOKEN tidak ditemukan!")
        print("Silakan set environment variable TELEGRAM_BOT_TOKEN dengan token bot Anda.")
        print("\nCara mendapatkan token:")
        print("1. Buka Telegram dan cari @BotFather")
        print("2. Ketik /newbot dan ikuti instruksinya")
        print("3. Copy token yang diberikan")
        print("4. Set environment variable: export TELEGRAM_BOT_TOKEN='your_token_here'")
        return
    
    print("🚀 Memulai bot...")
    print(f"Token ditemukan: {token[:8]}...")
    
    # Create the Application
    application = Application.builder().token(token).build()
    
    # Register handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("info", info_command))
    application.add_handler(CommandHandler("echo", echo_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Register error handler
    application.add_error_handler(error_handler)
    
    # Start the bot
    print("✅ Bot berhasil dijalankan!")
    print("Tekan Ctrl+C untuk menghentikan bot\n")
    
    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
