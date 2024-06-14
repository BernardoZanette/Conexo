const botao_disciplinas = document.getElementById('botao_disciplinas')
const botao_grupos = document.getElementById('botao_grupos')
const botao_palavras = document.getElementById('botao_palavras')
const botao_adicionar_grupo = document.getElementById('adicionar_grupo')
const botao_adicionar_disciplina = document.getElementById('adicionar_disciplina')
const botao_adicionar_palavra = document.getElementById('adicionar_palavra')
const conteudo = document.getElementById('conteudo')

botao_disciplinas.addEventListener('click', () => {
    getDisciplinas()
})

botao_grupos.addEventListener('click', () => {
    getGrupos()
})

botao_palavras.addEventListener('click', () => {
    getPalavras()
})

botao_adicionar_grupo.addEventListener('click', () => {
    mostrarFormularioGrupo()
})

botao_adicionar_disciplina.addEventListener('click', () => {
    mostrarFormularioDisciplina()
})

botao_adicionar_palavra.addEventListener('click', () => {
    mostrarFormularioPalavra()
})

const getDisciplinas = async () => {
    conteudo.innerHTML = 'Aguarde buscar os dados...'
    const resposta = await fetch('http://127.0.0.1:8000/disciplinas');
    const {data} = await resposta.json()
    console.log(data)

    const lista = document.createElement('ul')
    data.forEach(p => {
        const div = document.createElement('div')
        const li = document.createElement('li')
        li.innerText = p.nome

        const btnEditar = document.createElement('button')
        btnEditar.innerText = 'Editar'
        btnEditar.addEventListener('click', () => {
            const form = document.createElement('form')
            form.setAttribute('method', 'POST')
            form.setAttribute('class', 'form')

            const inputNome = document.createElement('input')
            inputNome.setAttribute('name', 'editPalavras')
            inputNome.value = p.nome
            inputNome.required = true

            const buttonSubmit = document.createElement('button')
            buttonSubmit.setAttribute('type', 'submit')
            buttonSubmit.innerText = 'Enviar'

            const btnVoltar = document.createElement('button')
            btnVoltar.innerText = 'Voltar'

            div.removeChild(li)
            divBotoes.removeChild(btnEditar)
            divBotoes.removeChild(btnRemover)
            div.removeChild(divBotoes)

            divBotoes.setAttribute('class', 'crudBotoes')
            divBotoes.appendChild(buttonSubmit)
            divBotoes.appendChild(btnVoltar)

            div.appendChild(form)
            form.appendChild(inputNome)
            form.appendChild(divBotoes)

            buttonSubmit.addEventListener('click', async (e) => {

                if (inputNome.value) {
                    e.preventDefault()
                    await fetch(`http://127.0.0.1:8000/disciplinas/${p.id}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({professores_id:p.professores_id, nome: inputNome.value})
                    });
                    getDisciplinas()   
                }
            })
            btnVoltar.addEventListener('click', () => {
                getDisciplinas()
            })
        })

        const btnRemover = document.createElement('button')
        btnRemover.innerText = 'Remover'
        btnRemover.addEventListener('click', async () => {
            div.remove()
            await fetch("http://127.0.0.1:8000/disciplinas/"+p.id, {method: "DELETE"});
        })
        
        const divBotoes = document.createElement('div')
        divBotoes.setAttribute('class', 'crudBotoes')
        divBotoes.appendChild(btnEditar)
        divBotoes.appendChild(btnRemover)
        div.appendChild(li)
        div.appendChild(divBotoes)
        lista.appendChild(div)
        
    })
    conteudo.innerHTML = ''
    conteudo.appendChild(lista)
    return data;

} 

const getGrupos = async () => {
    conteudo.innerHTML = 'Aguarde buscar os dados...'
    const resposta = await fetch('http://127.0.0.1:8000/grupos');
    const {data} = await resposta.json()
    console.log(data)

    const lista = document.createElement('ul')
    data.forEach(p => {
        const div = document.createElement('div')
        const li = document.createElement('li')
        li.innerText = p.nome

        const btnEditar = document.createElement('button')
        btnEditar.innerText = 'Editar'
        btnEditar.addEventListener('click', () => {

            const form = document.createElement('form')
            form.setAttribute('method', 'POST')
            form.setAttribute('class', 'form')

            const inputNome = document.createElement('input')
            inputNome.setAttribute('name', 'editGrupo')
            inputNome.value = p.nome
            inputNome.required = true

            const buttonSubmit = document.createElement('button')
            buttonSubmit.setAttribute('type', 'submit')
            buttonSubmit.innerText = 'Enviar'

            const btnVoltar = document.createElement('button')
            btnVoltar.innerText = 'Voltar'

            div.removeChild(li)
            divBotoes.removeChild(btnEditar)
            divBotoes.removeChild(btnRemover)
            div.removeChild(divBotoes)

            divBotoes.setAttribute('class', 'crudBotoes')
            divBotoes.appendChild(buttonSubmit)
            divBotoes.appendChild(btnVoltar)

            div.appendChild(form)
            form.appendChild(inputNome)
            form.appendChild(divBotoes)

            buttonSubmit.addEventListener('click', async (e) => {
                if (inputNome.value) {
                    e.preventDefault()
                    await fetch(`http://127.0.0.1:8000/grupos/${p.id}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({disciplinas_id: p.disciplinas_id, nome: inputNome.value})
                    });
                    getGrupos()
                }
            })
            btnVoltar.addEventListener('click', () => {
                getGrupos()
            })
        })

        const btnRemover = document.createElement('button')
        btnRemover.innerText = 'Remover'
        btnRemover.addEventListener('click', async () => {
            div.remove()
            await fetch("http://127.0.0.1:8000/grupos/"+p.id, {method: "DELETE"});
        })
        const divBotoes = document.createElement('div')
        divBotoes.setAttribute('class', 'crudBotoes')
        divBotoes.appendChild(btnEditar)
        divBotoes.appendChild(btnRemover)
        div.appendChild(li)
        div.appendChild(divBotoes)
        lista.appendChild(div)
    })
    conteudo.innerHTML = ''
    conteudo.appendChild(lista)
} 

