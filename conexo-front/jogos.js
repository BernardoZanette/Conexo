const gerar_jogo_botao = document.getElementById('gerar_jogo')
const conteudo = document.getElementById('conteudo')
const body = document.body

const AZUL = '#0051FF'
const BRANCO = '#FFFFFF'
const AMARELO = '#e78800'
const VERMELHO = '#d50000'
const ROXO = '#810081'
const VERDE = '#138d13'

const gerarModalDisciplina = async () => {
    const modalExistente = document.getElementsByClassName('modal')[0]
    if (modalExistente) modalExistente.remove()
    
    const salvarAulaExistente = document.getElementById('salvarAula')
    if (salvarAulaExistente) salvarAulaExistente.remove()

    document.getElementById('gerar_jogo').style.display = 'inline'

    const containerModal = document.createElement('div')
    containerModal.setAttribute('class', 'modal')
    containerModal.style.display = 'flex'
    const disciplinaModal = document.createElement('div')
    disciplinaModal.setAttribute('id', 'disciplinaModal')
    const formDisciplina = document.createElement('form')
    const selectDisciplina = document.createElement('select')
    selectDisciplina.setAttribute('id', 'disciplinas_id')

    const disciplinas = await fetch('http://127.0.0.1:8000/disciplinas');
    const {data} = await disciplinas.json()
    console.log(data)

    data.forEach(disciplina => {
        const option = document.createElement('option')
        option.innerText = disciplina.nome
        option.setAttribute('value', disciplina.id)
        selectDisciplina.appendChild(option)
    })
    const enviar = document.createElement('button')
    enviar.setAttribute('type', 'submit')
    enviar.innerText = 'Criar'

    enviar.addEventListener('click', gerarJogoPorDisciplina)

    formDisciplina.appendChild(selectDisciplina)
    formDisciplina.appendChild(enviar)
    disciplinaModal.appendChild(formDisciplina)
    containerModal.appendChild(disciplinaModal)
    body.appendChild(containerModal)
}

