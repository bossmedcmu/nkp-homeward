// Generator for 50 realistic clinical mock patients and their corresponding home/tele visits

import { calculateColorByAdl, calculateAge } from './storage'

const FIRST_NAMES_MALE = [
  'สมควร', 'ประเสริฐ', 'บุญมี', 'สมหมาย', 'สุรชัย', 'สมพงษ์', 'ประสิทธิ์', 'สมบูรณ์', 'อำนวย', 'บุญเลิศ',
  'จำลอง', 'ไพโรจน์', 'ณรงค์', 'ทวี', 'สมศักดิ์', 'สุรินทร์', 'สมชาย', 'ธงชัย', 'อนันต์', 'วันชัย',
  'วินัย', 'ประวิทย์', 'สุชาติ', 'ธีระ', 'เฉลิม'
]

const FIRST_NAMES_FEMALE = [
  'สมใจ', 'ประคอง', 'บุญรอด', 'ทองคำ', 'ละมัย', 'บัวลอย', 'มาลี', 'สมศรี', 'อำพร', 'บุญมี',
  'วรรณา', 'ดวงใจ', 'นงนุช', 'สุภาพร', 'ปราณี', 'จินตนา', 'รุ่งนภา', 'พนิดา', 'ศิริพร', 'กัลยา',
  'ยุพา', 'บังอร', 'รัตนา', 'วนิดา', 'อุษา'
]

const LAST_NAMES = [
  'สุขสวัสดิ์', 'คำแก้ว', 'มั่นคง', 'เรืองศรี', 'ศรีวิลัย', 'บุญเรือง', 'ใจดี', 'ทองสุข', 'ชัยมงคล', 'พงษ์พาณิชย์',
  'แก้วกาญจน์', 'วงค์คำ', 'ศรีสุข', 'อินทร์แปลง', 'ดวงแก้ว', 'แสนสุข', 'ศิริวัฒน์', 'วงศ์ษา', 'นาคราช', 'มณีรัตน์',
  'ไชยเดช', 'โพธิ์ศรี', 'สุขเกษม', 'เรืองวิทย์', 'เจริญสุข'
]

const DX2_BY_DX1 = {
  IMC: ['Stroke', 'TBI', 'SCI', 'Fx around hip'],
  LTC: ['Stroke', 'Fx around hip', 'Other'],
  Palliative: ['CA', 'Other'],
  Other: ['ESRD', 'COPD', 'Other']
}

const WARDS = [
  'อายุรกรรมชาย 1 16/3',
  'อายุรกรรมชาย 2 16/4',
  'กึ่งวิกฤตอายุรกรรม 16/5',
  'หอผู้ป่วยพิเศษ 16/6',
  'หอผู้ป่วยพิเศษ 16/7',
  'ศัลยกรรมทั่วไป',
  'ศัลยกรรมอุบัติเหตุ'
]

const TARGET_PCUS = [
  'รพ.สต.บ้านเจ็ดยอด',
  'รพ.สต.บ้านท่าข้าม',
  'รพ.สต.บ้านวังสิงห์คำ',
  'รพ.สต.บ้านโรงวัว',
  'รพ.สต.บ้านศรีบัวเงิน',
  'ศูนย์บริการสาธารณสุขเทศบาล'
]

const SUBDISTRICTS = ['ในเมือง', 'หนองญาติ', 'อาจสามารถ', 'ท่าค้อ', 'นาทราย', 'คำเตย']

