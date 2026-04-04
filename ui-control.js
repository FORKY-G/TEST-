/** 1. 사냥터 목록 생성 및 UI 제어 **/

window.generateHuntingList = function() {
    const listElement = document.getElementById('hunting-list');
    if (!listElement || typeof huntingInfo === 'undefined') return;
    
    listElement.innerHTML = ""; 
    huntingInfo.forEach(info => {
        const li = document.createElement('li');
        li.style.margin = "5px 0"; li.style.padding = "5px"; li.style.borderBottom = "1px solid #888";
        li.innerHTML = `<span class="hunt-name-clickable" style="font-size: 14px; display: block; color: #333; cursor: pointer;" onclick="moveAndShowHunt('${info.name}')">${info.name} <small style="color:#666;">(${info.lv || '?'})</small></span>`;
        listElement.appendChild(li);
    });
};

window.moveAndShowHunt = function(name) {
    var info = huntingInfo.find(h => h.name === name);
    if (!info) return;
    var pos = info.center || mcToPx(info.x, info.z);
    if (pos && !isNaN(pos[0])) {
        map.setView(pos, 1); 
        showHuntingInfo(info);
    }
};

window.toggleHuntingList = function() {
    var content = document.getElementById('hunting-content');
    var icon = document.getElementById('toggle-icon');
    content.style.display = (content.style.display === "none") ? "block" : "none";
    icon.innerText = (content.style.display === "none") ? "▼" : "▲";
};

/** 2. 정보창 및 검색 **/
window.showHuntingInfo = function(info) {
    var panel = document.getElementById('hunting-info-panel');
    if (!panel) return;

    var displayX = info.x || info.mcX || "0";
    var displayZ = info.z || info.mcZ || "0";
    
    panel.innerHTML = `
        <div style="padding: 10px;">
            <h4 style="margin: 0; font-size:20px;"><b>${info.name}</b></h4>
            <div style="margin-top: 8px; font-size: 15px; color: #555;">${info.monsters || '정보 없음'}</div>
            <div onclick="copyToClipboard('${displayX}, 80, ${displayZ}')" style="cursor:pointer; background:#eee; padding:5px; margin-top:10px; text-align:center; border:1px solid #999;">
                📍 X ${displayX} / Z ${displayZ} 📋
            </div>
            <button onclick="panelClose()" style="margin-top:15px; width:100%; padding:8px; background:#C6C6C6; border:2px solid #000;">닫기</button>
        </div>
    `;
    panel.style.display = 'block';
};

window.panelClose = function() { document.getElementById('hunting-info-panel').style.display = 'none'; };

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("좌표가 복사되었습니다: " + text);
    });
};
