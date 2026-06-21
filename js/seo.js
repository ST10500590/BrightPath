/* =====================================================
   seo.js — Off-Page SEO & UX Enhancements
   - Breadcrumb navigation
   - Social share buttons
   - Reading progress bar
   - Canonical URL checker
===================================================== */

$(function () {

    /* ─── Reading Progress Bar ───────────────────── */
    const progressBar = $('<div id="reading-progress"></div>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: '0%',
        background: 'linear-gradient(90deg, #6a0dad, #a855f7)',
        zIndex: 9999,
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
    }).appendTo('body');

    $(window).on('scroll', function () {
        const scrollTop  = $(this).scrollTop();
        const docHeight  = $(document).height() - $(this).height();
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.css('width', pct + '%');
    });


    /* ─── Breadcrumb Navigation ──────────────────── */
    const PAGE_LABELS = {
        'index.html':      'Home',
        'about.html':      'About',
        'programmes.html': 'Programmes',
        'events.html':     'Events',
        'gallery.html':    'Gallery',
        'donate.html':     'Donate',
        'volunteer.html':  'Volunteer',
        'contact.html':    'Contact',
    };

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentLabel = PAGE_LABELS[currentFile] || '';

    if (currentFile !== 'index.html' && currentLabel) {
        const breadcrumb = $(`
            <nav aria-label="Breadcrumb" id="breadcrumb" style="
                background: white;
                border-bottom: 1px solid #e0d0f0;
                padding: 8px 20px;
                font-size: 13px;
                color: #888;
            ">
                <div style="max-width:1100px;margin:auto">
                    <a href="index.html" style="color:#6a0dad;text-decoration:none;font-weight:bold">Home</a>
                    <span style="margin:0 8px;color:#c9a0ff">›</span>
                    <span style="color:#333;font-weight:bold">${currentLabel}</span>
                </div>
            </nav>
        `);
        $('header').after(breadcrumb);
    }


    /* ─── Social Share Buttons ───────────────────── */
    const pageUrl   = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    const shareWrap = $(`
        <div id="social-share" style="
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 2px;
            z-index: 500;
        ">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}"
               target="_blank" rel="noopener noreferrer"
               title="Share on Facebook"
               style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#1877f2;color:white;text-decoration:none;font-weight:bold;font-size:18px;border-radius:6px 0 0 6px;transition:width 0.2s,background 0.2s"
               aria-label="Share on Facebook">f</a>
            <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}"
               target="_blank" rel="noopener noreferrer"
               title="Share on Twitter / X"
               style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#000;color:white;text-decoration:none;font-weight:bold;font-size:15px;border-radius:6px 0 0 6px;transition:width 0.2s,background 0.2s"
               aria-label="Share on X (Twitter)">&#120143;</a>
            <a href="https://wa.me/?text=${pageTitle}%20${pageUrl}"
               target="_blank" rel="noopener noreferrer"
               title="Share on WhatsApp"
               style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#25d366;color:white;text-decoration:none;font-weight:bold;font-size:18px;border-radius:6px 0 0 6px;transition:width 0.2s,background 0.2s"
               aria-label="Share on WhatsApp">&#128172;</a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}"
               target="_blank" rel="noopener noreferrer"
               title="Share on LinkedIn"
               style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#0a66c2;color:white;text-decoration:none;font-weight:bold;font-size:14px;border-radius:6px 0 0 6px;transition:width 0.2s,background 0.2s"
               aria-label="Share on LinkedIn">in</a>
        </div>
    `);

    $('body').append(shareWrap);

    // Hide share buttons on mobile (too cramped)
    if ($(window).width() < 600) shareWrap.hide();


    /* ─── Lazy-load images (native + JS fallback) ── */
    if ('loading' in HTMLImageElement.prototype) {
        $('img:not([loading])').attr('loading', 'lazy');
    } else {
        // Intersection Observer fallback for browsers without native lazy load
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const img = e.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    lazyObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        $('img[data-src]').each(function () { lazyObserver.observe(this); });
    }


    /* ─── External link security ─────────────────── */
    $('a[href^="http"]').not('[href*="brightpath.org.za"]').each(function () {
        $(this).attr({ target: '_blank', rel: 'noopener noreferrer' });
    });


    /* ─── Keyboard accessibility for modal triggers ─ */
    $('[data-modal]').attr('role', 'button').attr('tabindex', '0').on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') $(this).trigger('click');
    });


    /* ─── Schema: WebSite SearchAction (home only) ── */
    if (currentFile === 'index.html' || currentFile === '') {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BrightPath Community Outreach Centre",
            "url": "https://www.brightpath.org.za",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.brightpath.org.za/events.html?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        });
        document.head.appendChild(script);
    }

});
