let offset = 0;
const limit = 20;
let cardsColumn = '';
let canRequest = true;
const pokeName = '';
const cards = $(".cards-place");
const modalBg = $('.modal-background');
const modal = $('.modal');
const sideImage = $('.side-image')
const modalText = $('.modal-text');

// Continuar mexendo no HTML junto com o JS.

modalBg.on('click', () => {
  modal.removeClass('is-active');
})

function openModal(data) {
  console.log(data);
  const pokeType = $('.poke-type');
  const pokeTypeImg = $('.poke-type-img');
  // const pokeTypeImgTwo = $('.poke-type-img-2');
  const pokeEvolution = $('.poke-evolution');
  const pokeEvolutionImg = $('.poke-evolution-img');
  const pokeBaseExperience = $('.poke-base-experience');
  const pokeStatsNumberHp = $('.poke-stats-number-hp');
  const pokeStatsNumberAttack = $('.poke-stats-number-attack');
  const pokeStatsNumberDefense = $('.poke-stats-number-defense');
  pokeStatsNumberHp.text(data.stats[0].base_stat);
  pokeStatsNumberAttack.text(data.stats[1].base_stat);
  pokeStatsNumberDefense.text(data.stats[2].base_stat);
  let i = 0;
  while (i <= 3) {
    pokeType.eq(i).text('');
    pokeTypeImg.eq(i).attr('src','');
    pokeEvolutionImg.eq(i).attr('src','');
    pokeEvolution.eq(i).text('No Evolution');
    i+=1;
  } 
  $('.hp').val(data.stats[0].base_stat);
  $('.attack').val(data.stats[1].base_stat);
  $('.defense').val(data.stats[2].base_stat);

  const pokeSkills = $('.poke-skills'); // Pegar cada habilidade, transformar em um botão, e ao clicar aparecer em um novo modal ou uma descrição em baixo o effect (data.abilities[array].ability.url -> effect_entries[0].effect)
  // data.stats[arraynumber].base_stat; = Valor do status.
  // data.stats[arraynumber].stat.name; = Nome do status.
  let pokeSkill = '';
  let pokeTypeName = '';
  pokeBaseExperience.eq(1).text('');
  pokeBaseExperience.eq(2).text('');
  for (i = 0; i < data.abilities.length; i++) {
    pokeSkill = capitalize(data.abilities[i].ability.name);
    pokeSkills.eq(i).text(pokeSkill);
  }
  console.log(data.types);
  for(let j = 0; j < data.types.length; j++) {
    pokeTypeName = capitalize(data.types[j].type.name);
    pokeTypeImg.eq(j).attr('src', `./uploads/${pokeTypeName} Symbol.png`)
    pokeType.eq(j).text(pokeTypeName);
  }
  modal.addClass('is-active');
  modalText.text(capitalize(data.name));
  pokemImage = data.sprites.front_default;
  sideImage.find('img').attr('src', pokemImage) 
  // In order to get the next evolution of the pokemon: 
  // data.species.url -> Fazer um fetch nesta URL -> data.evolution_chain.url -> Fazer um fetch nesta URL -> data.chain.evolves_to.species.name
  fetch(data.species.url)
  .then(res => {
    if(!res.ok) {
      console.log('Problem');
      return;
    }
    return res.json();
  })
  .then(data => {
    fetch(data.evolution_chain.url)
    .then(res => {
      if(!res.ok) {
        console.log('Problem');
        return;
      }
      return res.json();
    })
    .then(data => {
      fetch(data.chain.species.url) //First Evolution
      .then(res => {
        if(!res.ok) {
          console.log('Problem');
          return;
        }
        return res.json();
      })
      .then(data => {
        fetch(data.varieties[0].pokemon.url)
        .then(res => {
          if(!res.ok) {
            console.log('Problem');
            return;
          }
          return res.json();
        })
        .then(data => {
          let pokeFirstEvolutionImage = data.sprites.front_default; //Criar uma animação com as imagens usando CSS.
          pokeEvolution.eq(0).text(capitalize(data.species.name))
          pokeBaseExperience.eq(0).text("Base Experience: " + data.base_experience)
          pokeEvolutionImg.eq(0).attr('src', pokeFirstEvolutionImage)
        })
      })
      if(data.chain.evolves_to.length != 0) {
        fetch(data.chain.evolves_to[0].species.url) //Second Evolution
        .then(res => {
          if(!res.ok) {
            console.log('Problem');
            return;
          }
          return res.json();
        })
        .then(data => {
          fetch(data.varieties[0].pokemon.url)
          .then(res => {
            if(!res.ok) {
              console.log('Problem');
              return;
            }
            return res.json();
          })
          .then(data => {
            let pokeSecondEvolutionImage = data.sprites.front_default; //Criar uma animação com as imagens usando CSS.
            pokeEvolution.eq(1).text(capitalize(data.species.name))
            pokeBaseExperience.eq(1).text("Base Experience: " + data.base_experience)
            pokeEvolutionImg.eq(1).attr('src', pokeSecondEvolutionImage)
          })
        })
        pokeSecondEvolution = capitalize(data.chain.evolves_to[0].species.name) 
      } else {
        return;
      }
      if(data.chain.evolves_to[0].evolves_to[0]){
        fetch(data.chain.evolves_to[0].evolves_to[0].species.url) // Third Evolution
        .then(res => {
          if(!res.ok) {
            console.log('Problem');
            return;
          }
          return res.json();
        })
        .then(data => {
          fetch(data.varieties[0].pokemon.url)
          .then(res => {
            if(!res.ok) {
              console.log('Problem');
              return;
            }
            return res.json();
          })
          .then(data => {
            let pokeThirdEvolutionImage = data.sprites.front_default; //Criar uma animação com as imagens usando CSS.
            if (data.base_experience == null){
              data.base_experience = 'Unkown'
            }
            pokeEvolution.eq(2).text(capitalize(data.species.name))
            pokeBaseExperience.eq(2).text("Base Experience: " + data.base_experience)
            pokeEvolutionImg.eq(2).attr('src', pokeThirdEvolutionImage)
          })
        })
      }
    })
    })  
}

