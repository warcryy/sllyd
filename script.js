// Parallax Effect
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.hero-image, .about-image, .experience-image, .waitlist-image');
    
    // Check if device is tablet or mobile
    function isTabletOrMobile() {
        return window.innerWidth <= 1024;
    }
    
    window.addEventListener('scroll', function() {
        // Disable parallax on tablets and mobile
        if (isTabletOrMobile()) {
            parallaxElements.forEach((element) => {
                element.style.transform = 'none';
            });
            return;
        }
        
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.05); // Reduced speed to prevent overlap
            const yPos = -(scrolled * speed);
            
            // Add bounds checking to prevent extreme movements
            const maxMove = 200; // Maximum pixels to move
            const limitedYPos = Math.max(-maxMove, Math.min(maxMove, yPos));
            
            element.style.transform = `translateY(${limitedYPos}px)`;
        });
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (isTabletOrMobile()) {
            parallaxElements.forEach((element) => {
                element.style.transform = 'none';
            });
        }
    });



    // Email input validation and form handling
    const emailInputs = document.querySelectorAll('.email-input');
    const joinButtons = document.querySelectorAll('.join-btn');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Google Apps Script Web App URL for Sheets integration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxs-08TbTLsvNo91lkhOiWU-_Bc0Z3nAPiLRF7R6a6J1ouUq1II2Hn-G0rgUomjMZL/exec';

    emailInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            const email = this.value;
            const button = joinButtons[index];
            
            if (validateEmail(email)) {
                button.style.background = '#ffffff';
                button.style.color = '#000000';
            } else {
                button.style.background = '#333333';
                button.style.color = '#888888';
            }
        });
    });

    // Function to get IP address
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP:', error);
            return 'Unknown';
        }
    }

    joinButtons.forEach((button, index) => {
        button.addEventListener('click', async function() {
            const email = emailInputs[index].value;
            const source = index === 0 ? 'hero' : 'waitlist';

            if (validateEmail(email)) {
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'Joining...';

                try {
                    // Get IP address
                    const ipAddress = await getIPAddress();
                    
                    // Prepare form data with IP address
                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('source', source);
                    formData.append('ip', ipAddress);
                    formData.append('timestamp', new Date().toISOString());
                    formData.append('userAgent', navigator.userAgent);

                                         // Send data to Google Apps Script
                     const params = new URLSearchParams();
                     params.append('email', email);
                     params.append('source', source);
                     params.append('ip', ipAddress);
                     
                     // Format timestamp as M/D/YYYY H:MM:SS
                     const now = new Date();
                     const clientTimestamp = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + 
                                           now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
                     params.append('timestamp', clientTimestamp);
                     params.append('userAgent', navigator.userAgent);

                    fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                        body: params.toString(),
                        cache: 'no-store'
                    })
                    .then(() => {
                        showNotification('🎉 Successfully joined the waitlist!', 'success');
                        emailInputs[index].value = '';
                        button.style.background = '#333333';
                        button.style.color = '#888888';
                        
                        // Log the submission for debugging
                        console.log('Waitlist submission:', {
                            email: email,
                            source: source,
                            ip: ipAddress,
                            timestamp: new Date().toISOString()
                        });
                    })
                    .catch((err) => {
                        console.error('Email submit error:', err);
                        showNotification('Network error. Please check your connection.', 'error');
                    })
                    .finally(() => {
                        button.disabled = false;
                        button.textContent = originalText;
                    });
                } catch (error) {
                    console.error('Error processing submission:', error);
                    showNotification('An error occurred. Please try again.', 'error');
                    button.disabled = false;
                    button.textContent = originalText;
                }
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Feature items lazy loading animation
    const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                // Remove animation class when element is out of view
                entry.target.classList.remove('animate');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        featureObserver.observe(item);
    });

    // Mouse move parallax effect for hero section
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const rotateX = (mouseY - 0.5) * 10;
            const rotateY = (mouseX - 0.5) * 10;
            
            heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }

    // Continuous typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        let i = 0;
        let isDeleting = false;
        
        const typeWriter = () => {
            if (isDeleting) {
                // Delete characters
                heroTitle.textContent = text.substring(0, heroTitle.textContent.length - 1);
                if (heroTitle.textContent === '') {
                    isDeleting = false;
                    i = 0;
                    setTimeout(typeWriter, 1000); // Pause before typing again
                    return;
                }
                setTimeout(typeWriter, 50); // Faster deletion
            } else {
                // Type characters
                heroTitle.textContent = text.substring(0, i + 1);
                i++;
                if (i === text.length) {
                    isDeleting = true;
                    setTimeout(typeWriter, 2000); // Pause at full text
                    return;
                }
                setTimeout(typeWriter, 100); // Normal typing speed
            }
        };
        
        // Start the continuous typing effect
        setTimeout(typeWriter, 500);
    }

    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Image hover effects
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ffffff, #888888);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
        // Add visual feedback
        scrollToTopBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            scrollToTopBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Fast and smooth scroll to top using modern approach
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
