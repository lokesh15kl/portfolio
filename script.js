const GITHUB_USERNAME = "lokesh15kl";
const ROLES = ["Full-Stack Developer", "Software Developer", "Problem Solver", "Backend Enthusiast"];

const yearElement = document.getElementById("year");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const scrollProgress = document.getElementById("scroll-progress");
const dynamicRole = document.getElementById("dynamic-role");
const backToTop = document.getElementById("back-to-top");
const musicToggle = document.getElementById("music-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectSearch = document.getElementById("project-search");
const projectCards = document.querySelectorAll(".project-grid .project-card");
const projectEmpty = document.getElementById("project-empty");
const caseButtons = document.querySelectorAll(".case-btn");
const projectModal = document.getElementById("project-modal");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalChallenge = document.getElementById("modal-challenge");
const modalSolution = document.getElementById("modal-solution");
const modalImpact = document.getElementById("modal-impact");
const modalTech = document.getElementById("modal-tech");

const CASE_STUDIES = {
	erp: {
		title: "ERP Portal - Case Study",
		summary: "A full-stack internal system to centralize student and employee operations with secure role-based access.",
		challenge: "Records were distributed across manual files and disconnected flows, creating delays and accuracy issues.",
		solution: "Designed a modular ERP portal with authentication, streamlined dashboard views, and consistent data workflows.",
		impact: "Improved data accessibility, enabled faster retrieval for 300+ records, and reduced process friction for end users.",
		tech: "Java, MySQL, HTML, CSS, JavaScript",
	},
	iot: {
		title: "IoT Distance Measurement - Case Study",
		summary: "A real-time distance monitoring prototype for reliable measurement tracking in physical setups.",
		challenge: "Manual measurement checks were error-prone and not practical for continuous tracking.",
		solution: "Integrated ultrasonic sensor readings with microcontroller logic and output visualization.",
		impact: "Enabled consistent and immediate distance visibility that improved measurement reliability.",
		tech: "IoT, Ultrasonic Sensor, Microcontroller",
	},
	zerotree: {
		title: "Zero Tree - Case Study",
		summary: "A sustainability-focused innovation concept for reducing dependence on conventional paper production.",
		challenge: "Traditional paper production contributes to deforestation and high water usage.",
		solution: "Proposed an alternative material strategy using limestone powder and biodegradable resin.",
		impact: "Presented an eco-conscious concept with potential to reduce environmental stress factors.",
		tech: "Research, Material Innovation, Sustainability",
	},
	"career-portal": {
		title: "Career Portal - Case Study",
		summary: "An AI-powered career assessment platform that lets students generate practice quizzes and take guided evaluations in a secure environment.",
		challenge: "Students needed a structured way to practice career-related quizzes, generate AI-assisted assessments, and complete formal tests under controlled conditions.",
		solution: "Built a role-based assessment platform with AI-powered quiz generation, interactive practice flows, secure authentication, and a Safe Exam Browser requirement for assessment mode.",
		impact: "Enabled students to practice with tailored quizzes, reinforced exam integrity through Safe Exam Browser enforcement, and improved engagement with guided career discovery.",
		tech: "JavaScript, React, Node.js, HTML, CSS, AI Quiz Generation, Safe Exam Browser",
	},
};

if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

function setTheme(theme) {
	body.classList.remove("theme-light", "theme-dark");
	body.classList.add(theme);
	themeToggle.textContent = theme === "theme-dark" ? "☀" : "☾";
	localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme") || "theme-dark";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
	const nextTheme = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
	setTheme(nextTheme);
});

if (menuToggle) {
	menuToggle.addEventListener("click", () => {
		const isOpen = body.classList.toggle("nav-open");
		menuToggle.setAttribute("aria-expanded", String(isOpen));
	});
}

navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		body.classList.remove("nav-open");
		if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
	});
});

window.addEventListener("resize", () => {
	if (window.innerWidth > 940) {
		body.classList.remove("nav-open");
		if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
	}
});

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
			}
		});
	},
	{ threshold: 0.18 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
	const revealIndex = Array.from(element.parentElement?.children || []).indexOf(element);
	element.style.transitionDelay = `${Math.max(revealIndex * 40, 0)}ms`;
	observer.observe(element);
});

function updateScrollProgress() {
	const scrollTop = window.scrollY;
	const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
	scrollProgress.style.width = `${progress}%`;

	if (scrollTop > 420) {
		backToTop.classList.add("show");
	} else {
		backToTop.classList.remove("show");
	}
}

function setActiveNavLink() {
	const sections = document.querySelectorAll("main section[id]");
	const navLinks = document.querySelectorAll(".nav-links a");
	let activeId = "home";

	sections.forEach((section) => {
		const sectionTop = section.offsetTop - 120;
		if (window.scrollY >= sectionTop) {
			activeId = section.id;
		}
	});

	navLinks.forEach((link) => {
		const isActive = link.getAttribute("href") === `#${activeId}`;
		link.classList.toggle("active", isActive);
	});
}

