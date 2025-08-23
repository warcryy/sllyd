// Parallax Effect
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.hero-image, .about-image, .experience-image, .waitlist-image');
    
    window.addEventListener('scroll', function() {
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



    // Email input validation and form handling
    const emailInputs = document.querySelectorAll('.email-input');
    const joinButtons = document.querySelectorAll('.join-btn');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

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

    joinButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const email = emailInputs[index].value;
            
            if (validateEmail(email)) {
                // Show success message
                showNotification('Thank you! You\'ve been added to our waitlist.', 'success');
                emailInputs[index].value = '';
                button.style.background = '#333333';
                button.style.color = '#888888';
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
});
