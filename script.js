document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.hover-lift');
    const background = document.querySelector('.environment-background');
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Normalize mouse to center of screen [-1, 1]
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // Animation Loop
    function animate() {
        // Easing for smooth follow
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Background subtle parallax
        if(background) {
            background.style.transform = `translate3d(${targetX * -20}px, ${targetY * -20}px, 0)`;
        }

        const time = Date.now() * 0.001; 

        // Apply Parallax and Tilt to main layout panels
        panels.forEach((panel, index) => {
            const speed = parseFloat(panel.dataset.speed || 1);
            const depth = parseFloat(panel.dataset.depth || 0.1);
            
            // X and Y shift based on depth
            const moveX = targetX * 100 * speed * depth;
            const moveY = targetY * 100 * speed * depth;
            
            // Subtle 3D rotation based on mouse position relative to center of screen
            // VisionOS subtle tilt
            const rotateX = -targetY * 2 * speed; // Tilt up/down
            const rotateY = targetX * 2 * speed;  // Tilt left/right
            
            // Subtle breathing floating
            const breathe = Math.sin(time + index * 1.5) * 4;
            
            panel.style.transform = `
                translate3d(${moveX}px, calc(${moveY}px + ${breathe}px), 0px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Add glowing mouse-follow highlight to interactive buttons
    const interactives = document.querySelectorAll('.interactive');
    interactives.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // We use inline CSS variable to pass coordinates to a potential background radial gradient
            // For now, the CSS hover state handles the extreme pop, but this can be used 
            // if we want to add a flashlight hover effect directly inside the button
            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-sidebar .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active state from all nav buttons
            navItems.forEach(n => n.classList.remove('active'));
            
            // Add active state to clicked button
            item.classList.add('active');
            
            const target = item.dataset.target;
            
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
            if(mainScroll) mainScroll.scrollTop = 0;
            const notesScroll = document.querySelector('.notes-content');
            if(notesScroll) notesScroll.scrollTop = 0;
        });
    });
});
