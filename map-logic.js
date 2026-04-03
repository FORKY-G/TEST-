/** 1. 설정 **/

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



/** 2. 아이콘 생성 **/

function createHtmlIcon(color) {

    return L.divIcon({ className: 'mine-clickable-area', html: `<div class="mine-dot" style="background:${color};"></div>`, iconSize: [30, 30], iconAnchor: [15, 15] });

}

function createSteleIcon() {

    return L.divIcon({ className: 'stele-icon-container', html: `<div class="stele-body"></div>`, iconSize: [24, 34], iconAnchor: [12, 34] });

}



/** 3. 레이어 그룹  **/

var poiLayers = { '스폰': L.layerGroup(), '십이간지': L.layerGroup(), '녹색광산': L.layerGroup(), '청색광산': L.layerGroup(), '황색광산': L.layerGroup(), '적색광산': L.layerGroup() };

var herbLayers = {};

var huntingLayers = {};

var mountainLayers = L.layerGroup();

var discoveryLayers = L.layerGroup();

var redHwanLayers = L.layerGroup();

var npcLayers = L.layerGroup();

var mysteryBoxLayers = L.layerGroup();

var haemusaBookLayers = L.layerGroup();

var questLayers = L.layerGroup().addTo(map);



/** 4. 광산 동선 **/

var routeLinesByGroup = { "녹": [], "청": [], "황": [], "적": [] };



if (typeof poiData !== 'undefined') {

    Object.keys(routeLinesByGroup).forEach(groupTag => {

        const groupMines = poiData.filter(p => p.type === groupTag && p.order !== undefined).sort((a, b) => a.order - b.order);

        groupMines.forEach((mine, index) => {

            if (index === groupMines.length - 1) return;

            var nextMine = groupMines[index + 1];

            var isDotted = (nextMine.lineType || "").toString().toLowerCase().trim() === "dotted";

            var line = L.polyline([mine.coords, nextMine.coords], { color: '#ff4757', weight: 4, opacity: 0, dashArray: isDotted ? "15, 15" : null, interactive: false }).addTo(map);

            routeLinesByGroup[groupTag].push(line);

        });

    });

}



function addGroupRouteHover(marker, groupType) {

    marker.on('mouseover', () => routeLinesByGroup[groupType]?.forEach(l => l.setStyle({ opacity: 1 })));

    marker.on('mouseout', () => routeLinesByGroup[groupType]?.forEach(l => l.setStyle({ opacity: 0 })));

}



/** 5. 십이간지 및 히든 퀘스트 동선 **/



// [A] 십이간지 동선

if (typeof zodiacData !== 'undefined') {

    var zodiacOrderNames = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

    var zodiacPathPoints = zodiacOrderNames.map(name => {

        var found = zodiacData.find(z => z.name.includes(name));

        return found ? mcToPx(found.x, found.z) : null;

    }).filter(p => p !== null);



    if (zodiacPathPoints.length >= 2) {

        window.zodiacLine = L.polyline(zodiacPathPoints, { color: '#f1c40f', weight: 6, opacity: 0, dashArray: '10, 10', interactive: false }).addTo(poiLayers['십이간지']);

    }

}



// [B] 히든 퀘스트 동선 (상단주, 뱀, 해적선)

var questLines = {

    standard: null,

    snake: null,

    pirate: null,

    haemusa: null

};



