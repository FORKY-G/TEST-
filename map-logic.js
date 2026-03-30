/** 1. 설정 및 기본 변수 **/
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

/** 2. 아이콘 생성 함수 **/
function createHtmlIcon(color) {
    return L.divIcon({ className: 'mine-clickable-area', html: `<div class="mine-dot" style="background:${color};"></div>`, iconSize: [30, 30], iconAnchor: [15, 15] });
}
function createSteleIcon() {
    return L.divIcon({ className: 'stele-icon-container', html: `<div class="stele-body"></div>`, iconSize: [24, 34], iconAnchor: [12, 34] });
}

/** 3. 레이어 그룹 설정 (최상단 선언) **/
var poiLayers = { 
    '스폰': L.layerGroup(), 
    '십이간지': L.layerGroup(), 
    '녹색광산': L.layerGroup(), 
    '청색광산': L.layerGroup(), 
    '황색광산': L.layerGroup(), 
    '적색광산': L.layerGroup() 
};
var herbLayers = {};
var huntingLayers = {};
var mountainLayers = L.layerGroup();
var discoveryLayers = L.layerGroup();
var redHwanLayers = L.layerGroup();
var npcLayers = L.layerGroup();
var mysteryBoxLayers = L.layerGroup();
var questLayers = L.layerGroup().addTo(map); // 히든퀘스트 레이어

/** 4. 광산 및 동선 로직 **/
var routeLinesByGroup = { "녹": [], "청": [], "황": [], "적": [] };

Object.keys(routeLinesByGroup).forEach(groupTag => {
    const groupMines = poiData
        .filter(p => p.type === groupTag && p.order !== undefined)
        .sort((a, b) => a.order - b.order);

    groupMines.forEach((mine, index) => {
        if (index === groupMines.length - 1) return;
        var nextMine = groupMines[index + 1];
        var typeValue = nextMine.lineType || nextMine.LineType || "";
        var isDotted = typeValue.toString().toLowerCase().trim() === "dotted";
        var dashValue = isDotted ? "15, 15" : null;

        var line = L.polyline([mine.coords, nextMine.coords], {
            color: '#ff4757', weight: 4, opacity: 0, dashArray: dashValue, lineJoin: 'round', interactive: false 
        }).addTo(map);

        routeLinesByGroup[groupTag].push(line);
    });
});

function addGroupRouteHover(marker, groupType) {
    marker.on('mouseover', function () {
        if (routeLinesByGroup[groupType]) {
            routeLinesByGroup[groupType].forEach(line => line.setStyle({ opacity: 1 }));
        }
    });
    marker.on('mouseout', function () {
        if (routeLinesByGroup[groupType]) {
            routeLinesByGroup[groupType].forEach(line => line.setStyle({ opacity: 0 }));
        }
    });
}

/** 5. 산(비석), 광산, 약초 마커 생성 **/
mountainData.forEach(m => {
    var finalPos = m.coords ? m.coords : mcToPx(m.x, m.z);
    if (m.type === "statue") {
        var marker = L.marker(finalPos, { 
            icon: L.divIcon({ className: 'statue-icon', iconSize: [30, 30], iconAnchor: [15, 30] }) 
        }).addTo(mountainLayers);
        marker.bindPopup(`<div style="text-align:center;"><b style="font-size:14px;">${m.name}</b><br><img src="${m.file}" style="width:150px; height:auto; border:2px solid #000; margin-top:5px;"><br><span style="font-size:11px; color:#666;">[${m.x}, ${m.z}]</span></div>`);
    } else {
        var marker = L.marker(finalPos, { icon: createSteleIcon() }).addTo(mountainLayers);
        marker.on('click', () => showHuntingInfo(m));
    }
    marker.bindTooltip(`<div style="text-align:center;"><b style="font-size:14px;">${m.name}</b><br><span>[ ${m.x}, ${m.z} ]</span></div>`, { direction: 'top', offset: [0, -10] });
});

