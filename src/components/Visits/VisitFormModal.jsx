import { useState, useEffect, useMemo } from 'react'
import { MASTER_DATA, calculateColorByAdl } from '../../services/storage'

export default function VisitFormModal({ show, onClose, onSave, visitToEdit, patients }) {
  const [patientSearch, setPatientSearch] = useState('')

  const defaultState = {
    hwNo: patients[0]?.hwNo || '',
    admitRound: 1,
    patientName: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitType: 'บ้าน',
    adl: 10,
    adlColor: 'เหลือง',
    ppsScore: 60,
    ptType: '2.0',
    bradenScore: 16,
    pushScore: 0,
    catScore: 0,
    painScore: 0,
    proceduresDone: {
      ng: false,
      foley: false,
      tt: false,
      woundDressing: false,
      bloodDraw: false
    },
    complications: {
      jointStiffness: false,
      pneumonia: false,
      falling: false,
      uti: false
    },
    nextAppointmentDate: '',
    nextTelemedDate: '',
    notes: ''
  }

  const [form, setForm] = useState(defaultState)

  useEffect(() => {
    if (visitToEdit) {
      setForm({ ...defaultState, ...visitToEdit })
      setPatientSearch('')
    } else {
      const selectedP = patients[0]
      setForm({
        ...defaultState,
        hwNo: selectedP?.hwNo || '',
        patientName: selectedP ? `${selectedP.prfx}${selectedP.firstName} ${selectedP.lastName}` : '',
        adl: selectedP?.preDcAdl ?? 10,
        adlColor: selectedP?.ptColor || 'เหลือง'
      })
      setPatientSearch('')
    }
  }, [visitToEdit, show, patients])

  // Filter patients by search term (HN, Name, HW No)
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients
    const s = patientSearch.toLowerCase().trim()
    return patients.filter(p =>
      (p.hn && p.hn.toLowerCase().includes(s)) ||
      (p.hwNo && p.hwNo.toLowerCase().includes(s)) ||
      (p.firstName && p.firstName.toLowerCase().includes(s)) ||
      (p.lastName && p.lastName.toLowerCase().includes(s))
    )
  }, [patients, patientSearch])

  if (!show) return null

  const handlePatientSelect = (hwNo) => {
    const p = patients.find(item => item.hwNo === hwNo)
    if (p) {
      setForm(prev => ({
        ...prev,
        hwNo: p.hwNo,
        admitRound: p.admitRound || 1,
        patientName: `${p.prfx}${p.firstName} ${p.lastName}`,
        adl: p.preDcAdl ?? prev.adl,
        adlColor: p.ptColor || prev.adlColor
      }))
    }
  }

  const handleAdlChange = (val) => {
    const num = Number(val)
    const color = calculateColorByAdl(num)
    let ptType = '2.0'
    if (num <= 4) ptType = '1.0'
    else if (num >= 12) ptType = '3.0'

    setForm(prev => ({
      ...prev,
      adl: num,
      adlColor: color,
      ptType,
      ppsScore: Math.min(100, Math.max(10, num * 5 + 10))
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.hwNo) {
      alert('กรุณาเลือกผู้ป่วย')
      return
    }
    onSave(form)
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content shadow-lg">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill"></i>
              <span>{visitToEdit ? 'แก้ไขบันทึกการเยี่ยม' : 'บันทึกการเยี่ยมใหม่ (Home Visit / Telemed)'}</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Modal Body with guaranteed smooth scrolling */}
          <div className="modal-body p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            <form id="visitForm" onSubmit={handleSubmit}>
              {/* Patient Search & Selection */}
              <div className="card mb-3 border shadow-sm">
                <div className="card-header bg-white fw-bold text-primary d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-person-search me-1"></i>เลือกผู้ป่วย (ค้นหาจาก HN, ชื่อ, สกุล, HW No.)</span>
                  {form.hwNo && (
                    <span className="badge text-bg-success">
                      ผู้ป่วยที่เลือก: {form.hwNo} - {form.patientName}
                    </span>
                  )}
                </div>
                <div className="card-body">
                  <div className="row g-2 align-items-center mb-2">
                    <div className="col-md-5">
                      <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="พิมพ์ค้นหา HN หรือ ชื่อ-สกุล..."
                          value={patientSearch}
                          onChange={e => setPatientSearch(e.target.value)}
                        />
                        {patientSearch && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setPatientSearch('')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="col-md-7">
                      <select
                        className="form-select fw-semibold text-primary"
                        value={form.hwNo}
                        onChange={e => handlePatientSelect(e.target.value)}
                        required
                      >
                        <option value="">-- เลือกผู้ป่วย ({filteredPatients.length} รายการ) --</option>
                        {filteredPatients.map(p => (
                          <option key={p.id} value={p.hwNo}>
                            {p.hwNo} | {p.prfx}{p.firstName} {p.lastName} (HN: {p.hn}) [{p.typeDx1}]
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 pt-2 border-top">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">วันที่เยี่ยม <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.visitDate}
                        onChange={e => setForm({ ...form, visitDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">ประเภทการเยี่ยม <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={form.visitType}
                        onChange={e => setForm({ ...form, visitType: e.target.value })}
                      >
                        {MASTER_DATA.visitTypes.map(vt => (
                          <option key={vt} value={vt}>{vt === 'บ้าน' ? 'เยี่ยมบ้าน (Home Visit)' : 'Telemedicine'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Scales */}
              <div className="card mb-3 border shadow-sm">
                <div className="card-header bg-white fw-bold text-primary">
                  <i className="bi bi-clipboard2-pulse me-1"></i>แบบประเมินทางคลินิก (Clinical Assessments)
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Barthel ADL (0-20)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        className="form-control form-control-lg fw-bold"
                        value={form.adl}
                        onChange={e => handleAdlChange(e.target.value)}
                        required
                      />
                      <small className="text-muted d-block mt-1">
                        Triage: <strong className={form.adlColor === 'เขียว' ? 'text-success' : form.adlColor === 'เหลือง' ? 'text-warning' : 'text-danger'}>{form.adlColor}</strong>
                      </small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">PPS Score (%)</label>
                      <input
                        type="number"
                        step="10"
                        min="10"
                        max="100"
                        className="form-control form-control-lg"
                        value={form.ppsScore}
                        onChange={e => setForm({ ...form, ppsScore: Number(e.target.value) })}
                      />
                      <small className="text-muted d-block mt-1">Palliative Performance</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">ประเภท Pt. (1.0 - 4.0)</label>
                      <select
                        className="form-select form-select-lg"
                        value={form.ptType}
                        onChange={e => setForm({ ...form, ptType: e.target.value })}
                      >
                        <option value="1.0">1.0 (ติดเตียง/พึ่งพามาก)</option>
                        <option value="2.0">2.0 (กึ่งติดเตียง)</option>
                        <option value="3.0">3.0 (ติดบ้าน/เดินได้)</option>
                        <option value="4.0">4.0 (ติดสังคม)</option>
                        <option value="DIC">DIC (จำหน่ายแล้ว)</option>
                      </select>
                      <small className="text-muted d-block mt-1">เกณฑ์การจัดประเภทผู้ป่วย</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Pain Score (0-10)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        className="form-control form-control-lg"
                        value={form.painScore}
                        onChange={e => setForm({ ...form, painScore: Number(e.target.value) })}
                      />
                      <small className="text-muted d-block mt-1">ระดับความปวด</small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">Braden Scale (ความเสี่ยงแผลกดทับ: 6-23)</label>
                      <input
                        type="number"
                        min="6"
                        max="23"
                        className="form-control"
                        value={form.bradenScore}
                        onChange={e => setForm({ ...form, bradenScore: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small">PUSH 2 (คะแนนประเมินแผลกดทับ: 0-17)</label>
                      <input
                        type="number"
                        min="0"
                        max="17"
                        className="form-control"
                        value={form.pushScore}
                        onChange={e => setForm({ ...form, pushScore: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small">CAT Score (COPD Assessment: 0-40)</label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        className="form-control"
                        value={form.catScore}
                        onChange={e => setForm({ ...form, catScore: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Procedures & Complications */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="card h-100 border shadow-sm">
                    <div className="card-header bg-white fw-bold text-primary">
                      <i className="bi bi-tools me-1"></i>หัตถการที่ให้การพยาบาล
                    </div>
                    <div className="card-body">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="procNg"
                          checked={form.proceduresDone.ng}
                          onChange={e => setForm({
                            ...form,
                            proceduresDone: { ...form.proceduresDone, ng: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="procNg">เปลี่ยนสายให้อาหาร (NG Tube)</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="procFoley"
                          checked={form.proceduresDone.foley}
                          onChange={e => setForm({
                            ...form,
                            proceduresDone: { ...form.proceduresDone, foley: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="procFoley">เปลี่ยนสายสวนปัสสาวะ (Foley)</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="procTT"
                          checked={form.proceduresDone.tt}
                          onChange={e => setForm({
                            ...form,
                            proceduresDone: { ...form.proceduresDone, tt: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="procTT">ดูแลท่อเจาะคอ (Tracheostomy)</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="procWound"
                          checked={form.proceduresDone.woundDressing}
                          onChange={e => setForm({
                            ...form,
                            proceduresDone: { ...form.proceduresDone, woundDressing: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="procWound">ทำแผลกดทับ / แผลผ่าตัด</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="procBlood"
                          checked={form.proceduresDone.bloodDraw}
                          onChange={e => setForm({
                            ...form,
                            proceduresDone: { ...form.proceduresDone, bloodDraw: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="procBlood">เจาะเลือดตรวจ Lab ที่บ้าน</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100 border shadow-sm">
                    <div className="card-header bg-white fw-bold text-danger">
                      <i className="bi bi-shield-exclamation me-1"></i>ภาวะแทรกซ้อนที่ตรวจพบ
                    </div>
                    <div className="card-body">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="compJoint"
                          checked={form.complications.jointStiffness}
                          onChange={e => setForm({
                            ...form,
                            complications: { ...form.complications, jointStiffness: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="compJoint">ข้อติด (Joint Stiffness)</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="compPneumo"
                          checked={form.complications.pneumonia}
                          onChange={e => setForm({
                            ...form,
                            complications: { ...form.complications, pneumonia: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="compPneumo">ปอดอักเสบ (Pneumonia)</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="compFall"
                          checked={form.complications.falling}
                          onChange={e => setForm({
                            ...form,
                            complications: { ...form.complications, falling: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="compFall">หกล้ม (Falling)</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="compUti"
                          checked={form.complications.uti}
                          onChange={e => setForm({
                            ...form,
                            complications: { ...form.complications, uti: e.target.checked }
                          })}
                        />
                        <label className="form-check-label" htmlFor="compUti">ติดเชื้อทางเดินปัสสาวะ (UTI)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next appointments and notes */}
              <div className="card border shadow-sm mb-2">
                <div className="card-header bg-white fw-bold text-primary">
                  <i className="bi bi-calendar-check me-1"></i>แผนการดูแลต่อนัดหมาย & บันทึกทางการพยาบาล
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">วันนัดเยี่ยมบ้านครั้งต่อไป</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.nextAppointmentDate}
                        onChange={e => setForm({ ...form, nextAppointmentDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">วันนัด Telemed ครั้งต่อไป</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.nextTelemedDate}
                        onChange={e => setForm({ ...form, nextTelemedDate: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">บันทึกข้อสังเกตทางการพยาบาล (Nursing Notes)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        placeholder="บันทึกสภาพทั่วไป ปัญหาที่พบ และคำแนะนำแก่ญาติ"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" form="visitForm" className="btn btn-primary d-flex align-items-center gap-1 shadow-sm">
              <i className="bi bi-save-fill"></i>
              บันทึกการเยี่ยม
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
