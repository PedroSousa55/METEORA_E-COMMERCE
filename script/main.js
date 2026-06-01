function aplicarDescontoProdutos() {
    // Seleciona todos os cards de produtos dentro do container container
    const cards = document.querySelectorAll(".products__cards-container .card-body");

    cards.forEach(card => {
      const precoElemento = card.querySelector(".card-title:last-of-type");
      
      if (precoElemento.querySelector(".preco-desconto")) return;

      const textoOriginal = precoElemento.textContent.trim();

      const valorNumerico = parseFloat(textoOriginal.replace("R$", "").replace(".", "").replace(",", ".").trim());

      if (!isNaN(valorNumerico)) {
        const valorComDesconto = valorNumerico * 0.9;

        const valorFormatadoOriginal = valorNumerico.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const valorFormatadoDesconto = valorComDesconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        // Altera o h5 para conter o novo preço e o antigo riscado
        precoElemento.innerHTML = `
          <span class="preco-desconto">${valorFormatadoDesconto}</span>
          <span class="preco-antigo">${valorFormatadoOriginal}</span>
        `;
        
        // Atualiza 'data-price' do modal para exibir novo valor descontado no modal
        const botaoVerMais = card.querySelector("a.btn-primary");
        if (botaoVerMais) {
          botaoVerMais.setAttribute("data-price", valorFormatadoDesconto);
        }
      }
    });
  }
