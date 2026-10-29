// Storage service for NKP Homeward (Phase 1: LocalStorage / Client persistence)
import { generate50MockPatientsAndVisits } from './mockDataGenerator'

export const MASTER_DATA = {
  typeDx1: ['IMC', 'LTC', 'Palliative', 'Other'],
  typeDx2: ['Stroke', 'TBI', 'SCI', 'Fx around hip', 'CA', 'ESRD', 'COPD', 'Other'],
  area: ['ในเขต', 'นอกเขต'],
  gender: ['ชาย', 'หญิง'],
  bedridden: ['ไม่ติดเตียง', 'ติดเตียง'],
  ptColor: [
    { value: 'เขียว', label: 'เขียว (พึ่งพาตนเองได้/ปานกลาง)', badge: 'bg-success' },
    { value: 'เหลือง', label: 'เหลือง (กึ่งพึ่งพา)', badge: 'bg-warning text-dark' },
    { value: 'แดง', label: 'แดง (พึ่งพาเต็มที่/ติดเตียง)', badge: 'bg-danger' }
  ],
  pct: ['อายุรกรรม', 'ศัลยกรรม', 'สูติ-นรีเวชกรรม', 'กุมารเวชกรรม', 'โสต ศอ นาสิก', 'ออร์โธปิดิกส์'],
  wards: [
    'อายุรกรรมชาย 1 16/3',
    'อายุรกรรมชาย 2 16/4',
    'กึ่งวิกฤตอายุรกรรม 16/5',
    'หอผู้ป่วยพิเศษ 16/6',
    'หอผู้ป่วยพิเศษ 16/7',
    'ศัลยกรรมอุบัติเหตุ',
    'ศัลยกรรมทั่วไป'
  ],
  woundStage: ['stage 1', 'stage 2', 'stage 3', 'stage 4', 'unstage'],
  woundSource: ['บ้าน', 'รพ.'],
  dcTypes: ['ทุเลา', 'เสียชีวิต', 'ย้ายที่อยู่', 'ไม่สมัครใจเยี่ยม', 'ส่งต่อ รพ.สต.'],
  targetPcu: [
    'รพ.สต.บ้านเจ็ดยอด',
    'รพ.สต.บ้านท่าข้าม',
    'รพ.สต.บ้านวังสิงห์คำ',
    'รพ.สต.บ้านโรงวัว',
    'รพ.สต.บ้านศรีบัวเงิน',
    'ศูนย์บริการสาธารณสุขเทศบาล'
  ],
  visitTypes: ['บ้าน', 'Tele']
}

const STORAGE_KEYS = {
  PATIENTS: 'nkp_homeward_patients',
  VISITS: 'nkp_homeward_visits'
}

export function calculateAge(birthDateStr) {
  if (!birthDateStr) return ''
  const birth = new Date(birthDateStr)
  if (isNaN(birth.getTime())) return ''
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age >= 0 ? age : 0
}

export function calculateColorByAdl(adl) {
  if (adl === 'D') return 'ดำ'
  const score = Number(adl)
  if (isNaN(score)) return 'แดง'
  if (score >= 12) return 'เขียว'
  if (score >= 5) return 'เหลือง'
  return 'แดง'
}

// Initial state: starts with EMPTY data [] by default.
// The user can choose to register new patients or click "เรียกใช้ข้อมูลตัวอย่าง".
export function initOrGetStore() {
  try {
    const resetDone = localStorage.getItem('nkp_homeward_empty_init_v2')
    if (!resetDone) {
      localStorage.removeItem(STORAGE_KEYS.PATIENTS)
      localStorage.removeItem(STORAGE_KEYS.VISITS)
      localStorage.setItem('nkp_homeward_empty_init_v2', 'true')
      return { patients: [], visits: [] }
    }

    const rawP = localStorage.getItem(STORAGE_KEYS.PATIENTS)
    const rawV = localStorage.getItem(STORAGE_KEYS.VISITS)

    const parsedP = rawP ? JSON.parse(rawP) : []
    const parsedV = rawV ? JSON.parse(rawV) : []
    return { patients: parsedP, visits: parsedV }
  } catch (e) {
    console.error('Storage init failed', e)
    return { patients: [], visits: [] }
  }
}

// Clear all data completely (wipes all user-entered and sample data)
export function clearAllData() {
  localStorage.setItem('nkp_homeward_empty_init_v2', 'true')
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify([]))
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify([]))
  return { patients: [], visits: [] }
}

// Load sample data (50 mock patients and 70+ visits)
export function loadSampleData() {
  const seeded = generate50MockPatientsAndVisits()
  localStorage.setItem('nkp_homeward_empty_init_v2', 'true')
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(seeded.patients))
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(seeded.visits))
  return seeded
}

export function restoreMockData() {
  return loadSampleData()
}

export function resetTo50MockData() {
  return loadSampleData()
}

export function getPatients() {
  return initOrGetStore().patients
}

export function savePatients(patients) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
  } catch (e) {
    console.error('Failed to save patients', e)
  }
}

export function getVisits() {
  return initOrGetStore().visits
}

export function saveVisits(visits) {
  try {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits))
  } catch (e) {
    console.error('Failed to save visits', e)
  }
}

// Queries & Aggregations
export function getPatientJourney(patients, visits) {
  return patients.map(p => {
    const ptVisits = visits
      .filter(v => v.hwNo === p.hwNo)
      .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
    
    const visitCount = ptVisits.length
    const firstVisit = ptVisits[0] || null
    const latestVisit = ptVisits[ptVisits.length - 1] || null

    const initialAdl = p.preDcAdl ?? 0
    const latestAdl = latestVisit ? latestVisit.adl : initialAdl
    const adlDiff = latestAdl - initialAdl

    let trend = 'คงที่'
    if (adlDiff > 0) trend = 'ดีขึ้น'
    else if (adlDiff < 0) trend = 'ลดลง'

    return {
      patient: p,
      visitCount,
      firstVisitDate: firstVisit ? firstVisit.visitDate : p.firstHomeVisitDate || '-',
      latestVisitDate: latestVisit ? latestVisit.visitDate : '-',
      initialAdl,
      latestAdl,
      adlDiff,
      trend,
      latestColor: latestVisit ? latestVisit.adlColor : p.ptColor
    }
  })
}
