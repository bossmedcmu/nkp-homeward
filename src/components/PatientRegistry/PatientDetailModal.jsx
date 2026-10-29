import { useState } from 'react'

export default function PatientDetailModal({ patient, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('general')

  if (!patient) return null

  const getBadgeClass = (color) => {
    if (color === 'เขียว') return 'bg-success'
    if (color === 'เหลือง') return 'bg-warning text-dark'
    return 'bg-danger'
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-person-vcard-fill fs-5"></i>
              <span>เวชระเบียนผู้ป่วยฉบับสมบูรณ์: {patient.prfx}{patient.firstName} {patient.lastName}</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Quick Summary Banner */}
          <div className="bg-light border-bottom p-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  {patient.prfx}{patient.firstName} {patient.lastName}
                  <span className="badge text-bg-light border text-dark ms-2 fs-6">
                    {patient.gender} | อายุ {patient.age || '-'} ปี
                  </span>
                </h4>
                <div className="text-muted small">
                  HW No: <strong className="text-dark">{patient.hwNo}</strong> (Admit ครั้งที่ {patient.admitRound || 1}) | 
                  HN: <strong className="text-dark ms-1">{patient.hn}</strong> | 
                  โทร: <strong className="text-dark ms-1">{patient.phone || '-'}</strong>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className={`badge ${getBadgeClass(patient.ptColor)} fs-6 py-2 px-3`}>
                  Triage: {patient.ptColor}
                </span>
                <span className="badge bg-secondary fs-6 py-2 px-3">
                  {patient.typeDx1} ({patient.typeDx2})
                </span>
                <span className={`badge ${patient.statusBedridden === 'ติดเตียง' ? 'bg-danger' : 'bg-success'} fs-6 py-2 px-3`}>
                  {patient.statusBedridden}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs (Matching the 4 input form tabs) */}
          <ul className="nav nav-tabs px-3 pt-2 bg-white border-bottom">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'general' ? 'active fw-bold text-primary' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <i className="bi bi-person-fill me-1"></i>1. ข้อมูลทั่วไป & ที่อยู่
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'diagnosis' ? 'active fw-bold text-primary' : ''}`}
                onClick={() => setActiveTab('diagnosis')}
              >
                <i className="bi bi-heart-pulse-fill me-1"></i>2. การวินิจฉัย & ตึกที่ส่ง
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'assessment' ? 'active fw-bold text-primary' : ''}`}
                onClick={() => setActiveTab('assessment')}
              >
                <i className="bi bi-clipboard2-pulse-fill me-1"></i>3. การประเมินแรกรับก่อนกลับบ้าน (Pre-D/C)
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'procedures' ? 'active fw-bold text-primary' : ''}`}
                onClick={() => setActiveTab('procedures')}
              >
                <i className="bi bi-tools me-1"></i>4. หัตถการ, อุปกรณ์ & แผลกดทับ
              </button>
            </li>
          </ul>

          <div className="modal-body p-4 bg-light-subtle">
            {/* TAB 1: ข้อมูลทั่วไป & ที่อยู่ */}
            {activeTab === 'general' && (
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border shadow-sm">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-card-heading me-1"></i>ข้อมูลระบุตัวตนและประชากรศาสตร์
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="text-muted small d-block">Home Ward Number</label>
                          <span className="fw-bold fs-5 text-primary">{patient.hwNo}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">Hospital Number (HN)</label>
                          <span className="fw-bold fs-5">{patient.hn}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">Admit ครั้งที่</label>
                          <span className="fw-bold">{patient.admitRound || 1}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">วันที่ขึ้นทะเบียน</label>
                          <span className="fw-bold">{patient.regDate || '-'}</span>
                        </div>

                        <div className="col-md-4">
                          <label className="text-muted small d-block">ชื่อ - นามสกุล</label>
                          <span className="fw-bold">{patient.prfx}{patient.firstName} {patient.lastName}</span>
                        </div>
                        <div className="col-md-2">
                          <label className="text-muted small d-block">เพศ</label>
                          <span>{patient.gender}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">วันเดือนปีเกิด</label>
                          <span>{patient.birthDate || '-'}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">อายุ</label>
                          <span className="fw-bold">{patient.age ? `${patient.age} ปี` : '-'}</span>
                        </div>

                        <div className="col-md-6">
                          <label className="text-muted small d-block">เบอร์โทรศัพท์ติดต่อ</label>
                          <span className="fw-bold text-success">{patient.phone || '-'}</span>
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small d-block">เขตบริการ</label>
                          <span className={`badge ${patient.area === 'ในเขต' ? 'bg-primary' : 'bg-secondary'}`}>
                            {patient.area}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border shadow-sm">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-geo-alt me-1"></i>ที่อยู่และภูมิลำเนาผู้ป่วย
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="text-muted small d-block">บ้านเลขที่</label>
                          <span>{patient.houseNo || '-'}</span>
                        </div>
                        <div className="col-md-2">
                          <label className="text-muted small d-block">หมู่ที่</label>
                          <span>{patient.moo || '-'}</span>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small d-block">ตำบล</label>
                          <span>{patient.subdistrict || '-'}</span>
                        </div>
                        <div className="col-md-2">
                          <label className="text-muted small d-block">อำเภอ</label>
                          <span>{patient.district || '-'}</span>
                        </div>
                        <div className="col-md-2">
                          <label className="text-muted small d-block">จังหวัด</label>
                          <span>{patient.province || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: การวินิจฉัย & ตึกที่ส่ง */}
            {activeTab === 'diagnosis' && (
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-heart-pulse me-1"></i>ข้อมูลการวินิจฉัยโรค (Diagnosis)
                    </div>
                    <div className="card-body">
                      <p className="mb-2">
                        <strong className="text-muted d-block small">กลุ่มการดูแลหลัก (Type DX.1):</strong>
                        <span className="badge text-bg-primary fs-6">{patient.typeDx1}</span>
                      </p>
                      <p className="mb-2">
                        <strong className="text-muted d-block small">กลุ่มโรคเฉพาะ (Type DX.2):</strong>
                        <span className="fw-bold">{patient.typeDx2}</span>
                      </p>
                      <p className="mb-0">
                        <strong className="text-muted d-block small">รายละเอียดการวินิจฉัย (Detail):</strong>
                        <span>{patient.dxDetail || '-'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-hospital me-1"></i>ข้อมูลการส่งต่อจากโรงพยาบาล & วันที่สำคัญ
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="text-muted small d-block">PCT ที่ดูแล</label>
                          <span className="fw-bold">{patient.pct || '-'}</span>
                        </div>
                        <div className="col-6">
                          <label className="text-muted small d-block">ตึกที่ส่ง</label>
                          <span className="fw-bold">{patient.wardSender || '-'}</span>
                        </div>
                        <div className="col-6">
                          <label className="text-muted small d-block">วันที่ Admit</label>
                          <span>{patient.admitDate || '-'}</span>
                        </div>
                        <div className="col-6">
                          <label className="text-muted small d-block">วันที่ D/C กลับบ้าน</label>
                          <span className="fw-bold text-success">{patient.dischargeDate || '-'}</span>
                        </div>
                        <div className="col-6">
                          <label className="text-muted small d-block">วันที่ประเมินเยี่ยมตึก</label>
                          <span>{patient.inWardVisitDate || 'ยังไม่ได้เยี่ยมตึก'}</span>
                        </div>
                        <div className="col-6">
                          <label className="text-muted small d-block">วันที่เยี่ยมบ้านครั้งแรก</label>
                          <span>{patient.firstHomeVisitDate || 'ยังไม่ได้เยี่ยมบ้าน'}</span>
                        </div>
                        <div className="col-12 mt-2">
                          <label className="text-muted small d-block">สถานบริการปลายทาง (รพ.สต.)</label>
                          <span className="badge text-bg-info text-dark">{patient.targetPcu || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: การประเมินแรกรับก่อนกลับบ้าน */}
            {activeTab === 'assessment' && (
              <div className="card border shadow-sm">
                <div className="card-header bg-white fw-bold text-primary">
                  <i className="bi bi-clipboard2-check me-1"></i>คะแนนการประเมินแรกรับก่อนจำหน่าย (Pre-Discharge Assessment)
                </div>
                <div className="card-body">
                  <div className="row text-center g-3 mb-4">
                    <div className="col-md-3">
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <small className="text-muted d-block">Barthel ADL Score</small>
                        <span className="display-6 fw-bold text-primary">{patient.preDcAdl ?? '-'}</span>
                        <small className="text-muted d-block">เต็ม 20 คะแนน</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <small className="text-muted d-block">สี Triage</small>
                        <span className={`badge ${getBadgeClass(patient.ptColor)} fs-4 my-2 px-3 py-2`}>
                          {patient.ptColor}
                        </span>
                        <small className="text-muted d-block">
                          {patient.ptColor === 'เขียว' ? 'พึ่งพาตนเองได้' : patient.ptColor === 'เหลือง' ? 'กึ่งพึ่งพา' : 'พึ่งพาเต็มที่'}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <small className="text-muted d-block">PPS Score (%)</small>
                        <span className="display-6 fw-bold text-info">{patient.ppsScore ?? '-'} %</span>
                        <small className="text-muted d-block">Palliative Scale</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <small className="text-muted d-block">สถานะผู้ป่วย</small>
                        <span className={`badge ${patient.statusBedridden === 'ติดเตียง' ? 'bg-danger' : 'bg-success'} fs-4 my-2 px-3 py-2`}>
                          {patient.statusBedridden}
                        </span>
                        <small className="text-muted d-block">สถานะทางกายภาพ</small>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small d-block">สถานะการจำหน่ายจากระบบ Home Ward</label>
                      <span className="badge text-bg-secondary fs-6">{patient.dcStatus || 'กำลังติดตาม'}</span>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small d-block">วันนัดหมายลงเยี่ยมครั้งถัดไป</label>
                      <span className="fw-bold text-primary fs-6">{patient.nextAppointment || '-'}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block">หมายเหตุ / แผนการดูแล (Notes)</label>
                      <div className="p-3 bg-white rounded border text-muted">
                        {patient.notes || 'ไม่มีหมายเหตุเพิ่มเติม'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: หัตถการ, อุปกรณ์ & แผลกดทับ */}
            {activeTab === 'procedures' && (
              <div className="row g-3">
                {/* Medical Procedures & Devices */}
                <div className="col-12">
                  <div className="card border shadow-sm">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-tools me-1"></i>หัตถการและอุปกรณ์การแพทย์ที่บ้าน
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className={`badge ${patient.procedures?.ng ? 'text-bg-primary' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.ng ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          สายให้อาหาร (NG Tube)
                        </span>
                        <span className={`badge ${patient.procedures?.foley ? 'text-bg-primary' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.foley ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          สายสวนปัสสาวะ (Foley)
                        </span>
                        <span className={`badge ${patient.procedures?.tt ? 'text-bg-primary' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.tt ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          ท่อเจาะคอ (Tracheostomy)
                        </span>
                        <span className={`badge ${patient.procedures?.ostomy ? 'text-bg-primary' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.ostomy ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          ทวารเทียม (Ostomy)
                        </span>
                        <span className={`badge ${patient.procedures?.capd ? 'text-bg-info' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.capd ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          ล้างไตทางช่องท้อง (CAPD)
                        </span>
                        <span className={`badge ${patient.procedures?.hd ? 'text-bg-info' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.hd ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          ฟอกเลือด (Hemodialysis)
                        </span>
                        <span className={`badge ${patient.procedures?.homeO2 ? 'text-bg-warning text-dark' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.homeO2 ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          Home Oxygen
                        </span>
                        <span className={`badge ${patient.procedures?.homeVen ? 'text-bg-danger' : 'text-bg-light border text-muted'} p-2`}>
                          <i className={`bi ${patient.procedures?.homeVen ? 'bi-check-circle-fill' : 'bi-dash'} me-1`}></i>
                          Home Ventilator
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pressure Injury */}
                <div className="col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-header bg-white fw-bold text-danger">
                      <i className="bi bi-shield-exclamation me-1"></i>แผลกดทับ (Pressure Injury)
                    </div>
                    <div className="card-body">
                      {patient.pressureInjury?.hasWound ? (
                        <div>
                          <div className="alert alert-danger py-2 mb-3">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>มีแผลกดทับ
                          </div>
                          <p className="mb-1"><strong>ระดับความรุนแรง:</strong> {patient.pressureInjury.stage}</p>
                          <p className="mb-1"><strong>แหล่งที่เกิดแผล:</strong> {patient.pressureInjury.source}</p>
                          <p className="mb-0"><strong>PUSH Tool Score:</strong> {patient.pressureInjury.pushScore} คะแนน</p>
                        </div>
                      ) : (
                        <div className="text-success py-3 text-center">
                          <i className="bi bi-check-circle-fill fs-2 d-block mb-1"></i>
                          ไม่มีแผลกดทับ
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Palliative Care */}
                <div className="col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-header bg-white fw-bold text-secondary">
                      <i className="bi bi-heart-pulse me-1"></i>การดูแลแบบประคับประคอง (Palliative Care)
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                          Advance Care Plan (ACP)
                          <span className={`badge ${patient.palliative?.advanceCarePlan ? 'bg-success' : 'bg-light text-muted border'}`}>
                            {patient.palliative?.advanceCarePlan ? 'มีแผนแล้ว' : 'ไม่มี'}
                          </span>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                          ยาแก้ปวด Morphine (MO)
                          <span className={`badge ${patient.palliative?.morphine ? 'bg-danger' : 'bg-light text-muted border'}`}>
                            {patient.palliative?.morphine ? 'ได้รับยา' : 'ไม่ได้ใช้'}
                          </span>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                          เครื่อง Syringe Driver
                          <span className={`badge ${patient.palliative?.syringeDriver ? 'bg-danger' : 'bg-light text-muted border'}`}>
                            {patient.palliative?.syringeDriver ? 'ใช้งานอยู่' : 'ไม่ได้ใช้'}
                          </span>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                          น้ำมันกัญชาทางการแพทย์
                          <span className={`badge ${patient.palliative?.cannabisOil ? 'bg-success' : 'bg-light text-muted border'}`}>
                            {patient.palliative?.cannabisOil ? 'ได้รับ' : 'ไม่ได้ใช้'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center gap-1"
              onClick={() => {
                onClose()
                onEdit(patient)
              }}
            >
              <i className="bi bi-pencil-square"></i>
              แก้ไขข้อมูลผู้ป่วย
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
