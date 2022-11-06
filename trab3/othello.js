window.onload = function() {
    makeBoard();
    drawBoard();
    cur_legal_moves = getLegalMoves();
    
    document.getElementById('restart').addEventListener('click', restart);
    document.getElementById('pvp').addEventListener('click', startPVPGame);
    document.getElementById('pve').addEventListener('click', startPVEGame);
}

// Estados possíveis do jogo
// B_PLAYING = Jogador branco está jogando
// P_PLAYING = Jogador preto está jogando
// FINISHED = Jogo terminou
// ANIMATING = Durante animações
// MENU = Está no menu inicial
const states = {
    "B_PLAYING": 0,
    "P_PLAYING": 1,
    "FINISHED": 2,
    "ANIMATING": 3,
    "MENU": 4,
}

// Tamanho do tabuleiro
const BOARDSIZE = 8;

// Estado atual do jogo (começa no menu)
let cur_state = states.MENU;

// Guarda as possíveis jogadas atualmente
let cur_legal_moves;

// Define qual será a cor do minimax (quando estiver jogando contra minimax)
let minimax_state;

// Contador de peças para cada jogador
let p_count = 0;
let b_count = 0;

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

    if( td.firstChild == null || td.firstChild.classList.contains('move-indicator')){
        td.innerHTML = "";
        let circle = document.createElement('div');

        if (color == 'p') {
            circle.classList.toggle('color-black'); //preto
        } else if (color == 'b') {
            circle.classList.toggle('color-white'); //branco
        } else
            return    

        circle.classList.toggle('circle');
        td.appendChild(circle);

    } else {
        circle = td.firstChild;

        let color_copy = color;

        if( (color == 'p' && circle.classList.contains('color-white')) ||
            (color == 'b' && circle.classList.contains('color-black')) ) {
                let transition_func = function() {
                    this.removeEventListener('transitionend', transition_func);
        
                    if (color_copy == 'p') {
                        this.classList.remove('color-white'); //preto
                        this.classList.toggle('color-black'); //preto
                    } else if (color_copy == 'b') {
                        this.classList.remove('color-black'); //preto
                        this.classList.toggle('color-white'); //branco
                    } 
        
                    this.classList.remove('animation');
                }

                circle.classList.toggle('animation');
                circle.addEventListener('transitionend', transition_func)
            }
        
        if( color == 'x' ) {
            td.innerHTML = "";
        }
        
    }
}


// Desenha o tabuleiro vazio
function makeBoard() {
    
    let board = document.getElementById('board');    
    
    for(let i = 0; i < BOARDSIZE; i++) {
        let tr = document.createElement('tr');       
        
        for(let j = 0; j < BOARDSIZE; j++) {
            let td = document.createElement('td');
            td.id = (i*10)+j;           
            tr.appendChild(td);
            td.addEventListener("click", makeMove);
            td.addEventListener("mouseenter", function () {
                if( Object.keys(cur_legal_moves).includes(this.id) ) {
                    let circle = document.createElement('div');

                    if (cur_state == states.P_PLAYING) {
                        circle.classList.toggle('color-black'); //preto
                    } else if (cur_state == states.B_PLAYING) {
                        circle.classList.toggle('color-white'); //branco
                    } else
                        return    

                    circle.classList.toggle('circle');
                    circle.classList.toggle('move-indicator');
                    td.appendChild(circle);
                }
            });
            td.addEventListener("mouseleave", function () {
                if( (cur_state == states.P_PLAYING || cur_state == states.B_PLAYING) && Object.keys(cur_legal_moves).includes(this.id) )
                    this.innerHTML = "";
            });
        }    
        board.appendChild(tr);
    }
}

// Pega informação da matriz das posições das peças e coloca os círculos no tabuleiro
function drawBoard() {
    p_count = 0;
    b_count = 0;
    let player;

    if(cur_state == states.B_PLAYING ) player = "Branco";
    else player = "Preto";

    document.getElementById('cur_player').innerHTML = "<h2>Jogador Atual: " + player + "</h2>"
    
    
    for(let i = 0; i < BOARDSIZE; i++) {       
        for(let j = 0; j < BOARDSIZE; j++) {
            let id = (i*10)+j;          
            let td = document.getElementById(id.toString())
            createcircle(td, board_matrix[i][j]);

            if(board_matrix[i][j] == 'p') p_count++;
            else if(board_matrix[i][j] == 'b') b_count++;
        }    
    }

    let score = document.getElementById('score')
    score.innerHTML = "";
    
    let para_p = document.createElement('p');
    para_p.innerHTML = "Jogador Preto: " + p_count.toString() + " peças"
    let para_b = document.createElement('p');
    para_b.innerHTML = "Jogador Branco: " + b_count.toString() + " peças"

    score.appendChild(para_p);
    score.appendChild(para_b);
}

