import { Acessar } from "./navigation.js"

document.getElementById('btnAcessarIndex').addEventListener('click', ConfigIndex)

function ConfigIndex() {

    if (document.location.pathname == "/index.html") {
        //salvar os dados
        const email = document.getElementById('email').value.trim()
        const watzap = document.getElementById('watzap').value.trim()
        const optionSend = document.getElementById('enviarGabarito').value

       
        if (!email) {
            alert("Preencha o e-mail.");
            return;
        }

        if (!watzap) {
            alert("Preencha o WhatsApp.");
            return;
        }

        localStorage.setItem('email', email)
        localStorage.setItem('watzap', watzap)
        localStorage.setItem('optionSend', optionSend)

        Acessar("http://127.0.0.1:5500/SelectProff.html")



    } else {
        alert("Essa função não deveria esta sendo executada aqui...")
        document.location.href = "http://127.0.0.1:5500/index.html"
    }
}