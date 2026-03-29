/** 1. 설정 및 기본 변수 **/
var imgW = 7300, imgH = 6494;
var imageBounds = [[-imgH, 0], [0, imgW]];
// 여백을 적당히 0.3(30%) 정도로 다시 줄입니다.
var paddedBounds = L.latLngBounds(imageBounds).pad(0.3); 

var map = new L.Map('map', { 
    crs: L.CRS.Simple, 
    noWrap: true, 
    zoomSnap: 0.1, // 다시 0.1로 안정화
    maxBounds: paddedBounds,
    maxBoundsViscosity: 0.5
});

L.imageOverlay('map.jpg', imageBounds).addTo(map);

// [핵심 조치] 
// 1. 최소 줌 제한을 일단 넉넉히 -5 정도로만 풉니다.
map.setMinZoom(-5); 

// 2. 패딩을 150~200 정도로 주면 섬이 화면에 꽉 차지 않고 적당히 축소되어 보입니다.
// 섬이 여전히 너무 작다면 100으로 줄이고, 더 작게 보고 싶다면 300으로 늘리세요.
map.fitBounds(imageBounds, { padding: [150, 150] });

// 3. 현재의 예쁜 상태를 최소 줌으로 고정합니다.
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
var poiLayers = { '스폰': L.layerGroup(), '십이간지': L.layerGroup(), '녹색광산': L.layerGroup(), '청색광산': L.layerGroup(), '황색광산': L.layerGroup(), '적색광산': L.layerGroup() };
var herbLayers = {};
var huntingLayers = {};
var mountainLayers = L.layerGroup();
var discoveryLayers = L.layerGroup(); // 탐색 레이어 추가
var redHwanLayers = L.layerGroup();
var npcLayers = L.layerGroup();
var mysteryBoxLayers = L.layerGroup();

/** 광산 동선 생성 및 그룹 호버 이벤트 **/

var routeLinesByGroup = { "녹": [], "청": [], "황": [], "적": [] };

// [1] 각 그룹별로 루프를 돌며 선을 생성합니다.
Object.keys(routeLinesByGroup).forEach(groupTag => {
    // 해당 그룹(색상)의 데이터만 추출해서 order 순으로 정렬
    const groupMines = poiData
        .filter(p => p.type === groupTag && p.order !== undefined)
        .sort((a, b) => a.order - b.order);

    // 해당 그룹 내에서 선 긋기
    groupMines.forEach((mine, index) => {
        if (index === groupMines.length - 1) return;
        var nextMine = groupMines[index + 1];

        // 점선 여부 판단 (LineType 또는 lineType 모두 체크)
        var typeValue = nextMine.lineType || nextMine.LineType || "";
        var isDotted = typeValue.toString().toLowerCase().trim() === "dotted";
        var dashValue = isDotted ? "15, 15" : null;

        var line = L.polyline([mine.coords, nextMine.coords], {
            color: '#ff4757',  // 모든 동선 기본색 (빨강)
            weight: 4, 
            opacity: 0, 
            dashArray: dashValue, 
            lineJoin: 'round',
            interactive: false 
        }).addTo(map);

        routeLinesByGroup[groupTag].push(line);
    });
});

// [2] 그룹 호버 이벤트 함수
function addGroupRouteHover(marker, groupType) {
    marker.on('mouseover', function () {
        if (routeLinesByGroup[groupType]) {
            routeLinesByGroup[groupType].forEach(line => {
                var currentDash = line.options.dashArray;
                line.setStyle({ opacity: 1,
                              dashArray: currentDash});
            });
        }
    });

    marker.on('mouseout', function () {
        if (routeLinesByGroup[groupType]) {
            routeLinesByGroup[groupType].forEach(line => {
                line.setStyle({ opacity: 0 }); 
            });
        }
    });
}

/** 5. 산(비석) & 동상 레이어 생성 로직 **/
mountainData.forEach(m => {
    // [핵심 수정] 데이터에 직접 입력한 coords가 있으면 그걸 쓰고, 없으면 mcToPx로 계산합니다.
    var finalPos = m.coords ? m.coords : mcToPx(m.x, m.z);

    if (m.type === "statue") {
        // --- 동상일 경우 ---
        var marker = L.marker(finalPos, { 
            icon: L.divIcon({ className: 'statue-icon', iconSize: [30, 30], iconAnchor: [15, 30] }) 
        }).addTo(mountainLayers);

        // [복구] 원래 있던 이미지 팝업 코드를 그대로 유지합니다!
        marker.bindPopup(`
            <div style="text-align:center;">
                <b style="font-size:14px;">${m.name}</b><br>
                <img src="${m.file}" style="width:150px; height:auto; border:2px solid #000; margin-top:5px;"><br>
                <span style="font-size:11px; color:#666;">[${m.x}, ${m.z}]</span>
            </div>
        `);

        // [추가] 마우스 올렸을 때(툴팁) 이름과 좌표가 함께 나오도록 설정
        marker.bindTooltip(`
            <div style="text-align:center;">
                <b style="font-size:14px; color:#2c3e50;">${m.name}</b><br>
                <span style="font-size:12px; color:#666;">[ ${m.x}, ${m.z} ]</span>
            </div>
        `, { direction: 'top', offset: [0, -10] });

    } else {
        // --- 일반 비석일 경우 ---
        var marker = L.marker(finalPos, { icon: createSteleIcon() }).addTo(mountainLayers);

        // [추가] 마우스 올렸을 때(툴팁) 이름과 좌표가 함께 나오도록 설정
        marker.bindTooltip(`
            <div style="text-align:center;">
                <b style="font-size:14px; color:#2c3e50;">${m.name}</b><br>
                <span style="font-size:12px; color:#666;">[ ${m.x}, ${m.z} ]</span>
            </div>
        `, { 
            direction: 'top', 
            offset: [0, -10],
            className: 'custom-tooltip' 
        });

        // 클릭 시 ui-control.js의 정보창 호출 (좌표 복사 기능 포함)
        marker.on('click', function() {
            showHuntingInfo(m); 
        });
    }
});