if (typeof npcData !== 'undefined') {

    // 1. 상단주 동선

    var qPath = [npcData.find(n => n.name.includes("상단주")), npcData.find(n => n.name.includes("부숴진마차")), npcData.find(n => n.name.includes("자운스님"))].filter(p => p);

    if (qPath.length >= 2) questLines.standard = L.polyline(qPath.map(p => mcToPx(p.x, p.z)), { color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false }).addTo(questLayers);



    // 2. 뱀/호리병 동선

    var myeonMun = (typeof huntingInfo !== 'undefined') ? huntingInfo.find(h => h.name === "멸문") : null;

    var sPath = [npcData.find(n => n.name.includes("도사")), npcData.find(n => n.name.includes("도공")), myeonMun, npcData.find(n => n.name.includes("도사"))].filter(p => p);

    if (sPath.length >= 2) questLines.snake = L.polyline(sPath.map(p => p.center || mcToPx(p.x, p.z)), { color: '#6c5ce7', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false }).addTo(questLayers);



    // 3. 해적선 동선 

    var pPath = [npcData.find(n => n.name.includes("해진")), npcData.find(n => n.name.includes("해적선")), npcData.find(n => n.name.includes("백향초재배지"))].filter(p => p);

    if (pPath.length >= 2) questLines.pirate = L.polyline(pPath.map(p => mcToPx(p.x, p.z)), { color: '#a29bfe', weight: 6, opacity: 0, dashArray: '12, 12', interactive: false }).addTo(questLayers);



    // 4. 해무사 퀘스트 동선 (해무사승려 -> 연운객 -> 시녀)

    var hPath = [

        npcData.find(n => n.name.includes("해무사승려")),

        npcData.find(n => n.name.includes("연운객")),

        npcData.find(n => n.name.includes("시녀"))

    ].filter(p => p);



    if (hPath.length >= 2) {

        questLines.haemusa = L.polyline(hPath.map(p => mcToPx(p.x, p.z)), { 

            color: '#a29bfe', // 연보라색 (해적선 퀘스트와 통일하거나 취향껏 변경 가능)

            weight: 6, 

            opacity: 0, 

            dashArray: '12, 12', 

            interactive: false 

        }).addTo(questLayers);

    }

}



/** 6. 마커 생성 및 이벤트 연결 **/



// NPC 마커

if (typeof npcData !== 'undefined') {

    npcData.forEach(d => {

        var marker = L.marker(mcToPx(d.x, d.z), { icon: L.icon({ iconUrl: d.file, iconSize: [32, 32], iconAnchor: [16, 16] }) }).addTo(npcLayers);

        marker.bindTooltip(`<b>${d.name}</b>`, { direction: 'top' });

        marker.on('click', () => showNPCInfo(d));



        // 호버 이벤트 (동선 보이기)

        marker.on('mouseover', () => {

            if (d.name.includes("상단주") || d.name.includes("부숴진마차") || d.name.includes("자운스님")) questLines.standard?.setStyle({ opacity: 0.9 });

            if (d.name.includes("도사") || d.name.includes("도공")) questLines.snake?.setStyle({ opacity: 0.9 });

            if (d.name.includes("해진") || d.name.includes("해적선") || d.name.includes("백향초재배지")) questLines.pirate?.setStyle({ opacity: 0.9 });

            if (d.name.includes("해무사승려") || d.name.includes("연운객") || d.name.includes("시녀")) {

                questLines.haemusa?.setStyle({ opacity: 0.9 });

            }

        });

            

        marker.on('mouseout', () => { 

            questLines.standard?.setStyle({ opacity: 0 }); 

            questLines.snake?.setStyle({ opacity: 0 }); 

            questLines.pirate?.setStyle({ opacity: 0 }); 

            questLines.haemusa?.setStyle({ opacity: 0 });

        });

    });

}

// 사냥터 (혈교도만 아이콘으로 표시, 나머지는 배경 유지)
if (typeof huntingInfo !== 'undefined') {
    huntingInfo.forEach(info => {
        var layers = [];

        // 1. [혈교도 전용] 이름이 "혈교도"인 경우만 아이콘 마커 생성
        if (info.name === "혈교도" && info.file) { 
            var huntingIcon = L.icon({
                iconUrl: info.file,
                iconSize: [45, 45],   // 혈교도 아이콘 크기
                iconAnchor: [22, 22]
            });
            var iconMarker = L.marker(info.center, { icon: huntingIcon, interactive: false });
            layers.push(iconMarker);
        } 
        // 2. [그 외 모든 사냥터] 화검문 포함, 나머지는 전부 지도 전체 배경으로 씌움
        else if (info.file) {
            var imgOverlay = L.imageOverlay(info.file, imageBounds, { opacity: 0.6, interactive: false });
            layers.push(imgOverlay);
        }

        // 3. [공통] 클릭 영역 (CircleMarker) - 정보창 띄우기용
        var clickMarker = L.circleMarker(info.center, { 
            radius: 35, 
            color: 'transparent', 
            fillOpacity: 0, 
            interactive: true 
        });
        
        clickMarker.on('click', (e) => { 
            L.DomEvent.stopPropagation(e); 
            showHuntingInfo(info); 
        });
        
        // 4. [기존] 멸문 효과 유지
        if (info.name === "멸문") {
            clickMarker.addTo(map);
            clickMarker.on('mouseover', () => questLines.snake?.setStyle({ opacity: 0.9 }));
            clickMarker.on('mouseout', () => questLines.snake?.setStyle({ opacity: 0 }));
        }

        layers.push(clickMarker);
        huntingLayers[info.name] = L.layerGroup(layers);
    });
}



