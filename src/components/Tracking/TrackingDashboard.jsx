import { useState, useMemo } from 'react'
import { getPatientJourney } from '../../services/storage'

export default function TrackingDashboard({
  patients,
  visits,
  onRecordVisitForPatient,
  onViewPatient
}) {
  const [activeSubTab, setActiveSubTab] = useState('upcoming')

  // Date filters for upcoming visits
  const todayStr = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState('2026-11-30')

  // 1. เคสนัดเยี่ยมบ้าน (Upcoming / Scheduled Visits)
  const scheduledCases = useMemo(() => {
    return patients.filter(p => {
      if (!p.nextAppointment || p.dcStatus !== 'กำลังติดตาม') return false
      if (startDate && p.nextAppointment < startDate) return false
      if (endDate && p.nextAppointment > endDate) return false
      return true
    }).sort((a, b) => new Date(a.nextAppointment) - new Date(b.nextAppointment))
  }, [patients, startDate, endDate])

  // 2. เคสที่จำหน่ายแล้วแต่ยังไม่ได้เยี่ยมบ้านครั้งแรก (Unvisited at Home)
  const unvisitedHomeCases = useMemo(() => {
    return patients.filter(p => {
      return p.dischargeDate && !p.firstHomeVisitDate && p.dcStatus === 'กำลังติดตาม'
    })
  }, [patients])

  // 3. เคสที่ยังไม่ได้ไปประเมินที่ตึก (Unvisited in Ward)
  const unvisitedWardCases = useMemo(() => {
    return patients.filter(p => {
      return !p.inWardVisitDate && p.dcStatus === 'กำลังติดตาม'
    })
  }, [patients])

  // 4. สรุปพัฒนาการเคส (Patient Journey & ADL Trend)
  const journeyList = useMemo(() => {
    return getPatientJourney(patients, visits)
  }, [patients, visits])

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h4 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <i className="bi bi-bell-fill"></i>
              กระดานติดตามและแจ้งเตือนเคส (Clinical Tracking & Alerts)
            </h4>
            <small className="text-muted">
              ระบบตรวจสอบเคสนัดหมายลงพื้นที่ คัดกรองเคสตกหล่น และติดตามพัฒนาการผู้ป่วย
            </small>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <ul className="nav nav-pills gap-2">
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeSubTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('upcoming')}
            >
              <i className="bi bi-calendar-event"></i>
              เคสนัดเยี่ยมบ้าน
              <span className="badge text-bg-light">{scheduledCases.length}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeSubTab === 'unvisitedHome' ? 'active bg-danger' : 'text-danger border border-danger-subtle'}`}
              onClick={() => setActiveSubTab('unvisitedHome')}
            >
              <i className="bi bi-house-x"></i>
              ยังไม่ได้เยี่ยมบ้าน
              <span className={`badge ${activeSubTab === 'unvisitedHome' ? 'text-bg-light' : 'bg-danger'}`}>
                {unvisitedHomeCases.length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeSubTab === 'unvisitedWard' ? 'active bg-warning text-dark' : 'text-warning-emphasis border border-warning-subtle'}`}
              onClick={() => setActiveSubTab('unvisitedWard')}
            >
              <i className="bi bi-hospital"></i>
              ยังไม่ได้เยี่ยมตึก
              <span className={`badge ${activeSubTab === 'unvisitedWard' ? 'text-bg-dark' : 'bg-warning text-dark'}`}>
                {unvisitedWardCases.length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeSubTab === 'journey' ? 'active bg-success' : 'text-success border border-success-subtle'}`}
              onClick={() => setActiveSubTab('journey')}
            >
              <i className="bi bi-graph-up-arrow"></i>
              สรุปพัฒนาการ ADL
              <span className="badge text-bg-light">{journeyList.length}</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body p-4">
        {/* SUBTAB 1: เคสนัดเยี่ยมบ้าน */}
        {activeSubTab === 'upcoming' && (
          <div>
            <div className="p-3 bg-light rounded border mb-3">
              <div className="row g-2 align-items-center">
                <div className="col-md-3">
                  <label className="form-label small fw-bold mb-1">เลือกวันเริ่มต้น</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold mb-1">เลือกวันสิ้นสุด</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6 text-md-end mt-3 mt-md-0">
                  <span className="badge text-bg-primary fs-6">
                    พบคิวนัดหมาย {scheduledCases.length} รายการ
                  </span>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle table-bordered mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: '130px' }}>วันนัดถัดไป</th>
                    <th style={{ width: '120px' }}>HW No.</th>
                    <th>ชื่อผู้ป่วย</th>
                    <th style={{ width: '120px' }}>กลุ่มการดูแล</th>
                    <th>ที่อยู่ / พื้นที่</th>
                    <th>สถานบริการปลายทาง</th>
                    <th style={{ width: '110px' }}>ADL ปัจจุบัน</th>
                    <th style={{ width: '140px' }}>ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledCases.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-check fs-2 d-block mb-2 text-success"></i>
                        ไม่มีคิวนัดเยี่ยมบ้านในช่วงวันที่เลือก
                      </td>
                    </tr>
                  ) : (
                    scheduledCases.map(p => (
                      <tr key={p.id}>
                        <td className="text-center fw-bold text-primary">
                          <i className="bi bi-calendar-event me-1"></i>{p.nextAppointment}
                        </td>
                        <td className="fw-bold">{p.hwNo}</td>
                        <td>
                          <div className="fw-semibold">{p.prfx}{p.firstName} {p.lastName}</div>
                          <small className="text-muted">โทร: {p.phone || '-'}</small>
                        </td>
                        <td>
                          <span className="badge text-bg-secondary">{p.typeDx1}</span>
                          <small className="d-block text-muted">{p.typeDx2}</small>
                        </td>
                        <td>
                          <small>ต.{p.subdistrict} อ.{p.district} ({p.area})</small>
                        </td>
                        <td><small>{p.targetPcu || '-'}</small></td>
                        <td className="text-center">
                          <span className={`badge ${p.ptColor === 'เขียว' ? 'bg-success' : p.ptColor === 'เหลือง' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {p.preDcAdl} / 20 ({p.ptColor})
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                            onClick={() => onRecordVisitForPatient(p)}
                          >
                            <i className="bi bi-plus"></i>บันทึกเยี่ยม
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ยังไม่ได้เยี่ยมบ้าน */}
        {activeSubTab === 'unvisitedHome' && (
          <div>
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-octagon-fill fs-4"></i>
              <div>
                <strong>เคสที่จำหน่ายกลับบ้านแล้ว แต่ยังไม่ได้รับการเยี่ยมบ้านครั้งแรก ({unvisitedHomeCases.length} ราย)</strong>
                <div className="small">ควรเร่งประสานงานและจัดตารางลงเยี่ยมบ้านเพื่อประเมินความปลอดภัยและการฟื้นฟูหลังกลับบ้าน</div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle table-bordered mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: '120px' }}>HW No.</th>
                    <th>ชื่อผู้ป่วย</th>
                    <th style={{ width: '110px' }}>วัน D/C</th>
                    <th style={{ width: '120px' }}>กลุ่มดูแล</th>
                    <th>ตึกที่ส่ง</th>
                    <th>สถานบริการปลายทาง</th>
                    <th style={{ width: '100px' }}>สถานะ</th>
                    <th style={{ width: '140px' }}>ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {unvisitedHomeCases.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-success">
                        <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
                        ยอดเยี่ยมมาก! ไม่มีเคสตกค้างที่ยังไม่ได้เยี่ยมบ้าน
                      </td>
                    </tr>
                  ) : (
                    unvisitedHomeCases.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold text-danger">{p.hwNo}</td>
                        <td>
                          <div className="fw-semibold">{p.prfx}{p.firstName} {p.lastName}</div>
                          <small className="text-muted">โทร: {p.phone || '-'}</small>
                        </td>
                        <td className="text-center">{p.dischargeDate || '-'}</td>
                        <td>
                          <span className="badge text-bg-secondary">{p.typeDx1}</span>
                          <small className="d-block text-muted">{p.typeDx2}</small>
                        </td>
                        <td><small>{p.wardSender}</small></td>
                        <td><small>{p.targetPcu}</small></td>
                        <td className="text-center">
                          <span className="badge text-bg-danger">รอเยี่ยมบ้านครั้งแรก</span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1"
                            onClick={() => onRecordVisitForPatient(p)}
                          >
                            <i className="bi bi-house-door-fill"></i>ลงเยี่ยมครั้งแรก
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ยังไม่ได้เยี่ยมตึก */}
        {activeSubTab === 'unvisitedWard' && (
          <div>
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
              <div>
                <strong>เคสที่ส่งตัวเข้า Home Ward แต่ยังไม่ได้ไปประเมินที่ตึกผู้ป่วย ({unvisitedWardCases.length} ราย)</strong>
                <div className="small">ควรไปประเมินสภาพผู้ป่วย ความพร้อมของญาติ และวางแผนการจำหน่ายก่อนคนไข้กลับบ้าน</div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle table-bordered mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: '120px' }}>HW No.</th>
                    <th>ชื่อผู้ป่วย</th>
                    <th style={{ width: '110px' }}>วัน Admit</th>
                    <th>ตึกที่ส่ง</th>
                    <th>การวินิจฉัย</th>
                    <th style={{ width: '100px' }}>ติดเตียง</th>
                    <th style={{ width: '120px' }}>ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {unvisitedWardCases.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-success">
                        <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
                        ไม่มีเคสตกค้างที่ยังไม่ได้เยี่ยมตึก
                      </td>
                    </tr>
                  ) : (
                    unvisitedWardCases.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold text-primary">{p.hwNo}</td>
                        <td>
                          <div className="fw-semibold">{p.prfx}{p.firstName} {p.lastName}</div>
                          <small className="text-muted">HN: {p.hn}</small>
                        </td>
                        <td className="text-center">{p.admitDate || '-'}</td>
                        <td><strong>{p.wardSender}</strong> ({p.pct})</td>
                        <td>{p.dxDetail || `${p.typeDx1} - ${p.typeDx2}`}</td>
                        <td className="text-center">
                          <span className={`badge ${p.statusBedridden === 'ติดเตียง' ? 'bg-danger' : 'bg-light text-dark border'}`}>
                            {p.statusBedridden}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onViewPatient(p)}
                          >
                            <i className="bi bi-eye me-1"></i>ดูเวชระเบียน
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: สรุปพัฒนาการ ADL (Patient Journey) */}
        {activeSubTab === 'journey' && (
          <div>
            <div className="table-responsive">
              <table className="table table-hover align-middle table-bordered mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: '120px' }}>HW No.</th>
                    <th>ชื่อผู้ป่วย</th>
                    <th style={{ width: '110px' }}>กลุ่มดูแล</th>
                    <th style={{ width: '100px' }}>จำนวนเยี่ยม</th>
                    <th style={{ width: '100px' }}>ADL แรกรับ</th>
                    <th style={{ width: '100px' }}>ADL ล่าสุด</th>
                    <th style={{ width: '110px' }}>แนวโน้ม</th>
                    <th style={{ width: '120px' }}>เยี่ยมล่าสุด</th>
                    <th style={{ width: '90px' }}>เวชระเบียน</th>
                  </tr>
                </thead>
                <tbody>
                  {journeyList.map(j => (
                    <tr key={j.patient.id}>
                      <td className="fw-bold">{j.patient.hwNo}</td>
                      <td>
                        <div className="fw-semibold">
                          {j.patient.prfx}{j.patient.firstName} {j.patient.lastName}
                        </div>
                        <small className="text-muted">{j.patient.area}</small>
                      </td>
                      <td><span className="badge text-bg-secondary">{j.patient.typeDx1}</span></td>
                      <td className="text-center">
                        <span className="badge text-bg-light border text-dark fs-7">
                          {j.visitCount} ครั้ง
                        </span>
                      </td>
                      <td className="text-center fw-bold">{j.initialAdl} / 20</td>
                      <td className="text-center fw-bold">
                        <span className={`badge ${j.latestColor === 'เขียว' ? 'bg-success' : j.latestColor === 'เหลือง' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {j.latestAdl} / 20
                        </span>
                      </td>
                      <td className="text-center">
                        {j.trend === 'ดีขึ้น' && (
                          <span className="badge text-bg-success">
                            <i className="bi bi-arrow-up-right me-1"></i>ดีขึ้น (+{j.adlDiff})
                          </span>
                        )}
                        {j.trend === 'ลดลง' && (
                          <span className="badge text-bg-danger">
                            <i className="bi bi-arrow-down-right me-1"></i>ลดลง ({j.adlDiff})
                          </span>
                        )}
                        {j.trend === 'คงที่' && (
                          <span className="badge text-bg-light border text-dark">
                            <i className="bi bi-dash me-1"></i>คงที่
                          </span>
                        )}
                      </td>
                      <td className="text-center text-muted small">{j.latestVisitDate}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => onViewPatient(j.patient)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
