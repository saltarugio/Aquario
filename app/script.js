// Seleciona o botão de iniciar
const start_btn = document.querySelector(".start_btn button");

// Seleciona os elementos relevantes do DOM
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
const image = document.querySelector("imagem");

// Variáveis de controle do tempo, perguntas, pontuação, etc.
let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let limit = 10;
let questions = [];
let que_show = [];

// Evento de clique no botão de iniciar
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo");
    loadQuestions();
}

// Evento de clique no botão de sair
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");
}

// Evento de clique no botão de continuar
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    queCounter(1); 
    startTimer(15); 
    startTimerLine(0); 
}

// Evento de clique no botão de reiniciar
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); 
    result_box.classList.remove("activeResult"); 
    timeValue = 15; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    que_show = [];
    loadQuestions();
    queCounter(que_numb); 
    clearInterval(counter); 
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Time";
    next_btn.classList.remove("show");

    // Limpa as classes das opções para redefinir seu estado
    const optionElements = option_list.querySelectorAll(".option");
    optionElements.forEach(optionElement => {
        optionElement.classList.remove("correct", "incorrect", "disabled");
    });
}

// Evento de clique no botão de desistir
quit_quiz.onclick = ()=>{
    window.location.reload();
}

// Seleciona o botão de próximo
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Evento de clique no botão de próximo
next_btn.onclick = ()=>{
    if(que_count < que_show.length-1){
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb); 
        clearInterval(counter); 
        clearInterval(counterLine);
        startTimer(timeValue); 
        startTimerLine(widthValue); 
        timeText.textContent = "Time";
        next_btn.classList.remove("show"); 
    }else{
        clearInterval(counter);
        clearInterval(counterLine); 
        showResult();
    }
}

// Função para carregar perguntas do servidor
function loadQuestions() {
    fetch('http://192.168.0.137/aquario/api/index.php', {
        method: 'GET'
    }).then(response => {
        
        if (!response.ok) {
            
            throw new Error('Erro na solicitação: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        
        if (Array.isArray(data)) {  // Verifica se é um array
            const id = data.map(data => data.id);
            questions = data;
            
            // Embaralha as perguntas
            for(let i = questions.length-1; i > 0; i--){
                const j = Math.floor(Math.random()*(i*1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            que_show = questions.slice(0, limit); 
            showQuestions(0);          
        } else {
            console.error('Erro ao carregar perguntas:', data.message);
        }
    })
    .catch(error => console.error(error));
}

// Função para exibir perguntas na tela
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    const option_list = document.querySelector(".option_list");
    const que_img = document.querySelector(".que_img");

    // Verifica se há perguntas carregadas
    if (que_show.length > 0 && index < que_show.length) {
        let imagem = que_show[index].img;
        let urlImagem =imagem ? './imagens/'+ imagem : null;

        // Criando tags HTML para a pergunta e as opções usando os dados recebidos do servidor
        let que_tag = '<span>' + (index+1) + ". " + que_show[index].pergunta + '</span>';
        let que_image = urlImagem ? '<img src="'+ urlImagem +'">' : '';
        let option_tag = '' + '<div class="option" data-option-index="' + que_show[index].resposta_verdadeira + '</div>'+
        '<div class="option"><span>'+ que_show[index].resposta1 +'</span></div>' + 
        '<div class="option"><span>'+ que_show[index].resposta2 +'</span></div>' + 
         '<div class="option"><span>'+ que_show[index].resposta3 +'</span></div>' + 
         '<div class="option"><span>'+ que_show[index].resposta4 +'</span></div>';

        que_text.innerHTML = que_tag; // Adiciona a nova tag span dentro da que_tag
        que_img.innerHTML = urlImagem ? que_image : ''; // Adiciona a nova tag de img dentro da que_img
        option_list.innerHTML = option_tag; // Adiciona as novas tags div dentro da option_tag

        const optionElements = option_list.querySelectorAll(".option");

        // Define o atributo onclick para todas as opções disponíveis
        optionElements.forEach(optionElement => {
            optionElement.addEventListener("click", () => optionSelected(optionElement));
        });
    } else {
        // Exibe uma mensagem se não houver perguntas carregadas ou se o índice estiver fora do alcance
        que_text.innerHTML = '<span>Erro ao carregar a pergunta.</span>';
        option_list.innerHTML = '';
    }
    if(index > limit && que_count == limit){
        showResult();
    } 
}

// Função para lidar com a opção selecionada pelo usuário
function optionSelected(resposta_verdadeira){
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = resposta_verdadeira.textContent;
    let correcAns = questions[que_count].resposta_verdadeira;
    const allOptions = option_list.children.length;
    
    if(userAns == correcAns){
        userScore += 1;
        resposta_verdadeira.classList.add("correct");
    }else{
        resposta_verdadeira.classList.add("incorrect");
        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ 
                option_list.children[i].setAttribute("class", "option correct");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled");
    }
    next_btn.classList.add("show");
}

// Função para exibir o resultado do quiz
function showResult(){
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3){
        let scoreTag = '<span>e parabéns! Você obteve <p>'+ userScore +'</p> de <p>'+ que_show.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore > 1){
        let scoreTag = '<span>e legal, você obteve <p>'+ userScore +'</p> de <p>'+ que_show.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{
        let scoreTag = '<span>e desculpe, você obteve apenas <p>'+ userScore +'</p> de <p>'+ que_show.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

// Função para iniciar o temporizador
function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time;
        time--;
        if(time < 9){
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0){
            clearInterval(counter);
            timeText.textContent = "Time Off";
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].resposta_verdadeira;
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){
                    option_list.children[i].setAttribute("class", "option correct");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
        }
    }
}

// Função para iniciar a linha de tempo
function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1;
        time_line.style.width = time + "px";
        if(time > 549){
            clearInterval(counterLine);
        }
    }
}

// Função para atualizar o contador de perguntas
function queCounter(index){
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ limit +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}
