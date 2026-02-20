/* ══════════════════════════════════════════════════════
   TGRERA Complaint Form — JavaScript Logic
   File: script.js
   ══════════════════════════════════════════════════════ */

// ── DOM Ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // ── Progress Bar Setup ──────────────────────────────
  const allInputs = document.querySelectorAll(
    '#tgrera-form input[required], ' +
    '#tgrera-form select[required], ' +
    '#tgrera-form textarea[required]'
  );

  allInputs.forEach(input => {
    input.addEventListener('input',  updateProgress);
    input.addEventListener('change', updateProgress);
  });

  function updateProgress() {
    let filled = 0;
    allInputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (input.checked) filled++;
      } else {
        if (input.value.trim() !== '') filled++;
      }
    });
    const percent = Math.round((filled / allInputs.length) * 100);
    document.getElementById('progressBar').style.width = percent + '%';
  }

  // ── Real-Time Field Validation ──────────────────────

  // Aadhaar
  document.getElementById('aadhaar').addEventListener('blur', function () {
    if (!validateAadhaar(this.value)) {
      showError('aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
    } else {
      clearError('aadhaar');
    }
  });

  // PAN
  document.getElementById('pan').addEventListener('blur', function () {
    this.value = this.value.toUpperCase();
    if (!validatePAN(this.value)) {
      showError('pan', 'Invalid PAN format. Expected: ABCDE1234F');
    } else {
      clearError('pan');
    }
  });

  // Mobile
  document.getElementById('mobile').addEventListener('blur', function () {
    if (!validateMobile(this.value)) {
      showError('mobile', 'Enter a valid 10-digit Indian mobile number.');
    } else {
      clearError('mobile');
    }
  });

  // Description Character Counter
  document.getElementById('description').addEventListener('input', function () {
    const count = this.value.trim().length;
    let hint    = this.parentNode.querySelector('.hint');
    if (!hint) {
      hint           = document.createElement('p');
      hint.className = 'hint';
      this.parentNode.appendChild(hint);
    }
    if (count < 100) {
      hint.style.color = '#c0392b';
      hint.textContent = `⚠️ Minimum 100 characters required. (${count}/100)`;
    } else {
      hint.style.color = '#27ae60';
      hint.textContent = `✅ ${count} characters — Good description!`;
    }
  });

  // ── Form Submit ─────────────────────────────────────
  document.getElementById('tgrera-form')
    .addEventListener('submit', handleSubmit);

}); // end DOMContentLoaded


// ══════════════════════════════════════════════════════
//  VALIDATORS
// ══════════════════════════════════════════════════════

function validateAadhaar(value) {
  const cleaned = value.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
}

function validatePAN(value) {
  if (value === '') return true; // PAN is optional
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
}

function validateMobile(value) {
  return /^[6-9]\d{9}$/.test(value);
}

function validateDescription(value) {
  return value.trim().length >= 100;
}

function validatePIN(value) {
  return /^\d{6}$/.test(value);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


// ══════════════════════════════════════════════════════
//  ERROR HELPERS
// ══════════════════════════════════════════════════════

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  // Remove existing error
  const existing = field.parentNode.querySelector('.error-msg');
  if (existing) existing.remove();

  // Style the field
  field.style.borderColor = '#c0392b';
  field.style.background  = '#fff5f5';

  // Create error element
  const errEl          = document.createElement('p');
  errEl.className      = 'error-msg';
  errEl.textContent    = `⚠️ ${message}`;
  field.parentNode.appendChild(errEl);
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '#ccc';
  field.style.background  = '#fdfdfd';
  const existing = field.parentNode.querySelector('.error-msg');
  if (existing) existing.remove();
}


// ══════════════════════════════════════════════════════
//  MANDATORY DOCS VALIDATION
// ══════════════════════════════════════════════════════

function validateMandatoryDocs() {
  const mandatoryDocs = [
    'doc_aadhaar',
    'doc_pan',
    'doc_agreement',
    'doc_receipts'
  ];

  let allChecked = true;
  mandatoryDocs.forEach(name => {
    const checkbox = document.querySelector(`input[name="${name}"]`);
    if (checkbox && !checkbox.checked) {
      allChecked = false;
      checkbox.parentElement.style.color = '#c0392b';
    } else if (checkbox) {
      checkbox.parentElement.style.color = '#2c3e50';
    }
  });

  return allChecked;
}