poiData.forEach(poi => {
    var key = (poi.type === '스폰') ? '스폰' : (poi.type === '녹') ? '녹색광산' : (poi.type === '청') ? '청색광산' : (poi.type === '황') ? '황색광산' : (poi.type === '적') ? '적색광산' : null;
    if(key) {
        var marker = L.marker(poi.coords, {icon: createHtmlIcon(poi.color)}).addTo(poiLayers[key]);
        if (poi.order !== undefined) addGroupRouteHover(marker, poi.type);
        if (poi.type === '스폰') marker.bindPopup(`<b>스폰 지점</b><br>[ ${poi.mcX}, ${poi.mcZ} ]`);
        else {
            marker.on('click', () => showMineInfo(poi));
            marker.bindTooltip(`${poi.name}번 광산`, { direction: 'top', offset: [0, -10] });
        }
    }
});

herbData.forEach(herb => {
    var hCol = herbColors[herb.name] || '#8e44ad';
    var imgOverlay = L.imageOverlay(herb.file, imageBounds, { opacity: 0.6, interactive: false });
    var dotMarker = L.circleMarker(herb.coords, { radius: 3, color: "#000", weight: 1, fillColor: hCol, fillOpacity: 1 });
    dotMarker.bindPopup(`<b style="color:${hCol}; font-size:14px;">${herb.name}</b><br><span>[ ${herb.mcX}, ${herb.mcZ} ]</span>`);
    if (!herbLayers[herb.name]) herbLayers[herb.name] = L.layerGroup();
    herbLayers[herb.name].addLayer(imgOverlay).addLayer(dotMarker);
});

/** 6. 십이간지 및 퀘스트 동선 설정 **/
var zodiacOrderNames = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

var zodiacPathPoints = zodiacOrderNames.map(animalName => {
    // .find() 조건을 '===' 대신 '.includes()'로 변경하여 "1.쥐"에서도 "쥐"를 찾게 합니다.
    var found = zodiacData.find(z => z && z.name && z.name.includes(animalName)); 
    return found ? mcToPx(found.x, found.z) : null;
}).filter(p => p !== null);

window.zodiacLine = null;
if (zodiacPathPoints.length >= 2) {
    window.zodiacLine = L.polyline(zodiacPathPoints, {
        color: '#f1c40f', 
        weight: 6, 
        opacity: 0, // 👈 여전히 마우스 올릴 때만 보임 (항상 보려면 0.8로 수정)
        dashArray: '10, 10', 
        interactive: false
    }).addTo(poiLayers['십이간지']);
}

// [B] 십이간지 마커 생성 및 호버 연결
zodiacData.forEach(z => {
    var marker = L.marker(mcToPx(z.x, z.z), { 
        icon: L.divIcon({ className: 'zodiac-icon', html: `<div style="width:60px; height:60px;"></div>`, iconSize: [60, 60], iconAnchor: [30, 30] }) 
    }).addTo(poiLayers['십이간지']);

    marker.on('click', () => showZodiacInfo(z));
    marker.bindTooltip(`<b style="font-size:22px; color:#e67e22;">${z.name}</b>`, { direction: 'top' });
    marker.on('mouseover', () => { if(window.zodiacLine) window.zodiacLine.setStyle({ opacity: 0.9 }); });
    marker.on('mouseout', () => { if(window.zodiacLine) window.zodiacLine.setStyle({ opacity: 0 }); });
});

// [C] 히든 퀘스트 동선 (상단주/뱀)
var questPathData = [
    npcData.find(n => n && n.name && n.name.includes("상단주")),
    npcData.find(n => n && n.name && n.name.includes("부숴진마차")),
    npcData.find(n => n && n.name && n.name.includes("자운스님"))
].filter(p => p !== undefined);

window.questLine = null;
if (questPathData.length >= 2) {
    window.questLine = L.polyline(questPathData.map(p => mcToPx(p.x, p.z)), {
        color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false
    }).addTo(questLayers);
}

var snakeQuestPathData = [
    npcData.find(n => n && n.name && n.name.includes("도사")),
    npcData.find(n => n && n.name && n.name.includes("도공")),
    huntingInfo.find(h => h && h.name === "멸문"),
    npcData.find(n => n && n.name && n.name.includes("도사"))
].filter(p => p !== undefined);

window.snakeQuestLine = null; 
if (snakeQuestPathData.length >= 2) {
    var snakeLatLngs = snakeQuestPathData.map(p => p.coords || p.center || mcToPx(p.x, p.z));
    window.snakeQuestLine = L.polyline(snakeLatLngs, {
        color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false
    }).addTo(questLayers); 
}

