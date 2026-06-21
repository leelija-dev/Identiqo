// landscape-visiting.js
const landscapeVisiting = [{
  id: "LV01",
  name: "Executive Visiting Card",
  category: "visiting",
  filter: "business",
  icon: "💼",
  orientation: "landscape",
  htmlContent: `
<div class="flip-card">
<div class="flip-card-inner">

<div class="card-front">
<div class="editable-bg" style="background:linear-gradient(135deg,#2563eb,#1e40af);height:100%;padding:20px;color:white;">

<div class="company_name" style="font-size:28px;font-weight:700;">
LEELIJA GROUP
</div>

<div style="display:flex;align-items:center;margin-top:20px;gap:15px;">

<div class="profile-image" style="width:85px;height:85px;border-radius:50%;overflow:hidden;">
<img src="https://i.pravatar.cc/150">
</div>

<div>
<div class="employee_name" style="font-size:24px;">Ashmit Singh</div>
<div class="designation">Business Development Director</div>
</div>

</div>

<div style="margin-top:20px;">
<div class="phone">+91 9876543210</div>
<div class="email">ashmit@leelija.com</div>
<div class="website">www.leelija.com</div>
</div>

</div>
</div>

<div class="card-back">
<div class="editable-bg" style="background:white;height:100%;padding:20px;">

<div class="company_name" style="font-size:22px;font-weight:700;">
LEELIJA GROUP
</div>

<div class="address" style="margin-top:10px;">
Corporate Tower, Kolkata, India
</div>

<div style="display:flex;justify-content:space-between;margin-top:25px;">

<div class="qr-placeholder" style="width:90px;height:90px;border:1px solid #ddd;"></div>

<div style="width:220px;">
<div class="barcode"></div>
</div>

</div>

</div>
</div>

</div>
</div>
`
}
];

export default landscapeVisiting;