# 🔥 CraftRise Ban Checker - Web Version

Craftrise uygulamasının modern web versiyonu.

## 📋 Özellikler

- ✅ Kullanıcı adlarının ban durumunu kontrol etme
- 🚫 Banlı/Temiz/Bakım kategorileri
- 📊 Gerçek zamanlı ilerleme göstergesi
- 💾 Sonuçları TXT olarak indirme
- 📋 Konsol log çıktısı
- 🎨 Modern ve şık arayüz

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Sunucuyu başlatın:**
   ```bash
   npm start
   ```

3. **Tarayıcıda açın:**
   ```
   http://localhost:3000
   ```

## 📁 Dosya Yapısı

```
craftrise-ban-checker/
├── index.html      # Ana web sayfası
├── server.js       # Proxy sunucusu
├── package.json    # Node.js bağımlılıkları
└── README.md       # Bu dosya
```

## ⚠️ CORS Notu

Tarayıcılar güvenlik nedeniyle farklı domainlere doğrudan istek göndermeyi engeller (CORS).
Bu nedenle, CraftRise sunucularına istek göndermek için bir proxy sunucusu kullanılmalıdır.

`server.js` bu proxy işlevini görür ve tarayıcıdan gelen istekleri CraftRise'a yönlendirir.

## 💡 Kullanım

1. Metin kutusuna kontrol edilecek hesapları girin (her satıra bir hesap)
2. Format: `kullaniciadi` veya `kullaniciadi:sifre`
3. "Kontrol Et" butonuna tıklayın
4. Sonuçlar otomatik olarak kategorilere ayrılacaktır

## 📥 Sonuçları İndirme

Her kategorinin başlığındaki "İndir" butonuna tıklayarak sonuçları TXT dosyası olarak indirebilirsiniz:
- `banli_hesaplar.txt` - Banlı hesaplar
- `temiz_hesaplar.txt` - Temiz hesaplar
- `maintenance_hesaplar.txt` - Bakım modundaki kontroller
