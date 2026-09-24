// ===== BANCO DE TEMAS (conteúdos escolares) =====
// Cada tema tem um nome e 4 palavras. O jogo sorteia 4 temas por partida.
const BANCO_DE_TEMAS = [
  { nome: "Matérias Escolares", palavras: ["Matemática", "História", "Geografia", "Português"] },
  { nome: "Materiais Escolares", palavras: ["Lápis", "Borracha", "Apontador", "Régua"] },
  { nome: "Planetas do Sistema Solar", palavras: ["Marte", "Vênus", "Júpiter", "Saturno"] },
  { nome: "Partes da Célula", palavras: ["Núcleo", "Membrana", "Citoplasma", "Mitocôndria"] },
  { nome: "Figuras Geométricas", palavras: ["Triângulo", "Círculo", "Quadrado", "Trapézio"] },
  { nome: "Autores da Literatura", palavras: ["Machado", "Clarice", "Drummond", "Guimarães"] },
  { nome: "Elementos Químicos", palavras: ["Oxigênio", "Hidrogênio", "Carbono", "Ferro"] },
  { nome: "Operações Matemáticas", palavras: ["Adição", "Subtração", "Multiplicação", "Divisão"] },
  { nome: "Estados Físicos da Água", palavras: ["Sólido", "Líquido", "Gasoso", "Vapor"] },
  { nome: "Épocas do Ano", palavras: ["Verão", "Outono", "Inverno", "Primavera"] },
  { nome: "Órgãos do Corpo Humano", palavras: ["Coração", "Pulmão", "Fígado", "Rim"] },
  { nome: "Séries Históricas do Brasil", palavras: ["Colônia", "Império", "República", "Ditadura"] },
];

// ===== ESTADO DO JOGO =====
let temasDaPartida = [];
let palavrasRestantes = [];
let selecionadas = [];
let erros = 0;
let resolvidos = 0;

// ===== ELEMENTOS =====
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const telaVitoria = document.getElementById("tela-vitoria");
const grade = document.getElementById("grade");
const areaResolvidos = document.getElementById("grupos-resolvidos");
const mensagem = document.getElementById("mensagem");
const contadorErros = document.getElementById("tentativas");

// ===== NAVEGAÇÃO =====
document.getElementById("btn-jogue").addEventListener("click", () => {
  iniciarPartida();
  mostrarTela(telaJogo);
});

document.getElementById("btn-voltar").addEventListener("click", () => mostrarTela(telaInicial));

document.getElementById("btn-novamente").addEventListener("click", () => {
  iniciarPartida();
  mostrarTela(telaJogo);
});

document.getElementById("btn-embaralhar").addEventListener("click", () => {
  embaralhar(palavrasRestantes);
  renderizarGrade();
});

function mostrarTela(tela) {
  [telaInicial, telaJogo, telaVitoria].forEach(t => t.classList.remove("ativa"));
  tela.classList.add("ativa");
}

// ===== LÓGICA DO JOGO =====
function iniciarPartida() {
  // Sorteia 4 temas diferentes do banco
  temasDaPartida = embaralhar([...BANCO_DE_TEMAS]).slice(0, 4);

  // Cria a lista de 16 palavras, cada uma "lembrando" o tema a que pertence
  palavrasRestantes = [];
  temasDaPartida.forEach((tema, idTema) => {
    tema.palavras.forEach(p => {
      palavrasRestantes.push({ texto: p, tema: idTema });
    });
  });

  embaralhar(palavrasRestantes);
  selecionadas = [];
  erros = 0;
  resolvidos = 0;
  areaResolvidos.innerHTML = "";
  contadorErros.textContent = "Erros: 0";
  mensagem.textContent = "Selecione 4 palavras que tenham algo em comum!";
  document.getElementById("data").textContent = new Date().toLocaleDateString("pt-BR");
  renderizarGrade();
}

function renderizarGrade() {
  grade.innerHTML = "";
  palavrasRestantes.forEach((p, i) => {
    const btn = document.createElement("div");
    btn.className = "palavra";
    btn.textContent = p.texto;
    btn.dataset.indice = i;
    btn.addEventListener("click", () => selecionarPalavra(i, btn));
    grade.appendChild(btn);
  });
}

function selecionarPalavra(indice, elemento) {
  const jaSelecionada = selecionadas.findIndex(s => s.indice === indice);

  // Clique numa já selecionada = desseleciona
  if (jaSelecionada !== -1) {
    selecionadas.splice(jaSelecionada, 1);
    elemento.classList.remove("selecionada");
    return;
  }

  // Máximo de 4 selecionadas
  if (selecionadas.length === 4) return;

  selecionadas.push({ indice, tema: palavrasRestantes[indice].tema });
  elemento.classList.add("selecionada");

  if (selecionadas.length === 4) verificarGrupo();
}

function verificarGrupo() {
  const mesmoTema = selecionadas.every(s => s.tema === selecionadas[0].tema);

  if (mesmoTema) {
    // ACERTOU: move o grupo para a área de resolvidos (como na 3ª imagem)
    const tema = temasDaPartida[selecionadas[0].tema];
    const palavrasDoGrupo = selecionadas.map(s => palavrasRestantes[s.indice].texto);

    const cartao = document.createElement("div");
    cartao.className = "cartao-grupo";
    cartao.innerHTML = `<h2>${tema.nome}</h2><p>${palavrasDoGrupo.join(", ")}</p>`;
    areaResolvidos.appendChild(cartao);

    // Remove as palavras da grade
    const indices = selecionadas.map(s => s.indice).sort((a, b) => b - a);
    indices.forEach(i => palavrasRestantes.splice(i, 1));

    resolvidos++;
    mensagem.textContent = "🎉 Grupo correto! Continue assim.";
    selecionadas = [];
    renderizarGrade();

    if (resolvidos === 4) {
      setTimeout(() => {
        document.getElementById("erros-finais").textContent = erros;
        mostrarTela(telaVitoria);
      }, 800);
    }
  } else {
    // ERROU: tremer e desselecionar
    erros++;
    contadorErros.textContent = `Erros: ${erros}`;
    mensagem.textContent = "❌ Essas palavras não formam um grupo. Tente de novo!";

    selecionadas.forEach(s => {
      const el = grade.querySelector(`[data-indice="${s.indice}"]`);
      if (el) {
        el.classList.add("errada");
        setTimeout(() => el.classList.remove("errada", "selecionada"), 450);
      }
    });
    selecionadas = [];
  }
}

// Fisher-Yates
function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
