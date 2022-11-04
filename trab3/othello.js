window.onload = function() {
    makeBoard();
    drawBoard();
}

// Estados possíveis do jogo
// B_PLAYING = Jogador branco está jogando
// P_PLAYING = Jogador preto está jogando
// FINISHED = Jogo terminou
const states = {
    "B_PLAYING": 0,
    "P_PLAYING": 1,
    "FINISHED": 2,
}

// Estado atual do jogo (jogador preto começa)
let cur_state = states.P_PLAYING;

var cont = 0; //contador pra saber quem joga na prox rodada

// Matrix que guarda a posição das peças no tabuleiro atualmente
// 'x' = vazio
// 'p' = preto
// 'b' = branco
let board_matrix = [
    ['x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x'],
    ['x','x','x','b','p','x','x','x'],
    ['x','x','x','p','b','x','x','x'],
    ['x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x'],
]


function createcircle(td, color) {
    let circle = document.createElement('div');
    
    if (color == 'p')
        circle.className = 'color-black'; //preto
    else if (color == 'b')
        circle.className = 'color-white'; //branco
    else
        return
    
    circle.className += ' circle';
    td.appendChild(circle);

    cont++;     //contador pra saber quem joga na prox rodada
}


// Desenha o tabuleiro vazio
function makeBoard() {
    
    let board = document.getElementById('board');    
    
    for(let i = 0; i < 8; i++) {
        let tr = document.createElement('tr');       
        
        for(let j = 0; j < 8; j++) {
            let td = document.createElement('td');
            td.id = (i*10)+j;           
            tr.appendChild(td);
        }    
        board.appendChild(tr);
    }
}


// Pega informação da matriz das posições das peças e coloca os círculos no tabuleiro
function drawBoard() {

    for(let i = 0; i < 8; i++) {       
        for(let j = 0; j < 8; j++) {
            let id = (i*10)+j;          
            let td = document.getElementById(id.toString())
            createcircle(td, board_matrix[i][j]);
            td.addEventListener("click", makeMove);
        }    
    }
}

// Função para quando um jogador faz uma jogada
function makeMove() {
    if ( cur_state != states.B_PLAYING && cur_state != states.P_PLAYING ) 
        return;
    
    let i = Math.floor(parseInt(this.id) / 10);
    let j = parseInt(this.id) % 10;

    if ( board_matrix[i][j] != 'x')
        return;

    if ( cur_state == states.B_PLAYING ) {
        board_matrix[i][j] = 'b';
        cur_state = states.P_PLAYING;
    } else if ( cur_state == states.P_PLAYING ) {
        board_matrix[i][j] = 'p';
        cur_state = states.B_PLAYING;
    }
    
    drawBoard();
}

//tentando descobrir como pegar ids que não sei quais são
function msg(){
    alert("vc clicou na circunferencia");
}

// document.addEventListener('click', createcircle(td));
