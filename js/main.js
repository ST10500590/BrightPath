/* =====================================================
   main.js — BrightPath Interactive Features
   Requires: jQuery (loaded in <head>)
===================================================== */

$(function () {

    /* ─── Scroll Reveal ─────────────────────────────── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 80);
                    revealObserver.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ─── Animated Counters ─────────────────────────── */
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                counterObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));


    /* ─── Accordion ─────────────────────────────────── */
    $(document).on('click', '.accordion-header', function () {
        const item = $(this).closest('.accordion-item');
        const wasOpen = item.hasClass('open');

        // Close all in the same group
        item.closest('.accordion-group').find('.accordion-item').removeClass('open');

        // Toggle clicked item
        if (!wasOpen) item.addClass('open');
    });


    /* ─── Tabs ───────────────────────────────────────── */
    $(document).on('click', '.tab-btn', function () {
        const target = $(this).data('tab');
        const group  = $(this).closest('.tabs-wrapper');

        group.find('.tab-btn').removeClass('active');
        group.find('.tab-content').removeClass('active');

        $(this).addClass('active');
        group.find('#' + target).addClass('active');
    });


    /* ─── Modals ─────────────────────────────────────── */
    // Open
    $(document).on('click', '[data-modal]', function () {
        const id = $(this).data('modal');
        $('#' + id).addClass('open');
        $('body').css('overflow', 'hidden');
    });

    // Close button
    $(document).on('click', '.modal-close, .modal-overlay', function (e) {
        if ($(e.target).hasClass('modal-overlay') || $(e.target).hasClass('modal-close')) {
            $('.modal-overlay').removeClass('open');
            $('body').css('overflow', '');
        }
    });

    // ESC key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('.modal-overlay').removeClass('open');
            $('.lightbox').removeClass('open');
            $('body').css('overflow', '');
        }
    });


    /* ─── Back to Top ────────────────────────────────── */
    const backBtn = $('#back-to-top');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) backBtn.addClass('visible');
        else backBtn.removeClass('visible');
    });

    backBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });


    /* ─── Toast Helper ───────────────────────────────── */
    window.showToast = function (msg) {
        const toast = $('#toast');
        toast.text(msg).addClass('show');
        setTimeout(() => toast.removeClass('show'), 3200);
    };


    /* ─── Form Validation + Toast ────────────────────── */
    $(document).on('submit', 'form.validated-form', function (e) {
        e.preventDefault();
        let valid = true;

        $(this).find('[required]').each(function () {
            const val = $(this).val().trim();
            if (!val) {
                $(this).addClass('input-error').removeClass('input-success');
                $(this).next('.form-error').show();
                valid = false;
            } else {
                $(this).addClass('input-success').removeClass('input-error');
                $(this).next('.form-error').hide();
            }
        });

        if (valid) {
            const msg = $(this).data('success') || 'Submitted successfully!';
            showToast('✅ ' + msg);
            this.reset();
            $(this).find('input, textarea').removeClass('input-success input-error');
        }
    });


    /* ─── Smooth anchor scroll ───────────────────────── */
    $(document).on('click', 'a[href^="#"]', function (e) {
        const target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 80 }, 500);
        }
    });

});
