/*=============MAP=============*/

let map;
const markers = [];
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.109990, lng: 17.053},
        zoom: 13
    });

    for (let i = 0; i < data.places.length; i++) {
        let position = data.places[i].location;
        let name = data.places[i].name;
        let marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
    }
}

/*=============HAMBURGER=============*/

function openMenu(e) {
    const menu =$("#menu");
    menu.toggleClass("open");
    const infoWindow = $("#infoWindow");
    if (infoWindow !== null) {
        infoWindow.toggleClass("open");
    }
    e.stopPropagation();
}

const hamburger = $(".drawer-control");
hamburger.on('click', openMenu);

/*=============MENU=============*/

const filterBtn = $('.filter');


function initList(param) {
    let searchLocation = data.places.filter(location => location.name.toUpperCase().includes(param.toUpperCase()) || param === "");
    // console.log(searchLocation);
    const placesList = $(".list");
    $('.list-item').remove();
    // console.log(filterBtn.text()); 
    for (let i = 0; i < searchLocation.length; i++) {
        let name = searchLocation[i].name;
        // console.log(searchLocation[i]);
        let title = searchLocation[i].title;
       
        $(`<li role="link" class="list-item">` + `<a href=https://en.wikipedia.org/wiki/` + title + `>` + name + `</a>` +    
        `</li>`).appendTo(placesList);    //zmień na zapis z dolarem//   
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
        input.val('');
        initList('');
    }
    console.log(buttonText);
}




