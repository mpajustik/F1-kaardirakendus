// Loo kaart ja aseta maailmakaardi keskpunkti
var map = L.map('map', {
    center: [20, 0],  // Algne asukoht maailmakaardil
    zoom: 3,          // Algne suum
    minZoom: 3,       // Ei lase liiga kaugele eemalduda
    maxZoom: 10,      // Lubab suumida, kuid mitte liiga kaugele
    worldCopyJump: true, // Keelab lõputu kaardi kopeerimise
    maxBounds: [[-60, -180], [85, 180]], // Takistab väljapoole skrollimist
    maxBoundsViscosity: 1.0 // Määrab, kui "kleepuvad" servad on
});



// Lisa OpenStreetMapi taustakiht
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);


// Funktsioon lippude ikoonide loomiseks
function createFlagIcon(flagUrl) {
    return L.icon({
        iconUrl: flagUrl, // Kasutame lippude pilte
        iconSize: [32, 32], // Lipu suurus
        iconAnchor: [16, 32], // Kinnituspunkti keskele
        popupAnchor: [0, -30] // Et popup oleks lipust kõrgemal
    });
}



// Lae andmed circuits.json failist
fetch('js/circuits.json')
    .then(response => response.json())
    .then(circuits => {
        circuits.forEach(circuit => {
            L.marker([circuit.location[0], circuit.location[1]], { icon: createFlagIcon(circuit.flag) })
                .addTo(map)
                .bindTooltip(circuit.name, { permanent: false, direction: "top" }) // Lisab tooltipi
                .bindPopup(`
                    <div class="popup-scroll">
                        <h3>${circuit.country} ${circuit.name}</h3>
                        <p><strong>Raja pikkus:</strong> ${circuit.length_km} km</p>
                        <p><strong>Ringide arv:</strong> ${circuit.laps}</p>
                        <p class="popup-description"><strong>Tutvustus:</strong> ${circuit.description}</p>
                        <a href="#lightbox" onclick="showLightbox('${circuit.map}')">
                            <img src="${circuit.map}" alt="Raja kaart" width="200">
                        </a><br>
                        <br>
                        <video width="250" controls>
                            <source src="${circuit.video}" type="video/mp4">
                            Sinu brauser ei toeta videot.
                        </video>
                    </div>
                `);
        });
    })
    .catch(error => console.error("Viga JSON-i laadimisel:", error));

    function showLightbox(imageSrc) {
        var lightbox = document.getElementById("lightbox");
        var img = document.getElementById("lightbox-img");
    
        img.src = imageSrc;
        lightbox.style.display = "flex";
    
        // Eemalda #lightbox URL-ist ilma lehte uuesti laadimata
        history.pushState(null, null, window.location.pathname);
    }
    
    function hideLightbox() {
        document.getElementById("lightbox").style.display = "none";
    
        // Eemalda #lightbox URL-ist ilma lehte uuesti laadimata
        history.pushState(null, null, window.location.pathname);
    }
    