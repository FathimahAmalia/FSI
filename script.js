/* ==========================================================================
   PT FORTUNET SOLUSI INDONESIA — ANIMATION & INTERACTION ENGINE
   Scroll-Reveal | Navbar Shrink | Modal | Form Handler
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ─────────────────────────────────────────────────────────────────
    // 1. NAVBAR: Shrink on scroll + Mobile Menu Toggle
    // ─────────────────────────────────────────────────────────────────
    const header = document.querySelector(".intek-header");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    // Scroll shrink effect
    const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load

    // Mobile toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-open");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.className = navMenu.classList.contains("mobile-open")
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";
            }
        });
        document.querySelectorAll(".nav-item a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("mobile-open");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. SCROLL REVEAL (Intersection Observer)
    //    Automatically adds .reveal to all target elements,
    //    then toggles .visible when they enter the viewport.
    // ─────────────────────────────────────────────────────────────────

    // Map of selector → reveal variant class
    const revealTargets = [
        { selector: ".section-heading",      variant: "" },
        { selector: ".intek-heading-title",  variant: "" },
        { selector: ".intek-divider",        variant: "" },
        { selector: ".timeline-item",        variant: "" },
        { selector: ".cat-card",             variant: "reveal-scale" },
        { selector: ".product-banner-card",  variant: "reveal-scale" },
        { selector: ".partner-item",         variant: "" },
        { selector: ".contact-details-side", variant: "reveal-left" },
        { selector: ".contact-form-side",    variant: "reveal-right" },
        { selector: ".banner-content-box",   variant: "" },
        { selector: ".footer-left",          variant: "reveal-left" },
        { selector: ".footer-right",         variant: "reveal-right" },
        { selector: ".nda-callout",          variant: "" },
    ];

    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target); // fire once only
            }
        });
    }, observerOptions);

    revealTargets.forEach(({ selector, variant }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add("reveal");
            if (variant) el.classList.add(variant);

            // Stagger siblings of same class
            const delayClass = `reveal-d${Math.min(index + 1, 6)}`;
            el.classList.add(delayClass);

            revealObserver.observe(el);
        });
    });

    // ─────────────────────────────────────────────────────────────────
    // 3. PRODUCT SPECIFICATION MODAL
    // ─────────────────────────────────────────────────────────────────
    const productModal = document.getElementById("productModal");
    const modalClose   = document.getElementById("modalClose");
    const modalDismissBtn = document.getElementById("modalDismissBtn");
    const modalTitle   = document.getElementById("modalTitle");
    const modalCode    = document.getElementById("modalCode");
    const modalDesc    = document.getElementById("modalDesc");
    const modalSpecsContent = document.getElementById("modalSpecsContent");
    const modalInquireBtn   = document.getElementById("modalInquireBtn");

    document.querySelectorAll(".view-modal-trigger").forEach(card => {
        card.addEventListener("click", () => {
            const name  = card.getAttribute("data-name")  || "Specialized Hardware";
            const code  = card.getAttribute("data-code")  || "FSI-HW-01";
            const desc  = card.getAttribute("data-desc")  || "Professional cybersecurity and defense equipment.";
            const specs = card.getAttribute("data-specs") || "";

            if (modalTitle) modalTitle.textContent = name;
            if (modalCode)  modalCode.textContent  = code;
            if (modalDesc)  modalDesc.textContent  = desc;

            if (modalSpecsContent) {
                const specsList = specs.split("|").map(s => s.trim()).filter(Boolean);
                let specsHtml = "<ul>";
                specsList.forEach(s => {
                    specsHtml += `<li><i class="fa-solid fa-check"></i> <span>${s}</span></li>`;
                });
                specsHtml += "</ul>";
                modalSpecsContent.innerHTML = specsHtml;
            }

            if (modalInquireBtn) {
                const encodedMsg = encodeURIComponent(
                    `Hello Fortunet Solusi Indonesia, I would like to request an official quotation for: ${name} (${code})`
                );
                modalInquireBtn.setAttribute("href", `https://wa.me/6281234567890?text=${encodedMsg}`);
                modalInquireBtn.setAttribute("target", "_blank");
            }

            if (productModal) {
                productModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    function closeModal() {
        if (productModal) {
            productModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    if (modalClose)      modalClose.addEventListener("click", closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeModal);
    if (productModal) {
        productModal.addEventListener("click", (e) => {
            if (e.target === productModal) closeModal();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && productModal?.classList.contains("active")) {
            closeModal();
        }
    });

    // ─────────────────────────────────────────────────────────────────
    // 4. SMOOTH ANCHOR SCROLL (for in-page links like #contact)
    // ─────────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                const headerH = header ? header.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────
    // 5. SECTION HEADING ACCENT LINE (decorative animation)
    // ─────────────────────────────────────────────────────────────────
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("heading-animated");
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll(".intek-heading-title").forEach(el => {
        headingObserver.observe(el);
    });

});

// ─────────────────────────────────────────────────────────────────────────
// 6. CONTACT FORM SUBMISSION
// ─────────────────────────────────────────────────────────────────────────
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn  = form.querySelector("#submitBtn");
    const formFeedback = document.getElementById("formFeedback");

    if (!form || !submitBtn) return false;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending Message...";
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = "Message Sent!";
        submitBtn.style.backgroundColor = "#10b981";

        if (formFeedback) {
            formFeedback.className = "form-feedback success";
            formFeedback.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Thank you. Your message has been received. Our team will contact you shortly.';
        }

        form.reset();

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "";
            if (formFeedback) formFeedback.className = "form-feedback hidden";
        }, 5000);
    }, 800);

    return false;
}
