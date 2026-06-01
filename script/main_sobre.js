const containerSacola = document.querySelector(".bag-content");
const mensagemVazio = document.querySelector(".bag__empty-text");
const formularioCheckout = document.querySelector(".bag-footer");
const valorTotalElemento = document.getElementById("valor-total");
// Busca dos dados armazenados no localStorage
let listaProdutos = JSON.parse(localStorage.getItem("armazenamento")) || [];

function renderizarSacola() {
  if (!containerSacola) return;
  
  document.querySelectorAll(".card-bag").forEach(card => card.remove());

  if (listaProdutos.length > 0) {
    if (mensagemVazio) mensagemVazio.style.display = "none";
    if (formularioCheckout) formularioCheckout.style.display = "flex";
    // Criação da estrutura de exibição de dados dos produtos selecionados após forEach percorrer e ler os dados
    listaProdutos.forEach((produto, index) => {
      const precoFormatado = Number(produto.preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const cardHTML = `
        <div class="card-bag" data-index="${index}">
          <div class="left-bloco">
            <input type="checkbox" class="check-produto" ${produto.selecionado !== false ? 'checked' : ''} data-preco="${produto.preco}">
            <div class="container-img-produto">
              <img src="${produto.imagem}" alt="${produto.nome}" class="img-produto-sacola">
            </div>
          </div>

          <div class="bloco-info">
            <h3 class="nome-produto">${produto.nome}</h3>
            <p class="variacao-prd">COR: ${produto.cor}</p>
            <p class="variacao-prd">TAMANHO: ${produto.tamanho}</p> 
          </div>

          <div class="bloco-valores">
            <div class="coluna-preco">
              <span class="label-titulo">Preço</span>
              <span class="valor-produto">${precoFormatado}</span>
            </div>
            
            <div class="coluna-qtd">
              <span class="label-titulo">Quantidade</span>
              <input type="number" value="${produto.quantidade || 1}" min="1" class="input-qtd">
            </div>

            <button type="button" class="btn-apagar" title="Remover produto">
              <img src="assets/Desktop/Ícones/lixeiro.png" alt="Remover" class="img-lixeira">
            </button>
          </div>
        </div>
      `;

      containerSacola.insertAdjacentHTML('beforeend', cardHTML);
    });
    calcularTotalSacola();
  } else {
    if (mensagemVazio) mensagemVazio.style.display = "block";
    if (formularioCheckout) formularioCheckout.style.display = "none";
    if (valorTotalElemento) {
      valorTotalElemento.textContent = (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
  }
}

if (containerSacola) {
  containerSacola.addEventListener("change", (e) => {
    if (e.target.classList.contains("check-produto") || e.target.classList.contains("input-qtd")) {
      const cardNode = e.target.closest(".card-bag");
      if (cardNode) {
        const index = parseInt(cardNode.getAttribute("data-index"));
        if (e.target.classList.contains("check-produto")) {
          listaProdutos[index].selecionado = e.target.checked;
        } else if (e.target.classList.contains("input-qtd")) {
          listaProdutos[index].quantidade = Math.max(1, parseInt(e.target.value) || 1);
        }
        localStorage.setItem("armazenamento", JSON.stringify(listaProdutos));
      }
      calcularTotalSacola();
    }
  });

  // Evento de exclusão de itens individuais na sacola
  containerSacola.addEventListener("click", (e) => {
    const botaoApagar = e.target.closest(".btn-apagar");
    if (botaoApagar) {
      const cardNode = botaoApagar.closest(".card-bag");
      if (cardNode) {
        const index = parseInt(cardNode.getAttribute("data-index"));
        listaProdutos.splice(index, 1);
        localStorage.setItem("armazenamento", JSON.stringify(listaProdutos));
        renderizarSacola();
      }
    }
  });

  // Bloqueio do zero no input de seleção de quantidade
  containerSacola.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("input-qtd")) {
      const input = e.target;

      if (e.key === "0" && (input.value === "" || input.selectionStart === 0)) {
        e.preventDefault();
      }

      if (e.key === "-" || e.key === "e" || e.key === ",") {
        e.preventDefault();
      }
    }
  });

  containerSacola.addEventListener("blur", (e) => {
    if (e.target.classList.contains("input-qtd")) {
      if (e.target.value === "" || parseInt(e.target.value) < 1) {
        e.target.value = 1;
      }
      const cardNode = e.target.closest(".card-bag");
      if (cardNode) {
        const index = parseInt(cardNode.getAttribute("data-index"));
        listaProdutos[index].quantidade = parseInt(e.target.value) || 1;
        localStorage.setItem("armazenamento", JSON.stringify(listaProdutos));
      }
      calcularTotalSacola();
    }
  }, true);
}

