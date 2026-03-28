/** 1. 함수 정의 (사냥터 이동, 검색, 정보창 등) **/

// 사냥터 및 산(비석) 정보창 표시 함수
window.showHuntingInfo = function(info) {
    var panel = document.getElementById('hunting-info-panel');
    
    // 기본 구조 생성
    panel.innerHTML = `
        <h4 id="panel-name" style="margin: 0;"></h4>
        <div id="panel-lv"></div>
        <div id="panel-coords" style="margin-top:10px;"></div> <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;

    // 이름과 레벨/몬스터 정보 넣기
    document.getElementById('panel-name').innerHTML = `
        <span style="font-size: 24px;"><b>${info.name}</b></span> 
        <span style="font-size: 16px; color: #666;">${info.lv ? '(' + info.lv + ')' : ''}</span>
    `;
    
    document.getElementById('panel-lv').innerHTML = `
        <div style="margin-top: 8px; font-size: 16px; color: #444;">${info.monsters || (info.type === 'statue' ? '특별 동상' : '지역 비석')}</div>
    `;

    // [수정] 산(비석) 및 사냥터 좌표 표시 + 클릭 복사 기능 추가
    // info.x, info.z가 있으면 그걸 쓰고, 없으면 center 좌표를 역계산해서 보여줍니다.
    var displayX = info.x !== undefined ? info.x : (info.mcX !== undefined ? info.mcX : "확인불가");
    var displayZ = info.z !== undefined ? info.z : (info.mcZ !== undefined ? info.mcZ : "확인불가");

    if(displayX !== "확인불가") {
        document.getElementById('panel-coords').innerHTML = `
            <div onclick="copyToClipboard('${displayX}, ${displayZ}')" 
                 title="클릭하여 좌표 복사"
                 style="font-size:13px; color:#666; cursor:pointer; display:inline-block; border:1px solid #999; padding:3px 8px; background:#eee; border-radius:3px;">
                 좌표: <span style="text-decoration:underline; font-weight:bold;">${displayX}, ${displayZ}</span> 📋
            </div>
        `;
    }

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
    var rareHerbs = ["월계엽", "철목영지", "금향과", "빙백설화","홍련초"];
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
    // data.js에 있는 mineDetailInfo에서 데이터를 가져옴
    var detail = mineDetailInfo[poi.type];
    var common = mineDetailInfo["공통"];

    if (!detail) return;

    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="border-bottom:3px solid ${poi.color}; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:20px; color:#3F3F3F;">${detail.title} <span style="font-size:16px;">(${poi.name}번)</span></b>
            
            <div onclick="copyToClipboard('${poi.mcX}, ${poi.mcZ}')" 
                 title="클릭하여 좌표 복사"
                 style="font-size:12px; color:#666; margin-top:2px; cursor:pointer; display:inline-block;">
                좌표: <span style="text-decoration:underline;">X ${poi.mcX} / Z ${poi.mcZ}</span> 📋
            </div>
        </div>
        
        <div style="margin-bottom:15px;">
            <div style="color:#e74c3c; font-weight:bold; font-size:15px; margin-bottom:5px;">고유: ${detail.unique}</div>
            <div style="color:#8e44ad; font-weight:bold; font-size:14px;">공통: ${common}</div>
        </div>

        <div style="background:#f9f9f9; padding:10px; border-radius:5px; border-left:4px solid #555; margin-bottom:10px;">
            <div style="font-weight:bold; color:#2c3e50; margin-bottom:4px; font-size:14px;">📍 권장 동선</div>
            <div style="font-size:13px; color:#333; line-height:1.4; word-break:keep-all;">${detail.route || "정보 없음"}</div>
        </div>

        <div style="font-size:12px; color:#7f8c8d; line-height:1.5; padding:0 5px;">
            ${detail.desc || ""}
        </div>

        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
};

/** 10. 십이간지 정보창 표시 **/
window.showZodiacInfo = function(z) {
    var panel = document.getElementById('hunting-info-panel');
    
    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="border-bottom:3px solid #e67e22; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:22px; color:#3F3F3F;">${z.name} <span style="font-size:16px; color:#e67e22;">(십이간지)</span></b>
            
            <div onclick="copyToClipboard('${z.x}, ${z.z}')" 
                 title="클릭하여 좌표 복사"
                 style="font-size:12px; color:#666; margin-top:5px; cursor:pointer; display:inline-block; background:#f0f0f0; padding:2px 6px; border-radius:3px;">
                 좌표: <span style="text-decoration:underline; font-weight:bold;">${z.x}, ${z.z}</span> 📋
            </div>
        </div>
        
        <div style="font-size:14px; color:#444; line-height:1.6;">
            해당 위치는 <b>${z.name}</b>의 기운이 서린 장소입니다.
        </div>
        
        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
}; // 여기서 한 번만 닫아야 합니다.

/** 11. 클립보드 복사 공통 함수 (마무리 필수!) **/
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
        // 복사 성공 시 화면 하단 알림(토스트)
        var toast = document.createElement("div");
        toast.innerText = "좌표가 복사되었습니다: " + text;
        toast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:5px; z-index:9999; font-size:14px;";
        document.body.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = "0"; 
            toast.style.transition = "opacity 0.5s";
            setTimeout(() => toast.remove(), 500); 
        }, 1000);
    }).catch(function(err) {
        console.error('복사 실패:', err);
    });
    
/** 12. 탐색(항아리) 정보창 표시 **/
window.showDiscoveryInfo = function(d) {
    var panel = document.getElementById('hunting-info-panel');
    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="border-bottom:3px solid #8e44ad; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:20px; color:#3F3F3F;">${d.name} ⚱️</b>
            <div onclick="copyToClipboard('${d.x}, ${d.y}, ${d.z}')" 
                 title="좌표 복사"
                 style="font-size:12px; color:#666; margin-top:2px; cursor:pointer; display:inline-block;">
                좌표: <span style="text-decoration:underline;">${d.x}, ${d.y}, ${d.z}</span> 📋
            </div>
        </div>
        
        <div style="margin-bottom:10px;">
            <div style="font-size:14px; color:#2c3e50; font-weight:bold;">획득 아이템: <span style="color:#e67e22;">${d.item}</span></div>
            <div style="font-size:12px; color:#7f8c8d; margin-top:4px;">필요 도구: ${d.tool}</div>
        </div>

        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
};
    
};
