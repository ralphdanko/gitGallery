//type your URL here
var url = 'http://www.splashbase.co/api/v1/images/search?query=tree';
var request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function () {
    var list = JSON.parse(this.response);
    let idGallery = document.getElementById("gallery");
    let allLinks ;
    let idGalleryButton = document.getElementById("gallery__button");

    //--------------------------------------------------------------------
    //---------------------------GRID-------------------------------------
    //--------------------------------------------------------------------

    function loadImages(initialImage) {
        //button action
        idGalleryButton.disabled = true;
        idGalleryButton.innerHTML = '<div class="loader__container"><i class="fas fa-spinner fa-spin"></i></div>';

        //choosing initial image
        var i = initialImage;
        //display always 10 elements
        let j = i + 10;
        //prevent for loop from being initialized too many times
        if (j > list.images.length) {
            j = list.images.length;
        }
        
        for (i = initialImage; i < j; i++) {
            if (i < list.images.length){
                let imgHolder = document.createElement("DIV");
                if (i ==  4) {
                    imgHolder.classList.add("colspan1st");
                }
                if (i ==  8) {
                    imgHolder.classList.add("colspan2nd");
                }
                let img = document.createElement("IMG");
                //hide each link, so the images wont be displayed
                imgHolder.classList.add("hidden");
                imgHolder.addEventListener('click', open);
                imgHolder.addEventListener('mouseover', hoverShow);
                imgHolder.addEventListener('mouseout', hoverHide);
                //add event listener thats triggered after the image is being loaded
                img.addEventListener( 'load', isImagesLoaded, false );
                img.setAttribute("src", list.images[i].url);
                img.setAttribute("data-src", list.images[i].large_url);
                img.setAttribute("data-site", list.images[i].site);
                //add site name
                let span = document.createElement("SPAN");
                span.innerHTML = "#" + list.images[i].site;
                idGallery.appendChild(imgHolder);
                imgHolder.appendChild(img);
                imgHolder.appendChild(span);
                if (i < 10) {
                    imgHolder.classList.add("flex");
                }
            }
        }
        
        let counter = 0;
        //triggered by event listener "load", the counter is incremented each time an image is loaded
        //if each image is loaded, then add style display: initial;
        function isImagesLoaded() {
            allLinks = idGallery.getElementsByTagName('div');
            let countImages = allLinks.length - initialImage;
            counter++;
            //the loop is triggered if all images are loaded
            if ( counter === countImages ) {
                //type your action after image is being loaded
                //remove the loading animation
                if (document.getElementById("gallery__loader")) {
                    document.getElementById("gallery__loader").remove();
                }
                let visItem = document.getElementsByClassName("flex");
                addWideImage(visItem);
                idGalleryButton.innerHTML = 'Show More';
                idGallery.style.display = "grid";
                [].forEach.call( allLinks, function( div ) {
                    idGalleryButton.style.display = "block";
                    idGalleryButton.disabled = false;
                    div.classList.remove("hidden");
                } );
                if (i > list.images.length - 1) {
                    idGalleryButton.remove();
                }
            } 
        }
        return i;
    }

    //choose from which element (in JSON) the gallery should start
    z = loadImages(0);
    var k = 10;
    idGalleryButton.onclick = function() {k = loadImages(k)};

    var addWideImage = function(visIt) {
        //remove colspan class from all divs
        [].forEach.call( allLinks, function( div ) {
            div.classList.remove("colspan1st","colspan2nd","colspan3rd","colspan4th");
        } );
        //add colspan class to a desired divs
        function addClass(firstItem, className) {
            for (let j = firstItem; j < visIt.length; j = j + 10){
                visIt[j].classList.add(className);
            }
        }
        //create wider image previews
        addClass(4,"colspan1st");
        addClass(8,"colspan2nd");
        addClass(7,"colspan3rd");
        addClass(9,"colspan4th");
    }

    function hoverShow(showSpan) {
        let span = showSpan.currentTarget.querySelector('span');
        span.style.visibility = "visible";
    }

    function hoverHide(hideSpan) {
        let span = hideSpan.currentTarget.querySelector('span');
        span.style.visibility = "hidden";
    }
    
    //--------------------------------------------------------------------
    //---------------------LIGHTBOX---------------------------------------
    //--------------------------------------------------------------------

    let lightBox = document.getElementById("lightbox");
    let lightBoxImage = lightBox.querySelector('img');
    let lightBoxClose = document.getElementById("lightbox__close");
    let counterLbx = 0;
    function lightBoxLoader() {
        counterLbx++;
        //the loop is triggered if image is loaded
        if (counterLbx === 1) {
            //choose image to load
            lightBoxImage.style.display = "block";
            lightBoxClose.innerHTML = '<i class="fas fa-times"></i>';
        } 
        counterLbx = 0;
    }

    function open(selectedImage){
        //make lightbox visible
        lightBox.classList.add("opened");
        lightBox.addEventListener('click', close);
        let src = selectedImage.currentTarget.querySelector('img').dataset.src;
        let srcSmall = selectedImage.currentTarget.querySelector('img').src;
        //add image. if there is no large image, load small
        if (src == 'null') {
            lightBoxImage.setAttribute("src", srcSmall);
        } else {
            lightBoxImage.setAttribute("src", src);
        }
        lightBox.addEventListener('click', close);
        lightBoxImage.addEventListener('load', lightBoxLoader, false );
    }

    function close() {
        lightBox.classList.remove("opened");
        lightBoxImage.style.display = "none";
        lightBoxClose.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    //--------------------------------------------------------------------
    //---------------------FILTER-----------------------------------------
    //--------------------------------------------------------------------
    function createSitesList() {
        let sitesListFull = [];
        //create array with sites names
        Object.keys(list.images).forEach(function (item) {
            site = list.images[item].site
            sitesListFull.push(site);
        });       
        //remove duplicates from the array 
        sitesList = [...new Set(sitesListFull)];
        return sitesList;
    }
    
    let buttonStates = createButtonStates(1);
    function createButtonStates(x) {
        let buttonState = {};
        let sitesList = createSitesList();
        //create array with button states
        for (let i = 0; i < sitesList.length; i++) {   
            buttonState[sitesList[i]] = x;
        }
        return buttonState;
    }

    function showAll() {
        //change states to 1 for all sites
        buttonStates = createButtonStates(0);
        let sitesList = createSitesList();
        for (let i = 0; i < sitesList.length; i++) {   
            toggleButtonState(sitesList[i]);
            toggleImages(sitesList[i]);
        }
    }
    let visItem = document.getElementsByClassName("flex");
    document.getElementById("show__all").addEventListener('click',showAll);
    document.getElementById("show__all").addEventListener('click', addWideImage.bind(this, visItem));

    var toggleButtonState = function(siteName) {
        let button = document.getElementById(siteName);
        if (buttonStates[siteName] == 0) {
            buttonStates[siteName] = 1;
            button.classList.add("gallery__filters--selected");
        } else {
            buttonStates[siteName] = 0;
            button.classList.remove("gallery__filters--selected");
        }
    }

    var toggleImages = function(siteName) {
        [].forEach.call( allLinks, function( div ) {
            let img = div.querySelector('img');
            if (img.dataset.site == siteName) {
               if (buttonStates[siteName] == 1) {
                    div.classList.add("flex");
                    div.classList.remove("hidden2");
               } else {
                    div.classList.add("hidden2");
                    div.classList.remove("flex");
               }
            }
        } );
    }

    function createButton() {
        let idGalleryFilters = document.getElementById("gallery__filters");
        let siteName;
        let sitesList = createSitesList();
        let visItem = document.getElementsByClassName("flex");
        //create buttons, based on sitesList array
        Object.keys(sitesList).forEach(function (item) {
            siteName = sitesList[item];
            let button = document.createElement("li");
            button.setAttribute("id", siteName);
            button.classList.add("gallery__filters--selected");
            button.addEventListener('click', toggleButtonState.bind(this, siteName));
            button.addEventListener('click', toggleImages.bind(this, siteName));
            button.addEventListener('click', addWideImage.bind(this, visItem));
            idGalleryButton.addEventListener('click', toggleImages.bind(this, siteName));
            button.innerHTML = siteName;
            idGalleryFilters.appendChild(button);
        });   
    }
    createButton();
};
request.send();