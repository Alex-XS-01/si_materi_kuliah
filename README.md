# SI Materi Kuliah - Sistem Informasi Materi Akademik

Platform modern untuk manajemen materi kuliah dengan keamanan tingkat enterprise dan desain yang memukau.

## Fitur Utama

### Keamanan Maksimal
- **Supabase Authentication**: Sistem autentikasi berbasis JWT dengan enkripsi tingkat enterprise
- **Row Level Security (RLS)**: Setiap data dilindungi dengan policy keamanan tingkat database
- **Password Hashing**: Password di-hash dengan bcrypt otomatis
- **Private Storage**: File disimpan di private bucket dengan access control ketat
- **SQL Injection Prevention**: Otomatis dengan parameterized queries
- **XSS Protection**: Input sanitization dan output escaping
- **Session Management**: Token refresh otomatis dan secure session handling

### Desain Modern & Memukau
- **Gradient Backgrounds**: Latar belakang gradient yang smooth dan profesional
- **Glass Morphism**: Card dengan backdrop blur untuk efek modern
- **Smooth Animations**: Transisi dan hover effects yang halus
- **Responsive Design**: Tampilan optimal di semua ukuran layar
- **Loading States**: Feedback visual untuk setiap aksi
- **Empty States**: Pesan yang friendly saat tidak ada data
- **Custom Colors**: Palet warna biru dan hijau yang elegan (NO PURPLE!)

### Manajemen Materi
- **Upload Files**: Support PDF, DOC, DOCX, PPT, PPTX
- **Kategorisasi**: Program studi, semester, bab, sub-bab
- **Search & Filter**: Pencarian cepat dengan multiple filters
- **Download Secure**: Link download dengan authentication
- **Edit & Delete**: Dosen bisa manage materi sendiri
- **File Metadata**: Nama file original, uploader info, timestamps

### Role-Based Access Control

#### Mahasiswa
- Lihat dan download materi
- Search materi berdasarkan filter
- View profile dan info program studi
- Access ke semua materi yang relevan

#### Dosen
- Semua fitur mahasiswa
- Upload materi baru dengan file
- Edit materi yang di-upload sendiri
- Delete materi sendiri
- Manage materials dengan UI yang mudah

## Teknologi Stack

### Frontend
- **Vite**: Build tool super cepat
- **Vanilla JavaScript**: Lightweight, no framework bloat
- **Modern CSS**: CSS Variables, Grid, Flexbox
- **Google Fonts**: Inter font untuk typography premium

### Backend & Database
- **Supabase**: Backend-as-a-Service dengan PostgreSQL
- **PostgreSQL**: Database relational dengan JSON support
- **Row Level Security**: Database-level security policies
- **Supabase Storage**: Secure file storage dengan RLS
- **Supabase Auth**: JWT-based authentication

## Struktur Database

### Tables
1. **profiles**: Profile dasar user (nama, institusi, user_type)
2. **mahasiswa**: Data spesifik mahasiswa (NPM, program studi, semester)
3. **dosen**: Data spesifik dosen (NIDN, department)
4. **materi**: Metadata materi kuliah (file_path, bab, sub_bab, dll)
5. **password_reset_codes**: Kode verifikasi reset password

### Security Policies
Setiap table memiliki RLS policies yang ketat:
- Users hanya bisa akses data sendiri
- Dosen bisa CRUD materi sendiri
- Semua authenticated users bisa read materi
- Storage files hanya accessible dengan authentication

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
File `.env` sudah dikonfigurasi dengan Supabase credentials.

### 3. Setup Storage Bucket
Baca instruksi lengkap di `SETUP.md` untuk create storage bucket dan policies.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## File Structure

```
project/
├── src/
│   ├── main.js           # Main application logic & routing
│   ├── auth.js           # Authentication & data access functions
│   ├── supabase.js       # Supabase client configuration
│   └── style.css         # Modern styling dengan animations
├── supabase/
│   └── migrations/       # Database migrations
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── .env                  # Environment variables
├── SETUP.md              # Setup instructions
└── README.md             # This file
```

## Security Highlights

### 1. Authentication Security
- Minimum 8 character passwords
- Secure session tokens (JWT)
- Automatic token refresh
- Proper logout clearing

### 2. Database Security
- All tables have RLS enabled
- Restrictive policies (deny by default)
- Foreign key constraints
- Proper indexing for performance

### 3. Storage Security
- Private bucket (not public)
- File upload restricted to dosen
- Download requires authentication
- Automatic permission checks

### 4. Input Validation
- Client-side form validation
- Server-side validation via Supabase
- Type checking on database level
- SQL injection prevention

### 5. Error Handling
- No sensitive info in error messages
- User-friendly error display
- Proper logging (no password leaks)
- Graceful degradation

## Design Principles

### Color Palette
- Primary: Blue (#2563eb) - Trust, professionalism
- Secondary: Green (#10b981) - Growth, success
- Accent: Amber (#f59e0b) - Attention, warnings
- Error: Red (#ef4444) - Errors, danger
- Neutrals: Gray scale untuk text dan backgrounds

### Typography
- Font: Inter (sans-serif)
- Headings: 600-700 weight
- Body: 400 weight
- Line height: 1.6 untuk readability

### Spacing
- 8px base unit
- Consistent padding/margins
- Proper white space
- Clear visual hierarchy

### Shadows & Effects
- Multiple shadow levels (sm, md, lg, xl)
- Smooth transitions (0.3s ease)
- Hover effects untuk interactivity
- Loading states dengan spinners

## Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Fast initial load dengan Vite
- Code splitting untuk optimal bundles
- Lazy loading where appropriate
- Optimized assets
- Efficient database queries dengan indexes

## Accessibility
- Semantic HTML
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader friendly

## Support & Contact
Untuk bantuan teknis atau pertanyaan, hubungi administrator sistem.

## License
Internal use only - Academic institution proprietary system.
