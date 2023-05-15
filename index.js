// ######################### VARIABLE SETUP #############################

// A constant that represents the total number of pokemons
// that should be displayed one each page.
const DISPLAY_COUNT = 15;

// A constant that represents total number of button to display
const BUTTON_COUNT = 5;
// The page that the user is on.
let currentPage = 1;
let numPages;

const POKEMON_URL_LIMITED = "https://pokeapi.co/api/v2/pokemon?limit=810";

// ############################### DISPLAY TYPES #############################

/*
    Loads all existing pokemon type and stores it into the pokemonType variable
*/
async function fetchType() {
    const responseType = await axios.get("https://pokeapi.co/api/v2/type/");
    const existingTypes = (responseType.data.results);

    return existingTypes;
}

const updatePaginationDiv = (currentPage, numPages) => {
    let html = '';
  
    const startPage = Math.max(1, currentPage - Math.floor(BUTTON_COUNT / 2));
    const endPage = Math.min(numPages, currentPage + Math.floor(BUTTON_COUNT / 2));
  
    if (currentPage > 1) {
      html += `<button class="btn btn-danger page ml-1 numberedButtons" value="${currentPage - 1}">&laquo;</button>`;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      html += `<button id="active-btn" class="btn btn-danger page ml-1 numberedButtons ${i === currentPage ? 'active' : ''}" value="${i}">${i}</button>`;
    }
  
    if (endPage < numPages) {
      html += `<button class="btn btn-danger page ml-1 numberedButtons" value="${currentPage + 1}">&raquo;</button>`;
    }
  
    $('#pagination').html(html);
};
  
/*
    Display all of the pokemon types under the type container
*/
function displayTypes(pokemonType) {
    for (type of pokemonType) {
        let pokemonTypeTemplate = document.getElementById("type-template").content.cloneNode(true);
        let typeTemplateDestination = document.querySelector('.type-card-container');

        pokemonTypeTemplate.querySelector("#pokemon-type").value = type.name;
        pokemonTypeTemplate.querySelector("#pokemon-type").name = type.name;
        pokemonTypeTemplate.querySelector("#type").textContent = type.name;

        typeTemplateDestination.append(pokemonTypeTemplate);
    }
}

function getSelectedPokemonTypes() {
    let selectedTypeList = [];
    document.querySelectorAll(".type-checkbox").forEach(input => {
        if (input.checked) {
            selectedTypeList.push(input.value);
        }
    });
    return selectedTypeList;
}

function getURLOfTypes(selectedList, fullTypeList) {
    let selectedURL = [];
    for (let i = 0; i < selectedList.length; i++) {
        for (let j = 0; j < fullTypeList.length; j++) {
            if (selectedList[i] === fullTypeList[j].name) {
                selectedURL.push(fullTypeList[j].url);
            }
        }
    }

    return selectedURL;
}


async function filterPokemons(selectedURL) {
    let pokemonList = [];
    let seen = [];
    let finalPokemonList = [];
    for (url of selectedURL) {
        let currentTypeList = (await axios.get(url)).data.pokemon;
        pokemonList = pokemonList.concat(currentTypeList)
    }
    
    const duplicateList = pokemonList.filter(pokemon => {
        if (seen.includes(pokemon.pokemon.name)) {

            return true;
            
        } else {

          seen.push(pokemon.pokemon.name);
          return false;
        }
    });
    duplicateList.forEach(url => {
        const pokemonObject = awawit.get(url);
        finalPokemonList.push(pokemonObject);
    })

    return finalPokemonList;

}

/*
    Loads pokemon by type and displays them.
*/
async function addListenerToTypeCards(pokemonType) {
    document.querySelectorAll(".type-checkbox").forEach(input => {
        input.addEventListener('click', async () => {
            const selectedTypeList = getSelectedPokemonTypes();
            const selectedURL = getURLOfTypes(selectedTypeList, pokemonType);
            const filteredPokemonList = await filterPokemons(selectedURL);
            // console.log(filteredPokemonList);
            console.log(selectedTypeList);
            console.log(selectedURL);

            paginate(currentPage, DISPLAY_COUNT, filteredPokemonList);
        });
    });
}

async function fetchAndDisplayTypes() {
    const pokemonType = await fetchType();
    console.log(pokemonType);
    displayTypes(pokemonType);
    addListenerToTypeCards(pokemonType);
}


// ############################### DISPLAY POKEMON #############################

/*
    Loads 810 pokemons and stores it in the pokemons variable.
*/
async function fetchPokemons() {
    // const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=810");
    // const pokemons = await response.json();
    const responsePokemon = await axios.get(POKEMON_URL_LIMITED);
    const pokemons = responsePokemon.data.results;

    return pokemons;
;}

function displayPokemons(pokemons) {
    
}

function displayPokemonModal() {

}

async function fetchAndDisplayPokemons() {
    const pokemons = await fetchPokemons();

}


// ############################### CONTROL ######################################


async function init() {
    await fetchAndDisplayTypes();
    const pokemons = await fetchPokemons();
    console.log((await axios.get("https://pokeapi.co/api/v2/type/1")).data.pokemon.length)
    paginate(currentPage, DISPLAY_COUNT, pokemons);
    const numPages = Math.ceil(pokemons.length / DISPLAY_COUNT)
    updatePaginationDiv(currentPage, numPages)
    // await fetchAndDisplayPokemons();
}


// Referenced from github repo Nabil828/COMP2530-s23-A3-Sample-Code
const paginate = function (currentPage, displayCount, pokemons) {
    const selected_pokemons = pokemons.slice((currentPage - 1) * displayCount, currentPage * displayCount)

    $('#pokeCards').empty()
    selected_pokemons.forEach(async (pokemon) => {
      const res = await axios.get(pokemon.url)
      $('#pokeCards').append(`
        <div class="pokeCard card" pokeName=${res.data.name}   >
          <h3>${res.data.name.toUpperCase()}</h3> 
          <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
            More
          </button>
          </div>  
          `)
    })

    $().html() 
}

init();