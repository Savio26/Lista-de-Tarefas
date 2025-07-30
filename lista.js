
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

    const botaoUrgente = document.createElement('span')
    botaoUrgente.textContent = '🔺'
    botaoUrgente.classList.add('urgente')
    botaoUrgente.style.marginLeft = '10px'
    botaoUrgente.style.cursor = 'pointer'
    botaoUrgente.onclick = function (event) {
        event.stopPropagation()
        adicionarUrgente(texto)
    }

    const botaoExcluir = document.createElement('span')
    botaoExcluir.textContent = '❌'
    botaoExcluir.classList.add('excluir')
    botaoExcluir.style.marginLeft = '10px'
    botaoExcluir.onclick = function (event) {
        event.stopPropagation()
        li.remove()
        salvarTarefas()
    }

    li.appendChild(botaoUrgente)
    li.appendChild(botaoExcluir)

    li.onclick = function (event) {
        if (!event.target.classList.contains('excluir')) {
            li.classList.toggle('concluida')
            salvarTarefas()
        }
    }

    document.getElementById('lista-tarefas').appendChild(li)
}

function adicionarUrgente(texto, dataHora =new Date().toISOString()) {
    const li = document.createElement('li')
    li.textContent = texto
    li.setAttribute('data-hora', dataHora)

    const tempoElemento = document.createElement('div')
    tempoElemento.className = 'data-hora'
    tempoElemento.textContent = calcularTempoDecorrido(dataHora)

    const btnConcluir = document.createElement('span')
    btnConcluir.textContent = '✔️'
    btnConcluir.style.marginLeft = '10px'
    btnConcluir.style.cursor = 'pointer'
    btnConcluir.onclick = function () {
        li.classList.toggle('concluida')
    }

    const btnExcluir = document.createElement('span')
    btnExcluir.textContent = '❌'
    btnExcluir.style.marginLeft = '10px'
    btnExcluir.style.cursor = 'pointer'
    btnExcluir.onclick = function () {
        li.remove()
        salvarUrgentes()
    }
    li.appendChild(tempoElemento)
    li.appendChild(btnConcluir)
    li.appendChild(btnExcluir)

    document.getElementById('lista-urgentes').appendChild(li)
    salvarUrgentes()
}
function salvarTarefas() {
    const tarefas = []
    document.querySelectorAll('#lista-tarefas li').forEach(tarefa => {
        const texto = tarefa.childNodes[0].nodeValue.trim()  // Correto: primeiro texto antes dos spans
        tarefas.push({
            texto: texto,
            concluida: tarefa.classList.contains('concluida')
        })
    })

    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas))
}
function salvarUrgentes() {
    const urgente = []
    document.querySelectorAll('#lista-urgentes li').forEach(tarefa => {
        const texto = tarefa.firstChild.textContent.trim()
        const tempo = tarefa.getAttribute('data-hora') || new Date().toISOString()
        urgente.push({
            texto: texto,
            dataHora: tempo
        })
    })
    localStorage.setItem('tarefasUrgentes', JSON.stringify(urgente))
}
window.onload = ()=> {
    carregarTarefas()
    carregarUrgentes()

}
function carregarUrgentes(){
    const urgenteSalvas = localStorage.getItem('tarefasUrgentes')
    if (urgenteSalvas){
        const lista = JSON.parse(urgenteSalvas)
        lista.forEach(item =>{
            adicionarUrgente(item.texto, item.dataHora)
        })
    }
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas')
    if (tarefasSalvas) {
        const lista = JSON.parse(tarefasSalvas)
        lista.forEach(tarefa => {
            criarTarefaNaTela(tarefa.texto, tarefa.concluida)
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
function calcularTempoDecorrido(dataHora){
    const agora = new Date()
    const inicio = new Date(dataHora)
    const diffMs = agora - inicio

    const minutos = Math.floor(diffMs / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (dias > 0) return`${dias}d ${horas % 24}h`
    if (horas > 0) return `${horas}h ${minutos % 60}m`
    return `${minutos}m`
}
setInterval(()=> {
    document.querySelectorAll('#lista-urgentes li').forEach(li =>{
        const dataHora = li.getAttribute('data-hora')
        const tempoEl = li.querySelector('.data-hora')
        if(tempoEl && dataHora){
            tempoEl.textContent = calcularTempoDecorrido(dataHora)

        }
    })
},60000)
function removerTodasTarefas() {
    if (confirm("Tem certeza que deseja remover todas as tarefas?")) {
        document.getElementById('lista-tarefas').innerHTML = ''
        localStorage.removeItem('minhasTarefas')
    }
}
