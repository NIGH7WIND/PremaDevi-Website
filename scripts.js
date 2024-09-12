// responsive nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Rolling statistics
function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let value = Math.floor(progress * (end - start) + start);
        if (id === 'funds-raised') {
            value = '$' + value.toLocaleString();
        } else {
            value = value.toLocaleString();
        }
        document.getElementById(id).textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate farmers metrics
const farmersStats = document.querySelector('.farmers-stats');
let farmersAnimated = false;
const farmersObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
    if (entry.isIntersecting && !farmersAnimated) {
    animateValue('farmers-impacted', 0, 10000, 2000);
    animateValue('yield-improvement', 0, 25, 2000);
    animateValue('cost-reduction', 0, 15, 2000);
    farmersAnimated = true;
    }
});
}, { threshold: 0.5 });
farmersObserver.observe(farmersStats);

// Animate children metrics
const childrenStats = document.querySelector('.children-stats');
let childrenAnimated = false;
const childrenObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
    if (entry.isIntersecting && !childrenAnimated) {
    animateValue('children-impacted', 0, 50000, 2000);
    animateValue('food-distributed', 0, 100000, 2000);
    animateValue('stationary-distributed', 0, 50000, 2000);
    animateValue('children-protected', 0, 20000, 2000);
    animateValue('health-camps-conducted', 0, 100, 2000);
    childrenAnimated = true;
    }
});
}, { threshold: 0.5 });
childrenObserver.observe(childrenStats);

function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let value = Math.floor(progress * (end - start) + start);
        if (id === 'funds-raised') {
            value = '$' + value.toLocaleString();
        } else if (id === 'yield-improvement' || id === 'cost-reduction') {
            value = value.toLocaleString() + '%'; // Add percentage symbol
        } else {
            value = value.toLocaleString();
        }
        document.getElementById(id).textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('section').forEach((section, index) => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

const form = document.querySelector("#volunteer-form")
const submitButton = document.querySelector("#submit")
const scriptURL = 'https://script.google.com/macros/s/AKfycbzhen3fOgPXXMGQTgDwoBlHdRxiHFhINh32Q_X7OvxrffQFVNuDA4o-Q5Mu6Vsp6X03/exec'

form.addEventListener('submit', e => {
    submitButton.disabled = true
    e.preventDefault()
    let requestBody = new FormData(form)
    fetch(scriptURL, { method: 'POST', body: requestBody})
    .then(response => {
        // Add class 'show' to the popup and popup content
        document.getElementById('thank-you-popup').classList.add('show');
        setTimeout(() => {
        document.getElementById('thank-you-popup').querySelector('.popup-content').classList.add('show');
        }, 100); // delay the popup content animation by 100ms
        submitButton.disabled = false
    })
    .catch(error => {
        alert('Error!', error.message)
        submitButton.disabled = false
    })
})

document.getElementById('close-popup').addEventListener('click', () => {
    // Remove class 'show' from the popup content first
    document.getElementById('thank-you-popup').querySelector('.popup-content').classList.remove('show');
    setTimeout(() => {
        // then remove class 'show' from the popup
        document.getElementById('thank-you-popup').classList.remove('show');
    }, 300); // delay the popup removal by 300ms

    document.getElementById('volunteer-form').reset();
})

document.addEventListener('DOMContentLoaded', function() {
    const blogSections = document.querySelectorAll('.blog-section'); // Get all blog sections

    blogSections.forEach(blogSection => {
        const blogGrid = blogSection.querySelector('.blog-grid');
        const blogPosts = blogSection.querySelectorAll('.blog-post');

        blogPosts.forEach(post => {
            post.addEventListener('click', function() {
                const wasExpanded = this.classList.contains('expanded');

                // Close any expanded posts in this section
                blogPosts.forEach(p => p.classList.remove('expanded'));

                if (!wasExpanded) {
                    // Expand the clicked post
                    this.classList.add('expanded');

                    // Move the expanded post to the top of this section's grid
                    blogGrid.prepend(this);

                    // Adjust the layout of other posts
                    let delay = 0;
                    blogPosts.forEach(p => {
                        if (p !== this) {
                            p.style.transitionDelay = `${delay}ms`;
                            delay += 50; // Stagger the animation of each card
                        }
                    });

                    // Scroll to the top of the blog section
                    blogSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Reset transition delays
                    blogPosts.forEach(p => p.style.transitionDelay = '0ms');
                }

                // Force a reflow to ensure smooth animation
                void blogGrid.offsetWidth;

                // Adjust grid layout
                if (!wasExpanded) {
                    blogGrid.style.gridTemplateColumns = '1fr';
                    setTimeout(() => {
                        blogGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
                    }, 300); // Match this to your transition duration
                } else {
                    blogGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
                }
            });
        });
    });
});
