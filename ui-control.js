/** 1. 사냥터 목록 생성 및 UI 제어 **/

// 사냥터 목록을 HTML에 출력하는 함수 (에러 해결 핵심)
window.generateHuntingList = function() {
    const listElement = document.getElementById('hunting-list');
    if (!listElement || typeof huntingInfo === 'undefined') return;
    
    listElement.innerHTML = ""; // 초기화
    huntingInfo.forEach(info => {
        const li = document.createElement('li');
        li.style.margin = "5px 0"; 
        li.style.padding = "5px"; 
        li.style.borderBottom = "1px solid #888";
        li.innerHTML = `<span class="hunt-name-clickable" style="font-size: 14px; display: block; color: #333; cursor: pointer;" onclick="moveAndShowHunt('${info.name}')">${info.name} <small style="color:#666;">(${info.lv || '?'})</small></span>`;
        listElement.appendChild(li);
    });
};

// 사냥터 클릭 시 이동 및 정보창 표시
window.moveAndShowHunt = function(name) {
    var info = huntingInfo.find(h => h.name === name);
    if (!info) return;

    // 레이어가 꺼져있으면 켜기
    if (typeof huntingLayers !== 'undefined' && huntingLayers[name]) {
        if (!map.hasLayer(huntingLayers[name])) {
            map.addLayer(huntingLayers[name]);
            updateLayerCheckbox(name, true);
        }
    }
    
    var pos = info.center || mcToPx(info.x, info.z);
    if (pos && !isNaN(pos[0])) {
        map.setView(pos, 1); 
        showHuntingInfo(info);
    }
};

// 사냥터 목록 열기/닫기 토글
window.toggleHuntingList = function() {
    var content = document.getElementById('hunting-content');
    var icon = document.getElementById('toggle-icon');
    if (content.style.display === "none") {
        content.style.display = "block";
        icon.innerText = "▲";
    } else {
        content.style.display = "none";
        icon.innerText = "▼";
    }
};

// 모든 사냥터 레이어 끄기
window.resetHuntingLayers = function() {
    if (typeof huntingLayers === 'undefined') return;
    Object.keys(huntingLayers).forEach(name => {
        if (map.hasLayer(huntingLayers[name])) map.removeLayer(huntingLayers[name]);
        updateLayerCheckbox(name, false);
    });
};

// 레이어 체크박스 상태 동기화
window.updateLayerCheckbox = function(name, isAdd) {
    document.querySelectorAll('.leaflet-control-layers-overlays label').forEach(label => {
        if (label.innerText.trim().includes(name)) {
            var cb = label.querySelector('input');
            if (cb) cb.checked = isAdd;
        }
    });
};

/** 2. 정보창 표시 공통 함수 (사냥터, 산, 비석) **/
window.showHuntingInfo = function(info) {
    var panel = document.getElementById('hunting-info-panel');
    if (!panel) return;

    var displayX = info.x !== undefined ? info.x : (info.mcX !== undefined ? info.mcX : "확인불가");
    var displayY = info.y !== undefined ? info.y : "80"; 
    var displayZ = info.z !== undefined ? info.z : (info.mcZ !== undefined ? info.mcZ : "확인불가");
    
    var coordsHtml = `
        <div onclick="copyToClipboard('${displayX}, ${displayY}, ${displayZ}')" 
             title="클릭하여 좌표 복사"
             style="font-size:13px; color:#333; cursor:pointer; border:1px solid #999; padding:5px; background:#f0f0f0; border-radius:4px; text-align:center; margin-top:10px;">
             📍 좌표: <b>X ${displayX} / Y ${displayY} / Z ${displayZ}</b> 📋
        </div>
    `;

    if (info.name === "멸문") {
        panel.innerHTML = `
            <div style="border: 2px solid #6c5ce7; padding: 12px; background: #fff; border-radius: 8px;">
                <h3 style="margin: 0; color: #6c5ce7;">🐍 ${info.name} <small style="color:#666; font-size:14px;">(${info.lv})</small></h3>
                <div style="margin-top: 8px; font-size: 14px; color: #444;">${info.monsters}</div>
                <div style="text-align: center; margin: 10px 0;">
                    <img src="snake.jpg" style="width: 100%; border-radius: 5px; cursor:pointer;" onclick="window.open('snake.jpg')">
                </div>
                ${coordsHtml}
                <button onclick="panelClose()" style="margin-top:10px; width:100%; padding:8px; cursor:pointer;">닫기</button>
            </div>
        `;
    } else {
        panel.innerHTML = `
            <div style="padding: 10px;">
                <h4 style="margin: 0; font-size:20px;"><b>${info.name}</b> <small style="color:#666;">${info.lv ? '('+info.lv+')' : ''}</small></h4>
                <div style="margin-top: 8px; font-size: 15px; color: #555;">${info.monsters || '지역 정보'}</div>
                ${coordsHtml}
                <button onclick="panelClose()" style="margin-top:15px; width:100%; padding:8px; cursor:pointer; background:#C6C6C6; border:2px solid #000; font-weight:bold;">닫기</button>
            </div>
        `;
    }
    panel.style.display = 'block';
};