// 십이간지 마커

zodiacData.forEach(z => {

    var marker = L.marker(mcToPx(z.x, z.z), { icon: L.divIcon({ className: 'zodiac-icon', html: `<div style="width:60px; height:60px;"></div>`, iconSize: [60, 60], iconAnchor: [30, 30] }) }).addTo(poiLayers['십이간지']);

    marker.on('click', () => showZodiacInfo(z));

    marker.bindTooltip(`<b>${z.name}</b>`, { direction: 'top' });

    marker.on('mouseover', () => window.zodiacLine?.setStyle({ opacity: 0.9 }));

    marker.on('mouseout', () => window.zodiacLine?.setStyle({ opacity: 0 }));

});



// 광산, 산, 탐색, 상자, 약초

poiData.forEach(poi => {

    var key = (poi.type === '스폰') ? '스폰' : (poi.type === '녹') ? '녹색광산' : (poi.type === '청') ? '청색광산' : (poi.type === '황') ? '황색광산' : (poi.type === '적') ? '적색광산' : null;

    if(key) {

        var marker = L.marker(poi.coords, {icon: createHtmlIcon(poi.color)}).addTo(poiLayers[key]);

        if (poi.order !== undefined) addGroupRouteHover(marker, poi.type);

        if (poi.type === '스폰') marker.bindPopup(`<b>스폰 지점</b><br>[ ${poi.mcX}, ${poi.mcZ} ]`);

        else { marker.on('click', () => showMineInfo(poi)); marker.bindTooltip(`${poi.name}번 광산`); }

    }

});



if (typeof redHwanData !== 'undefined') {

    redHwanData.forEach(d => {

        // red.png 아이콘을 사용하여 마커 생성

        var marker = L.marker(mcToPx(d.x, d.z), { 

            icon: L.icon({ 

                iconUrl: 'red.png', 

                iconSize: [30, 30], 

                iconAnchor: [15, 15] 

            }) 

        }).addTo(redHwanLayers);



        // 클릭 시 정보창 표시 (적환단 전용 함수 호출)

        marker.on('click', () => {

            if (typeof showRedHwanInfo === 'function') {

                showRedHwanInfo(d);

            }

        });

        

        // 툴팁 추가 (선택 사항)

        marker.bindTooltip(`<b>적환단</b>`, { direction: 'top', offset: [0, -10] });

    });

}

var haemusaBooks = [

    { name: "기록서1", x: -5640, y: 177, z: 3340, desc: "해무사 기록서 #1", tool: "길을 찾으시오." },

    { name: "기록서2", x: -5625, y: 149, z: 3432, desc: "해무사 기록서 #2", tool: "그대만의 길을." },

    { name: "기록서3", x: -5555, y: 90, z: 3405, desc: "해무사 기록서 #3", tool: "길이 없음에도 길이 있고," },

    { name: "기록서4", x: -5770, y: 140, z: 3332, desc: "해무사 기록서 #4", tool: "길이 있는 곳에도 길이 없음이라." },

    { name: "기록서5", x: -5749, y: 124, z: 3215, desc: "해무사 기록서 #5", tool: "길 끝에 길이 있으며," },

    { name: "기록서6", x: -5578, y: 174, z: 3275, desc: "해무사 기록서 #6", tool: "그 끝에 도달하는 자만이 운명을 쥐어진 자" }

];



