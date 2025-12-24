import './style.css';
import { auth, profiles, materials } from './auth.js';
import { supabase } from './supabase.js';

let currentUser = null;
let currentProfile = null;

const app = document.querySelector('#app');

function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  const container = document.querySelector('.container') || app;
  container.insertBefore(alert, container.firstChild);

  setTimeout(() => alert.remove(), 5000);
}

function showLoading() {
  app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

async function initApp() {
  showLoading();

  const session = await auth.getSession();
  if (session) {
    currentUser = session.user;
    currentProfile = await profiles.getProfile(currentUser.id);
    showDashboard();
  } else {
    showLogin();
  }

  auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      currentUser = session.user;
      currentProfile = await profiles.getProfile(currentUser.id);
      showDashboard();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      showLogin();
    }
  });
}

function showLogin() {
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">SI Materi Kuliah</h1>
        <p class="auth-subtitle">Silakan login untuk melanjutkan</p>

        <div class="role-selector">
          <button class="role-btn active" data-role="mahasiswa">Mahasiswa</button>
          <button class="role-btn" data-role="dosen">Dosen</button>
        </div>

        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" name="email" placeholder="email@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" name="password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
        </form>

        <div class="form-footer">
          Belum punya akun? <a href="#" class="form-link" id="showRegister">Daftar</a>
        </div>
      </div>
    </div>
  `;

  const roleButtons = app.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    showLoading();
    await auth.signIn(email, password);
  } catch (error) {
    showLogin();
    showAlert(error.message, 'error');
  }
}

function showRegister() {
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Daftar Akun</h1>
        <p class="auth-subtitle">Buat akun baru untuk mengakses sistem</p>

        <div class="role-selector">
          <button class="role-btn active" data-role="mahasiswa">Mahasiswa</button>
          <button class="role-btn" data-role="dosen">Dosen</button>
        </div>

        <form id="registerForm">
          <input type="hidden" name="role" value="mahasiswa">

          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <input type="text" class="form-input" name="nama" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" name="email" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" name="password" required minlength="8">
          </div>

          <div id="mahasiswaFields">
            <div class="form-group">
              <label class="form-label">NPM</label>
              <input type="text" class="form-input" name="npm" required>
            </div>

            <div class="form-group">
              <label class="form-label">Program Studi</label>
              <select class="form-select" name="program_studi" required>
                <option value="">Pilih Program Studi</option>
                <option value="Informatika">Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Bisnis Digital">Bisnis Digital</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Semester</label>
              <select class="form-select" name="semester" required>
                <option value="">Pilih Semester</option>
                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Sesi Belajar</label>
              <select class="form-select" name="sesi_belajar" required>
                <option value="Pagi">Pagi</option>
                <option value="Sore">Sore</option>
                <option value="Malam">Malam</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Pembimbing Akademik</label>
              <input type="text" class="form-input" name="pembimbing_akademik" required>
            </div>
          </div>

          <div id="dosenFields" class="hidden">
            <div class="form-group">
              <label class="form-label">NIDN</label>
              <input type="text" class="form-input" name="nidn">
            </div>

            <div class="form-group">
              <label class="form-label">Department</label>
              <input type="text" class="form-input" name="department">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Institusi</label>
            <input type="text" class="form-input" name="institusi" value="Universitas" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Daftar</button>
        </form>

        <div class="form-footer">
          Sudah punya akun? <a href="#" class="form-link" id="showLogin">Login</a>
        </div>
      </div>
    </div>
  `;

  const roleButtons = app.querySelectorAll('.role-btn');
  const roleInput = document.querySelector('input[name="role"]');
  const mahasiswaFields = document.getElementById('mahasiswaFields');
  const dosenFields = document.getElementById('dosenFields');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      roleInput.value = role;

      if (role === 'mahasiswa') {
        mahasiswaFields.classList.remove('hidden');
        dosenFields.classList.add('hidden');
        mahasiswaFields.querySelectorAll('input, select').forEach(el => el.required = true);
        dosenFields.querySelectorAll('input').forEach(el => el.required = false);
      } else {
        mahasiswaFields.classList.add('hidden');
        dosenFields.classList.remove('hidden');
        mahasiswaFields.querySelectorAll('input, select').forEach(el => el.required = false);
        dosenFields.querySelectorAll('input').forEach(el => el.required = true);
      }
    });
  });

  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

async function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    showLoading();

    const { user } = await auth.signUp(data.email, data.password, {
      nama: data.nama,
      user_type: data.role,
      institusi: data.institusi
    });

    await profiles.createProfile(user.id, {
      user_type: data.role,
      nama: data.nama,
      institusi: data.institusi
    });

    if (data.role === 'mahasiswa') {
      await profiles.createMahasiswaDetails(user.id, {
        npm: data.npm,
        program_studi: data.program_studi,
        semester: parseInt(data.semester),
        sesi_belajar: data.sesi_belajar,
        pembimbing_akademik: data.pembimbing_akademik
      });
    } else {
      await profiles.createDosenDetails(user.id, {
        nidn: data.nidn,
        department: data.department
      });
    }

    showAlert('Registrasi berhasil! Silakan login.', 'success');
    showLogin();
  } catch (error) {
    showRegister();
    showAlert(error.message, 'error');
  }
}

