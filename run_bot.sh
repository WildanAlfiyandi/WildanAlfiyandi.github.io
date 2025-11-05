#!/bin/bash
# Quick start script untuk menjalankan Telegram bot

echo "🚀 Quick Start - Telegram Bot"
echo "================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 tidak ditemukan. Silakan install Python3 terlebih dahulu."
    exit 1
fi

echo "✅ Python3 ditemukan: $(python3 --version)"
echo ""

# Check if dependencies are installed
if ! python3 -c "import telegram" 2>/dev/null; then
    echo "📦 Menginstall dependencies..."
    pip3 install -r requirements.txt
    echo ""
fi

echo "✅ Dependencies terinstal"
echo ""

# Check if token is set
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "⚠️  Environment variable TELEGRAM_BOT_TOKEN belum di-set"
    echo ""
    echo "Untuk menjalankan bot, Anda perlu token dari @BotFather:"
    echo ""
    echo "1. Buka Telegram dan cari @BotFather"
    echo "2. Ketik /newbot dan ikuti instruksinya"
    echo "3. Copy token yang diberikan"
    echo "4. Jalankan: export TELEGRAM_BOT_TOKEN='your_token_here'"
    echo "5. Jalankan script ini lagi: ./run_bot.sh"
    echo ""
    exit 1
fi

echo "✅ Token ditemukan"
echo ""
echo "🤖 Menjalankan bot..."
echo ""

# Run the bot
python3 telegram_bot.py
