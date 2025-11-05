# WildanAlfiyandi.github.io

## 🤖 Telegram Bot

Bot Telegram sederhana yang dapat merespons perintah dan pesan dari pengguna. Bot ini dibuat dengan Python dan library python-telegram-bot.

### ✨ Fitur
- ✅ Merespons perintah `/start`, `/help`, `/info`, dan `/echo`
- ✅ Merespons pesan teks dari pengguna
- ✅ Logging untuk debugging
- ✅ Error handling yang baik
- ✅ Pesan dalam Bahasa Indonesia
- ✅ Mudah dikonfigurasi dan diperluas

### 🚀 Quick Start

**Metode 1: Menggunakan Script (Paling Mudah)**
```bash
# Install dependencies
pip3 install -r requirements.txt

# Set token (ganti dengan token Anda)
export TELEGRAM_BOT_TOKEN='your_token_here'

# Jalankan bot
./run_bot.sh
```

**Metode 2: Manual**
```bash
# Install dependencies
pip3 install -r requirements.txt

# Set token
export TELEGRAM_BOT_TOKEN='your_token_here'

# Jalankan bot
python3 telegram_bot.py
```

### 📋 Cara Setup Lengkap

#### 1. **Dapatkan Token Bot dari BotFather**
   - Buka Telegram dan cari `@BotFather`
   - Ketik `/newbot` dan ikuti instruksi
   - Pilih nama untuk bot Anda
   - Pilih username untuk bot (harus diakhiri dengan 'bot')
   - Copy token yang diberikan (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 2. **Clone Repository**
   ```bash
   git clone https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io.git
   cd WildanAlfiyandi.github.io
   ```

#### 3. **Install Dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

#### 4. **Set Environment Variable**
   
   Linux/Mac:
   ```bash
   export TELEGRAM_BOT_TOKEN='your_token_here'
   ```
   
   Windows (CMD):
   ```cmd
   set TELEGRAM_BOT_TOKEN=your_token_here
   ```
   
   Windows (PowerShell):
   ```powershell
   $env:TELEGRAM_BOT_TOKEN='your_token_here'
   ```

#### 5. **Jalankan Bot**
   ```bash
   python3 telegram_bot.py
   ```
   
   Atau menggunakan script:
   ```bash
   ./run_bot.sh
   ```

### 🎯 Perintah Bot

Setelah bot berjalan, buka Telegram dan cari username bot Anda, lalu coba perintah berikut:

- `/start` - Memulai bot dan menampilkan pesan sambutan
- `/help` - Menampilkan daftar perintah yang tersedia
- `/info` - Menampilkan informasi tentang bot
- `/echo <pesan>` - Bot akan mengulangi pesan yang Anda kirim

Anda juga bisa mengirim pesan teks biasa, dan bot akan merespons!

### 📁 Struktur File

```
.
├── telegram_bot.py     # File utama bot
├── requirements.txt    # Dependencies Python
├── run_bot.sh         # Script untuk menjalankan bot
├── test_bot.py        # Script untuk testing
├── .gitignore         # Git ignore file
└── README.md          # Dokumentasi ini
```

### 🛠️ Teknologi

- **Python 3.7+** - Bahasa pemrograman
- **python-telegram-bot 20.7** - Library untuk Telegram Bot API
- **httpx** - HTTP client untuk komunikasi dengan Telegram API

### 📝 Testing

Untuk menguji bahwa bot terinstall dengan benar:
```bash
python3 test_bot.py
```

### 🔧 Customisasi

Anda dapat menambahkan fitur baru dengan:

1. Menambahkan handler baru di `telegram_bot.py`
2. Mendefinisikan fungsi untuk menangani perintah baru
3. Mendaftarkan handler ke application

Contoh menambahkan perintah `/status`:
```python
async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Bot sedang berjalan dengan baik! ✅')

# Tambahkan di bagian handler
application.add_handler(CommandHandler("status", status_command))
```

### 🐛 Troubleshooting

**Bot tidak berjalan?**
- Pastikan token sudah di-set dengan benar
- Cek koneksi internet
- Pastikan dependencies terinstall

**Import error?**
```bash
pip3 install -r requirements.txt --upgrade
```

**Token tidak ditemukan?**
- Pastikan environment variable sudah di-set
- Coba restart terminal dan set ulang token

### 📄 License

Proyek ini bebas digunakan untuk belajar dan pengembangan.

### 👤 Author

WildanAlfiyandi

### 🤝 Kontribusi

Kontribusi, issues, dan feature requests sangat diterima!