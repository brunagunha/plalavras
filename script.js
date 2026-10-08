


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


var telaInicio = document.getElementById("inicio");
var telaJogo = document.getElementById("jogo");
var areaAcertados = document.getElementById("acertados");
var areaTabuleiro = document.getElementById("tabuleiro");
var textoMensagem = document.getElementById("msg");
var textoData = document.getElementById("data");
var textoTentativas = document.getElementById("tentativas");
var textoAcertos = document.getElementById("acertos");


var grupos = [];          
var palavras = [];        
var resolvidos = [];      
var selecionados = [];    
var tentativas = 0;       


function embaralhar(lista) {
  var copia = lista.slice();   
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));   
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}


function mostrarTela(nome) {
  telaInicio.classList.remove("ativa");
  telaJogo.classList.remove("ativa");
  if (nome == "inicio") {
    telaInicio.classList.add("ativa");
  } else {
    telaJogo.classList.add("ativa");
  }
}


function novaPartida() {

  grupos = embaralhar(GRUPOS).slice(0, 4);

  
  palavras = [];
  for (var i = 0; i < grupos.length; i++) {
    for (var j = 0; j < grupos[i].palavras.length; j++) {
      palavras.push({ texto: grupos[i].palavras[j], grupo: i });
    }
  }
  palavras = embaralhar(palavras);

  
  resolvidos = [];
  selecionados = [];
  tentativas = 0;
  textoMensagem.textContent = "";
  textoData.textContent = new Date().toLocaleDateString("pt-BR");
  desenhar();
}


function criarBotao(palavra) {
  var botao = document.createElement("button");
  botao.className = "tile";
  botao.textContent = palavra.texto;
  if (selecionados.includes(palavra)) {
    botao.classList.add("sel");   
  }
  botao.onclick = function () {
    clicarPalavra(palavra);
  };
  palavra.botao = botao;
  return botao;
}


function desenhar() {
  textoTentativas.textContent = tentativas;
  textoAcertos.textContent = resolvidos.length;


  areaAcertados.innerHTML = "";
  for (var i = 0; i < resolvidos.length; i++) {
    var grupo = grupos[resolvidos[i]];
    var faixa = document.createElement("div");
    faixa.className = "acertado";
    faixa.innerHTML = "<strong>" + grupo.tema + "</strong><span>" + grupo.palavras.join(", ") + "</span>";
    areaAcertados.appendChild(faixa);
  }


  areaTabuleiro.innerHTML = "";
  for (var k = 0; k < palavras.length; k++) {
    if (!resolvidos.includes(palavras[k].grupo)) {
      areaTabuleiro.appendChild(criarBotao(palavras[k]));
    }
  }
}


function clicarPalavra(palavra) {
  if (resolvidos.length == 4) {
    return;   
  }
  textoMensagem.textContent = "";

  if (selecionados.includes(palavra)) {
    
    selecionados.splice(selecionados.indexOf(palavra), 1);
  } else if (selecionados.length < 4) {
    selecionados.push(palavra);
  }
  desenhar();

  if (selecionados.length == 4) {
    setTimeout(verificar, 250);   
  }
}


function verificar() {
  tentativas = tentativas + 1;


  var contagem = [0, 0, 0, 0];
  for (var i = 0; i < selecionados.length; i++) {
    contagem[selecionados[i].grupo] = contagem[selecionados[i].grupo] + 1;
  }

  var grupoCerto = selecionados[0].grupo;

  if (contagem[grupoCerto] == 4) {

    resolvidos.push(grupoCerto);
    selecionados = [];
    if (resolvidos.length == 4) {
      textoMensagem.textContent = "Parabéns! Você acertou os 4 grupos em " + tentativas + " tentativas.";
    } else {
      textoMensagem.textContent = "Grupo certo!";
    }
    desenhar();
  } else {
    
    desenhar();
    for (var j = 0; j < selecionados.length; j++) {
      selecionados[j].botao.classList.add("erro");
    }
    if (contagem.includes(3)) {
      textoMensagem.textContent = "Quase! Falta só uma palavra.";
    } else {
      textoMensagem.textContent = "Esses não combinam. Tente de novo.";
    }
    setTimeout(limparSelecao, 450);
  }
}


function limparSelecao() {
  selecionados = [];
  desenhar();
}


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