window.addEventListener("scroll", () => {
	updateScrollProgress();
	setActiveNavLink();
});

backToTop.addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});

updateScrollProgress();
setActiveNavLink();

let activeFilter = "all";

function filterProjects() {
	const term = (projectSearch?.value || "").toLowerCase().trim();
	let visibleCount = 0;

	projectCards.forEach((card) => {
		const tags = (card.dataset.tags || "").toLowerCase();
		const text = card.textContent.toLowerCase();
		const filterMatch = activeFilter === "all" || tags.includes(activeFilter);
		const searchMatch = !term || tags.includes(term) || text.includes(term);
		const shouldShow = filterMatch && searchMatch;

		card.style.display = shouldShow ? "grid" : "none";
		if (shouldShow) visibleCount += 1;
	});

	if (projectEmpty) {
		projectEmpty.hidden = visibleCount !== 0;
	}
}

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		activeFilter = button.dataset.filter || "all";
		filterButtons.forEach((item) => item.classList.remove("active"));
		button.classList.add("active");
		filterProjects();
	});
});

if (projectSearch) {
	projectSearch.addEventListener("input", filterProjects);
}

filterProjects();

function openCaseStudy(caseKey) {
	const data = CASE_STUDIES[caseKey];
	if (!data || !projectModal) return;

	modalTitle.textContent = data.title;
	modalSummary.textContent = data.summary;
	modalChallenge.textContent = data.challenge;
	modalSolution.textContent = data.solution;
	modalImpact.textContent = data.impact;
	modalTech.textContent = data.tech;

	projectModal.classList.add("open");
	projectModal.setAttribute("aria-hidden", "false");
	body.classList.add("modal-open");
}

function closeCaseStudy() {
	if (!projectModal) return;
	projectModal.classList.remove("open");
	projectModal.setAttribute("aria-hidden", "true");
	body.classList.remove("modal-open");
}

caseButtons.forEach((button) => {
	button.addEventListener("click", () => {
		openCaseStudy(button.dataset.case);
	});
});

if (modalClose) {
	modalClose.addEventListener("click", closeCaseStudy);
}

if (projectModal) {
	projectModal.addEventListener("click", (event) => {
		if (event.target === projectModal) {
			closeCaseStudy();
		}
	});
}

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeCaseStudy();
	}
});

let audioContext = null;
let masterGain = null;
let ambienceNodes = [];

function setMusicButton(active) {
	if (!musicToggle) return;
	musicToggle.classList.toggle("active", active);
	musicToggle.setAttribute("aria-pressed", String(active));
	musicToggle.title = active ? "Pause ambient music" : "Play ambient music";
}

function startAmbientMusic() {
	if (audioContext) return;

	audioContext = new (window.AudioContext || window.webkitAudioContext)();
	masterGain = audioContext.createGain();
	masterGain.gain.value = 0.0001;
	masterGain.connect(audioContext.destination);

	const freqs = [146.83, 220, 293.66];
	ambienceNodes = freqs.map((frequency, index) => {
		const osc = audioContext.createOscillator();
		const gain = audioContext.createGain();
		osc.type = index % 2 === 0 ? "sine" : "triangle";
		osc.frequency.value = frequency;
		gain.gain.value = 0.018;
		osc.connect(gain);
		gain.connect(masterGain);
		osc.start();
		return { osc, gain };
	});

	masterGain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 1.2);
	setMusicButton(true);
}

function stopAmbientMusic() {
	if (!audioContext || !masterGain) return;

	masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.6);
	setTimeout(() => {
		ambienceNodes.forEach(({ osc }) => {
			try {
				osc.stop();
			} catch (error) {
				// Ignore if oscillator is already stopped.
			}
		});
		audioContext.close();
		audioContext = null;
		masterGain = null;
		ambienceNodes = [];
		setMusicButton(false);
	}, 650);
}

if (musicToggle) {
	setMusicButton(false);
	musicToggle.addEventListener("click", () => {
		if (audioContext) {
			stopAmbientMusic();
		} else {
			startAmbientMusic();
		}
	});
}

let roleIndex = 0;
setInterval(() => {
	if (!dynamicRole) return;
	dynamicRole.style.opacity = "0.2";
	setTimeout(() => {
		roleIndex = (roleIndex + 1) % ROLES.length;
		dynamicRole.textContent = ROLES[roleIndex];
		dynamicRole.style.opacity = "1";
	}, 160);
}, 2500);

const canvas = document.getElementById("particle-canvas");
const context = canvas.getContext("2d");
const particles = [];
const particleCount = window.innerWidth < 700 ? 30 : 60;

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function createParticle() {
	return {
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		size: Math.random() * 2.1 + 0.5,
		vx: (Math.random() - 0.5) * 0.4,
		vy: (Math.random() - 0.5) * 0.4,
	};
}