// Função para quando um jogador faz uma jogada
function makeMove() {
    if ( cur_state != states.B_PLAYING && cur_state != states.P_PLAYING ) 
        return;
    
    if ( !Object.keys(cur_legal_moves).includes( this.id ) )
        return;

    let i = Math.floor(parseInt(this.id) / 10);
    let j = parseInt(this.id) % 10;    // jogadas possiveis

    let affected = cur_legal_moves[this.id]
    for(let id of affected) changeColor(id);

    // decide quem joga na proxima rodada
    let next_state;
    if ( cur_state == states.B_PLAYING ) {
        board_matrix[i][j] = 'b';
        next_state = states.P_PLAYING;
    } else if ( cur_state == states.P_PLAYING ) {
        board_matrix[i][j] = 'p';
        next_state = states.B_PLAYING;
    }
    
    cur_state = states.ANIMATING;

    drawBoard();
    
    setTimeout(function() {
        cur_state = next_state;

        cur_legal_moves = getLegalMoves();

        if ( Object.keys(cur_legal_moves).length == 0 ) { 

            if ( cur_state == states.B_PLAYING ) {
                cur_state = states.P_PLAYING;
            } else if ( cur_state == states.P_PLAYING ) {
                cur_state = states.B_PLAYING;
            }

            cur_legal_moves = getLegalMoves();

            if ( Object.keys(cur_legal_moves).length == 0 ) { // jogo acabou
                cur_state = states.FINISHED;
                endGameMsg();
                return;
            }
        }

        if ( cur_state == minimax_state ) {
            let next_move = minimax_search();
            let td = document.getElementById(next_move);

            td.dispatchEvent(new Event('click'));
        }
    }, 650);

}

function changeColor(id) {
    let circle = document.getElementById(id.toString()).firstChild;

    let i = Math.floor(parseInt(id) / 10);
    let j = parseInt(id) % 10;

    if(board_matrix[i][j] == 'p') {
        board_matrix[i][j] = 'b';
    }
    else if(board_matrix[i][j] == 'b') {
        board_matrix[i][j] = 'p';
    }

}

