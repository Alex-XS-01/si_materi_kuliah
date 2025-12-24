# Setup Instructions - SI Materi Kuliah

## Overview
Sistem Informasi Materi Kuliah adalah platform modern untuk manajemen materi akademik dengan fitur keamanan tingkat tinggi menggunakan Supabase.

## Prerequisites
- Node.js (v16 atau lebih baru)
- Akun Supabase

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Database sudah dikonfigurasi dengan migration di `supabase/migrations/`.
Semua table dan RLS policies sudah di-apply otomatis.

### 3. Storage Bucket Setup
Anda perlu membuat storage bucket untuk menyimpan file materi:

1. Buka Supabase Dashboard
2. Navigasi ke Storage
3. Klik "New bucket"
4. Nama bucket: `materials`
5. **PENTING**: Set bucket sebagai **Private** (tidak public)
6. Klik "Create bucket"

#### Setup Storage Policies (RLS)
Setelah bucket dibuat, setup policies berikut:

**Policy 1: Dosen dapat upload**
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

**Policy 2: Authenticated users dapat download**
```sql
CREATE POLICY "Authenticated users can download materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'materials');
```

**Policy 3: Dosen dapat delete own files**
```sql
CREATE POLICY "Dosen can delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' AND
  owner = auth.uid()
);
```

### 4. Environment Variables
File `.env` sudah dikonfigurasi dengan:
- `VITE_SUPABASE_URL`: URL Supabase project
- `VITE_SUPABASE_ANON_KEY`: Anon key untuk client-side

### 5. Run Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```

## Security Features

### Authentication
- Email/Password authentication menggunakan Supabase Auth
- Password hashing otomatis dengan bcrypt
- Session management dengan JWT
- Secure token refresh

### Row Level Security (RLS)
Semua table dilindungi dengan RLS policies:
- **profiles**: User hanya bisa akses data sendiri
- **mahasiswa**: Student hanya bisa akses data sendiri
- **dosen**: Lecturer hanya bisa akses data sendiri
- **materi**: Semua authenticated user bisa view, hanya dosen yang bisa insert/update/delete

### File Storage Security
- Private storage bucket - tidak bisa diakses tanpa authentication
- File upload restricted ke dosen only
- Download hanya untuk authenticated users
- Automatic file permission checks via RLS

### Input Validation
- Form validation di client-side
- Supabase automatic SQL injection prevention
- XSS protection via proper escaping
- CSRF protection via Supabase session

### Additional Security
- Secure password requirements (minimum 8 characters)
- No sensitive data exposure in client
- Proper error handling without leaking info
- HTTPS only in production

## User Roles

### Mahasiswa (Student)
- View dan download materi
- Search materi by program studi, semester, bab
- View profile information

### Dosen (Lecturer)
- Semua fitur mahasiswa
- Upload materi baru
- Edit/delete materi sendiri
- Manage materials dengan file upload

## Features

### Modern UI/UX
- Responsive design untuk mobile dan desktop
- Gradient backgrounds dengan smooth animations
- Card-based layout dengan hover effects
- Loading states dan error handling
- Empty states untuk better UX

### Material Management
- Upload files (PDF, DOC, DOCX, PPT, PPTX)
- Categorize by program studi dan semester
- Organize by bab dan sub-bab
- Download materials dengan secure links
- Search dan filter functionality

### Profile Management
- Role-based access (Mahasiswa/Dosen)
- Student-specific fields (NPM, Program Studi, Semester)
- Lecturer-specific fields (NIDN, Department)
- Institution information

## Database Schema

### Tables
- `profiles`: Base user profiles
- `mahasiswa`: Student-specific data
- `dosen`: Lecturer-specific data
- `materi`: Academic materials metadata
- `password_reset_codes`: Password reset functionality

### Relationships
- profiles.id → auth.users.id (one-to-one)
- mahasiswa.profile_id → profiles.id (one-to-one)
- dosen.profile_id → profiles.id (one-to-one)
- materi.uploaded_by → profiles.id (many-to-one)

## Troubleshooting

### "Missing Supabase environment variables"
- Pastikan file `.env` ada di root project
- Verify environment variables dimulai dengan `VITE_`

### "Storage bucket not found"
- Create `materials` bucket di Supabase Dashboard
- Setup storage policies seperti di atas

### "Permission denied"
- Check RLS policies sudah di-apply
- Verify user sudah login
- Check user role (mahasiswa/dosen) sesuai dengan permission

### Build errors
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support
Untuk pertanyaan atau issues, silakan hubungi administrator sistem.