/** 3. 통합 검색 기능 **/
window.executeSearch = function() {
    var input = document.getElementById('search-input');
    var query = input.value.trim().toLowerCase();
    if (!query) return;

    var allTargets = [];
    if (typeof huntingInfo !== 'undefined') allTargets = allTargets.concat(huntingInfo.map(d => ({...d, _type: 'hunt'})));
    if (typeof poiData !== 'undefined') allTargets = allTargets.concat(poiData.map(d => ({...d, _type: 'poi'})));
    if (typeof npcData !== 'undefined') allTargets = allTargets.concat(npcData.map(d => ({...d, _type: 'npc'})));
    if (typeof herbData !== 'undefined') allTargets = allTargets.concat(herbData.map(d => ({...d, _type: 'herb'})));
    if (typeof redHwanData !== 'undefined') allTargets = allTargets.concat(redHwanData.map(d => ({...d, _type: 'redhwan'})));
    if (typeof discoveryData !== 'undefined') allTargets = allTargets.concat(discoveryData.map(d => ({...d, _type: 'discovery'})));
    if (typeof zodiacData !== 'undefined') allTargets = allTargets.concat(zodiacData.map(d => ({...d, _type: 'zodiac'})));

    var result = allTargets.find(d => d.name && d.name.toString().toLowerCase() === query) ||
                 allTargets.find(d => (d.name && d.name.toLowerCase().includes(query)) || 
                                     (d.monsters && d.monsters.toLowerCase().includes(query)) ||
                                     (d.item && d.item.toLowerCase().includes(query)));

    if (result) {
        var pos = result.coords || result.center || mcToPx(result.x, result.z);
        
        // NaN 방어 코드
        if (!pos || isNaN(pos[0]) || isNaN(pos[1])) {
            alert("좌표 데이터에 오류가 있어 이동할 수 없습니다.");
            return;
        }

        map.setView(pos, 1); 

        if (result._type === 'poi') showMineInfo(result);
        else if (result._type === 'npc') typeof showNPCInfo === 'function' ? showNPCInfo(result) : showHuntingInfo(result);
        else if (result._type === 'redhwan') typeof showRedHwanInfo === 'function' ? showRedHwanInfo(result) : showHuntingInfo(result);
        else if (result._type === 'zodiac') typeof showZodiacInfo === 'function' ? showZodiacInfo(result) : showHuntingInfo(result);
        else if (result._type === 'discovery') typeof showDiscoveryInfo === 'function' ? showDiscoveryInfo(result) : showHuntingInfo(result);
        else if (result._type === 'herb') moveAndShowHerb(result.name, result.mcX, result.mcZ, '#8e44ad');
        else showHuntingInfo(result);

        L.popup().setLatLng(pos).setContent(`<b>${result.name}</b>`).openOn(map);
        input.value = "";
    } else {
        alert("검색 결과가 없습니다: " + query);
    }
};

/** 4. 광산 정보창 **/
window.showMineInfo = function(poi) {
    var panel = document.getElementById('hunting-info-panel');
    var detail = (typeof mineDetailInfo !== 'undefined') ? mineDetailInfo[poi.type] : null;
    var common = (typeof mineDetailInfo !== 'undefined') ? mineDetailInfo["공통"] : "";

    if (!detail) return;

    panel.innerHTML = `
        <div style="border-bottom:3px solid ${poi.color}; padding-bottom:8px; margin-bottom:10px;">
            <b style="font-size:18px;">${detail.title} (${poi.name}번)</b><br>
            <small onclick="copyToClipboard('${poi.mcX},${poi.mcZ}')" style="cursor:pointer; color:#666;">📍 X ${poi.mcX} / Z ${poi.mcZ} 📋</small>
        </div>
        <div style="font-size:14px; margin-bottom:10px;">
            <b style="color:#e74c3c;">고유:</b> ${detail.unique}<br>
            <b style="color:#8e44ad;">공통:</b> ${common}
        </div>
        <div style="background:#f4f4f4; padding:8px; border-left:4px solid #333; font-size:13px;">
            <b>추천 동선:</b><br>${detail.route || '정보 없음'}
        </div>
        <button onclick="panelClose()" style="margin-top:10px; width:100%; padding:8px; cursor:pointer;">닫기</button>
    `;
    panel.style.display = 'block';
};

/** 5. 약초 정보창 **/
window.moveAndShowHerb = function(name, mcX, mcZ, color) {
    var panel = document.getElementById('hunting-info-panel');
    if (typeof herbData === 'undefined') return;
    var allLocations = herbData.filter(h => h.name === name);
    
    var listHtml = allLocations.map(h => 
        `<div style="margin-bottom:4px; font-size:13px;">📍 X: ${h.mcX} / Z: ${h.mcZ}</div>`
    ).join('');

    panel.innerHTML = `
        <div style="border-bottom:3px solid ${color}; padding-bottom:8px; margin-bottom:10px;">
            <b style="font-size:18px;">${name}</b>
        </div>
        <div style="max-height:150px; overflow-y:auto; background:#f9f9f9; padding:8px; border:1px solid #ccc;">
            ${listHtml}
        </div>
        <p style="font-size:11px; color:#e74c3c; margin-top:5px;">* 약초는 위치가 유동적일 수 있습니다.</p>
        <button onclick="panelClose()" style="margin-top:10px; width:100%; padding:8px; cursor:pointer;">닫기</button>
    `;
    panel.style.display = 'block';
};

/** 6. 유틸리티 함수 **/

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        var toast = document.createElement("div");
        toast.innerText = "좌표 복사 완료: " + text;
        toast.style.cssText = "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:20px; z-index:10000; font-size:14px;";
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity="0"; toast.style.transition="0.5s"; setTimeout(()=>toast.remove(), 500); }, 1500);
    });
};

window.panelClose = function() {
    var panel = document.getElementById('hunting-info-panel');
    if(panel) panel.style.display = 'none';
};

window.resetHerbLayers = function() {
    if (typeof herbLayers === 'undefined') return;
    Object.keys(herbLayers).forEach(name => {
        if (map.hasLayer(herbLayers[name])) map.removeLayer(herbLayers[name]);
    });
    panelClose();
};
