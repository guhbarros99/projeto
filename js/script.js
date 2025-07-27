/**Inicio da programação menu dropdown */

const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

dropdown.addEventListener('mouseover', () => {
    dropdownContent.classList.add('show')
}); 

dropdown.addEventListener('mouseout', () => {
    dropdownContent.classList.remove('show')
}); 

/**Fim para programação menu dropdown */

/**Inicio da mudança da cor do icon whatsapp */

document.addEventListener("scroll", function() {
    const icon = document.getElementById("icon");
    if((window.innerHeight+window.scrollY) >= document.body.offsetHeight) {
        icon.style.color = "white";
    }else{
        icon.style.color = "black";
    }
});

/**Fim da mudança da cor do whatsapp ao fazer o scroll até o fim da página */
// Função para cadastrar uma nova empresa
function cadastrarEmpresa() {
    const nomeEmpresa = document.getElementById('nomeEmpresa').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    if (!nomeEmpresa || !cnpj || !email || !telefone || !login || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Validação do CNPJ
    const cnpjRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/;
    if (!cnpjRegex.test(cnpj)) {
        alert("CNPJ inválido.");
        return;
    }

    // Validação de Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Email inválido.");
        return;
    }

    // Carregar empresas existentes
    const empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    const empresaExistente = empresas.find(empresa => empresa.cnpj === cnpj || empresa.login === login);

    if (empresaExistente) {
        alert("Empresa já cadastrada com esse CNPJ ou Login.");
        return;
    }

    // Criar e salvar nova empresa
    const empresa = {
        nome: nomeEmpresa,
        cnpj: cnpj,
        email: email,
        telefone: telefone,
        login: login,
        senha: senha,
        fluxoCaixa: {
            entradas: [],
            saídas: []
        }
    };

    empresas.push(empresa);
    localStorage.setItem("empresas", JSON.stringify(empresas));

    alert("Empresa cadastrada com sucesso!");
    mostrarTelaLogin(); // Exibe a tela de login após cadastro
}

// Função para efetuar o login
function efetuarLogin() {
    const loginUsuario = document.getElementById('loginUsuario').value;
    const senhaUsuario = document.getElementById('senhaUsuario').value;

    const empresas = JSON.parse(localStorage.getItem("empresas")) || [];
    const empresa = empresas.find(empresa => empresa.login === loginUsuario && empresa.senha === senhaUsuario);

    if (!empresa) {
        alert("Login ou senha incorretos.");
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(empresa));
    mostrarTelaFluxoCaixa(); // Exibe a tela de fluxo de caixa após login bem-sucedido
}

// Função para mostrar a tela de fluxo de caixa
function mostrarTelaFluxoCaixa() {
    const empresaLogada = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (empresaLogada) {
        const nomeEmpresaHeader = document.getElementById("nomeEmpresaHeader");
        nomeEmpresaHeader.textContent = empresaLogada.nome;  // Exibe o nome da empresa logada
    }

    // Esconde todas as telas e exibe a de fluxo de caixa
    document.getElementById("telaCadastro").style.display = "none";
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("telaFluxoCaixa").style.display = "block";

    atualizarFluxoCaixa(); // Atualiza o fluxo de caixa
}

// Função para adicionar entrada ou saída
function adicionarTransacao() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;

    if (!descricao || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha a descrição e um valor válido.");
        return;
    }

    const empresaLogada = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (empresaLogada) {
        if (tipo === 'entrada') {
            empresaLogada.fluxoCaixa.entradas.push({ descricao, valor });
        } else if (tipo === 'saida') {
            empresaLogada.fluxoCaixa.saídas.push({ descricao, valor });
        }
        // Salva os dados da empresa no localStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(empresaLogada));
        atualizarFluxoCaixa(); // Atualiza o fluxo de caixa
    }
    // Limpa os campos de entrada após adicionar a transação
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('tipo').value = 'entrada';  // Reseta o tipo para "entrada" após adicionar a transação
}

// Função para atualizar o fluxo de caixa na tela
function atualizarFluxoCaixa() {
    const empresaLogada = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (empresaLogada) {
        // Obtém os elementos da lista de entradas e saídas na tela
        const entradasList = document.getElementById('lista-entradas');
        const saídasList = document.getElementById('lista-saidas');
        const totalEntradas = document.getElementById('totalEntradas');
        const totalSaidas = document.getElementById('totalSaidas');
        const saldo = document.getElementById('saldo');

        // Limpa as listas antes de adicionar os itens novamente
        entradasList.innerHTML = '';
        saídasList.innerHTML = '';

        // Adiciona as entradas na lista
        empresaLogada.fluxoCaixa.entradas.forEach(entrada => {
            const li = document.createElement('li');
            li.textContent = `${entrada.descricao} - R$ ${entrada.valor.toFixed(2)}`;
            entradasList.appendChild(li);
        });

        // Adiciona as saídas na lista
        empresaLogada.fluxoCaixa.saídas.forEach(saida => {
            const li = document.createElement('li');
            li.textContent = `${saida.descricao} - R$ ${saida.valor.toFixed(2)}`;
            saídasList.appendChild(li);
        });

        // Calcula o total de entradas e saídas
        const totalEntrada = empresaLogada.fluxoCaixa.entradas.reduce((total, entrada) => total + entrada.valor, 0);
        const totalSaida = empresaLogada.fluxoCaixa.saídas.reduce((total, saida) => total + saida.valor, 0);
        const saldoTotal = totalEntrada - totalSaida;

        // Atualiza os valores na tela
        totalEntradas.textContent = totalEntrada.toFixed(2);
        totalSaidas.textContent = totalSaida.toFixed(2);
        saldo.textContent = saldoTotal.toFixed(2);
    }
}


// Função para sair do sistema e voltar para a tela de login
function sairDoSistema() {
    localStorage.removeItem("usuarioLogado");
    mostrarTelaLogin(); // Exibe a tela de login novamente
}

// Função para mostrar a tela de login
function mostrarTelaLogin() {
    document.getElementById("telaCadastro").style.display = "none";
    document.getElementById("telaLogin").style.display = "block";
    document.getElementById("telaFluxoCaixa").style.display = "none";
}


// Função para redirecionar para a tela de cadastro caso o login falhe
function redirecionarCadastro() {
    alert("Empresa não cadastrada! Por gentileza cadastre-se e tenha acesso aos nossos serviços.");
    mostrarTelaCadastro(); // Redireciona para a tela de cadastro
}

// Função para fechar a tela de login e voltar para a home
function voltarParaHome() {
    window.location.href = "index.html";  // Supondo que "index.html" seja a página principal
}

const btn_acessar = document.getElementById("btn_acessar");

btn_acessar.addEventListener("click", ()=>{
    window.location.href = "login.html"
})