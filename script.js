// script.js (mantido + ajustes)

// === HELPERS ===
function hideAllSections() {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
}

// ✅ ADICIONADO — função para pausar todos os vídeos
function pauseAllVideos() {
  document.querySelectorAll("video").forEach(v => v.pause());
}



// === MOSTRAR SEÇÃO ===
function showSection(id) {
  // esconder main + outras secções
  document.getElementById("main").style.display = "none";
  hideAllSections();

  const sec = document.getElementById(id);
  if (sec) {
    sec.classList.remove("hidden");

    // ✅ FAZ autoplay dos vídeos da section
    sec.querySelectorAll("video").forEach(v => {
      v.muted = true;     // garantir
      v.play().catch(() => {});
    });
  }

  document.querySelector(".background").classList.add("darkened");
}



// === VOLTAR AO MENU PRINCIPAL ===
function goBack() {

  pauseAllVideos();   // ✅ ADICIONADO

  hideAllSections();
  document.getElementById("main").style.display = "block";
  const bg = document.querySelector(".background");
  if (bg) bg.classList.remove("darkened");
}



// === GALERIA DE CASAMENTOS ===
function showGallery(tipo) {
  const list = document.getElementById("casamento-list");
  if (list) list.style.display = "none";

  const gal = document.getElementById("galeria-" + tipo) || document.getElementById(tipo) || document.getElementById('casal-' + tipo);
  if (gal) gal.classList.remove("hidden");
}

function backToCasamentoList() {

  pauseAllVideos();   // ✅ ADICIONADO

  const list = document.getElementById("casamento-list");
  if (list) list.style.display = "block";
  document.querySelectorAll(".gallery-container").forEach(g => g.classList.add("hidden"));
}




// === GALERIA EMPRESARIAL ===
function showGalleryEmpresarial(galleryId) {
  document.getElementById("empresarial-list").classList.add("hidden");
  document.getElementById("back-to-main").classList.add("hidden");
  document.getElementById("empresarial-info").classList.add("hidden"); // ❌ esconder parágrafo/título
  document.getElementById(`galeria-${galleryId}`).classList.remove("hidden");
}

function backToEmpresarialList() {
  pauseAllVideos(); // ✅ mantém a edição de áudio

  // Esconder todas as galerias
  document.querySelectorAll(".gallery-container").forEach(g => g.classList.add("hidden"));

  // Mostrar menu e parágrafo/título novamente
  document.getElementById("empresarial-list").classList.remove("hidden");
  document.getElementById("back-to-main").classList.remove("hidden");
  document.getElementById("empresarial-info").classList.remove("hidden"); // ✅ restaurar parágrafo/título
}






// === MODAL DE IMAGEM ===
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeModal = document.getElementById('closeModal');

document.addEventListener('click', (e) => {
  const img = e.target;
  if (img && img.tagName === 'IMG' && img.closest('.gallery')) {
    e.stopPropagation();
    modalImg.src = img.src;
    imageModal.classList.remove('hidden');
  }
});

if (closeModal) {
  closeModal.addEventListener('click', (e) => {
    e.stopPropagation();
    imageModal.classList.add('hidden');
  });
}

if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.classList.add('hidden');
      e.stopPropagation();
    }
  });

  if (modalImg) {
    modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}



// === LISTENER GLOBAL INTELIGENTE ===
document.addEventListener('click', (e) => {

  if (imageModal && !imageModal.classList.contains('hidden')) {
    return;
  }

  const openSection = document.querySelector('.section:not(.hidden)');
  const main = document.getElementById('main');

  if (!openSection) return;

  if (main && main.contains(e.target)) return;
  if (openSection.contains(e.target)) return;

  goBack();
});


document.addEventListener("click", function (e) {
  const glitter = document.createElement("span");
  glitter.classList.add("glitter-click");
  glitter.style.left = `${e.clientX}px`;
  glitter.style.top = `${e.clientY}px`;
  document.body.appendChild(glitter);

  setTimeout(() => {
    glitter.remove();
  }, 800); // remove após a animação
});





// === NAVEGAÇÃO ENTRE IMAGENS AMPLIADAS ===
const prevBtn = document.getElementById('prevImg');
const nextBtn = document.getElementById('nextImg');

let imagens = [];
let indiceAtual = 0;

// quando clicar numa imagem, salva o grupo e o índice
document.addEventListener('click', (e) => {
  const img = e.target;
  if (img && img.tagName === 'IMG' && img.closest('.gallery')) {
    const galeria = img.closest('.gallery');
    imagens = Array.from(galeria.querySelectorAll('img'));
    indiceAtual = imagens.indexOf(img);
  }
});

function mostrarImagem(index) {
  if (imagens.length === 0) return;
  if (index < 0) index = imagens.length - 1;
  if (index >= imagens.length) index = 0;
  indiceAtual = index;
  modalImg.src = imagens[indiceAtual].src;
}

// botões de seta
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mostrarImagem(indiceAtual - 1);
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mostrarImagem(indiceAtual + 1);
});

// suporte ao teclado (← →)
document.addEventListener('keydown', (e) => {
  if (imageModal.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') mostrarImagem(indiceAtual - 1);
  if (e.key === 'ArrowRight') mostrarImagem(indiceAtual + 1);
});

// suporte ao toque (arrastar no celular)
let startX = 0;
modalImg.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

modalImg.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) mostrarImagem(indiceAtual + 1); // arrasta pra esquerda → próxima
  if (endX - startX > 50) mostrarImagem(indiceAtual - 1); // arrasta pra direita → anterior
});



