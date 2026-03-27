// [map-logic.js]

/** 1. 지도 및 레이어 초기화 **/
var imgW = 7300, imgH = 6494;
var imageBounds = [[-imgH, 0], [0, imgW]];
var map = new L.Map('map', { maxZoom: 12, minZoom: -5, crs: L.CRS.Simple, noWrap: true, zoomSnap: 0.25 });
L.imageOverlay('map.jpg', imageBounds).addTo(map);
map.fitBounds(imageBounds);

/** 2. 아이콘 생성 함수들 (기존과 동일) **/
function createHtmlIcon(color) { return L.divIcon({ className: 'mine-clickable-area', html: `<div class="mine-dot" style="background:${color};"></div>`, iconSize: [30, 30], iconAnchor: [15, 15] }); }
function createSteleIcon() { return L.divIcon({ className: 'stele-icon-container', html: `<div class="stele-body"></div>`, iconSize: [24, 34], iconAnchor: [12, 34] }); }

/** 3. 레이어 그룹 준비 **/
var poiLayers = { '스폰': L.layerGroup(), '십이간지': L.layerGroup(), '녹색광산': L.layerGroup(), '청색광산': L.layerGroup(), '황색광산': L.layerGroup(), '적색광산': L.layerGroup() };
var herbLayers = {};
var huntingLayers = {};
var mountainLayers = L.layerGroup();

/** 4. 데이터 기반 마커 생성 (생략 - 기존 로직 그대로 사용) **/
// ... mountainData.forEach, poiData.forEach, herbData.forEach 등 ...

/** 5. 메뉴 UI 구성 (질문하신 누락된 코드 부분) **/
var menuOrder = {
    "스폰": poiLayers['스폰'], 
    "십이간지": poiLayers['십이간지'],
    "<span class='divider-line'></span>": L.layerGroup(),
    "⛰️ 산(비석)": mountainLayers,
    "<span class='divider-line'></span> ": L.layerGroup(),
    "<span class='mine-group-label'>💎 광산 구역</span>": L.layerGroup(),
    "<span style='color: #2ecc71;'>녹색광산</span>": poiLayers['녹색광산'],
    "<span style='color: #3498db;'>청색광산</span>": poiLayers['청색광산'],
    "<span style='color: #f1c40f;'>황색광산</span>": poiLayers['황색광산'],
    "<span style='color: #e74c3c;'>적색광산</span>": poiLayers['적색광산'],
    "<span class='divider-line'></span>  ": L.layerGroup(),
    "<span class='herb-group-label' style='display:flex; justify-content:space-between; align-items:center; width:140px;'>🌿 약초 서식지 <button onclick='resetHerbLayers()' style='cursor:pointer; font-size:10px; padding:1px 4px;'>초기화</button></span>": L.layerGroup()
};

// 약초 목록 자동 추가
Object.keys(herbLayers).sort().forEach(name => {
    var herb = herbData.find(h => h.name === name);
    var isRare = ["월계엽", "철목영지", "금향과", "빙백설화"].includes(name);
    var rareHtml = isRare ? ` <span style="color:#e74c3c; font-size:10px;">(희귀)</span>` : "";
    var htmlLabel = `<span class="herb-name-clickable" onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ}, '${herbColors[name]}')">${name}${rareHtml}</span>`;
    menuOrder[htmlLabel] = herbLayers[name];
});
