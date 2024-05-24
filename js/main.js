let pokedex = document.querySelector("#pokedex");

async function fetchPokemon() {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=150`;
  let res = await fetch(url);
  let data = await res.json();
  let pokemon = data.results.map((result, index) => ({
    name: result.name,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
    apiURL: result.url,
  }));
  displayPokemon(pokemon);
}

function displayPokemon(pokemon) {
  let pokemonHTMLString = pokemon
    .map(
      (pokeman) =>
        `<li class="card" onclick="selectPokemon(${pokeman.id})">
            <img class="card-image" src="${pokeman.image}" alt="${pokeman.name}" />
            <h2 class="card-title">
              ${pokeman.id}. ${pokeman.name}
            </h2>
            <button class="btn btn-outline-danger btnDelete" id="${pokeman.id}">Delete</button>
            <button>Edit</button>
          </li>`
    )
    .join(" ");
  pokedex.innerHTML = pokemonHTMLString;
}

fetchPokemon();

async function selectPokemon(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let res = await fetch(url);
  let pokeman = await res.json();
  displayPopup(pokeman);
}

function displayPopup(pokeman) {
  let type = pokeman.types.map((type) => type.type.name).join(", ");
  let image = pokeman.sprites["front_default"];
  let htmlString = `
  <div class="popup">
  <button id="closeBtn" onclick="closePopup()"> Close </button>
  
  <div class="card" onclick="selectPokemon(${pokeman.id})">
            <img class="card-image" src="${image}" alt="${pokeman.name}" />
            <h2 class="card-title">
              ${pokeman.id}. ${pokeman.name}
            </h2>
            <p><small>Height:</small>${pokeman.height}| <small>Weight:</small>${pokeman.weight}| <small>Type:</small>${type}</p>
  </div>
  </div>
  `;
  pokedex.innerHTML = htmlString + pokedex.innerHTML;
}

function closePopup() {
  let popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
}

// let promises = [];
// for (let i = 1; i <= 151; i++) {
//   let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
//   promises.push(fetch(url).then((res) => res.json()));
// }

// Promise.all(promises).then((results) => {
//   let pokemon = results.map((data) => ({
//     name: data.name,
//     id: data.id,
//     image: data.sprites["front_default"],
//     type: data.types.map((type) => type.type.name).join(", "),
//   }));
//   displayPokemon(pokemon);
// });
