document
  .getElementById("modalProduto")
  .addEventListener("show.bs.modal", function (event) {

    const botao = event.relatedTarget;
    const nome = botao.getAttribute("data-name");
    const preco = botao.getAttribute("data-price");
    const descricao = botao.getAttribute("data-text");
    const img = botao.getAttribute("data-img");
    const categoria = botao.getAttribute("data-category");

    // Injeção dos dados no HTML do modal
    this.querySelector(".modal-nome").textContent = nome;
    this.querySelector(".modal-preco").textContent = preco;
    this.querySelector(".modal-descricao").textContent = descricao;
    this.querySelector(".modal-produto-img").src = img;

    // Selecão das seções de variação
    const secaoCores = this.querySelector("#secao-cores");
    const secaoLetras = this.querySelector("#secao-tamanhos-letras");
    const secaoNumeros = this.querySelector("#secao-tamanhos-numeros");
    const secaoCoresJeans = this.querySelector("#secao-cores-jeans");
    const secaoCoresOculos = this.querySelector("#secao-cores-oculos");

    // Controle do que aparece e o que some
    switch (categoria) {
      case "vestuario": // Camiseta e Calça
        secaoCores.style.display = "block";
        secaoLetras.style.display = "block";
        secaoNumeros.style.display = "none";
        secaoCoresJeans.style.display = "none";
        secaoCoresOculos.style.display = "none";
        break;

      case "vestuario-sobreposicao": // Jaqueta
        secaoCores.style.display = "none";
        secaoLetras.style.display = "block";
        secaoNumeros.style.display = "none";
        secaoCoresJeans.style.display = "block";
        secaoCoresOculos.style.display = "none";
        break;

      case "tenis": // Tênis
        secaoCores.style.display = "block";
        secaoLetras.style.display = "none";
        secaoNumeros.style.display = "block";
        secaoCoresJeans.style.display = "none";
        secaoCoresOculos.style.display = "none";
        break;

      case "acessorio": // Óculos e Bolsa
        secaoCores.style.display = "block";
        secaoLetras.style.display = "none";
        secaoNumeros.style.display = "none";
        secaoCoresJeans.style.display = "none";
        secaoCoresOculos.style.display = "none";
        break;

      case "acessorio-ocular": // Óculos e Bolsa
        secaoCores.style.display = "none";
        secaoLetras.style.display = "none";
        secaoNumeros.style.display = "none";
        secaoCoresJeans.style.display = "none";
        secaoCoresOculos.style.display = "block";
        break;

      default: // Caso padrão de segurança
        secaoCores.style.display = "block";
        secaoLetras.style.display = "block";
        secaoNumeros.style.display = "none";
        secaoCoresOculos.style.display = "none";
        break;
    }
  });

// Lógica para mensagem de sucesso ao adicionar item à sacola



// Adição de evento de clique no botão do campo de email
document.addEventListener("DOMContentLoaded", function () {
  const formInfo = document.getElementById("form-newsletter");
  const modalEmailElement = document.getElementById("modalEmail");
  const inputEmail = document.getElementById("input_value_email");
  const modalEmailReusedElement = document.getElementById("modalEmailReused");

  // Adição de um Set que é um armazenamento nativo da página para valores únicos
  const emailsCadastrados = new Set();

  if (formInfo && modalEmailElement) {
    const modalEmail = new bootstrap.Modal(modalEmailElement);
    const modalEmailReused = new bootstrap.Modal(modalEmailReusedElement);

    formInfo.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailDigitado = inputEmail.value.trim().toLowerCase();

      if (emailsCadastrados.has(emailDigitado)) {
        modalEmailReused.show();
        formInfo.reset();
        return;
      }

      emailsCadastrados.add(emailDigitado);
      aplicarDescontoProdutos();
      modalEmail.show();
      formInfo.reset();
    });
  }
});

// Evento de Adição de produtos à sacola
document.addEventListener("click", function (event) {
  
  if (event.target.classList.contains("btn-sacola")) {
    event.preventDefault();

    const nomeProdutos = document.querySelector(".modal-nome");
    const precoProdutos = document.querySelector(".modal-preco");
    const imgProdutos = document.querySelector(".modal-img-wrap img");

    const coresComunsModal = document.querySelector("input[name=cor]:checked");
    const coresJeansModal = document.querySelector("input[name=cor-jeans]:checked");
    const coresArmModal = document.querySelector("input[name=cor-oculos]:checked");
    const tamanhosModal = document.querySelector("input[name=tamanho]:checked");
    const tamanhosNumModal = document.querySelector("input[name=tamanho_num]:checked");
    let listaProdutos = JSON.parse(localStorage.getItem("armazenamento")) || [];

    let precoTexto = precoProdutos ? precoProdutos.textContent : "0";
    const precoFormatado = precoProdutos.textContent.replace("R$", "").replace(",", ".").trim();
    let tamanhoSelecionado = "";
    let corSelecionada = "";

    if (coresComunsModal !== null) {
      corSelecionada = coresComunsModal.value;
    } else if (coresArmModal !== null) {
      corSelecionada = coresArmModal.value;
    } else if (coresJeansModal !== null) {
      corSelecionada = coresJeansModal.value;
    }

    if (tamanhosModal !== null) {
      tamanhoSelecionado = tamanhosModal.value;
    } else if (tamanhosNumModal !== null) {
      tamanhoSelecionado = tamanhosNumModal.value;
    }

    const produtoPreparado = {
      nome: nomeProdutos.textContent,
      preco: precoFormatado,
      imagem: imgProdutos.src,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
      quantidade: 1
    };

    listaProdutos.unshift(produtoPreparado);
    localStorage.setItem("armazenamento", JSON.stringify(listaProdutos));
    console.log("Produto adicionado com sucesso!", produtoPreparado);

    // 1. Fecha o modal de detalhes do produto limpando a tela
    const modalProdutoElement = document.getElementById("modalProduto");
    if (modalProdutoElement) {
      const modalProdutoBS = bootstrap.Modal.getInstance(modalProdutoElement);
      if (modalProdutoBS) {
        modalProdutoBS.hide();
      }
    }

    // Acionamento do modal de sucesso ao adicionar à sacola
    const modalSacolaElement = document.getElementById("modalSacola");
    if (modalSacolaElement) {
      const modalSacola = new bootstrap.Modal(modalSacolaElement);
      modalSacola.show();
    }
  }
});