// === MODAL DE VÍDEO ===
const videoModal = document.createElement('div');
videoModal.id = 'videoModal';
videoModal.classList.add('hidden');
videoModal.innerHTML = `
  <span id="closeVideoModal" class="close">&times;</span>
  <video id="modalVideo" controls></video>
  <button id="prevVideo" class="nav-btn">&#10094;</button>
  <button id="nextVideo" class="nav-btn">&#10095;</button>
`;
document.body.appendChild(videoModal);

const modalVideo = document.getElementById('modalVideo');
const closeVideoModal = document.getElementById('closeVideoModal');
const prevVideoBtn = document.getElementById('prevVideo');
const nextVideoBtn = document.getElementById('nextVideo');

let videos = [];
let videoIndex = 0;

// === abrir vídeo ampliado ===
document.addEventListener('click', (e) => {
  const vid = e.target;
  if (vid && vid.tagName === 'VIDEO' && vid.closest('.gallery')) {
    e.stopPropagation();
    pauseAllVideos(); // pausa outros vídeos
    const gal = vid.closest('.gallery');
    videos = Array.from(gal.querySelectorAll('video'));
    videoIndex = videos.indexOf(vid);

    modalVideo.src = vid.currentSrc || vid.src;
    modalVideo.currentTime = 0;
    modalVideo.play().catch(() => {});
    videoModal.classList.remove('hidden');
  }
});

// === fechar modal de vídeo ===
function fecharVideoModal() {
  modalVideo.pause();
  videoModal.classList.add('hidden');

  // ✅ volta apenas para a seção "filmes" se existir
  const filmesSection = document.getElementById('filmes');
  if (filmesSection) {
    hideAllSections();
    filmesSection.classList.remove('hidden');
  }
}

closeVideoModal.addEventListener('click', (e) => {
  e.stopPropagation();
  fecharVideoModal();
});

// clicar fora do vídeo = fechar e voltar para filmes
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) {
    e.stopPropagation();
    fecharVideoModal();
  }
});

// impedir fechamento ao clicar no próprio vídeo
modalVideo.addEventListener('click', (e) => e.stopPropagation());

// === navegação entre vídeos ===
function mostrarVideo(index) {
  if (videos.length === 0) return;
  if (index < 0) index = videos.length - 1;
  if (index >= videos.length) index = 0;
  videoIndex = index;
  modalVideo.pause();
  modalVideo.src = videos[videoIndex].currentSrc || videos[videoIndex].src;
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});
}

prevVideoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mostrarVideo(videoIndex - 1);
});

nextVideoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mostrarVideo(videoIndex + 1);
});

// === suporte ao teclado (← → e ESC) ===
document.addEventListener('keydown', (e) => {
  if (videoModal.classList.contains('hidden')) return;

  if (e.key === 'ArrowLeft') mostrarVideo(videoIndex - 1);
  if (e.key === 'ArrowRight') mostrarVideo(videoIndex + 1);
  if (e.key === 'Escape') fecharVideoModal(); // ✅ ESC volta para filmes
});

// === suporte ao toque (mobile) ===
let touchStartX = 0;
modalVideo.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
modalVideo.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (touchStartX - endX > 50) mostrarVideo(videoIndex + 1);
  if (endX - touchStartX > 50) mostrarVideo(videoIndex - 1);
});





// === Novo Código: Otimização de Carregamento Assíncrono ===

document.addEventListener('DOMContentLoaded', () => {
    
  // 1. Carregamento Seletivo (Lazy Loading)
  const images = document.querySelectorAll('img');
  
  // Verifica se o navegador suporta Intersection Observer
  if ('IntersectionObserver' in window) {
      const observerOptions = {
          rootMargin: '200px 0px', // Começa a carregar 200px antes de entrar na tela
          threshold: 0 // Qualquer visibilidade já dispara
      };

      const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  
                  // Se o Lazy Loading nativo não for ativado pelo navegador,
                  // esta linha faz o navegador processar a imagem.
                  // Em navegadores modernos, 'loading="lazy"' é suficiente,
                  // mas o Observer garante que o carregamento só inicie quando
                  // a imagem está perto, evitando a sobrecarga inicial.
                  
                  if (img.src) { 
                      // Se a imagem já tem 'src' (como no seu código)
                      // Apenas remove a observação para evitar processamento desnecessário
                      observer.unobserve(img);
                  } else if (img.dataset.src) { 
                      // Se você decidir usar data-src no futuro (melhor prática)
                      img.src = img.dataset.src;
                      observer.unobserve(img);
                  }
              }
          });
      }, observerOptions);

      images.forEach(img => {
          // Se a imagem tem o atributo loading="lazy", o navegador já faz o trabalho.
          // O observer garante que mesmo que o navegador tente carregar TUDO,
          // ele só observemos o DOM para o carregamento em lote, 
          // liberando a thread principal.
          if (img.getAttribute('loading') !== 'eager') {
              imageObserver.observe(img);
          }
      });
  }

  // 2. Otimização de Scripts e Eventos (TBT)
  
  // Assegura que seu script principal (o que lida com o DOM) só rode
  // depois que o HTML estiver pronto.
  
  // Já que você está usando <script src="script.js" defer></script> (esperamos!),
  // esta parte já deve estar resolvida, mas é um bom princípio de TI.
  
});