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

/** 3. 레이어 그룹 설정 **/
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

/** 4. 광산 동선 관련 함수 **/
var routeLinesByGroup = { "녹": [], "청": [], "황": [], "적": [] };

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

/** 5. 데이터 기반 마커 및 동선 생성 **/

// [A] 광산 동선 생성
if (typeof poiData !== 'undefined') {
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

    // 광산 마커 생성
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
}

// [B] NPC 생성 및 히든 퀘스트 동선
if (typeof npcData !== 'undefined') {
    npcData.forEach(d => {
        var marker = L.marker(mcToPx(d.x, d.z), { 
            icon: L.icon({ iconUrl: d.file, iconSize: [32, 32], iconAnchor: [16, 16] }) 
        }).addTo(npcLayers);
        marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top' });
        marker.on('click', () => showNPCInfo(d));
    });

    // 퀘스트 라인 설정 (상단주)
    var questPathData = [
        npcData.find(n => n.name.includes("상단주")),
        npcData.find(n => n.name.includes("부숴진마차")),
        npcData.find(n => n.name.includes("자운스님"))
    ].filter(p => p !== undefined);

    if (questPathData.length >= 2) {
        window.questLine = L.polyline(questPathData.map(p => mcToPx(p.x, p.z)), {
            color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false
        }).addTo(questLayers);
    }

    // 퀘스트 라인 설정 (뱀)
    var snakeQuestPathData = [
        npcData.find(n => n.name.includes("도사")),
        npcData.find(n => n.name.includes("도공")),
        (typeof huntingInfo !== 'undefined' ? huntingInfo.find(h => h.name === "멸문") : undefined),
        npcData.find(n => n.name.includes("도사"))
    ].filter(p => p !== undefined);

    if (snakeQuestPathData.length >= 2) {
        window.snakeQuestLine = L.polyline(snakeQuestPathData.map(p => p.center || mcToPx(p.x, p.z)), {
            color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false
        }).addTo(questLayers); 
    }

    // [추가된 부분] 해적선 퀘스트 동선
    var pirateQuestPathData = [
        npcData.find(n => n.name.includes("해진")),
        npcData.find(n => n.name.includes("해적선")),
        npcData.find(n => n.name.includes("백향초재배지"))
    ].filter(p => p !== undefined);

    if (pirateQuestPathData.length >= 2) {
        window.pirateQuestLine = L.polyline(pirateQuestPathData.map(p => mcToPx(p.x, p.z)), {
            color: '#a29bfe', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false
        }).addTo(questLayers);
    }

    // NPC 호버 이벤트 연결
    npcLayers.eachLayer(marker => {
        const name = marker.getTooltip()?.getContent();
        if (!name) return;
        marker.on('mouseover', () => {
            if (name.includes("상단주") || name.includes("부숴진마차") || name.includes("자운스님")) window.questLine?.setStyle({ opacity: 0.9 });
            if (name.includes("도사") || name.includes("도공")) window.snakeQuestLine?.setStyle({ opacity: 0.9 });
            if (name.includes("해진") || name.includes("해적선") || name.includes("백향초재배지")) window.pirateQuestLine?.setStyle({ opacity: 0.9 });
        });
        marker.on('mouseout', () => {
            window.questLine?.setStyle({ opacity: 0 });
            window.snakeQuestLine?.setStyle({ opacity: 0 });
            window.pirateQuestLine?.setStyle({ opacity: 0 });
        });
    });
}

// [C] 십이간지
if (typeof zodiacData !== 'undefined') {
    var zodiacOrderNames = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
    var zodiacPathPoints = zodiacOrderNames.map(name => {
        var found = zodiacData.find(z => z.name.includes(name));
        return found ? mcToPx(found.x, found.z) : null;
    }).filter(p => p !== null);

    if (zodiacPathPoints.length >= 2) {
        window.zodiacLine = L.polyline(zodiacPathPoints, { color: '#f1c40f', weight: 6, opacity: 0, dashArray: '10, 10', interactive: false }).addTo(poiLayers['십이간지']);
    }

    zodiacData.forEach(z => {
        var marker = L.marker(mcToPx(z.x, z.z), { 
            icon: L.divIcon({ className: 'zodiac-icon', html: `<div style="width:60px; height:60px;"></div>`, iconSize: [60, 60], iconAnchor: [30, 30] }) 
        }).addTo(poiLayers['십이간지']);
        marker.on('click', () => showZodiacInfo(z));
        marker.bindTooltip(`<b style="font-size:22px; color:#e67e22;">${z.name}</b>`, { direction: 'top' });
        marker.on('mouseover', () => window.zodiacLine?.setStyle({ opacity: 0.9 }));
        marker.on('mouseout', () => window.zodiacLine?.setStyle({ opacity: 0 }));
    });
}

