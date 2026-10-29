import { useState } from 'react'

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim() === 'nkp' && password === 'Nkp@cm2026') {
      localStorage.setItem('nkp_auth_user', JSON.stringify({ user: 'nkp', name: 'ทีมพยาบาล NKP Homeward' }))
      onLoginSuccess()
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="bg-primary p-4 text-center text-white">
          <div className="d-inline-flex p-3 bg-white text-primary rounded-circle mb-3 shadow-sm">
            <i className="bi bi-hospital fs-1"></i>
          </div>
          <h3 className="fw-bold mb-1">NKP Homeward</h3>
          <p className="text-white-50 mb-0 small">ระบบงานการพยาบาลต่อเนื่องและติดตามผู้ป่วยที่บ้าน</p>
        </div>

        <div className="card-body p-4">
          <h5 className="fw-bold text-dark text-center mb-4">เข้าสู่ระบบ (Sign In)</h5>

          {error && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">ชื่อผู้ใช้งาน (Username)</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">รหัสผ่าน (Password)</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-box-arrow-in-right"></i>
              เข้าสู่ระบบ
            </button>
          </form>
        </div>

        <div className="card-footer bg-light text-center py-3 text-muted small">
          โรงพยาบาลนครพนม - กลุ่มงานการพยาบาลชุมชน
        </div>
      </div>
    </div>
  )
}
