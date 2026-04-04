/** 1. 월드맵 좌표 맞추기 (최종 정밀 수정본 - NaN 방어형) **/
const mcToPx = (mcX, mcZ) => {
    const imgW = 7080;
    const imgH = 6858;
    const worldRange = 16160;

    // 만약 mcX나 mcZ가 undefined면 0으로 강제 변환하여 에러 방지
    const safeX = (mcX === undefined || mcX === null) ? 0 : Number(mcX);
    const safeZ = (mcZ === undefined || mcZ === null) ? 0 : Number(mcZ);

    const pxSpawnX = 3122;
    const pxSpawnY = 2889;
    const mcSpawnX = -969;
    const mcSpawnZ = -965;

    const scaleX = imgW / worldRange;
    const scaleY = imgH / worldRange;

    const resX = pxSpawnX + (safeX - mcSpawnX) * scaleX;
    const resY = pxSpawnY + (safeZ - mcSpawnZ) * scaleY;

    return [-resY, resX];
};

/** 2. 산(비석), 동상 데이터 **/
var mountainData = [
    { name: "천보산", coords: mcToPx(-2030, -4142) }, 
    { name: "망운산", coords: mcToPx(-2662, -1556) }, 
    { name: "신운산", coords: mcToPx(-2984, 72) }, 
    { name: "봉래산", coords: mcToPx(-5278, -2042) }, 
    { name: "사성산", coords: mcToPx(4356, 3515) }, 
    { name: "용문산", coords: mcToPx(5378, 3731) }, 
    { name: "도덕산", coords: mcToPx(6498, 67) }, 
    { name: "월랑산", coords: mcToPx(-2720, 2883) }, 
    { name: "청태산", coords: mcToPx(4191, -2806) },
    { name: "삼악산", coords: mcToPx(5917, 2453) },
    // 동상 데이터
    { name: "제천대성", file: "statue3.png", coords: mcToPx(1513, 3593), type: "statue" },
    { name: "UNKNOWN", file: "statue1.png", coords: mcToPx(2903, 714), type: "statue" },
    { name: "한월동상", file: "statue2.png", coords: mcToPx(-334, -5519), type: "statue" }
];

