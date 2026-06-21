// app/templates/data/landscape-employee.js

// ... (existing imports and definitions before the array)

const landscapeEmployee = [
  // ... (existing templates up to LE15)

  {
    id: "LE15",
    // ... (last corporate template)
  },

  // NEW TEMPLATE
 {
  id: "LE100",
  name: "Nova Corporate",
  category: "employee",
  filter: "corporate",
  icon: "🏢",
  orientation: "landscape",
  htmlContent: `<div class="flip-card" style="width:100%;height:100%;">
  <div class="flip-card-inner" style="position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.65s cubic-bezier(0.23,1,0.32,1);">
    <!-- FRONT SIDE -->
    <div class="card-front" style="position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:24px;overflow:hidden;">
      <div style="height:100%;background:white;border-radius:24px;overflow:hidden;font-family:Arial,sans-serif;display:flex;">
        <!-- Left Panel -->
        <div style="width:35%;background:linear-gradient(135deg,#2563eb,#1e40af);padding:18px;color:white;display:flex;flex-direction:column;align-items:center;">
          <div class="profile-image" style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:4px solid white;">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='67' font-size='50' text-anchor='middle' fill='%2364748b'%3E👤%3C/text%3E%3C/svg%3E" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <h2 class="employee_name" style="margin:10px 0 2px;font-size:1.1rem;">John Carter</h2>
          <div class="designation" style="font-size:.7rem;opacity:0.8;">Senior Manager</div>
          <div style="margin-top:auto;text-align:center;">
            <div class="employee_id" style="font-weight:bold;font-size:0.8rem;">EMP-2025</div>
            <div class="department" style="font-size:0.7rem;">Operations</div>
          </div>
        </div>
        <!-- Right Panel -->
        <div style="flex:1;padding:18px;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;">
            <div>
              <div class="company_name" style="font-size:1.2rem;font-weight:800;color:#1e293b;">NOVA GROUP</div>
              <div class="email" style="font-size:0.7rem;color:#64748b;">john@nova.com</div>
              <div class="phone" style="font-size:0.7rem;color:#64748b;">+1 555 222 111</div>
            </div>
            <!-- QR placeholder (will be generated) -->
            <div class="qr-placeholder" style="width:80px;height:80px;overflow:hidden;border:1px solid #e2e8f0;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#94a3b8;font-size:0.6rem;">QR</div>
          </div>
          <div style="margin-top:auto;">
            <!-- Signature TEXT (editable) – separate from image upload -->
            <div class="signature" style="height:35px;border-bottom:2px solid #2563eb;display:flex;align-items:flex-end;font-size:0.7rem;color:#475569;">
              Ashmit Singh
            </div>
            <!-- Signature IMAGE (upload target) – separate container -->
            <div class="sign-img" style="height:35px;margin-top:4px;border:1px dashed #94a3b8;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.5rem;">Upload Signature</div>
            <!-- Barcode placeholder -->
            <div class="barcode" style="margin-top:10px;height:55px;overflow:hidden;border-radius:8px;background:#f8fafc;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;font-size:0.6rem;color:#94a3b8;">
              BARCODE
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- BACK SIDE -->
    <div class="card-back" style="position:absolute;width:100%;height:100%;backface-visibility:hidden;transform:rotateY(180deg);border-radius:24px;overflow:hidden;">
      <div style="height:100%;background:linear-gradient(135deg,#1e40af,#2563eb);padding:24px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <!-- Editable title -->
        <h1 class="card_title" style="font-size:2rem;font-weight:800;margin:0;">NOVA GROUP</h1>
        <!-- Editable subtitle -->
        <p class="card_subtitle" style="opacity:0.7;font-size:0.8rem;margin-top:4px;">Corporate ID Card</p>
        <!-- Issued / Expiry with classes -->
        <div style="display:flex;gap:20px;margin:20px 0;">
          <div style="text-align:center;">
            <div class="issued_label" style="font-size:0.6rem;opacity:0.5;">ISSUED</div>
            <div class="issued_date" style="font-weight:600;">01/2025</div>
          </div>
          <div style="text-align:center;">
            <div class="expiry_label" style="font-size:0.6rem;opacity:0.5;">EXPIRY</div>
            <div class="expiry_date" style="font-weight:600;">12/2027</div>
          </div>
        </div>
        <!-- QR on back (will be generated) -->
        <div class="qr-placeholder" style="width:80px;height:80px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#1e40af;font-weight:bold;font-size:0.7rem;">SCAN</div>
        <!-- Editable security text -->
        <div class="security_text" style="margin-top:12px;width:80%;height:20px;background:white;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#1e40af;font-size:0.6rem;">Secure ID · RFID · Biometric</div>
        <div style="margin-top:8px;font-size:0.5rem;opacity:0.5;">v2.0</div>
      </div>
    </div>
  </div>
</div>`
},
{
  id: "LE11",
  name: "Nova Corporate",
  category: "employee",
  filter: "corporate",
  icon: "🏢",
  orientation: "landscape",
  htmlContent: `
<div class="flip-card" style="width:100%;height:100%;">
<div class="flip-card-inner">

<div class="card-front">
<div class="editable-bg" style="background:linear-gradient(135deg,#0f172a,#1e293b);height:100%;padding:18px;color:white;display:flex;flex-direction:column;">

<div style="display:flex;justify-content:space-between;">
<div class="company_name" style="font-size:24px;font-weight:700;">NOVA GROUP</div>
<div class="card_title" style="font-size:12px;">Corporate Employee ID</div>
</div>

<div style="display:flex;gap:15px;flex:1;align-items:center;">

<div class="profile-image" style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:3px solid white;">
<img src="https://i.pravatar.cc/150" style="width:100%;height:100%;object-fit:cover;">
</div>

<div style="flex:1;">
<div class="employee_name" style="font-size:24px;font-weight:700;">Ashmit Singh</div>
<div class="designation" style="font-size:13px;">Senior Operations Manager</div>

<div style="margin-top:10px;">
<div class="employee_id">EMP-2025</div>
<div class="department">Operations</div>
<div class="email">ashmit@nova.com</div>
<div class="phone">+91 9876543210</div>
</div>
</div>

</div>

<div style="display:flex;justify-content:space-between;align-items:end;">
<div>
<div class="issued_date">Issued: 01/2025</div>
<div class="expiry_date">Expiry: 12/2027</div>
</div>

<div>
<div class="sign-img" style="width:120px;height:35px;border:1px dashed white;"></div>
<div class="signature" style="font-size:11px;text-align:center;">Ashmit Singh</div>
</div>
</div>

</div>
</div>

<div class="card-back">
<div class="editable-bg" style="background:#ffffff;height:100%;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">

<div style="text-align:center;">
<div class="company_name" style="font-size:24px;font-weight:700;">NOVA GROUP</div>
<div class="security_text">Secure Access • RFID • Biometric</div>
</div>

<div style="display:flex;justify-content:space-around;align-items:center;">
<div class="qr-placeholder" style="width:90px;height:90px;border:1px solid #ddd;"></div>
<div class="barcode" style="width:220px;height:50px;"></div>
</div>

<div style="text-align:center;">
<div class="website">www.novagroup.com</div>
<div class="address">Mumbai, India</div>
</div>

</div>
</div>

</div>
</div>
`
}
];

export default landscapeEmployee;