if (formularioCheckout) {
  const inputCPF = formularioCheckout.querySelector(".input-cpf");
  const inputCEP = formularioCheckout.querySelector(".input-cep");
  const modalElemento = document.getElementById("modalCheckout");
  let modalBootstrap = null;

  if (modalElemento) {
    modalBootstrap = new bootstrap.Modal(modalElemento);
  }

  const aplicarValidacaoRigida = (inputElement, maxLength) => {
    if (!inputElement) return;

    inputElement.addEventListener("keydown", (e) => {
      if (
        e.key === "Backspace" || e.key === "Delete" || e.key === "Tab" || 
        e.key === "Escape" || e.key === "Enter" || e.ctrlKey || e.metaKey ||
        e.key.startsWith("Arrow")
      ) {
        return;
      }

      if (e.key === " " || !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      const valorAtual = inputElement.value.replace(/\D/g, "");
      if (valorAtual.length >= maxLength) {
        e.preventDefault();
        return;
      }

      if (valorAtual.length >= 2) {
        const digitosIguais = valorAtual.split("").every(d => d === e.key);
        if (digitosIguais) {
          e.preventDefault();
        }
      }
    });

    inputElement.addEventListener("input", (e) => {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length >= 3 && valor.split("").every(d => d === valor[0])) {
        valor = valor.slice(0, 2);
      }

      if (valor.length > maxLength) {
        valor = valor.slice(0, maxLength);
      }

      e.target.value = valor;
    });
  };

  aplicarValidacaoRigida(inputCPF, 11);
  aplicarValidacaoRigida(inputCEP, 8);

  formularioCheckout.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!modalBootstrap) return;

    const checkboxesProdutos = document.querySelectorAll(".check-produto");
    const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
    const inputCPFReal = formularioCheckout.querySelector(".input-cpf");
    const inputCEPReal = formularioCheckout.querySelector(".input-cep");
    const inputEmailReal = formularioCheckout.querySelector(".input-email"); 

    const modalHeaderBg = document.getElementById("modalHeaderBg");
    const modalIconeContainer = document.getElementById("modalIconeContainer");
    const modalTitulo = document.getElementById("modalCheckoutLabel");
    const modalTexto = document.getElementById("modalCheckoutTexto");

    const exibirModalErro = (mensagem, campo) => {
      if (modalHeaderBg) modalHeaderBg.className = "modal-header bg-danger text-white border-0 py-3";
      if (modalTitulo) modalTitulo.textContent = "Ops! Algo deu errado";
      if (modalTexto) modalTexto.textContent = mensagem;
      
      if (modalIconeContainer) {
        modalIconeContainer.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#ffffff" stroke-width="2"/>
            <path d="M8 5v4M8 11h.01" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `;
      }
      
      modalBootstrap.show();

      if (campo) {
        modalElemento.addEventListener("hidden.bs.modal", () => {
          campo.focus();
        }, { once: true });
      }
    };

    const algumProdutoSelecionado = Array.from(checkboxesProdutos).some(cb => cb.checked);
    if (!algumProdutoSelecionado) {
      exibirModalErro("Por favor, selecione ao menos um produto na sacola para prosseguir.", null);
      return;
    }

    if (inputEmailReal) {
      const emailValor = inputEmailReal.value.trim();
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailValor === "") {
        exibirModalErro("O campo de e-mail não pode ficar vazio.", inputEmailReal);
        return;
      } else if (!regexEmail.test(emailValor)) {
        exibirModalErro("Por favor, insira um endereço de e-mail válido (ex: nome@email.com).", inputEmailReal);
        return;
      }
    }

    const cpfLimpo = inputCPFReal ? inputCPFReal.value.replace(/\D/g, "") : "";
    if (cpfLimpo.length !== 11 || cpfLimpo.split("").every(d => d === cpfLimpo[0])) {
      exibirModalErro("O CPF informado está incompleto ou inválido. Digite os 11 números.", inputCPFReal);
      return;
    }

    const cepLimpo = inputCEPReal ? inputCEPReal.value.replace(/\D/g, "") : "";
    if (cepLimpo.length !== 8 || cepLimpo.split("").every(d => d === cepLimpo[0])) {
      exibirModalErro("O CEP informado está incompleto ou inválido. Digite os 8 números.", inputCEPReal);
      return;
    }

    if (radiosPagamento.length > 0) {
      const pagamentoSelecionado = Array.from(radiosPagamento).some(radio => radio.checked);
      if (!pagamentoSelecionado) {
        exibirModalErro("Por favor, escolha uma forma de pagamento antes de finalizar.", null);
        return;
      }
    }

    const novasMarcacoes = [];
    document.querySelectorAll(".card-bag").forEach(card => {
      const indexOriginal = parseInt(card.getAttribute("data-index"));
      const cb = card.querySelector(".check-produto");
      if (cb && !cb.checked) {
        novasMarcacoes.push(listaProdutos[indexOriginal]);
      }
    });

    listaProdutos = novasMarcacoes;
    localStorage.setItem("armazenamento", JSON.stringify(listaProdutos));

    if (modalHeaderBg) modalHeaderBg.className = "modal-header bg-black text-white border-0 py-3";
    if (modalTitulo) modalTitulo.textContent = "Pedido realizado com sucesso!";
    if (modalTexto) modalTexto.textContent = "Obrigado por comprar na Meteora! O resumo e o código de rastreio serão enviados para o seu e-mail.";
    if (modalIconeContainer) {
      modalIconeContainer.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3.5 3.5L13 5" stroke="#daff01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    }

    modalBootstrap.show();

    modalElemento.addEventListener("hidden.bs.modal", () => {
      window.location.reload();
    }, { once: true });
  });
}

// Cálculo do valor total da sacola a partir dos produtos selecionados no input radio
function calcularTotalSacola() {
  const cards = document.querySelectorAll(".card-bag");
  let valorTotalGeral = 0;
  cards.forEach(card => {
    const checkbox = card.querySelector(".check-produto");
    const inputQuantidade = card.querySelector(".input-qtd");

    if (checkbox && checkbox.checked) {
      const precoUnitario = Number(checkbox.getAttribute("data-preco"));
      const quantidade = Number(inputQuantidade.value) || 1;
      valorTotalGeral += precoUnitario * quantidade;
    }
  });
  if (valorTotalElemento) {
    valorTotalElemento.textContent = valorTotalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}

renderizarSacola();