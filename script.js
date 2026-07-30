document.addEventListener('DOMContentLoaded', function () {

  // ═══════════════════════════════════════════════════════════
  // Menu (burger) — funciona igual no mobile e no PC: abre/fecha
  // ao clicar, fecha ao clicar em um link, ao apertar Esc, ou ao
  // clicar fora do menu. Trava a rolagem da página enquanto aberto.
  // Usa delegação de evento em document (em vez de listeners presos
  // diretamente aos elementos) para funcionar mesmo se o script
  // rodar antes/depois do esperado.
  // ═══════════════════════════════════════════════════════════
  (function () {
    const hdr = document.getElementById('hdr');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    if (!hdr || !burger || !navLinks) {
      console.warn('[menu] #hdr, #burger ou #navLinks não encontrado no HTML.');
      return;
    }

    function openMenu() {
      navLinks.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      if (navLinks.classList.contains('open')) closeMenu();
      else openMenu();
    }

    // Delegação: captura o clique em qualquer lugar do documento e
    // verifica se foi no botão do menu, em um link do menu, ou fora dele.
    document.addEventListener('click', function (e) {
      if (e.target.closest('#burger')) {
        toggleMenu();
        return;
      }
      if (e.target.closest('#navLinks a')) {
        closeMenu();
        return;
      }
      if (e.target === navLinks) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });

    // Se a tela for redimensionada para um tamanho maior (ex.: girar o
    // celular ou abrir em desktop), fecha o menu para evitar estado preso.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && navLinks.classList.contains('open')) closeMenu();
    });

    // Alterna a aparência do header (ícone do menu) depois de rolar a página
    function onScroll() {
      hdr.classList.toggle('fixa', window.scrollY > 60);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // ═══════════════════════════════════════════════════════════
  // Vídeos: modal (clique para assistir) + miniaturas de preview
  // que tocam/pausam sozinhas conforme aparecem na tela.
  // ═══════════════════════════════════════════════════════════
  (function () {
    const modal = document.getElementById('vidModal');
    const backdrop = document.getElementById('vidModalBackdrop');
    const closeBtn = document.getElementById('vidModalClose');
    const player = document.getElementById('vidModalPlayer');
    const cards = document.querySelectorAll('.vid-card');
    const previews = document.querySelectorAll('.vid-preview');

    let io = null;

    // Miniaturas: tocam apenas quando visíveis na tela. Evita que várias
    // mídias rodem ao mesmo tempo em segundo plano — o que trava a
    // rolagem e consome dados/bateria à toa (principalmente no celular).
    if (previews.length && 'IntersectionObserver' in window) {
      previews.forEach(video => video.pause());

      io = new IntersectionObserver((entries) => {
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
    }

    if (!modal || !backdrop || !closeBtn || !player || !cards.length) return;

    let lastFocused = null;
    let activePreview = null;

    function openModal(card) {
      const preview = card.querySelector('.vid-preview');
      activePreview = preview || null;
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

      // Devolve a miniatura ao controle do observer, para que ele decida
      // corretamente se ela deve voltar a tocar (está visível) ou
      // continuar pausada (saiu da tela enquanto o modal estava aberto).
      if (activePreview && io) {
        io.unobserve(activePreview);
        io.observe(activePreview);
      }
      activePreview = null;
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
  // Slider da página de vendas (Pack Adesivos) — usado em outra
  // página do site que também carrega este script.js.
  // ═══════════════════════════════════════════════════════════
  (function () {
    const spSliderWrap = document.querySelector('.sp-slider-wrap');
    if (!spSliderWrap) return;

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
  })();

});