function getLegalMoves() {
    let res = {}
    let opponent_color, player_color;

    if ( cur_state == states.B_PLAYING ) {
        opponent_color = 'p'
        player_color = 'b'
    } else if ( cur_state == states.P_PLAYING ) {
        opponent_color = 'b'
        player_color = 'p'
    }

    for(let i = 0; i < BOARDSIZE; i++) {       
        for(let j = 0; j < BOARDSIZE; j++) {
            
            if ( board_matrix[i][j] == 'x' ) {
                if ( i+1 < BOARDSIZE && board_matrix[i+1][j] == opponent_color ) {                      // lado de baixo
                    let k = i+1;
                    let affected = [];
                    while( k < BOARDSIZE && board_matrix[k][j] == opponent_color ) {
                        affected.push((k*10)+j);
                        k++;
                    }
                    
                    if ( k < BOARDSIZE && board_matrix[k][j] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                            
                    }
                }
                if ( i-1 >= 0 && board_matrix[i-1][j] == opponent_color ) {                      // lado de cima
                    let k = i-1;
                    let affected = [];
                    while( k >= 0 && board_matrix[k][j] == opponent_color ){ 
                        affected.push((k*10)+j);
                        k--;                        
                    }

                    if ( k >= 0 && board_matrix[k][j] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }
                if ( j+1 < BOARDSIZE && board_matrix[i][j+1] == opponent_color ) {                      // lado direito
                    let k = j+1;
                    let affected = [];
                    while( k < BOARDSIZE && board_matrix[i][k] == opponent_color ) {
                        affected.push((i*10)+k);
                        k++;
                    }

                    if ( k < BOARDSIZE && board_matrix[i][k] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }                        
                if ( j-1 >= 0 && board_matrix[i][j-1] == opponent_color ) {                      // lado esquerdo
                    let k = j-1;
                    let affected = [];
                    while( k >= 0 && board_matrix[i][k] == opponent_color ) {
                        affected.push((i*10)+k);
                        k--;
                    }
                    
                    if ( k >= 0 && board_matrix[i][k] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }                        
                if ( i+1 < BOARDSIZE && j+1 < BOARDSIZE && board_matrix[i+1][j+1] == opponent_color ) {         // diagonal direita de baixo
                    let k = i+1, l = j+1;
                    let affected = [];
                    while( k < BOARDSIZE && l < BOARDSIZE && board_matrix[k][l] == opponent_color ) { 
                        affected.push((k*10)+l);
                        k++; l++; 
                    }
                    
                    if ( k < BOARDSIZE && l < BOARDSIZE && board_matrix[k][l] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }           
                if ( i-1 >= 0 && j+1 < BOARDSIZE && board_matrix[i-1][j+1] == opponent_color ) {         // diagonal direita de cima
                    let k = i-1, l = j+1;
                    let affected = [];
                    while( k >= 0 && l < BOARDSIZE && board_matrix[k][l] == opponent_color ) {
                        affected.push((k*10)+l);
                        k--; l++; 
                    }
                    
                    if ( k >= 0 && l < BOARDSIZE && board_matrix[k][l] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }           
                if ( i+1 < BOARDSIZE && j-1 >= 0 && board_matrix[i+1][j-1] == opponent_color ) {         // diagonal esquerda de baixo
                    let k = i+1, l = j-1;
                    let affected = [];
                    while( k < BOARDSIZE && l >= 0 && board_matrix[k][l] == opponent_color ) { 
                        affected.push((k*10)+l);
                        k++; l--; 
                    }
                    
                    if (  k < BOARDSIZE && l >= 0 && board_matrix[k][l] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }           
                if ( i-1 >= 0 && j-1 >= 0 && board_matrix[i-1][j-1] == opponent_color ) {          // diagonal esquerda de cima
                    let k = i-1, l = j-1;
                    let affected = [];
                    while( k >= 0 && l >= 0 && board_matrix[k][l] == opponent_color ) { 
                        affected.push((k*10)+l);
                        k--; l--; 
                    }
                    
                    if ( k >= 0 && l >= 0 && board_matrix[k][l] == player_color ) {
                        let id_str = ((i*10)+j).toString();
                        if ( Object.keys(res).includes(id_str) )
                            res[id_str] = res[id_str].concat(affected);
                        else
                            res[id_str] = affected;
                    }
                }
            }
             
        }
    }

    return res
}

function minimax_search() {
    return Object.keys(cur_legal_moves)[0];
}

function startPVPGame() {
    minimax_state = null;
    cur_state = states.P_PLAYING;
    cur_legal_moves = getLegalMoves();
    document.getElementById('menu').classList.toggle('hidden');
    document.getElementById('cur_player').classList.remove('hidden');
    document.getElementById('score').classList.remove('hidden');
}

function startPVEGame() {
    minimax_state = states.B_PLAYING;
    cur_state = states.P_PLAYING;
    cur_legal_moves = getLegalMoves();
    document.getElementById('menu').classList.toggle('hidden');
    document.getElementById('cur_player').classList.remove('hidden');
    document.getElementById('score').classList.remove('hidden');
}

function endGameMsg() {
    document.getElementById('cur_player').classList.toggle('hidden');
    alert("Fim de jogo");

    let msg;

    if ( p_count > b_count ) msg = "Jogador Preto venceu!"
    else if ( b_count > p_count ) msg = "Jogador Branco venceu!"
    else msg = "Jogo empatado!"

    let window = document.createElement('div');
    window.className = "fim";

    let winner = document.createElement('h2');
    winner.innerHTML = msg;

    window.appendChild(winner);
    
    document.getElementById('titulo').appendChild(window);

    document.getElementById('restart').classList.remove('hidden');
    
}

function restart() {
    board_matrix = [
        ['x','x','x','x','x','x','x','x'],
        ['x','x','x','x','x','x','x','x'],
        ['x','x','x','x','x','x','x','x'],
        ['x','x','x','b','p','x','x','x'],
        ['x','x','x','p','b','x','x','x'],
        ['x','x','x','x','x','x','x','x'],
        ['x','x','x','x','x','x','x','x'],
        ['x','x','x','x','x','x','x','x'],
    ];
    
    cur_state = states.MENU;
    document.getElementById('restart').classList.toggle('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('titulo').lastChild.remove();
    document.getElementById('score').classList.toggle('hidden');

    drawBoard();

}