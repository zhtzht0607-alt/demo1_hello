// ===== 粒子背景 =====
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, particles = [];
    const particleCount = 80;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // 连线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== 打字效果 =====
(function () {
    const el = document.getElementById('typingText');
    if (!el) return;
    const texts = ['创意数字工作室', '品牌设计专家', 'Web开发团队', '您的创意伙伴'];
    let textIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = texts[textIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 100;

        if (!isDeleting && charIdx === current.length) {
            speed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx = (textIdx + 1) % texts.length;
            speed = 300;
        }

        setTimeout(type, speed);
    }
    setTimeout(type, 1500);
})();

// ===== 导航栏滚动效果 =====
(function () {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // 滚动时导航栏样式变化
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);

                // 当前区域高亮
                let current = '';
                sections.forEach(section => {
                    const top = section.offsetTop - 120;
                    if (window.scrollY >= top) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
})();

// ===== 滚动显示动画 =====
(function () {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
})();

// ===== 数字递增动画 =====
(function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    const animated = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animated.add(entry.target);
                const target = parseInt(entry.target.dataset.target, 10);
                const duration = 1500;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    entry.target.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        entry.target.textContent = target;
                    }
                }
                requestAnimationFrame(update);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
})();

// ===== 3D 倾斜效果 =====
(function () {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
})();

// ===== 作品筛选 =====
(function () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            workItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
        });
    });
})();

// ===== 乔鸿箴言生成器 =====
(function () {
    const quotes = [
        { text: '鸿鹄之志，乔木之基', author: '乔鸿' },
        { text: '创意是看见别人看不见的风景', author: '乔鸿' },
        { text: '每一次设计，都是一次灵魂的对话', author: '乔鸿' },
        { text: '细节决定品质，匠心成就非凡', author: '乔鸿' },
        { text: '不惧风浪，方能抵达远方', author: '乔鸿' },
        { text: '好的设计自己会说话', author: '乔鸿' },
        { text: '在平凡中发现不凡之美', author: '乔鸿' },
        { text: '用代码写诗，用像素作画', author: '乔鸿' },
        { text: '品牌的力量源于真诚的表达', author: '乔鸿' },
        { text: '唯有热爱，可抵岁月漫长', author: '乔鸿' },
    ];

    const btn = document.getElementById('generateQuote');
    const textEl = document.getElementById('quoteText');
    const authorEl = document.getElementById('quoteAuthor');
    const box = document.getElementById('quoteBox');

    if (!btn) return;

    btn.addEventListener('click', () => {
        let idx;
        do {
            idx = Math.floor(Math.random() * quotes.length);
        } while (textEl.textContent === quotes[idx].text && quotes.length > 1);

        box.style.transform = 'scale(0.95)';
        box.style.opacity = '0';

        setTimeout(() => {
            textEl.textContent = quotes[idx].text;
            authorEl.textContent = '—— ' + quotes[idx].author;
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
        }, 200);
    });
})();

// ===== 乔鸿色彩性格测试 =====
(function () {
    const colorDots = document.querySelectorAll('.color-dot');
    const resultEl = document.getElementById('colorResult');
    if (!resultEl) return;

    const colorPersonalities = {
        '蓝紫': '你拥有 <strong>蓝紫色</strong> 创意性格 —— 深邃而富有想象力，如同乔鸿的设计哲学，在理性与感性之间找到完美平衡。你天生具备战略思维，又不忘细节之美。',
        '玫红': '你拥有 <strong>玫红色</strong> 创意性格 —— 热情奔放，充满能量。你像乔鸿一样敢于打破常规，用大胆的色彩和创意点亮世界。你是天生的表达者。',
        '翠绿': '你拥有 <strong>翠绿色</strong> 创意性格 —— 清新自然，生机勃勃。你追求和谐与成长，乔鸿认为这种性格最适合打造可持续的品牌生命力。',
        '暖橙': '你拥有 <strong>暖橙色</strong> 创意性格 —— 温暖亲和，充满感染力。你擅长用情感连接用户，这正是乔鸿所推崇的 "有温度的设计" 理念。',
        '青碧': '你拥有 <strong>青碧色</strong> 创意性格 —— 清澈通透，理性优雅。你善于化繁为简，用最纯粹的方式表达最深刻的思想，是乔鸿眼中理想的极简主义者。',
    };

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            const color = dot.dataset.color;
            resultEl.innerHTML = '<p>' + colorPersonalities[color] + '</p>';
            resultEl.style.opacity = '0';
            resultEl.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
                resultEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                resultEl.style.opacity = '1';
                resultEl.style.transform = 'translateY(0)';
            });
        });
    });
})();

// ===== 点赞功能 =====
(function () {
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    const likeAnim = document.getElementById('likeAnimation');
    if (!likeBtn) return;

    let count = 837;
    let liked = false;

    // 初始化点赞数（带点随机性显得真实）
    count = Math.floor(Math.random() * 200) + 800;
    likeCount.textContent = count;

    likeBtn.addEventListener('click', () => {
        if (!liked) {
            liked = true;
            count++;
            likeCount.textContent = count;
            likeBtn.classList.add('liked');

            // 飘浮爱心
            for (let i = 0; i < 6; i++) {
                const heart = document.createElement('span');
                heart.textContent = ['❤️', '💜', '💖', '✨', '💝', '🌟'][i];
                heart.className = 'floating-heart';
                heart.style.left = Math.random() * 60 + 20 + 'px';
                heart.style.bottom = '0';
                heart.style.animationDelay = Math.random() * 0.3 + 's';
                heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
                likeBtn.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }

            // 3秒后可再次点赞
            setTimeout(() => {
                liked = false;
                likeBtn.classList.remove('liked');
            }, 3000);
        }
    });
})();

// ===== 联系表单 =====
(function () {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btn.disabled = true;

        // 模拟发送
        setTimeout(() => {
            form.style.display = 'none';
            success.style.display = 'block';
            success.style.opacity = '0';
            success.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                success.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                success.style.opacity = '1';
                success.style.transform = 'translateY(0)';
            });
        }, 1500);
    });
})();

// ===== 平滑滚动（覆盖默认行为，适配 fixed header） =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
