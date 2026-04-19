// ===================================================
//    CANVAS
// ==================================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===================================================
//    OBJETOS DA FASE 1
// ==================================================

// PLATAFORMAS


let chao = { // chão principal da fase
    x: 0,
    y: 350,
    w: 800,
    h: 50,
    color: "green"
};

// ===================================================
//    PLAYER
// ==================================================
// PLAYER - Guardar os dados dos personagens
let player = {
    x: 50,
    y: 300,
    w: 40,
    h: 40,
    color: "white",
    vy: 0, // velocidade vertical
    speed: 3.3 // velocidade horizontal
};

// ===================================================
//    ESTADO DO JOGO
// ==================================================

// Quantidadde de itens coletados
let itensColetados = 0; 

// Quantidade de vidas do jogador
let vidas = 2;

// Mensagem que aparece no topo do canvas
let mensagem = ""

// Controla se a fase já foi concluida ou não
let faseConcluida = false   

// Informa se o jogador já morreu ou não
let morreu = false

// Diz se o jogador está no chão ou em alguma plataforma (pra permitir pulo)
let noChao = false;

// usado pra evitar perder mais de 1 vida ao encostar no inimigo 
let encostandoNoInimigo = false;
let podeTomarDano = true;

let faseAtual = 1;

// let plataformas = []
// let itens = []
// let inimigos = []
// let nave = {}

// ===================================================
//    TECLADO
// ==================================================

// Usado pra guardar o estado das teclas pressionadas
let teclas = {
    esquerda: false,
    direita: false
}

// ===================================================
//    FUNÇÕES AUXILIARES
// ==================================================
// Função que recebe um objeto (ret) e desenha ele no canvas
function desenha_retangulo(ret){
    ctx.beginPath();
    ctx.fillStyle = ret.color; // define a cor de preenchimento
    ctx.fillRect(ret.x, ret.y, ret.w, ret.h);
    ctx.closePath();
}

