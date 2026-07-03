const backToTopButton = document.querySelector('.back-to-top');
const navbar = document.querySelector('.navbar');

const setNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.pageYOffset > 50);
};

const setBackToTopState = () => {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle('active', window.pageYOffset > 300);
};

window.addEventListener('scroll', () => {
  setNavbarState();
  setBackToTopState();
});

setNavbarState();
setBackToTopState();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    window.scrollTo({
      top: targetElement.offsetTop - 72,
      behavior: 'smooth'
    });

    const navCollapse = document.querySelector('.navbar-collapse.show');
    if (navCollapse && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sections = [...document.querySelectorAll('section[id], header[id]')];
const sectionLinks = [...document.querySelectorAll('.navbar .nav-link[href^="#"]')];

const updateActiveSection = () => {
  if (!sections.length || !sectionLinks.length) return;

  const current = sections.reduce((active, section) => {
    const offset = section.offsetTop - 110;
    return window.scrollY >= offset ? section.id : active;
  }, sections[0].id);

  sectionLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', updateActiveSection);
updateActiveSection();

const projectSearchInput = document.querySelector('#project-search-input');
const projectItems = [...document.querySelectorAll('.project-item')];
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const noResults = document.querySelector('.no-results');
let activeFilter = 'all';

const filterProjects = () => {
  if (!projectItems.length) return;

  const query = projectSearchInput ? projectSearchInput.value.trim().toLowerCase() : '';
  let visibleCount = 0;

  projectItems.forEach(item => {
    const categories = item.dataset.category || '';
    const searchable = `${item.dataset.search || ''} ${item.textContent}`.toLowerCase();
    const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
    const matchesSearch = !query || searchable.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    item.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (noResults) {
    noResults.hidden = visibleCount > 0;
  }
};

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach(filterButton => {
      filterButton.classList.toggle('active', filterButton === button);
    });
    filterProjects();
  });
});

if (projectSearchInput) {
  projectSearchInput.addEventListener('input', filterProjects);
}

filterProjects();

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    const status = this.querySelector('.form-status');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    if (status) {
      status.textContent = '';
      status.className = 'form-status';
    }

    fetch(this.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Message request failed');
        }

        if (status) {
          status.textContent = 'Message sent. Thank you for reaching out.';
          status.classList.add('success');
        }
        this.reset();
      })
      .catch(error => {
        if (status) {
          status.textContent = 'The message could not be sent. Please email me directly.';
          status.classList.add('error');
        }
        console.error('Contact form error:', error);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
  });
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (window.AOS) {
  window.AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
}
