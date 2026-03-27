/** 1. 함수 정의 (사냥터 이동, 검색, 정보창 등) **/

// 사냥터 정보창 표시 함수
window.showHuntingInfo = function(info) {
    var panel = document.getElementById('hunting-info-panel');
    panel.innerHTML = `
        <h4 id="panel-name" style="margin: 0;"></h4>
        <div id="panel-lv"></div>
        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
    document.getElementById('panel-name').innerHTML = `
        <span style="font-size: 24px;"><b>${info.name}</b></span> 
        <span style="font-size: 16px; color: #666;">(${info.lv})</span>
    `;
    document.getElementById('panel-lv').innerHTML = `
        <div style="margin-top: 8px; font-size: 16px; color: #444;">${info.monsters}</div>
    `;
    panel.style.display = 'block';
};

// 사냥터 클릭 이동 로직
window.moveAndShowHunt = function(name) {
    var info = huntingInfo.find(h => h.name === name);
    if (!info) return;
    if (!map.hasLayer(huntingLayers[name])) {
        map.addLayer(huntingLayers[name]);
        updateLayerCheckbox(name, true);
    }
    map.setView(info.center, -1);
    setTimeout(() => showHuntingInfo(info), 100); 
};

// 사냥터 목록 생성
window.generateHuntingList = function() {
    const listElement = document.getElementById('hunting-list');
    huntingInfo.forEach(info => {
        const li = document.createElement('li');
        li.style.margin = "5px 0"; li.style.padding = "5px"; li.style.borderBottom = "1px solid #888";
        li.innerHTML = `<span class="hunt-name-clickable" style="font-size: 14px; display: block;" onclick="moveAndShowHunt('${info.name}')">${info.name} <small style="color:#666;">(${info.lv})</small></span>`;
        listElement.appendChild(li);
    });
};

// 레이어 체크박스 동기화
window.updateLayerCheckbox = function(name, isAdd) {
    document.querySelectorAll('.leaflet-control-layers-overlays label').forEach(label => {
        if (label.innerText.trim().includes(name)) {
            var cb = label.querySelector('input');
            if (cb) cb.checked = isAdd;
        }
    });
};

// 약초 전용 정보 표시 함수
window.moveAndShowHerb = function(name, mcX, mcZ, color) {
    if (!map.hasLayer(herbLayers[name])) { map.addLayer(herbLayers[name]); }
    var panel = document.getElementById('hunting-info-panel');
    panel.innerHTML = `<h4 id="panel-name" style="margin: 0;"></h4><div id="panel-lv"></div><div id="herb-detail-content"></div><button onclick="document.getElementById('hunting-info-panel').style.display='none'">닫기</button>`;
    
    var allLocations = herbData.filter(h => h.name === name);
    var coordsHtml = allLocations.map(h => `<div style="margin-bottom:5px;"><span style="background:#444; color:#fff; padding:2px 5px; border-radius:3px; font-size:11px; margin-right:5px;">좌표</span><b style="color:#e74c3c;">X: ${h.mcX} / Z: ${h.mcZ}</b></div>`).join('');
    var rareHerbs = ["월계엽", "철목영지", "금향과", "빙백설화"];
    var isRare = rareHerbs.includes(name);
    var titleExtraHtml = isRare ? ` <span style="color:#e74c3c; font-size:14px;">(희귀)</span>` : "";
    var descExtraHtml = isRare ? `<div style="font-size:9px; color:#555; margin-top:2px;">희귀 약초는 광범위하게 스폰됩니다.</div>` : `<div style="font-size:9px; color:#e74c3c; margin-top:2px; font-weight:bold;">위 좌표들은 명확하지 않을 수 있습니다.</div>`;

    panel.style.display = 'block';
    panel.innerHTML = `<div style="border-bottom:3px solid ${color}; padding-bottom:8px; margin-bottom:12px; position:relative;"><b style="font-size:18px; color:#3F3F3F; text-shadow:1px 1px 0px #fff;">${name}</b>${titleExtraHtml}${descExtraHtml}<span style="position:absolute; right:0; top:0; cursor:pointer; font-weight:bold; padding:5px;" onclick="document.getElementById('hunting-info-panel').style.display='none'">X</span></div><div style="font-size:14px; line-height:1.6; background:rgba(255,255,255,0.5); padding:10px; border:1px solid #888; max-height:150px; overflow-y:auto;">${coordsHtml}</div><button onclick="document.getElementById('hunting-info-panel').style.display='none'" style="margin-top:12px; width:100%; cursor:pointer; background:#C6C6C6; border:2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; font-weight:bold; padding:5px;">닫기</button>`;
};

// 모든 약초 레이어 초기화 함수
window.resetHerbLayers = function() {
    Object.keys(herbLayers).forEach(function(name) { if (map.hasLayer(herbLayers[name])) { map.removeLayer(herbLayers[name]); }});
    document.getElementById('hunting-info-panel').style.display = 'none';
};

// 검색 실행 함수
window.executeSearch = function() {
    var input = document.getElementById('search-input');
    var query = input.value.trim();
    if (!query) return;
    var found = false, target = null, targetMarker = null;

    huntingInfo.forEach(function(info) {
        if (info.name.includes(query)) {
            target = info.center; found = true;
            if (!map.hasLayer(huntingLayers[info.name])) { map.addLayer(huntingLayers[info.name]); updateLayerCheckbox(info.name, true); }
            setTimeout(() => showHuntingInfo(info), 100);
        }
    });

    if (!found) {
        var exactMatch = poiData.find(p => p.name === query);
        if (exactMatch) {
            target = exactMatch.coords; found = true;
            var key = (exactMatch.type === '스폰') ? '스폰' : (exactMatch.type === '녹') ? '녹색광산' : (exactMatch.type === '청') ? '청색광산' : (exactMatch.type === '황') ? '황색광산' : (exactMatch.type === '적') ? '적색광산' : null;
            if (key) {
                if (!map.hasLayer(poiLayers[key])) { map.addLayer(poiLayers[key]); updateLayerCheckbox(key, true); }
                poiLayers[key].eachLayer(function(l) { if (l instanceof L.Marker && l.getLatLng().equals(target)) targetMarker = l; });
            }
        }
    }

    if (!found) {
        herbData.forEach(function(herb) {
            if (!found && herb.name.includes(query)) {
                target = herb.coords; found = true;
                if (!map.hasLayer(herbLayers[herb.name])) { map.addLayer(herbLayers[herb.name]); updateLayerCheckbox(herb.name, true); }
                herbLayers[herb.name].eachLayer(function(l) { if (l instanceof L.Marker && l.getLatLng().equals(target)) targetMarker = l; });
            }
        });
    }

    if (found && target) { map.setView(target, -1); if (targetMarker) targetMarker.openPopup(); input.value = ""; } 
    else { alert("검색 결과가 없습니다."); }
};

window.resetHuntingLayers = function() {
    Object.keys(huntingLayers).forEach(name => {
        if (map.hasLayer(huntingLayers[name])) map.removeLayer(huntingLayers[name]);
        updateLayerCheckbox(name, false);
    });
};

window.toggleHuntingList = function() {
    var content = document.getElementById('hunting-content'), icon = document.getElementById('toggle-icon');
    if (content.style.display === "none") { content.style.display = "block"; icon.innerText = "▲"; } 
    else { content.style.display = "none"; icon.innerText = "▼"; }
};

/** 8. 광산 상세 정보창 표시 **/
window.showMineInfo = function(poi) {
    var panel = document.getElementById('hunting-info-panel');
    var detail = mineDetailInfo[poi.type];
    var common = mineDetailInfo["공통"];

    if (!detail) return;

    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="border-bottom:3px solid ${poi.color}; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:20px; color:#3F3F3F;">${detail.title} <span style="font-size:16px;">(${poi.name}번)</span></b>
            <div style="font-size:12px; color:#666; margin-top:2px;">좌표: X ${poi.mcX} / Z ${poi.mcZ}</div>
        </div>
        
        <div style="margin-bottom:15px;">
            <div style="color:#e74c3c; font-weight:bold; font-size:15px; margin-bottom:5px;">${detail.unique}</div>
            <div style="color:#8e44ad; font-size:12px; font-weight:normal;">${common}</div>
        </div>

        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="width:100%; cursor:pointer; background:#C6C6C6; border:2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; font-weight:bold; padding:8px;">
            닫기
        </button>
    `;
};
