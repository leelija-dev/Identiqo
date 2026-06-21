// portrait-employee.js
const portraitEmployee = [{
  id: "PE01",
  name: "Executive Portrait",
  category: "employee",
  filter: "corporate",
  icon: "🪪",
  orientation: "portrait",
  htmlContent: `
<div class="flip-card">
<div class="flip-card-inner">

<div class="card-front">
<div class="editable-bg" style="background:linear-gradient(180deg,#1e293b,#334155);height:100%;padding:20px;color:white;text-align:center;">

<div class="company_name" style="font-size:22px;font-weight:700;">
NOVA GROUP
</div>

<div class="profile-image" style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:20px auto;">
<img src="https://i.pravatar.cc/150" style="width:100%;height:100%;object-fit:cover;">
</div>

<div class="employee_name" style="font-size:22px;">
Ashmit Singh
</div>

<div class="designation">
Operations Manager
</div>

<hr style="margin:15px 0;">

<div class="employee_id">EMP-2025</div>
<div class="department">Operations</div>
<div class="email">ashmit@nova.com</div>
<div class="phone">+91 9876543210</div>

<div style="margin-top:20px;">
<div class="sign-img" style="height:40px;border:1px dashed white;"></div>
<div class="signature">Ashmit Singh</div>
</div>

</div>
</div>

<div class="card-back">
<div class="editable-bg" style="background:white;height:100%;padding:20px;text-align:center;">

<div class="company_name" style="font-size:22px;font-weight:700;">
NOVA GROUP
</div>

<div class="card_title">
Official Employee ID
</div>

<div style="margin-top:20px;">
<div class="qr-placeholder" style="width:120px;height:120px;margin:auto;border:1px solid #ddd;"></div>
</div>

<div style="margin-top:20px;">
<div class="barcode"></div>
</div>

<div style="margin-top:20px;">
<div class="issued_date">Issued: 01/2025</div>
<div class="expiry_date">Expiry: 12/2027</div>
<div class="security_text">RFID • Secure Access</div>
</div>

<div class="address" style="margin-top:15px;">
Mumbai, India
</div>

</div>
</div>

</div>
</div>
`
}
];

export default portraitEmployee;
