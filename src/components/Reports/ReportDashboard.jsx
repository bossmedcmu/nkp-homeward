import { useState, useMemo } from 'react'

export default function ReportDashboard({ patients, visits }) {
  const [activeTab, setActiveTab] = useState('performanceTable')

  // Date range filter for reports
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')
  const [selectedDisease, setSelectedDisease] = useState('ESRD')

  // Quick preset helper
  const handlePreset = (type) => {
    if (type === 'all') {
      setStartDate('2026-01-01')
      setEndDate('2026-12-31')
    } else if (type === 'q1') {
      setStartDate('2026-01-01')
      setEndDate('2026-03-31')
    } else if (type === 'q2') {
      setStartDate('2026-04-01')
      setEndDate('2026-06-30')
    } else if (type === 'q3') {
      setStartDate('2026-07-01')
      setEndDate('2026-09-30')
    } else if (type === 'q4') {
      setStartDate('2026-10-01')
      setEndDate('2026-12-31')
    }
  }

  // Filter visits within date range
  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      if (!v.visitDate) return false
      if (startDate && v.visitDate < startDate) return false
      if (endDate && v.visitDate > endDate) return false
      return true
    })
  }, [visits, startDate, endDate])

  // Map of patients with their visits in range
  const patientVisitMap = useMemo(() => {
    const map = new Map()
    filteredVisits.forEach(v => {
      if (!map.has(v.hwNo)) {
        map.set(v.hwNo, [])
      }
      map.get(v.hwNo).push(v)
    })
    return map
  }, [filteredVisits])

  // Helper to count distinct patients (คน) and total visits (ครั้ง) in date range
  const countMetric = (patientPredicate, visitPredicate) => {
    let personCount = 0
    let visitCount = 0

    patientVisitMap.forEach((vList, hwNo) => {
      const p = patients.find(item => item.hwNo === hwNo)
      if (p && patientPredicate(p)) {
        const matchingVisits = visitPredicate ? vList.filter(visitPredicate) : vList
        if (matchingVisits.length > 0) {
          personCount++
          visitCount += matchingVisits.length
        }
      }
    })

    return { personCount, visitCount }
  }

  // Exact metrics as defined in Google Sheet 'ผลการปฏิบัติงาน'
  const reportMetrics = useMemo(() => {
    // 1. Total home ward patients active in range
    const activePatientsInRange = patients.filter(p => {
      const reg = p.regDate || p.admitDate || ''
      const dc = p.dischargeDate || ''
      if (endDate && reg && reg > endDate) return false
      if (startDate && dc && p.dcStatus === 'ทุเลา' && dc < startDate) return false
      return true
    }).length

    // 2. Planning D/C in range
    const dcPlanningInRange = patients.filter(p => {
      const reg = p.regDate || p.admitDate || ''
      return (!startDate || reg >= startDate) && (!endDate || reg <= endDate)
    }).length

    // 3. In-ward visited in range
    const inWardVisitedInRange = patients.filter(p => {
      const d = p.inWardVisitDate || ''
      return d && (!startDate || d >= startDate) && (!endDate || d <= endDate)
    }).length

    // 4. Home services total
    const totalHomeService = {
      personCount: patientVisitMap.size,
      visitCount: filteredVisits.length
    }

    // Type DX2
    const tbi = countMetric(p => p.typeDx2 === 'TBI', v => true)
    const stroke = countMetric(p => p.typeDx2 === 'Stroke', v => true)
    const sci = countMetric(p => p.typeDx2 === 'SCI', v => true)
    const hip = countMetric(p => p.typeDx2 === 'Fx around hip', v => true)
    const ca = countMetric(p => p.typeDx2 === 'CA', v => true)
    const nonCa = countMetric(p => p.typeDx2 && !['CA', 'TBI', 'Stroke', 'SCI', 'Fx around hip'].includes(p.typeDx2), v => true)

    // ESRD
    const esrdTotal = countMetric(p => p.typeDx2 === 'ESRD' || p.procedures?.capd || p.procedures?.hd, v => true)
    const capd = countMetric(p => p.procedures?.capd, v => true)
    const hd = countMetric(p => p.procedures?.hd, v => true)
    const renalPalliative = countMetric(p => (p.typeDx2 === 'ESRD' || p.procedures?.capd || p.procedures?.hd) && p.typeDx1 === 'Palliative', v => true)

    // COPD
    const copd = countMetric(p => p.typeDx2 === 'COPD' || p.procedures?.homeO2, v => true)

    // ADL Levels
    const adlGreen = countMetric(p => true, v => v.adlColor === 'เขียว')
    const adlYellow = countMetric(p => true, v => v.adlColor === 'เหลือง')
    const adlRed = countMetric(p => true, v => v.adlColor === 'แดง')
    const adlBlack = countMetric(p => true, v => v.adlColor === 'ดำ' || v.adl === 'D')

    // Elderly >= 60
    const elderlyTotal = countMetric(p => Number(p.age) >= 60, v => true)
    const elderlyGreen = countMetric(p => Number(p.age) >= 60, v => v.adlColor === 'เขียว')
    const elderlyYellow = countMetric(p => Number(p.age) >= 60, v => v.adlColor === 'เหลือง')
    const elderlyRed = countMetric(p => Number(p.age) >= 60, v => v.adlColor === 'แดง')
    const elderlyBlack = countMetric(p => Number(p.age) >= 60, v => v.adlColor === 'ดำ' || v.adl === 'D')

    // Specific groups
    const dependentDisabled = countMetric(p => p.statusBedridden === 'ติดเตียง', v => true)
    const homeVentilator = countMetric(p => p.procedures?.homeVen, v => true)
    const palliativeCare = countMetric(p => p.typeDx1 === 'Palliative', v => true)

    // Complications
    const pressureSore = countMetric(p => p.pressureInjury?.hasWound, v => v.proceduresDone?.woundDressing)
    const jointContract = countMetric(p => true, v => v.complications?.jointStiffness)
    const pneumonia = countMetric(p => true, v => v.complications?.pneumonia)
    const uti = countMetric(p => true, v => v.complications?.uti)

    return {
      activePatientsInRange,
      dcPlanningInRange,
      inWardVisitedInRange,
      totalHomeService,
      tbi,
      stroke,
      sci,
      hip,
      ca,
      nonCa,
      esrdTotal,
      capd,
      hd,
      renalPalliative,
      copd,
      adlGreen,
      adlYellow,
      adlRed,
      adlBlack,
      elderlyTotal,
      elderlyGreen,
      elderlyYellow,
      elderlyRed,
      elderlyBlack,
      dependentDisabled,
      homeVentilator,
      palliativeCare,
      pressureSore,
      jointContract,
      pneumonia,
      uti
    }
  }, [patients, filteredVisits, patientVisitMap, startDate, endDate])

  // Longitudinal First Visit vs Latest Visit (From Sheet 'สรุปเยี่ยม')
  const longitudinalSummary = useMemo(() => {
    return patients.map(p => {
      const ptVisits = visits
        .filter(v => v.hwNo === p.hwNo)
        .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))

      const count = ptVisits.length
      const first = ptVisits[0] || null
      const latest = ptVisits[ptVisits.length - 1] || null

      const initialAdl = p.preDcAdl ?? 0
      const firstAdl = first ? first.adl : initialAdl
      const latestAdl = latest ? latest.adl : initialAdl
      const deltaAdl = latestAdl - firstAdl

      let trend = 'คงที่'
      if (deltaAdl > 0) trend = 'ดีขึ้น'
      else if (deltaAdl < 0) trend = 'ลดลง'

      return {
        patient: p,
        visitCount: count,
        firstDate: first ? first.visitDate : p.firstHomeVisitDate || '-',
        latestDate: latest ? latest.visitDate : '-',
        firstAdl,
        latestAdl,
        deltaAdl,
        trend,
        firstPps: first ? first.ppsScore : p.ppsScore,
        latestPps: latest ? latest.ppsScore : p.ppsScore,
        firstBraden: first ? first.bradenScore : 16,
        latestBraden: latest ? latest.bradenScore : 16,
        firstPush: first ? first.pushScore : (p.pressureInjury?.pushScore || 0),
        latestPush: latest ? latest.pushScore : (p.pressureInjury?.pushScore || 0),
        firstPain: first ? first.painScore : 0,
        latestPain: latest ? latest.painScore : 0,
        nextAppointment: latest?.nextAppointmentDate || p.nextAppointment || '-'
      }
    })
  }, [patients, visits])

  // Network & Referral Analytics
  const networkAnalytics = useMemo(() => {
    const wardMap = {}
    const pcuMap = {}
    const subdistrictMap = {}

    patients.forEach(p => {
      const w = p.wardSender || 'ไม่ระบุ'
      wardMap[w] = (wardMap[w] || 0) + 1

      const pcu = p.targetPcu || 'ไม่ระบุ'
      pcuMap[pcu] = (pcuMap[pcu] || 0) + 1

      const sub = p.subdistrict || 'ไม่ระบุ'
      subdistrictMap[sub] = (subdistrictMap[sub] || 0) + 1
    })

    return {
      topWards: Object.entries(wardMap).sort((a, b) => b[1] - a[1]),
      topPcus: Object.entries(pcuMap).sort((a, b) => b[1] - a[1]),
      topSubdistricts: Object.entries(subdistrictMap).sort((a, b) => b[1] - a[1])
    }
  }, [patients])

  // Filtered disease registry
  const diseasePatients = useMemo(() => {
    if (selectedDisease === 'ESRD') {
      return patients.filter(p => p.typeDx2 === 'ESRD' || p.procedures?.capd || p.procedures?.hd)
    }
    if (selectedDisease === 'COPD') {
      return patients.filter(p => p.typeDx2 === 'COPD' || p.procedures?.homeO2)
    }
    if (selectedDisease === 'Stroke') {
      return patients.filter(p => p.typeDx2 === 'Stroke')
    }
    if (selectedDisease === 'Palliative') {
      return patients.filter(p => p.typeDx1 === 'Palliative' || p.typeDx2 === 'CA')
    }
    return patients
  }, [patients, selectedDisease])

  // Export full table to CSV
  const handleExportCsv = () => {
    let csv = '\uFEFF' // UTF-8 BOM for Thai Excel
    csv += 'รายงานผลการปฏิบัติงาน กลุ่มงานการพยาบาลชุมชน โรงพยาบาลนครพิงค์\n'
    csv += `ช่วงวันที่: ${startDate} ถึง ${endDate}\n\n`
    csv += 'ลำดับ,รายการ,กลุ่ม,คน (ราย),ครั้ง\n'
    csv += `1,จำนวนคนไข้ในงาน Home ward,-,${reportMetrics.activePatientsInRange},-\n`
    csv += `2,การวางแผน D/C เพื่อเตรียมความพร้อมผู้ป่วย,-,${reportMetrics.dcPlanningInRange},-\n`
    csv += `3,จำนวนผู้ป่วยที่ได้เยี่ยมตึก,-,${reportMetrics.inWardVisitedInRange},-\n`
    csv += `4,ให้บริการดูแลผู้ป่วยและครอบครัวที่บ้าน,ทั้งหมด,${reportMetrics.totalHomeService.personCount},${reportMetrics.totalHomeService.visitCount}\n`
    csv += `4.1,แบ่งตาม Type DX2,TBI,${reportMetrics.tbi.personCount},${reportMetrics.tbi.visitCount}\n`
    csv += `4.2,แบ่งตาม Type DX2,Stroke,${reportMetrics.stroke.personCount},${reportMetrics.stroke.visitCount}\n`
    csv += `4.3,แบ่งตาม Type DX2,SCI,${reportMetrics.sci.personCount},${reportMetrics.sci.visitCount}\n`
    csv += `4.4,แบ่งตาม Type DX2,Fx around hip,${reportMetrics.hip.personCount},${reportMetrics.hip.visitCount}\n`
    csv += `4.5,แบ่งตาม Type DX2,CA,${reportMetrics.ca.personCount},${reportMetrics.ca.visitCount}\n`
    csv += `4.6,แบ่งตาม Type DX2,Non CA,${reportMetrics.nonCa.personCount},${reportMetrics.nonCa.visitCount}\n`
    csv += `5,กลุ่มโรคไต (ESRD),รวม,${reportMetrics.esrdTotal.personCount},${reportMetrics.esrdTotal.visitCount}\n`
    csv += `5.1,กลุ่มโรคไต (ESRD),CAPD,${reportMetrics.capd.personCount},${reportMetrics.capd.visitCount}\n`
    csv += `5.2,กลุ่มโรคไต (ESRD),HD,${reportMetrics.hd.personCount},${reportMetrics.hd.visitCount}\n`
    csv += `6,กลุ่มโรคปอดอุดกั้นเรื้อรัง (COPD),-,${reportMetrics.copd.personCount},${reportMetrics.copd.visitCount}\n`
    csv += `7.1,ระดับ ADL,เขียว,${reportMetrics.adlGreen.personCount},${reportMetrics.adlGreen.visitCount}\n`
    csv += `7.2,ระดับ ADL,เหลือง,${reportMetrics.adlYellow.personCount},${reportMetrics.adlYellow.visitCount}\n`
    csv += `7.3,ระดับ ADL,แดง,${reportMetrics.adlRed.personCount},${reportMetrics.adlRed.visitCount}\n`
    csv += `7.4,ระดับ ADL,ดำ,${reportMetrics.adlBlack.personCount},${reportMetrics.adlBlack.visitCount}\n`
    csv += `8,ผู้สูงอายุ (>= 60 ปี),รวม,${reportMetrics.elderlyTotal.personCount},${reportMetrics.elderlyTotal.visitCount}\n`
    csv += `9,Home ventilator,-,${reportMetrics.homeVentilator.personCount},${reportMetrics.homeVentilator.visitCount}\n`
    csv += `10,Palliative Care,-,${reportMetrics.palliativeCare.personCount},${reportMetrics.palliativeCare.visitCount}\n`
    csv += `11.1,ภาวะแทรกซ้อน,แผลกดทับ,${reportMetrics.pressureSore.personCount},${reportMetrics.pressureSore.visitCount}\n`
    csv += `11.2,ภาวะแทรกซ้อน,ข้อติด,${reportMetrics.jointContract.personCount},${reportMetrics.jointContract.visitCount}\n`
    csv += `11.3,ภาวะแทรกซ้อน,Pneumonia,${reportMetrics.pneumonia.personCount},${reportMetrics.pneumonia.visitCount}\n`
    csv += `11.4,ภาวะแทรกซ้อน,UTI,${reportMetrics.uti.personCount},${reportMetrics.uti.visitCount}\n`

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `nkp_homeward_report_${startDate}_to_${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="card shadow-sm border-0">
      {/* Header */}
      <div className="card-header bg-white py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h4 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-spreadsheet-fill"></i>
            ศูนย์รายงานและสถิติภาพรวม (Comprehensive Analytics & Reports)
          </h4>
          <small className="text-muted">
            ถอดแบบสูตรและตารางรายงานทั้งหมดจาก Google Sheets พร้อมสถิติเชิงลึกตามช่วงเวลา
          </small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={handleExportCsv}>
            <i className="bi bi-file-earmark-excel"></i>
            Export Excel / CSV
          </button>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={() => window.print()}>
            <i className="bi bi-printer"></i>
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      <div className="card-body p-4">
        {/* Date Range Filter Bar (Same as Google Sheet cells C3 and E3) */}
        <div className="p-3 bg-light rounded-3 border mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-md-3">
              <label className="form-label small fw-bold mb-1">
                <i className="bi bi-calendar-event me-1"></i>เลือกวันเริ่มต้น (Start Date)
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold mb-1">
                <i className="bi bi-calendar-event me-1"></i>เลือกวันสิ้นสุด (End Date)
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold mb-1 d-block">ช่วงเวลายอดนิยม (Presets)</label>
              <div className="btn-group btn-group-sm w-100">
                <button type="button" className="btn btn-outline-primary" onClick={() => handlePreset('all')}>ทั้งปี 2568</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => handlePreset('q1')}>ไตรมาส 1</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => handlePreset('q2')}>ไตรมาส 2</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => handlePreset('q3')}>ไตรมาส 3</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => handlePreset('q4')}>ไตรมาส 4</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'performanceTable' ? 'active fw-bold text-primary' : ''}`}
              onClick={() => setActiveTab('performanceTable')}
            >
              <i className="bi bi-table me-1"></i>1. ตารางผลการปฏิบัติงาน (ตามชีต Google Sheet)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'longitudinal' ? 'active fw-bold text-primary' : ''}`}
              onClick={() => setActiveTab('longitudinal')}
            >
              <i className="bi bi-arrow-left-right me-1"></i>2. เปรียบเทียบก่อน-หลังเยี่ยม (ชีต สรุปเยี่ยม)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'network' ? 'active fw-bold text-primary' : ''}`}
              onClick={() => setActiveTab('network')}
            >
              <i className="bi bi-diagram-3 me-1"></i>3. จำแนกตามเครือข่ายตึก & รพ.สต.
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'registry' ? 'active fw-bold text-primary' : ''}`}
              onClick={() => setActiveTab('registry')}
            >
              <i className="bi bi-journal-medical me-1"></i>4. ทะเบียนโรคเฉพาะ (ชีต reportlist)
            </button>
          </li>
        </ul>

        {/* TAB 1: ตารางผลการปฏิบัติงานฉบับสมบูรณ์ */}
        {activeTab === 'performanceTable' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-primary mb-0">
                <i className="bi bi-clipboard-data me-1"></i>
                ผลการปฏิบัติงาน กลุ่มงานการพยาบาลชุมชน โรงพยาบาลนครพิงค์
              </h5>
              <span className="badge text-bg-light border text-muted">
                ข้อมูลระหว่าง {startDate} ถึง {endDate}
              </span>
            </div>

            <div className="table-responsive shadow-sm rounded border">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th style={{ width: '40%' }}>รายการการให้บริการ</th>
                    <th style={{ width: '25%' }}>กลุ่ม / การจำแนก</th>
                    <th style={{ width: '15%' }}>คน (ราย)</th>
                    <th style={{ width: '15%' }}>ครั้ง</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Section 1 */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">1. ภาพรวมการรับเคสและการเตรียมความพร้อม</td>
                  </tr>
                  <tr>
                    <td className="ps-4">จำนวนคนไข้ในงาน Home ward สะสม</td>
                    <td className="text-center text-muted">-</td>
                    <td className="text-center fw-bold text-primary">{reportMetrics.activePatientsInRange}</td>
                    <td className="text-center text-muted">-</td>
                  </tr>
                  <tr>
                    <td className="ps-4">การวางแผน D/C เพื่อเตรียมความพร้อมผู้ป่วย</td>
                    <td className="text-center text-muted">-</td>
                    <td className="text-center fw-bold text-primary">{reportMetrics.dcPlanningInRange}</td>
                    <td className="text-center text-muted">-</td>
                  </tr>
                  <tr>
                    <td className="ps-4">จำนวนผู้ป่วยที่ได้เยี่ยมตึก (In-Ward Assessment)</td>
                    <td className="text-center text-muted">-</td>
                    <td className="text-center fw-bold text-primary">{reportMetrics.inWardVisitedInRange}</td>
                    <td className="text-center text-muted">-</td>
                  </tr>

                  {/* Section 2 */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">2. ให้บริการดูแลผู้ป่วยและครอบครัวที่บ้าน (Home Services)</td>
                  </tr>
                  <tr className="fw-bold bg-light-subtle">
                    <td className="ps-4 text-primary">ยอดรวมให้บริการทั้งหมด</td>
                    <td className="text-center">ทั้งหมด</td>
                    <td className="text-center text-primary fs-6">{reportMetrics.totalHomeService.personCount}</td>
                    <td className="text-center text-primary fs-6">{reportMetrics.totalHomeService.visitCount}</td>
                  </tr>
                  <tr>
                    <td className="ps-4" rowSpan="6">จำแนกตามกลุ่มโรค Type DX.2</td>
                    <td>สมองบาดเจ็บ (TBI)</td>
                    <td className="text-center fw-semibold">{reportMetrics.tbi.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.tbi.visitCount}</td>
                  </tr>
                  <tr>
                    <td>หลอดเลือดสมอง (Stroke)</td>
                    <td className="text-center fw-semibold">{reportMetrics.stroke.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.stroke.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ไขสันหลังบาดเจ็บ (SCI)</td>
                    <td className="text-center fw-semibold">{reportMetrics.sci.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.sci.visitCount}</td>
                  </tr>
                  <tr>
                    <td>กระดูกสะโพกหัก (Fx around hip)</td>
                    <td className="text-center fw-semibold">{reportMetrics.hip.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.hip.visitCount}</td>
                  </tr>
                  <tr>
                    <td>โรคมะเร็ง (CA)</td>
                    <td className="text-center fw-semibold">{reportMetrics.ca.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.ca.visitCount}</td>
                  </tr>
                  <tr>
                    <td>กลุ่มโรคอื่นๆ (Non CA)</td>
                    <td className="text-center fw-semibold">{reportMetrics.nonCa.personCount}</td>
                    <td className="text-center fw-semibold">{reportMetrics.nonCa.visitCount}</td>
                  </tr>

                  {/* Section 3: Kidney */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">3. กลุ่มโรคไตวายเรื้อรังระยะสุดท้าย (ESRD)</td>
                  </tr>
                  <tr>
                    <td className="ps-4" rowSpan="4">โรคไตวายเรื้อรัง (ESRD)</td>
                    <td>ยอดรวมผู้ป่วยไตวาย</td>
                    <td className="text-center fw-bold">{reportMetrics.esrdTotal.personCount}</td>
                    <td className="text-center fw-bold">{reportMetrics.esrdTotal.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ล้างไตทางช่องท้อง (CAPD)</td>
                    <td className="text-center">{reportMetrics.capd.personCount}</td>
                    <td className="text-center">{reportMetrics.capd.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ฟอกเลือดด้วยเครื่องไตเทียม (HD)</td>
                    <td className="text-center">{reportMetrics.hd.personCount}</td>
                    <td className="text-center">{reportMetrics.hd.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ดูแลแบบประคับประคอง (Palliative Renal)</td>
                    <td className="text-center">{reportMetrics.renalPalliative.personCount}</td>
                    <td className="text-center">{reportMetrics.renalPalliative.visitCount}</td>
                  </tr>

                  {/* Section 4: COPD */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">4. กลุ่มโรคปอดอุดกั้นเรื้อรัง (COPD)</td>
                  </tr>
                  <tr>
                    <td className="ps-4">โรคปอดอุดกั้นเรื้อรัง (COPD / Home O2)</td>
                    <td>ยอดรวม</td>
                    <td className="text-center fw-bold">{reportMetrics.copd.personCount}</td>
                    <td className="text-center fw-bold">{reportMetrics.copd.visitCount}</td>
                  </tr>

                  {/* Section 5: ADL Levels */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">5. ให้บริการจำแนกตามระดับ Barthel ADL (Triage Color)</td>
                  </tr>
                  <tr>
                    <td className="ps-4" rowSpan="4">ระดับพึ่งพา (Barthel ADL)</td>
                    <td><span className="badge bg-success me-1">●</span>เขียว (พึ่งพาตนเองได้/ปานกลาง: ADL &gt;= 12)</td>
                    <td className="text-center text-success fw-bold">{reportMetrics.adlGreen.personCount}</td>
                    <td className="text-center text-success fw-bold">{reportMetrics.adlGreen.visitCount}</td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-warning text-dark me-1">●</span>เหลือง (กึ่งพึ่งพา: ADL 5-11)</td>
                    <td className="text-center text-warning-emphasis fw-bold">{reportMetrics.adlYellow.personCount}</td>
                    <td className="text-center text-warning-emphasis fw-bold">{reportMetrics.adlYellow.visitCount}</td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-danger me-1">●</span>แดง (พึ่งพาเต็มที่/ติดเตียง: ADL 0-4)</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.adlRed.personCount}</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.adlRed.visitCount}</td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-dark me-1">●</span>ดำ (เสียชีวิต / Terminal D)</td>
                    <td className="text-center text-dark fw-bold">{reportMetrics.adlBlack.personCount}</td>
                    <td className="text-center text-dark fw-bold">{reportMetrics.adlBlack.visitCount}</td>
                  </tr>

                  {/* Section 6: Elderly */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">6. ให้บริการดูแลผู้สูงอายุที่บ้าน (อายุ 60 ปีขึ้นไป)</td>
                  </tr>
                  <tr>
                    <td className="ps-4" rowSpan="5">ผู้สูงอายุ (Elderly &gt;= 60 ปี)</td>
                    <td><strong>ยอดรวมผู้สูงอายุ</strong></td>
                    <td className="text-center fw-bold text-primary">{reportMetrics.elderlyTotal.personCount}</td>
                    <td className="text-center fw-bold text-primary">{reportMetrics.elderlyTotal.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ผู้สูงอายุ - สีเขียว</td>
                    <td className="text-center">{reportMetrics.elderlyGreen.personCount}</td>
                    <td className="text-center">{reportMetrics.elderlyGreen.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ผู้สูงอายุ - สีเหลือง</td>
                    <td className="text-center">{reportMetrics.elderlyYellow.personCount}</td>
                    <td className="text-center">{reportMetrics.elderlyYellow.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ผู้สูงอายุ - สีแดง (ติดเตียง)</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.elderlyRed.personCount}</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.elderlyRed.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ผู้สูงอายุ - เสียชีวิตอย่างสงบ</td>
                    <td className="text-center">{reportMetrics.elderlyBlack.personCount}</td>
                    <td className="text-center">{reportMetrics.elderlyBlack.visitCount}</td>
                  </tr>

                  {/* Section 7: Specific Programs */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">7. โครงการและการดูแลเฉพาะกลุ่ม</td>
                  </tr>
                  <tr>
                    <td className="ps-4">ผู้พิการที่มีภาวะพึ่งพิงที่บ้าน (ติดเตียง)</td>
                    <td>ผู้มีภาวะพึ่งพิง</td>
                    <td className="text-center fw-bold">{reportMetrics.dependentDisabled.personCount}</td>
                    <td className="text-center fw-bold">{reportMetrics.dependentDisabled.visitCount}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">ผู้ป่วยใช้เครื่องช่วยหายใจที่บ้าน (Home Ventilator)</td>
                    <td>Home Ven</td>
                    <td className="text-center fw-bold text-danger">{reportMetrics.homeVentilator.personCount}</td>
                    <td className="text-center fw-bold text-danger">{reportMetrics.homeVentilator.visitCount}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">ผู้ป่วยดูแลแบบประคับประคองที่บ้าน (Palliative Care)</td>
                    <td>Palliative</td>
                    <td className="text-center fw-bold text-warning-emphasis">{reportMetrics.palliativeCare.personCount}</td>
                    <td className="text-center fw-bold text-warning-emphasis">{reportMetrics.palliativeCare.visitCount}</td>
                  </tr>

                  {/* Section 8: Complications */}
                  <tr className="table-light fw-bold">
                    <td colSpan="4">8. การดูแลและป้องกันภาวะแทรกซ้อนที่บ้าน</td>
                  </tr>
                  <tr>
                    <td className="ps-4" rowSpan="4">ภาวะแทรกซ้อนที่ดูแล</td>
                    <td>แผลกดทับ (Pressure Sore / PUSH)</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.pressureSore.personCount}</td>
                    <td className="text-center text-danger fw-bold">{reportMetrics.pressureSore.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ข้อติด (Joint Contracture)</td>
                    <td className="text-center">{reportMetrics.jointContract.personCount}</td>
                    <td className="text-center">{reportMetrics.jointContract.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ปอดอักเสบติดเชื้อ (Pneumonia)</td>
                    <td className="text-center">{reportMetrics.pneumonia.personCount}</td>
                    <td className="text-center">{reportMetrics.pneumonia.visitCount}</td>
                  </tr>
                  <tr>
                    <td>ติดเชื้อทางเดินปัสสาวะ (UTI)</td>
                    <td className="text-center">{reportMetrics.uti.personCount}</td>
                    <td className="text-center">{reportMetrics.uti.visitCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: เปรียบเทียบก่อน-หลังเยี่ยม (ชีต สรุปเยี่ยม) */}
        {activeTab === 'longitudinal' && (
          <div>
            <div className="alert alert-info py-2 mb-3">
              <i className="bi bi-info-circle me-1"></i>
              วิเคราะห์พัฒนาการรายบุคคล เปรียบเทียบคะแนนการเยี่ยมครั้งแรก (First Visit) เทียบกับครั้งล่าสุด (Latest Visit)
            </div>

            <div className="table-responsive shadow-sm rounded border">
              <table className="table table-hover table-bordered mb-0 align-middle">
                <thead className="table-light text-center small">
                  <tr>
                    <th>HW No.</th>
                    <th>ชื่อผู้ป่วย</th>
                    <th>กลุ่ม</th>
                    <th>เยี่ยม (ครั้ง)</th>
                    <th>วันแรก</th>
                    <th>วันล่าสุด</th>
                    <th className="bg-primary-subtle text-primary">ADL แรก</th>
                    <th className="bg-primary-subtle text-primary">ADL ล่าสุด</th>
                    <th className="bg-primary-subtle text-primary">พัฒนาการ ADL</th>
                    <th>PPS แรก</th>
                    <th>PPS ล่าสุด</th>
                    <th>Braden ล่าสุด</th>
                    <th>PUSH ล่าสุด</th>
                    <th>Pain ล่าสุด</th>
                    <th>นัดถัดไป</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {longitudinalSummary.map(row => (
                    <tr key={row.patient.id}>
                      <td className="fw-bold">{row.patient.hwNo}</td>
                      <td>{row.patient.prfx}{row.patient.firstName} {row.patient.lastName}</td>
                      <td><span className="badge bg-secondary">{row.patient.typeDx1}</span></td>
                      <td className="text-center fw-bold">{row.visitCount}</td>
                      <td className="text-center text-nowrap">{row.firstDate}</td>
                      <td className="text-center text-nowrap">{row.latestDate}</td>
                      <td className="text-center fw-bold">{row.firstAdl}</td>
                      <td className="text-center fw-bold text-primary">{row.latestAdl}</td>
                      <td className="text-center">
                        {row.trend === 'ดีขึ้น' && <span className="badge bg-success">ดีขึ้น (+{row.deltaAdl})</span>}
                        {row.trend === 'ลดลง' && <span className="badge bg-danger">ลดลง ({row.deltaAdl})</span>}
                        {row.trend === 'คงที่' && <span className="badge bg-light text-dark border">คงที่</span>}
                      </td>
                      <td className="text-center">{row.firstPps}%</td>
                      <td className="text-center">{row.latestPps}%</td>
                      <td className="text-center">{row.latestBraden}</td>
                      <td className="text-center">{row.latestPush > 0 ? <span className="badge bg-danger">{row.latestPush}</span> : '-'}</td>
                      <td className="text-center">{row.latestPain > 0 ? <span className="badge bg-warning text-dark">{row.latestPain}</span> : '0'}</td>
                      <td className="text-center text-nowrap">{row.nextAppointment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: จำแนกตามเครือข่ายตึก & รพ.สต. */}
        {activeTab === 'network' && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border shadow-sm">
                <div className="card-header bg-white fw-bold text-primary">
                  <i className="bi bi-hospital me-1"></i>สถิติการส่งต่อจำแนกตามหอผู้ป่วยในโรงพยาบาล (In-Patient Wards)
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-bordered mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ตึกที่ส่งเคส</th>
                        <th className="text-center" style={{ width: '120px' }}>จำนวน (ราย)</th>
                        <th className="text-center" style={{ width: '120px' }}>สัดส่วน (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networkAnalytics.topWards.map(([ward, count]) => (
                        <tr key={ward}>
                          <td>{ward}</td>
                          <td className="text-center fw-bold text-primary">{count}</td>
                          <td className="text-center">{((count / (patients.length || 1)) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border shadow-sm">
                <div className="card-header bg-white fw-bold text-primary">
                  <i className="bi bi-geo-alt-fill me-1"></i>สถิติการส่งต่อจำแนกตามสถานบริการปลายทาง (PCUs / รพ.สต.)
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-bordered mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>สถานบริการปลายทาง</th>
                        <th className="text-center" style={{ width: '120px' }}>จำนวน (ราย)</th>
                        <th className="text-center" style={{ width: '120px' }}>สัดส่วน (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networkAnalytics.topPcus.map(([pcu, count]) => (
                        <tr key={pcu}>
                          <td>{pcu}</td>
                          <td className="text-center fw-bold text-success">{count}</td>
                          <td className="text-center">{((count / (patients.length || 1)) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ทะเบียนโรคเฉพาะ (ชีต reportlist) */}
        {activeTab === 'registry' && (
          <div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <button
                className={`btn btn-sm ${selectedDisease === 'ESRD' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDisease('ESRD')}
              >
                <i className="bi bi-droplet-half me-1"></i>โรคไตวายเรื้อรัง (ESRD / CAPD / HD)
              </button>
              <button
                className={`btn btn-sm ${selectedDisease === 'COPD' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDisease('COPD')}
              >
                <i className="bi bi-lungs me-1"></i>โรคปอดอุดกั้นเรื้อรัง (COPD)
              </button>
              <button
                className={`btn btn-sm ${selectedDisease === 'Stroke' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDisease('Stroke')}
              >
                <i className="bi bi-activity me-1"></i>หลอดเลือดสมอง (Stroke)
              </button>
              <button
                className={`btn btn-sm ${selectedDisease === 'Palliative' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDisease('Palliative')}
              >
                <i className="bi bi-heart me-1"></i>Palliative Care & มะเร็ง
              </button>
            </div>

            <div className="alert alert-info py-2 mb-3">
              <i className="bi bi-info-circle me-1"></i>
              ทะเบียนผู้ป่วยเฉพาะโรค: <strong>{selectedDisease}</strong> (พบ <strong>{diseasePatients.length}</strong> ราย)
            </div>

            <div className="table-responsive shadow-sm rounded border">
              <table className="table table-hover align-middle table-bordered mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: '120px' }}>HW No.</th>
                    <th>ชื่อ - สกุล</th>
                    <th style={{ width: '80px' }}>อายุ</th>
                    <th>การวินิจฉัย (Diagnosis)</th>
                    <th>อุปกรณ์ / หัตถการที่เกี่ยวข้อง</th>
                    <th style={{ width: '100px' }}>ADL ปัจจุบัน</th>
                    <th>สถานบริการปลายทาง</th>
                  </tr>
                </thead>
                <tbody>
                  {diseasePatients.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        ไม่พบผู้ป่วยในกลุ่มโรคนี้
                      </td>
                    </tr>
                  ) : (
                    diseasePatients.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold text-primary">{p.hwNo}</td>
                        <td>
                          <div className="fw-semibold">{p.prfx}{p.firstName} {p.lastName}</div>
                          <small className="text-muted">HN: {p.hn}</small>
                        </td>
                        <td className="text-center">{p.age} ปี</td>
                        <td>{p.dxDetail || `${p.typeDx1} - ${p.typeDx2}`}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {p.procedures?.capd && <span className="badge text-bg-info">CAPD</span>}
                            {p.procedures?.hd && <span className="badge text-bg-primary">HD</span>}
                            {p.procedures?.homeO2 && <span className="badge text-bg-warning text-dark">Home O2</span>}
                            {p.procedures?.homeVen && <span className="badge text-bg-danger">Home Ven</span>}
                            {p.procedures?.ng && <span className="badge text-bg-secondary">NG</span>}
                            {p.procedures?.foley && <span className="badge text-bg-secondary">Foley</span>}
                            {!p.procedures?.capd && !p.procedures?.hd && !p.procedures?.homeO2 && (
                              <span className="text-muted small">-</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${p.ptColor === 'เขียว' ? 'bg-success' : p.ptColor === 'เหลือง' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {p.preDcAdl} / 20
                          </span>
                        </td>
                        <td><small>{p.targetPcu}</small></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
