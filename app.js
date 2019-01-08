if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register('./sw.js', { scope:'./'})
      .then(() => {
        // console.log('Registration worked!');
      })
      .catch((error) => {
        // console.log('Registration failed');
        // console.log(error);
      });
  } else {
    // console.log('Service worker unsupported');
  }

/*=============MAP=============*/

let map;
const markers = [];

console.log(markers);
let marker;
const menu = $("#menu");
let searchLocation;
const h3 = $('.header-title h3');

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.109990, lng: 17.053},
        zoom: 14
    });

    for (let i = 0; i < searchLocation.length; i++) {
        let position = searchLocation[i].location;
        let name = searchLocation[i].name;
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name,
            wikiQueryPart: data.places[i].title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
        marker.addListener('click', (function(marker) {
            return function() {
                showInfoWindow();
                backBtn();
                getInfo(marker.wikiQueryPart);
                h3.html(marker.title);

            if (marker.getAnimation() == null) 
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1250);
            };
        })(marker));
    }
    // handleError();
}

function filterMarkers() {
    markers.forEach(marker => {
        const foundPlaces = searchLocation.filter(place => place.title === marker.wikiQueryPart);
       
            if (foundPlaces.length === 0 || foundPlaces === undefined) {
                marker.setMap(null);
            } else {
                marker.setMap(map);
            }      
    });
}

 function getInfo(title) {
    const url =
        "https://en.wikipedia.org/w/api.php?action=query&titles=" +
        title +
        "&prop=extracts&exchars=277&rvprop=content&format=json&formatversion=2&origin=*";

        const image = "https://en.wikipedia.org/w/api.php?action=query&titles=" +
        title +
        "&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=450&pilimit=20&rvprop=content&format=json&formatversion=2&origin=*";

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.query !== undefined) {
                let parsedHtml = data.query.pages["0"].extract;
                
                let p = parsedHtml.slice(0, -3);
                // let linkP = p + "" 
                const article = $("article");
                article.html(p);

                
                $('p:last-child').addClass('multilineEllipseText incidentDescription');

                $(function() {

                    var textContainerHeight= $('#info-window-wrapper p').height();
                    
                    $('.multilineEllipseText').each(function () {
                      var $ellipsisText = $(this);
                      while ($ellipsisText.outerHeight(true) > textContainerHeight) {
                        $ellipsisText.text(function(index, text) {
                          return text.replace(/\W*\s(\S)*$/, '...');
                        });
                      }
                      $ellipsisText.append('<a href="https://en.wikipedia.org/wiki/'+title+'">' + 'read more'+ '</a>');
                    });
                });
                // $('p:last-child').append(`<a href="https://en.wikipedia.org/wiki/`+title+'">' + 'read more'+ `</a>`);
            }
        })
        .catch(err => {
            console.log("err: " + err);
            let errorContent = 'Wikipedia fetch error';
            alert(errorContent);
        });

        
    fetch(image)
    .then(function(response) {
        // console.log(response);
        return response.json();
    })
    .then(data => {
        // console.log(data);
        // let pagesImage = $('.image').attr("src", URL.createObjectURL(myBlob));
       let pagesImage = data.query.pages['0'].thumbnail.source;
       console.log(pagesImage);
       let image = $('.image').attr("src", pagesImage );
    //    image.css("width", "298");
    //    image.css("height", "200");
    })
    .catch(err => {
        console.log("err: " + err);
        let errorContent = 'Wikipedia fetch error';
        alert(errorContent);
    });
}




/*=============HAMBURGER=============*/

function openMenu(e) {
    const menu =$("#menu");
    menu.toggleClass("open");
    e.stopPropagation();
}

const hamburger = $(".drawer-control");
hamburger.on('click', openMenu);

/*=============MENU=============*/

const filterBtn = $('.filter');

function initList(param) {
    searchLocation = data.places.filter(location => location.name.toUpperCase().includes(param.toUpperCase()) || param === "");
    const placesList = $(".list");
    $('.list-item').remove();
    for (let i = 0; i < searchLocation.length; i++) {
        let name = searchLocation[i].name;
        let title = searchLocation[i].title;
        const listItem = $(`<li role="link" class="list-item">` + `<a href="#"` + title + `>` + name + `</a>` +    
        `</li>`);
        listItem.appendTo(placesList);

        listItem.on('click', (function(title) {
            return function() {
                showInfoWindow();
                backBtn();
                getInfo(title);
                h3.html(name);
               
               let currentMarker = markers.filter(marker => marker.wikiQueryPart === title)[0];
            
               currentMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    currentMarker.setAnimation(null);
                }, 1250);
            }  
        })(searchLocation[i].title));
    }  
}

initList('');

/*=============FILTER=============*/

filterBtn.on('click', checkFilterBtnName);

function checkFilterBtnName() {
    const input = $('#filter-location');
    let filter = input.val();
    let buttonText = $('.filter').text().trim();
    
    if (buttonText === 'Filter' && filter !== '') {  
        filterBtn.text('Reset');
        initList(filter);
    } else {
        filterBtn.text('Filter');
        $(`<img class="icon" src="funnel.svg"/>`).appendTo(filterBtn);
        input.val('');
        initList('');
        hideInfoWindow();
    }
    filterMarkers();

}

function hideInfoWindow() {
    const infoWindow = $('#info-window');
    infoWindow.css("visibility", "hidden");
}

function showInfoWindow() {
    const infoWindow = $('#info-window');
    infoWindow.css("visibility", "visible");
}

function backBtn() {
    const backBtn = $('.close');
    backBtn.on('click', hideInfoWindow);
}

  function handleError() {
    const map = $("#map");
    if (map != null) {         

        const text = "Google Maps couldn't load";
        // map.innerHTML = '';
        // map.appendChild(text);
        alert(text);
    }
}


