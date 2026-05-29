document
  .getElementById("modalProduto")
  .addEventListener("show.bs.modal", function (event) {
    const botao = event.relatedTarget;

    // 1. Captura os atributos do botão (Corrigido data-price aqui)
    const nome = botao.getAttribute("data-name");
    const preco = botao.getAttribute("data-price");
    const descricao = botao.getAttribute("data-text");
    const img = botao.getAttribute("data-img");
    const categoria = botao.getAttribute("data-category"); // ✅ Adicionado: capturando a categoria

    // 2. Injeta os dados no HTML do modal
    this.querySelector(".modal-nome").textContent = nome;
    this.querySelector(".modal-preco").textContent = preco;
    this.querySelector(".modal-descricao").textContent = descricao;
    this.querySelector(".modal-produto-img").src = img;

    // 3. Seleciona as seções de variação
    const secaoCores = this.querySelector("#secao-cores");
    const secaoLetras = this.querySelector("#secao-tamanhos-letras");
    const secaoNumeros = this.querySelector("#secao-tamanhos-numeros");

    // 4. Controla o que aparece e o que some
    switch (categoria) {
      case "roupa": // Camiseta, Calça e Jaqueta
        secaoCores.style.display = "block";
        secaoLetras.style.display = "block";
        secaoNumeros.style.display = "none";
        break;

      case "tenis": // Tênis
        secaoCores.style.display = "block";
        secaoLetras.style.display = "none";
        secaoNumeros.style.display = "block";
        break;

      case "acessorio": // Óculos e Bolsa
        secaoCores.style.display = "block";
        secaoLetras.style.display = "none";
        secaoNumeros.style.display = "none";
        break;

      default: // Caso padrão de segurança
        secaoCores.style.display = "block";
        secaoLetras.style.display = "block";
        secaoNumeros.style.display = "none";
        break;
    }
  });

// Lógica da Newsletter (Esta parte estava 100% correta!)
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
