/** 함수 정의 (사냥터 이동, 검색, 정보창 등) **/

// 사냥터 및 산(비석) 정보창 표시
window.showHuntingInfo = function(info) {
    var panel = document.getElementById('hunting-info-panel');
    
    // 1. 공통 좌표 계산 (X, Y, Z 모두 표시되도록 수정)
    var displayX = info.x !== undefined ? info.x : (info.mcX !== undefined ? info.mcX : "확인불가");
    var displayY = info.y !== undefined ? info.y : "80"; // Y값이 없으면 기본값 80
    var displayZ = info.z !== undefined ? info.z : (info.mcZ !== undefined ? info.mcZ : "확인불가");
    var coordsHtml = '';

    if(displayX !== "확인불가") {
        coordsHtml = `
            <div onclick="copyToClipboard('${displayX}, ${displayY}, ${displayZ}')" 
                 title="클릭하여 좌표 복사"
                 style="font-size:13px; color:#666; cursor:pointer; display:inline-block; border:1px solid #999; padding:3px 8px; background:#eee; border-radius:3px; width:100%; box-sizing:border-box; text-align:center; margin-top:10px;">
                 좌표: <span style="text-decoration:underline; font-weight:bold;">X ${displayX} / Y ${displayY} / Z ${displayZ}</span> 📋
            </div>
        `;
    }

    // 패널 내용
    if (info.name === "멸문") {
        // 멸문 전용: 이미지 포함 레이아웃 (기존 로직 유지)
        panel.innerHTML = `
            <div style="border: 2px solid #6c5ce7; padding: 12px; background: #fff; border-radius: 8px;">
                <h3 style="margin: 0; color: #6c5ce7;">🐍 ${info.name} <small style="color:#666; font-size:14px;">(${info.lv})</small></h3>
                <div style="margin-top: 8px; font-size: 15px; color: #444; line-height:1.4;">${info.monsters}</div>
                
                <div style="text-align: center; margin: 10px 0; background:#eee; padding:5px; border:1px solid #ddd; border-radius:5px;">
                    <p style="font-size:10px; color:#6c5ce7; margin:0 0 5px 0;">📸 클릭 시 원본 보기</p>
                    <img src="snake.jpg" 
                         title="클릭하여 크게 보기"
                         style="width: 100%; max-width: 180px; border-radius: 5px; border:1px solid #ddd; cursor:pointer;" 
                         onclick="window.open('snake.jpg', '_blank')" 
                         onerror="this.src='https://via.placeholder.com/150?text=snake.jpg+Missing'">
                </div>
                ${coordsHtml}
                <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                        style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
                    닫기
                </button>
            </div>
        `;
    } else {
        // 일반 사냥터 (기존 로직 유지하면서 좌표 부분에 Y 추가)
        panel.innerHTML = `
            <h4 id="panel-name" style="margin: 0;">
                <span style="font-size: 24px;"><b>${info.name}</b></span> 
                <span style="font-size: 16px; color: #666;">${info.lv ? '(' + info.lv + ')' : ''}</span>
            </h4>
            <div id="panel-lv" style="margin-top: 8px; font-size: 16px; color: #444;">
                ${info.monsters || (info.type === 'statue' ? '특별 동상' : '지역 비석')}
            </div>
            <div id="panel-coords">${coordsHtml}</div>
            <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                    style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
                닫기
            </button>
        `;
    }

    panel.style.display = 'block';
};

// 사냥터 클릭 이동
window.moveAndShowHunt = function(name) {
    var info = huntingInfo.find(h => h.name === name);
    if (!info) return;

    if (!map.hasLayer(huntingLayers[name])) {
        map.addLayer(huntingLayers[name]);
        updateLayerCheckbox(name, true);
    }
    map.setView(info.center, 0); // 
    showHuntingInfo(info);
};

// 사냥터 목록
window.generateHuntingList = function() {
    const listElement = document.getElementById('hunting-list');
    huntingInfo.forEach(info => {
        const li = document.createElement('li');
        li.style.margin = "5px 0"; li.style.padding = "5px"; li.style.borderBottom = "1px solid #888";
        li.innerHTML = `<span class="hunt-name-clickable" style="font-size: 14px; display: block;" onclick="moveAndShowHunt('${info.name}')">${info.name} <small style="color:#666;">(${info.lv})</small></span>`;
        listElement.appendChild(li);
    });
};

