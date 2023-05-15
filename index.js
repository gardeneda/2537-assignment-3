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
