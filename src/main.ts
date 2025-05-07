import data from "../public/data.json";
import { Produto } from "./models/produto.ts";


document.addEventListener("DOMContentLoaded", () => {
  for (const productData of data) {
    const product = new Produto(
      productData.name,
      productData.price,
      productData.category,
      productData.image.desktop
    )
    product.render();
  }
});