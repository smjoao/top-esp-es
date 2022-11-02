window.onload = function() {
    makeBoard();
}

function makeBoard() {
    let board = document.getElementById('board');
    
    for(let i = 0; i < 8; i++) {

        let tr = document.createElement('tr');
        
        for(let j = 0; j < 8; j++) {
            
            let td = document.createElement('td');
            tr.appendChild(td);

            if( i == 4 && j == 4 ) {
                let circle = document.createElement('div');
                circle.style.backgroundColor = 'black';
                circle.className = 'circle';
                td.appendChild(circle);
            }

        }    

        board.appendChild(tr);
    }
}