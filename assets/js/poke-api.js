const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 20) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

const searchInput = document.getElementById('search');

let originalPokemons = [];

const maxPokemons = 649;

let searchMode = false;

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        searchMode = true;
        filterPokemons(searchTerm);
    } else {
        searchMode = false;
        clearPokemonList();
        loadOriginalPokemons();
    }
});

function filterPokemons(searchTerm) {
    if (originalPokemons.length === 0) {
        loadOriginalPokemons();
    }

    const filteredPokemons = originalPokemons.filter((pokemon) => {
        return pokemon.name.toLowerCase().startsWith(searchTerm);
    });

    clearPokemonList();

    displayPokemons(filteredPokemons);
}

function loadOriginalPokemons() {
    pokeApi.getPokemons(0, maxPokemons).then((pokemons = []) => {
        originalPokemons = pokemons;

        displayPokemons(originalPokemons);
    });
}

function clearPokemonList() {
    pokemonList.innerHTML = '';
}

function displayPokemons(pokemons) {
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML = newHtml;
}

loadOriginalPokemons();