/** 3. 광산 및 포인트 데이터 (poiData) **/
const poiData = [ 
    { name: "스폰", type: "스폰", color: "#333", coords: mcToPx(-971, -965), mcX: -971, mcZ: -965 }, 
    { name: "1", type: "녹", color: "#2ecc71", coords: mcToPx(-1093, -701), order : 11, lineType : "solid" }, 
    { name: "2", type: "녹", color: "#2ecc71", coords: mcToPx(-1038, -14), order : 10, lineType : "dotted" }, 
    { name: "3", type: "녹", color: "#2ecc71", coords: mcToPx(-1837, -944), order : 12, lineType : "solid" }, 
    { name: "4", type: "녹", color: "#2ecc71", coords: mcToPx(-2599, -2691), order : 14, lineType : "solid" }, 
    { name: "5", type: "녹", color: "#2ecc71", coords: mcToPx(-4001, -1579), order : 24, lineType : "dotted" }, 
    { name: "6", type: "녹", color: "#2ecc71", coords: mcToPx(1085, 199), order : 9, lineType : "solid" }, 
    { name: "7", type: "녹", color: "#2ecc71", coords: mcToPx(-775, -1986), order : 22, lineType : "dotted" }, 
    { name: "8", type: "녹", color: "#2ecc71", coords: mcToPx(2605, -1142), order : 4, lineType : "solid" }, 
    { name: "9", type: "녹", color: "#2ecc71", coords: mcToPx(752, -1272), order : 8, lineType : "solid" }, 
    { name: "10", type: "청", color: "#3498db", coords: mcToPx(-4322, -2810), order : 5, lineType : "solid" }, 
    { name: "11", type: "황", color: "#f1c40f", coords: mcToPx(815, 2558), order : 9, lineType : "solid" }, 
    { name: "12", type: "황", color: "#f1c40f", coords: mcToPx(-1913, 3153), order : 4, lineType : "solid" }, 
    { name: "13", type: "황", color: "#f1c40f", coords: mcToPx(-3094, 855), order : 3, lineType : "solid" }, 
    { name: "14", type: "청", color: "#3498db", coords: mcToPx(7137, -1668), order : 10, lineType : "solid" }, 
    { name: "15", type: "청", color: "#3498db", coords: mcToPx(6123, 486), order : 11, lineType : "solid" }, 
    { name: "16", type: "청", color: "#3498db", coords: mcToPx(5709, -3342), order : 9, lineType : "dotted" }, 
    { name: "17", type: "적", color: "#e74c3c", coords: mcToPx(3806, 5436), order : 6, lineType : "dotted" }, 
    { name: "18", type: "적", color: "#e74c3c", coords: mcToPx(3542, 6378), order : 7, lineType : "solid" }, 
    { name: "19", type: "적", color: "#e74c3c", coords: mcToPx(-6250, 2367), order : 12, lineType : "solid" }, 
    { name: "20", type: "적", color: "#e74c3c", coords: mcToPx(-7547, 623), order : 14, lineType : "solid" }, 
    { name: "21", type: "청", color: "#3498db", coords: mcToPx(-2854, -5529), order : 8, lineType : "solid" }, 
    { name: "22", type: "청", color: "#3498db", coords: mcToPx(-5186, 1256), order : 1, lineType : "solid" }, 
    { name: "23", type: "녹", color: "#2ecc71", coords: mcToPx(4301, -3381), order : 2, lineType : "solid" }, 
    { name: "24", type: "청", color: "#3498db", coords: mcToPx(5584, 3322), order : 14, lineType : "dotted" }, 
    { name: "25", type: "적", color: "#e74c3c", coords: mcToPx(1998, 4657), order : 3, lineType : "solid" }, 
    { name: "26", type: "녹", color: "#2ecc71", coords: mcToPx(2201, -2740), order : 5, lineType : "dotted" }, 
    { name: "27", type: "적", color: "#e74c3c", coords: mcToPx(-6540, 516), order : 13, lineType : "solid" }, 
    { name: "28", type: "황", color: "#f1c40f", coords: mcToPx(3701, 2080), order : 12, lineType : "solid" }, 
    { name: "29", type: "황", color: "#f1c40f", coords: mcToPx(-4084, 3035), order : 1, lineType : "solid" }, 
    { name: "30", type: "적", color: "#e74c3c", coords: mcToPx(6217, 4562), order : 10, lineType : "solid" }, 
    { name: "31", type: "녹", color: "#2ecc71", coords: mcToPx(-563, -6176), order : 17, lineType : "solid" }, 
    { name: "32", type: "녹", color: "#2ecc71", coords: mcToPx(1472, -6472), order : 19, lineType : "dotted" }, 
    { name: "33", type: "녹", color: "#2ecc71", coords: mcToPx(4214, -4596), order : 1, lineType : "solid" }, 
    { name: "34", type: "녹", color: "#2ecc71", coords: mcToPx(1941, -5632), order : 20, lineType : "solid" }, 
    { name: "35", type: "청", color: "#3498db", coords: mcToPx(-4657, -4523), order : 7, lineType : "solid" }, 
    { name: "36", type: "청", color: "#3498db", coords: mcToPx(-4830, -4303), order : 6, lineType : "dotted" }, 
    { name: "37", type: "청", color: "#3498db", coords: mcToPx(-5480, -1720), order : 4, lineType : "solid" }, 
    { name: "38", type: "적", color: "#e74c3c", coords: mcToPx(-6696, -1145), order : 15, lineType : "dotted" }, 
    { name: "39", type: "녹", color: "#2ecc71", coords: mcToPx(-559, -4593), order : 16, lineType : "solid" }, 
    { name: "40", type: "적", color: "#e74c3c", coords: mcToPx(1487, 5300), order : 2, lineType : "solid" }, 
    { name: "41", type: "적", color: "#e74c3c", coords: mcToPx(1601, 5485), order : 1, lineType : "solid" }, 
    { name: "42", type: "적", color: "#e74c3c", coords: mcToPx(2129, 6598), order : 8, lineType : "solid" }, 
    { name: "43", type: "황", color: "#f1c40f", coords: mcToPx(-960, 2033), order : 4, lineType : "solid" }, 
    { name: "44", type: "황", color: "#f1c40f", coords: mcToPx(-2468, 4433), order : 6, lineType : "dotted" }, 
    { name: "45", type: "적", color: "#e74c3c", coords: mcToPx(-5443, 4139), order : 11, lineType : "dotted" }, 
    { name: "46", type: "적", color: "#e74c3c", coords: mcToPx(4024, 3356), order : 5, lineType : "solid" }, 
    { name: "47", type: "황", color: "#f1c40f", coords: mcToPx(658, 3900), order : 8, lineType : "solid" }, 
    { name: "48", type: "녹", color: "#2ecc71", coords: mcToPx(-2121, -3837), order : 15, lineType : "dotted" }, 
    { name: "49", type: "청", color: "#3498db", coords: mcToPx(4886, 954), order : 12, lineType : "solid" }, 
    { name: "50", type: "청", color: "#3498db", coords: mcToPx(4942, -1189), order : 13, lineType : "solid" }, 
    { name: "51", type: "황", color: "#f1c40f", coords: mcToPx(677, 1433), order : 10, lineType : "dotted" }, 
    { name: "52", type: "녹", color: "#2ecc71", coords: mcToPx(-762, -6601), order : 18, lineType : "solid" }, 
    { name: "53", type: "녹", color: "#2ecc71", coords: mcToPx(2657, -5891), order : 21, lineType : "dotted" }, 
    { name: "54", type: "녹", color: "#2ecc71", coords: mcToPx(2036, -3624), order : 6, lineType : "solid" }, 
    { name: "55", type: "청", color: "#3498db", coords: mcToPx(-4098, -55), order : 2, lineType : "solid" }, 
    { name: "56", type: "녹", color: "#2ecc71", coords: mcToPx(-2006, 127), order : 23, lineType : "solid" }, 
    { name: "57", type: "녹", color: "#2ecc71", coords: mcToPx(-2264, -1571), order : 13, lineType : "solid" }, 
    { name: "58", type: "녹", color: "#2ecc71", coords: mcToPx(3885, -1415), order : 3, lineType : "solid" }, 
    { name: "59", type: "청", color: "#3498db", coords: mcToPx(-5054, -2598), order : 3, lineType : "solid" }, 
    { name: "60", type: "적", color: "#e74c3c", coords: mcToPx(3323, 3939), order : 4, lineType : "solid" }, 
    { name: "61", type: "적", color: "#e74c3c", coords: mcToPx(5258, 5723), order : 9, lineType : "solid" }, 
    { name: "62", type: "녹", color: "#2ecc71", coords: mcToPx(1014, -2648), order : 7, lineType : "solid" }, 
    { name: "63", type: "황", color: "#f1c40f", coords: mcToPx(2705, 2461), order : 11, lineType : "dotted" }, 
    { name: "64", type: "황", color: "#f1c40f", coords: mcToPx(-4029, 2321), order : 2, lineType : "solid" }, 
    { name: "65", type: "황", color: "#f1c40f", coords: mcToPx(-790, 4284), order : 7, lineType : "solid" } 
];