function showDashboard() {
  const isDosen = currentProfile?.user_type === 'dosen';

  app.innerHTML = `
    <div class="header">
      <div class="header-content">
        <div class="logo">SI Materi Kuliah</div>
        <div class="profile-section">
          <div class="profile-info">
            <div class="profile-name">${currentProfile?.nama || 'User'}</div>
            <div class="profile-meta">${currentProfile?.institusi || ''}</div>
            ${currentProfile?.mahasiswa ? `<div class="profile-meta">${currentProfile.mahasiswa[0]?.program_studi || ''} - Semester ${currentProfile.mahasiswa[0]?.semester || ''}</div>` : ''}
          </div>
          <div class="nav-links">
            <button class="btn btn-danger" id="logoutBtn">Logout</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      ${isDosen ? `
        <div class="card search-section">
          <h2 class="card-title">Tambah Materi Baru</h2>
          <form id="addMaterialForm">
            <div class="search-grid">
              <div class="form-group">
                <label class="form-label">Program Studi</label>
                <select class="form-select" name="program_studi" required>
                  <option value="">Pilih Program Studi</option>
                  <option value="Informatika">Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Bisnis Digital">Bisnis Digital</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Semester</label>
                <select class="form-select" name="semester" required>
                  <option value="">Pilih Semester</option>
                  ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Bab</label>
                <input type="text" class="form-input" name="bab" required>
              </div>

              <div class="form-group">
                <label class="form-label">Sub-bab</label>
                <input type="text" class="form-input" name="sub_bab" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">File Materi</label>
              <input type="file" class="form-input" name="file" required accept=".pdf,.doc,.docx,.ppt,.pptx">
            </div>

            <button type="submit" class="btn btn-primary">Tambah Materi</button>
          </form>
        </div>
      ` : ''}

      <div class="card search-section">
        <h2 class="card-title">Cari Materi</h2>
        <form id="searchForm">
          <div class="search-grid">
            <div class="form-group">
              <select class="form-select" name="program_studi">
                <option value="">Semua Program Studi</option>
                <option value="Informatika">Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Bisnis Digital">Bisnis Digital</option>
              </select>
            </div>

            <div class="form-group">
              <select class="form-select" name="semester">
                <option value="">Semua Semester</option>
                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <input type="text" class="form-input" name="bab" placeholder="Cari Bab...">
            </div>

            <div class="form-group">
              <input type="text" class="form-input" name="sub_bab" placeholder="Cari Sub-bab...">
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Cari</button>
        </form>
      </div>

      <div id="materialsContainer">
        <div class="loading"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('searchForm').addEventListener('submit', handleSearch);

  if (isDosen) {
    document.getElementById('addMaterialForm').addEventListener('submit', handleAddMaterial);
  }

  loadMaterials();
}

async function handleLogout() {
  try {
    await auth.signOut();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const filters = {};

  if (formData.get('program_studi')) filters.program_studi = formData.get('program_studi');
  if (formData.get('semester')) filters.semester = parseInt(formData.get('semester'));
  if (formData.get('bab')) filters.bab = formData.get('bab');
  if (formData.get('sub_bab')) filters.sub_bab = formData.get('sub_bab');

  await loadMaterials(filters);
}

async function handleAddMaterial(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const file = formData.get('file');

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `materials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    await materials.createMaterial({
      program_studi: formData.get('program_studi'),
      semester: parseInt(formData.get('semester')),
      bab: formData.get('bab'),
      sub_bab: formData.get('sub_bab'),
      file_path: filePath,
      file_name: file.name,
      uploaded_by: currentUser.id
    });

    showAlert('Materi berhasil ditambahkan!', 'success');
    e.target.reset();
    await loadMaterials();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function loadMaterials(filters = {}) {
  const container = document.getElementById('materialsContainer');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const materialsData = await materials.searchMaterials(filters);

    if (materialsData.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <div class="empty-state-text">Tidak ada materi ditemukan</div>
          <p>Coba ubah filter pencarian Anda</p>
        </div>
      `;
      return;
    }

    const isDosen = currentProfile?.user_type === 'dosen';

    container.innerHTML = `
      <div class="materials-grid">
        ${materialsData.map(material => `
          <div class="material-item">
            <div class="material-info">
              <h3>${material.bab} - ${material.sub_bab}</h3>
              <div class="material-meta">
                <span class="material-badge">${material.program_studi}</span>
                <span class="material-badge">Semester ${material.semester}</span>
                <span>📤 ${material.profiles?.nama || 'Unknown'}</span>
              </div>
            </div>
            <div class="material-actions">
              <button class="icon-btn" onclick="downloadMaterial('${material.file_path}', '${material.file_name}')" title="Download">
                📥
              </button>
              ${isDosen && material.uploaded_by === currentUser.id ? `
                <button class="icon-btn danger" onclick="deleteMaterial('${material.id}')" title="Hapus">
                  🗑️
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">
        Error loading materials: ${error.message}
      </div>
    `;
  }
}

window.downloadMaterial = async (filePath, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('materials')
      .download(filePath);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    showAlert('Gagal mengunduh file: ' + error.message, 'error');
  }
};

window.deleteMaterial = async (id) => {
  if (!confirm('Yakin ingin menghapus materi ini?')) return;

  try {
    await materials.deleteMaterial(id);
    showAlert('Materi berhasil dihapus', 'success');
    await loadMaterials();
  } catch (error) {
    showAlert('Gagal menghapus materi: ' + error.message, 'error');
  }
};

initApp();
