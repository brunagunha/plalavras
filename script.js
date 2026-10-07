

// 1. Banco de grupos: cada grupo tem um tema e 4 palavras.
// Para criar novos desafios, é só adicionar mais grupos aqui.
var GRUPOS = [
  { tema: "Figuras geométricas", palavras: ["Triângulo", "Círculo", "Losango", "Trapézio"] },
  { tema: "Biomas brasileiros", palavras: ["Cerrado", "Caatinga", "Pampa", "Pantanal"] },
  { tema: "Partes da célula", palavras: ["Núcleo", "Membrana", "Citoplasma", "Ribossomo"] },
  { tema: "Classes gramaticais", palavras: ["Verbo", "Substantivo", "Adjetivo", "Advérbio"] },
  { tema: "Material escolar", palavras: ["Caderno", "Borracha", "Régua", "Mochila"] },
  { tema: "Estados da matéria", palavras: ["Sólido", "Líquido", "Gasoso", "Plasma"] },
  { tema: "Continentes", palavras: ["África", "Oceania", "Europa", "Ásia"] },
  { tema: "Planetas", palavras: ["Mercúrio", "Vênus", "Marte", "Saturno"] },
  { tema: "Operações matemáticas", palavras: ["Soma", "Subtração", "Divisão", "Multiplicação"] },
  { tema: "Figuras de linguagem", palavras: ["Metáfora", "Ironia", "Hipérbole", "Metonímia"] },
  { tema: "Elementos químicos", palavras: ["Oxigênio", "Hidrogênio", "Carbono", "Nitrogênio"] },
  { tema: "Períodos da História", palavras: ["Renascimento", "Iluminismo", "Feudalismo", "Antiguidade"] }
];

// 2. Elementos da página que vamos usar
var telaInicio = document.getElementById("inicio");
var telaJogo = document.getElementById("jogo");
var areaAcertados = document.getElementById("acertados");
var areaTabuleiro = document.getElementById("tabuleiro");
var textoMensagem = document.getElementById("msg");
var textoData = document.getElementById("data");
var textoTentativas = document.getElementById("tentativas");
var textoAcertos = document.getElementById("acertos");

// 3. Variáveis do jogo (guardam o que está acontecendo)
var grupos = [];          // os 4 grupos sorteados
var palavras = [];        // as 16 palavras na tela
var resolvidos = [];      // números dos grupos já acertados
var selecionados = [];    // palavras que o jogador clicou
var tentativas = 0;       // quantas vezes o jogador tentou

// 4. Função que embaralha uma lista
function embaralhar(lista) {
  var copia = lista.slice();   // faz uma cópia da lista
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));   // posição aleatória
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

// 5. Função que mostra uma tela e esconde a outra
function mostrarTela(nome) {
  telaInicio.classList.remove("ativa");
  telaJogo.classList.remove("ativa");
  if (nome == "inicio") {
    telaInicio.classList.add("ativa");
  } else {
    telaJogo.classList.add("ativa");
  }
}

// 6. Função que começa uma partida nova
function novaPartida() {
  // sorteia 4 grupos
  grupos = embaralhar(GRUPOS).slice(0, 4);

  // monta a lista com as 16 palavras
  palavras = [];
  for (var i = 0; i < grupos.length; i++) {
    for (var j = 0; j < grupos[i].palavras.length; j++) {
      palavras.push({ texto: grupos[i].palavras[j], grupo: i });
    }
  }
  palavras = embaralhar(palavras);

  // zera o jogo
  resolvidos = [];
  selecionados = [];
  tentativas = 0;
  textoMensagem.textContent = "";
  textoData.textContent = new Date().toLocaleDateString("pt-BR");
  desenhar();
}

// 7. Função que cria um botão de palavra
function criarBotao(palavra) {
  var botao = document.createElement("button");
  botao.className = "tile";
  botao.textContent = palavra.texto;
  if (selecionados.includes(palavra)) {
    botao.classList.add("sel");   // fica amarelo se estiver selecionada
  }
  botao.onclick = function () {
    clicarPalavra(palavra);
  };
  palavra.botao = botao;
  return botao;
}

// 8. Função que desenha tudo na tela
function desenhar() {
  textoTentativas.textContent = tentativas;
  textoAcertos.textContent = resolvidos.length;

  // faixas dos grupos acertados
  areaAcertados.innerHTML = "";
  for (var i = 0; i < resolvidos.length; i++) {
    var grupo = grupos[resolvidos[i]];
    var faixa = document.createElement("div");
    faixa.className = "acertado";
    faixa.innerHTML = "<strong>" + grupo.tema + "</strong><span>" + grupo.palavras.join(", ") + "</span>";
    areaAcertados.appendChild(faixa);
  }

  // palavras que ainda não foram acertadas
  areaTabuleiro.innerHTML = "";
  for (var k = 0; k < palavras.length; k++) {
    if (!resolvidos.includes(palavras[k].grupo)) {
      areaTabuleiro.appendChild(criarBotao(palavras[k]));
    }
  }
}

// 9. Função chamada quando o jogador clica numa palavra
function clicarPalavra(palavra) {
  if (resolvidos.length == 4) {
    return;   // o jogo já acabou
  }
  textoMensagem.textContent = "";

  if (selecionados.includes(palavra)) {
    // clicou de novo: tira a seleção
    selecionados.splice(selecionados.indexOf(palavra), 1);
  } else if (selecionados.length < 4) {
    selecionados.push(palavra);
  }
  desenhar();

  if (selecionados.length == 4) {
    setTimeout(verificar, 250);   // espera um pouquinho e confere
  }
}

// 10. Função que confere se as 4 palavras são do mesmo grupo
function verificar() {
  tentativas = tentativas + 1;

  // conta quantas palavras selecionadas são de cada grupo
  var contagem = [0, 0, 0, 0];
  for (var i = 0; i < selecionados.length; i++) {
    contagem[selecionados[i].grupo] = contagem[selecionados[i].grupo] + 1;
  }

  var grupoCerto = selecionados[0].grupo;

  if (contagem[grupoCerto] == 4) {
    // ACERTOU
    resolvidos.push(grupoCerto);
    selecionados = [];
    if (resolvidos.length == 4) {
      textoMensagem.textContent = "Parabéns! Você acertou os 4 grupos em " + tentativas + " tentativas.";
    } else {
      textoMensagem.textContent = "Grupo certo!";
    }
    desenhar();
  } else {
    // ERROU
    desenhar();
    for (var j = 0; j < selecionados.length; j++) {
      selecionados[j].botao.classList.add("erro");   // palavras tremem
    }
    if (contagem.includes(3)) {
      textoMensagem.textContent = "Quase! Falta só uma palavra.";
    } else {
      textoMensagem.textContent = "Esses não combinam. Tente de novo.";
    }
    setTimeout(limparSelecao, 450);
  }
}

// 11. Função que tira a seleção depois de um erro
function limparSelecao() {
  selecionados = [];
  desenhar();
}

// 12. Botões da página
document.getElementById("btnJogue").onclick = function () {
  novaPartida();
  mostrarTela("jogo");
};

document.getElementById("btnVoltar").onclick = function () {
  mostrarTela("inicio");
};

document.getElementById("btnNova").onclick = function () {
  novaPartida();
};

document.getElementById("btnEmbaralhar").onclick = function () {
  palavras = embaralhar(palavras);
  desenhar();
};