/** 4. 약초 데이터 **/
const herbData = [
    { name: "홍련업화", file: "hub19.png", coords: mcToPx(-7519, 821) },
    { name: "민들레", file: "hub4.png", coords: mcToPx(-3128, -5376) },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6306, 4265) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5603, 1222) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5735, 819) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5692, 827) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5775, 1081) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5840, 1203) },
    { name: "권엽", file: "hub1.png", coords: mcToPx(-4500, -700) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(6180, -1724) },
    { name: "흑성과", file: "hub14.png", coords: mcToPx(-1671, -3534) },
    { name: "권엽", file: "hub1.png", coords: mcToPx(-4386, 142) },
    { name: "민들레", file: "hub4.png", coords: mcToPx(1352, -6136) },
    { name: "생강", file: "hub6.png", coords: mcToPx(1485, 3133) },
    { name: "생강", file: "hub6.png", coords: mcToPx(1248, 5784) },
    { name: "인삼", file: "hub10.png", coords: mcToPx(-4705, 765) },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(4800, 3752) },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(-1323, -588) },
    { name: "황초", file: "hub13.png", coords: mcToPx(3348, -4641) },
    { name: "녹태", file: "hub3.png", coords: mcToPx(1110, -2830) },
    { name: "황초", file: "hub13.png", coords: mcToPx(-4168, -4856) },
    { name: "황초", file: "hub13.png", coords: mcToPx(-1444, -298) },
    { name: "흑성과", file: "hub14.png", coords: mcToPx(1545, -186) },
    { name: "철목영지", file: "hub16.png", coords: mcToPx(-3901, 2699) },
    { name: "철목영지", file: "hub16.png", coords: mcToPx(-2805, 2548) },
    { name: "적주과", file: "hub12.png", coords: mcToPx(344, 2102) },
    { name: "적주과", file: "hub12.png", coords: mcToPx(-3944, 1272) },
    { name: "적주과", file: "hub12.png", coords: mcToPx(-975, 766) },
    { name: "자운초", file: "hub11.png", coords: mcToPx(2744, 4672) },
    { name: "자운초", file: "hub11.png", coords: mcToPx(4034, 4340) },
    { name: "인삼", file: "hub10.png", coords: mcToPx(1500, 4200) },
    { name: "월계엽", file: "hub15.png", coords: mcToPx(-1622, -6433) },
    { name: "월계엽", file: "hub15.png", coords: mcToPx(191, -6387) },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6408, 4024) },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6438, 4437) },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(-3702, -2388) },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(882, -2274) },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(-4568, -3959) },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(768, 5056) },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(-1712, -6379) },
    { name: "백향초", file: "hub5.png", coords: mcToPx(-5488, 4162) },
    { name: "생강", file: "hub6.png", coords: mcToPx(-4656, 2024) },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5923, 1509) },
    { name: "민들레", file: "hub4.png", coords: mcToPx(-3006, -5033) },
    { name: "녹태", file: "hub3.png", coords: mcToPx(-2176, -187) },
    { name: "녹태", file: "hub3.png", coords: mcToPx(-285, -1059) },
    { name: "금향과", file: "hub17.png", coords: mcToPx(-772, 1917) },
    { name: "금양광초", file: "hub2.png", coords: mcToPx(3633, 1015) },
    { name: "금양광초", file: "hub2.png", coords: mcToPx(3070, 2541) }
];

