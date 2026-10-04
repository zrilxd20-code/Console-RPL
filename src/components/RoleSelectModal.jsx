import React, { useState } from 'react';
import { UserIcon, GraduationCapIcon, ShieldIcon, LockIcon, XIcon, CheckIcon } from './Icons';

const PASSCODE_STUDENT = (import.meta.env.VITE_STUDENT_PASSCODE || 'RPL10').trim().toUpperCase();

export default function RoleSelectModal({
  isOpen,
  currentRole,
  onSelectRole,
  onClose,
  noticeMessage = '',
  isForced = false
}) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedOption, setSelectedOption] = useState(currentRole || 'guest');

  if (!isOpen) return null;

  const handleChooseGuest = () => {
    onSelectRole('guest');
    onClose();
  };

  const handleChooseStudent = (e) => {
    e.preventDefault();
    const cleanInput = passcode.trim().toUpperCase();
    
    // Verifikasi passcode kelas (case-insensitive)
    const validCodes = [PASSCODE_STUDENT, 'XRPL', '10RPL'];
    if (validCodes.includes(cleanInput)) {
      setErrorMsg('');
      onSelectRole('student');
      onClose();
    } else {
      setErrorMsg('Passcode salah! Silakan periksa kembali atau tanyakan ke pengurus kelas.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={isForced ? undefined : onClose}>
      <div 
        className="modal-content modal-role-select"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header-simple">
          <div>
            <div className="role-welcome-badge">
              <ShieldIcon size={14} />
              <span>Sistem Keamanan & Privasi Identitas Siswa</span>
            </div>
            <h2 className="modal-heading-text" style={{ marginTop: '8px' }}>
              Selamat Datang di Console RPL
            </h2>
            <p className="modal-lead-text">
              Pilih mode kunjungan Anda. Sistem kami menerapkan perlindungan data privasi (*Pseudonymization*) untuk menjaga keamanan siswa di internet.
            </p>
          </div>
          {!isForced && (
            <button type="button" className="btn-close-clean" onClick={onClose}>
              <XIcon size={18} />
            </button>
          )}
        </div>

        {noticeMessage && (
          <div className="role-notice-banner">
            <LockIcon size={16} />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* 2 Role Choice Cards */}
        <div className="role-cards-grid">
          
          {/* Card 1: Mode Tamu */}
          <div 
            className={`role-option-card ${selectedOption === 'guest' ? 'active-role' : ''}`}
            onClick={() => setSelectedOption('guest')}
          >
            <div className="role-card-header">
              <div className="role-avatar-circle guest-avatar">
                <UserIcon size={24} />
              </div>
              <span className="role-privacy-pill">
                <ShieldIcon size={12} />
                Privasi Terjaga
              </span>
            </div>

            <h3 className="role-card-title">Tamu / Pengunjung Umum</h3>
            <p className="role-card-desc">
              Untuk umum, industri, atau orang tua yang ingin menjelajahi hasil karya.
            </p>

            <ul className="role-features-list">
              <li>
                <CheckIcon size={13} className="text-emerald" />
                <span>Hanya melihat <b>Nama Samaran / Alias</b> (Nama asli disembunyikan)</span>
              </li>
              <li>
                <CheckIcon size={13} className="text-emerald" />
                <span>Bebas mencoba demo website & apresiasi bintang</span>
              </li>
              <li className="feature-restricted">
                <span className="text-muted">• Tidak dapat mendaftarkan/mengubah proyek</span>
              </li>
            </ul>

            <button 
              type="button"
              className="btn-select-guest"
              onClick={handleChooseGuest}
            >
              <UserIcon size={15} />
              <span>Masuk Mode Tamu</span>
            </button>
          </div>

          {/* Card 2: Mode Siswa & Guru */}
          <div 
            className={`role-option-card ${selectedOption === 'student' ? 'active-role' : ''}`}
            onClick={() => setSelectedOption('student')}
          >
            <div className="role-card-header">
              <div className="role-avatar-circle student-avatar">
                <GraduationCapIcon size={24} />
              </div>
              <span className="role-access-pill">
                Akses Internal
              </span>
            </div>

            <h3 className="role-card-title">Siswa / Guru X RPL</h3>
            <p className="role-card-desc">
              Akses internal untuk siswa yang ingin mengunggah karya dan guru untuk penilaian.
            </p>

            <ul className="role-features-list">
              <li>
                <CheckIcon size={13} className="text-emerald" />
                <span>Melihat <b>Nama Lengkap Asli</b> & Nama Samaran</span>
              </li>
              <li>
                <CheckIcon size={13} className="text-emerald" />
                <span>Bisa <b>Daftarkan Proyek Baru</b> & kelola karya</span>
              </li>
              <li>
                <CheckIcon size={13} className="text-emerald" />
                <span>Akses fitur ekspor data & generator ide</span>
              </li>
            </ul>

            <form onSubmit={handleChooseStudent} className="student-passcode-box">
              <label htmlFor="student-passcode-input">
                <LockIcon size={13} />
                Passcode Kelas:
              </label>
              <div className="passcode-input-row">
                <input 
                  id="student-passcode-input"
                  type="password" 
                  placeholder="Masukkan passcode kelas..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoComplete="current-password"
                />
                <button type="submit" className="btn-verify-student">
                  Verifikasi
                </button>
              </div>
              {errorMsg ? (
                <span className="passcode-err-text">{errorMsg}</span>
              ) : (
                <span className="passcode-hint-text">🔒 Dapatkan passcode dari guru atau pengurus kelas X RPL</span>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