export function generate50MockPatientsAndVisits() {
  const patients = []
  const visits = []

  let visitCounter = 1

  for (let i = 1; i <= 50; i++) {
    const isMale = i % 2 !== 0
    const gender = isMale ? 'ชาย' : 'หญิง'
    const prfx = isMale ? 'นาย' : (i % 6 === 0 ? 'นาง' : 'นาง')
    const firstName = isMale 
      ? FIRST_NAMES_MALE[(i * 3) % FIRST_NAMES_MALE.length] 
      : FIRST_NAMES_FEMALE[(i * 7) % FIRST_NAMES_FEMALE.length]
    const lastName = LAST_NAMES[(i * 5) % LAST_NAMES.length]

    const padNo = String(i).padStart(3, '0')
    const hwNo = `HW68-${padNo}`
    const hn = `67${String(10000 + i * 142).padStart(6, '0')}`

    // Assign categories
    let typeDx1 = 'IMC'
    if (i % 5 === 0) typeDx1 = 'Palliative'
    else if (i % 3 === 0) typeDx1 = 'LTC'
    else if (i % 7 === 0) typeDx1 = 'Other'

    const dx2Options = DX2_BY_DX1[typeDx1]
    const typeDx2 = dx2Options[i % dx2Options.length]

    // Special markers
    const isESRD = typeDx2 === 'ESRD' || (i % 8 === 0)
    const isCOPD = typeDx2 === 'COPD' || (i % 9 === 0)

    // Age between 45 and 85
    const birthYear = 2026 - (45 + (i * 3) % 42)
    const birthMonth = String((i % 12) + 1).padStart(2, '0')
    const birthDay = String((i % 27) + 1).padStart(2, '0')
    const birthDateStr = `${birthYear}-${birthMonth}-${birthDay}`
    const age = calculateAge(birthDateStr)

    // Admission dates between 2026-01-01 and 2026-10-15
    const monthAdmit = Math.min(10, Math.max(1, (i % 10) + 1))
    const dayAdmit = (i % 20) + 1
    const admitDate = `2026-${String(monthAdmit).padStart(2, '0')}-${String(dayAdmit).padStart(2, '0')}`
    
    // D/C date typically 5-15 days after admit
    const dcDay = Math.min(28, dayAdmit + 5 + (i % 8))
    const dischargeDate = `2026-${String(monthAdmit).padStart(2, '0')}-${String(dcDay).padStart(2, '0')}`

    // Baseline ADL
    let preDcAdl = 4
    if (typeDx1 === 'LTC') preDcAdl = (i % 8) + 2
    else if (typeDx1 === 'Palliative') preDcAdl = (i % 6)
    else if (typeDx1 === 'IMC') preDcAdl = (i % 12) + 3
    else preDcAdl = 14

    preDcAdl = Math.max(0, Math.min(20, preDcAdl))
    const ptColor = calculateColorByAdl(preDcAdl)
    const statusBedridden = preDcAdl <= 4 ? 'ติดเตียง' : 'ไม่ติดเตียง'

    // Status scenarios:
    // Scenario 1: Case newly admitted, not visited in ward yet (case 47-50)
    // Scenario 2: Discharged, but NEVER visited at home yet (cases 40-46)
    // Scenario 3: Regularly visited with 1-4 visits (cases 1-39)
    let inWardVisitDate = ''
    let firstHomeVisitDate = ''
    let dcStatus = 'กำลังติดตาม'

    if (i <= 46) {
      // In-ward visit completed
      const inWardDay = Math.min(28, dayAdmit + 2)
      inWardVisitDate = `2026-${String(monthAdmit).padStart(2, '0')}-${String(inWardDay).padStart(2, '0')}`
    }

    if (i <= 39) {
      // Home visit completed
      const firstHomeDay = Math.min(28, dcDay + 4)
      firstHomeVisitDate = `2026-${String(monthAdmit).padStart(2, '0')}-${String(firstHomeDay).padStart(2, '0')}`
    }

    // Some cases are closed / discharged
    if (i === 15 || i === 30) dcStatus = 'ทุเลา'
    else if (i === 20 || i === 35) dcStatus = 'เสียชีวิต'
    else if (i === 25) dcStatus = 'ส่งต่อ รพ.สต.'

    // Next appointment: within next 1-30 days
    const nextAppMonth = '11'
    const nextAppDay = String((i % 25) + 1).padStart(2, '0')
    const nextAppointment = (dcStatus === 'กำลังติดตาม') ? `2026-${nextAppMonth}-${nextAppDay}` : ''

    const patient = {
      id: `p-${i}`,
      hn,
      hwNo,
      admitRound: 1,
      prfx,
      firstName,
      lastName,
      gender,
      birthDate: birthDateStr,
      age,
      phone: `08${(i % 9) + 1}-${String(100 + i * 17).padStart(3, '0')}-${String(2000 + i * 31).slice(0, 4)}`,
      area: i % 4 === 0 ? 'นอกเขต' : 'ในเขต',
      houseNo: `${(i * 7) % 199 + 1}/${(i % 5) + 1}`,
      moo: String((i % 12) + 1),
      subdistrict: SUBDISTRICTS[i % SUBDISTRICTS.length],
      district: 'เมือง',
      province: 'เชียงใหม่',
      regDate: admitDate,
      typeDx1,
      typeDx2,
      dxDetail: `${typeDx2} in ${typeDx1} care ${isESRD ? 'with ESRD' : ''} ${isCOPD ? 'with COPD' : ''}`.trim(),
      pct: i % 2 === 0 ? 'อายุรกรรม' : (i % 3 === 0 ? 'ศัลยกรรม' : 'ออร์โธปิดิกส์'),
      wardSender: WARDS[i % WARDS.length],
      admitDate,
      dischargeDate,
      targetPcu: TARGET_PCUS[i % TARGET_PCUS.length],
      statusBedridden,
      preDcAdl,
      ppsScore: Math.min(100, Math.max(20, preDcAdl * 5 + 10)),
      ptColor,
      inWardVisitDate,
      firstHomeVisitDate,
      procedures: {
        ng: i % 3 === 0,
        foley: i % 4 === 0,
        tt: i % 11 === 0,
        capd: isESRD && i % 2 === 0,
        hd: isESRD && i % 2 !== 0,
        ostomy: i % 9 === 0,
        homeO2: isCOPD || (typeDx1 === 'Palliative' && i % 2 === 0),
        homeVen: i === 7 || i === 22
      },
      pressureInjury: {
        hasWound: i % 5 === 0,
        stage: `stage ${(i % 3) + 1}`,
        source: i % 2 === 0 ? 'รพ.' : 'บ้าน',
        pushScore: i % 5 === 0 ? (i % 12) + 3 : 0
      },
      palliative: {
        advanceCarePlan: typeDx1 === 'Palliative',
        cannabisOil: typeDx1 === 'Palliative' && i % 2 === 0,
        morphine: typeDx1 === 'Palliative',
        syringeDriver: typeDx1 === 'Palliative' && (i % 4 === 0)
      },
      dcStatus,
      nextAppointment,
      notes: dcStatus === 'เสียชีวิต' 
        ? 'เสียชีวิตที่บ้านอย่างสงบ (ครอบครัวได้รับการดูแลประคับประคอง)' 
        : (preDcAdl <= 4 ? 'ผู้ป่วยพึ่งพาตนเองไม่ได้ ญาติดูแลใกล้ชิด' : 'ผู้ป่วยเริ่มช่วยเหลือตนเองได้ มีการฝึกกายภาพบำบัด')
    }

    patients.push(patient)

    // Generate visits for patients with firstHomeVisitDate
    if (firstHomeVisitDate && dcStatus !== 'เสียชีวิต') {
      const visitCount = (i % 3) + 1 // 1 to 3 visits
      let currentAdl = preDcAdl

      for (let v = 1; v <= visitCount; v++) {
        const visitMonth = Math.min(10, monthAdmit + Math.floor((v - 1) / 2))
        const visitDay = Math.min(28, (v * 7) + 5)
        const visitDate = `2026-${String(visitMonth).padStart(2, '0')}-${String(visitDay).padStart(2, '0')}`

        // Show ADL progress
        if (typeDx1 === 'IMC' || typeDx1 === 'LTC') {
          currentAdl = Math.min(20, currentAdl + (v * 2))
        } else if (typeDx1 === 'Palliative') {
          currentAdl = Math.max(0, currentAdl - 1)
        }

        const visitColor = calculateColorByAdl(currentAdl)

        visits.push({
          id: `v-${visitCounter++}`,
          hwNo: patient.hwNo,
          admitRound: 1,
          patientName: `${patient.prfx}${patient.firstName} ${patient.lastName}`,
          visitDate,
          visitType: v === 2 && i % 2 === 0 ? 'Tele' : 'บ้าน',
          adl: currentAdl,
          adlColor: visitColor,
          ppsScore: Math.min(100, Math.max(10, currentAdl * 5 + 10)),
          ptType: currentAdl <= 4 ? '1.0' : (currentAdl <= 11 ? '2.0' : '3.0'),
          bradenScore: Math.min(23, 14 + (currentAdl / 2)),
          pushScore: patient.pressureInjury.hasWound ? Math.max(0, patient.pressureInjury.pushScore - v) : 0,
          catScore: isCOPD ? 18 - v : 0,
          painScore: typeDx1 === 'Palliative' ? Math.max(1, 7 - v * 2) : (patient.pressureInjury.hasWound ? 3 : 0),
          proceduresDone: {
            ng: patient.procedures.ng && v === 2,
            foley: patient.procedures.foley && v === 2,
            tt: patient.procedures.tt,
            woundDressing: patient.pressureInjury.hasWound,
            bloodDraw: isESRD && v === 1
          },
          complications: {
            jointStiffness: currentAdl <= 4 && (i % 3 === 0),
            pneumonia: i === 12,
            falling: i === 18 && v === 2,
            uti: patient.procedures.foley && (i % 4 === 0)
          },
          nextAppointmentDate: (v === visitCount && patient.dcStatus === 'กำลังติดตาม') ? patient.nextAppointment : '',
          notes: `การเยี่ยมครั้งที่ ${v}: ประเมินสภาพทั่วไป ผู้ป่วยมี ADL ${currentAdl}/20 สัญญาณชีพคงที่ ${patient.procedures.ng ? 'เปลี่ยนสาย NG เรียบร้อย' : ''}`.trim()
        })
      }
    }
  }

  return { patients, visits }
}
