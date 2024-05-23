//!Create

let pokedex = document.querySelector("#pokedex");

let createPokemonBtn = document.querySelector(".createPokemonBtn");

createPokemonBtn.addEventListener("click", () => {
  let whichPokemon = prompt("Какого Покемона создать?");
  fetchPokemon(whichPokemon);
});

async function fetchPokemon(pokemonName) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  let res = await fetch(url);
  let data = await res.json();
  let pokemon = [
    {
      name: data.name,
      id: data.id,
      image: data.sprites.front_default,
      apiURL: url,
    },
  ];
  displayPokemon(pokemon);
}

//!Read

function displayPokemon(pokemon) {
  let pokemonHTMLString = pokemon
    .map(
      (pokeman) =>
        `<li class="card">
            <img class="card-image" src="${pokeman.image}" alt="${pokeman.name}" />
            <h2 class="card-title">
              ${pokeman.id}. ${pokeman.name}
            </h2>
            <button class="deleteBtn">Delete</button>
            <button class="editBtn">Edit</button>
            <button class="selectPokBtn" onclick="selectPokemon(${pokeman.id})"> Select</button>
          </li>`
    )
    .join(" ");
  pokedex.innerHTML += pokemonHTMLString;
}

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

//!delete

document.addEventListener("click", () => {});

document.querySelector(".viewPokemonsBtn").addEventListener("click", () => {
  document.querySelector(".section-2").scrollIntoView({ behavior: "smooth" });
});

//!Delete

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteBtn")) {
    let card = event.target.closest(".card");
    card.parentElement.removeChild(card);
  }
});

let searchBar = document.querySelector(".search-field");

searchBar.addEventListener("input", async () => {
  let searchText = searchBar.value.trim().toLowerCase();
  if (searchText) {
    await fetchAndDisplayPokemon(searchText);
  } else {
    clearPokedex();
  }
});

async function fetchAndDisplayPokemon(searchText) {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch Pokémon!");
    }
    let data = await res.json();
    let filteredPokemon = data.results.filter((pokemon) =>
      pokemon.name.startsWith(searchText)
    );
    await displayPokemonDetails(filteredPokemon);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    alert("Failed to fetch Pokémon!");
    clearPokedex();
  }
}

async function displayPokemonDetails(pokemonList) {
  try {
    let promises = pokemonList.map(async (pokemon) => {
      let res = await fetch(pokemon.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${pokemon.name}`);
      }
      let data = await res.json();
      return {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
      };
    });
    let pokemonDetails = await Promise.all(promises);
    renderPokemonCards(pokemonDetails);
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    alert("Failed to fetch Pokémon details!");
    clearPokedex();
  }
}

function renderPokemonCards(pokemonList) {
  let pokemonHTMLString = pokemonList
    .map(
      (pokemon) =>
        `<li class="card">
            <img class="card-image" src="${pokemon.image}" alt="${pokemon.name}" />
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
          </li>`
    )
    .join(" ");
  pokedex.innerHTML = pokemonHTMLString;
}

function clearPokedex() {
  pokedex.innerHTML = "";
}

// ! Mass display

let createManyBtn = document.querySelector(".createManyBtn");
createManyBtn.addEventListener("click", () => {
  let a = prompt("Сколько Покеменов вы хотите добавить");
  fetchPokemonMass(a);
});

async function fetchPokemonMass(pokNum) {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${pokNum}`;
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