const gerarModalSalvar = (data) => {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modalSalvar-content');

    const salvarForm = document.createElement('form');
    salvarForm.setAttribute('class', 'salvarForm');

    const input = document.createElement('input');
    input.setAttribute('id', 'nomeAula')
    input.placeholder = 'Nome da Aula...'

    const salvar = document.createElement('button');
    salvar.setAttribute('id', 'salvar');
    salvar.innerText = 'Salvar';
    salvar.addEventListener('click', async function(e) {
        e.preventDefault()
        modal.remove()
        console.log(data)

        var formJogo = new FormData();
        formJogo.set('titulo', input.value)

        const dataAtual = new Date().toISOString().split('T')[0];
        formJogo.set('data', dataAtual);

        var formGruposJogos = [];
        data.forEach(inf => {
            formGruposJogos.push({
                grupos_id: inf.grupos_id,
                palavras_id: inf.id
            });
        });
        const requestBody = {
            formJogo: Object.fromEntries(formJogo), 
            formGruposJogos: formGruposJogos
        };

        const resposta =  await fetch("http://127.0.0.1:8000/jogos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }); 
    });
    salvarForm.appendChild(input);
    salvarForm.appendChild(salvar);
    modalContent.appendChild(salvarForm);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.style.display = 'flex';
}

const gerarJogo = (data, titulo) => {
    conteudo.innerText = 'Gerando Jogo...'
    const conexo = document.createElement('div')
    conexo.setAttribute('id', 'jogo')

    const containerGruposFormados = document.createElement('div')
    containerGruposFormados.setAttribute('id', 'containerGrupos')
    
    const containerPalavras = document.createElement('div')
    containerPalavras.setAttribute('id', 'containerPalavras')

    data.forEach(palavra => {
        const palavraCard = document.createElement('div')
        const palavraText = document.createElement('p')
        palavraText.innerText = palavra.nome
        palavraCard.appendChild(palavraText)
        containerPalavras.appendChild(palavraCard)
        palavraCard.addEventListener('click', () => cardClique(palavra, palavraCard))
    })

    conteudo.innerText = ''
    conteudo.appendChild(titulo)

    conexo.appendChild(containerGruposFormados)
    conexo.appendChild(containerPalavras)
    conteudo.appendChild(conexo)
}

gerar_jogo_botao.addEventListener('click', gerarModalDisciplina)

const gerarJogoPorDisciplina = async (e) => {
    e.preventDefault()

    document.getElementsByClassName('modal')[0].style.display = 'none'
    document.getElementById('gerar_jogo').style.display = 'none'

    const disciplina = document.getElementById('disciplinas_id')
    const disciplina_id = disciplina.value
    const disciplina_index = disciplina.selectedIndex

    const disciplinaText = document.createElement('h2')
    disciplinaText.innerText = disciplina[disciplina_index].text

    const resposta = await fetch(`http://127.0.0.1:8000/jogos/criar/${disciplina_id}`);
    const {data} = await resposta.json()
    
    const salvarAula = document.createElement('button')
    salvarAula.setAttribute('id', 'salvarAula')
    salvarAula.innerText = 'Salvar Aula'
    const navBar = document.getElementsByClassName('nav-bar')[0]
    
    salvarAula.addEventListener('click', () => {
        gerarModalSalvar(data)
    })
    navBar.appendChild(salvarAula)
    
    gerarJogo(data, disciplinaText)
    
}

const gerarModalVitoria = () => {

    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modalVitoria-content');

    const titulo = document.createElement('h2');
    titulo.textContent = 'Parabéns, você venceu!';
    modalContent.appendChild(titulo);

    const jogarNovamenteDiv = document.createElement('div');
    jogarNovamenteDiv.setAttribute('class', 'jogarNovamenteDiv');
    const jogarNovamente = document.createElement('button');
    jogarNovamente.setAttribute('id', 'jogarNovamente');
    jogarNovamente.textContent = 'Jogar Novamente';
    jogarNovamente.addEventListener('click', () => {
        fecharModal()
        gerarModalDisciplina()
    });
    jogarNovamenteDiv.appendChild(jogarNovamente);
    modalContent.appendChild(jogarNovamenteDiv);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.style.display = 'flex';

    gruposFormados = 0
    cores = [AMARELO, VERMELHO, ROXO, VERDE]
}

function fecharModal() {
    const modal = document.getElementsByClassName('modal')[0];
    modal.remove()
}   

var cliques = 0
var palavrasHtml = []
var palavras = []
var fadeOutConst = 800
var gruposFormados = 0
var cores = [AMARELO, VERMELHO, ROXO, VERDE]

const cardClique = (palavra, palavraHtml) => {
    const containerGrupos = document.getElementById('containerGrupos')

    if (palavras.filter(p => p === palavra).length > 0) return
    cliques++
    palavras.push(palavra)
    palavrasHtml.push(palavraHtml)
    palavraHtml.style.backgroundColor = AZUL
    palavraHtml.style.color = BRANCO
    if (cliques == 4) {
        grupoTemporario = palavra.grupos_nome
        if (palavras.some(p => p.grupos_nome !== grupoTemporario)) {
            palavrasHtml.forEach(e => fadeOutBackground(e));
            palavrasHtml.forEach(e => e.style.backgroundColor = null)
        }
        else {
            palavrasHtml.forEach(e => fadeOut(e))
            palavrasHtml.forEach(e => removeChild(containerPalavras, e))
            // aparecer todos juntos
            const grupo = document.createElement('div')
            grupo.setAttribute('class', `group${palavra.grupos_id}-set`)
            const grupoPalavras = document.createElement('div')
            grupoPalavras.innerHTML = palavra.grupos_nome
            
            const palavrasDoGrupo = document.createElement('div')
            palavras.forEach((p,index)=> {
                if (index == 0) palavrasDoGrupo.innerText = p.nome
                else palavrasDoGrupo.innerText += ', '+p.nome
            })

            let randInt = Math.floor(Math.random() * cores.length); 
            grupo.style.backgroundColor = cores[randInt]
            cores.splice(randInt, 1)
            console.log(randInt, cores)

            grupo.appendChild(grupoPalavras)
            grupo.appendChild(palavrasDoGrupo)
            
            containerGrupos.appendChild(grupo)
            fadeIn(grupo)
            gruposFormados++
        }

        if (gruposFormados == 4) {
            gerarModalVitoria()
        }

        cliques = 0
        palavrasHtml = []
        palavras = []
    }
}

const fadeOutBackground = (elemento) => {
    elemento.classList.add('fade-out-background'); 
    elemento.style.color = 'black'
    setTimeout(() => {
        elemento.classList.remove('fade-out-background');
    }, fadeOutConst);
}

const fadeOut = (elemento) => {
    elemento.classList.add('fade-out'); 

    setTimeout(() => {
        elemento.classList.remove('fade-out');
    }, fadeOutConst);
}

const fadeIn = (elemento) => {
    elemento.classList.add('fade-in'); 

    setTimeout(() => {
        elemento.classList.remove('fade-in');
    }, fadeOutConst*1.5);
}

const removeChild = (pai, elemento) => {
    setTimeout(() => {
        pai.removeChild(elemento)
    }, 600);
}

const gerarJogoSalvo = async (jogoInf) => {
    conteudo.innerHTML = 'Buscando jogo...'
    const resposta = await fetch('http://127.0.0.1:8000/jogos/salvos/'+jogoInf.id);
    const {data} = await resposta.json()

    const aulaTitulo = document.createElement('h2')
    if (jogoInf.titulo !== null) aulaTitulo.innerText = jogoInf.titulo
    
    else aulaTitulo.innerText = jogoInf.data

    gerarJogo(data, aulaTitulo)

}

const getJogos = async () => {
    conteudo.innerHTML = 'Aguarde buscar os dados...'
    const resposta = await fetch('http://127.0.0.1:8000/jogos');
    let {data} = await resposta.json()

    data = data.map(item => item.formJogo);

    const jogosDiv = document.createElement('div')
    jogosDiv.setAttribute('class', 'listaJogos')

    data.forEach(jogo => {
        const cardJogo = document.createElement('div')
        cardJogo.setAttribute('id', jogo.id)

        const divBotoes = document.createElement('div')
        divBotoes.setAttribute('class', 'crudBotoes')

        if (jogo.titulo !== null) {
            const tituloJogo = document.createElement('p')
            tituloJogo.innerText = jogo.titulo
            cardJogo.appendChild(tituloJogo)
            
            const btnEditar = document.createElement('button')
            btnEditar.innerText = 'Editar'
            divBotoes.appendChild(btnEditar)

            btnEditar.addEventListener('click', (e) => {
                e.preventDefault()

                const form = document.createElement('form')
                form.setAttribute('method', 'POST')
                form.setAttribute('class', 'form')

                const inputTitulo = document.createElement('input')
                inputTitulo.setAttribute('name', 'editJogo')
                inputTitulo.value = jogo.titulo
                inputTitulo.required = true

                const buttonSubmit = document.createElement('button')
                buttonSubmit.setAttribute('type', 'submit')
                buttonSubmit.innerText = 'Enviar'

                const btnVoltar = document.createElement('button')
                btnVoltar.innerText = 'Voltar'

                cardJogo.removeChild(tituloJogo)
                divBotoes.innerHTML = ''
                
                divBotoes.setAttribute('class', 'crudBotoes')
                divBotoes.appendChild(buttonSubmit)
                divBotoes.appendChild(btnVoltar)
                
                cardJogo.appendChild(form)
                form.appendChild(inputTitulo)
                form.appendChild(divBotoes)

                buttonSubmit.addEventListener('click', async (e) => {
                    if (inputTitulo.value) {
                        e.preventDefault()
                        await fetch(`http://127.0.0.1:8000/jogos/${jogo.id}`, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({formJogo: {titulo: inputTitulo.value}})
                        });
                        getJogos()
                    }
                })
                btnVoltar.addEventListener('click', () => {
                    getJogos()
                })
            })
        }
        
        const dataJogo = document.createElement('p')
        dataJogo.innerText = jogo.data

        const btnRemover = document.createElement('button')
        btnRemover.innerText = 'Remover'
        btnRemover.addEventListener('click', async () => {
            jogosDiv.remove()
            await fetch("http://127.0.0.1:8000/jogos/"+jogo.id, {method: "DELETE"});
            getJogos()
        })

        const btnRodarJogo = document.createElement('button')
        btnRodarJogo.innerText = 'Visitar'
        btnRodarJogo.setAttribute('id', 'btnVisitar')
        btnRodarJogo.addEventListener('click', () => gerarJogoSalvo(jogo))

        
        divBotoes.appendChild(btnRodarJogo)
        divBotoes.appendChild(btnRemover)
        
        cardJogo.appendChild(dataJogo)
        cardJogo.appendChild(divBotoes)
        jogosDiv.appendChild(cardJogo)

    });
    conteudo.innerText = ''
    conteudo.appendChild(jogosDiv)
}

getJogos()