haemusaBooks.forEach((book, index) => {

    var bookIcon = L.divIcon({

        className: 'book-icon',

        html: `<div style="background: #f1c40f; color: #2c3e50; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #2c3e50; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center;">${index + 1}</div>`,

        iconSize: [20, 20],

        iconAnchor: [10, 10]

    });



    var marker = L.marker(mcToPx(book.x, book.z), { icon: bookIcon }).addTo(haemusaBookLayers);

    marker.bindTooltip(`<b>${book.name}</b>`, { direction: 'top' });

    

    marker.on('click', () => {

        if (typeof showDiscoveryInfo === 'function') {

            // 클릭할 때 y좌표와 tool 정보도 함께 넘겨줍니다.

            showDiscoveryInfo({ 

                name: book.name, 

                item: book.desc, 

                x: book.x, 

                y: book.y, 

                z: book.z, 

                tool: book.tool 

            });

        }

    });

});

haemusaBookLayers.addTo(map);







mountainData.forEach(m => {

    var finalPos = m.coords ? m.coords : mcToPx(m.x, m.z);

    var marker = L.marker(finalPos, { icon: m.type === "statue" ? L.divIcon({ className: 'statue-icon', iconSize:[30,30], iconAnchor:[15,30] }) : createSteleIcon() }).addTo(mountainLayers);

    if (m.type === "statue") marker.bindPopup(`<div style="text-align:center;"><b>${m.name}</b><br><img src="${m.file}" style="width:150px;"><br><span>[${m.x}, ${m.z}]</span></div>`);

    else marker.on('click', () => showHuntingInfo(m));

    marker.bindTooltip(`<b>${m.name}</b>`);

});



discoveryData.forEach(d => {

    var marker = L.marker(mcToPx(d.x, d.z), { icon: L.divIcon({ className: 'discovery-icon', html: `⚱️`, iconSize: [50, 50], iconAnchor: [25, 25] }) }).addTo(discoveryLayers);

    marker.bindTooltip(`<b>${d.item}</b> (${d.name})`);

    marker.on('click', () => showDiscoveryInfo(d));

});



if (typeof mysteryBoxData !== 'undefined') {

    mysteryBoxData.forEach(d => {

        var marker = L.marker(mcToPx(d.x, d.z), { icon: L.icon({ iconUrl: 'box.png', iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(mysteryBoxLayers);

        marker.on('click', () => showDiscoveryInfo(d));

    });

}



herbData.forEach(herb => {

    var hCol = herbColors[herb.name] || '#8e44ad';

    var imgOverlay = L.imageOverlay(herb.file, imageBounds, { opacity: 0.6, interactive: false });

    var dotMarker = L.circleMarker(herb.coords, { radius: 3, color: "#000", weight: 1, fillColor: hCol, fillOpacity: 1 });

    if (!herbLayers[herb.name]) herbLayers[herb.name] = L.layerGroup();

    herbLayers[herb.name].addLayer(imgOverlay).addLayer(dotMarker);

});



/** 메뉴 UI 구성 **/



var menuOrder = {



    "스폰": poiLayers['스폰'], 



    "십이간지": poiLayers['십이간지'],



    "<span class='divider-line'></span>": L.layerGroup(),



    "👤 NPC": npcLayers,



    "📜 히든퀘스트": questLayers, 



    "<span class='divider-line'></span> ": L.layerGroup(),



    "⛰️ 산(비석)": mountainLayers,



    "🔴 적환단": redHwanLayers,



    "🔍 탐색": discoveryLayers,



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



Object.keys(herbLayers).sort().forEach(name => {



    var herb = herbData.find(h => h.name === name);



    if (herb) {



        var isRare = ["월계엽", "철목영지", "금향과", "빙백설화", "홍련초"].includes(name);



        var rareHtml = isRare ? ` <span style="color:#e74c3c; font-size:10px;">(희귀)</span>` : "";



        var htmlLabel = `<span class="herb-name-clickable" onclick="moveAndShowHerb('${name}', ${herb.mcX}, ${herb.mcZ}, '${herbColors[name]}')">${name}${rareHtml}</span>`;



        menuOrder[htmlLabel] = herbLayers[name];



    }



});



map.on('click', () => { if(document.getElementById('hunting-info-panel')) document.getElementById('hunting-info-panel').style.display = 'none'; });
