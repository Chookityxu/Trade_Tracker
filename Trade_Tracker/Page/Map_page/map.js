
async function nearbySearch() {
    const { Place, SearchNearbyRankPreference } =
        await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    //中心點
    let center = new google.maps.LatLng(pos.lat, pos.lng);

    // 定義請求物件，用於指定條件
    const request = {
        fields: ["displayName", "location", "businessStatus"], //資訊
        locationRestriction: {
            center: center, // 中心點
            radius: 500, // 半徑（以公尺為單位）
        },
        includedPrimaryTypes: ["park"], // 地點類型
        maxResultCount: 5, 
        rankPreference: SearchNearbyRankPreference.POPULARITY, // 排序偏好
        region: "tw", // 區域
    };

    //Place.searchNearby
    const { places } = await Place.searchNearby(request);

    if (places.length) {
        console.log(places);

        // LatLngBounds 類別
        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();
        places.forEach((place) => {
            // 標記來表示這個公園
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location, 
                title: place.displayName, 
            });
            bounds.extend(place.location);
            console.log(place);
        });
        map.fitBounds(bounds);
    } else {
        console.log("No results"); 
    }
}
function test() {

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            // 創建一個地圖設定中心點
            map = new Map(document.getElementById("map"), {
                center: pos,
                zoom: 15,
                mapId: 'aee04ceb2411b364',
            });

            //用戶的位置
            new AdvancedMarkerElement({
                map,
                position: pos,
            });
            nearbySearch();
        },
    );
}

window.onload = function () {
    test();
};