// 광산 및 스폰
poiData.forEach(poi => {
    var key = (poi.type === '스폰') ? '스폰' : (poi.type === '녹') ? '녹색광산' : (poi.type === '청') ? '청색광산' : (poi.type === '황') ? '황색광산' : (poi.type === '적') ? '적색광산' : null;
    
    if(key) {
        var marker = L.marker(poi.coords, {icon: createHtmlIcon(poi.color)}).addTo(poiLayers[key]);
      if (poi.order !== undefined) {
            addGroupRouteHover(marker, poi.type); 
        }
        if (poi.type === '스폰') {
            marker.bindPopup(`<b>스폰 지점</b><br>[ ${poi.mcX}, ${poi.mcZ} ]`);
        } else {
            // 광산 클릭 시 상세 정보창 함수 호출 (원래 상태)
            marker.on('click', function() {
                showMineInfo(poi);
            });
            // 마우스 올렸을 때 번호만 살짝 보이게 툴팁 추가
            marker.bindTooltip(`${poi.name}번 광산`, { direction: 'top', offset: [0, -10] });
        }
    }
});

// 약초
herbData.forEach(herb => {
    var hCol = herbColors[herb.name] || '#8e44ad';
    var imgOverlay = L.imageOverlay(herb.file, imageBounds, { opacity: 0.6, interactive: false });
    var dotMarker = L.circleMarker(herb.coords, { radius: 3, color: "#000", weight: 1, fillColor: hCol, fillOpacity: 1 });
    dotMarker.bindPopup(`<b style="color:${hCol}; font-size:14px;">${herb.name}</b><br><span style="color:#555; font-size:12px;">[ ${herb.mcX}, ${herb.mcZ} ]</span>`);
    if (!herbLayers[herb.name]) herbLayers[herb.name] = L.layerGroup();
    herbLayers[herb.name].addLayer(imgOverlay).addLayer(dotMarker);
});

// 십이간지 (map-logic.js 내부)
zodiacData.forEach(z => {
    var marker = L.marker(mcToPx(z.x, z.z), { 
        icon: L.divIcon({ 
            className: 'zodiac-icon', 
            html: `<div style="width:60px; height:60px;"></div>`, 
            iconSize: [60, 60], 
            iconAnchor: [30, 30] 
        }) 
    }).addTo(poiLayers['십이간지']);

    // [추가] 툴팁은 그대로 두고, 클릭했을 때 정보창 띄우기
    marker.on('click', function() {
        showZodiacInfo(z); 
    });

    marker.bindTooltip(`<b style="font-size:22px; color:#e67e22;">${z.name}</b><br>MC: ${z.x}, ${z.z}`, { 
        direction: 'top', 
        className: 'custom-tooltip', 
        opacity: 0.95 
    });
});

// 사냥터
huntingInfo.forEach(info => {
    var imgOverlay = L.imageOverlay(info.file, imageBounds, { opacity: 0.6, interactive: false });
    var clickMarker = L.circleMarker(info.center, { radius: 35, color: '#e74c3c', weight: 1, fillOpacity: 0.1 });
    imgOverlay.on('add', function() { showHuntingInfo(info); });
    clickMarker.on('click', function() { showHuntingInfo(info); });
    imgOverlay.on('remove', function() { document.getElementById('hunting-info-panel').style.display = 'none'; });
    huntingLayers[info.name] = L.layerGroup([imgOverlay, clickMarker]);
});