// ══════════════════════════════════════════════════════
//  GENERATE COMPLAINT ID
// ══════════════════════════════════════════════════════

function generateComplaintId() {
  const now    = new Date();
  const year   = now.getFullYear();
  const month  = String(now.getMonth() + 1).padStart(2, '0');
  const day    = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TGRERA/COMP/${year}/${month}${day}${random}`;
}


// ══════════════════════════════════════════════════════
//  FORM SUBMIT HANDLER
// ══════════════════════════════════════════════════════

function handleSubmit(event) {
  event.preventDefault();
  let isValid = true;

  // 1. Validate Aadhaar
  if (!validateAadhaar(document.getElementById('aadhaar').value)) {
    showError('aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
    isValid = false;
  } else {
    clearError('aadhaar');
  }

  // 2. Validate PAN (optional)
  const pan = document.getElementById('pan').value.toUpperCase();
  document.getElementById('pan').value = pan;
  if (!validatePAN(pan)) {
    showError('pan', 'Invalid PAN format. Expected: ABCDE1234F');
    isValid = false;
  } else {
    clearError('pan');
  }

  // 3. Validate Mobile
  if (!validateMobile(document.getElementById('mobile').value)) {
    showError('mobile', 'Enter a valid 10-digit Indian mobile number.');
    isValid = false;
  } else {
    clearError('mobile');
  }

  // 4. Validate Email
  if (!validateEmail(document.getElementById('email').value)) {
    showError('email', 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError('email');
  }

  // 5. Validate PIN
  if (!validatePIN(document.getElementById('pin').value)) {
    showError('pin', 'Please enter a valid 6-digit PIN code.');
    isValid = false;
  } else {
    clearError('pin');
  }

  // 6. Validate Description
  if (!validateDescription(document.getElementById('description').value)) {
    showError('description', 'Complaint description must be at least 100 characters.');
    isValid = false;
  } else {
    clearError('description');
  }

  // 7. Validate Mandatory Documents
  if (!validateMandatoryDocs()) {
    alert('⚠️ Please confirm all 4 mandatory documents are available.');
    isValid = false;
  }

  // 8. Validate Declaration Checkbox
  if (!document.getElementById('declarationAgree').checked) {
    alert('⚠️ Please agree to the declaration before submitting.');
    isValid = false;
  }

  // 9. Validate Digital Signature
  if (document.getElementById('digitalSignature').value.trim() === '') {
    showError('digitalSignature', 'Please type your full name as digital signature.');
    isValid = false;
  } else {
    clearError('digitalSignature');
  }

  // ── Proceed if All Valid ───────────────────────────
  if (isValid) {
    submitComplaint();
  } else {
    // Scroll to first error
    const firstError = document.querySelector('.error-msg');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}


// ══════════════════════════════════════════════════════
//  COLLECT DATA & SHOW SUCCESS
// ══════════════════════════════════════════════════════

function submitComplaint() {

  const complaintId = generateComplaintId();

  // ── Collect Form Data ──────────────────────────────
  const formData = {
    complaintId        : complaintId,
    submissionDate     : new Date().toLocaleDateString('en-IN'),
    submissionTime     : new Date().toLocaleTimeString('en-IN'),

    // Section A — Complainant
    fullName           : document.getElementById('fullName').value.trim(),
    fathersName        : document.getElementById('fathersName').value.trim(),
    dob                : document.getElementById('dob').value,
    gender             : document.getElementById('gender').value,
    nationality        : document.getElementById('nationality').value.trim(),
    aadhaar            : document.getElementById('aadhaar').value.trim(),
    pan                : document.getElementById('pan').value.trim(),
    mobile             : document.getElementById('mobile').value.trim(),
    altMobile          : document.getElementById('altMobile').value.trim(),
    email              : document.getElementById('email').value.trim(),
    address            : document.getElementById('address').value.trim(),
    city               : document.getElementById('city').value.trim(),
    state              : document.getElementById('state').value,
    pin                : document.getElementById('pin').value.trim(),

    // Section B — Builder & Project
    projectName        : document.getElementById('projectName').value.trim(),
    reraRegNo          : document.getElementById('reraRegNo').value.trim(),
    promoterName       : document.getElementById('promoterName').value.trim(),
    builderAddress     : document.getElementById('builderAddress').value.trim(),
    builderContact     : document.getElementById('builderContact').value.trim(),
    builderEmail       : document.getElementById('builderEmail').value.trim(),
    projectLocation    : document.getElementById('projectLocation').value.trim(),
    propertyType       : document.getElementById('propertyType').value,
    unitNumber         : document.getElementById('unitNumber').value.trim(),
    agreementNo        : document.getElementById('agreementNo').value.trim(),
    agreementDate      : document.getElementById('agreementDate').value,
    totalSaleValue     : document.getElementById('totalSaleValue').value,
    amountPaid         : document.getElementById('amountPaid').value,

    // Section C — Complaint
    complaintCategory  : document.getElementById('complaintCategory').value,
    expectedPossession : document.getElementById('expectedPossession').value,
    currentStatus      : document.getElementById('currentStatus').value,
    description        : document.getElementById('description').value.trim(),
    relief             : document.getElementById('relief').value.trim(),
    compensation       : document.getElementById('compensation').value || '0',

    // Section D — Documents
    docs : {
      aadhaar       : document.querySelector('input[name="doc_aadhaar"]').checked,
      pan           : document.querySelector('input[name="doc_pan"]').checked,
      agreement     : document.querySelector('input[name="doc_agreement"]').checked,
      receipts      : document.querySelector('input[name="doc_receipts"]').checked,
      allotment     : document.querySelector('input[name="doc_allotment"]').checked,
      comms         : document.querySelector('input[name="doc_comms"]').checked,
      photos        : document.querySelector('input[name="doc_photos"]').checked,
      notice        : document.querySelector('input[name="doc_notice"]').checked,
      brochure      : document.querySelector('input[name="doc_brochure"]').checked,
      bankStatement : document.querySelector('input[name="doc_bankstatement"]').checked
    },

    // Section E — Declaration
    digitalSignature   : document.getElementById('digitalSignature').value.trim()
  };

  // ── Log to Console (for testing) ──────────────────
  console.log('📋 TGRERA Complaint Submitted:', JSON.stringify(formData, null, 2));

  // ── Hide Form ──────────────────────────────────────
  document.getElementById('tgrera-form').style.display = 'none';

  // ── Show Success Message ───────────────────────────
  const successEl         = document.getElementById('successMessage');
  successEl.style.display = 'block';

  successEl.innerHTML = `
    <h2>✅ Complaint Submitted Successfully!</h2>
    <table class="success-table">
      <tr>
        <td>📌 Complaint ID:</td>
        <td>
          <span class="complaint-id-code">${complaintId}</span>
        </td>
      </tr>
      <tr>
        <td>👤 Complainant:</td>
        <td>${formData.fullName}</td>
      </tr>
      <tr>
        <td>🏗️ Project:</td>
        <td>${formData.projectName}</td>
      </tr>
      <tr>
        <td>📂 Category:</td>
        <td>${formData.complaintCategory}</td>
      </tr>
      <tr>
        <td>📅 Date & Time:</td>
        <td>${formData.submissionDate} at ${formData.submissionTime}</td>
      </tr>
      <tr>
        <td>📧 Confirmation To:</td>
        <td>${formData.email}</td>
      </tr>
    </table>
    <br>
    <p style="font-size:13px; color:#388e3c; margin-top:10px;">
      📬 A confirmation email will be sent to your registered email within
      <strong>5 minutes</strong>.<br>
      Please save your <strong>Complaint ID</strong> for tracking purposes.
    </p>
    <button class="print-btn" onclick="window.print()">
      🖨️ Print / Save Acknowledgement
    </button>
  `;

  // ── Set Progress to 100% ───────────────────────────
  document.getElementById('progressBar').style.width = '100%';

  // ── Scroll to Success Message ──────────────────────
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
