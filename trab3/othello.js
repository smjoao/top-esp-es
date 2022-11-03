window.onload = function() {
    makeBoard();
}

var cont =0; //contador pra saber quem joga na prox rodada


function createcircle(td) {
    let circle = document.createElement('div');
    
    if(cont%2==0)
    circle.style.backgroundColor = '#e9e627';//amarelo
    
    else
    circle.style.backgroundColor = 'white';//branco
    
    circle.className = 'circle';
    td.appendChild(circle);

    cont++;     //contador pra saber quem joga na prox rodada
}



function makeBoard() {
    
    let board = document.getElementById('board');    
    
    for(let i = 0; i < 8; i++) {
        let tr = document.createElement('tr');       
        
        for(let j = 0; j < 8; j++) {
            let td = document.createElement('td');
            td.id = (i*10)+j;           
            tr.appendChild(td);

            if( td.id == 44 ) {                
                createcircle(td);
            }
        }    
        board.appendChild(tr);
    }
}



//tentando descobrir como pegar ids que não sei quais são
function msg(){
    alert("vc clicou na circunferencia");
}

// document.addEventListener('click', createcircle(td));
document.getElementById("44").addEventListener("click", msg);