// 레이어 체크박스
window.updateLayerCheckbox = function(name, isAdd) {
    document.querySelectorAll('.leaflet-control-layers-overlays label').forEach(label => {
        if (label.innerText.trim().includes(name)) {
            var cb = label.querySelector('input');
            if (cb) cb.checked = isAdd;
        }
    });
};

// 약초 전용 정보 
window.moveAndShowHerb = function(name, mcX, mcZ, color) {
    if (!map.hasLayer(herbLayers[name])) { map.addLayer(herbLayers[name]); }
    var panel = document.getElementById('hunting-info-panel');
    panel.innerHTML = `<h4 id="panel-name" style="margin: 0;"></h4><div id="panel-lv"></div><div id="herb-detail-content"></div><button onclick="document.getElementById('hunting-info-panel').style.display='none'">닫기</button>`;
    
    var allLocations = herbData.filter(h => h.name === name);
    var coordsHtml = allLocations.map(h => `<div style="margin-bottom:5px;"><span style="background:#444; color:#fff; padding:2px 5px; border-radius:3px; font-size:11px; margin-right:5px;">좌표</span><b style="color:#e74c3c;">X: ${h.mcX} / Z: ${h.mcZ}</b></div>`).join('');
    var rareHerbs = ["월계엽", "철목영지", "금향과", "빙백설화","홍련(초)업화"];
    var isRare = rareHerbs.includes(name);
    var titleExtraHtml = isRare ? ` <span style="color:#e74c3c; font-size:14px;">(희귀)</span>` : "";
    var descExtraHtml = isRare ? `<div style="font-size:9px; color:#555; margin-top:2px;">희귀 약초는 광범위하게 스폰됩니다.</div>` : `<div style="font-size:9px; color:#e74c3c; margin-top:2px; font-weight:bold;">위 좌표들은 명확하지 않을 수 있습니다.</div>`;

    panel.style.display = 'block';
    panel.innerHTML = `<div style="border-bottom:3px solid ${color}; padding-bottom:8px; margin-bottom:12px; position:relative;"><b style="font-size:18px; color:#3F3F3F; text-shadow:1px 1px 0px #fff;">${name}</b>${titleExtraHtml}${descExtraHtml}<span style="position:absolute; right:0; top:0; cursor:pointer; font-weight:bold; padding:5px;" onclick="document.getElementById('hunting-info-panel').style.display='none'">X</span></div><div style="font-size:14px; line-height:1.6; background:rgba(255,255,255,0.5); padding:10px; border:1px solid #888; max-height:150px; overflow-y:auto;">${coordsHtml}</div><button onclick="document.getElementById('hunting-info-panel').style.display='none'" style="margin-top:12px; width:100%; cursor:pointer; background:#C6C6C6; border:2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; font-weight:bold; padding:5px;">닫기</button>`;
};

// 모든 약초 레이어 초기화
window.resetHerbLayers = function() {
    Object.keys(herbLayers).forEach(function(name) { if (map.hasLayer(herbLayers[name])) { map.removeLayer(herbLayers[name]); }});
    document.getElementById('hunting-info-panel').style.display = 'none';
};

