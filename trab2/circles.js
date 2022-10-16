
window.onload = function () {

    const colors = ['red', 'green', 'blue']
    const colors_nome = ['Vermelho', 'Verde', 'Azul']
    const color_len = colors.length
    let color_count = -1

    let div_circles = document.createElement('div');
    div_circles.id = "circles"

    for (let color of colors) {
        let circle = document.createElement('div');
        circle.className = 'circle';
        circle.style.backgroundColor = color;

        circle.onmousedown = function() {
            this.remove()
        }

        div_circles.appendChild(circle);
    }


    let div_botoes = document.createElement('div');
    
    let botao_remover = document.createElement('button');
    botao_remover.append('Remover todos os círculos');
    botao_remover.onmousedown = function() {
        while(div_circles.firstChild) div_circles.removeChild(div_circles.firstChild)
    }
    
    let botao_circulo = document.createElement('button');
    botao_circulo.append('Adicionar novos círculos');
    botao_circulo.onmousedown = function() {
        let new_color = document.getElementById('select_cor').value;
        let num_circles = document.getElementById('number_circles').value;
        
        if(num_circles == '') alert("Escolha um número de círculos!");
        else
            for(let i = 0; i < num_circles; i++)
                createCircle(new_color)
    }

    let number_circles = document.createElement('input');
    number_circles.id = "number_circles"
    number_circles.value = 1
    number_circles.setAttribute('type','number');
    number_circles.style.width = '35px';
    number_circles.style.marginRight = '0.5rem';

    let select_cor = document.createElement('select');
    select_cor.id = "select_cor";
    for (let i in colors) {
        let option = document.createElement('option');
        option.value = colors[i];
        option.append(colors_nome[i])

        select_cor.appendChild(option);
    }
    
    div_botoes.appendChild(botao_remover);
    div_botoes.appendChild(botao_circulo);
    div_botoes.append("Número de novos círculos:");
    div_botoes.appendChild(number_circles);
    div_botoes.append("Cor dos novos círculos:");
    div_botoes.appendChild(select_cor);

    document.body.appendChild(div_circles);
    document.body.appendChild(div_botoes);

};

function createCircle(color) {
    
    let div_circles = document.getElementById('circles');

    let circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = color;

    circle.onmousedown = function() {
        this.style.display = "none"
    }

    div_circles.appendChild(circle);
}