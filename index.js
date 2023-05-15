// ######################### VARIABLE SETUP #############################

// A constant that represents the total number of pokemons
// that should be displayed one each page.
const DISPLAY_COUNT = 16;

// A constant that represents total number of button to display
const BUTTON_COUNT = 5;
// The page that the user is on.
let currentPage = 1;
let numPages;
let pokemons = [];

const POKEMON_URL_LIMITED = "https://pokeapi.co/api/v2/pokemon?limit=810";

// ############################### DISPLAY TYPES #############################

/*
    Loads all existing pokemon type and stores it into the pokemonType variable
*/
async function fetchType() {
	const responseType = await axios.get("https://pokeapi.co/api/v2/type/");
	const existingTypes = responseType.data.results;

	return existingTypes;
}

/*
    Display all of the pokemon types under the type container
*/
function displayTypes(pokemonType) {
	pokemonType.forEach((type) => {
		$(".type-card-container").append(
			`<input 
                type="checkbox" id="${type.name}" 
                class="typeCheckbox"
                name="type"
                value="${type.name}"/>  
            <label for="${type.name}">${type.name}</label>`
		);
	});
}

function getSelectedPokemonTypes() {
	let selectedTypeList = [];
	document.querySelectorAll(".type-checkbox").forEach((input) => {
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
		pokemonList = pokemonList.concat(currentTypeList);
	}

	const duplicateList = pokemonList.filter((pokemon) => {
		if (seen.includes(pokemon.pokemon.name)) {
			return true;
		} else {
			seen.push(pokemon.pokemon.name);
			return false;
		}
	});

	console.log(`DuplicateList`, duplicateList);

	duplicateList.forEach(async (url) => {
		const pokemonObject = await axios.get(url);
		finalPokemonList.push(pokemonObject);
	});

	return finalPokemonList;
}

/*
    Loads pokemon by type and displays them.
*/
async function addListenerToTypeCards(pokemonType) {
	document.querySelectorAll(".type-checkbox").forEach((input) => {
		input.addEventListener("change", async () => {
			const selectedTypeList = getSelectedPokemonTypes();
			const selectedURL = getURLOfTypes(selectedTypeList, pokemonType);
			const filteredPokemonList = await filterPokemons(selectedURL);
			// console.log(filteredPokemonList);
			console.log(selectedTypeList);
			console.log(selectedURL);

			console.log(filteredPokemonList);
			display(filteredPokemonList);
		});
	});
}

async function fetchAndDisplayTypes() {
	const pokemonType = await fetchType();
	displayTypes(pokemonType);
	// addListenerToTypeCards(pokemonType);
}

// ############################### DISPLAY POKEMON #############################

/*
    Loads 810 pokemons and stores it in the pokemons variable.
*/
async function fetchPokemons() {
	// const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=810");
	// const pokemons = await response.json();
	const responsePokemon = await axios.get(POKEMON_URL_LIMITED);
	console.log(responsePokemon);

	pokemons = await Promise.all(
		responsePokemon.data.results.map(async (pokemon) => {
			const res = await axios.get(pokemon.url);
			return res.data;
		})
	);

	return pokemons;
}

function displayPokemons(pokemons) {}

async function fetchAndDisplayPokemons() {
	const pokemons = await fetchPokemons();
}

// ############################### CONTROL ######################################

async function init() {
	await fetchPokemons();
	await fetchAndDisplayTypes();

	const numPages = Math.ceil(pokemons.length / DISPLAY_COUNT);
	paginate(currentPage, DISPLAY_COUNT, pokemons);
	updatePaginationDiv(currentPage, numPages);

	// Code below referenced from github repo Nabil828/COMP2530-s23-A3-Sample-Code
	// pop up modal when clicking on a pokemon card
	// add event listener to each pokemon card
	$("body").on("click", ".pokeCard", async function (e) {
		const pokemonName = $(this).attr("pokeName");
		// console.log("pokemonName: ", pokemonName);
		const res = await axios.get(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        console.log(res);
		// console.log("res.data: ", res.data);
		const types = res.data.types.map((type) => type.type.name);
		// console.log("types: ", types);
		$(".modal-body").html(`
        <div style="width:200px">
        <img src="${
					res.data.sprites.other["official-artwork"].front_default
				}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities
					.map((ability) => `<li>${ability.ability.name}</li>`)
					.join("")}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats
					.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
					.join("")}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join("")}
          </ul>
      
        `);
		$(".modal-title").html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `);
	});

	// event-listener to typecheckbox
	$("body").on("change", ".type-checkbox-container", async function (e) {
		const $selectedTypes = $("input[name='type']:checked");
		const selectedTypes = $selectedTypes
			.map(function () {
				return this.value;
			})
			.get();
		console.log(`This is the selectedTypes:`, selectedTypes);
		if (selectedTypes.length > 0) {
			let filteredTypes = pokemons.filter((pokemon) => {
				const pokemonTypes = pokemon.types.map((type) => type.type.name);
				return selectedTypes.every((type) => pokemonTypes.includes(type));
			});
			pokemons = filteredTypes;
		} else {
			response = await axios.get(
				"https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
			);
			pokemons = await Promise.all(
				response.data.results.map(async (pokemon) => {
					const res = await axios.get(pokemon.url);
					return res.data;
				})
			);
        }
        paginate(currentPage, DISPLAY_COUNT, pokemons);
        updatePaginationDiv(currentPage, numPages);
	});

	// add event listener to pagination buttons
	$("body").on("click", ".numberedButtons", async function (e) {
		currentPage = Number(e.target.value);
		paginate(currentPage, DISPLAY_COUNT, pokemons);

		//update pagination buttons
		updatePaginationDiv(currentPage, numPages);
	});
	// await fetchAndDisplayPokemons();
}

// Reference: Asked permission and referenced code from Hiroshi Nakasone
function updatePaginationDiv(currentPage, numPages) {
	let html = "";

    // Formula attained from ChatGPT
	const startPage = Math.max(1, currentPage - Math.floor(BUTTON_COUNT / 2));
	const endPage = Math.min(
		numPages,
		currentPage + Math.floor(BUTTON_COUNT / 2)
	);

	if (currentPage > 1) {
		html += `<button class="btn btn-danger page ml-1 numberedButtons" value="${
			currentPage - 1
		}">&lt;</button>`;
	}

	for (let i = startPage; i <= endPage; i++) {
		html += `<button id="active-btn" class="btn btn-danger page ml-1 numberedButtons ${
			i === currentPage ? "active" : ""
		}" value="${i}">${i}</button>`;
	}

	if (endPage < numPages) {
		html += `<button class="btn btn-danger page ml-1 numberedButtons" value="${
			currentPage + 1
		}">&gt;</button>`;
	}

	$("#pagination").html(html);
}

// Referenced from github repo Nabil828/COMP2530-s23-A3-Sample-Code
function paginate(currentPage, displayCount, pokemons) {
	selected_pokemons = pokemons.slice(
		(currentPage - 1) * displayCount,
		currentPage * displayCount
	);

	console.log(`This is Selected:`, selected_pokemons);
	$("#pokeCards").empty();
	selected_pokemons.forEach(async (pokemon) => {
		$("#pokeCards").append(`
        <div class="pokeCard card" pokeName=${pokemon.name}   >
          <h3>${pokemon.name.toUpperCase()}</h3> 
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
            More
          </button>
          </div>  
          `);
	});

	$(".display-pokemon-count").html(
		`<h2>Showing ${selected_pokemons.length} of ${pokemons.length} Pokemon </h2>`
	);
}

init();
