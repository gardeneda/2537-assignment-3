/*
    VARIABLE SETUP #######################
*/

const pokemons = [];
const displayCount = 15;
const currentPage = 1;

/*
    ######################################
*/


async function fetchPokemons() {
    // const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=810");
    // const pokemons = await response.json();
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
    pokemons = response.data;
}

function serachType() {

}


async function init() {
    fetchPokemons();

}



const pagination = function (displayCount) {
    
}


init();