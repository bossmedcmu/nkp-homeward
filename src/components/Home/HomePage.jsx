export default function HomePage({
  patientCount,
  visitCount,
  alertCount,
  onNavigate,
  onAddNewPatient,
  onAddNewVisit,
  heroImageSrc
}) {
  return (
    <div className="container-fluid px-3 py-2">
      {/* Hero Banner with Illustration */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 p-4 p-md-5">
            <span className="badge text-bg-primary px-3 py-2 fs-6 mb-3 rounded-pill shadow-sm">
              <i className="bi bi-hospital me-1"></i>งานการพยาบาลชุมชน โรงพยาบาลนครพนม
            </span>
            <h1 className="display-6 fw-bold text-primary mb-3">
              NKP Homeward <br />
              <span className="text-secondary fw-normal fs-3">ระบบติดตามและดูแลผู้ป่วยต่อเนื่องที่บ้าน</span>
            </h1>
            <p className="lead text-muted fs-6 mb-4">
              เชื่อมโยงการดูแลจากเตียงผู้ป่วยในโรงพยาบาลสู่บ้านอย่างอบอุ่นและไร้รอยต่อ
              ครอบคลุม Intermediate Care (IMC), Long-Term Care (LTC), และ Palliative Care
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
                onClick={onAddNewPatient}
              >
                <i className="bi bi-person-plus-fill"></i>
                <span>ลงทะเบียนผู้ป่วยใหม่</span>
              </button>
              <button
                className="btn btn-success px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
                onClick={onAddNewVisit}
              >
                <i className="bi bi-plus-circle-fill"></i>
                <span>บันทึกการเยี่ยม</span>
              </button>
              <button
                className="btn btn-outline-primary px-3 py-2"
                onClick={() => onNavigate('tracking')}
              >
                <i className="bi bi-bell-fill me-1"></i>
                <span>กระดานติดตาม ({alertCount})</span>
              </button>
            </div>
          </div>

          <div className="col-lg-6 p-3 p-md-4 text-center bg-light-subtle d-flex align-items-center justify-content-center">
            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt="ทีมพยาบาลเยี่ยมบ้าน NKP Homeward"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: '360px', width: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="p-5 rounded-4 d-flex flex-column align-items-center justify-content-center text-center shadow-sm w-100"
                style={{
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e8f5e9 100%)',
                  minHeight: '320px'
                }}
              >
                <i className="bi bi-heart-pulse-fill text-danger display-1 mb-3 animate-pulse"></i>
                <h4 className="fw-bold text-primary mb-2">ทีมพยาบาลลงพื้นที่เยี่ยมบ้าน</h4>
                <p className="text-muted small col-md-8 mx-auto mb-0">
                  กำลังใจและการฟื้นฟูสุขภาพถึงบันไดบ้านชาวบ้านในชุมชนนครพนม
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white cursor-pointer hover-shadow"
            onClick={() => onNavigate('registry')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">ทะเบียนผู้ป่วยในระบบ</span>
                <h3 className="fw-bold text-primary mb-0">{patientCount} <span className="fs-6 fw-normal">ราย</span></h3>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <i className="bi bi-people-fill fs-3"></i>
              </div>
            </div>
            <div className="mt-2 text-primary small fw-semibold">
              เข้าดูทะเบียนผู้ป่วย <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white cursor-pointer hover-shadow"
            onClick={() => onNavigate('visits')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">บันทึกการเยี่ยมสะสม</span>
                <h3 className="fw-bold text-success mb-0">{visitCount} <span className="fs-6 fw-normal">ครั้ง</span></h3>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <i className="bi bi-geo-alt-fill fs-3"></i>
              </div>
            </div>
            <div className="mt-2 text-success small fw-semibold">
              เข้าดูบันทึกการเยี่ยม <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white cursor-pointer hover-shadow"
            onClick={() => onNavigate('tracking')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">เคสที่ต้องติดตามเร่งด่วน</span>
                <h3 className="fw-bold text-danger mb-0">{alertCount} <span className="fs-6 fw-normal">เคส</span></h3>
              </div>
              <div className="p-3 bg-danger-subtle text-danger rounded-3">
                <i className="bi bi-bell-fill fs-3"></i>
              </div>
            </div>
            <div className="mt-2 text-danger small fw-semibold">
              เข้าดูกระดานติดตาม <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white cursor-pointer hover-shadow"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">สถิติและผลการดำเนินงาน</span>
                <h3 className="fw-bold text-info-emphasis mb-0">KPI <span className="fs-6 fw-normal">Dashboard</span></h3>
              </div>
              <div className="p-3 bg-info-subtle text-info-emphasis rounded-3">
                <i className="bi bi-bar-chart-fill fs-3"></i>
              </div>
            </div>
            <div className="mt-2 text-info-emphasis small fw-semibold">
              เข้าดูรายงานและสถิติ <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
