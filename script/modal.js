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

// Adição de evento de clique no botão do campo de email
document.addEventListener("DOMContentLoaded", function () {
  const formNewsletter = document.getElementById("form-newsletter");
  const modalEmailElement = document.getElementById("modalEmail");

  if (formNewsletter && modalEmailElement) {
    const meuModalEmail = new bootstrap.Modal(modalEmailElement);

    formNewsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      meuModalEmail.show();
      formNewsletter.reset();
    });
  }
});
