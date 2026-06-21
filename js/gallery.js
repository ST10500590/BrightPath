/* =====================================================
   gallery.js — BrightPath Lightbox Gallery
   Images sourced from Unsplash
===================================================== */

const GALLERY_ITEMS = [
  {
    src:     "https://images.unsplash.com/photo-1529390079861-591de354faf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1529390079861-591de354faf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Homework Support Programme — learners working together at the BrightPath centre",
    credit:  "Photo by Santi Vedrí on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "BrightPath educator leading a classroom session for community youth",
    credit:  "Photo by Emmanuel Ikwuegbu on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1627423896085-e3e694d88e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1627423896085-e3e694d88e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "After-school tutoring session — children attending BrightPath's homework club",
    credit:  "Photo by Emmanuel Ikwuegbu on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Community Food Drive — volunteers sorting donated food parcels for families in need",
    credit:  "Photo by Joel Muniz on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1593113616828-6f22bca04804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1593113616828-6f22bca04804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Food Drive distribution day — handing out parcels to community members",
    credit:  "Photo by Joel Muniz on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Donation collection point — community members contributing to the BrightPath food drive",
    credit:  "Photo by Joel Muniz on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1678132218412-0f18fab9b537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1678132218412-0f18fab9b537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Youth Leadership Camp — team-building activities bringing participants together",
    credit:  "Photo by Aleksandar Andreev on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1594913543505-e4fdd1d021e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1594913543505-e4fdd1d021e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Leadership Workshop — mentor guiding youth through skills development exercises",
    credit:  "Photo by Jesus Loves Austin on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1594913501571-7ddbd0583c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1594913501571-7ddbd0583c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Community workshop session — participants collaborating at the Career Expo",
    credit:  "Photo by Jesus Loves Austin on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "BrightPath youth programme participants — smiling faces reflecting community impact",
    credit:  "Photo by Roman Nguyen on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1585847812247-4482e9f6f0cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1585847812247-4482e9f6f0cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Youth outreach visit — connecting with young community members in the neighbourhood",
    credit:  "Photo by Brian Wangenheim on Unsplash",
  },
  {
    src:     "https://images.unsplash.com/photo-1633443315529-84fe2415585f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    thumb:   "https://images.unsplash.com/photo-1633443315529-84fe2415585f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    caption: "Volunteer Recognition Day — celebrating the dedication of our community volunteers",
    credit:  "Photo by Siphesihle Mchunu on Unsplash",
  },
];

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  $("#lightbox").addClass("open");
  $("body").css("overflow", "hidden");
}

function closeLightbox() {
  $("#lightbox").removeClass("open");
  $("body").css("overflow", "");
}

function updateLightbox() {
  const item = GALLERY_ITEMS[currentIndex];
  $("#lightbox-img")
    .css("opacity", 0)
    .attr("src", item.src)
    .attr("alt", item.caption)
    .on("load", function () { $(this).animate({ opacity: 1 }, 250); });
  $("#lightbox-caption").html(
    `${item.caption}<br><span style="font-size:12px;opacity:0.6">${item.credit}</span>`
  );
  // Update counter
  $("#lightbox-counter").text(`${currentIndex + 1} / ${GALLERY_ITEMS.length}`);
}

function showNext() {
  currentIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  updateLightbox();
}

$(function () {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  // Render thumbnails
  grid.innerHTML = GALLERY_ITEMS.map((item, i) => `
    <div class="gallery-item" data-index="${i}" tabindex="0"
         role="button" aria-label="View: ${item.caption}">
      <img src="${item.thumb}"
           alt="${item.caption}"
           loading="lazy">
      <div class="gallery-overlay"><span>&#128269;</span></div>
    </div>
  `).join("");

  // Staggered fade-in
  grid.querySelectorAll(".gallery-item").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 80);
  });

  // Open on click or Enter key
  $(grid).on("click", ".gallery-item", function () {
    openLightbox(parseInt($(this).data("index"), 10));
  });
  $(grid).on("keydown", ".gallery-item", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(parseInt($(this).data("index"), 10));
    }
  });

  // Lightbox controls
  $("#lightbox-close").on("click", closeLightbox);
  $("#lightbox-next").on("click", showNext);
  $("#lightbox-prev").on("click", showPrev);

  // Click backdrop to close
  $("#lightbox").on("click", function (e) {
    if ($(e.target).is("#lightbox")) closeLightbox();
  });

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if (!$("#lightbox").hasClass("open")) return;
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft")  showPrev();
    if (e.key === "Escape")     closeLightbox();
  });

  // Touch swipe support
  let touchStartX = 0;
  document.getElementById("lightbox").addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.getElementById("lightbox").addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
  }, { passive: true });
});
