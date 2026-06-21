/* =====================================================
   forms.js — BrightPath Form Validation & Processing
   Handles: enquiry.html + contact.html
===================================================== */

/* ══════════════════════════════════════════════════
   VALIDATION UTILITIES
══════════════════════════════════════════════════ */
const Validate = {

    /* South African phone: 0xx xxx xxxx or +27xx xxx xxxx */
    phone(val) {
        return /^(\+27|0)[6-8][0-9]{8}$/.test(val.replace(/[\s\-]/g, ''));
    },

    email(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
    },

    /* Must be a future date */
    futureDate(val) {
        if (!val) return false;
        return new Date(val) > new Date();
    },

    /* minLen ≤ length ≤ maxLen */
    length(val, min, max) {
        const l = val.trim().length;
        return l >= min && (!max || l <= max);
    },

    /* Letters, spaces, hyphens only — min 2 chars */
    name(val) {
        return /^[A-Za-zÀ-ÿ\s\-']{2,}$/.test(val.trim());
    },

    /* Positive number */
    positiveNumber(val) {
        return !isNaN(val) && Number(val) > 0;
    },
};

/* ══════════════════════════════════════════════════
   UI HELPERS
══════════════════════════════════════════════════ */
function fieldError($field, msg) {
    $field.addClass('input-error').removeClass('input-success');
    let $err = $field.siblings('.form-error');
    if (!$err.length) $err = $('<span class="form-error"></span>').insertAfter($field);
    $err.text(msg).show();
}

function fieldOk($field) {
    $field.addClass('input-success').removeClass('input-error');
    $field.siblings('.form-error').hide();
}

function fieldReset($field) {
    $field.removeClass('input-error input-success');
    $field.siblings('.form-error').hide();
}

/* Live character counter */
function attachCounter($textarea, max) {
    const $counter = $(`<span class="char-counter">0 / ${max} characters</span>`).insertAfter($textarea);
    $textarea.on('input', function () {
        const len = $(this).val().length;
        $counter.text(`${len} / ${max} characters`);
        $counter.css('color', len > max ? '#cc0000' : len >= max * 0.9 ? '#e07b00' : '#888');
    });
}

/* Reference number generator */
function genRef() {
    return 'BP-' + Date.now().toString(36).toUpperCase().slice(-6);
}

/* ══════════════════════════════════════════════════
   ENQUIRY FORM
══════════════════════════════════════════════════ */
function initEnquiryForm() {
    const $form = $('#enquiry-form');
    if (!$form.length) return;

    /* Set minimum date on date pickers to tomorrow */
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    $('[type="date"]').attr('min', minDate);

    /* ── Dynamic section reveal ── */
    $('#enquiry-type').on('change', function () {
        const type = $(this).val();
        $('.dynamic-section').hide().find('input,select,textarea').prop('required', false);
        if (type) {
            $(`#section-${type}`).show()
                .find('[data-required]').prop('required', true);
        }
        fieldReset($(this));
    });

    /* ── Live validation on blur ── */
    $form.on('blur', '#enq-name', function () {
        Validate.name($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid full name (letters only, at least 2 characters).');
    });

    $form.on('blur', '#enq-email', function () {
        Validate.email($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid email address (e.g. name@domain.com).');
    });

    $form.on('blur', '#enq-phone', function () {
        const v = $(this).val().trim();
        if (!v) { fieldReset($(this)); return; }
        Validate.phone(v) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid South African number (e.g. 072 123 4567 or +27721234567).');
    });

    $form.on('blur', '#enq-dob', function () {
        const dob = new Date($(this).val());
        const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
        if (isNaN(age) || age < 5 || age > 120) {
            fieldError($(this), 'Please enter a valid date of birth.');
        } else fieldOk($(this));
    });

    $form.on('blur', '#enq-start-date', function () {
        Validate.futureDate($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please select a future date.');
    });

    $form.on('blur', '#enq-sponsor-amount', function () {
        Validate.positiveNumber($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid sponsorship amount greater than 0.');
    });

    $form.on('blur', '#enq-org', function () {
        Validate.length($(this).val(), 2, 120) ? fieldOk($(this)) : fieldError($(this), 'Organisation name must be between 2 and 120 characters.');
    });

    $form.on('blur', '#enq-message', function () {
        Validate.length($(this).val(), 10, 1000) ? fieldOk($(this)) : fieldError($(this), 'Message must be between 10 and 1000 characters.');
    });

    /* ── Submit ── */
    $form.on('submit', function (e) {
        e.preventDefault();
        if (!validateEnquiryForm()) return;
        buildEnquiryResponse();
    });
}

function validateEnquiryForm() {
    let ok = true;

    const name  = $('#enq-name').val();
    const email = $('#enq-email').val();
    const type  = $('#enquiry-type').val();
    const phone = $('#enq-phone').val().trim();

    if (!Validate.name(name))  { fieldError($('#enq-name'),  'Please enter a valid full name.'); ok = false; }
    else fieldOk($('#enq-name'));

    if (!Validate.email(email)) { fieldError($('#enq-email'), 'Please enter a valid email address.'); ok = false; }
    else fieldOk($('#enq-email'));

    if (phone && !Validate.phone(phone)) { fieldError($('#enq-phone'), 'Please enter a valid SA phone number.'); ok = false; }
    else if (phone) fieldOk($('#enq-phone'));

    if (!type) { fieldError($('#enquiry-type'), 'Please select an enquiry type.'); ok = false; }
    else fieldOk($('#enquiry-type'));

    /* Section-specific validation */
    if (type === 'volunteering') {
        const skills = $('#enq-skills').val();
        if (!Validate.length(skills, 10, 500)) {
            fieldError($('#enq-skills'), 'Please describe your skills (10–500 characters).'); ok = false;
        } else fieldOk($('#enq-skills'));

        if (!$('#enq-availability').val()) {
            fieldError($('#enq-availability'), 'Please select your availability.'); ok = false;
        } else fieldOk($('#enq-availability'));
    }

    if (type === 'programme') {
        if (!$('#enq-programme').val()) {
            fieldError($('#enq-programme'), 'Please select a programme.'); ok = false;
        } else fieldOk($('#enq-programme'));

        if (!Validate.futureDate($('#enq-start-date').val())) {
            fieldError($('#enq-start-date'), 'Please select a future preferred start date.'); ok = false;
        } else fieldOk($('#enq-start-date'));

        const dob = new Date($('#enq-dob').val());
        const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
        if (isNaN(age) || age < 5 || age > 120) {
            fieldError($('#enq-dob'), 'Please enter a valid date of birth.'); ok = false;
        } else fieldOk($('#enq-dob'));
    }

    if (type === 'sponsorship') {
        if (!Validate.length($('#enq-org').val(), 2, 120)) {
            fieldError($('#enq-org'), 'Please enter a valid organisation name (2–120 chars).'); ok = false;
        } else fieldOk($('#enq-org'));

        if (!Validate.positiveNumber($('#enq-sponsor-amount').val())) {
            fieldError($('#enq-sponsor-amount'), 'Please enter a sponsorship amount greater than R0.'); ok = false;
        } else fieldOk($('#enq-sponsor-amount'));
    }

    const msg = $('#enq-message').val();
    if (msg && !Validate.length(msg, 10, 1000)) {
        fieldError($('#enq-message'), 'Message must be 10–1000 characters.'); ok = false;
    } else if (msg) fieldOk($('#enq-message'));

    return ok;
}

/* ── Response Card Data ─────────────────────────── */
const PROGRAMME_INFO = {
    'youth-skills':   { name: 'Youth Skills Training',   cost: 'Free', intake: 'Monthly — next intake: 7 July 2026',  capacity: '12 spots remaining', duration: '6 weeks (Saturdays 09:00–13:00)' },
    'homework':       { name: 'Homework Support',        cost: 'Free', intake: 'Ongoing — join any Monday',           capacity: '8 spots remaining',  duration: 'Ongoing (Mon–Thu 14:00–17:00)' },
    'wellness':       { name: 'Wellness Support',        cost: 'Free', intake: 'Monthly — next session: 5 July 2026', capacity: 'Open registration',  duration: 'Monthly workshops (first Saturday)' },
    'digital':        { name: 'Digital Literacy Bootcamp', cost: 'Free', intake: 'Next cohort: 22 September 2026',    capacity: '6 spots remaining',  duration: '1 day (09:00–16:00)' },
    'leadership':     { name: 'Youth Leadership Camp',   cost: 'Free', intake: 'Annual — 10 August 2026',             capacity: '14 spots remaining', duration: '3 days residential (10–12 Aug)' },
};

const VOLUNTEER_INFO = {
    'weekdays':   { schedule: 'Monday – Friday', commitment: '2–5 hours per day', note: 'Ideal for tutoring and programme support.' },
    'weekends':   { schedule: 'Saturdays and/or Sundays', commitment: '3–6 hours per day', note: 'Skills training and events support.' },
    'evenings':   { schedule: 'Mon–Fri evenings (17:00–20:00)', commitment: '2–3 hours per session', note: 'Online tutoring and admin support.' },
    'flexible':   { schedule: 'Flexible / remote',  commitment: 'As available', note: 'Great for graphic design, writing, social media.' },
};

function buildEnquiryResponse() {
    const ref    = genRef();
    const name   = $('#enq-name').val().trim().split(' ')[0];
    const type   = $('#enquiry-type').val();
    const email  = $('#enq-email').val().trim();
    let html     = '';

    if (type === 'programme') {
        const key  = $('#enq-programme').val();
        const info = PROGRAMME_INFO[key] || {};
        const startPref = $('#enq-start-date').val();
        html = `
            <div class="response-card">
                <div class="response-icon">&#127979;</div>
                <h2>Programme Enquiry Confirmed</h2>
                <p>Hi <strong>${name}</strong>, thank you for enquiring about <strong>${info.name}</strong>!
                   Here are the details for your interest:</p>
                <table class="response-table">
                    <tr><th>Programme</th><td>${info.name}</td></tr>
                    <tr><th>Cost</th><td><span style="color:#15803d;font-weight:bold">${info.cost}</span></td></tr>
                    <tr><th>Next Intake</th><td>${info.intake}</td></tr>
                    <tr><th>Duration</th><td>${info.duration}</td></tr>
                    <tr><th>Availability</th><td>${info.capacity}</td></tr>
                    <tr><th>Your Preferred Start</th><td>${startPref || 'Not specified'}</td></tr>
                    <tr><th>Confirmation Sent To</th><td>${email}</td></tr>
                    <tr><th>Reference Number</th><td><strong>${ref}</strong></td></tr>
                </table>
                <div class="response-next">
                    <strong>&#9989; Next Steps:</strong>
                    <ol>
                        <li>A BrightPath coordinator will contact you within <strong>2 business days</strong> to confirm your place.</li>
                        <li>You will receive a welcome pack with programme details and a schedule.</li>
                        <li>No payment is required — all BrightPath programmes are <strong>completely free</strong>.</li>
                    </ol>
                </div>
                <p style="font-size:13px;color:#888;margin-top:10px">Please save your reference number <strong>${ref}</strong> for follow-up queries.</p>
            </div>`;

    } else if (type === 'volunteering') {
        const avail = $('#enq-availability').val();
        const info  = VOLUNTEER_INFO[avail] || {};
        const days  = $('#enq-days-per-week').val() || 'Not specified';
        html = `
            <div class="response-card">
                <div class="response-icon">&#128101;</div>
                <h2>Volunteer Application Received</h2>
                <p>Hi <strong>${name}</strong>, thank you for your interest in volunteering with BrightPath!
                   Here is a summary of your application and what to expect:</p>
                <table class="response-table">
                    <tr><th>Availability</th><td>${info.schedule || avail}</td></tr>
                    <tr><th>Typical Commitment</th><td>${info.commitment || 'To be confirmed'}</td></tr>
                    <tr><th>Days per Week</th><td>${days}</td></tr>
                    <tr><th>Role Suitability</th><td>${info.note || 'To be matched by our team'}</td></tr>
                    <tr><th>Application Email</th><td>${email}</td></tr>
                    <tr><th>Reference Number</th><td><strong>${ref}</strong></td></tr>
                </table>
                <div class="response-next">
                    <strong>&#9989; Next Steps:</strong>
                    <ol>
                        <li>Our Volunteer Coordinator will review your application and <strong>contact you within 3 business days</strong>.</li>
                        <li>You will be invited for a brief orientation session (in-person or online).</li>
                        <li>Volunteer induction takes place on the first Saturday of each month.</li>
                    </ol>
                </div>
            </div>`;

    } else if (type === 'sponsorship') {
        const org    = $('#enq-org').val().trim();
        const amount = parseFloat($('#enq-sponsor-amount').val());
        let tier = '', perks = '';
        if (amount >= 50000) { tier = 'Platinum Sponsor &#127775;';  perks = 'Full logo placement on all materials, dedicated event naming rights, annual impact report, media coverage.'; }
        else if (amount >= 20000) { tier = 'Gold Sponsor &#129351;';   perks = 'Logo on website & event banners, quarterly impact report, social media recognition.'; }
        else if (amount >= 10000) { tier = 'Silver Sponsor &#129352;'; perks = 'Logo on website, bi-annual impact report, certificate of appreciation.'; }
        else if (amount >= 5000)  { tier = 'Bronze Sponsor &#129353;'; perks = 'Name listed on website, annual thank-you letter, certificate of appreciation.'; }
        else                      { tier = 'Community Supporter &#128155;'; perks = 'Named in our newsletter and website acknowledgements.'; }

        html = `
            <div class="response-card">
                <div class="response-icon">&#127981;</div>
                <h2>Sponsorship Enquiry Received</h2>
                <p>Hi <strong>${name}</strong>, thank you for <strong>${org}</strong>'s interest in sponsoring BrightPath!
                   Based on your indicated amount, here is your provisional sponsorship tier:</p>
                <table class="response-table">
                    <tr><th>Organisation</th><td>${org}</td></tr>
                    <tr><th>Amount Indicated</th><td><strong>R${Number(amount).toLocaleString('en-ZA')}</strong></td></tr>
                    <tr><th>Sponsorship Tier</th><td><strong>${tier}</strong></td></tr>
                    <tr><th>Benefits &amp; Perks</th><td>${perks}</td></tr>
                    <tr><th>Tax Certificate</th><td>Available — BrightPath is a registered Section 18A NPO</td></tr>
                    <tr><th>Contact Email</th><td>${email}</td></tr>
                    <tr><th>Reference Number</th><td><strong>${ref}</strong></td></tr>
                </table>
                <div class="response-next">
                    <strong>&#9989; Next Steps:</strong>
                    <ol>
                        <li>Our Partnerships Manager will contact you within <strong>2 business days</strong> with a formal sponsorship proposal.</li>
                        <li>A Memorandum of Agreement (MoA) will be provided for your legal team's review.</li>
                        <li>Section 18A tax certificates are issued upon receipt of funds.</li>
                    </ol>
                </div>
            </div>`;
    }

    /* Hide form, show response */
    $('#enquiry-form').slideUp(300, function () {
        $('#enquiry-response').html(html).slideDown(400);
        $('html, body').animate({ scrollTop: $('#enquiry-response').offset().top - 100 }, 500);
    });
}

/* ══════════════════════════════════════════════════
   CONTACT FORM (mailto compilation)
══════════════════════════════════════════════════ */
function initContactForm() {
    const $form = $('#contact-form');
    if (!$form.length) return;

    attachCounter($('#contact-msg'), 2000);

    /* ── Live validation ── */
    $form.on('blur', '#contact-name', function () {
        Validate.name($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please enter your full name (letters only, at least 2 characters).');
    });

    $form.on('blur', '#contact-email', function () {
        Validate.email($(this).val()) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid email address.');
    });

    $form.on('blur', '#contact-phone', function () {
        const v = $(this).val().trim();
        if (!v) { fieldReset($(this)); return; }
        Validate.phone(v) ? fieldOk($(this)) : fieldError($(this), 'Please enter a valid South African phone number (e.g. 072 123 4567).');
    });

    $form.on('blur', '#contact-subject', function () {
        Validate.length($(this).val(), 3, 100) ? fieldOk($(this)) : fieldError($(this), 'Subject must be 3–100 characters.');
    });

    $form.on('blur', '#contact-msg', function () {
        Validate.length($(this).val(), 20, 2000) ? fieldOk($(this)) : fieldError($(this), 'Message must be 20–2000 characters.');
    });

    /* ── Submit → compile mailto ── */
    $form.on('submit', function (e) {
        e.preventDefault();
        if (!validateContactForm()) return;

        const name     = $('#contact-name').val().trim();
        const email    = $('#contact-email').val().trim();
        const phone    = $('#contact-phone').val().trim();
        const msgType  = $('#contact-msg-type').val();
        const subject  = $('#contact-subject').val().trim();
        const message  = $('#contact-msg').val().trim();
        const ref      = genRef();

        const emailSubject = `[${msgType}] ${subject} — ${ref}`;
        const emailBody    =
`BrightPath Community Outreach Centre
Contact Form Submission
Reference: ${ref}
──────────────────────────────
FROM:    ${name}
EMAIL:   ${email}
PHONE:   ${phone || 'Not provided'}
TYPE:    ${msgType}
SUBJECT: ${subject}
──────────────────────────────
MESSAGE:

${message}
──────────────────────────────
Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
`;

        const mailtoLink = `mailto:info@brightpath.org.za?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        /* Show preview modal, then open mailto */
        const $preview = $(`
            <div class="modal-overlay open" id="email-preview-modal">
              <div class="modal-box">
                <button class="modal-close">&times;</button>
                <span class="modal-badge">&#128140; Ready to Send</span>
                <h2 style="color:#6a0dad;margin-bottom:12px">Review Your Message</h2>
                <div class="email-preview">
                  <p><strong>To:</strong> info@brightpath.org.za</p>
                  <p><strong>Subject:</strong> ${emailSubject}</p>
                  <hr style="border:none;border-top:1px solid #e0d0f0;margin:10px 0">
                  <pre style="white-space:pre-wrap;font-family:inherit;font-size:13px;color:#444;max-height:240px;overflow-y:auto">${$('<div>').text(emailBody).html()}</pre>
                </div>
                <p style="font-size:13px;color:#888;margin-top:10px">
                  Clicking <strong>Send Email</strong> will open your default email client with this message pre-filled.
                </p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">
                  <a href="${mailtoLink}" class="btn btn-purple" id="send-email-btn">&#128140; Send Email</a>
                  <button type="button" class="btn" style="background:#f0e6ff;color:#6a0dad" id="cancel-email-btn">Cancel</button>
                </div>
              </div>
            </div>`);

        $('body').append($preview).css('overflow', 'hidden');

        $('#send-email-btn').on('click', function () {
            setTimeout(() => {
                $preview.remove();
                $('body').css('overflow', '');
                showContactSuccess(name, ref, msgType);
                $('#contact-form')[0].reset();
                $('#contact-form').find('input,select,textarea').removeClass('input-success input-error');
                $('.char-counter').text('0 / 2000 characters');
            }, 800);
        });

        $('#cancel-email-btn, .modal-close').on('click', function () {
            $preview.remove();
            $('body').css('overflow', '');
        });
    });
}

function validateContactForm() {
    let ok = true;

    if (!Validate.name($('#contact-name').val())) {
        fieldError($('#contact-name'), 'Please enter a valid full name.'); ok = false;
    } else fieldOk($('#contact-name'));

    if (!Validate.email($('#contact-email').val())) {
        fieldError($('#contact-email'), 'Please enter a valid email address.'); ok = false;
    } else fieldOk($('#contact-email'));

    const phone = $('#contact-phone').val().trim();
    if (phone && !Validate.phone(phone)) {
        fieldError($('#contact-phone'), 'Please enter a valid South African phone number.'); ok = false;
    } else if (phone) fieldOk($('#contact-phone'));

    if (!$('#contact-msg-type').val()) {
        fieldError($('#contact-msg-type'), 'Please select a message type.'); ok = false;
    } else fieldOk($('#contact-msg-type'));

    if (!Validate.length($('#contact-subject').val(), 3, 100)) {
        fieldError($('#contact-subject'), 'Subject must be 3–100 characters.'); ok = false;
    } else fieldOk($('#contact-subject'));

    if (!Validate.length($('#contact-msg').val(), 20, 2000)) {
        fieldError($('#contact-msg'), 'Message must be 20–2000 characters.'); ok = false;
    } else fieldOk($('#contact-msg'));

    return ok;
}

function showContactSuccess(name, ref, type) {
    const first = name.split(' ')[0];
    const resp  = `
        <div class="response-card" style="margin-top:20px">
            <div class="response-icon">&#9989;</div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you, <strong>${first}</strong>. Your <strong>${type}</strong> message has been prepared and sent
               to BrightPath via your email client.</p>
            <table class="response-table">
                <tr><th>Reference Number</th><td><strong>${ref}</strong></td></tr>
                <tr><th>Recipient</th><td>info@brightpath.org.za</td></tr>
                <tr><th>Message Type</th><td>${type}</td></tr>
                <tr><th>Expected Response Time</th><td>Within 2 business days (Mon–Fri, 08:00–17:00)</td></tr>
            </table>
            <p style="font-size:13px;color:#888;margin-top:10px">Please keep your reference number <strong>${ref}</strong> for any follow-up enquiries.</p>
            <button onclick="$('.response-card').slideUp();$('#contact-form').slideDown()" class="btn" style="background:#f0e6ff;color:#6a0dad;margin-top:10px">Send Another Message</button>
        </div>`;
    $('section:has(#contact-form)').append(resp);
    $('#contact-form').slideUp(300);
    $('html, body').animate({ scrollTop: $('.response-card').offset().top - 100 }, 500);
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
$(function () {
    initEnquiryForm();
    initContactForm();
});
