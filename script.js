const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 5;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page){
    window.scrollTo({top: 0, behavior: 'instant'});
    if (page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
        console.log('results')
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
        console.log('favorites page')
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        //Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Add to Favorite
        const addToFavorite = document.createElement('p');
        addToFavorite.classList.add('clickable');
        if (page === 'results'){
            addToFavorite.textContent = 'Add to Favorite';
            addToFavorite.setAttribute('onclick', `saveFavorites('${result.url}')`);
        } else {
            addToFavorite.textContent = 'Remove Favorite';
            addToFavorite.setAttribute('onclick', `removeFavorites('${result.url}')`);
        }
        //Card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        //Copyright text
        const copyright = document.createElement('small');
        copyright.classList.add('text-muted');
        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //Author
        const author = document.createElement('span');
        author.textContent = result.copyright;

        link.appendChild(image);
        copyright.append(date, author);
        cardBody.append(cardTitle, addToFavorite, cardText, copyright)
        card.append(link, cardBody);
        imagesContainer.appendChild(card)
    });
}

function updateDOM(page){
    //Get favorites from localStorage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

//GET Images from NASA API
async function getNasaPictures(){
    //Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (e){

    }
};

//Add to favorites
function saveFavorites(itemUrl){
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            //Show save conformation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //Set favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

function removeFavorites(itemUrl){
    if (favorites[itemUrl]){
        delete favorites[itemUrl];
        //Set favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();