/** 7. 기타 마커 (사냥터, 상자, 적환단) **/
huntingInfo.forEach(info => {
    var imgOverlay = L.imageOverlay(info.file, imageBounds, { opacity: 0.6, interactive: false });
    var isMyeonMun = info.name === "멸문";
    var clickMarker = L.circleMarker(info.center, { radius: 40, color: 'transparent', fillColor: 'transparent', fillOpacity: 0, interactive: true });

    clickMarker.on('click', (e) => { if (e.originalEvent) L.DomEvent.stopPropagation(e); showHuntingInfo(info); });
    if (isMyeonMun) {
        clickMarker.addTo(map);
        clickMarker.on('mouseover', () => { if(window.snakeQuestLine) window.snakeQuestLine.setStyle({ opacity: 0.9 }); });
        clickMarker.on('mouseout', () => { if(window.snakeQuestLine) window.snakeQuestLine.setStyle({ opacity: 0 }); });
    }
    huntingLayers[info.name] = L.layerGroup([imgOverlay, clickMarker]);
});

npcData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), { icon: L.icon({ iconUrl: d.file, iconSize: [32, 32], iconAnchor: [16, 16] }) }).addTo(npcLayers);
    if (d.name.includes("상단주") || d.name.includes("부숴진마차") || d.name.includes("자운스님")) {
        marker.on('mouseover', () => { if(window.questLine) window.questLine.setStyle({ opacity: 0.9 }); });
        marker.on('mouseout', () => { if(window.questLine) window.questLine.setStyle({ opacity: 0 }); });
    }
    if (d.name.includes("도사") || d.name.includes("도공")) {
        marker.on('mouseover', () => { if(window.snakeQuestLine) window.snakeQuestLine.setStyle({ opacity: 0.9 }); });
        marker.on('mouseout', () => { if(window.snakeQuestLine) window.snakeQuestLine.setStyle({ opacity: 0 }); });
    }
    marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top' });
    marker.on('click', () => showNPCInfo(d));
});

mysteryBoxData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), { icon: L.icon({ iconUrl: 'box.png', iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(mysteryBoxLayers);
    marker.on('click', () => showDiscoveryInfo(d));
});

redHwanData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), { icon: L.icon({ iconUrl: 'red.png', iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(redHwanLayers);
    marker.on('click', () => showRedHwanInfo(d));
});

/** 8. 메뉴 UI 구성 **/
var menuOrder = {
    "스폰": poiLayers['스폰'], 
    "십이간지": poiLayers['십이간지'],
    "<span class='divider-line'></span>": L.layerGroup(),
    "👤 NPC": npcLayers,
    "📜 히든퀘스트": questLayers, 
    "<span class='divider-line'></span> ": L.layerGroup(),
    "⛰️ 산(비석)": mountainLayers,
    "🔴 적환단": redHwanLayers,
    "📦 의문의상자" : mysteryBoxLayers,
    "<span class='divider-line'></span>  ": L.layerGroup(),
    "<span class='mine-group-label'>💎 광산 구역</span>": L.layerGroup(),
    "<span style='color: #2ecc71;'>녹색광산</span>": poiLayers['녹색광산'],
    "<span style='color: #3498db;'>청색광산</span>": poiLayers['청색광산'],
    "<span style='color: #f1c40f;'>황색광산</span>": poiLayers['황색광산'],
    "<span style='color: #e74c3c;'>적색광산</span>": poiLayers['적색광산'],
    "<span class='divider-line'></span>   ": L.layerGroup(),
    "<span class='herb-group-label' style='display:flex; justify-content:space-between; align-items:center; width:140px;'>🌿 약초 서식지 <button onclick='resetHerbLayers()' style='cursor:pointer; font-size:10px; padding:1px 4px;'>초기화</button></span>": L.layerGroup()
};

map.on('click', () => { if(document.getElementById('hunting-info-panel')) document.getElementById('hunting-info-panel').style.display = 'none'; });

Object.keys(herbLayers).sort().forEach(name => {
    var herb = herbData.find(h => h.name === name);
    if (herb) {
        var isRare = ["월계엽", "철목영지", "금향과", "빙백설화", "홍련초"].includes(name);
        var rareHtml = isRare ? ` <span style="color:#e74c3c; font-size:10px;">(희귀)</span>` : "";
        var htmlLabel = `<span class="herb-name-clickable" onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ}, '${herbColors[name]}')">${name}${rareHtml}</span>`;
        menuOrder[htmlLabel] = herbLayers[name];
    }
});
