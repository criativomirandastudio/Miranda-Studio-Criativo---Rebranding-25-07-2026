(function () {
  const modal = document.getElementById('vidModal');
  const backdrop = document.getElementById('vidModalBackdrop');
  const closeBtn = document.getElementById('vidModalClose');
  const player = document.getElementById('vidModalPlayer');
  const cards = document.querySelectorAll('.vid-card');

  if (!modal || !backdrop || !closeBtn || !player || !cards.length) return;

  let lastFocused = null;

  function openModal(card) {
    const preview = card.querySelector('.vid-preview');
    if (preview) preview.pause();

    lastFocused = document.activeElement;
    player.src = card.dataset.src;
    player.currentTime = 0;
    player.muted = false;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    player.play().catch(() => {});
    closeBtn.focus();
  }

  function closeModal() {
    player.pause();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    player.removeAttribute('src');
    player.load();
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

// ═══════════════════════════════════════════════════════════
// Vídeos de preview (miniaturas com autoplay) — tocam apenas
// quando estão visíveis na tela. Evita que várias mídias rodem
// ao mesmo tempo em segundo plano, o que trava a rolagem e
// consome dados/bateria à toa (principalmente no celular).
// ═══════════════════════════════════════════════════════════
(function () {
  const previews = document.querySelectorAll('.vid-preview');
  if (!previews.length) return;

  // Sem suporte a IntersectionObserver: mantém o comportamento antigo
  if (!('IntersectionObserver' in window)) return;

  // Pausa todos de início; cada um só reproduz quando entra na tela.
  previews.forEach(video => video.pause());

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '150px 0px', threshold: 0.15 });

  previews.forEach(video => io.observe(video));
})();

// ═══════════════════════════════════════════════════════════
// Slider da página de vendas (Pack Adesivos) — usado em outra
// página do site que também carrega este script.js.
// ═══════════════════════════════════════════════════════════
const spSliderWrap = document.querySelector('.sp-slider-wrap');
if (spSliderWrap) {
  const spSlider = spSliderWrap.querySelector('.sp-slider');
  const spPrevBtn = spSliderWrap.querySelector('.sp-slider-btn--prev');
  const spNextBtn = spSliderWrap.querySelector('.sp-slider-btn--next');

  const scrollSpSlider = (direction) => {
    const scrollAmount = spSlider.clientWidth * 0.8; // Rola 80% da largura visível
    spSlider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  if (spPrevBtn && spNextBtn && spSlider) {
    spPrevBtn.addEventListener('click', () => scrollSpSlider(-1));
    spNextBtn.addEventListener('click', () => scrollSpSlider(1));
  }
}