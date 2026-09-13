/* ============================================================
   شیء تنظیمات — فقط همین بخش را برای به‌روزرسانی اطلاعات ویرایش کنید
   ============================================================ */
const CONFIG = {
  // نام گربه (در چند جای صفحه به‌صورت خودکار جایگزین می‌شود)
  catName: "مایکی",

  // وضعیت مالی — همه به تومان و به‌صورت عدد ساده (بدون کاما) وارد شوند
  totalCost: 45000000,   // هزینهٔ کل درمان
  collected: 1000000,           // مبلغ جمع‌آوری‌شده تا این لحظه — این را به‌روزرسانی کنید

  // اطلاعات کارت بانکی برای کمک
  cardNumber: "XXXX-XXXX-XXXX-XXXX",
  cardOwner: "نام صاحب حساب",

  // اطلاعات تماس
  phone: "۰۹xxxxxxxxx",     // فقط برای نمایش
  phoneHref: "+98",         // برای لینک tel: — به‌صورت بین‌المللی وارد کنید، مثل +989123456789
  instagram: "instagram_id@",
  instagramUrl: "https://instagram.com/",
  telegram: "telegram_id@",
  telegramUrl: "https://t.me/",
};

/* ============================================================
   از این خط به بعد نیازی به ویرایش نیست
   ============================================================ */
(function () {
  "use strict";

  const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

  function toPersianNumber(num) {
    return num
      .toLocaleString("en-US")
      .replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
  }

  function formatToman(num) {
    return `${toPersianNumber(Math.max(0, Math.round(num)))} تومان`;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function applyConfig() {
    // نام گربه در همهٔ عناصر دارای کلاس cat-name + چند آی‌دی خاص
    document.querySelectorAll(".cat-name").forEach((el) => {
      el.textContent = CONFIG.catName;
    });
    setText("topbar-cat-name", CONFIG.catName);
    setText("hero-cat-name", CONFIG.catName);

    // وضعیت مالی
    const total = CONFIG.totalCost;
    const collected = Math.min(CONFIG.collected, total);
    const remaining = Math.max(total - collected, 0);
    const percent = total > 0 ? Math.round((collected / total) * 100) : 0;

    setText("finance-total", "");
    const totalEl = document.getElementById("finance-total");
    if (totalEl) {
      totalEl.innerHTML = `${toPersianNumber(total)} <small>تومان</small>`;
    }
    setText("finance-collected", formatToman(collected));
    setText("finance-remaining", formatToman(remaining));
    setText("progress-percent", `${toPersianNumber(percent)}٪`);
    setText("sticky-remaining", formatToman(remaining));

    const fill = document.getElementById("progress-fill");
    const bar = document.getElementById("progress-bar");
    if (fill) {
      // تأخیر کوچک برای اجرای انیمیشن پر شدن نوار
      requestAnimationFrame(() => {
        setTimeout(() => { fill.style.width = `${percent}%`; }, 150);
      });
    }
    if (bar) bar.setAttribute("aria-valuenow", String(percent));

    // اطلاعات کارت
    setText("card-number", CONFIG.cardNumber);
    setText("card-owner", CONFIG.cardOwner);

    // اطلاعات تماس
    setText("contact-phone-text", CONFIG.phone);
    setText("contact-instagram-text", CONFIG.instagram);
    setText("contact-telegram-text", CONFIG.telegram);

    const phoneLink = document.getElementById("contact-phone");
    if (phoneLink) phoneLink.setAttribute("href", `tel:${CONFIG.phoneHref}`);
    const instaLink = document.getElementById("contact-instagram");
    if (instaLink) instaLink.setAttribute("href", CONFIG.instagramUrl);
    const tgLink = document.getElementById("contact-telegram");
    if (tgLink) tgLink.setAttribute("href", CONFIG.telegramUrl);

    document.title = `کمک کنیم ${CONFIG.catName} دوباره راه بره ❤️`;
  }

  function showToast(message) {
    const toast = document.getElementById("copy-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      showToast(successMessage);
    } catch (err) {
      showToast("کپی انجام نشد؛ لطفاً به‌صورت دستی کپی کنید.");
    }
  }

  function setupCopyButtons() {
    const copyCardBtn = document.getElementById("copy-card-btn");
    if (copyCardBtn) {
      copyCardBtn.addEventListener("click", () => {
        copyText(CONFIG.cardNumber, "شمارهٔ کارت کپی شد ✅");
      });
    }

    const copyLinkBtn = document.getElementById("copy-link-btn");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        copyText(window.location.href, "لینک صفحه کپی شد ✅");
      });
    }
  }

  function setupGalleryFilter() {
    const tabs = document.querySelectorAll(".gallery__tab");
    const items = document.querySelectorAll(".gallery__item");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        const filter = tab.getAttribute("data-filter");

        items.forEach((item) => {
          const match = filter === "all" || item.getAttribute("data-filter") === filter;
          item.hidden = !match;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    setupCopyButtons();
    setupGalleryFilter();
  });
})();
