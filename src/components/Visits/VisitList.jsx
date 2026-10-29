import { useState, useMemo } from 'react'

export default function VisitList({
  visits,
  patients,
  onAddNewVisit,
  onEditVisit,
  onDeleteVisit
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterColor, setFilterColor] = useState('ALL')
  const [filterDate, setFilterDate] = useState('')
  const [filterProcedures, setFilterProcedures] = useState(false)
  const [filterComplications, setFilterComplications] = useState(false)

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const search = searchTerm.toLowerCase().trim()
      const matchSearch =
        !search ||
        (v.hwNo && v.hwNo.toLowerCase().includes(search)) ||
        (v.patientName && v.patientName.toLowerCase().includes(search))

      const matchType = filterType === 'ALL' || v.visitType === filterType
      const matchColor = filterColor === 'ALL' || v.adlColor === filterColor
      const matchDate = !filterDate || v.visitDate === filterDate

      const matchProcedures = !filterProcedures || (
        v.proceduresDone && Object.values(v.proceduresDone).some(val => val)
      )

      const matchComplications = !filterComplications || (
        v.complications && Object.values(v.complications).some(val => val)
      )

      return matchSearch && matchType && matchColor && matchDate && matchProcedures && matchComplications
    }).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
  }, [visits, searchTerm, filterType, filterColor, filterDate, filterProcedures, filterComplications])

  const stats = useMemo(() => {
    const homeCount = visits.filter(v => v.visitType === 'บ้าน').length
    const teleCount = visits.filter(v => v.visitType === 'Tele').length
    const complicationCount = visits.filter(v => 
      v.complications && Object.values(v.complications).some(val => val)
    ).length
    const procedureCount = visits.filter(v =>
      v.proceduresDone && Object.values(v.proceduresDone).some(val => val)
    ).length

    return { total: visits.length, homeCount, teleCount, complicationCount, procedureCount }
  }, [visits])

  const getColorBadge = (color) => {
    if (color === 'เขียว') return 'bg-success'
    if (color === 'เหลือง') return 'bg-warning text-dark'
    return 'bg-danger'
  }

  const handleResetFilters = () => {
    setFilterType('ALL')
    setFilterColor('ALL')
    setFilterDate('')
    setFilterProcedures(false)
    setFilterComplications(false)
    setSearchTerm('')
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h4 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill"></i>
              บันทึกการติดตามเยี่ยม (Home Visit & Telemedicine Log)
            </h4>
            <small className="text-muted">
              บันทึกการลงพื้นที่เยี่ยมบ้าน การประเมินคะแนน ADL/PPS/Braden และการทำหัตถการทางการพยาบาล
            </small>
          </div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={onAddNewVisit}>
            <i className="bi bi-plus-circle-fill"></i>
            บันทึกการเยี่ยมใหม่
          </button>
        </div>

        {/* Clickable Filter Badges */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${
              filterType === 'ALL' && !filterProcedures && !filterComplications && !filterDate 
                ? 'btn-dark' 
                : 'btn-outline-secondary'
            }`}
            onClick={handleResetFilters}
            title="คลิกเพื่อดูบันทึกทั้งหมดและล้างตัวกรอง"
          >
            บันทึกทั้งหมด: <strong>{stats.total}</strong> ครั้ง
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterType === 'บ้าน' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilterType(prev => prev === 'บ้าน' ? 'ALL' : 'บ้าน')}
          >
            <i className="bi bi-house-door me-1"></i>
            เยี่ยมบ้าน: <strong>{stats.homeCount}</strong> {filterType === 'บ้าน' && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterType === 'Tele' ? 'btn-info text-dark' : 'btn-outline-info text-dark'}`}
            onClick={() => setFilterType(prev => prev === 'Tele' ? 'ALL' : 'Tele')}
          >
            <i className="bi bi-camera-video me-1"></i>
            Telemed: <strong>{stats.teleCount}</strong> {filterType === 'Tele' && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterProcedures ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilterProcedures(prev => !prev)}
          >
            <i className="bi bi-tools me-1"></i>
            มีการทำหัตถการ: <strong>{stats.procedureCount}</strong> {filterProcedures && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterComplications ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilterComplications(prev => !prev)}
          >
            <i className="bi bi-exclamation-triangle me-1"></i>
            พบภาวะแทรกซ้อน: <strong>{stats.complicationCount}</strong> {filterComplications && '✓'}
          </button>
        </div>
      </div>

      <div className="card-body p-3">
        {/* Search & Filters */}
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหา HW No., หรือ ชื่อผู้ป่วย..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="ALL">ประเภท (ทั้งหมด)</option>
              <option value="บ้าน">เยี่ยมบ้าน</option>
              <option value="Tele">Telemedicine</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterColor} onChange={e => setFilterColor(e.target.value)}>
              <option value="ALL">สี Triage (ทั้งหมด)</option>
              <option value="เขียว">เขียว</option>
              <option value="เหลือง">เหลือง</option>
              <option value="แดง">แดง</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              title="กรองตามวันที่เยี่ยม"
            />
          </div>
          <div className="col-md-2 text-end">
            {filterDate && (
              <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setFilterDate('')}>
                ล้างวันที่
              </button>
            )}
            <span className="text-muted small align-middle">
              พบ {filteredVisits.length} รายการ
            </span>
          </div>
        </div>

        {/* Visits Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-bordered mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: '110px' }}>วันที่เยี่ยม</th>
                <th style={{ width: '90px' }}>ประเภท</th>
                <th style={{ width: '130px' }}>HW No.</th>
                <th>ชื่อผู้ป่วย</th>
                <th style={{ width: '100px' }}>Barthel ADL</th>
                <th style={{ width: '90px' }}>PPS %</th>
                <th>หัตถการที่ให้</th>
                <th>ภาวะแทรกซ้อน</th>
                <th style={{ width: '120px' }}>นัดครั้งถัดไป</th>
                <th style={{ width: '90px' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                    ไม่พบบันทึกการเยี่ยมตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredVisits.map(v => (
                  <tr key={v.id}>
                    <td className="text-center fw-semibold text-nowrap">{v.visitDate}</td>
                    <td className="text-center">
                      <span className={`badge ${v.visitType === 'บ้าน' ? 'text-bg-primary' : 'text-bg-info text-dark'}`}>
                        {v.visitType === 'บ้าน' ? 'เยี่ยมบ้าน' : 'Telemed'}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-primary">{v.hwNo}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{v.patientName}</div>
                      {v.notes && <small className="text-muted text-truncate d-block" style={{ maxWidth: '220px' }}>{v.notes}</small>}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${getColorBadge(v.adlColor)} me-1`}>
                        {v.adl} / 20
                      </span>
                    </td>
                    <td className="text-center">{v.ppsScore ? `${v.ppsScore}%` : '-'}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {v.proceduresDone?.ng && <span className="badge text-bg-light border text-dark">NG</span>}
                        {v.proceduresDone?.foley && <span className="badge text-bg-light border text-dark">Foley</span>}
                        {v.proceduresDone?.tt && <span className="badge text-bg-light border text-dark">TT</span>}
                        {v.proceduresDone?.woundDressing && <span className="badge text-bg-warning text-dark">ทำแผล</span>}
                        {v.proceduresDone?.bloodDraw && <span className="badge text-bg-info">เจาะเลือด</span>}
                        {!Object.values(v.proceduresDone || {}).some(x => x) && (
                          <span className="text-muted small">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {v.complications?.jointStiffness && <span className="badge text-bg-danger">ข้อติด</span>}
                        {v.complications?.pneumonia && <span className="badge text-bg-danger">Pneumonia</span>}
                        {v.complications?.falling && <span className="badge text-bg-danger">ล้ม</span>}
                        {v.complications?.uti && <span className="badge text-bg-danger">UTI</span>}
                        {!Object.values(v.complications || {}).some(x => x) && (
                          <span className="text-success small"><i className="bi bi-check-circle"></i> ปกติ</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      {v.nextAppointmentDate ? (
                        <span className="badge text-bg-light border text-dark">
                          {v.nextAppointmentDate}
                        </span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" title="แก้ไข" onClick={() => onEditVisit(v)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger" title="ลบ" onClick={() => onDeleteVisit(v.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
