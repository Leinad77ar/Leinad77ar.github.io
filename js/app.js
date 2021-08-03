//CARGA DE JSON CON PRODUCToS
let cartLocalCount = 0;
let newItems, allItems, featItems, everyItem;
$(document).ready(function () {
  getJson();
});
function getJson() {
  $.getJSON("/js/products.JSON", (r) => {
    getItemArrays(r);
  });
}
function getItemArrays(response) {
  newItems = response.filter((item) => item.section == "new");
  allItems = response.filter((item) => item.section == "all");
  featItems = response.filter((item) => item.section == "feat");
  everyItem = allItems.concat(featItems);
  // SE AGREGAN LOS PRODUCTOS A CADA SECCION
  renderProducts(newItems, $("#new_products"));
  renderProducts(featItems, $("#feat_products"));
  renderProducts(allItems, $("#all_products"));
  // SE CARGA EL CARRITO DESDE EL LOCALSTORAGE
  localToCart();
}
// PLANTILLA PARA CADA PRODUCTO
function templateProducts(img, product_name, price) {
  let priceLocaleString = price.toLocaleString();
  return `
<div class="product_header">
    <img src="${img}" alt="">     
</div>
<div class="product_footer">
    <h2>${product_name}</h2>
    <h4 class="price">$${priceLocaleString}</h4>
    <h2 class="button purchase">Comprar</h2>
</div>`;
}
// FUNCIONES PARA AGREGAR Y QUITAR LOS PRODUCTOS
function renderProducts(items, section) {
  for (z of items) {
    let div = document.createElement("div");
    div.className = "product";
    $(div)
      .css("display", "none")
      .html(templateProducts(z.img, z.model, z.price));
    $(section).append(div);
    $(div).fadeIn("slow");
  }
  for (button of $(".purchase")) {
    button.onclick = (event) => {
      addToCart(event.target.parentNode.firstElementChild.innerHTML);
      console.log(event.target.parentNode.firstElementChild.innerHTML);
    };
  }
}
function removeProducts(node) {
  while (node.lastElementChild) {
    $(node.lastElementChild).fadeOut();
    node.removeChild(node.lastElementChild);
  }
}
//EVENTO CLICK DEL SELECT QUE ORDENA LOS PRODUCTOS
$("#select-order").change((e) => {
  if (e.target.value == "lowFirst") {
    orderedLower();
  } else {
    orderedHigher();
  }
});
//FUNCIONES PARA MANEJAR EL EVENTO DE AMBOS BOTONES
function orderedLower() {
  let array = changePriceOrder(-1, allItems);
  removeProducts($("#all_products")[0]);
  renderProducts(array, $("#all_products"));
}
function orderedHigher() {
  let array = changePriceOrder(1, allItems);
  removeProducts($("#all_products")[0]);
  renderProducts(array, $("#all_products"));
}
function changePriceOrder(arg, array) {
  if (arg == -1) {
    return array.sort((a, b) => a.price - b.price);
  } else if (arg == 1) {
    return array.sort((a, b) => b.price - a.price);
  }
}
// INPUT DE BUSQUEDA
$("#clear").click(() => clearInput());
$("#search").keyup(() => findText());
function clearInput() {
  $("#search").val("");
  removeProducts($("#all_products")[0]);
  renderProducts(allItems, $("#all_products"));
}
function findText() {
  let newSearch = filterItems($("#search").val().toLowerCase());
  removeProducts($("#all_products")[0]);
  if (newSearch.length >= 1) {
    renderProducts(newSearch, $("#all_products"));
  } else {
    console.log("no hay resultados");
    popAlert.fire({
      icon: "error",
      title: "No hay resultados!",
    });
  }
}
function filterItems(itemName) {
  return everyItem.filter(function (element) {
    return element.model.toLowerCase().indexOf(itemName) > -1;
  });
}
//EVENTO PARA EL BOTON DE SUBIR LA PAGINA
$("#svgTop").click(() => (document.documentElement.scrollTop = 0));
$(window).scroll(() => {
  if ($(window).scrollTop() > 800) {
    $("#svgTop").show();
  } else {
    $("#svgTop").hide();
  }
});
///////////SWEET ALERT
const filteringError = Swal.mixin({
  toast: true,
  position: "center-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
});
const popAlert = Swal.mixin({
  toast: true,
  position: "center-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