// Função de colisão entre dois retângulos
function colisao(a,b){ // a = player; b = item/inimigo
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function carregarFase1(){
    // PLATAFORMAS
    plataformas = [
        {x: 150, y: 260, w: 120, h: 20, color: "gray"},
        {x: 350, y: 280, w: 150, h: 20, color: "gray"},
        {x: 550, y: 200, w: 120, h: 20, color:"grey"}
    ];

    // ITENS
    itens = [
        {x: 210, y: 203, w: 20, h: 20, color: "yellow", coletado: false},
        {x: 635, y: 170, w: 20, h: 20, color: "yellow", coletado: false}
    ];

    // INIMIGOS
    inimigos = [
        {x: 400, y: 250, w: 40, h: 30, color: "red"}
    ]

    // NAVE
    nave = {
        x: 700, y: 290, w: 60, h:60, color: "blue"
    }

    spawnX = 50;
    spawnY = 300;

    player.x = spawnX;
    player.y = spawnY;
    player.vy = 0;
}

function carregarFase2(){
    // PLATAFORMAS
    plataformas = [
        { x: 30,  y: 100, w: 120, h: 20, color: "purple" },
        { x: 250, y: 125, w: 70,  h: 20, color: "purple" },
        { x: 120, y: 225, w: 320, h: 20, color: "purple" },
        { x: 300, y: 310, w: 135, h: 20, color: "purple" },
        { x: 400, y: 165, w: 140, h: 20, color: "purple" },
        { x: 700, y: 215, w: 60, h: 20, color: "purple" },
        { x: 0, y: 365, w: 200, h: 20, color: "purple" },
        { x: 600, y: 100, w: 70,  h: 20, color: "purple" },
        { x: 550, y: 250, w: 92, h: 20, color: "purple" },

    ];

    // ITENS 
    itens = [
        { x: 380, y: 275, w: 20, h: 20, color: "cyan", coletado: false },
        { x: 645, y: 65, w: 20, h: 20, color: "cyan", coletado: false }
    ];  

     // INIMIGOS 
    inimigos = [
        { x: 210, y: 195, w: 40, h: 30, color: "orange", speed: 1.0, direcao: 1, limiteEsquerdo: 120, limiteDireito: 440 },
        { x: 475, y: 135, w: 40, h: 30, color: "orange", speed: 0.5, direcao: 1, limiteEsquerdo: 400, limiteDireito: 540  },
        { x: 15, y: 335, w: 40, h: 30, color: "orange" , speed: 0.8, direcao: 1, limiteEsquerdo: 0, limiteDireito: 200  }

    ];

    // NAVE
    nave = {
        x: 700,
        y: 155,
        w: 60,
        h: 60,
        color: "blue"
    };

    // resetar estados da fase
    itensColetados = 0;
    faseConcluida = false;
    mensagem = "";

    spawnX = 40;
    spawnY = 50;

    player.x = spawnX;
    player.y = spawnY;
    player.vy = 0;
}

// ===================================================
//    FUNÇÃO DE REINICIO
// ==================================================
// Reinicia a fase atual
function reiniciarJogo() {
    if (faseAtual == 1) {
        carregarFase1();
    }

    if (faseAtual == 2) {
        carregarFase2();
    }

    vidas = 2;
    mensagem = "";
    faseConcluida = false;
    morreu = false;
    noChao = false;
    encostandoNoInimigo = false;

    player.x = spawnX;
    player.y = spawnY;
    player.vy = 0;
}

// ===================================================
//    LOOP PRINCIPAL DO JOGO
// ==================================================

// LOOP
function desenhar(){
    // ------------------------------------------------
    //    LIMPAR TELA
    // ------------------------------------------------
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // ------------------------------------------------
    //    FISICA DO PLAYER
    // ------------------------------------------------
    //GRAVIDADE
    player.vy += 0.5; // gravidade (vai acelerando pra baixo)
    player.y += player.vy; // aplica movimento
    noChao = false
    // colisão com chão
    if (faseAtual == 1 ){
        if (player.y + player.h > chao.y){
            player.y = chao.y - player.h; // topo do chão - altura player
            player.vy = 0; //  para de cair
            noChao = true;
        }
    }

    // Colisão com as plataformnas
    for(let plat of plataformas) {
        if (
            player.y + player.h <= plat.y + player.vy &&
            player.y + player.h + player.vy >= plat.y &&
            player.x + player.w > plat.x &&
            player.x < plat.x + plat.w
        ) {
            player.y = plat.y - player.h;
            player.vy = 0;
            noChao = true
        }
    }

    // QUEDA NO VAZIO (fase 2)
    if (faseAtual == 2 && player.y > canvas.height) {
        vidas = 0;

        // volta pro começo da fase
        player.x = spawnX;
        player.y = spawnY;
        player.vy = 0;
    }

    // ------------------------------------------------
    //    MOVIMENTO DO PLAYER
    // ------------------------------------------------

    if (!faseConcluida && !morreu){
        if (teclas.esquerda){
            player.x -= player.speed;
        }
        if (teclas.direita){
            player.x += player.speed;
        }
    }

    // ------------------------------------------------
    //    INTERAÇÃO COM ITENS
    // ------------------------------------------------
    for (let item of itens) {
        if (!item.coletado && colisao(player, item)) {
            item.coletado = true;
            itensColetados++;
        }
    }

    // ------------------------------------------------
    //    MOVIMENTO - INIMIGOS
    // ------------------------------------------------
    if (faseAtual == 2) {
        for (let inimigo of inimigos) {
            inimigo.x += inimigo.speed * inimigo.direcao;

            if (inimigo.x <= inimigo.limiteEsquerdo) {
                inimigo.direcao = 1;
            }

            if (inimigo.x + inimigo.w >= inimigo.limiteDireito) {
                inimigo.direcao = -1;
            }
        }
    }
    // ------------------------------------------------
    //    INTERAÇÃO COM INIMIGOS
    // ------------------------------------------------
    //inimigo
    let tocandoInimigo = false;

    for (let inimigo of inimigos) {
        if (colisao(player, inimigo)) {
            tocandoInimigo = true;
        }
    }

    if (tocandoInimigo) {
        if (!encostandoNoInimigo) {
            vidas--;
            encostandoNoInimigo = true;
        }
    } else {
        encostandoNoInimigo = false;
    }

    // ------------------------------------------------
    //    VERIFICAR MORTE
    // ------------------------------------------------
    if (vidas <= 0 && !morreu){
        morreu = true

        setTimeout(() => {
            reiniciarJogo();
        }, 1000);
    }
    
    // ------------------------------------------------
    //    VERIFICAR NAVE OU VITORIA
    // ------------------------------------------------
    // testar se pode ou não avançar de fase - lógica nave
    if(colisao(player,nave)) {
        if (itensColetados < 2){
            mensagem = "Faltam peças para ativar a nave"
        } else{
            faseConcluida = true
        }
    } else {
        mensagem = "";
    }

    if(faseConcluida){
        ctx.fillStyle = "white"
        ctx.font = "24px Arial"
        ctx.fontAlign = "center"
    }

    // ------------------------------------------------
    //    ATUALIZAR HUD
    // ------------------------------------------------
    document.getElementById("itens").textContent = itensColetados;
    document.getElementById("vidas").textContent = vidas;
    document.getElementById("fase").textContent = faseAtual;

    // ------------------------------------------------
    //    DESENHAR CENÁRIO
    // ------------------------------------------------
    if (faseAtual == 1){
        desenha_retangulo(chao);
    }
    
    for (let inimigo of inimigos) {
        desenha_retangulo(inimigo);
    }
    for (let plat of plataformas) {
        desenha_retangulo(plat);
    }
    desenha_retangulo(nave)

    for (let item of itens) {
        if (!item.coletado) {
        desenha_retangulo(item);
        }
    }

    // Desenhar player apenas se não morreu ou passou de fase
    if (!faseConcluida && !morreu){
        desenha_retangulo(player); // desenha o player na nova posição
    } 

    // ------------------------------------------------
    //    MENSAGEM DO TOPO
    // ------------------------------------------------
    ctx.fillStyle = "white";
    ctx.font = "23px Arial";
    ctx.textAlign = "center";

    ctx.strokeStyle = "black"
    ctx.lineWidth = 3;
    ctx.strokeText(mensagem, canvas.width/2, 50);
    ctx.fillText(mensagem, canvas.width / 2, 50);

    // ------------------------------------------------
    //    TELA DE VITORIA
    // ------------------------------------------------
    if (faseConcluida) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("FASE CONCLUÍDA", canvas.width / 2, canvas.height / 2);

        ctx.font = "24px Arial";
        ctx.fillText("Pressione ENTER para continuar", canvas.width / 2, canvas.height / 2 + 50);
    }

    // ------------------------------------------------
    //    TELA DE MORTE
    // ------------------------------------------------
    if(morreu){
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("VOCÊ MORREU", canvas.width / 2, canvas.height / 2);
    }

    // ------------------------------------------------
    //    REPETIR O LOOP
    // ------------------------------------------------
    // chama a função de novo (loop infinito)
    requestAnimationFrame(desenhar);
}

// ===================================================
//    INICIAR O JOGO
// ==================================================
carregarFase1();
desenhar();     

// ===================================================
//    EVENTOS DO TECLADO
// ==================================================
// quando aperta a tecla
document.addEventListener("keydown", function(evento){
    if (evento.key == "ArrowLeft") { // se apertar seta pra esquerda
        teclas.esquerda = true// move o player 
    }

    if (evento.key == "ArrowRight") { // se apertar seta pra direita
        teclas.direita = true // move o player
    }
    if (evento.key == "ArrowUp" && noChao && !faseConcluida && !morreu){
        player.vy = -9.5;
    }
    if (evento.key == "Enter" && faseConcluida){
        faseAtual++;

        if (faseAtual == 2){
            carregarFase2();
        }
    }
});


// Quando solta a tecla
document.addEventListener("keyup", function(evento){ //conseguir apertar 2 teclas "ao mesmo tempo"
    if (evento.key == "ArrowLeft"){
        teclas.esquerda = false;
    }

    if (evento.key == "ArrowRight"){
        teclas.direita = false;
    }
})
















