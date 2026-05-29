# Jena Lover

เว็บ proposal แบบ interactive โทน pixel / paint art / 3D เบา ๆ เปิดได้ด้วย `index.html` โดยตรง ไม่ต้องติดตั้ง package เพิ่ม

## เปิดเว็บ

เปิดไฟล์ `index.html` ใน browser ได้เลย หรือเปิดผ่าน local server:

```powershell
python -m http.server 5173
```

แล้วเข้า `http://localhost:5173`

## Flow ปัจจุบัน

1. Landing: อวกาศมืด ดาววิบวับ แล้ว scroll ผ่านเมฆลงสู่ป่า pixel
2. Quiz: 6 คำถามพร้อม particle ตามฤดูกาล
3. Story: 4 ฉากข้อความความในใจ
4. Memories: กรอบรูปเอียง 2 รูป ใช้ไฟล์จริงใน `assets`
5. Gift: กล่องของขวัญ 3D เปิดเป็นจดหมาย
6. Proposal: สมุด pixel, ปุ่ม “ไม่เป็น” ทำให้ปุ่ม “เป็น” ใหญ่ขึ้นจนทะลุสมุด
7. Final: popup pixel ชมพู, sticker, จดหมายรูป, share link, download ภาพที่มีเวลาเป็นแฟนกัน

## ไฟล์สำคัญ

- `index.html` โครงหน้าเว็บทั้งหมด
- `styles.css` layout, responsive, pixel UI, animation
- `script.js` flow, Three.js, canvas particles, quiz, proposal, download image
- `assets/oumflower1.png` sticker ย่อสำหรับแสดงบนเว็บ
- `assets/oumflower1-export-data.js` data URL สำหรับ export รูปดาวน์โหลด ไม่ให้ canvas ติด tainted error
- `src/proposal-state.mjs` logic ที่แยกไว้ทดสอบ
- `tests/proposal-state.test.mjs` test ของ quiz/proposal core

## รูปที่ใช้งานจริง

Memories:

- `assets/oummm.jpg` รูปน้องอุ้มอิ้ม
- `assets/jenaa.png` รูปเจน่า

Final photo lightbox:

- `assets/jenaa.png`
- `assets/4uuuu.png`
- `assets/4444u.png`
- `assets/chosseu.png`
- `assets/jenaaa.jpg`
- `assets/oummm.jpg`

Final sticker:

- หน้าเว็บใช้ `assets/oumflower1.png`
- รูปดาวน์โหลดใช้ `assets/oumflower1-export-data.js`

## ทดสอบ

```powershell
node --check script.js
node --check assets\oumflower1-export-data.js
node --test tests\proposal-state.test.mjs
```

## หมายเหตุสำหรับ AI ตัวอื่น

- อย่าเพิ่มตัวละครคนในฉากหลัก ให้ใช้วิว/แสง/particle เป็นตัวเล่าเรื่อง
- หน้า Memories ตั้งใจให้มี 2 รูปหลัก วางเอียงและมีมิติ
- หน้า Proposal เป็นสมุด pixel ไม่ใช่ท้องฟ้า proposal แบบเดิม
- หน้า Final เป็นโทนชมพู pixel heart พร้อม popup และรูปดาวน์โหลด
- ถ้าแก้รูปดาวน์โหลด ระวัง `toDataURL` กับ tainted canvas ต้องใช้ data URL/local canvas drawing เท่านั้น
