export default function Navbar({
  activeTab,
  onSelectTab,
  patientCount,
  visitCount,
  alertCount,
  onRestoreMockData,
  onClearAllData,
  onLogout
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container-fluid">
        {/* Brand Clickable -> Navigates to Home */}
        <button
          className="navbar-brand btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 fw-bold p-0 me-3"
          onClick={() => onSelectTab('home')}
          title="คลิกเพื่อกลับหน้าแรก"
        >
          <i className="bi bi-hospital fs-4"></i>
          <span>NKP Homeward</span>
          <span className="badge text-bg-light text-primary fs-7 ms-1">Continuing Care</span>
        </button>

        <div className="d-flex flex-wrap align-items-center justify-content-between flex-grow-1 gap-2">
          <ul className="navbar-nav flex-row gap-1">
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'home' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('home')}
              >
                <i className="bi bi-house-door-fill me-1"></i>
                หน้าแรก
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'registry' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('registry')}
              >
                <i className="bi bi-people-fill me-1"></i>
                ทะเบียนผู้ป่วย
                <span className="badge bg-secondary ms-1">{patientCount}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'visits' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('visits')}
              >
                <i className="bi bi-geo-alt-fill me-1"></i>
                บันทึกการเยี่ยม
                <span className="badge bg-secondary ms-1">{visitCount}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'tracking' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('tracking')}
              >
                <i className="bi bi-bell-fill me-1"></i>
                กระดานติดตาม
                {alertCount > 0 && <span className="badge bg-danger ms-1">{alertCount}</span>}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('dashboard')}
              >
                <i className="bi bi-bar-chart-fill me-1"></i>
                รายงาน & สถิติ
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'about' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
                onClick={() => onSelectTab('about')}
              >
                <i className="bi bi-info-circle-fill me-1"></i>
                เกี่ยวกับระบบ
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Clear All Data Button */}
            <button
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1 shadow-sm"
              onClick={onClearAllData}
              title="ลบข้อมูลทั้งหมดเพื่อทดสอบระบบเปล่าๆ"
            >
              <i className="bi bi-trash3 text-warning"></i>
              <span className="d-none d-xl-inline">ลบข้อมูลทั้งหมด</span>
            </button>

            {/* Restore Mock Data Button */}
            <button
              className="btn btn-warning btn-sm fw-semibold d-flex align-items-center gap-1 shadow-sm"
              onClick={onRestoreMockData}
              title="โหลดชุดข้อมูลตัวอย่าง 50 คน พร้อมประวัติเยี่ยมกลับคืนมา"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span className="d-none d-md-inline">คืนข้อมูลตัวอย่าง 50 ราย</span>
            </button>

            {/* Logout Button */}
            <button
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1 shadow-sm"
              onClick={onLogout}
              title="ออกจากระบบ"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
