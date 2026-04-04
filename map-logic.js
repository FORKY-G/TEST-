/** 1. 지도 기본 설정 **/
var imgW = 7300, imgH = 6494; 
var imageBounds = [[-imgH, 0], [0, imgW]];
var paddedBounds = L.latLngBounds(imageBounds).pad(0.3); 

var map = new L.Map('map', { 
    crs: L.CRS.Simple, 
    noWrap: true, 
    zoomSnap: 0.1,
    maxBounds: paddedBounds,
    maxBoundsViscosity: 0.5
});

L.imageOverlay('map.jpg', imageBounds).addTo(map);
map.setMinZoom(-5); 
map.fitBounds(imageBounds, { padding: [150, 150] });

var currentZoom = map.getZoom();
map.setMinZoom(currentZoom); 
map.setZoom(currentZoom);

/** 2. 아이콘 및 레이어 그룹 초기화 **/
function createHtmlIcon(color) {
    return L.divIcon({ 
        className: 'mine-clickable-area', 
        html: `<div class="mine-dot" style="background:${color};"></div>`, 
        iconSize: [30, 30], iconAnchor: [15, 15] 
    });
}

var poiLayers = { '스폰': L.layerGroup(), '십이간지': L.layerGroup(), '녹색광산': L.layerGroup(), '청색광산': L.layerGroup(), '황색광산': L.layerGroup() };
var npcLayers = L.layerGroup();
var mountainLayers = L.layerGroup();
var redHwanLayers = L.layerGroup();
var discoveryLayers = L.layerGroup();
var questLayers = L.layerGroup();
var herbLayers = {};
var huntingLayers = {};

/** 3. 마커 생성 (NaN 방어 로직 포함) **/

// POI 데이터 (스폰, 광산 등)
if (typeof poiData !== 'undefined') {
    poiData.forEach(function(d) {
        var pos = mcToPx(d.mcX, d.mcZ);
        if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return; // NaN 방어

        if (d.group === '스폰' || d.group === '십이간지') {
            L.marker(pos, { icon: L.icon({ iconUrl: d.file, iconSize: [40, 40] }) }).addTo(poiLayers[d.group]).bindPopup(`<b>${d.name}</b>`);
        } else {
            L.marker(pos, { icon: createHtmlIcon(d.color) }).addTo(poiLayers[d.group]).on('click', function() { showMineInfo(d); });
        }
    });
}

// NPC 데이터
if (typeof npcData !== 'undefined') {
    npcData.forEach(function(d) {
        var pos = d.coords || mcToPx(d.x, d.z);
        if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return; // NaN 방어

        L.marker(pos, { icon: L.icon({ iconUrl: d.file, iconSize: [32, 32] }) }).addTo(npcLayers).on('click', function() { showHuntingInfo(d); });
    });
}

// 산(비석) 데이터
if (typeof mountainData !== 'undefined') {
    mountainData.forEach(function(d) {
        var pos = d.coords;
        if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return;
        L.marker(pos, { icon: L.divIcon({ className: 'stele-body' }) }).addTo(mountainLayers).bindTooltip(d.name, { permanent: true, direction: 'top', className: 'custom-tooltip' });
    });
}

/** 4. 메뉴 구성 **/
var menuOrder = {
    "📍 스폰": poiLayers['스폰'],
    "✨ 십이간지": poiLayers['십이간지'],
    "👤 NPC": npcLayers,
    "⛰️ 산(비석)": mountainLayers,
    "🔴 적환단": redHwanLayers,
    "🔍 탐색/상자": discoveryLayers,
    "💎 녹색광산": poiLayers['녹색광산'],
    "💎 청색광산": poiLayers['청색광산'],
    "💎 황색광산": poiLayers['황색광산']
};
