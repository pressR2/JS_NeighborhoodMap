let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.109990, lng: 17.053},
        zoom: 13
    });
}

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

console.log(data.places[0]);

const placesList = $(".list");
function initList() {
    for (let i = 0; i < data.places.length; i++) {
        let name = data.places[i].name;
        let title = data.places[i].title
        $(`<li role="link" class="list-item">` + name + `<a href=https://en.wikipedia.org/wiki/` + title + `>` + `</a>` + `    
        </li>`).appendTo(placesList);    //zmień na zapis z dolarem//                
    }  
}

initList();

