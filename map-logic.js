/** 1. 지도 기본 설정 **/
var imgW = 7300, imgH = 6494; // 배경 지도 이미지 크기
var imageBounds = [[-imgH, 0], [0, imgW]];
var paddedBounds = L.latLngBounds(imageBounds).pad(0.3); 

var map = new L.Map('map', { 
    crs: L.CRS.Simple, 
    noWrap: true, 
    zoomSnap: 0.1,
    maxBounds: paddedBounds,
    maxBoundsViscosity: 0.5
});

// 배경 지도 레이어
L.imageOverlay('map.jpg', imageBounds).addTo(map);

map.setMinZoom(-5); 
map.fitBounds(imageBounds, { padding: [150, 150] });

var currentZoom = map.getZoom();
map.setMinZoom(currentZoom); 
map.setZoom(currentZoom);

/** 2. 아이콘 생성 함수 **/
function createHtmlIcon(color) {
    return L.divIcon({ 
        className: 'mine-clickable-area', 
        html: `<div class="mine-dot" style="background:${color};"></div>`, 
        iconSize: [30, 30], 
        iconAnchor: [15, 15] 
    });
}

function createSteleIcon() {
    return L.divIcon({ 
        className: 'stele-icon-container', 
        html: `<div class="stele-body"></div>`, 
        iconSize: [24, 34], 
        iconAnchor: [12, 34] 
    });
}

/** 3. 레이어 그룹 초기화 **/
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
var questLayers = L.layerGroup().addTo(map);

/** 4. 광산 동선 (Hover 시 표시) **/
var routeLinesByGroup = { "녹": [], "청": [], "황": [], "적": [] };

if (typeof poiData !== 'undefined') {
    Object.keys(routeLinesByGroup).forEach(groupTag => {
        const groupMines = poiData.filter(p => p.type === groupTag && p.order !== undefined).sort((a, b) => a.order - b.order);
        groupMines.forEach((mine, index) => {
            if (index === groupMines.length - 1) return;
            var nextMine = groupMines[index + 1];
            var isDotted = (nextMine.lineType || "").toString().toLowerCase().trim() === "dotted";
            
            // mcToPx를 거친 좌표를 사용하여 라인 생성
            var line = L.polyline([mine.coords, nextMine.coords], { 
                color: '#ff4757', 
                weight: 4, 
                opacity: 0, 
                dashArray: isDotted ? "15, 15" : null, 
                interactive: false 
            }).addTo(map);
            routeLinesByGroup[groupTag].push(line);
        });
    });
}

/** 5. 퀘스트 및 십이간지 동선 설정 **/
var questLines = { standard: null, snake: null, pirate: null, haemusa: null, zodiac: null };

