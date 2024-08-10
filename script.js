const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

bar.addEventListener("click", () => {
  nav.classList.add("active");
});

close.addEventListener("click", () => {
  nav.classList.remove("active");
});

let carts = document.querySelectorAll(".add-cart");

let products = [
  {
    name: "gray T-Shirt",
    tag: "f1",
    price: 78,
    inCart: 0,
  },
  {
    name: "black T-Shirt",
    tag: "f2",
    price: 45,
    inCart: 0,
  },
  {
    name: "red T-Shirt",
    tag: "f3",
    price: 66,
    inCart: 0,
  },
  {
    name: "white T-Shirt",
    tag: "f4",
    price: 99,
    inCart: 0,
  },
  {
    name: "green T-Shirt",
    tag: "f5",
    price: 50,
    inCart: 0,
  },
  {
    name: "yellow T-Shirt",
    tag: "f6",
    price: 84,
    inCart: 0,
  },
  {
    name: "tomato T-Shirt",
    tag: "f7",
    price: 91,
    inCart: 0,
  },
  {
    name: "orange T-Shirt",
    tag: "f8",
    price: 75,
    inCart: 0,
  },
  {
    name: "purple T-Shirt",
    tag: "n1",
    price: 59,
    inCart: 0,
  },
  {
    name: "aqua T-Shirt",
    tag: "n2",
    price: 84,
    inCart: 0,
  },
  {
    name: "brown T-Shirt",
    tag: "n3",
    price: 95,
    inCart: 0,
  },
  {
    name: "cyan T-Shirt",
    tag: "n4",
    price: 100,
    inCart: 0,
  },
  {
    name: "crimson T-Shirt",
    tag: "n5",
    price: 118,
    inCart: 0,
  },
  {
    name: "coral T-Shirt",
    tag: "n6",
    price: 68,
    inCart: 0,
  },
  {
    name: "gold T-Shirt",
    tag: "n7",
    price: 123,
    inCart: 0,
  },
  {
    name: "pink T-Shirt",
    tag: "n8",
    price: 66,
    inCart: 0,
  },
];

carts.forEach((carts, index) => {
  carts.addEventListener("click", () => {
    cartNumbers(products[index]);
    totalCost(products[index]);
  });
});

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");

  if (productNumbers) {
    document.querySelector(".numbers-count").textContent = productNumbers;
  }
}

function cartNumbers(product) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".numbers-count").textContent = 1;
  }

  setItems(product);
}

function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    }

    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
  // console.log("The products price is", product.price);
  let cartCost = localStorage.getItem("totalCost");
  console.log("My cart cost is", cartCost);
  console.log(typeof cartCost);

  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  let cartCost = localStorage.getItem("totalCost");

  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
        <div class="product">
          <i class="fa fa-close" data-tag="${item.tag}"></i>
          <img src="img/products/${item.tag}.jpg" />
          <span>${item.name}</span>
          <div class="price">$${item.price}</div>
          <div class="quantity">
            <div class="plus-and-minus">
              <button class="less" data-tag="${item.tag}">-</button>
              <span class="quantity-number">${item.inCart}</span>
              <button class="more" data-tag="${item.tag}">+</button>
            </div>
          </div>
          <div class="total">
            $${item.inCart * item.price}
          </div>
        </div>
      `;
    });
  }

  addQuantityListeners();
  addCloseListeners();
}

function addQuantityListeners() {
  document.querySelectorAll(".less").forEach((button) => {
    button.addEventListener("click", (event) => {
      updateQuantity(event.target.dataset.tag, -1);
    });
  });

  document.querySelectorAll(".more").forEach((button) => {
    button.addEventListener("click", (event) => {
      updateQuantity(event.target.dataset.tag, 1);
    });
  });
}

function addCloseListeners() {
  document.querySelectorAll(".fa-close").forEach((button) => {
    button.addEventListener("click", (event) => {
      removeProduct(event.target.dataset.tag);
    });
  });
}

function updateQuantity(tag, change) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems && cartItems[tag]) {
    cartItems[tag].inCart += change;

    // Ensure quantity doesn't go below 1
    if (cartItems[tag].inCart < 1) {
      cartItems[tag].inCart = 1;
    }

    if (cartItems[tag].inCart <= 0) {
      delete cartItems[tag];
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    updateCartTotals();
    displayCart();
  }
}

function removeProduct(tag) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems && cartItems[tag]) {
    // Remove the product from the cartItems object
    delete cartItems[tag];
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));

    // Update the cart totals after removing the product
    updateCartTotals();

    // Update the display of cart items
    displayCart();

    // Update the cart number display
    let productNumbers = localStorage.getItem("cartNumbers");
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
      // Get the number of items to be removed from cartNumbers
      let removedQuantity = productNumbers - 1;

      if (removedQuantity <= 0) {
        localStorage.removeItem("cartNumbers");
        document.querySelector(".numbers-count").textContent = 0;
      } else {
        localStorage.setItem("cartNumbers", removedQuantity);
        document.querySelector(".numbers-count").textContent = removedQuantity;
      }
    }
  }
}

function updateCartTotals() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems) || {};
  let cartCost = 0;

  Object.values(cartItems).forEach((item) => {
    cartCost += item.price * item.inCart;
  });

  document.getElementById("cart-subtotal").textContent = `$${cartCost.toFixed(
    2
  )}`;
  document.getElementById("total").textContent = `$${cartCost.toFixed(2)}`;
}

// Initialize functions when the page loads
onLoadCartNumbers();
displayCart();
updateCartTotals();
