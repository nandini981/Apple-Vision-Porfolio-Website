document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // MOBILE HAMBURGER NAV
    // =====================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const navSidebar = document.getElementById('navSidebar');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    function openMobileNav() {
        navSidebar.classList.add('mobile-open');
        mobileNavOverlay.classList.add('open');
        hamburgerIcon.className = 'ph ph-x';
    }

    function closeMobileNav() {
        navSidebar.classList.remove('mobile-open');
        mobileNavOverlay.classList.remove('open');
        hamburgerIcon.className = 'ph ph-list';
    }

    hamburgerBtn.addEventListener('click', () => {
        if (navSidebar.classList.contains('mobile-open')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    mobileNavOverlay.addEventListener('click', closeMobileNav);

    // =====================================================
    // NAVIGATION LOGIC — SPA Tab Switching
    // =====================================================
    const navItems = document.querySelectorAll('.nav-sidebar .nav-item');

    function navigateToTarget(target) {
        // Update nav active state
        navItems.forEach(n => n.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-target="${target}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Swap Main Panel Content
        document.querySelectorAll('.panel-inner-scroll .tab-content').forEach(tc => {
            tc.classList.remove('active');
        });
        const mainContent = document.getElementById('content-' + target);
        if (mainContent) mainContent.classList.add('active');

        // Swap Notes Panel Content
        document.querySelectorAll('.notes-content .tab-content').forEach(tc => {
            tc.classList.remove('active');
        });
        const notesContent = document.getElementById('notes-' + target);
        if (notesContent) notesContent.classList.add('active');

        // Reset scroll positions
        const mainScroll = document.querySelector('.panel-inner-scroll');
        if (mainScroll) mainScroll.scrollTop = 0;
        const notesScroll = document.querySelector('.notes-content');
        if (notesScroll) notesScroll.scrollTop = 0;

        // Close mobile nav after navigation
        closeMobileNav();
    }

    // Expose globally so inline onclick can use it
    window.navigateTo = navigateToTarget;

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateToTarget(item.dataset.target);
        });
    });

    // =====================================================
    // CONTACT FORM SUBMIT HANDLER
    // =====================================================
    window.handleFormSubmit = function(e) {
        e.preventDefault();
        const feedback = document.getElementById('formFeedback');
        feedback.style.display = 'block';
        e.target.reset();
        setTimeout(() => { feedback.style.display = 'none'; }, 5000);
    };

    // =====================================================
    // PARALLAX — only on desktop (no touch devices)
    // =====================================================
    const isTouchDevice = window.matchMedia('(max-width: 960px)').matches || ('ontouchstart' in window);

    if (!isTouchDevice) {
        const panels = document.querySelectorAll('.hover-lift');
        const background = document.querySelector('.environment-background');

        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth)  * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });

        function animate() {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            if (background) {
                background.style.transform = `translate3d(${targetX * -18}px, ${targetY * -18}px, 0)`;
            }

            const time = Date.now() * 0.001;

            panels.forEach((panel, index) => {
                const speed = parseFloat(panel.dataset.speed || 1);
                const depth = parseFloat(panel.dataset.depth || 0.1);

                const moveX   = targetX * 80 * speed * depth;
                const moveY   = targetY * 80 * speed * depth;
                const rotateX = -targetY * 1.5 * speed;
                const rotateY =  targetX * 1.5 * speed;
                const breathe = Math.sin(time + index * 1.5) * 3;

                panel.style.transform = `
                    translate3d(${moveX}px, calc(${moveY}px + ${breathe}px), 0px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // =====================================================
    // MOUSE GLOW on interactive elements (desktop only)
    // =====================================================
    if (!isTouchDevice) {
        const interactives = document.querySelectorAll('.interactive');
        interactives.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    }

});
