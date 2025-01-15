'use strict';
// Constantes para la BUSQUEDA
const searchBtn = document.querySelector (".js_seacrh_btn");
const input = document.querySelector (".js-inputsearch");
const resultsContainer = document.querySelector (".js_series_results_container");

// Variable para almacenar las series buscasas: 
let searchedSeries = [];

// PASO 1: BUSQUEDA: escuchamos en el boton de search y creamos su función 

function handleSearh (ev){
    ev.preventDefault();
    // recogemos el texto que se busca: 
    const inputValue = input.value;

    //Hacemos la petición a la API y usamos el término de busqueda para las series de anime relacionadas: 
    fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then ((resp) => resp.json())
    .then ((data) => {
        const seriesAPI = data.data; 
        // la respuesta de la API lo convertimos en JSON, y nos da un data con un array de las series devueltas por el servidor

        // El array de las series devueltas tiene que estar vacío para que no se duplique si se realiza una nueva búsqueda sin recargar la página: 
        searchedSeries=[];

        // Hacemos un bucle sobre el array para obtener los datos que nos interesa: image, titulo y id: 
        
        for (const serie of seriesAPI) {
            // cuando en imagen viene la dirección, ponemos nuestra propia imagen. recorremos el array y usamos operador ternario: 
            const urlImage =
            serie.images.jpg.image_url === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
            ? "https://placehold.co/600x400"
            :serie.images.jpg.image_url;

             // los otros dos datos que nos interesan: titulo y id
            const title = serie.title;
            const id = serie.mal_id;

            // creamos el array con los datos que hemos sacado con push: 
            searchedSeries.push ({ urlImage, title, id });
        }

        // llamamos a la función para que se pinten las series en resultados:
        paintCardsResults (searchedSeries)
    })
}
// Función para pintar las tarjetas de las series en resultados:

function paintCardsResults (series) {
    // Vaciamos el contenedor antes de pintar
    resultsContainer.innerHTML=""

    // recorremos el array de series con un bucle y pintamos el HTML de cada tarjeta
    for (const serie of series) {
        const serieCard =`
        <div class="card">
                <img class="card-img" src="${serie.urlImage}" alt="${serie.title}">
                <h3 class="card-title">${serie.title}</h3>
            </div>
        `;
        
        // añadimos la tarjeta al contenedor
        resultsContainer.innerHTML += serieCard
    }
}


// Escuhamos el boton de buscar
searchBtn.addEventListener ("click", handleSearh)