function initParticles() {
	particles.length = 0;
	for (let i = 0; i < particleCount; i += 1) {
		particles.push(createParticle());
	}
}

function drawParticles() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	const darkMode = body.classList.contains("theme-dark");
	context.fillStyle = darkMode ? "rgba(70, 190, 255, 0.7)" : "rgba(8, 108, 156, 0.38)";

	particles.forEach((particle) => {
		particle.x += particle.vx;
		particle.y += particle.vy;

		if (particle.x > canvas.width || particle.x < 0) particle.vx *= -1;
		if (particle.y > canvas.height || particle.y < 0) particle.vy *= -1;

		context.beginPath();
		context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
		context.fill();
	});

	for (let i = 0; i < particles.length; i += 1) {
		for (let j = i + 1; j < particles.length; j += 1) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 110) {
				context.strokeStyle = darkMode
					? `rgba(48, 169, 255, ${(1 - distance / 110) * 0.24})`
					: `rgba(20, 117, 160, ${(1 - distance / 110) * 0.18})`;
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(particles[i].x, particles[i].y);
				context.lineTo(particles[j].x, particles[j].y);
				context.stroke();
			}
		}
	}

	requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", () => {
	resizeCanvas();
	initParticles();
});

resizeCanvas();
initParticles();
drawParticles();

function formatNumber(value) {
	return new Intl.NumberFormat("en-IN").format(value);
}

function animateCount(element, target) {
	const duration = 1100;
	const startTime = performance.now();

	function frame(now) {
		const progress = Math.min((now - startTime) / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 3);
		const value = Math.floor(eased * target);
		element.textContent = formatNumber(value);
		if (progress < 1) {
			requestAnimationFrame(frame);
		}
	}

	requestAnimationFrame(frame);
}

async function loadGitHubData() {
	const repoCountElement = document.getElementById("repo-count");
	const followersElement = document.getElementById("followers-count");
	const followingElement = document.getElementById("following-count");
	const starsElement = document.getElementById("stars-count");
	const repoList = document.getElementById("repo-list");

	try {
		const [userResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
			fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
		]);

		if (!userResponse.ok || !reposResponse.ok) {
			throw new Error("Could not fetch GitHub data");
		}

		const user = await userResponse.json();
		const repos = await reposResponse.json();
		const publicRepos = repos.filter((repo) => !repo.fork);
		const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

		if (repoCountElement) animateCount(repoCountElement, user.public_repos || 0);
		if (followersElement) animateCount(followersElement, user.followers || 0);
		if (followingElement) animateCount(followingElement, user.following || 0);
		if (starsElement) animateCount(starsElement, totalStars);

		if (repoList) {
			const topRepos = publicRepos.slice(0, 6);
			repoList.innerHTML = topRepos
				.map(
					(repo) => `
					<article class="repo-card">
						<h5>${repo.name}</h5>
						<p>${repo.description ? repo.description : "No description added yet."}</p>
						<div class="repo-meta">
							<span>★ ${repo.stargazers_count}</span>
							<span>${repo.language || "Code"}</span>
						</div>
						<a href="${repo.html_url}" target="_blank" rel="noreferrer">View Repository</a>
					</article>
				`
				)
				.join("");
		}
	} catch (error) {
		if (repoList) {
			repoList.innerHTML =
				"<article class='repo-card'><h5>GitHub API Limit Reached</h5><p>Live repo data could not be loaded right now. Please refresh later.</p></article>";
		}
	}
}

loadGitHubData();

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const formData = new FormData(contactForm);
	const name = formData.get("name")?.toString().trim() || "there";
	const email = formData.get("email")?.toString().trim() || "";
	const message = formData.get("message")?.toString().trim() || "";
	const endpoint = contactForm.dataset.formspreeEndpoint || "";

	if (!message) {
		formStatus.textContent = "Please enter a message before sending.";
		return;
	}

	formStatus.textContent = "Sending your message...";

	try {
		if (!endpoint || endpoint.endsWith("your_form_id")) {
			throw new Error("Formspree endpoint is not configured");
		}

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Failed to send to Formspree");
		}

		formStatus.textContent = `Thanks ${name}. Your message was delivered successfully.`;
		contactForm.reset();
	} catch (error) {
		const subject = encodeURIComponent("Portfolio Contact Request - Lokesh Bhagat");
		const bodyMessage = encodeURIComponent(
			`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n(Direct email fallback from portfolio form)`
		);
		window.location.href = `mailto:bhagatlokesh151@gmail.com?subject=${subject}&body=${bodyMessage}`;
		formStatus.textContent = "Opened your email app to send the message directly. Configure Formspree endpoint for one-click web submission.";
	}
});