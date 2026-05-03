# Panduan Approval via Email (Microsoft Graph API & OAuth 2.0)

Dokumen ini menjelaskan cara kerja sistem approval otomatis menggunakan Microsoft Graph API dengan metode **Client Credentials Flow** (Client Secret).

## 1. Konsep Dasar
Karena Microsoft telah mematikan *Basic Authentication* (username & password biasa) untuk alasan keamanan, kita menggunakan **OAuth 2.0**. 

Metode **Client Credentials Flow** memungkinkan aplikasi kita (Laravel) mendapatkan akses ke kotak masuk email tanpa perlu interaksi user (login manual). Aplikasi akan login sebagai "Service Principal" menggunakan **Client Secret**.

## 2. Cara Kerja Sistem (Flow)

1.  **Request Token**: Aplikasi mengirimkan `Client ID` dan `Client Secret` ke server autentikasi Microsoft (`login.microsoftonline.com`).
2.  **Access Token**: Microsoft memberikan `access_token` yang berlaku selama 60 menit.
3.  **Fetch Emails**: Aplikasi menggunakan token tersebut untuk memanggil API Graph (`graph.microsoft.com`) guna menarik email yang belum dibaca (`isRead eq false`).
4.  **Parsing**: 
    *   Sistem mencari pola `[#ID]` pada subjek email.
    *   Sistem membaca karakter pertama dari isi email (`bodyPreview`).
5.  **Database Update**: Jika ditemukan huruf **Y**, status diubah menjadi **Approved**. Jika **N**, menjadi **Rejected**.
6.  **Mark as Read**: Email yang sudah diproses ditandai sebagai `Read` via API agar tidak diproses ulang pada jadwal berikutnya.

## 3. Langkah Konfigurasi Azure Portal

Agar sistem memiliki izin membaca email, ikuti langkah ini:

1.  **Register App**: Masuk ke [Azure App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) -> **New Registration**.
2.  **Client Secret**: Buka menu **Certificates & secrets** -> **New client secret**. Catat value-nya (ini adalah password aplikasi).
3.  **API Permissions**:
    *   Klik **Add a permission** -> **Microsoft Graph**.
    *   Pilih **Application permissions**.
    *   Cari dan tambahkan `Mail.ReadWrite`.
    *   **Penting:** Klik tombol **Grant admin consent** agar izin aktif secara global.

## 4. Konfigurasi `.env`

Tambahkan variabel berikut ke file `.env` di project Laravel kamu:

```env
# Identitas Aplikasi dari Azure
AZURE_TENANT_ID=xxxx-xxxx-xxxx-xxxx
AZURE_CLIENT_ID=xxxx-xxxx-xxxx-xxxx
AZURE_CLIENT_SECRET=xxxx-xxxx-xxxx-xxxx

# Akun email yang akan dipantau
IMAP_USERNAME=hse-approval@perusahaan.com
```

## 5. Menjalankan Sistem

Sistem ini berjalan secara otomatis setiap menit melalui Laravel Scheduler. Namun, Anda bisa menjalankannya secara manual untuk keperluan testing:

```bash
php artisan app:process-email-approvals
```

## 6. Keamanan
*   **MFA Bypass**: Karena menggunakan Client Secret, sistem ini tidak terpengaruh oleh kebijakan MFA (Multi-Factor Authentication) pada akun user.
*   **Audit Trail**: Setiap perubahan status di database akan mencatat `updated_by` dengan format `Auto-Email (email_approver@domain.com)`.