const getPalavras = async () => {
    conteudo.innerHTML = 'Aguarde buscar os dados...'
    const resposta = await fetch('http://127.0.0.1:8000/palavras');
    const {data} = await resposta.json()

    let gruposUnicos = data.filter((obj, index, self) => {
        return index === self.findIndex((t) => (
            t.grupos_nome === obj.grupos_nome
        ));
    });
    
    const gruposDiv = document.createElement('div')
    gruposDiv.setAttribute('class', 'grupoListagem')
    const lista = document.createElement('ul')
    gruposUnicos.forEach(g => {
        const grupo = document.createElement('button')
        grupo.innerText = g.grupos_nome
        grupo.addEventListener('click', () => {
            lista.innerHTML = ''
            let dataDoGrupo = data.filter(p => p.grupos_id === g.grupos_id)
            dataDoGrupo.forEach(p => {
                const div = document.createElement('div')
                const li = document.createElement('li')
                li.innerText = p.nome
    
                const btnEditar = document.createElement('button')
                btnEditar.innerText = 'Editar'
                btnEditar.addEventListener('click', () => {
    
                    const form = document.createElement('form')
                    form.setAttribute('method', 'POST')
                    form.setAttribute('class', 'form')
    
                    const inputNome = document.createElement('input')
                    inputNome.setAttribute('name', 'editPalavras')
                    inputNome.value = p.nome
                    inputNome.required = true
    
                    const buttonSubmit = document.createElement('button')
                    buttonSubmit.setAttribute('type', 'submit')
                    buttonSubmit.innerText = 'Enviar'
    
                    const btnVoltar = document.createElement('button')
                    btnVoltar.innerText = 'Voltar'
    
                    div.removeChild(li)
                    divBotoes.removeChild(btnEditar)
                    divBotoes.removeChild(btnRemover)
                    div.removeChild(divBotoes)
    
                    divBotoes.setAttribute('class', 'crudBotoes')
                    divBotoes.appendChild(buttonSubmit)
                    divBotoes.appendChild(btnVoltar)
    
                    div.appendChild(form)
                    form.appendChild(inputNome)
                    form.appendChild(divBotoes)
    
                    buttonSubmit.addEventListener('click', async (e) => {
                        if (inputNome.value) {
                            e.preventDefault()
                            await fetch(`http://127.0.0.1:8000/palavras/${p.id}`, {
                                method: "PATCH",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({grupos_id: p.grupos_id, nome: inputNome.value})
                            });
                            getPalavras()   
                        }
                    })
                    btnVoltar.addEventListener('click', () => {
                        getPalavras()
                    })
                })
    
                const btnRemover = document.createElement('button')
                btnRemover.innerText = 'Remover'
                btnRemover.addEventListener('click', async () => {
                    div.remove()
                    await fetch("http://127.0.0.1:8000/palavras/"+p.id, {method: "DELETE"});
                })
                const divBotoes = document.createElement('div')
                divBotoes.setAttribute('class', 'crudBotoes')
                divBotoes.appendChild(btnEditar)
                divBotoes.appendChild(btnRemover)
                div.appendChild(li)
                div.appendChild(divBotoes)
                lista.appendChild(div)
            })
            conteudo.appendChild(lista)
        })
        gruposDiv.appendChild(grupo)
    });
    conteudo.innerHTML = ''
    conteudo.appendChild(gruposDiv)
} 

