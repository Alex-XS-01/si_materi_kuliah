# Quick Start Guide - SI Materi Kuliah

## Langkah Cepat untuk Mulai

### 1. Setup Storage Bucket (PENTING!)
Sebelum aplikasi bisa digunakan, Anda HARUS create storage bucket di Supabase:

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik **Storage** di sidebar kiri
4. Klik tombol **"New bucket"**
5. Masukkan nama: `materials`
6. **PENTING**: Pilih **Private** (jangan Public!)
7. Klik **"Create bucket"**

### 2. Setup Storage Policies
Setelah bucket dibuat, add RLS policies:

1. Klik bucket `materials` yang baru dibuat
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Add 3 policies berikut:

**Policy A: Dosen Upload**
```sql
CREATE POLICY "Dosen can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'dosen'
  )
);
```

**Policy B: Download**
```sql
CREATE POLICY "Authenticated users can download"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'materials');
```

**Policy C: Dosen Delete**
```sql
CREATE POLICY "Dosen can delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' AND
  owner = auth.uid()
);
```

### 3. Run Application
```bash
npm install
npm run dev
```

### 4. Buat Akun
1. Buka browser ke `http://localhost:5173`
2. Klik "Daftar"
3. Pilih role (Mahasiswa atau Dosen)
4. Isi form registrasi
5. Login dengan email dan password

### 5. Test Fitur

#### Jika Dosen:
1. Login sebagai dosen
2. Lihat form "Tambah Materi Baru" di dashboard
3. Isi form dan upload file PDF/DOC
4. Klik "Tambah Materi"
5. Materi akan muncul di list

#### Jika Mahasiswa:
1. Login sebagai mahasiswa
2. Gunakan search filter untuk cari materi
3. Klik icon download untuk unduh materi
4. Lihat profile info di header

## Troubleshooting Cepat

### Error: "Storage bucket not found"
- Pastikan bucket `materials` sudah dibuat
- Check nama bucket (harus persis `materials`)

### Error: "Permission denied"
- Pastikan RLS policies sudah di-apply
- Verify user sudah login
- Check user role (mahasiswa/dosen)

### Error: "Cannot upload file"
- Pastikan login sebagai dosen
- Check file size (max biasanya 50MB)
- Verify file type (PDF, DOC, DOCX, PPT, PPTX)

### Aplikasi blank/kosong
- Check browser console untuk errors
- Verify `.env` file ada dan valid
- Clear browser cache dan reload

### Cannot register
- Check email format valid
- Password minimum 8 karakter
- Semua required fields harus diisi

## Default Users (Untuk Testing)
Anda perlu create users sendiri via registrasi form.

## Fitur Keamanan Aktif

### Yang TIDAK BISA dilakukan:
- Mahasiswa tidak bisa upload/delete materi
- User tidak bisa akses data user lain
- File tidak bisa diakses tanpa login
- Dosen tidak bisa delete materi dosen lain
- SQL injection otomatis di-block
- XSS attacks otomatis di-sanitize

### Yang OTOMATIS:
- Password di-hash dengan bcrypt
- Session token refresh otomatis
- Input validation
- Error handling yang aman
- Database-level security

## Tips Penggunaan

### Untuk Mahasiswa:
- Gunakan filter semester untuk cari materi semester Anda
- Gunakan filter program studi untuk materi prodi Anda
- Ketik keyword di "Cari Bab" untuk search cepat
- Semua materi bisa di-download langsung

### Untuk Dosen:
- Upload file dengan nama yang descriptive
- Isi bab dan sub-bab dengan jelas
- Hanya Anda yang bisa edit/delete materi Anda
- File akan disimpan dengan nama random untuk keamanan

## Next Steps
- Baca `README.md` untuk dokumentasi lengkap
- Baca `SETUP.md` untuk setup detail
- Test semua fitur dengan role berbeda
- Report bugs atau issues ke admin

## Support
Jika ada masalah, hubungi administrator sistem.
