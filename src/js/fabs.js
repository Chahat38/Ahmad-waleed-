export function initFabs() {
  const social = document.getElementById('fabSocial');
  const main = document.getElementById('fabSocialMain');
  if (social && main) {
    main.addEventListener('click', () => social.classList.toggle('open'));
  }
}
