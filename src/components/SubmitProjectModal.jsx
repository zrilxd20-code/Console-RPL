import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  DownloadIcon, 
  UploadIcon, 
  CheckIcon, 
  TrashIcon,
  ShieldIcon,
  LockIcon
} from './Icons';
import { 
  sanitizeUrl, 
  sanitizeImageUrl,
  sanitizeText, 
  compressImage,
  compressImageToBlob,
  validateAndSanitizeProject 
} from '../utils/security';
import { 
  uploadThumbnailToSupabase, 
  isSupabaseConfigured 
} from '../utils/supabase';

export default function SubmitProjectModal({ 
  onClose, 
  onSubmitProject, 
  onUpdateProject,
  onDeleteProject,
  onExportJson, 
  onImportJson, 
  onResetDefault,
  initialIdea,
  initialProject 
}) {
  const isEditing = Boolean(initialProject);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'manage'
  const [thumbMode, setThumbMode] = useState(() => (initialProject?.thumbnailUrl?.startsWith('http') ? 'url' : 'file'));
  const [successNotice, setSuccessNotice] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [thumbnailBlob, setThumbnailBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyPinInput, setVerifyPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const [formData, setFormData] = useState(() => {
    if (initialProject) {
      return {
        title: initialProject.title || '',
        author: initialProject.author || '',
        realName: initialProject.realName || initialProject.author || '',
        editPin: initialProject.editPin || '',
        studentClass: initialProject.studentClass || 'X RPL 1',
        category: initialProject.category || 'webapp',
        status: initialProject.status || 'completed',
        demoUrl: initialProject.demoUrl || '',
        githubUrl: initialProject.githubUrl || '',
        thumbnailUrl: initialProject.thumbnailUrl || '',
        techStackInput: initialProject.techStack ? initialProject.techStack.join(', ') : '',
        description: initialProject.description || '',
        avatar: initialProject.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      };
    }
    if (initialIdea) {
      return {
        title: initialIdea.title || '',
        author: '',
        realName: '',
        editPin: '',
        studentClass: 'X RPL 1',
        category: 'webapp',
        status: 'development',
        demoUrl: '',
        githubUrl: '',
        thumbnailUrl: '',
        techStackInput: initialIdea.tech ? initialIdea.tech.join(', ') : 'HTML5, CSS3, JavaScript',
        description: initialIdea.summary || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      };
    }
    return {
      title: '',
      author: '',
      realName: '',
      editPin: '',
      studentClass: 'X RPL 1',
      category: 'webapp',
      status: 'completed',
      demoUrl: '',
      githubUrl: '',
      thumbnailUrl: '',
      techStackInput: 'HTML5, CSS3, JavaScript',
      description: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar awal maksimal 5MB.");
      return;
    }

    try {
      // Compress image to ~30-60KB using canvas to protect localStorage quota & enable fast cloud upload
      const [compressedDataUrl, blob] = await Promise.all([
        compressImage(file, 800, 0.75),
        compressImageToBlob(file, 800, 0.75)
      ]);
      setFormData(prev => ({ ...prev, thumbnailUrl: compressedDataUrl }));
      setThumbnailBlob(blob);
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to normal FileReader if canvas fails
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      // Clear value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleJsonFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          alert("Format file JSON tidak valid. Harus berupa array data proyek.");
          return;
        }

        // Validate and sanitize each project
        const sanitizedProjects = parsed
          .map(validateAndSanitizeProject)
          .filter(Boolean);

        if (sanitizedProjects.length === 0) {
          alert("Tidak ditemukan data proyek yang valid di dalam file JSON.");
          return;
        }

        onImportJson(sanitizedProjects);
        setImportStatus(`Berhasil mengimpor ${sanitizedProjects.length} proyek!`);
        setTimeout(() => setImportStatus(''), 4000);
      } catch (err) {
        console.error("Failed to parse JSON file:", err);
        alert("Gagal membaca file JSON. Pastikan file tidak rusak.");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const title = sanitizeText(formData.title, 100);
    const author = sanitizeText(formData.author, 80); // Nama Samaran / Alias
    const realName = sanitizeText(formData.realName || formData.author, 80); // Nama Asli
    const editPin = sanitizeText(formData.editPin, 10);
    const rawDemo = formData.demoUrl.trim();

    if (!title || !author || !realName || !rawDemo) {
      alert("Mohon lengkapi Judul Proyek, Nama Asli, Nama Samaran, dan Link Web Hosting!");
      return;
    }

    // Jika mengedit proyek yang memiliki PIN keamanan, verifikasi PIN
    if (isEditing && initialProject.editPin) {
      if (!verifyPinInput.trim() || verifyPinInput.trim() !== initialProject.editPin.trim()) {
        setPinError("PIN Pengaman salah! Masukkan PIN yang dibuat saat mendaftarkan proyek.");
        alert("PIN Pengaman salah! Perubahan tidak dapat disimpan.");
        return;
      }
    }

    const sanitizedDemo = sanitizeUrl(rawDemo);
    if (!sanitizedDemo || sanitizedDemo === '#') {
      alert("Link website tidak valid atau menggunakan protokol yang tidak aman. Harap gunakan URL web yang valid (http:// atau https://).");
      return;
    }

    setIsSubmitting(true);

    try {
      const projId = isEditing ? initialProject.id : "proj-" + Date.now();
      let finalThumbUrl = formData.thumbnailUrl;

      // If user selected a new image and Supabase is configured, upload to storage
      if (thumbnailBlob && isSupabaseConfigured()) {
        try {
          const uploadedUrl = await uploadThumbnailToSupabase(thumbnailBlob, projId);
          if (uploadedUrl) {
            finalThumbUrl = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn("Storage upload failed, keeping compressed base64", uploadErr);
        }
      }

      let sanitizedThumb = finalThumbUrl ? sanitizeImageUrl(finalThumbUrl) : null;
      if (sanitizedThumb === '#') sanitizedThumb = null;

      let sanitizedGithub = null;
      if (formData.githubUrl && formData.githubUrl.trim()) {
        sanitizedGithub = sanitizeUrl(formData.githubUrl.trim());
        if (sanitizedGithub === '#') sanitizedGithub = null;
      }

      const techStack = formData.techStackInput
        .split(',')
        .map(t => sanitizeText(t.trim(), 30))
        .filter(Boolean);

      const categoryLabels = {
        webapp: 'Web App',
        game: 'Game Web',
        portfolio: 'Portofolio',
        landing: 'Landing Page',
        utility: 'Tools / Utility'
      };

      if (isEditing) {
        const updatedProject = {
          ...initialProject,
          title,
          author, // Alias publik
          realName, // Nama asli siswa
          editPin: editPin || initialProject.editPin || '',
          studentClass: formData.studentClass,
          avatar: formData.avatar,
          category: formData.category,
          categoryLabel: categoryLabels[formData.category] || 'Web App',
          status: formData.status,
          demoUrl: sanitizedDemo,
          githubUrl: sanitizedGithub,
          thumbnailUrl: sanitizedThumb || null,
          techStack: techStack.length > 0 ? techStack : ['Web'],
          description: sanitizeText(formData.description, 500) || 'Aplikasi web karya siswa kelas 10 RPL.',
          updatedDate: new Date().toISOString().split('T')[0]
        };
        await onUpdateProject(updatedProject);
      } else {
        const newProject = {
          id: projId,
          title,
          author, // Alias publik
          realName, // Nama asli siswa
          editPin: editPin || '1234',
          studentClass: formData.studentClass,
          avatar: formData.avatar,
          category: formData.category,
          categoryLabel: categoryLabels[formData.category] || 'Web App',
          status: formData.status,
          demoUrl: sanitizedDemo,
          githubUrl: sanitizedGithub,
          thumbnailUrl: sanitizedThumb || null,
          techStack: techStack.length > 0 ? techStack : ['Web'],
          description: sanitizeText(formData.description, 500) || 'Aplikasi web karya siswa kelas 10 RPL.',
          stars: 1,
          views: 1,
          submissionDate: new Date().toISOString().split('T')[0]
        };
        await onSubmitProject(newProject);
      }

      setSuccessNotice(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Terjadi kendala saat menyimpan proyek. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (initialProject.editPin) {
      const enteredPin = window.prompt(`Masukkan PIN Pengaman Proyek untuk menghapus "${formData.title}":`);
      if (!enteredPin || enteredPin.trim() !== initialProject.editPin.trim()) {
        alert("PIN Pengaman salah! Proyek tidak dapat dihapus.");
        return;
      }
    } else {
      if (!window.confirm(`Hapus proyek "${formData.title}" dari galeri?`)) {
        return;
      }
    }

    onDeleteProject(initialProject.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-submit-box" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="modal-header-simple">
          <div>
            <h2 className="modal-heading-text">
              {isEditing ? "Edit & Perbarui Informasi Proyek" : "Daftarkan Proyek Siswa"}
            </h2>
            <p className="modal-lead-text">
              {isEditing 
                ? "Perbarui link website, ganti foto screenshot, atau ubah status pengembangan proyek ini."
                : "Kirimkan link website yang sudah di-hosting beserta tangkapan layar (screenshot) karya kodingmu."}
            </p>
          </div>
          <button type="button" className="btn-close-clean" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>

        {/* Subtabs */}
        {!isEditing && (
          <div className="form-tab-nav">
            <button 
              type="button"
              className={`form-tab-link ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Formulir Karya
            </button>
            <button 
              type="button"
              className={`form-tab-link ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              Backup Data (JSON)
            </button>
          </div>
        )}

        {successNotice ? (
          <div className="form-success-box animate-fade">
            <div className="success-check-bubble">
              <CheckIcon size={32} />
            </div>
            <h3>{isEditing ? "Perubahan Berhasil Disimpan!" : "Karya Berhasil Didaftarkan!"}</h3>
            <p>Data proyek di perpustakaan kelas telah diperbarui.</p>
          </div>
        ) : activeTab === 'form' ? (

          <form onSubmit={handleSubmit} className="form-scrollable-body">
            
            {/* Status Pengembangan Proyek */}
            <div className="field-group highlight-field">
              <label htmlFor="select-status">Status Pengerjaan Proyek *</label>
              <select 
                id="select-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="development">🟡 Masih Tahap Pengembangan (WIP / Beta)</option>
                <option value="completed">🟢 Sudah Selesai / Siap Pakai (Live)</option>
              </select>
              <span className="field-hint">
                Pilih "Tahap Pengembangan" jika website masih dalam proses pembuatan dan ingin di-update berkala.
              </span>
            </div>

            {/* Jika sedang mengedit proyek dengan PIN, minta verifikasi PIN terlebih dahulu */}
            {isEditing && initialProject.editPin && (
              <div className="field-group highlight-field pin-verify-box">
                <label htmlFor="input-verify-pin" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
                  <LockIcon size={14} />
                  Verifikasi Kepemilikan: Masukkan PIN Proyek *
                </label>
                <input 
                  id="input-verify-pin"
                  type="password"
                  maxLength="10"
                  placeholder="Ketik PIN saat pembuatan proyek..."
                  value={verifyPinInput}
                  onChange={(e) => {
                    setVerifyPinInput(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  required
                />
                {pinError && <span className="field-error-msg" style={{ color: '#ef4444', fontSize: '12px' }}>{pinError}</span>}
                <span className="field-hint">
                  Hanya pembuat proyek yang memiliki PIN ini yang dapat menyimpan perubahan atau menghapus proyek.
                </span>
              </div>
            )}

            {/* Identitas Pembuat: Nama Asli vs Nama Samaran */}
            <div className="form-row-2">
              <div className="field-group">
                <label htmlFor="input-real-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldIcon size={13} />
                  Nama Asli / Panjang Siswa *
                </label>
                <input 
                  id="input-real-name"
                  name="realName"
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Budi Santoso"
                  value={formData.realName}
                  onChange={handleChange}
                />
                <span className="field-hint">
                  🔒 <b>Privasi Terjaga:</b> Hanya terlihat oleh Siswa & Guru di Mode Siswa.
                </span>
              </div>

              <div className="field-group">
                <label htmlFor="input-author">
                  Nama Samaran / Alias (Callsign) *
                </label>
                <input 
                  id="input-author"
                  name="author"
                  type="text"
                  required
                  placeholder="Contoh: BudiDev / BudiCode"
                  value={formData.author}
                  onChange={handleChange}
                />
                <span className="field-hint">
                  🌐 <b>Publik:</b> Nama samaran ini yang dilihat oleh pengunjung umum / Tamu.
                </span>
              </div>
            </div>

            {/* Kelas & PIN Pengaman Proyek */}
            <div className="form-row-2">
              <div className="field-group">
                <label htmlFor="select-class">Kelas *</label>
                <select 
                  id="select-class"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                >
                  <option value="X RPL 1">X RPL 1</option>
                  <option value="X RPL 2">X RPL 2</option>
                  <option value="X RPL 3">X RPL 3</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="input-edit-pin" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LockIcon size={13} />
                  PIN Pengaman Proyek (4-6 digit) *
                </label>
                <input 
                  id="input-edit-pin"
                  name="editPin"
                  type="text"
                  maxLength="6"
                  required={!isEditing}
                  placeholder="Contoh: 1234"
                  value={formData.editPin}
                  onChange={handleChange}
                />
                <span className="field-hint">
                  🔑 Dibutuhkan untuk mengedit/menghapus proyek agar tidak diubah siswa lain.
                </span>
              </div>
            </div>

            {/* Judul & Kategori */}
            <div className="form-row-2">
              <div className="field-group">
                <label htmlFor="input-title">Judul Proyek *</label>
                <input 
                  id="input-title"
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Portofolio Web Pribadi"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label htmlFor="select-cat">Kategori Proyek *</label>
                <select 
                  id="select-cat"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="webapp">Web App (Aplikasi Web)</option>
                  <option value="game">Game Web (HTML5 / Canvas)</option>
                  <option value="portfolio">Portofolio Siswa</option>
                  <option value="landing">Landing Page</option>
                  <option value="utility">Tools / Utility</option>
                </select>
              </div>
            </div>

            {/* Link Live Hosting */}
            <div className="field-group">
              <label htmlFor="input-demo-url">
                Link Website Hasil Hosting (Live URL) *
              </label>
              <input 
                id="input-demo-url"
                name="demoUrl"
                type="text"
                required
                placeholder="https://proyek-saya.vercel.app atau https://username.github.io/repo"
                value={formData.demoUrl}
                onChange={handleChange}
              />
              <span className="field-hint">
                Jika ada update kodingan di Vercel/Netlify, URL ini bisa tetap sama atau ditimpa jika ganti domain baru.
              </span>
            </div>

            {/* Thumbnail */}
            <div className="field-group">
              <div className="field-label-split">
                <label>Foto / Screenshot Thumbnail Proyek</label>
                <div className="thumb-mode-switch">
                  <button 
                    type="button" 
                    className={`btn-mode-pill ${thumbMode === 'file' ? 'active' : ''}`}
                    onClick={() => setThumbMode('file')}
                  >
                    Upload Foto Baru
                  </button>
                  <button 
                    type="button" 
                    className={`btn-mode-pill ${thumbMode === 'url' ? 'active' : ''}`}
                    onClick={() => setThumbMode('url')}
                  >
                    Paste URL Foto
                  </button>
                </div>
              </div>

              {thumbMode === 'file' ? (
                <div className="file-drop-area">
                  <input 
                    type="file" 
                    id="thumb-file-input"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="thumb-file-input" className="file-drop-label">
                    <UploadIcon size={20} />
                    <span>Pilih foto screenshot dari komputer / HP (Maks 2MB)</span>
                  </label>
                </div>
              ) : (
                <input 
                  type="url"
                  name="thumbnailUrl"
                  placeholder="https://contoh.com/screenshot-karya.jpg"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              )}

              {formData.thumbnailUrl && (
                <div className="thumb-preview-container">
                  <div className="thumb-preview-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="thumb-preview-title">Preview Thumbnail:</span>
                    <button 
                      type="button" 
                      className="btn-remove-thumb"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Hapus foto thumbnail ini"
                    >
                      <TrashIcon size={12} /> Hapus Foto
                    </button>
                  </div>
                  <div className="thumb-preview-frame">
                    <img src={formData.thumbnailUrl} alt="Preview karya" />
                  </div>
                </div>
              )}
            </div>

            {/* Teknologi & Deskripsi */}
            <div className="field-group">
              <label htmlFor="input-tech">Teknologi yang Dipakai</label>
              <input 
                id="input-tech"
                name="techStackInput"
                type="text"
                placeholder="Contoh: React, Vite, Tailwind CSS (pisahkan koma)"
                value={formData.techStackInput}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="input-desc">Deskripsi Singkat Karya</label>
              <textarea 
                id="input-desc"
                name="description"
                rows="3"
                placeholder="Jelaskan secara singkat apa fungsi website ini..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="input-github">Link Repository GitHub (Opsional)</label>
              <input 
                id="input-github"
                name="githubUrl"
                type="text"
                placeholder="https://github.com/username/project-repo"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>

            {/* Footer Buttons */}
            <div className="form-submit-footer">
              {isEditing && (
                <button 
                  type="button" 
                  className="btn-danger-clean mr-auto" 
                  onClick={handleDelete}
                >
                  <TrashIcon size={14} /> Hapus Proyek
                </button>
              )}

              <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
                Batal
              </button>
              <button id="btn-save-project" type="submit" className="btn-submit-main" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Menyimpan ke Cloud..." 
                  : (isEditing ? "Simpan Perubahan" : "Simpan & Publikasikan ke Galeri")}
              </button>
            </div>

          </form>
        ) : (
          
          /* Backup & JSON Management */
          <div className="manage-json-body">
            <div className="json-box-item">
              <div className="json-info">
                <h4>Ekspor Data Proyek ke File JSON</h4>
                <p>Unduh seluruh daftar proyek yang ada saat ini sebagai cadangan (backup).</p>
              </div>
              <button 
                type="button" 
                className="btn-backup-action" 
                onClick={onExportJson}
              >
                <DownloadIcon size={16} />
                Unduh JSON
              </button>
            </div>

            <div className="json-box-item mt-3">
              <div className="json-info">
                <h4>Impor File JSON Proyek</h4>
                <p>Muat file JSON proyek yang sudah diekspor sebelumnya.</p>
                {importStatus && <span className="status-badge-ok">{importStatus}</span>}
              </div>
              <label className="btn-backup-action btn-upload-label">
                <UploadIcon size={16} />
                Pilih File JSON
                <input 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={handleJsonFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div className="json-box-item mt-3 danger-item">
              <div className="json-info">
                <h4>Kosongkan Seluruh Galeri</h4>
                <p>Hapus semua data proyek yang tersimpan di browser ini agar galeri kembali bersih.</p>
              </div>
              <button 
                type="button" 
                className="btn-danger-clean"
                onClick={() => {
                  if (window.confirm("Apakah Anda yakin ingin mengosongkan seluruh proyek?")) {
                    onResetDefault();
                    onClose();
                  }
                }}
              >
                Kosongkan
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
