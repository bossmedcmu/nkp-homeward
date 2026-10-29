import { useState, useEffect, useMemo } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Auth/Login'
import HomePage from './components/Home/HomePage'
import PatientList from './components/PatientRegistry/PatientList'
import PatientFormModal from './components/PatientRegistry/PatientFormModal'
import PatientDetailModal from './components/PatientRegistry/PatientDetailModal'
import VisitList from './components/Visits/VisitList'
import VisitFormModal from './components/Visits/VisitFormModal'
import TrackingDashboard from './components/Tracking/TrackingDashboard'
import ReportDashboard from './components/Reports/ReportDashboard'
import AboutPage from './components/About/AboutPage'
import heroImage from './assets/hero-home-nurse.svg'
import {
  initOrGetStore,
  savePatients,
  saveVisits,
  resetTo50MockData
} from './services/storage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [patients, setPatients] = useState([])
  const [visits, setVisits] = useState([])

  // Modal states for Patients
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [patientToEdit, setPatientToEdit] = useState(null)
  const [patientToView, setPatientToView] = useState(null)

  // Modal states for Visits
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitToEdit, setVisitToEdit] = useState(null)

  useEffect(() => {
    // Check auth
    const savedUser = localStorage.getItem('nkp_auth_user')
    if (savedUser) {
      setIsAuthenticated(true)
    }

    // Load data
    const store = initOrGetStore()
    setPatients(store.patients)
    setVisits(store.visits)
  }, [])

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('nkp_auth_user')
      setIsAuthenticated(false)
      setActiveTab('home')
    }
  }

  // Patient CRUD
  const handleSavePatient = (formData) => {
    let updated
    if (formData.id) {
      updated = patients.map(p => p.id === formData.id ? formData : p)
    } else {
      const newPatient = {
        ...formData,
        id: `p-${Date.now()}`
      }
      updated = [newPatient, ...patients]
    }
    setPatients(updated)
    savePatients(updated)
    setShowPatientModal(false)
    setPatientToEdit(null)
  }

  const handleDeletePatient = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ป่วยรายนี้?')) {
      const updated = patients.filter(p => p.id !== id)
      setPatients(updated)
      savePatients(updated)
    }
  }

  // Visit CRUD
  const handleSaveVisit = (formData) => {
    let updated
    if (formData.id) {
      updated = visits.map(v => v.id === formData.id ? formData : v)
    } else {
      const newVisit = {
        ...formData,
        id: `v-${Date.now()}`
      }
      updated = [newVisit, ...visits]

      // If patient had no firstHomeVisitDate and this visit is a home visit, update it automatically
      const targetP = patients.find(p => p.hwNo === formData.hwNo)
      if (targetP && !targetP.firstHomeVisitDate && formData.visitType === 'บ้าน') {
        const updatedPatients = patients.map(p => {
          if (p.hwNo === formData.hwNo) {
            return {
              ...p,
              firstHomeVisitDate: formData.visitDate,
              preDcAdl: formData.adl,
              ptColor: formData.adlColor
            }
          }
          return p
        })
        setPatients(updatedPatients)
        savePatients(updatedPatients)
      }
    }
    setVisits(updated)
    saveVisits(updated)
    setShowVisitModal(false)
    setVisitToEdit(null)
  }

  const handleDeleteVisit = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบันทึกการเยี่ยมนี้?')) {
      const updated = visits.filter(v => v.id !== id)
      setVisits(updated)
      saveVisits(updated)
    }
  }

  // Action from tracking or patient list to record visit directly
  const handleRecordVisitForPatient = (patient) => {
    setVisitToEdit({
      hwNo: patient.hwNo,
      admitRound: patient.admitRound || 1,
      patientName: `${patient.prfx}${patient.firstName} ${patient.lastName}`,
      adl: patient.preDcAdl ?? 10,
      adlColor: patient.ptColor || 'เหลือง'
    })
    setShowVisitModal(true)
  }

  // Reset to 50 Mock Data
  const handleResetMockData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลเป็นข้อมูลจำลอง 50 ราย พร้อมบันทึกการเยี่ยมและเคสติดตามครบทุกเมนูใช่หรือไม่?')) {
      const seeded = resetTo50MockData()
      setPatients(seeded.patients)
      setVisits(seeded.visits)
      alert(`รีเซ็ตข้อมูลจำลองเรียบร้อย: ผู้ป่วย ${seeded.patients.length} ราย, บันทึกเยี่ยม ${seeded.visits.length} รายการ`)
    }
  }

  // Export & Import
  const handleExportJson = () => {
    const fullBackup = { patients, visits }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `nkp_homeward_full_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportJson = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        if (imported.patients && imported.visits) {
          setPatients(imported.patients)
          setVisits(imported.visits)
          savePatients(imported.patients)
          saveVisits(imported.visits)
          alert(`นำเข้าข้อมูลสำเร็จ: ผู้ป่วย ${imported.patients.length} ราย, บันทึกเยี่ยม ${imported.visits.length} รายการ`)
        } else if (Array.isArray(imported)) {
          setPatients(imported)
          savePatients(imported)
          alert(`นำเข้าเฉพาะข้อมูลผู้ป่วยสำเร็จ ${imported.length} รายการ`)
        } else {
          alert('รูปแบบไฟล์ไม่ถูกต้อง')
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON')
      }
    }
    reader.readAsText(file)
  }

  // Alert count for badge
  const alertCount = useMemo(() => {
    const unvisitedHome = patients.filter(p => p.dischargeDate && !p.firstHomeVisitDate && p.dcStatus === 'กำลังติดตาม').length
    const unvisitedWard = patients.filter(p => !p.inWardVisitDate && p.dcStatus === 'กำลังติดตาม').length
    return unvisitedHome + unvisitedWard
  }, [patients])

  // If not logged in, show Login page
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        patientCount={patients.length}
        visitCount={visits.length}
        alertCount={alertCount}
        onResetMockData={handleResetMockData}
        onLogout={handleLogout}
      />

      <main className="container-fluid px-3 px-md-4 pb-5 flex-grow-1">
        {activeTab === 'home' && (
          <HomePage
            patientCount={patients.length}
            visitCount={visits.length}
            alertCount={alertCount}
            onNavigate={setActiveTab}
            onAddNewPatient={() => {
              setPatientToEdit(null)
              setShowPatientModal(true)
            }}
            onAddNewVisit={() => {
              setVisitToEdit(null)
              setShowVisitModal(true)
            }}
            heroImageSrc={heroImage}
          />
        )}

        {activeTab === 'registry' && (
          <PatientList
            patients={patients}
            onAddNew={() => {
              setPatientToEdit(null)
              setShowPatientModal(true)
            }}
            onEdit={(patient) => {
              setPatientToEdit(patient)
              setShowPatientModal(true)
            }}
            onDelete={handleDeletePatient}
            onView={(patient) => setPatientToView(patient)}
            onExport={handleExportJson}
            onImport={handleImportJson}
          />
        )}

        {activeTab === 'visits' && (
          <VisitList
            visits={visits}
            patients={patients}
            onAddNewVisit={() => {
              setVisitToEdit(null)
              setShowVisitModal(true)
            }}
            onEditVisit={(visit) => {
              setVisitToEdit(visit)
              setShowVisitModal(true)
            }}
            onDeleteVisit={handleDeleteVisit}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingDashboard
            patients={patients}
            visits={visits}
            onRecordVisitForPatient={handleRecordVisitForPatient}
            onViewPatient={(patient) => setPatientToView(patient)}
          />
        )}

        {activeTab === 'dashboard' && (
          <ReportDashboard
            patients={patients}
            visits={visits}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Modals */}
      <PatientFormModal
        show={showPatientModal}
        patientToEdit={patientToEdit}
        onClose={() => {
          setShowPatientModal(false)
          setPatientToEdit(null)
        }}
        onSave={handleSavePatient}
      />

      <PatientDetailModal
        patient={patientToView}
        onClose={() => setPatientToView(null)}
        onEdit={(patient) => {
          setPatientToEdit(patient)
          setShowPatientModal(true)
        }}
      />

      <VisitFormModal
        show={showVisitModal}
        patients={patients}
        visitToEdit={visitToEdit}
        onClose={() => {
          setShowVisitModal(false)
          setVisitToEdit(null)
        }}
        onSave={handleSaveVisit}
      />
    </div>
  )
}
