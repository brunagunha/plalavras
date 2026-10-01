/* ===== JavaScript ===== */
// Banco de grupos: cada grupo tem um tema e 4 palavras. Adicione quantos quiser.
const GRUPOS = [
  {tema:"Figuras geométricas", palavras:["Triângulo","Círculo","Losango","Trapézio"]},
  {tema:"Biomas brasileiros", palavras:["Cerrado","Caatinga","Pampa","Pantanal"]},
  {tema:"Partes da célula", palavras:["Núcleo","Membrana","Citoplasma","Ribossomo"]},
  {tema:"Classes gramaticais", palavras:["Verbo","Substantivo","Adjetivo","Advérbio"]},
  {tema:"Material escolar", palavras:["Caderno","Borracha","Régua","Mochila"]},
  {tema:"Estados da matéria", palavras:["Sólido","Líquido","Gasoso","Plasma"]},
  {tema:"Continentes", palavras:["África","Oceania","Europa","Ásia"]},
  {tema:"Planetas", palavras:["Mercúrio","Vênus","Marte","Saturno"]},
  {tema:"Operações matemáticas", palavras:["Soma","Subtração","Divisão","Multiplicação"]},
  {tema:"Figuras de linguagem", palavras:["Metáfora","Ironia","Hipérbole","Metonímia"]},
  {tema:"Elementos químicos", palavras:["Oxigênio","Hidrogênio","Carbono","Nitrogênio"]},
  {tema:"Períodos da História", palavras:["Renascimento","Iluminismo","Feudalismo","Antiguidade"]}
];

const $ = id => document.getElementById(id);
const embaralhar = a => { a = [...a]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

let grupos, tiles, resolvidos, selecionados, tentativas;

function mostrar(id){
  document.querySelectorAll('.tela').forEach(t => t.classList.toggle('ativa', t.id === id));
  window.scrollTo(0,0);
}

function novaPartida(){
  grupos = embaralhar(GRUPOS).slice(0,4);
  tiles = embaralhar(grupos.flatMap((g,i) => g.palavras.map(p => ({palavra:p, grupo:i}))));
  resolvidos = []; selecionados = []; tentativas = 0;
  $('data').textContent = new Date().toLocaleDateString('pt-BR');
  $('msg').textContent = '';
  desenhar();
}

function desenhar(){
  $('tentativas').textContent = tentativas;
  $('acertos').textContent = resolvidos.length;

  // grupos já acertados aparecem no topo (como na 3ª tela do protótipo)
  $('acertados').innerHTML = '';
  resolvidos.forEach(i => {
    const d = document.createElement('div');
    d.className = 'acertado';
    d.innerHTML = `<strong>${grupos[i].tema}</strong><span>${grupos[i].palavras.join(', ')}</span>`;
    $('acertados').appendChild(d);
  });

  // palavras restantes
  const tab = $('tabuleiro');
  tab.innerHTML = '';
  tiles.filter(t => !resolvidos.includes(t.grupo)).forEach(t => {
    const b = document.createElement('button');
    b.className = 'tile' + (selecionados.includes(t) ? ' sel' : '');
    b.textContent = t.palavra;
    b.onclick = () => alternar(t);
    t.el = b;
    tab.appendChild(b);
  });
}

function alternar(t){
  if (resolvidos.length === 4) return;
  const pos = selecionados.indexOf(t);
  if (pos >= 0) selecionados.splice(pos,1);
  else if (selecionados.length < 4) selecionados.push(t);
  $('msg').textContent = '';
  desenhar();
  if (selecionados.length === 4) setTimeout(verificar, 250);
}

function verificar(){
  tentativas++;
  const g = selecionados[0].grupo;
  if (selecionados.every(t => t.grupo === g)){
    resolvidos.push(g);
    selecionados = [];
    $('msg').textContent = resolvidos.length === 4
      ? `Parabéns! Você acertou os 4 grupos em ${tentativas} tentativas.`
      : 'Grupo certo!';
    desenhar();
  } else {
    const erradas = [...selecionados];
    // quantas palavras do grupo mais frequente? "Quase!" se for 3 de 4
    const cont = {}; erradas.forEach(t => cont[t.grupo] = (cont[t.grupo]||0)+1);
    const quase = Math.max(...Object.values(cont)) === 3;
    desenhar();
    erradas.forEach(t => t.el && t.el.classList.add('erro'));
    $('msg').textContent = quase ? 'Quase! Falta só uma palavra.' : 'Esses não combinam. Tente de novo.';
    setTimeout(() => { selecionados = []; desenhar(); }, 450);
    $('tentativas').textContent = tentativas;
  }
}

$('btnJogue').onclick = () => { novaPartida(); mostrar('jogo'); };
$('btnVoltar').onclick = () => mostrar('inicio');
$('btnNova').onclick = novaPartida;
$('btnEmbaralhar').onclick = () => { tiles = embaralhar(tiles); desenhar(); };
