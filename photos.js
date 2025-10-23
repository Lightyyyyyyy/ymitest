document.addEventListener('DOMContentLoaded', () => {
    
    const totalPhotos = 19;
    const photoContainer = document.getElementById('photoContainer');
    const NEXT_PAGE_URL = 'final-page.html'; // Set your final page URL

    // --- Canvas Setup ---
    const canvas = document.getElementById('threadCanvas');
    const ctx = canvas.getContext('2d');
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Store final positions, count finished photos, AND thread colors
    const photoPositions = new Array(totalPhotos); 
    const threadColors = new Array(totalPhotos); // NEW: Array for colors
    let finishedPhotos = 0;

    // --- NEW: Generate 19 distinct colors ---
    function generateColors() {
        for (let i = 0; i < totalPhotos; i++) {
            // Generate color using HSL for better variety
            const hue = (i * (360 / totalPhotos)) % 360;
            threadColors[i] = `hsl(${hue}, 80%, 60%)`; // Saturation 80%, Lightness 60%
        }
    }
    generateColors(); // Generate colors right away
    // --- END NEW ---

    // Loop 19 times to create photos
    for (let i = 1; i <= totalPhotos; i++) {
        const photo = document.createElement('div');
        photo.classList.add('photo');
        photo.id = `p${i}`; 
        photo.style.backgroundImage = `url(img${i}.jpg)`;
        
        photo.addEventListener('animationend', handlePhotoAnimationEnd);
        
        photoContainer.appendChild(photo);
    }

    // --- Main Animation Logic ---

    // This runs when ANY photo finishes its *initial* animation
    function handlePhotoAnimationEnd(event) {
        const photoEl = event.target;
        
        photoEl.removeEventListener('animationend', handlePhotoAnimationEnd);

        const photoIndex = parseInt(photoEl.id.substring(1)) - 1; 

        // Calculate and store final center position
        const rect = photoEl.getBoundingClientRect();
        const photoX = rect.left + (rect.width / 2);
        const photoY = rect.top + (rect.height / 2);
        
        if(photoIndex >= 0 && photoIndex < totalPhotos) {
             photoPositions[photoIndex] = { x: photoX, y: photoY };
        } else {
             photoPositions[photoIndex] = { x: centerX, y: centerY }; 
        }

        // Draw the thread IMMEDIATELY with its specific color
        drawThread(photoX, photoY, threadColors[photoIndex]); // Pass color

        finishedPhotos++;

        // If all photos have landed, start the 4-second hold
        if (finishedPhotos === totalPhotos) {
            startHoldTimer();
        }
    }
    
    // Timer after collage is complete
    function startHoldTimer() {
        setTimeout(flyPhotosAway, 4000); // 4-second hold
    }

    // Fly Photos Away Logic (using Transitions)
    function flyPhotosAway() {
        const allPhotos = document.querySelectorAll('.photo');
        const flyAwayDuration = 1000; 

        allPhotos.forEach((photo) => {
            const computedStyle = window.getComputedStyle(photo);
            const currentTransform = computedStyle.transform;
            const currentTop = computedStyle.top;
            const currentLeft = computedStyle.left;
            
            photo.style.animationName = 'none'; 
            
            photo.style.top = currentTop;
            photo.style.left = currentLeft;
            photo.style.transform = currentTransform; 
            photo.style.opacity = '1'; 

            void photo.offsetWidth; 

            // Target styles for fly away
            photo.style.transform = 'scale(5)'; 
            photo.style.opacity = '0';          
        });

        // After the transition finishes (1s) PLUS 0.5s delay
        setTimeout(() => {
            photoContainer.style.opacity = '0'; 
            photoContainer.style.pointerEvents = 'none'; 

            // Start the thread circle animation
            animateThreadsToCircle();
        }, flyAwayDuration + 500); // 1000ms transition + 500ms delay
    }
   
    // Draw a single thread (NOW ACCEPTS COLOR)
    function drawThread(x, y, color) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;         // Use the specific color
        ctx.lineWidth = 4;               // 1. Make thread bolder (increased from 2)
        ctx.shadowColor = color;         // 3. Set glow color to match thread
        ctx.shadowBlur = 18;             // 3. Set glow intensity (increased from 10)
        ctx.stroke();
    }

    // Animate threads forming a circle (NOW USES STORED COLORS)
    function animateThreadsToCircle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        const radius = Math.min(canvas.width, canvas.height) * 0.3; 
        let animationProgress = 0;

        function drawFrame() {
            animationProgress += 0.02; 
            if (animationProgress > 1) animationProgress = 1;

            // Clear canvas each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < totalPhotos; i++) {
                const circleAngle = (i / totalPhotos) * (Math.PI * 2);
                const circleX = centerX + Math.cos(circleAngle) * radius;
                const circleY = centerY + Math.sin(circleAngle) * radius;

                const startPos = photoPositions[i] || { x: centerX, y: centerY }; 

                const currentX = lerp(startPos.x, circleX, animationProgress);
                const currentY = lerp(startPos.y, circleY, animationProgress);

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = threadColors[i]; // Use the stored color
                ctx.lineWidth = 3;               // Bold
                ctx.shadowColor = threadColors[i]; // Glow color
                ctx.shadowBlur = 12;             // Glow intensity
                ctx.stroke();
            }

            if (animationProgress < 1) {
                requestAnimationFrame(drawFrame);
            } else {
                // Circle is complete, trigger final zoom
                setTimeout(triggerFinalTransition, 1000); // Hold circle for 1s
            }
        }
        
        drawFrame();
    }

    // Trigger the final zoom and page change
    function triggerFinalTransition() {
        canvas.classList.add('zoom-in'); 
        setTimeout(() => {
            window.location.href = NEXT_PAGE_URL;
        }, 1500); // Must match CSS animation time
    }

    // Helper function for smooth animation
    function lerp(start, end, amount) {
        return start * (1 - amount) + end * amount;
    }

    // Handle window resizing (basic)
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
        // Ideally redraw threads, but skipping for simplicity
    });
}); // End of DOMContentLoaded