const mostrarFormularioPalavra = async () => {
    conteudo.innerHTML = ''
    const form = document.createElement('form')
    form.setAttribute('class', 'form')

    const selectGrupo = document.createElement('select')
    selectGrupo.setAttribute('multiple', '')
    selectGrupo.setAttribute('id', 'grupo_id')

    const defaultOption = document.createElement('option')
    defaultOption.setAttribute('value', '-1')
    defaultOption.innerText = 'Selecionar Grupo'
    selectGrupo.appendChild(defaultOption)

    const resposta = await fetch('http://127.0.0.1:8000/grupos');
    const {data} = await resposta.json()
    data.forEach(grupo => {
        const option = document.createElement('option')
        option.innerText = grupo.nome
        option.setAttribute('value', grupo.id)
        selectGrupo.appendChild(option)
    })

    const inputNome = document.createElement('input')
    inputNome.setAttribute('type', 'text')
    inputNome.setAttribute('placeholder', 'Adicionar Palavra...')
    inputNome.setAttribute('id', 'nomePalavra')
    inputNome.setAttribute('name', 'nome')

    const enviar = document.createElement('button')
    enviar.setAttribute('class', 'inserirButtons')
    enviar.setAttribute('type', 'submit')
    enviar.innerText = 'Salvar'

    form.appendChild(selectGrupo)
    form.appendChild(inputNome)
    form.appendChild(enviar)
    form.addEventListener('submit', salvarPalavra)
    conteudo.appendChild(form)
}

const salvarPalavra = async (e) => {
    e.preventDefault()
    debugger
    var form = new FormData();
    form.append('nome', document.getElementById('nomePalavra').value);
    
    var options = document.getElementById('grupo_id').selectedOptions;
    var values = Array.from(options).map(({ value }) => parseInt(value));
    form.append('grupos_id', values);

    const resposta = await fetch("http://127.0.0.1:8000/palavras", {
        method: "POST",
        body: form,
    });
    const {data} = await resposta.json()
    console.log(resposta, data)

    document.getElementById('nomePalavra').value = ''
    getPalavras()
}

const mostrarFormularioGrupo = async () => {
    conteudo.innerHTML = ''
    const form = document.createElement('form')
    form.setAttribute('class', 'form')

    const selectDisciplina = document.createElement('select')
    selectDisciplina.setAttribute('id', 'disciplina_id')

    const defaultOption = document.createElement('option')
    defaultOption.setAttribute('value', '-1')
    defaultOption.innerText = 'Selecione Disciplina'
    selectDisciplina.appendChild(defaultOption)

    const resposta = await fetch('http://127.0.0.1:8000/disciplinas');
    const {data} = await resposta.json()
    data.forEach(disciplina => {
        const option = document.createElement('option')
        option.innerText = disciplina.nome
        option.setAttribute('value', disciplina.id)
        selectDisciplina.appendChild(option)
    })

    const inputNome = document.createElement('input')
    inputNome.setAttribute('type', 'text')
    inputNome.setAttribute('id', 'nomeGrupo')
    inputNome.setAttribute('placeholder', 'Adicionar Grupo...')
    inputNome.setAttribute('name', 'nome')

    const enviar = document.createElement('button')
    enviar.setAttribute('class', 'inserirButtons')
    enviar.setAttribute('type', 'submit')
    enviar.innerText = 'Salvar'

    form.appendChild(selectDisciplina)
    form.appendChild(inputNome)
    form.appendChild(enviar)
    form.addEventListener('submit', salvarGrupo)
    conteudo.appendChild(form)
}

const salvarGrupo = async (e) => {
    e.preventDefault()
    var form = new FormData();
    form.set('nome', document.getElementById('nomeGrupo').value)
    form.set('disciplinas_id', document.getElementById('disciplina_id').value)
    const resposta =  await fetch("http://127.0.0.1:8000/grupos", {
        method: "POST",
        body: form,
    }); 
    const {data} = await resposta.json()
    console.log(resposta, data) 

    document.getElementById('nomeGrupo').value = ''
    getGrupos()
}

const mostrarFormularioDisciplina = () => {
    conteudo.innerHTML = ''
    const form = document.createElement('form')
    form.setAttribute('class', 'form')

    const inputNome = document.createElement('input')
    inputNome.setAttribute('placeholder', 'Adicionar Disciplina...')
    inputNome.setAttribute('type', 'text')
    inputNome.setAttribute('id', 'nomeDisciplina')
    inputNome.setAttribute('name', 'nome')

    const enviar = document.createElement('button')
    enviar.setAttribute('class', 'inserirButtons')
    enviar.setAttribute('type', 'submit')
    enviar.innerText = 'Salvar'

    form.appendChild(inputNome)
    form.appendChild(enviar)
    form.addEventListener('submit', salvarDisciplina)
    conteudo.appendChild(form)
}

const salvarDisciplina = async (e) => {
    e.preventDefault()
    var form = new FormData();
    form.set('nome', document.getElementById('nomeDisciplina').value)
    // CHANGE
        form.set('professores_id', 1)
    //  
    const resposta = await fetch("http://127.0.0.1:8000/disciplinas", {
        method: "POST",
        body: form,
    }); 
    const {data} = await resposta.json()
    console.log(resposta, data) 

    document.getElementById('nomeDisciplina').value = ''
    getDisciplinas()
}