const herbColors = { 
    "홍련업화": "#FF1493", "빙백설화": "#3498db", "철목영지": "#e67e22", 
    "월계엽": "#2ecc71", "금향과": "#f1c40f", "녹태": "#16a085", 
    "황초": "#f39c12", "적주과": "#e74c3c", "옥취엽": "#d35400", 
    "옥향초": "#8e44ad", "인삼": "#c0392b", "자운초": "#9b59b6", 
    "생강": "#7f8c8d", "민들레": "#e67e22", "영군버섯": "#2980b9", 
    "금양광초": "#f1c40f", "권엽": "#27ae60", "흑성과": "#2c3e50", "백향초": "#ecf0f1" 
};

/** 5. 십이간지 데이터 **/
const zodiacData = [ 
    { name: "2.소", coords: mcToPx(-616, 3889) }, 
    { name: "10.닭", coords: mcToPx(5075, -344) }, 
    { name: "4.토끼", coords: mcToPx(4590, -3397) }, 
    { name: "6.뱀", coords: mcToPx(2685, -4051) }, 
    { name: "12.돼지", coords: mcToPx(-3657, 1112) }, 
    { name: "11.개", coords: mcToPx(-4455, -2376) }, 
    { name: "7.말", coords: mcToPx(-2365, 3968) }, 
    { name: "9.원숭이", coords: mcToPx(3280, 2952) }, 
    { name: "8.양", coords: mcToPx(5093, 2092) }, 
    { name: "3.호랑이", coords: mcToPx(-5500, -1600) }, 
    { name: "5.용", coords: mcToPx(-891, -536) }, 
    { name: "1.쥐", coords: mcToPx(-2900, -4600) } 
];