// [D] 산, 사냥터, 상자, 약초 등 나머지 마커들
if (typeof mountainData !== 'undefined') {
    mountainData.forEach(m => {
        var finalPos = m.coords ? m.coords : mcToPx(m.x, m.z);
        var marker = (m.type === "statue") 
            ? L.marker(finalPos, { icon: L.divIcon({ className: 'statue-icon', iconSize: [30, 30], iconAnchor: [15, 30] }) }).addTo(mountainLayers)
            : L.marker(finalPos, { icon: createSteleIcon() }).addTo(mountainLayers);
        
        if (m.type === "statue") marker.bindPopup(`<div style="text-align:center;"><b style="font-size:14px;">${m.name}</b><br><img src="${m.file}" style="width:150px;"><br><span>[${m.x}, ${m.z}]</span></div>`);
        else marker.on('click', () => showHuntingInfo(m));
        
        marker.bindTooltip(`<b>${m.name}</b>`, { direction: 'top' });
    });
}

if (typeof huntingInfo !== 'undefined') {
    huntingInfo.forEach(info => {
        var imgOverlay = L.imageOverlay(info.file, imageBounds, { opacity: 0.6, interactive: false });
        var clickMarker = L.circleMarker(info.center, { radius: 40, color: 'transparent', fillOpacity: 0, interactive: true });
        clickMarker.on('click', (e) => { L.DomEvent.stopPropagation(e); showHuntingInfo(info); });
        huntingLayers[info.name] = L.layerGroup([imgOverlay, clickMarker]);
    });
}

if (typeof discoveryData !== 'undefined') {
    discoveryData.forEach(d => {
        var marker = L.marker(mcToPx(d.x, d.z), { icon: L.divIcon({ className: 'discovery-icon', html: `⚱️`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(discoveryLayers);
        marker.bindTooltip(`<b>${d.item}</b> (${d.name})`);
        marker.on('click', () => showDiscoveryInfo(d));
    });
}

if (typeof herbData !== 'undefined') {
    herbData.forEach(herb => {
        var hCol = herbColors[herb.name] || '#8e44ad';
        var imgOverlay = L.imageOverlay(herb.file, imageBounds, { opacity: 0.6, interactive: false });
        var dotMarker = L.circleMarker(herb.coords, { radius: 3, color: "#000", weight: 1, fillColor: hCol, fillOpacity: 1 });
        if (!herbLayers[herb.name]) herbLayers[herb.name] = L.layerGroup();
        herbLayers[herb.name].addLayer(imgOverlay).addLayer(dotMarker);
    });
}

/** 6. 메뉴 UI 구성 **/
var menuOrder = {
    "스폰": poiLayers['스폰'], 
    "십이간지": poiLayers['십이간지'],
    "<span class='divider-line'></span>": L.layerGroup(),
    "👤 NPC": npcLayers,
    "📜 히든퀘스트": questLayers, 
    "<span class='divider-line'></span> ": L.layerGroup(),
    "⛰️ 산(비석)": mountainLayers,
    "🔍 탐색": discoveryLayers,
    "<span class='divider-line'></span>  ": L.layerGroup(),
    "<span class='mine-group-label'>💎 광산 구역</span>": L.layerGroup(),
    "<span style='color: #2ecc71;'>녹색광산</span>": poiLayers['녹색광산'],
    "<span style='color: #3498db;'>청색광산</span>": poiLayers['청색광산'],
    "<span style='color: #f1c40f;'>황색광산</span>": poiLayers['황색광산'],
    "<span style='color: #e74c3c;'>적색광산</span>": poiLayers['적색광산'],
    "<span class='divider-line'></span>   ": L.layerGroup(),
    "<span class='herb-group-label'>🌿 약초 서식지</span>": L.layerGroup()
};

// 약초 메뉴 동적 생성
Object.keys(herbLayers).sort().forEach(name => {
    var herb = herbData.find(h => h.name === name);
    if (herb) {
        var isRare = ["월계엽", "철목영지", "금향과", "빙백설화", "홍련초"].includes(name);
        var label = `<span onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ})">${name}${isRare ? ' (희귀)' : ''}</span>`;
        menuOrder[label] = herbLayers[name];
    }
});

map.on('click', () => { if(document.getElementById('hunting-info-panel')) document.getElementById('hunting-info-panel').style.display = 'none'; });