if (typeof npcData !== 'undefined') {
    // 헬퍼 함수: 이름으로 데이터 찾기
    const findN = (name) => npcData.find(n => n.name.includes(name));

    // 1. 상단주 동선
    var qPath = [findN("상단주"), findN("부숴진마차"), findN("자운스님")].filter(p => p);
    if (qPath.length >= 2) questLines.standard = L.polyline(qPath.map(p => mcToPx(p.x, p.z)), { color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12' }).addTo(questLayers);

    // 2. 뱀/호리병 동선
    var myeonMun = (typeof huntingInfo !== 'undefined') ? huntingInfo.find(h => h.name === "멸문") : null;
    var sPath = [findN("도사"), findN("도공"), myeonMun, findN("도사")].filter(p => p);
    if (sPath.length >= 2) questLines.snake = L.polyline(sPath.map(p => p.center || mcToPx(p.x, p.z)), { color: '#2ecc71', weight: 6, opacity: 0, dashArray: '12, 12' }).addTo(questLayers);

    // 3. 해적선 동선
    var pPath = [findN("해진"), findN("해적선"), findN("백향초재배지")].filter(p => p);
    if (pPath.length >= 2) questLines.pirate = L.polyline(pPath.map(p => mcToPx(p.x, p.z)), { color: '#3498db', weight: 6, opacity: 0, dashArray: '12, 12' }).addTo(questLayers);

    // 4. 해무사 퀘스트
    var hPath = [findN("해무사승려"), findN("연운객"), findN("시녀")].filter(p => p);
    if (hPath.length >= 2) questLines.haemusa = L.polyline(hPath.map(p => mcToPx(p.x, p.z)), { color: '#a29bfe', weight: 6, opacity: 0, dashArray: '12, 12' }).addTo(questLayers);
}

/** 6. 마커 생성 및 레이어 배정 **/

// NPC 마커
if (typeof npcData !== 'undefined') {
    npcData.forEach(d => {
        var marker = L.marker(mcToPx(d.x, d.z), { 
            icon: L.icon({ iconUrl: d.file, iconSize: [32, 32], iconAnchor: [16, 16] }) 
        }).addTo(npcLayers);
        
        marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top' });
        
        marker.on('mouseover', () => {
            if (d.name.match(/상단주|부숴진마차|자운스님/)) questLines.standard?.setStyle({ opacity: 0.9 });
            if (d.name.match(/도사|도공/)) questLines.snake?.setStyle({ opacity: 0.9 });
            if (d.name.match(/해진|해적선|백향초재배지/)) questLines.pirate?.setStyle({ opacity: 0.9 });
            if (d.name.match(/해무사승려|연운객|시녀/)) questLines.haemusa?.setStyle({ opacity: 0.9 });
        });
        marker.on('mouseout', () => {
            Object.values(questLines).forEach(line => line?.setStyle({ opacity: 0 }));
        });
    });
}

// 사냥터 설정
if (typeof huntingInfo !== 'undefined') {
    huntingInfo.forEach(info => {
        var layers = [];
        // 아이콘 표시 (혈교도 등)
        if (info.file && info.name === "혈교도") {
            var iconMarker = L.marker(info.center, { 
                icon: L.icon({ iconUrl: info.file, iconSize: [45, 45], iconAnchor: [22, 22] }),
                interactive: false 
            });
            layers.push(iconMarker);
        } 
        // 배경 오버레이 (나머지)
        else if (info.file) {
            layers.push(L.imageOverlay(info.file, imageBounds, { opacity: 0.6, interactive: false }));
        }

        // 클릭 감지용 투명 마커
        var clickMarker = L.circleMarker(info.center, { radius: 35, color: 'transparent', fillOpacity: 0 });
        clickMarker.on('click', (e) => { L.DomEvent.stopPropagation(e); showHuntingInfo(info); });
        
        layers.push(clickMarker);
        huntingLayers[info.name] = L.layerGroup(layers);
    });
}

// 십이간지
if (typeof zodiacData !== 'undefined') {
    zodiacData.forEach(z => {
        var marker = L.marker(mcToPx(z.x, z.z), { 
            icon: L.divIcon({ className: 'zodiac-icon', html: `<div style="width:40px; height:40px;"></div>`, iconSize: [40, 40] }) 
        }).addTo(poiLayers['십이간지']);
        marker.bindTooltip(`<b>${z.name}</b>`);
    });
}

// 광산 데이터 배정
poiData.forEach(poi => {
    var key = (poi.type === '스폰') ? '스폰' : 
              (poi.type === '녹') ? '녹색광산' : 
              (poi.type === '청') ? '청색광산' : 
              (poi.type === '황') ? '황색광산' : 
              (poi.type === '적') ? '적색광산' : null;
    if(key) {
        var marker = L.marker(poi.coords, { icon: createHtmlIcon(poi.color) }).addTo(poiLayers[key]);
        if (poi.type !== '스폰') {
            marker.on('click', () => showMineInfo(poi));
            marker.bindTooltip(`${poi.name}번 광산`);
            if (poi.order !== undefined) {
                marker.on('mouseover', () => routeLinesByGroup[poi.type]?.forEach(l => l.setStyle({ opacity: 1 })));
                marker.on('mouseout', () => routeLinesByGroup[poi.type]?.forEach(l => l.setStyle({ opacity: 0 })));
            }
        }
    }
});

// 산/비석 및 동상
mountainData.forEach(m => {
    var pos = m.coords || mcToPx(m.x, m.z);
    var marker = L.marker(pos, { 
        icon: m.type === "statue" ? L.divIcon({ className: 'statue-icon', iconSize:[30,30] }) : createSteleIcon() 
    }).addTo(mountainLayers);
    
    marker.bindTooltip(`<b>${m.name}</b>`);
    if (m.type === "statue") {
        marker.bindPopup(`<div style="text-align:center;"><b>${m.name}</b><br><img src="${m.file}" style="width:150px;"></div>`);
    } else {
        marker.on('click', () => showHuntingInfo(m));
    }
});

// 약초 레이어 생성
herbData.forEach(herb => {
    if (!herbLayers[herb.name]) herbLayers[herb.name] = L.layerGroup();
    var imgOverlay = L.imageOverlay(herb.file, imageBounds, { opacity: 0.6, interactive: false });
    var dot = L.circleMarker(herb.coords, { radius: 3, color: "#000", weight: 1, fillColor: "#8e44ad", fillOpacity: 1 });
    herbLayers[herb.name].addLayer(imgOverlay).addLayer(dot);
});

/** 7. 메뉴 구성 (레이어 컨트롤용) **/
var menuOrder = {
    "📍 스폰": poiLayers['스폰'],
    "✨ 십이간지": poiLayers['십이간지'],
    "<div class='divider-line'></div>": L.layerGroup(),
    "👤 NPC": npcLayers,
    "📜 히든퀘스트": questLayers,
    "⛰️ 산(비석)": mountainLayers,
    "🔴 적환단": redHwanLayers,
    "🔍 탐색/상자": discoveryLayers,
    "<div class='divider-line'></div> ": L.layerGroup(),
    "<span class='mine-group-label'>💎 광산 구역</span>": L.layerGroup(),
    "<span style='color:#2ecc71'>녹색광산</span>": poiLayers['녹색광산'],
    "<span style='color:#3498db'>청색광산</span>": poiLayers['청색광산'],
    "<span style='color:#f1c40f'>황색광산</span>": poiLayers['황색광산'],
    "<span style='color:#e74c3c'>적색광산</span>": poiLayers['적색광산'],
    "<div class='divider-line'></div>  ": L.layerGroup(),
    "<span class='herb-group-label'>🌿 약초 서식지</span>": L.layerGroup()
};

// 약초 개별 레이어 추가
Object.keys(herbLayers).sort().forEach(name => {
    menuOrder[`<span class="herb-name-clickable">${name}</span>`] = herbLayers[name];
});

// 지도 클릭 시 정보창 닫기
map.on('click', () => {
    var panel = document.getElementById('hunting-info-panel');
    if(panel) panel.style.display = 'none';
});
