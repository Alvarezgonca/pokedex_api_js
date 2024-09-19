let idPokemonAtual = 1;

// Função para buscar Pokémon da API
async function buscarPokemon(id) {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await resposta.json();
}
console.log(buscarPokemon(1));

// Função para criar o card do Pokémon
function criarCardPokemon(pokemon) {
    const card = document.getElementById('cardPokemon');
    const corFundo = getCorFundoPorTipo(pokemon.types[0].type.name);
    card.style.backgroundColor = corFundo;
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Nº ${pokemon.id}</p>
        <p>Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    `;
}

// Função para mostrar detalhes do Pokémon
function mostrarDetalhesPokemon(pokemon) {
    const conteudoDetalhes = document.getElementById('conteudoDetalhes');
    conteudoDetalhes.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height / 10}m</p>
        <p>Peso: ${pokemon.weight / 10}kg</p>
        <p>Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
    `;
    document.getElementById('detalhesPokemon').style.display = 'block';
}

// Função para carregar Pokémon
async function carregarPokemon(id) {
    const pokemon = await buscarPokemon(id);
    criarCardPokemon(pokemon);
    idPokemonAtual = id;
    atualizarBotoesNavegacao();
}

// Função para atualizar botões de navegação
function atualizarBotoesNavegacao() {
    document.getElementById('botaoAnterior').disabled = idPokemonAtual <= 1;
}

// Função para alternar o modo noturno
function alternarModoNoturno() {
    document.body.classList.toggle('modo-noturno');
    const icone = document.querySelector('#botaoModoNoturno i');
    icone.classList.toggle('fa-moon');
    icone.classList.toggle('fa-sun');
}

// Event listeners
document.getElementById('botaoAnterior').addEventListener('click', () => {
    if (idPokemonAtual > 1) {
        carregarPokemon(idPokemonAtual - 1);
    }
});

document.getElementById('botaoProximo').addEventListener('click', () => {
    carregarPokemon(idPokemonAtual + 1);
});

document.getElementById('barraPesquisa').addEventListener('keyup', (evento) => {
    if (evento.key === 'Enter') {
        const pesquisa = evento.target.value.toLowerCase();
        const id = parseInt(pesquisa);
        if (!isNaN(id)) {
            carregarPokemon(id);
        } else {
            buscarPokemon(pesquisa).then(pokemon => {
                carregarPokemon(pokemon.id);
            }).catch(() => {
                alert('Pokémon não encontrado!');
            });
        }
    }
});

document.getElementById('botaoPesquisa').addEventListener('click', () => {
    const pesquisa = document.getElementById('barraPesquisa').value.toLowerCase();
    const id = parseInt(pesquisa);
    if (!isNaN(id)) {
        carregarPokemon(id);
    } else {
        buscarPokemon(pesquisa).then(pokemon => {
            carregarPokemon(pokemon.id);
        }).catch(() => {
            alert('Pokémon não encontrado!');
        });
    }
});

document.getElementById('botaoMostrarDetalhes').addEventListener('click', async () => {
    const pokemon = await buscarPokemon(idPokemonAtual);
    mostrarDetalhesPokemon(pokemon);
});

document.getElementById('botaoModoNoturno').addEventListener('click', alternarModoNoturno);

document.querySelector('.fechar').addEventListener('click', () => {
    document.getElementById('detalhesPokemon').style.display = 'none';
});

function getCorFundoPorTipo(tipo) {
    const coresTipo = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return coresTipo[tipo] || '#fff';
}

carregarPokemon(1);