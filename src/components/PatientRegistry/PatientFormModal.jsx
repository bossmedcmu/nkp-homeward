import { useState, useEffect } from 'react'
import { MASTER_DATA, calculateAge, calculateColorByAdl } from '../../services/storage'

export default function PatientFormModal({ show, onClose, onSave, patientToEdit }) {
  const [activeFormTab, setActiveFormTab] = useState('general')

  const defaultState = {
    hn: '',
    hwNo: `HW68-${String(Math.floor(Math.random() * 900) + 100)}`,
    admitRound: 1,
    prfx: 'นาย',
    firstName: '',
    lastName: '',
    gender: 'ชาย',
    birthDate: '',
    age: '',
    phone: '',
    area: 'ในเขต',
    houseNo: '',
    moo: '',
    subdistrict: '',
    district: 'เมือง',
    province: 'เชียงใหม่',
    regDate: new Date().toISOString().split('T')[0],
    typeDx1: 'IMC',
    typeDx2: 'Stroke',
    dxDetail: '',
    pct: 'อายุรกรรม',
    wardSender: MASTER_DATA.wards[0],
    admitDate: '',
    dischargeDate: '',
    targetPcu: MASTER_DATA.targetPcu[0],
    statusBedridden: 'ไม่ติดเตียง',
    preDcAdl: 12,
    ppsScore: 70,
    ptColor: 'เขียว',
    inWardVisitDate: '',
    firstHomeVisitDate: '',
    procedures: {
      ng: false,
      foley: false,
      tt: false,
      capd: false,
      hd: false,
      ostomy: false,
      homeO2: false,
      homeVen: false
    },
    pressureInjury: {
      hasWound: false,
      stage: 'stage 1',
      source: 'รพ.',
      pushScore: 0
    },
    palliative: {
      advanceCarePlan: false,
      cannabisOil: false,
      morphine: false,
      syringeDriver: false
    },
    dcStatus: 'กำลังติดตาม',
    nextAppointment: '',
    notes: ''
  }

  const [form, setForm] = useState(defaultState)

  useEffect(() => {
    if (patientToEdit) {
      setForm({ ...defaultState, ...patientToEdit })
    } else {
      setForm({
        ...defaultState,
        hwNo: `HW68-${String(Math.floor(Math.random() * 900) + 100)}`
      })
    }
    setActiveFormTab('general')
  }, [patientToEdit, show])

  if (!show) return null

  const handleBirthDateChange = (val) => {
    const age = calculateAge(val)
    setForm(prev => ({ ...prev, birthDate: val, age }))
  }

  const handleAdlChange = (val) => {
    const adlVal = Number(val)
    const color = calculateColorByAdl(adlVal)
    setForm(prev => ({
      ...prev,
      preDcAdl: adlVal,
      ptColor: color,
      statusBedridden: adlVal <= 4 ? 'ติดเตียง' : 'ไม่ติดเตียง'
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.hn || !form.firstName || !form.lastName) {
      alert('กรุณากรอก HN และ ชื่อ-สกุล ผู้ป่วย')
      return
    }
    onSave(form)
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-person-vcard-fill"></i>
              {patientToEdit ? 'แก้ไขข้อมูลผู้ป่วย Home Ward' : 'ลงทะเบียนผู้ป่วยใหม่ (Home Ward)'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-0">
            {/* Tabs Header */}
            <ul className="nav nav-tabs px-3 pt-2 bg-light border-bottom">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeFormTab === 'general' ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveFormTab('general')}
                >
                  <i className="bi bi-person-fill me-1"></i>1. ข้อมูลทั่วไป & ที่อยู่
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeFormTab === 'diagnosis' ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveFormTab('diagnosis')}
                >
                  <i className="bi bi-heart-pulse-fill me-1"></i>2. การวินิจฉัย & ตึกที่ส่ง
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeFormTab === 'assessment' ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveFormTab('assessment')}
                >
                  <i className="bi bi-clipboard2-pulse-fill me-1"></i>3. ประเมินก่อนกลับบ้าน (Pre-D/C)
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeFormTab === 'procedures' ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveFormTab('procedures')}
                >
                  <i className="bi bi-bandaid-fill me-1"></i>4. หัตถการ, อุปกรณ์ & แผลกดทับ
                </button>
              </li>
            </ul>

            {/* Tab Contents */}
            <form id="patientForm" onSubmit={handleSubmit} className="p-4">
              {/* TAB 1: ข้อมูลทั่วไป */}
              {activeFormTab === 'general' && (
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">HW Number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.hwNo}
                      onChange={e => setForm({ ...form, hwNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">HN <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.hn}
                      onChange={e => setForm({ ...form, hn: e.target.value })}
                      placeholder="เช่น 67001234"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Admit ครั้งที่</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.admitRound}
                      min="1"
                      onChange={e => setForm({ ...form, admitRound: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันที่ขึ้นทะเบียน</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.regDate}
                      onChange={e => setForm({ ...form, regDate: e.target.value })}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-semibold">คำนำหน้า</label>
                    <select
                      className="form-select"
                      value={form.prfx}
                      onChange={e => setForm({ ...form, prfx: e.target.value })}
                    >
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="น.ส.">น.ส.</option>
                      <option value="ด.ช.">ด.ช.</option>
                      <option value="ด.ญ.">ด.ญ.</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">ชื่อ <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">นามสกุล <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">เพศ</label>
                    <select
                      className="form-select"
                      value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                    >
                      {MASTER_DATA.gender.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันเดือนปีเกิด</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.birthDate}
                      onChange={e => handleBirthDateChange(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">อายุ (ปี)</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      value={form.age}
                      readOnly
                      placeholder="ออโต้"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="เช่น 081-234-5678"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">เขตบริการ</label>
                    <select
                      className="form-select"
                      value={form.area}
                      onChange={e => setForm({ ...form, area: e.target.value })}
                    >
                      {MASTER_DATA.area.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12"><hr className="my-1" /><h6 className="text-primary">ที่อยู่ผู้ป่วย</h6></div>

                  <div className="col-md-3">
                    <label className="form-label">บ้านเลขที่</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.houseNo}
                      onChange={e => setForm({ ...form, houseNo: e.target.value })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">หมู่ที่</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.moo}
                      onChange={e => setForm({ ...form, moo: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">ตำบล</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.subdistrict}
                      onChange={e => setForm({ ...form, subdistrict: e.target.value })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">อำเภอ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.district}
                      onChange={e => setForm({ ...form, district: e.target.value })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">จังหวัด</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.province}
                      onChange={e => setForm({ ...form, province: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: การวินิจฉัย & ตึกที่ส่ง */}
              {activeFormTab === 'diagnosis' && (
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Type DX.1 (กลุ่มการดูแล)</label>
                    <select
                      className="form-select"
                      value={form.typeDx1}
                      onChange={e => setForm({ ...form, typeDx1: e.target.value })}
                    >
                      {MASTER_DATA.typeDx1.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Type DX.2 (กลุ่มโรคหลัก)</label>
                    <select
                      className="form-select"
                      value={form.typeDx2}
                      onChange={e => setForm({ ...form, typeDx2: e.target.value })}
                    >
                      {MASTER_DATA.typeDx2.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">สถานบริการปลายทาง (รพ.สต.)</label>
                    <select
                      className="form-select"
                      value={form.targetPcu}
                      onChange={e => setForm({ ...form, targetPcu: e.target.value })}
                    >
                      {MASTER_DATA.targetPcu.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">รายละเอียดการวินิจฉัย (Diagnosis Detail)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={form.dxDetail}
                      onChange={e => setForm({ ...form, dxDetail: e.target.value })}
                      placeholder="เช่น Ischemic Stroke, CA Breast, COPD with acute exacerbation"
                    ></textarea>
                  </div>

                  <div className="col-12"><hr className="my-1" /><h6 className="text-primary">ข้อมูลการส่งต่อจากโรงพยาบาล</h6></div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">PCT</label>
                    <select
                      className="form-select"
                      value={form.pct}
                      onChange={e => setForm({ ...form, pct: e.target.value })}
                    >
                      {MASTER_DATA.pct.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">ตึกที่ส่ง</label>
                    <select
                      className="form-select"
                      value={form.wardSender}
                      onChange={e => setForm({ ...form, wardSender: e.target.value })}
                    >
                      {MASTER_DATA.wards.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันที่ Admit</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.admitDate}
                      onChange={e => setForm({ ...form, admitDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันที่ D/C กลับบ้าน</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.dischargeDate}
                      onChange={e => setForm({ ...form, dischargeDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันที่ประเมินเยี่ยมตึก</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.inWardVisitDate}
                      onChange={e => setForm({ ...form, inWardVisitDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">วันที่เยี่ยมบ้านครั้งแรก</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.firstHomeVisitDate}
                      onChange={e => setForm({ ...form, firstHomeVisitDate: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: การประเมินก่อนกลับบ้าน */}
              {activeFormTab === 'assessment' && (
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">คะแนน Barthel ADL ก่อน D/C (0-20)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      className="form-control form-control-lg fw-bold"
                      value={form.preDcAdl}
                      onChange={e => handleAdlChange(e.target.value)}
                    />
                    <small className="text-muted">คำนวณสี Triage และสถานะติดเตียงให้อัตโนมัติ</small>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">สี Triage (คำนวณตาม ADL)</label>
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        className={`form-control fw-bold ${
                          form.ptColor === 'เขียว' ? 'text-success' : form.ptColor === 'เหลือง' ? 'text-warning' : 'text-danger'
                        }`}
                        value={form.ptColor}
                        readOnly
                      />
                      <span className="input-group-text">
                        <i className={`bi bi-circle-fill ${
                          form.ptColor === 'เขียว' ? 'text-success' : form.ptColor === 'เหลือง' ? 'text-warning' : 'text-danger'
                        }`}></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">สถานะติดเตียง</label>
                    <select
                      className="form-select form-select-lg"
                      value={form.statusBedridden}
                      onChange={e => setForm({ ...form, statusBedridden: e.target.value })}
                    >
                      {MASTER_DATA.bedridden.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">PPS Score (Palliative Scale %)</label>
                    <input
                      type="number"
                      step="10"
                      min="10"
                      max="100"
                      className="form-control"
                      value={form.ppsScore}
                      onChange={e => setForm({ ...form, ppsScore: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">สถานะการจำหน่าย</label>
                    <select
                      className="form-select"
                      value={form.dcStatus}
                      onChange={e => setForm({ ...form, dcStatus: e.target.value })}
                    >
                      <option value="กำลังติดตาม">กำลังติดตาม</option>
                      {MASTER_DATA.dcTypes.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">นัดเยี่ยมครั้งต่อไป</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.nextAppointment}
                      onChange={e => setForm({ ...form, nextAppointment: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">หมายเหตุ / แผนการดูแล</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder="ข้อสังเกต ปัญหาที่ต้องติดตาม หรือการประสานงานญาติ"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 4: หัตถการ & อุปกรณ์ */}
              {activeFormTab === 'procedures' && (
                <div className="row g-3">
                  <div className="col-12">
                    <h6 className="text-primary fw-bold mb-2">
                      <i className="bi bi-tools me-1"></i>หัตถการ & สายสวนที่ค้างไว้
                    </h6>
                    <div className="row g-2 p-2 bg-light rounded border">
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="ngCheck"
                            checked={form.procedures.ng}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, ng: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="ngCheck">สายให้อาหาร (NG Tube)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="foleyCheck"
                            checked={form.procedures.foley}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, foley: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="foleyCheck">สายสวนปัสสาวะ (Foley)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="ttCheck"
                            checked={form.procedures.tt}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, tt: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="ttCheck">ท่อเจาะคอ (Tracheostomy)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="ostomyCheck"
                            checked={form.procedures.ostomy}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, ostomy: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="ostomyCheck">ทวารเทียม (Colostomy/Ostomy)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="capdCheck"
                            checked={form.procedures.capd}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, capd: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="capdCheck">ล้างไตทางช่องท้อง (CAPD)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="hdCheck"
                            checked={form.procedures.hd}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, hd: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="hdCheck">ฟอกเลือด (Hemodialysis)</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="o2Check"
                            checked={form.procedures.homeO2}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, homeO2: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="o2Check">Home Oxygen</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="venCheck"
                            checked={form.procedures.homeVen}
                            onChange={e => setForm({
                              ...form,
                              procedures: { ...form.procedures, homeVen: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="venCheck">Home Ventilator</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12"><hr className="my-2" /></div>

                  {/* Pressure Injury */}
                  <div className="col-12">
                    <h6 className="text-danger fw-bold mb-2">
                      <i className="bi bi-shield-exclamation me-1"></i>แผลกดทับ (Pressure Injury)
                    </h6>
                    <div className="row g-2 p-2 bg-light rounded border">
                      <div className="col-md-3">
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="woundCheck"
                            checked={form.pressureInjury.hasWound}
                            onChange={e => setForm({
                              ...form,
                              pressureInjury: { ...form.pressureInjury, hasWound: e.target.checked }
                            })}
                          />
                          <label className="form-check-label fw-bold" htmlFor="woundCheck">มีแผลกดทับ</label>
                        </div>
                      </div>
                      {form.pressureInjury.hasWound && (
                        <>
                          <div className="col-md-3">
                            <label className="form-label">ระดับความรุนแรง (Stage)</label>
                            <select
                              className="form-select"
                              value={form.pressureInjury.stage}
                              onChange={e => setForm({
                                ...form,
                                pressureInjury: { ...form.pressureInjury, stage: e.target.value }
                              })}
                            >
                              {MASTER_DATA.woundStage.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">แหล่งเกิดแผล</label>
                            <select
                              className="form-select"
                              value={form.pressureInjury.source}
                              onChange={e => setForm({
                                ...form,
                                pressureInjury: { ...form.pressureInjury, source: e.target.value }
                              })}
                            >
                              {MASTER_DATA.woundSource.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">PUSH Tool Score</label>
                            <input
                              type="number"
                              className="form-control"
                              value={form.pressureInjury.pushScore}
                              onChange={e => setForm({
                                ...form,
                                pressureInjury: { ...form.pressureInjury, pushScore: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-12"><hr className="my-2" /></div>

                  {/* Palliative Care */}
                  <div className="col-12">
                    <h6 className="text-secondary fw-bold mb-2">
                      <i className="bi bi-heart-pulse me-1"></i>การดูแลแบบประคับประคอง (Palliative Care)
                    </h6>
                    <div className="row g-2 p-2 bg-light rounded border">
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="acpCheck"
                            checked={form.palliative.advanceCarePlan}
                            onChange={e => setForm({
                              ...form,
                              palliative: { ...form.palliative, advanceCarePlan: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="acpCheck">Advance Care Plan</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="morphineCheck"
                            checked={form.palliative.morphine}
                            onChange={e => setForm({
                              ...form,
                              palliative: { ...form.palliative, morphine: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="morphineCheck">ยา Morphine</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="syringeCheck"
                            checked={form.palliative.syringeDriver}
                            onChange={e => setForm({
                              ...form,
                              palliative: { ...form.palliative, syringeDriver: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="syringeCheck">เครื่อง Syringe Driver</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="cannabisCheck"
                            checked={form.palliative.cannabisOil}
                            onChange={e => setForm({
                              ...form,
                              palliative: { ...form.palliative, cannabisOil: e.target.checked }
                            })}
                          />
                          <label className="form-check-label" htmlFor="cannabisCheck">น้ำมันกัญชาทางการแพทย์</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" form="patientForm" className="btn btn-primary d-flex align-items-center gap-1">
              <i className="bi bi-save-fill"></i>
              บันทึกข้อมูลผู้ป่วย
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
