import { Produto } from "./produto.js";

export class Carrinho {
  private static _products: Produto[] = [];
  private static _orderTotal: number = 0;
  private static _quantityTotal: number = 0;

  static calculateTotals() {
    this._orderTotal = this._products.reduce(
      (total, product) => total + product.total,
      0
    );
    this._quantityTotal = this._products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  }

  static removeProduct(product: Produto) {
    this._products = this._products.filter((item) => item.id !== product.id);
    this.calculateTotals();
    this.updateCartUI();

    product.resetButton();
  }

  static addToCart(product: Produto) {
    const existingProduct = this._products.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity = product.quantity; 
    } else {
      this._products.push(product);
    }

    this.calculateTotals();
    this.updateCartUI();
  }

  private static showConfirmationOrder() {
    const confirmationHTML = document.createElement("div");
    confirmationHTML.classList.add("overlay", "confirmation-order");

    confirmationHTML.innerHTML = `
        <div class="icon-order-confirmed">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z" fill="#1EA575"/>
          <path d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z" fill="#1EA575"/>
          </svg>
        </div>
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
        <div class="confirmation-order-box">
          <div class="confirmation-order-list">
            ${this._products
        .map(
          (product) => `
                <div class="cart-item">
                  <div class="products-cart-order">
                    <img
                      class="cart-image"
                      src="${product.imageUrl}"
                      alt="${product.name}"
                    />
                    <div class="cart-details">
                      <span class="cart-name">${product.name}</span>
                      <div class="cart-infos-order">
                        <span class="cart-quantity-order">${product.quantity
            }x</span>
                        <span class="cart-price-order">
                          @ $${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span class="cart-total-order">$${product.total.toFixed(
              2
            )}</span>
                  </div>
                </div>
                <hr/>
              `
        )
        .join("")}
          </div>
          <div class="order-total-cart">
                <span class="order-total-msg"><p>Order Total</p></span>
                <span class="order-total-value">$${this._orderTotal.toFixed(
          2
        )}</span>
          </div>
        </div>
        <div><button class="btn-start-new-order">Start New Order</button></div>
      `;

    document.body.appendChild(confirmationHTML);
    document.body.classList.add("overlay");

    document.body.classList.add("body-blur");

    document
      .querySelector(".btn-start-new-order")
      ?.addEventListener("click", () => {
        confirmationHTML.remove();
        document.body.classList.remove("body-blur"); 

        this._products.forEach((product) => product.resetButton());
        this._products = [];
        this.calculateTotals();
        this.updateCartUI();
      });
  }

  private static updateCartUI() {
    const cartElement = document.querySelector(".cart");
    if (!cartElement) return;

    const quantityElement = cartElement.querySelector("h2 span");
    const cartListElement = cartElement.querySelector(".list-cart");
    const emptyCartImage = cartElement.querySelector(".empty-cart");
    const emptyCartMessage = cartElement.querySelector(".product-cart-message");
    const orderTotalElement = cartElement.querySelector(".order-total-cart");
    const carbonNeutralElement = cartElement.querySelector(
      ".carbon-neutral-cart"
    );
    const confirmOrderElement = cartElement.querySelector(
      ".confirm-order-cart"
    );

    if (quantityElement) {
      quantityElement.textContent = this._quantityTotal.toString();
    }

    if (cartListElement) {
      cartListElement.innerHTML = "";
    }

    if (this._products.length === 0) {
      emptyCartImage?.classList.remove("hidden");
      emptyCartMessage?.classList.remove("hidden");
      orderTotalElement?.classList.add("hidden");
      carbonNeutralElement?.classList.add("hidden");
      confirmOrderElement?.classList.add("hidden");
    } else {
      emptyCartImage?.classList.add("hidden");
      emptyCartMessage?.classList.add("hidden");

      this._products.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="products-cart">
              <span class="cart-name">${product.name}</span>
              <div class="cart-infos">
                <span class="cart-quantity">${product.quantity}x</span>
                <span class="cart-price">@ $${product.price.toFixed(
          2
        )}</span>
                <span class="cart-total">$${product.total.toFixed(
          2
        )}</span>
                <div>
                  <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                </div>
              </div>
            </div>
            <hr/>
          `;

        listItem
          .querySelector(".cart-icon")
          ?.addEventListener("click", () => {
            this.removeProduct(product);
          });

        cartListElement?.appendChild(listItem);
      });

      if (orderTotalElement) {
        orderTotalElement.classList.remove("hidden");
        orderTotalElement.innerHTML = `
            <div class="order-total-cart">
              <span class="order-total-msg"><p>Order Total</p></span>
              <span class="order-total-value">$${this._orderTotal.toFixed(
          2
        )}</span>
            </div>
          `;
      }

      if (carbonNeutralElement) {
        carbonNeutralElement.classList.remove("hidden");
        carbonNeutralElement.innerHTML = `
            <div class="carbon-neutral-cart">
              <img src="/assets/images/icon-carbon-neutral.svg" alt="Carbon neutral" />
              <p class="carbon-neutral-msg">This is a <strong>carbon-neutral</strong> delivery</p>
            </div>
          `;
      }

      if (confirmOrderElement) {
        confirmOrderElement.classList.remove("hidden");
        confirmOrderElement.innerHTML = `
            <div>
              <button class="btn-confirm-order-cart">Confirm Order</button>
            </div>
          `;

        const confirmOrderButton =
          confirmOrderElement.querySelector<HTMLButtonElement>(
            ".btn-confirm-order-cart"
          );
        confirmOrderButton?.addEventListener("click", () => {
          this.showConfirmationOrder();
        });
      }
    }
  }

  static get products() {
    return [...this._products];
  }

  static get total() {
    return this._orderTotal;
  }

  static get quantityTotal() {
    return this._quantityTotal;
  }
}