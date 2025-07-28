// Carrega as tarefas salvas ao abrir a página
window.onload = carregarTarefas

function adicionarTarefa() {
    const input = document.getElementById('nova-tarefa')
    const texto = input.value.trim()

    if (texto === '') {
        alert('Digite uma tarefa!')
        return
    }

    criarTarefaNaTela(texto, false)
    salvarTarefas()

    input.value = ''
    input.focus()
}

function criarTarefaNaTela(texto, concluida, dataHora) {
    const li = document.createElement('li')
    li.textContent = texto

    if (concluida) {
        li.classList.add('concluida')
    }

    const botaoExcluir = document.createElement('span')
    botaoExcluir.textContent = '❌'
    botaoExcluir.classList.add('excluir')

    botaoExcluir.onclick = function (event) {
        event.stopPropagation()
        li.remove()
        salvarTarefas()
    }

    li.appendChild(botaoExcluir)

    li.onclick = function (event) {
        if (!event.target.classList.contains('excluir')) {
            li.classList.toggle('concluida')
            salvarTarefas()
        }
    }

    document.getElementById('lista-tarefas').appendChild(li)
}

function salvarTarefas() {
    const tarefas = []
    document.querySelectorAll('#lista-tarefas li').forEach(tarefa => {
        const texto = tarefa.querySelectorAll('span').textContent.trim()
        const dataHora = tarefa.querySelector('.data-hora').textContent
        tarefas.push({
            texto: texto,
            concluida: tarefa.classList.contains('concluida'),
            dataHora: dataHora
        })
    })

    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas))
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas')
    if (tarefasSalvas) {
        const lista = JSON.parse(tarefasSalvas)
        lista.forEach(tarefa => {
            criarTarefaNaTela(tarefa.texto, tarefa.concluida, tarefa.dataHora)
        })
    }
}

function filtrar(tipo, botaoClicado) {
    const tarefas = document.querySelectorAll('#lista-tarefas li')

    tarefas.forEach(tarefa => {
        const feita = tarefa.classList.contains('concluida')

        if (tipo === 'todas') {
            tarefa.style.display = 'block'
        } else if (tipo === 'pendente' && feita) {
            tarefa.style.display = 'none'
        } else if (tipo === 'concluidas' && !feita) {
            tarefa.style.display = 'none'
        } else {
            tarefa.style.display = 'block'
        }
    })

    const botoes = document.querySelectorAll('#filtros button')
    botoes.forEach(btn => btn.classList.remove('ativo'))

    if (botaoClicado) {
        botaoClicado.classList.add('ativo')
    }
}