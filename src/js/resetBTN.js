// Constante para el boton de reset
const resetBtn = document.querySelector(".js_reset_btn");

// Creamos la función de reset: 

function handleResetBtn(){
    // Limpiamos los dos arrays, el de búsqueda y el de favoritos: 
    searchedSeries = [];
    favoriteSeries = [];

    // Limpiamos si hay algo escrito en el input de busqueda: 
    input.value ="";

    // Vaciamos los dos contenedores de series buscadas y favortias: 
    resultsContainer.innerHTML="";
    favoritesContainer.innerHTML="";

    // Borramos todo lo que se haya guardado en el localStorage
    localStorage.removeItem("favoriteSeries")
}

// Escuchamos el boton de reset
resetBtn.addEventListener ("click", handleResetBtn);
