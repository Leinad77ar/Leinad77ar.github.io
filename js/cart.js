// CARRITO DE COMPRAS
let totalCart = 0;
let totalCartItems = 0;
let cartArray;
let cartLocalCount = 0;
////////// BOTON COMPRAR DE LA PORTADA
$("#buyCoverItem").click(() => addToCart("S21 Ultra"));

// EVENTOS BOTON Y MOUSELEAVE DEL CARRITO
$("#cart-icon").mouseover(() =>
  $("#shopping-cart-items li").length >= 1
    ? $("#carrito").fadeIn("slow")
    : "cart not shown"
);
$("#carrito").mouseleave(() => $("#carrito").fadeOut());

// PLANTILLA Y FUNCIONES PARA AGREGAR AL CARRITO

function templateCartItems(img, id, model, price) {
  let priceDecimal = price.toLocaleString();
  return `<li class="fix">
  <span class="item-id" style="display: none">${id}</span>
  <img class="item-img" src="${img}"/>
  <span class="item-name">${model}</span>
  <span class="item-price">$ <span class="int-price">${priceDecimal}</span></span>
  <span class="item-delete">Eliminar</span>
  </li>`;
}

class cartPush {
  constructor(id, model) {
    this.id = id;
    this.model = model;
  }
}

function addItemToCart(itemToAdd) {
  if (itemToAdd) {
    cartLocalCount++;
    $("#badge-count").text(cartLocalCount);
    let insertItem = everyItem.find((itemId) => itemId.model == itemToAdd);
    $("#shopping-cart-items").append(
      templateCartItems(
        insertItem.img,
        cartLocalCount,
        insertItem.model,
        insertItem.price
      )
    );
    $("#shopping-cart-items li:last-child .item-delete").click((e) => {
      deleteFromCart(e);
    });
    refreshCart();
  }
}
function addToCart(itemProduct) {
  addItemToCart(itemProduct);
  popAlert.fire({
    icon: "success",
    title: "Agregado al carrito!",
  });
}
function refreshCart() {
  cartArray = [];
  let products = $(".item-name");
  if (products[0]) {
    for (i = 0; i < products.length; i++) {
      let itemToCartArray = new cartPush(i, products[i].innerText);
      cartArray.push(itemToCartArray);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cartArray));
  let total = 0;
  for (price of $(".int-price")) {
    total += parseInt(price.innerText.replaceAll(".", ""));
  }
  $("#totalprice").text(total.toLocaleString());
}
function deleteFromCart(e) {
  if ($("#shopping-cart-items li").length == 1) {
    $("#carrito").fadeOut();
  }
  $(e.target.parentNode).fadeOut("slow", function () {
    $(this).remove();
    refreshCart();
  });
  cartLocalCount--;
  $("#badge-count").text(cartLocalCount);
}

//CARGAR EL CARRITO DESDE EL LOCAL STORAGE
function localToCart() {
  let cartLS = JSON.parse(localStorage.getItem("cart"));
  if (cartLS) {
    for (item of cartLS) {
      addItemToCart(item.model);
    }
  }
}
/// FINALIZAR LA COMPRA
$("#cartItemsBuy").click(async () => {
  Swal.fire({
    title: "Complete sus datos",
    html: `<span>Nombre:</span><input type="text" id="name" class="swal2-input" placeholder="Nombre Completo"><br>
        <span>E-mail:</span><input type="email" id="email" class="swal2-input" placeholder="Direccion de e-mail"><br>
        <span>Teléfono:</span><input type="text" id="number" class="swal2-input" placeholder="Numero Telefónico">
        `,
    confirmButtonText: "Finalizar Compra",
    focusConfirm: false,
    preConfirm: () => {
      const name = Swal.getPopup().querySelector("#name").value;
      const email = Swal.getPopup().querySelector("#email").value;
      const phone = Swal.getPopup().querySelector("#number").value;
      if (!parseInt(phone) || validEmail(email) == false) {
        Swal.showValidationMessage(`Por favor verifique los datos`);
        return;
      }
      return { name: name, email: email, phone: phone };
    },
  }).then(async (result) => {
    if (result.isConfirmed == true) {
      Swal.fire(
        `Gracias por tu compra, ${result.value.name}.
            Se enviaron los detalles a: ${result.value.email}
            `
      ).then((e) => {
        localStorage.clear("cart");
        location.reload();
      });
    }
  });
});
function validEmail(email) {
  let form = /\S+@\S+\.\S+/;
  return form.test(email);
}
