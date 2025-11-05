# WildanAlfiyandi.github.io

## Telegram Bot

Bot Telegram sederhana yang dapat merespons perintah dan pesan dari pengguna.

### Fitur
- ✅ Merespons perintah `/start`, `/help`, `/info`, dan `/echo`
- ✅ Merespons pesan teks dari pengguna
- ✅ Logging untuk debugging
- ✅ Error handling

### Cara Setup

1. **Dapatkan Token Bot dari BotFather**
   - Buka Telegram dan cari `@BotFather`
   - Ketik `/newbot` dan ikuti instruksi
   - Copy token yang diberikan

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variable**
   ```bash
   export TELEGRAM_BOT_TOKEN='your_token_here'
   ```
   
   Atau di Windows:
   ```cmd
   set TELEGRAM_BOT_TOKEN=your_token_here
   ```

4. **Jalankan Bot**
   ```bash
   python telegram_bot.py
   ```

### Perintah Bot

- `/start` - Memulai bot
- `/help` - Menampilkan bantuan
- `/info` - Informasi tentang bot
- `/echo <pesan>` - Bot akan mengulangi pesan Anda

### Teknologi

- Python 3.7+
- python-telegram-bot 20.7