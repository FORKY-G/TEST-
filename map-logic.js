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

/** 4. 레이어 초기화 로직 (마커 생성 등) **/

/** 7. 광산 동선 생성 및 그룹 호버 이벤트 **/

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
        // 동상일 경우 아이콘과 클릭 팝업 설정
        L.marker(finalPos, {  // finalPos를 사용하여 좌표 결정
            icon: L.divIcon({ className: 'statue-icon', iconSize: [30, 30], iconAnchor: [15, 30] }) 
        }).addTo(mountainLayers)
        .bindPopup(`
            <div style="text-align:center;">
                <b style="font-size:14px;">${m.name}</b><br>
                <img src="${m.file}" style="width:150px; height:auto; border:2px solid #000; margin-top:5px;"><br>
                <span style="font-size:11px; color:#666;">[${m.x}, ${m.z}]</span>
            </div>
        `);
    } else {
        // 일반 비석일 경우 기존 로직 유지
        L.marker(finalPos, { icon: createSteleIcon() }).addTo(mountainLayers) // finalPos 사용
         .bindTooltip(`<b>${m.name}</b>`, { direction: 'top', className: 'custom-tooltip' });
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
            // [기능 유지] 광산 클릭 시 상세 정보창 출력
            marker.on('click', function() {
                var panel = document.getElementById('mine-info-panel');
                if (!panel) return;

                // data.js에 추가한 상세 정보를 가져옵니다.
                const detail = mineDetailInfo[poi.type] || { title: poi.type, unique: "-", route: "-", desc: "" };
                const common = mineDetailInfo["공통"] || "";

                // 기존 정보창 디자인에 동선/사냥터만 추가 (네 사이트 스타일에 맞춤)
                panel.innerHTML = `
                    <div class="mine-info-content" style="position:relative; padding:15px;">
                        <button class="close-btn" onclick="document.getElementById('mine-info-panel').style.display='none'" 
                                style="position:absolute; right:15px; top:10px; background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">×</button>
                        
                        <h3 style="color: ${poi.color}; margin:0 0 12px 0; font-size:18px;">${poi.name}번 광산 (${detail.title})</h3>
                        <p style="margin:5px 0;"><b>좌표:</b> [ ${poi.mcX}, ${poi.mcZ} ]</p>
                        <p style="margin:5px 0;"><b>고유 광물:</b> ${detail.unique}</p>
                        <p style="margin:5px 0;"><b>공통 광물:</b> ${common}</p>
                        
                        <hr style="border:0; border-top:1px solid #444; margin:15px 0;">

                        <div style="font-size: 15px; font-weight: bold; color: #eee; word-break: break-all; line-height: 1.4; margin-bottom: 8px;">
                            ${detail.route}
                        </div>
                        
                        <div style="font-size: 12px; color: #aaa; line-height: 1.5;">
                            ${detail.desc}
                        </div>
                    </div>
                `;
                panel.style.display = 'block';
            });

            // [기능 유지] 마우스 올렸을 때 번호만 살짝 보이게 툴팁 추가
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

// 십이간지
zodiacData.forEach(z => {
    L.marker(mcToPx(z.x, z.z), { icon: L.divIcon({ className: 'zodiac-icon', html: `<div style="width:60px; height:60px;"></div>`, iconSize: [60, 60], iconAnchor: [30, 30] }) }).addTo(poiLayers['십이간지'])
     .bindTooltip(`<b style="font-size:22px; color:#e67e22;">${z.name}</b><br>MC: ${z.x}, ${z.z}`, { direction: 'top', className: 'custom-tooltip', opacity: 0.95 });
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

/** 5. 메뉴 UI 구성 **/
var menuOrder = {
    "스폰": poiLayers['스폰'], "십이간지": poiLayers['십이간지'],
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

// 약초 목록 추가
Object.keys(herbLayers).sort().forEach(name => {
    var herb = herbData.find(h => h.name === name);
    var isRare = ["월계엽", "철목영지", "금향과", "빙백설화", "홍련초"].includes(name);
    var rareHtml = isRare ? ` <span style="color:#e74c3c; font-size:10px;">(희귀)</span>` : "";
    var htmlLabel = `<span class="herb-name-clickable" onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ}, '${herbColors[name]}')">${name}${rareHtml}</span>`;
    menuOrder[htmlLabel] = herbLayers[name];
});
