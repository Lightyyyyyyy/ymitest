document.addEventListener('DOMContentLoaded', () => {
    const cakeWrapper = document.getElementById('cakeWrapper'); 
    const leftFlame = document.getElementById('leftFlame');
    const rightFlame = document.getElementById('rightFlame');
    const instructionText = document.getElementById('instructionText');
    const blowSound = document.getElementById('blowSound');
    const NEXT_PAGE_URL = 'photos.html'; // URL for the next page

    // Make flames AND instruction text visible after a short delay (1 second)
    setTimeout(() => {
        leftFlame.classList.add('visible');
        rightFlame.classList.add('visible');
        instructionText.classList.add('visible');
    }, 1000); 

    // Auto-hide instruction text after 3 seconds
    setTimeout(() => {
        if (instructionText.classList.contains('visible')) {
            instructionText.classList.remove('visible');
            setTimeout(() => {
                instructionText.style.display = 'none';
            }, 500); // Wait for CSS transition (1s) to finish
        }
    }, 5000); 

    // Handle the click event to blow out the flames
    cakeWrapper.addEventListener('click', () => { 
        // Check if the flames are currently lit and the process hasn't started
        if (leftFlame.classList.contains('visible') && !cakeWrapper.classList.contains('processing')) { 
            
            // Mark as processing to prevent rapid multiple clicks
            cakeWrapper.classList.add('processing');

            // 1. Play the sound effect INSTANTLY (with the click)
            if (blowSound) {
                blowSound.currentTime = 0; 
                blowSound.play().catch(e => console.error("Error playing sound:", e));
            }

            // 2. Hide the instruction text INSTANTLY
            instructionText.classList.remove('visible');
            instructionText.style.display = 'none';

            // 3. Apply the 400ms (0.4 second) delay before the visual blowout
            setTimeout(() => {
                
                // Blowout visual happens AFTER the delay
                leftFlame.classList.add('blown-out');
                rightFlame.classList.add('blown-out');
                
                // Final clean-up
                cakeWrapper.style.cursor = 'default';
                cakeWrapper.classList.remove('processing');
                
                // --- NEW 1.5s DELAY & TRANSITION ---
                // Start 1.5s delay *after* blowout
                setTimeout(() => {
                    // Fade out the whole cake wrapper
                    cakeWrapper.classList.add('fade-out'); 
                    
                    // Wait for fade and then change page
                    setTimeout(() => {
                        window.location.href = NEXT_PAGE_URL;
                    }, 1000); // 1s fade-out time
                }, 1500); // <-- This is your 1.5s delay
                // --- END NEW LOGIC ---

            }, 400); // **400 milliseconds (0.4 seconds) delay for the flames**
        }
    });
});