/** 통합 검색 기능 **/
window.executeSearch = function() {
    var input = document.getElementById('search-input');
    var query = input.value.trim().toLowerCase();
    if (!query) return;

    var allTargets = [];

    // 데이터 병합 (기존 코드 유지)
    if (typeof huntingInfo !== 'undefined') allTargets = allTargets.concat(huntingInfo.map(d => ({...d, _category: 'hunting'})));
    if (typeof poiData !== 'undefined') allTargets = allTargets.concat(poiData.map(d => ({...d, _category: 'poi'})));
    if (typeof herbData !== 'undefined') allTargets = allTargets.concat(herbData.map(d => ({...d, _category: 'herb'})));
    if (typeof npcData !== 'undefined') allTargets = allTargets.concat(npcData.map(d => ({...d, _category: 'npc'})));
    if (typeof redHwanData !== 'undefined') allTargets = allTargets.concat(redHwanData.map(d => ({...d, _category: 'redhwan'})));
    if (typeof discoveryData !== 'undefined') allTargets = allTargets.concat(discoveryData.map(d => ({...d, _category: 'discovery'})));
    if (typeof mountainData !== 'undefined') allTargets = allTargets.concat(mountainData.map(d => ({...d, _category: 'mountain'})));
    if (typeof zodiacData !== 'undefined') allTargets = allTargets.concat(zodiacData.map(d => ({...d, _category: 'zodiac'})));

    // 1. 이름이 정확히 일치하는 경우 먼저 찾기
    var result = allTargets.find(d => d.name && d.name.toString().toLowerCase() === query);

    // 2. 정확히 일치하는 게 없으면 포함(includes) 검색 수행
    if (!result) {
        result = allTargets.find(d => 
            (d.name && d.name.toString().toLowerCase().includes(query)) || 
            (d.item && d.item.toLowerCase().includes(query)) ||
            (d.relation && d.relation.toLowerCase().includes(query)) ||
            // 👇 [추가된 부분] 몬스터 이름 검색 조건
            (d.monsters && d.monsters.toLowerCase().includes(query)) 
        );
    }

    if (result) {
        // 좌표 계산 (coords가 있으면 사용, 없으면 mcToPx 변환)
        var pos = result.coords ? result.coords : (result.center ? result.center : mcToPx(result.x, result.z));
        map.setView(pos, 1); 

        // 지도 위에 팝업 설정
        var popupContent = `<b>${result.name}</b>`;
        if (result._category === 'poi') popupContent = `<b>${result.name}번 광산 💎</b>`;
        if (result._category === 'npc') popupContent = `<b>NPC: ${result.name} 👤</b>`;
        if (result._category === 'redhwan') popupContent = `<b>적환단: ${result.name} 🔴</b>`;
        
        // 몬스터 검색으로 들어왔을 때 정보 표시용
        if (result.monsters && result.monsters.toLowerCase().includes(query)) {
            popupContent += `<br><span style="font-size:12px; color:#e74c3c;">출몰 몹: ${result.monsters}</span>`;
        }
        if (result.item) popupContent += `<br><span style="font-size:12px; color:blue;">획득: ${result.item}</span>`;

        L.popup()
            .setLatLng(pos)
            .setContent(popupContent)
            .openOn(map);

        // 하단 정보창 표시 로직 (기존 유지)
        if (result._category === 'npc' || result.relation) {
            showNPCInfo(result);
        } else if (result._category === 'redhwan' || (result.name && result.name.includes("적환단"))) {
            showRedHwanInfo(result);
        } else if (result._category === 'poi') {
            showMineInfo(result);
        } else if (result._category === 'hunting' || result._category === 'mountain') {
            showHuntingInfo(result);
        } else if (result._category === 'discovery') {
            showDiscoveryInfo(result);
        } else if (result._category === 'zodiac') {
            showZodiacInfo(result);
        } else {
            // 박스 등 기타 처리
            L.popup().setLatLng(pos).setContent(`<b>${result.name}</b>`).openOn(map);
        }

        input.value = ""; 
    } else {
        alert("검색 결과가 없습니다: " + query);
    }
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
            <div style="font-weight:bold; color:#2c3e50; margin-bottom:4px; font-size:14px;">📍 추천 동선</div>
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

/** 십이간지 정보창 **/
window.showZodiacInfo = function(z) {
    var panel = document.getElementById('hunting-info-panel');
    if (!panel) return;

    var displayName = z.name.replace(/[0-9.]/g, '').trim();
    
    var hiddenText = (displayName === "뱀") ? `<div style="color: #6c5ce7; font-weight: bold; margin-top: 5px; font-size: 13px;">[히든] 뱀의 영기</div>` : "";
    
    panel.style.display = 'block';
    
    panel.innerHTML = `
        <div style="border-bottom:3px solid #e67e22; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:22px; color:#3F3F3F;">${displayName} <span style="font-size:16px; color:#e67e22;">(십이간지)</span></b>
            ${hiddenText}
            <div onclick="copyToClipboard('${z.x}, ${z.z}')" 
                 title="클릭하여 좌표 복사"
                 style="font-size:12px; color:#666; margin-top:8px; cursor:pointer; display:inline-block; background:#f0f0f0; padding:2px 6px; border-radius:3px; border:1px solid #ccc;">
                 좌표: <span style="text-decoration:underline; font-weight:bold;">${z.x}, ${z.z}</span> 📋
            </div>
        </div>
        
        <div style="font-size:14px; color:#444; line-height:1.6;">
            해당 위치는 <b>${displayName}</b>의 기운이 서린 장소입니다.
            <br>[십이지신 순서]</br>
            <br>쥐-소-호랑이-도사-토끼-용-뱀-도사-말-양-원숭이-도사-닭-개-돼지</br>
        </div>
        
        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 15px; cursor: pointer; width: 100%; padding: 8px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
};

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
}; 

/** 탐색(항아리) 정보창 표시 **/
window.showDiscoveryInfo = function(d) {
    var panel = document.getElementById('hunting-info-panel');
    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="border-bottom:3px solid #8e44ad; padding-bottom:8px; margin-bottom:12px;">
            <b style="font-size:30px; color:#3F3F3F;">${d.name} ⚱️</b>
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

/** 적환단 정보창 표시 **/
window.showRedHwanInfo = function(d) {
    var panel = document.getElementById('hunting-info-panel');
    panel.style.display = 'block';
    panel.style.width = '220px'; 
    panel.style.maxHeight = '400px'; 
    panel.style.overflowY = 'auto'; 
    panel.style.overflowX = 'hidden';
    
    panel.innerHTML = `
        <div style="border-bottom:3px solid #e74c3c; padding-bottom:8px; margin-bottom:12px; position:sticky; top:0; background:#C6C6C6; z-index:10;">
            <b style="font-size:18px; color:#3F3F3F;">${d.name} 🔴</b>
            <span style="float:right; cursor:pointer; font-weight:bold; font-size:18px;" onclick="document.getElementById('hunting-info-panel').style.display='none'">×</span>
            <div onclick="copyToClipboard('${d.x}, ${d.y}, ${d.z}')" 
                 title="좌표 복사"
                 style="font-size:11px; color:#666; margin-top:5px; cursor:pointer; display:inline-block; background:#f0f0f0; padding:2px 6px; border-radius:3px; border:1px solid #ccc;">
                좌표: <span style="text-decoration:underline; font-weight:bold;">${d.x}, ${d.y}, ${d.z}</span> 📋
            </div>
        </div>
        
        <div style="text-align:center; background:#eee; padding:5px; border:1px solid #999; border-radius:5px; margin-bottom:10px;">
            <p style="font-size:10px; color:#e74c3c; margin:0 0 5px 0;">📸 클릭 시 원본 보기</p>
            <img src="${d.file}" style="width:100%; cursor:pointer; border:1px solid #000; display:block;" 
                 onclick="window.open('${d.file}', '_blank')" 
                 onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found'">
        </div>

        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 5px; cursor: pointer; width: 100%; padding: 10px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold; font-size:13px;">
            닫기
        </button>
    `;
};

/**NPC 정보창 표시 **/
window.showNPCInfo = function(d) {
    var panel = document.getElementById('hunting-info-panel');
    panel.style.display = 'block';
    panel.style.width = '220px'; 

    panel.innerHTML = `
        <div style="border-bottom:3px solid #2980b9; padding-bottom:8px; margin-bottom:12px; position:relative;">
            <b style="font-size:18px; color:#3F3F3F;">${d.name} <span style="font-size:12px; color:#2980b9;">(NPC)</span></b>
            <span style="float:right; cursor:pointer; font-weight:bold; font-size:18px;" onclick="document.getElementById('hunting-info-panel').style.display='none'">×</span>
            <div onclick="copyToClipboard('${d.x}, ${d.z}')" 
                 title="좌표 복사"
                 style="font-size:11px; color:#666; margin-top:5px; cursor:pointer; display:inline-block; background:#f0f0f0; padding:2px 6px; border-radius:3px; border:1px solid #ccc;">
                좌표: <span style="text-decoration:underline; font-weight:bold;">${d.x}, ${d.z}</span> 📋
            </div>
        </div>
        
        <div style="margin-bottom:10px;">
            <div style="font-size:13px; color:#2c3e50; font-weight:bold;">관련 정보:</div>
            <div style="font-size:12px; color:#555; background:rgba(255,255,255,0.8); padding:8px; border:1px solid #999; margin-top:5px; min-height:30px; word-break:keep-all;">
                ${d.relation || "특이사항 없음"}
            </div>
        </div>

        <button onclick="document.getElementById('hunting-info-panel').style.display='none'" 
                style="margin-top: 5px; cursor: pointer; width: 100%; padding: 10px; background: #C6C6C6; border: 2px solid #000; box-shadow: inset -2px -2px 0px #555555, inset 2px 2px 0px #ffffff; color: #3F3F3F; font-weight: bold;">
            닫기
        </button>
    `;
};
