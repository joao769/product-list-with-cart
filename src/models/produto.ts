import { v4 as randomUUID } from "uuid";
import { Carrinho } from "./carrinho";

export class Produto {
    [x: string]: any;
    private _id: string = randomUUID();
    private _quantity: number = 1;
    private _total: number = 0;

    constructor(
        private _name: string,
        private _price: number,
        private _category: string,
        private _imageUrl: string
    ) {
        this.updateTotal();
    }

    get imageUrl() {
        return this._imageUrl;
    }
    get id() {
        return this._id;
    }

    get total() {
        return this._total;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(quantity: number) {
        if (quantity >= 1) {
            this._quantity = quantity;
            this.updateTotal();
        }
    }

    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }

    private updateTotal() {
        this._total = this._price * this._quantity;
    }

    private updateCart() {
        if (this._quantity >= 1) {
            Carrinho.addToCart(this);
        } else {
            Carrinho.removeProduct(this);
        }
    }

    incrementQuantity() {
        this.quantity++;
        this.updateCart();
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
            this.updateCart();
        }
    }

    private updateContent(btnFood: HTMLElement) {
        btnFood.innerHTML = `
          <div id="decrement">
           <svg class="icons-qtd" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
            <path class="svg-path" fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
           </svg>
          </div>
           ${this.quantity} 
          <div id="increment">
           <svg class="icons-qtd" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
          </div>
          `;
    }

    resetButton() {
        const productHTML = document.getElementById(this._id);

        if (productHTML) {
            const btnFood = productHTML.querySelector<HTMLButtonElement>(".qtd-food");
            const productImage = productHTML.querySelector<HTMLImageElement>(".product-image");

            if (btnFood) {
                btnFood.classList.replace("qtd-food", "product-btn");
                btnFood.innerHTML = `
                    <img src="/assets/images/icon-add-to-cart.svg" alt="Adicionar ao carrinho">
                    <p>Add to Cart</p>
                `;
            }

            if (productImage) {
                productImage.classList.remove("bordered");
            }
        }

        this.quantity = 1;
    }

    render() {
        const productHTML = document.createElement("li");
        productHTML.className = "product";
        productHTML.id = this._id;

        productHTML.innerHTML = `
          <div class="product-shop">
            <img class="product-image" src="${this._imageUrl}" alt="${this._name
            }" />
            <button class="product-btn">
              <img src="/assets/images/icon-add-to-cart.svg" alt="Adicionar ao carrinho">
              <p>Add to Cart</p> 
            </button>
          </div>
          <div class="product-infos">
            <span class="product-category">${this._category}</span>
            <span class="product-name">${this._name}</span>
            <span class="product-price">R$ ${this._price.toFixed(2)}</span>
          </div>
        `;

        const productListHTML = document.querySelector(".products");
        if (productListHTML) {
            productListHTML.appendChild(productHTML);
            this.attachEvents(productHTML);
        } else {
            console.error("Elemento .products não encontrado no DOM.");
        }
    }

    private attachEvents(productHTML: HTMLElement) {
        const btnFood =
            productHTML.querySelector<HTMLButtonElement>(".product-btn");
        const productImage =
            productHTML.querySelector<HTMLImageElement>(".product-image");

        if (!btnFood) return;

        btnFood.addEventListener("click", () => {
            btnFood.classList.replace("product-btn", "qtd-food");
            this.updateContent(btnFood);

            productImage?.classList.add("bordered");

            this.updateCart();
            this.addQuantityControls(btnFood);
        });
    }

    private addQuantityControls(btnFood: HTMLElement) {
        const incrementBtn = btnFood.querySelector("#increment");
        const decrementBtn = btnFood.querySelector("#decrement");

        incrementBtn?.addEventListener("click", () => {
            this.incrementQuantity();
            this.updateContent(btnFood);
        });

        decrementBtn?.addEventListener("click", () => {
            this.decrementQuantity();
            this.updateContent(btnFood);
        });
    }
}