async function loadData() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  const results = data.results;

  const promises = results.map(async result => {
    return fetch(`${result.url}`)
      .then(res => {
        if(!res.ok) {
          console.log('Problem');
          return;
      }
      return res.json();
    })
  })

  const pokemonDataArray = await Promise.all(promises);

  let template = '';
  pokemonDataArray.forEach((data) => {
      const pokemonImage = data.sprites.front_default;
      // const pokemonImage = data.sprites.versions['generation-i']['red-blue'].front_default;
      const pokeName = capitalize(data.name);
      const stringifiedData = JSON.stringify(data);
      cardsColumn = `
        <button class="pokemodal" onclick='openModal(` + stringifiedData + `)' >
          <div class="card is-clickable card-hover py-3">
            <div class="is-flex has-text-centered mx-1 px-6 py-3">
              <img class="figure-img" src="${pokemonImage}">
            </div>
            <div class="card-content pt-0">
                <p class="poke-name is-size-4">${pokeName}</p>
            </div>
          </div>
        </button> 
      `;
      template += cardsColumn
  })
  
  cards.append(template)
  
  canRequest = true;
  cardsColumn = '';
  offset += limit;
  
  if (results.length === 0) {
    window.removeEventListener('scroll', loadMore);
  }
}

function loadMore() {
  const { scrollTop, scrollHeight } = document.documentElement;
  
  if (scrollTop / scrollHeight >= 0.5) {
    if (canRequest) {
      canRequest = false;
      loadData();
    }
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

window.addEventListener('scroll', loadMore);
document.addEventListener("DOMContentLoaded", loadData())

// document.getElementById('cards-place').innerHTML = cards;



  // fetch('https://pokeapi.co/api/v2/')
  //     .then(res => {
  //         if(!res.ok) {
  //             console.log('Problem');
  //             return;
  //         }
  
  //         return res.json();
  // }) 
  //     .then(data => {
  //         console.log(data)
  //     })  
  //         .catch(error => {
  //             console.log(error);
  //         });

// fetch('https://pokeapi.co/api/v2/')
//     .then(res => {
//         if(!res.ok) {
//             console.log('Problem');
//             return;
//         }
    
//             return res.json();
//     }) 
//         .then(data => {
//             console.log(data)    
        // const imageUrl = data.sprites.front_default;
        // const pokemonName = data.name;
        // console.log(imageUrl);
        // console.log(pokemonName);
        // document.getElementById('pokemon-image').setAttribute('src', imageUrl);
        // document.getElementById('pokemon-name').textContent = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        // console.log(abilityUrl);
        // fetch(abilityUrl)
        //     .then(res => {
        //         return res.json();
        //     })
        //     .then(abilityData =>{
        //         console.log(abilityData.results[1]);
        //         const firstAbility = abilityData.results[0];
        //         console.log(firstAbility.name);
        //         console.log(firstAbility.url);
        //     })
        // for(let key in data){
        //     console.log(key, data[key]);
        // }
