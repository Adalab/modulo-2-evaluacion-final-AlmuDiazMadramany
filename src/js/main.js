'use strict';
// Constantes para BUSQUEDA
const searchBtn = document.querySelector (".js_seacrh_btn");
const input = document.querySelector (".js-inputsearch");
const resultsContainer = document.querySelector (".js_series_results_container");
const resultsAll = document.querySelector (".js_results_all");

// Constantes para FAVORITOS
const favoritesContainer = document.querySelector (".js_series_favs_container");
const favoritesAll = document.querySelector (".js_favs_all");
// Array para almacenar las series buscadas: 
let searchedSeries = [];

// Array para almacenar las series favoritas: 
let favoriteSeries =[];


// PARTE 4 LOCALSTORAGE. Recuperamos favoritos al cargar la página:
function getFavoritesFromLS(){
const savedFavorites = localStorage.getItem("favoriteSeries");
if (savedFavorites) {
    favoriteSeries = JSON.parse(savedFavorites);
    paintCardsFavorites();
}
}

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
            searchedSeries.push ({ urlImage, title, id, isSelected:false});
            // PARTE 3 FAVORITOS: hemos añadido una propoedad is Selected a cada obejto cuando se añade al array, para poder rastrear la tarjeta seleccionada. 
        }

        // llamamos a la función para que se pinten las series en resultados:
        paintCardsResults (searchedSeries)
    })
}


// Función para pintar las tarjetas de las series en resultados:
function paintCardsResults (series) {
    // Vaciamos el contenedor antes de pintar
    resultsContainer.innerHTML="";

    // recorremos el array de series con un bucle y pintamos el HTML de cada tarjeta
    for (const serie of series) {

        // creamos una constante para la propiedad is selected, si es true añade la clase selectedCard, si no, no hace nada. Hacemos lo mismo con el titulo
        const selectedClass = serie.isSelected ? "selectedCard" : "" ; 
        const selectedTitle = serie.isSelected ? "selectedTitle" : "";
        const serieCard =`
        <div class="card ${selectedClass}" id="${serie.id}">
                <img class="card_img" src="${serie.urlImage}" alt="${serie.title}"/>
                <h3 class="card_title ${selectedTitle}">${serie.title}</h3>
            </div>
        `;
        // Añadimos el id al contenedor de la tarjeta entero, id= para que se clicke en toda la tarjeta

        // añadimos la tarjeta al contenedor
        resultsContainer.innerHTML += serieCard
    }

    // Eliminamos la clase de hidden para que aparezca:
        resultsAll.classList.remove("hidden");

    // PARTE 2: FAVORITOS 
    // Añadimos un evento click a cada tarjeta cuando se marque como favorita

         addEventListenerstoCards ();
    

}

// Funcion para pintar las tarjetas de las series en series favoritas: 
function paintCardsFavorites (){
    //Vaciamos el contenedor antes de pintar
    favoritesContainer.innerHTML="";
    
    //recorremos el array de las series favortias y lo pintamos en el HTML
    for (const serie of favoriteSeries) {
        favoritesContainer.innerHTML +=`
      <div class="card_favorites" id=${serie.id}>
        <img class="card_img_favorites" src="${serie.urlImage}" alt="${serie.title}"/>
        <h3 class="card_title_favorites">${serie.title}</h3>
      </div>`;
    }
    // eliminamos la clase hidden para que nos aparezcan los favoritos
    favoritesAll.classList.remove("hidden");

}


// Funcion para las series favoritas
function handleFavorites (ev){
    // recogemos el id de la serie click
    const clickSerieId = parseInt (ev.currentTarget.id);

    // Comparamos ids para identificar la serie seleccionada
    const clickSerie =searchedSeries.find((serie)=> serie.id === clickSerieId);
    
    // Comprobamos si la serie ya está en favoritos con FINDINDEX que busca en el indice el primer id que cumpla la condición de ser igal que el id de la serie clickada
    const favoriteIndex = favoriteSeries.findIndex((serie)=> serie.id ===clickSerieId);

    // si no está, la añadimos a favoritos con PUSH para añadirlo al array / PARTE 3 FAVORITOS: añadimos la clase seleccionada. 
     // si está, la eliminamos de favoritos con SPLICE para eliminarlo del array para que no se duplique.
    if (favoriteIndex === -1){
        favoriteSeries.push (clickSerie);
        clickSerie.isSelected = true;
        
    }else{
        favoriteSeries.splice (favoriteIndex,1);
        clickSerie.isSelected = false;
    }
    // PARTE 3, actualizamos la propiedad isSelectec en cada caso para que se pinten con el estilo selectedCard


    // PARTE 4 LOCALSTORAGE. Almacenamos los datos en el localStorage. Lo hacemos aqui porque es cuando una serie se ha seleccionado como favorita: 
    localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeries));

    // Llamamos a la función de resultados para que se mantengan los resultados de la busqueda:
    paintCardsResults (searchedSeries);

    // Llamamos a la función de favortias para mostrar las favoritas: 
    paintCardsFavorites();
}



//Creamos una función para añadir lo eventos de "click" sobre las tarjetas que ya aparecen en las busquedas: 
function addEventListenerstoCards (){
    // Esta clase .card se la hemos puesto al dibujarlo en el html:
    const cards = document.querySelectorAll(".card");
   
    //recorremos el array y añadimos un addventlistener y cuando se haga click se ejecuta la función para las series favoritas:
    for (const card of cards){
        card.addEventListener("click", handleFavorites);
    }
}


// Escuhamos el boton de buscar
searchBtn.addEventListener ("click", handleSearh)

// PARTE 4 LOCAL STORAGE: llamamos ala función que descarga los datos de localStorage para que se cargen los favoritos
getFavoritesFromLS();
