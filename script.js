const CONFIG = {
  recipientName: "Megan",
  datePlan: "ALL DAY",
  letterText:
    "Hi Megan!\nI am sorry that I cannot be with you physically but I will always be here to support and love you wherever we are. I wanted to try to make something silly and sweet for you regardless of the distance. NOTHING WILL STOP US MUAHHAHA. I am so lucky to call you my girlfriend and valentine. I cannot wait to go on a date with you and celebrate our first Valentines of many with you. I love you!\n\nLove,\nSean",
  photoList: [],
  noMessages: [
    "Are you sure?",
    "Wait…",
    "Be nice 😭",
    "You sure you want to say no?",
    "Last chance!!",
    "I made this just for you…",
  ],
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const recipientNameEl = document.getElementById("recipientName");
const startButton = document.getElementById("startButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const noMessage = document.getElementById("noMessage");
const datePlan = document.getElementById("datePlan");
const openNote = document.getElementById("openNote");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const letterText = document.getElementById("letterText");
const copyLetter = document.getElementById("copyLetter");
const shareLink = document.getElementById("shareLink");
const modalStatus = document.getElementById("modalStatus");
const askArea = document.getElementById("askArea");
const confettiCanvas = document.getElementById("confetti");
const heartsContainer = document.querySelector(".floating-hearts");
const carousel = document.getElementById("carousel");
const carouselTrack = document.getElementById("carouselTrack");

let noClicks = 0;
let yesScale = 1;
let noScale = 1;
let carouselIndex = 0;
let carouselTimer = null;

const scenes = Array.from(document.querySelectorAll(".scene"));

const showScene = (id) => {
  scenes.forEach((scene) => {
    scene.classList.toggle("is-active", scene.id === id);
  });
};

const updateContent = () => {
  if (recipientNameEl) {
    recipientNameEl.textContent = CONFIG.recipientName || "you";
  }
  if (datePlan) {
    datePlan.textContent = "Now you owe me a date ALL DAYYYY MUAHAHAHAH!!!!";
  }
  if (letterText) {
    letterText.textContent = CONFIG.letterText;
  }
};

const sprinkleHearts = (count = 16) => {
  if (!heartsContainer) return;
  heartsContainer.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    const size = 10 + Math.random() * 14;
    const duration = 7 + Math.random() * 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 4;

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${left}vw`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.opacity = `${0.4 + Math.random() * 0.4}`;
    heartsContainer.appendChild(heart);
  }
};

const placeNoButton = () => {
  if (!noButton || !askArea) return;
  const areaRect = askArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const padding = 6;
  const maxLeft = Math.max(padding, areaRect.width - buttonRect.width - padding);
  const maxTop = Math.max(padding, areaRect.height - buttonRect.height - padding);

  const left = padding + Math.random() * (maxLeft - padding);
  const top = padding + Math.random() * (maxTop - padding);

  noButton.style.left = `${left}px`;
  noButton.style.top = `${top}px`;
};

const updateNoMessage = () => {
  const messages = CONFIG.noMessages.length
    ? CONFIG.noMessages
    : ["Pretty please?"];
  const message = messages[noClicks % messages.length];
  if (noMessage) {
    noMessage.textContent = message;
  }
};

const shrinkNoButton = () => {
  if (!noButton) return;
  noScale = Math.max(0.05, noScale - 0.12);
  noButton.style.transform = `scale(${noScale})`;
  if (noScale <= 0.08) {
    noButton.style.opacity = "0";
    noButton.style.pointerEvents = "none";
  }
};

const growYesButton = () => {
  if (!yesButton) return;
  yesScale = Math.min(1.4, yesScale + 0.06);
  yesButton.style.transform = `scale(${yesScale})`;
};

const celebrate = () => {
  showScene("scene-celebrate");
  if (!prefersReducedMotion) {
    startConfetti();
    sprinkleHearts(22);
  }
};

const openModal = () => {
  if (!modalOverlay) return;
  modalOverlay.classList.add("is-open");
  modalOverlay.setAttribute("aria-hidden", "false");
};

const closeModalAction = () => {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("is-open");
  modalOverlay.setAttribute("aria-hidden", "true");
  if (modalStatus) modalStatus.textContent = "";
};

const setStatus = (text) => {
  if (modalStatus) modalStatus.textContent = text;
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }
};

const setupCarousel = () => {
  if (!carousel || !carouselTrack) return;
  if (!CONFIG.photoList.length) {
    carousel.classList.remove("is-active");
    return;
  }

  carousel.classList.add("is-active");
  carouselTrack.innerHTML = "";
  CONFIG.photoList.forEach((photo, index) => {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = `Memory ${index + 1}`;
    if (index === 0) img.classList.add("is-active");
    carouselTrack.appendChild(img);
  });

  if (prefersReducedMotion || CONFIG.photoList.length === 1) return;
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    const images = carouselTrack.querySelectorAll("img");
    images[carouselIndex].classList.remove("is-active");
    carouselIndex = (carouselIndex + 1) % images.length;
    images[carouselIndex].classList.add("is-active");
  }, 3000);
};

const startConfetti = () => {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext("2d");
  const colors = ["#ff4f91", "#ff7fb3", "#ffd2e5", "#ff9bb8"];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    size: 6 + Math.random() * 6,
    speed: 2 + Math.random() * 3,
    drift: -1 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
  }));

  const resize = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  resize();

  let startTime = performance.now();
  const duration = 3800;

  const animate = (time) => {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += 0.05;
      if (p.y > confettiCanvas.height + 20) {
        p.y = -20;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  };

  requestAnimationFrame(animate);
};

updateContent();
sprinkleHearts();
setupCarousel();

if (startButton) {
  startButton.addEventListener("click", () => {
    showScene("scene-ask");
    setTimeout(placeNoButton, 80);
  });
}

if (noButton) {
  noButton.addEventListener("click", () => {
    noClicks += 1;
    updateNoMessage();
    growYesButton();
    shrinkNoButton();
    placeNoButton();
  });
}

if (yesButton) {
  yesButton.addEventListener("click", celebrate);
}

if (openNote) {
  openNote.addEventListener("click", openModal);
}

if (closeModal) {
  closeModal.addEventListener("click", closeModalAction);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModalAction();
    }
  });
}

if (copyLetter) {
  copyLetter.addEventListener("click", async () => {
    await copyText(CONFIG.letterText);
    setStatus("Message copied to clipboard.");
  });
}

if (shareLink) {
  shareLink.addEventListener("click", async () => {
    const shareData = {
      title: "Be my Valentine",
      text: "A little Valentine for you 💗",
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("Shared! 💖");
    } else {
      await copyText(window.location.href);
      setStatus("Link copied to clipboard.");
    }
  });
}

window.addEventListener("resize", () => {
  placeNoButton();
});
