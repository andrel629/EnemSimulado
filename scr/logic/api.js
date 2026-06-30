

let provas = []
let anos = []
const disciplinas = ['linguagens', 'ciencias-humanas', 'ciencias-natureza', 'matematica']
let linguagens = []
let cienciasHumanas = []
let cienciasNatureza = []
let matematica = []
const delay = ms => new Promise(resolver => setTimeout(resolver, ms)); //gera um delay de milissegundos

//chamar uma vez a api
async function ApiGet(a = 2020) {
    const options = { method: 'GET' };
    let limit = 45
    let offset = 0
    const languagem = document.getElementById('linguem').value != '' ? document.getElementById('linguem').value : 'ingles'
    let year = a
    let quest = []

    for (let i = 0; i < 4; i++) {

        const reposta = await fetch(`https://api.enem.dev/v1/exams/${year}/questions?limit=${limit}&language=${languagem}&offset=${offset}`, options)
            .then(res => res.json())
            .catch(err => console.error(err));


        offset += 46

        quest.push(...reposta.questions)

    }

    provas.push(quest)
    return quest
}


//chama um numero aleatorio de anos 

function numeroAleatorio(max = 2023, min = 2010) {
    let x=Math.floor(Math.random() * (max - min + 1)) + min;
    while (x==2011) {
       x= Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return x

}

function provasAleatorias(x = 2) {
    x > 12 ?
        x = 12 :
        x = x;

    anos = []

    for (let i = 0; i < x; i++) {
        let y = numeroAleatorio()
        if (i == 0) {
            anos.push(y)
        } else {
            !anos.includes(y) && y != 2011 ?
                anos.push(y) :
                i--
        }
    }


}

async function gerarDb(x) {
    provasAleatorias(x)
    provas = []
    document.getElementById('btnCriar').disabled=true
    document.getElementById('btnCriar').classList.add('btn-loading')
    document.getElementById('btnCriar').classList.remove('btn-padrao')
    document.getElementById('btnCriar').innerHTML='preparando...'
    for (const [i, e] of anos.entries()) {
        await ApiGet(e)
        
        await delay(4000)
    }
    localStorage.setItem('provas', JSON.stringify(provas))
    organizarPorArea()
    document.getElementById('btnCriar').disabled=false
    document.getElementById('btnCriar').classList.remove('btn-loading')
    document.getElementById('btnCriar').classList.add('btn-padrao')
    document.getElementById('btnCriar').innerHTML='Gerar'
}

function descompactarProva() {
    return JSON.parse(localStorage.getItem('provas'))
}

//separar questoes por area
function organizarPorArea() {
    const provasDescompactada = descompactarProva()
    linguagens=[]
    cienciasHumanas=[]
    cienciasNatureza=[]
    matematica=[]
    for (let i = 0; i < provasDescompactada.length; i++) {
        provasDescompactada[i].forEach(element => {
            switch (element.discipline) {
                case disciplinas[0]:
                    linguagens.push(element)
                    break;
                case disciplinas[1]:
                    cienciasHumanas.push(element)
                    break;
                case disciplinas[2]:
                    cienciasNatureza.push(element)
                    break;
                case disciplinas[3]:
                    matematica.push(element)
                    break;

                default:
                    break;
            }

        });
    }

    localStorage.setItem('linguagens',JSON.stringify(linguagens))
    localStorage.setItem('CienciasHumanas',JSON.stringify(cienciasHumanas))
    localStorage.setItem('CienciasNatureza',JSON.stringify(cienciasNatureza))
    localStorage.setItem('matematica',JSON.stringify(matematica))
}

gerarDb(3)





