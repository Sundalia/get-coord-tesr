const tile = document.getElementById('tile')
const zoom = document.getElementById('zoom')
const btn = document.getElementById('btn')
const img = document.getElementById('img')

const projections = [{
    name: 'wgs84Mercator',
    eccentricity: 0.0818191908426
}, {
    name: 'sphericalMercator',
    eccentricity: 0
}]



//маска на поля
function formatCoord(){
    im = new Inputmask('99.999999 , 99.999999')
    im.mask(tile)

    im = new Inputmask('99')
    im.mask(zoom)

}



//нижеприведенные функции взяты из документации кабинета разработчика яндекс.карт
// https://yandex.ru/dev/tiles/doc/ru/#get-tile-number

// Функция для перевода географических координат объекта 
// в глобальные пиксельные координаты.    
function fromGeoToPixels (lat, long, projection, z) {
    var x_p, y_p,
        pixelCoords,
        tilenumber = [],
        rho,
        pi = Math.PI,
        beta,   
        phi,
        theta,
        e = projection.eccentricity;
    
    rho = Math.pow(2, z + 8) / 2;
    beta = lat * pi / 180;
    phi = (1 - e * Math.sin(beta)) / (1 + e * Math.sin(beta));
    theta = Math.tan(pi / 4 + beta / 2) * Math.pow(phi, e / 2);
    
    x_p = rho * (1 + long / 180);
    y_p = rho * (1 - Math.log(theta) / pi);
    
    return [x_p, y_p];
    }
    
    // Функция для расчета номера тайла на основе глобальных пиксельных координат.
    function fromPixelsToTileNumber (x, y) {
    return [
        Math.floor(x / 256),
        Math.floor(y / 256)
    ];
    }

//37.61774755.786889




btn.addEventListener("click", () => {
    if(!tile.value || !zoom.value){
        alert('БЕЗ ДАННЫХ НИЧЕГО НЕ ПОЛУЧИТСЯ')
    } else {
        const x = Number(tile.value.slice(0,9))
        const y = Number(tile.value.slice(11,21))
        const z = Number(zoom.value)
        // console.log(x,y,z)

        let resultParams1 = fromGeoToPixels(x, y, projections[0], z)
        let resultParams2 = fromPixelsToTileNumber(Number(resultParams1[0]), resultParams1[1])
        console.log(resultParams2, z)
        let reqUrl = `https://core-carparks-renderer-lots.maps.yandex.net/maps-rdr-carparks/tiles?l=carparks&x=${resultParams2[0]}&y=${resultParams2[1]}&z=${z}&scale=1&lang=ru_RU`
        fetch(reqUrl)
            .then((response) => {
                if(response.status == 200) {
                    return response.blob()
                }if(response.status == 204) {
                    alert("НЕТ ТАКОГО ТАЙЛА")
                }
            })
            .then((data) => {
                let url = URL.createObjectURL(data)
                img.src = url
            })
            .catch((error) => {
                console.log(error)
            })
    }
})
