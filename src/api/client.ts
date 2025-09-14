// src/api/client.ts
import axios from 'axios';

// Backend sunucunun adresi.
// iOS simülatörü için localhost çalışır, ama Android emülatörü için
// bilgisayarınızın IP adresini kullanmanız gerekir.
// Şimdilik 'localhost' ile devam edelim.
// Android emülatöründe sorun yaşarsan burayı 'http://10.0.2.2:3000/api' olarak değiştirebilirsin.
const apiClient = axios.create({
  baseURL: 'http://192.168.1.79:3000/api', 
});

export default apiClient;