// 탐색 (항아리)
discoveryData.forEach(d => {
    // mcToPx 함수를 사용하여 좌표 변환 (y값은 높이값이므로 x, z만 사용)
    var marker = L.marker(mcToPx(d.x, d.z), {
        icon: L.divIcon({
            className: 'discovery-icon',
            html: `<div style="font-size:25px; text-align:center; filter: drop-shadow(0px 0px 2px white);">⚱️</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(discoveryLayers);

    // 마우스 올렸을 때 툴팁 (아이템 이름)
    marker.bindTooltip(`<b>${d.item}</b> (${d.name})`, { direction: 'top', offset: [0, -10] });

    // 클릭 시 ui-control.js의 정보창 호출
    marker.on('click', function() {
        showDiscoveryInfo(d);
    });
});

// 의문의 상자
mysteryBoxData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), {
        icon: L.icon({
            iconUrl: 'box.png', // 요청하신 파일명
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(mysteryBoxLayers);

    marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top', offset: [0, -10] });
    
    // 클릭 시 상세 정보(좌표 등)를 띄우고 싶다면 아래 함수 연결
    marker.on('click', function() {
        showDiscoveryInfo(d); // 항아리와 동일한 정보창 형식을 사용하거나 새로 만드셔도 됩니다.
    });
});

// 적환단 마커 생성
redHwanData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), {
        icon: L.icon({
            iconUrl: 'red.png', // 적환단 기본 마커 이미지
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(redHwanLayers);

    marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top', offset: [0, -10] });
    marker.on('click', () => showRedHwanInfo(d));
});

// NPC 마커 생성 (discoveryData 로직 아래에 추가)
npcData.forEach(d => {
    var marker = L.marker(mcToPx(d.x, d.z), {
        icon: L.icon({
            iconUrl: d.file, 
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        })
    }).addTo(npcLayers);

    marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top', offset: [0, -10] });
    marker.on('click', () => showNPCInfo(d));
});

/** 11. 히든퀘스트 동선 설정 (보라색 + 호버 효과) **/
var questLayers = L.layerGroup(); 

var questPathData = [
    npcData.find(n => n.name.includes("상단주")),
    npcData.find(n => n.name.includes("부숴진마차")),
    npcData.find(n => n.name.includes("자운스님"))
].filter(p => p !== undefined);

if (questPathData.length >= 2) {
    var questLatLngs = questPathData.map(p => mcToPx(p.x, p.z));

    // [중요] 처음에는 투명도(opacity)를 0으로 설정합니다.
    var questLine = L.polyline(questLatLngs, {
        color: '#6c5ce7',      // 보라색
        weight: 4,
        opacity: 0,            // 마우스 올리기 전엔 안 보임
        dashArray: '10, 10',   
        lineJoin: 'round',
        interactive: false     // 선 자체는 클릭 안 되게 (마커 방해 금지)
    }).addTo(questLayers);

    // NPC 마커들에 호버 이벤트 연결 함수
    function addQuestRouteHover(marker) {
        marker.on('mouseover', function () {
            questLine.setStyle({ opacity: 1 }); // 마우스 올리면 선 등장
        });
        marker.on('mouseout', function () {
            questLine.setStyle({ opacity: 0 }); // 마우스 치우면 선 사라짐
        });
    }

    // 상단주, 마차, 자운스님 마커를 찾아서 호버 이벤트 등록
    // 이 작업은 npcData.forEach 루프 안에서 처리하거나, 아래처럼 수동으로 연결합니다.
}

/** 5. 메뉴 UI 구성 **/
var menuOrder = {
    "스폰": poiLayers['스폰'], "십이간지": poiLayers['십이간지'],
    "<span class='divider-line'></span>": L.layerGroup(),
    "👤 NPC": npcLayers,
    "⛰️ 산(비석)": mountainLayers,
    "🔴 적환단": redHwanLayers,
    "🔍 탐색": discoveryLayers,
    "📦 의문의상자" : mysteryBoxLayers,
    "<span class='divider-line'></span> ": L.layerGroup(),
    "<span class='mine-group-label'>💎 광산 구역</span>": L.layerGroup(),
    "<span style='color: #2ecc71;'>녹색광산</span>": poiLayers['녹색광산'],
    "<span style='color: #3498db;'>청색광산</span>": poiLayers['청색광산'],
    "<span style='color: #f1c40f;'>황색광산</span>": poiLayers['황색광산'],
    "<span style='color: #e74c3c;'>적색광산</span>": poiLayers['적색광산'],
    "<span class='divider-line'></span>  ": L.layerGroup(),
    "<span class='herb-group-label' style='display:flex; justify-content:space-between; align-items:center; width:140px;'>🌿 약초 서식지 <button onclick='resetHerbLayers()' style='cursor:pointer; font-size:10px; padding:1px 4px;'>초기화</button></span>": L.layerGroup()
};

// 지도의 빈 곳을 클릭하면 모든 정보창 닫기
map.on('click', function() {
    var panel = document.getElementById('hunting-info-panel');
    if (panel) {
        panel.style.display = 'none';
    }
});

// 약초 목록 추가
Object.keys(herbLayers).sort().forEach(name => {
    var herb = herbData.find(h => h.name === name);
    var isRare = ["월계엽", "철목영지", "금향과", "빙백설화", "홍련초"].includes(name);
    var rareHtml = isRare ? ` <span style="color:#e74c3c; font-size:10px;">(희귀)</span>` : "";
    var htmlLabel = `<span class="herb-name-clickable" onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ}, '${herbColors[name]}')">${name}${rareHtml}</span>`;
    menuOrder[htmlLabel] = herbLayers[name];
});


