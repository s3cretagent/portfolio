document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.toggle('light');

  if (root.classList.contains('light')) {
    root.style.setProperty('--bg', '#fafaf9');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--muted', '#4b5563');
    root.style.setProperty('--white', '#111827');
    root.style.setProperty('--accent', '#ffb703');
    root.style.setProperty('--accent2', '#219ebc');
    document.body.style.background =
      'linear-gradient(180deg, #fff7e6 0%, #fafafa 100%)';
  } else {
    root.style.setProperty('--bg', '#0f0f0f');
    root.style.setProperty('--card', '#1b1b1b');
    root.style.setProperty('--muted', '#b0b0b0');
    root.style.setProperty('--white', '#fefefe');
    root.style.setProperty('--accent', '#ffb703');
    root.style.setProperty('--accent2', '#219ebc');
    document.body.style.background =
      'radial-gradient(circle at 10% 10%, #1a1a1a 0%, #0f0f0f 100%)';
  }
});

function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = encodeURIComponent(form.name.value.trim());
  const email = encodeURIComponent(form.email.value.trim());
  const message = encodeURIComponent(form.message.value.trim());
  const subj = encodeURIComponent('Portfolio contact from ' + name);
  const body = encodeURIComponent(
    `Name: ${name}%0AEmail: ${email}%0A%0A${message}`
  );
  window.location.href = `mailto:shubhmalhotra07@gmail.com?subject=${subj}&body=${body}`;
  return false;
}