/** 6. 사냥터 데이터 **/
const huntingInfo = [
    { name: "혈교도", lv: "100", monsters: "혈교도,의문의상자", file: "map17.png", center: mcToPx(-3979, 2501) }, 
    { name: "화검문", lv: "???", monsters: "봉원숭이, 곤봉원숭이, 화검문포탈", file: "map16.png", center: mcToPx(-3392, -1819) }, 
    { name: "경작지", lv: "0~5", monsters: "참새(Lv.0), 허수아비(Lv.5)", file: "map2.png", center: mcToPx(-954, -666) }, 
    { name: "화수원", lv: "10~20", monsters: "다람쥐(Lv.10), 흙토끼(Lv.15), 백토끼(Lv.20)", file: "map3.png", center: mcToPx(-586, 446) }, 
    { name: "괴암곡", lv: "25~35", monsters: "하급쥐(Lv.25), 중급쥐(Lv.30), 상급쥐(Lv.35)<br><span style='color:#e67e22;'>*정예쥐 출현</span>", file: "map4.png", center: mcToPx(1320, -1598) }, 
    { name: "멸문", lv: "40~50", monsters: "뱀(Lv.40), 청사(Lv.45), 적사(Lv.50)<br><span style='color:#e67e22;'>*구렁이 출현</span></br><br><span style='color:#a29bfe;'>[히든]뱀의영기</br>", file: "map5.png", center: mcToPx(3862, -2644) }, 
    { name: "신선원", lv: "55~65", monsters: "새싹삼(Lv.55), 진삼(Lv.60), 대장삼(Lv.65)<br><span style='color:#e67e22;'>*거대삼 출현</span>", file: "map6.png", center: mcToPx(-3628, -3094) }, 
    { name: "천웅성", lv: "70~80", monsters: "비웅(Lv.70), 겸웅(Lv.75), 꼬마유령(Lv.80)", file: "map7.png", center: mcToPx(5700, 5198) }, 
    { name: "매화곡", lv: "85~90", monsters: "천도원숭이(Lv.85), 황도원숭이(Lv.90)", file: "map8.png", center: mcToPx(4256, 392) }, 
    { name: "이매궁", lv: "100~110", monsters: "도깨비(Lv.100), 청깨비(Lv.105), 진깨비(Lv.110)", file: "map9.png", center: mcToPx(1634, 336) }, 
    { name: "검성지묘", lv: "115~125", monsters: "강암수호(Lv.115), 새끼암갑수(Lv.120), 암갑수(Lv.125)", file: "map10.png", center: mcToPx(-5436, -802) }, 
    { name: "빙설곡", lv: "130~140", monsters: "백랑(Lv.130), 적호(Lv.135), 백호(Lv.140)", file: "map11.png", center: mcToPx(6784, -2500) }, 
    { name: "빙궁", lv: "145~155", monsters: "빙궁조(Lv.145), 빙궁병(Lv.150), 북해신녀(Lv.155)", file: "map12.png", center: mcToPx(6572, 948) }, 
    { name: "협사곡", lv: "160~170", monsters: "산적(Lv.160), 산적궁수(Lv.165), 멧돼지산적(Lv.170)", file: "map13.png", center: mcToPx(-282, 4318) }, 
    { name: "황야성", lv: "175~185", monsters: "토석병(Lv.175), 토석군(Lv.180), 토석궁사(Lv.185)", file: "map14.png", center: mcToPx(-2080, 1996) }, 
    { name: "운해궁", lv: "만렙", monsters: "최종구역", file: "map15.png", center: mcToPx(-1422, 5612) } 
];

/** 8. 탐색 데이터 **/
var discoveryData = [
    { name: "항아리", coords: mcToPx(-713, 2862), item: "고목조각", tool: "탐색부적" },
    { name: "항아리", coords: mcToPx(-1758, -838), item: "송진덩어리", tool: "탐색부적" },
    { name: "항아리", coords: mcToPx(2179, -529), item: "향목가루", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(5878, 1155), item: "깨진옥조각", tool: "탐색부적" },
    { name: "항아리", coords: mcToPx(-5333, 673), item: "깨진기와", tool: "탐색부적" },
    { name: "항아리", coords: mcToPx(-3784, -1670), item: "낡은목간", tool: "탐색부적" },
    { name: "항아리", coords: mcToPx(-3313, 3169), item: "청동파편", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(720, 1800), item: "녹슨철패", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(6426, 2392), item: "연마사", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(-7368, 1546), item: "잔존영석", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(7268, 5300), item: "봉인된철편", tool: "탐령구" },
    { name: "항아리", coords: mcToPx(4171, 2643), item: "마모된인장", tool: "탐령구" }
];

