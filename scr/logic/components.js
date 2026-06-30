const containerAlvo = document.getElementById('container-quest')
const dadosDaQuestao = []
const delayComp = ms => new Promise(resolver => setTimeout(resolver, ms)); //gera um delay de milissegundos
let ques = null
class QuestionComponet {
    constructor(questao, numero) {
        this.questao = questao
        this.numero = numero
        this.element = null
    }


    render() {
        const card = document.createElement('div')
        card.className = 'questao-card'

        const alternativas = ['A', 'B', 'C', 'D', 'E']
        const numbOfImgs = this.questao.files.length


        const imagemSet = () => {
            if (numbOfImgs > 1) {
                return this.questao.files.map((e, id) => `
                        <img class="texto-imagem"  src="${this.questao.files[id] || ''}"/>
                        `).join('')
            } else {

                return `<img class="texto-imagem" src="${this.questao.files[0] || ''}"/>`
            }
        }

        const altfile = (x) => {
            if (x.text == null) {
                return `<img class="texto-imagem" width="100px" height="200px" src="${x.file || ''}"/>`
            } else {
                return `<span class="texto-resposta">${x.text || ''}</span>`
            }
        }
        // Remove toda a estrutura ![](link) do texto
        const textoLimpo = numbOfImgs > 0 ?
            this.questao.context.replace(/!\[\]\(.*?\)/g, '') :
            this.questao.context



        const alternativasHTML = (this.questao.alternatives || []).map((textoAlternativa, index) => `
        
            <label class="alternativa-opcao">
                <input type="radio" name="questao-${this.questao.index}" value="${alternativas[index]}">
                <span class="letra-indicador">${alternativas[index]})</span>
                ${altfile(textoAlternativa)}
            </label>
        `).join('')

        card.innerHTML = `
            <div class="questao-header">
                <span class="tag-badge badge-ano">ENEM ${this.questao.year || ''}</span>
                <span class="tag-badge badge-disciplina">${this.questao.discipline || ''}</span>
                <span class="tag-badge badge-number">${ques.length + 1 || ''}</span>
            </div>

            <div class="questao-corpo">
            
                ${imagemSet()}
                <p class="texto-enunciado">${textoLimpo || 'Sem texto.'}</p>
                <p class="texto-introducao">${this.questao.alternativesIntroduction || 'Sem texto.'}</p>
            </div>

            <div class="questao-alternativas-lista">
                ${alternativasHTML}
            </div>

            <div class="questao-acoes">
                <button class="btn-verificar">Verificar Resposta</button>
            </div>
            
            <div class="feedback-resultado hidden"></div>
        `;

        const vincularEventos = (card) => {
            const botao = card.querySelector('.btn-verificar');
            const feedback = card.querySelector('.feedback-resultado');
            botao.classList.add('btn-padrao')
            const q = this.questao
            botao.addEventListener('click', () => {
                // Busca qual input do tipo radio foi marcado pelo usuário neste card
                const inputSelecionado = card.querySelector(`input[name="questao-${this.questao.index}"]:checked`);

                if (!inputSelecionado) {
                    alert('Selecione uma alternativa antes de verificar!');
                    return;
                }

                const respostaUsuario = inputSelecionado.value;
                const respostaCorreta = this.questao.correctAlternative;

                feedback.classList.remove('hidden', 'correto', 'errado');

                if (respostaUsuario === respostaCorreta) {
                    feedback.textContent = "✓ Resposta Correta!";
                    feedback.classList.add('correto');
                    dadosDaQuestao.push({ Question: q, result: 'Acertou' })
                    localStorage.setItem('dadosDeQuestion', JSON.stringify(dadosDaQuestao))

                } else {
                    feedback.textContent = "✕ Resposta Errada. Tente novamente!";
                    feedback.classList.add('errado');
                    dadosDaQuestao.push({ Question: q, result: 'Errou' })
                    localStorage.setItem('dadosDeQuestion', JSON.stringify(dadosDaQuestao))
                }

                CriarComponent()
            });

        }
        vincularEventos(card)
        return card

    }
}



class NotaComp {
    constructor(nota) {
        this.nota = nota
    }
    render() {
        const card = document.createElement('card-nota')
        card.className = 'Nota-card'

        card.innerHTML = `
        <div class="container-nota">
        <p class="numero">${this.nota}</p>
        <span class="total">/ 100</span>
      </div>
        `
        return card

    }
}

async function desaparecer() {
    const card = document.querySelector(".questao-card");

    if (card) {
    card.classList.add("sumindo");

    await delayComp(600);
    }
    
}

async function CriarComponent() {

    (ques == null) ? geraListas() : console.log(ques);
    await delayComp(1400)
    await desaparecer()
    containerAlvo.innerHTML = '';

    if (ques && ques.length > 0) {
        const matter = ques.shift()
        let comp = ''

        comp = new QuestionComponet(matter, 1)
        console.log(matter)

        const elementQuest = comp.render()
        containerAlvo.appendChild(elementQuest)

    } else {
        comp = new NotaComp(resultado())
        const NotaElement = comp.render()
        containerAlvo.appendChild(NotaElement)
    }

}

function geraListas() {
    const Tamanho = document.getElementById("Tamanho").value
    let l = JSON.parse(localStorage.getItem('linguagens'))
    let h = JSON.parse(localStorage.getItem('CienciasHumanas'))
    let n = JSON.parse(localStorage.getItem('CienciasNatureza'))
    let m = JSON.parse(localStorage.getItem('matematica'))
    ques = []
    switch (Tamanho) {
        case "20":
            l = l.slice(0, 5);
            h = h.slice(0, 5);
            n = n.slice(0, 5);
            m = m.slice(0, 5);
            break;
        case "40":

            l = l.slice(0, 10);
            h = h.slice(0, 10);
            n = n.slice(0, 10);
            m = m.slice(0, 10);
            break;
        case "80":

            l = l.slice(0, 20);
            h = h.slice(0, 20);
            n = n.slice(0, 20);
            m = m.slice(0, 20);
            break;
        default:

            l = l.slice(0, 1);
            h = h.slice(0, 1);
            n = n.slice(0, 1);
            m = m.slice(0, 1);
            break;
    }
    ques = [...l, ...h, ...n, ...m]


}

function resultado() {
    let acertos = 0
    let nota = 0
    dadosDaQuestao.forEach((el, id) => {
        el.result == 'Acertou' ? acertos++ : console.log('');
    })
    nota = (acertos / dadosDaQuestao.length) * 100

    return nota

}