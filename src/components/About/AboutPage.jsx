export default function AboutPage() {
  return (
    <div className="container-fluid px-3 px-md-4 py-2">
      {/* Header Banner */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-primary text-white">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="p-3 bg-white text-primary rounded-circle shadow-sm">
              <i className="bi bi-info-circle-fill fs-2"></i>
            </div>
            <div>
              <span className="badge text-bg-light text-primary px-3 py-1 rounded-pill mb-1">
                ทำความรู้จักกับระบบ
              </span>
              <h2 className="fw-bold mb-0">NKP Homeward: Continuing Care</h2>
            </div>
          </div>
          <p className="lead text-white-50 mb-0 col-lg-9">
            ระบบบริหารจัดการและติดตามดูแลผู้ป่วยต่อเนื่องที่บ้าน 
            เปลี่ยนผ่านข้อมูลจาก Google Sheets สู่ Web Application ที่ทันสมัย ใช้ง่าย และตอบโจทย์ทีมสุขภาพชุมชนอย่างแท้จริง
          </p>
        </div>
      </div>

      {/* 1. ที่มาและความสำคัญ */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-4 bg-white">
            <h5 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-heart-pulse-fill"></i>
              ที่มาและเป้าหมายของระบบ
            </h5>
            <p className="text-muted leading-relaxed">
              เมื่อผู้ป่วยพ้นภาวะวิกฤตและได้รับการจำหน่ายกลับบ้าน การดูแลไม่ได้สิ้นสุดลงที่ประตูโรงพยาบาล 
              ผู้ป่วยกลุ่ม <strong>Intermediate Care (IMC)</strong> เช่น โรคหลอดเลือดสมอง หรือกระดูกสะโพกหัก, 
              กลุ่ม <strong>Long-Term Care (LTC)</strong> ผู้มีภาวะพึ่งพิง, และกลุ่ม <strong>Palliative Care</strong> 
              ที่ต้องการการดูแลแบบประคับประคอง ล้วนต้องการการดูแลต่อเนื่องอย่างใกล้ชิด
            </p>
            <p className="text-muted leading-relaxed mb-0">
              <strong>NKP Homeward</strong> ถูกสร้างขึ้นมาเพื่อเป็นสะพานเชื่อมโยงข้อมูลระหว่าง 
              <strong>หอผู้ป่วยในโรงพยาบาล</strong>, <strong>ทีมพยาบาลชุมชน</strong>, 
              และ <strong>รพ.สต. ในพื้นที่</strong> ช่วยให้การวางแผนจำหน่าย การลงพื้นที่เยี่ยมบ้าน 
              และการติดตามอาการเป็นไปอย่างราบรื่น ไม่มีผู้ป่วยคนใดตกหล่น
            </p>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-check-circle-fill"></i>
              ประโยชน์ที่ทีมสุขภาพและผู้ป่วยได้รับ
            </h5>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success fs-5 mt-n1"></i>
                <div>
                  <strong>ลดภาระการจำสูตรและคีย์ข้อมูลซ้ำซ้อน:</strong> จากเดิมใน Google Sheets ที่สูตรซับซ้อนและเสี่ยงไฟล์พัง ระบบนี้คำนวณและแสดงผลให้อัตโนมัติในคลิกเดียว
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success fs-5 mt-n1"></i>
                <div>
                  <strong>ป้องกันเคสตกหล่น 100%:</strong> มีระบบแจ้งเตือนอัจฉริยะสำหรับคนไข้ที่จำหน่ายแล้วแต่ยังไม่ได้เยี่ยมบ้าน และเคสที่ยังไม่ได้ประเมินที่ตึก
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success fs-5 mt-n1"></i>
                <div>
                  <strong>เห็นพัฒนาการของผู้ป่วยชัดเจน:</strong> มีระบบเปรียบเทียบคะแนน ADL และตัวชี้วัดสุขภาพ ทำให้เห็นว่าการเยี่ยมบ้านช่วยให้คนไข้ฟื้นตัวดีขึ้นอย่างไร
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. 4 ระบบงานหลัก */}
      <h4 className="fw-bold text-primary mb-3">
        <i className="bi bi-grid-fill me-2"></i>4 ระบบงานหลักของ NKP Homeward
      </h4>

      <div className="row g-3 mb-4">
        {/* Module 1 */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white border-top border-4 border-primary">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <i className="bi bi-people-fill fs-3"></i>
              <h5 className="fw-bold mb-0">ทะเบียนผู้ป่วย</h5>
            </div>
            <p className="text-muted small mb-0">
              บันทึกเวชระเบียนแรกรับอย่างครบวงจร ทั้งข้อมูลระบุตัวตน, สิทธิการรักษา, การวินิจฉัยโรค (IMC/LTC/Palliative), 
              ประวัติการส่งต่อจากตึก, การประเมินคะแนนแรกรับก่อนกลับบ้าน, ตลอดจนสายสวน อุปกรณ์การแพทย์ และแผลกดทับ
            </p>
          </div>
        </div>

        {/* Module 2 */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white border-top border-4 border-success">
            <div className="d-flex align-items-center gap-2 mb-2 text-success">
              <i className="bi bi-geo-alt-fill fs-3"></i>
              <h5 className="fw-bold mb-0">บันทึกการเยี่ยม</h5>
            </div>
            <p className="text-muted small mb-0">
              รองรับทั้งการลงพื้นที่เยี่ยมบ้าน (Home Visit) และการติดตามทางไกล (Telemedicine) 
              บันทึกแบบประเมินมาตรฐาน ADL, PPS %, Braden, PUSH, CAT, Pain Score 
              พร้อมบันทึกหัตถการที่ให้ (เช่น เปลี่ยนสาย NG/Foley) และเฝ้าระวังภาวะแทรกซ้อน
            </p>
          </div>
        </div>

        {/* Module 3 */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white border-top border-4 border-warning">
            <div className="d-flex align-items-center gap-2 mb-2 text-warning-emphasis">
              <i className="bi bi-bell-fill fs-3"></i>
              <h5 className="fw-bold mb-0">กระดานติดตาม</h5>
            </div>
            <p className="text-muted small mb-0">
              ศูนย์รวมการติดตามเคสอัจฉริยะ ตรวจสอบคิวนัดหมายลงพื้นที่ตามช่วงวันที่, 
              แจ้งเตือนเคสจำหน่ายที่ยังไม่ได้รับการเยี่ยมบ้านครั้งแรก, เคสที่ยังไม่ได้ประเมินที่ตึก, 
              และสรุปแนวโน้มการฟื้นตัวของคะแนน ADL รายบุคคล
            </p>
          </div>
        </div>

        {/* Module 4 */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white border-top border-4 border-info">
            <div className="d-flex align-items-center gap-2 mb-2 text-info-emphasis">
              <i className="bi bi-bar-chart-fill fs-3"></i>
              <h5 className="fw-bold mb-0">รายงาน & สถิติ</h5>
            </div>
            <p className="text-muted small mb-0">
              ถอดแบบสูตรตารางรายงานผลการปฏิบัติงานของกลุ่มงานการพยาบาลชุมชน แสดงแยกมิติ "คน (ราย)" และ "ครั้ง" 
              เปรียบเทียบผลลัพธ์ First vs Latest Visit, วิเคราะห์เครือข่ายส่งต่อของตึกและ รพ.สต., และส่งออก Excel/CSV ได้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* 3. เครื่องมือประเมินสุขภาพมาตรฐานสากล */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
        <h5 className="fw-bold text-dark mb-3">
          <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
          เครื่องมือประเมินสุขภาพมาตรฐานที่ระบบรองรับ (Clinical Assessment Scales)
        </h5>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-light rounded border h-100">
              <strong className="text-primary d-block mb-1">Barthel ADL Index (0 - 20)</strong>
              <small className="text-muted d-block mb-2">ประเมินความสามารถในการทำกิจวัตรประจำวัน</small>
              <div className="d-flex flex-column gap-1 small">
                <span><span className="badge bg-success me-1">เขียว (12-20)</span> พึ่งพาตนเองได้/ปานกลาง</span>
                <span><span className="badge bg-warning text-dark me-1">เหลือง (5-11)</span> กึ่งพึ่งพา</span>
                <span><span className="badge bg-danger me-1">แดง (0-4)</span> พึ่งพาเต็มที่ / ติดเตียง</span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-light rounded border h-100">
              <strong className="text-info-emphasis d-block mb-1">PPS & Braden Scale</strong>
              <small className="text-muted d-block mb-2">การทำงานของร่างกายและความเสี่ยงแผลกดทับ</small>
              <div className="d-flex flex-column gap-1 small">
                <span><strong>PPS Score (10-100%):</strong> วัดสมรรถนะร่างกายในผู้ป่วยประคับประคอง</span>
                <span><strong>Braden Scale (6-23):</strong> คัดกรองและประเมินความเสี่ยงต่อการเกิดแผลกดทับ</span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-light rounded border h-100">
              <strong className="text-danger d-block mb-1">PUSH 2 & CAT & Pain Score</strong>
              <small className="text-muted d-block mb-2">ติดตามแผลกดทับ ปอดอุดกั้นเรื้อรัง และความปวด</small>
              <div className="d-flex flex-column gap-1 small">
                <span><strong>PUSH Tool (0-17):</strong> ติดตามการหายของแผลกดทับ</span>
                <span><strong>CAT Score (0-40):</strong> ผลกระทบของโรคปอดอุดกั้นเรื้อรัง (COPD)</span>
                <span><strong>Pain Score (0-10):</strong> ประเมินระดับความปวดเพื่อปรับยาระงับปวด</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. เทคโนโลยีและความปลอดภัย */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-light">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-shield-lock-fill text-primary me-2"></i>
              สถาปัตยกรรมและแผนการพัฒนา (Technology & Security Roadmap)
            </h5>
            <p className="text-muted small mb-0 mt-2">
              <strong>โครงสร้างทางเทคนิค:</strong> พัฒนาด้วย React 18, Vite 8, และ Bootstrap 5.3 
              จัดเก็บข้อมูลในเครื่องผ่าน Browser LocalStorage พร้อมปุ่ม Export/Import ข้อมูลสำรองอย่างปลอดภัย 
              ในขั้นตอนถัดไปจะต่อยอดระบบความปลอดภัยและการจัดการสิทธิ์ผู้ใช้งาน (Role-Based Access Control) 
              ตามมาตรฐานความปลอดภัยข้อมูลสุขภาพ PDPA เช่นเดียวกับโปรเจกต์ PediGrow
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="badge text-bg-primary fs-6 px-3 py-2">
              โรงพยาบาลนครพิงค์
            </div>
            <div className="small text-muted mt-1">กลุ่มงานการพยาบาลชุมชน</div>
          </div>
        </div>
      </div>
    </div>
  )
}