/** 9. 적환단 데이터 **/
var redHwanData = [
    { name: "1. 적환단", coords: mcToPx(-3656, 4060), file: "red1.png" },
    { name: "2. 적환단", coords: mcToPx(-1458, 2875), file: "red2.png" },
    { name: "3. 적환단", coords: mcToPx(2358, 2177), file: "red3.png" },
    { name: "4. 적환단", coords: mcToPx(2661, -4790), file: "red4.png" },
    { name: "5. 적환단", coords: mcToPx(1961, -6200), file: "red5.png" },
    { name: "6. 적환단", coords: mcToPx(-2579, -5970), file: "red6.png" },
    { name: "7. 적환단", coords: mcToPx(-3375, 3449), file: "red7.png" }
];

/** 10. NPC 데이터 **/
var npcData = [
    { name: "해진(lv.50)", coords: mcToPx(-4311, 5831), file: "haejin.png" },
    { name: "해적선(lv.50)", coords: mcToPx(-3619, 4060), file: "boat.png" },
    { name: "백향초재배지", coords: mcToPx(-5488, 4162), file: "door.png" },
    { name: "점소이", coords: mcToPx(-2538, -5994), file: "jumsoi.png" },
    { name: "주루대주", coords: mcToPx(-2545, -6020), file: "juru.png" },
    { name: "자운스님", coords: mcToPx(-4366, 1394), file: "jaun.png" },
    { name: "조사중인스님", coords: mcToPx(392, -1518), file: "josa.png" },
    { name: "풍잔객", coords: mcToPx(3039, 4235), file: "pung.png" },
    { name: "기록서", coords: mcToPx(1539, 4654), file: "memo.png" },
    { name: "시녀(lv.50)", coords: mcToPx(-6535, -2577), file: "girl.png" },
    { name: "몰락한소가주(lv.73)", coords: mcToPx(3138, -2582), file: "sogaju.png" },
    { name: "도공", coords: mcToPx(-4786, 1442), file: "dogong.png" },
    { name: "도사", coords: mcToPx(-1290, -591), file: "dosa.png" },
    { name: "명인대장장이", coords: mcToPx(-7051, -727), file: "mungin.png" },
    { name: "망한대장장이", coords: mcToPx(5369, -3462), file: "mang.png" },
    { name: "심마니(lv.90)", coords: mcToPx(-3485, -1949), file: "simmani.png" },
    { name: "감시관(lv.67)", coords: mcToPx(5176, 4585), file: "gamsi.png" },
    { name: "척후병(lv.100)", coords: mcToPx(-3963, 2612), file: "scout.png" },
    { name: "해무사승려(lv.50)", coords: mcToPx(-5728, 3441), file: "haemusa.png" },
    { name: "연운객(lv.50)", coords: mcToPx(-5656, 3266), file: "yeonun.png" },
    { name: "상단주(lv.50)", coords: mcToPx(-3260, -4290), file: "owner.png" },
    { name: "부숴진마차(lv.50)", coords: mcToPx(-2706, -2372), file: "macha.png" },
    { name: "탐령구제작", coords: mcToPx(-2076, 425), file: "gu.png" },
    { name: "정청주제작", coords: mcToPx(2034, 3265), file: "jungju.png" }
];

/** 11. 상자 데이터 **/
var mysteryBoxData = [
    { name: "의문의 상자", coords: mcToPx(-4818, -3812), item: "일반부적뽑기" },
    { name: "의문의 상자", coords: mcToPx(-6523, 2194), item: "일반부적뽑기" },
    { name: "의문의 상자", coords: mcToPx(-6761, 846), item: "고급주문서뽑기" },
    { name: "의문의 상자", coords: mcToPx(-3317, -4255), item: "일반부적뽑기" },
    { name: "의문의 상자", coords: mcToPx(3068, 6312) },
    { name: "의문의 상자", coords: mcToPx(5107, -1998) },
    { name: "의문의 상자", coords: mcToPx(2985, -980) },
    { name: "의문의 상자", coords: mcToPx(-1420, -4655) },
    { name: "의문의 상자", coords: mcToPx(2984, -975) },
    { name: "의문의 상자", coords: mcToPx(-1852, 4290) },
    { name: "의문의 상자", coords: mcToPx(7049, 2874), item: "고급주문서뽑기" },
    { name: "의문의 상자", coords: mcToPx(1124, 1498), item: "일반부적뽑기"},
    { name: "의문의 상자", coords: mcToPx(-3979, 2501), item: "상자3개있음"}
];
