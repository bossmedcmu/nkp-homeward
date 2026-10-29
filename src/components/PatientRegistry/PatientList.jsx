import { useState, useMemo } from 'react'
import { MASTER_DATA } from '../../services/storage'

export default function PatientList({
  patients,
  onAddNew,
  onEdit,
  onDelete,
  onView,
  onExport,
  onImport
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDx1, setFilterDx1] = useState('ALL')
  const [filterColor, setFilterColor] = useState('ALL')
  const [filterArea, setFilterArea] = useState('ALL')
  const [filterBedridden, setFilterBedridden] = useState(false)
  const [filterUnvisited, setFilterUnvisited] = useState(false)

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Search
      const search = searchTerm.toLowerCase().trim()
      const matchSearch =
        !search ||
        (p.hn && p.hn.toLowerCase().includes(search)) ||
        (p.hwNo && p.hwNo.toLowerCase().includes(search)) ||
        (p.firstName && p.firstName.toLowerCase().includes(search)) ||
        (p.lastName && p.lastName.toLowerCase().includes(search))

      // Filters
      const matchDx1 = filterDx1 === 'ALL' || p.typeDx1 === filterDx1
      const matchColor = filterColor === 'ALL' || p.ptColor === filterColor
      const matchArea = filterArea === 'ALL' || p.area === filterArea
      const matchBedridden = !filterBedridden || p.statusBedridden === 'ติดเตียง'
      const matchUnvisited = !filterUnvisited || !p.firstHomeVisitDate

      return matchSearch && matchDx1 && matchColor && matchArea && matchBedridden && matchUnvisited
    })
  }, [patients, searchTerm, filterDx1, filterColor, filterArea, filterBedridden, filterUnvisited])

  const stats = useMemo(() => {
    return {
      total: patients.length,
      imc: patients.filter(p => p.typeDx1 === 'IMC').length,
      ltc: patients.filter(p => p.typeDx1 === 'LTC').length,
      palliative: patients.filter(p => p.typeDx1 === 'Palliative').length,
      bedridden: patients.filter(p => p.statusBedridden === 'ติดเตียง').length,
      unvisitedHome: patients.filter(p => !p.firstHomeVisitDate).length
    }
  }, [patients])

  const getColorBadge = (color) => {
    if (color === 'เขียว') return 'bg-success'
    if (color === 'เหลือง') return 'bg-warning text-dark'
    return 'bg-danger'
  }

  const handleResetFilters = () => {
    setFilterDx1('ALL')
    setFilterColor('ALL')
    setFilterArea('ALL')
    setFilterBedridden(false)
    setFilterUnvisited(false)
    setSearchTerm('')
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h4 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <i className="bi bi-people-fill"></i>
              ทะเบียนผู้ป่วย Home Ward (Patient Registry)
            </h4>
            <small className="text-muted">
              ระบบฐานข้อมูลผู้ป่วย การประเมินแรกรับก่อนจำหน่าย และการจัดกลุ่มการดูแล
            </small>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={onExport} title="ส่งออกข้อมูลสำรอง">
              <i className="bi bi-download me-1"></i>Export JSON
            </button>
            <label className="btn btn-outline-secondary btn-sm mb-0" title="นำเข้าข้อมูลสำรอง">
              <i className="bi bi-upload me-1"></i>Import JSON
              <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={onAddNew}>
              <i className="bi bi-person-plus-fill"></i>
              ลงทะเบียนเคสใหม่
            </button>
          </div>
        </div>

        {/* Clickable Filter Badges (All are interactive buttons) */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${
              filterDx1 === 'ALL' && !filterBedridden && !filterUnvisited 
                ? 'btn-dark' 
                : 'btn-outline-secondary'
            }`}
            onClick={handleResetFilters}
            title="คลิกเพื่อดูผู้ป่วยทั้งหมดและล้างตัวกรอง"
          >
            ผู้ป่วยทั้งหมด: <strong>{stats.total}</strong> ราย
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterDx1 === 'IMC' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilterDx1(prev => prev === 'IMC' ? 'ALL' : 'IMC')}
          >
            IMC: <strong>{stats.imc}</strong> {filterDx1 === 'IMC' && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterDx1 === 'LTC' ? 'btn-info text-white' : 'btn-outline-info text-dark'}`}
            onClick={() => setFilterDx1(prev => prev === 'LTC' ? 'ALL' : 'LTC')}
          >
            LTC: <strong>{stats.ltc}</strong> {filterDx1 === 'LTC' && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterDx1 === 'Palliative' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
            onClick={() => setFilterDx1(prev => prev === 'Palliative' ? 'ALL' : 'Palliative')}
          >
            Palliative: <strong>{stats.palliative}</strong> {filterDx1 === 'Palliative' && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterBedridden ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilterBedridden(prev => !prev)}
          >
            ติดเตียง: <strong>{stats.bedridden}</strong> {filterBedridden && '✓'}
          </button>

          <button
            type="button"
            className={`btn btn-sm py-1 px-3 ${filterUnvisited ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilterUnvisited(prev => !prev)}
          >
            <i className="bi bi-exclamation-triangle-fill me-1"></i>
            ยังไม่ได้เยี่ยมบ้าน: <strong>{stats.unvisitedHome}</strong> {filterUnvisited && '✓'}
          </button>
        </div>
      </div>

      <div className="card-body p-3">
        {/* Search and Filters */}
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหา HN, HW No., หรือ ชื่อ-สกุล..."
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
            <select className="form-select" value={filterDx1} onChange={e => setFilterDx1(e.target.value)}>
              <option value="ALL">กลุ่มดูแล (ทั้งหมด)</option>
              {MASTER_DATA.typeDx1.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterColor} onChange={e => setFilterColor(e.target.value)}>
              <option value="ALL">สี Triage (ทั้งหมด)</option>
              {MASTER_DATA.ptColor.map(c => (
                <option key={c.value} value={c.value}>{c.value}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterArea} onChange={e => setFilterArea(e.target.value)}>
              <option value="ALL">เขตบริการ (ทั้งหมด)</option>
              {MASTER_DATA.area.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-end">
            <span className="text-muted small align-middle">
              พบ {filteredPatients.length} จาก {patients.length} ราย
            </span>
          </div>
        </div>

        {/* Patient Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-bordered mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: '130px' }}>HW No. / HN</th>
                <th>ชื่อ - สกุล</th>
                <th style={{ width: '80px' }}>อายุ</th>
                <th style={{ width: '130px' }}>กลุ่มการดูแล</th>
                <th style={{ width: '90px' }}>Triage</th>
                <th style={{ width: '90px' }}>Pre ADL</th>
                <th>สถานบริการปลายทาง</th>
                <th style={{ width: '140px' }}>เยี่ยมบ้านครั้งแรก</th>
                <th style={{ width: '130px' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                    ไม่พบข้อมูลผู้ป่วยตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-bold text-primary">{p.hwNo}</div>
                      <small className="text-muted">HN: {p.hn}</small>
                    </td>
                    <td>
                      <div className="fw-semibold">
                        {p.prfx}{p.firstName} {p.lastName}
                      </div>
                      <small className="text-muted">
                        {p.area} | โทร: {p.phone || '-'}
                      </small>
                    </td>
                    <td className="text-center">{p.age ? `${p.age} ปี` : '-'}</td>
                    <td>
                      <span className="badge text-bg-secondary me-1">{p.typeDx1}</span>
                      <small className="d-block text-truncate text-muted" style={{ maxWidth: '140px' }}>
                        {p.typeDx2}
                      </small>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${getColorBadge(p.ptColor)}`}>
                        {p.ptColor}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold">{p.preDcAdl ?? '-'}</span>
                      <small className="text-muted">/20</small>
                    </td>
                    <td>
                      <small className="d-block text-truncate" style={{ maxWidth: '160px' }}>
                        {p.targetPcu || '-'}
                      </small>
                    </td>
                    <td className="text-center">
                      {p.firstHomeVisitDate ? (
                        <span className="badge text-bg-success">
                          <i className="bi bi-check me-1"></i>{p.firstHomeVisitDate}
                        </span>
                      ) : (
                        <span className="badge text-bg-danger">
                          <i className="bi bi-clock me-1"></i>ยังไม่ได้เยี่ยม
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          title="ดูเวชระเบียนฉบับสมบูรณ์"
                          onClick={() => onView(p)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          title="แก้ไข"
                          onClick={() => onEdit(p)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="ลบ"
                          onClick={() => onDelete(p.id)}
                        >
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
