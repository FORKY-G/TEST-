/** 1. 월드맵 좌표 맞추기 **/
const mcToPx = (mcX, mcZ) => {
    var mcSpawnPxX = 3218, mcSpawnPxY = 2874;
    var mcSpawnCoordX = -971, mcSpawnCoordZ = -965;
    var scale = 7300 / 16384; 
    return [-(mcSpawnPxY + (mcZ - mcSpawnCoordZ) * scale), mcSpawnPxX + (mcX - mcSpawnCoordX) * scale]; 
};

/** 2. 산(비석),동상 데이터 **/
var mountainData = [
    { name: "천보산", x: -2030, z: -4142 }, 
    { name: "망운산", x: -2662, z: -1556 }, 
    { name: "신운산", x: -2984, z: 72 }, 
    { name: "봉래산", x: -5278, z: -2042 }, 
    { name: "사성산", x: 4356, z: 3515 }, 
    { name: "용문산", x: 5378, z: 3731 }, 
    { name: "도덕산", x: 6498, z: 67 }, 
    { name: "월랑산", x: -2720, z: 2883 }, 
    { name: "청태산", x: 4191, z: -2806 },
    { name: "삼악산", x: 5917, z: 2453 },
    // 동상 데이터 추가
{ name: "UNKNOWN", file: "statue3.png", x: 1513, z: 3593, type: "statue" },
    { name: "UNKNOWN", file: "statue1.png", x: 2903, z: 714, type: "statue" },
    { name: "UNKNOWN", file: "statue2.png", coords: [-849, 1279], x: -334, z: -5519, type: "statue" }
];

/** 3. 광산 및 포인트 데이터 **/
const poiData = [ 
    { name: "스폰", type: "스폰", color: "#333", coords: mcToPx(-971, -965), mcX: -971, mcZ: -965 }, 
    { name: "1", type: "녹", color: "#2ecc71", coords: mcToPx(-1093, -701), mcX: -1093, mcZ: -701, order : 11, lineType : "solid" }, { name: "2", type: "녹", color: "#2ecc71", coords: mcToPx(-1038, -14), mcX: -1038, mcZ: -14, order : 10, lineType : "dotted" }, { name: "3", type: "녹", color: "#2ecc71", coords: mcToPx(-1837, -944), mcX: -1837, mcZ: -944, order : 12, lineType : "solid" }, { name: "4", type: "녹", color: "#2ecc71", coords: mcToPx(-2599, -2691), mcX: -2599, mcZ: -2691, order : 14, lineType : "solid" }, { name: "5", type: "녹", color: "#2ecc71", coords: mcToPx(-4001, -1579), mcX: -4001, mcZ: -1579, order : 24, lineType : "dotted" }, { name: "6", type: "녹", color: "#2ecc71", coords: mcToPx(1085, 199), mcX: 1085, mcZ: 199, order : 9, lineType : "solid" }, { name: "7", type: "녹", color: "#2ecc71", coords: mcToPx(-775, -1986), mcX: -775, mcZ: -1986, order : 22, lineType : "dotted" }, { name: "8", type: "녹", color: "#2ecc71", coords: mcToPx(2605, -1142), mcX: 2605, mcZ: -1142, order : 4, lineType : "solid" }, { name: "9", type: "녹", color: "#2ecc71", coords: mcToPx(752, -1272), mcX: 752, mcZ: -1272, order : 8, lineType : "solid" }, 
    { name: "10", type: "청", color: "#3498db", coords: mcToPx(-4322, -2810), mcX: -4322, mcZ: -2810, order : 5, lineType : "solid" }, { name: "11", type: "황", color: "#f1c40f", coords: mcToPx(815, 2558), mcX: 815, mcZ: 2558, order : 9, lineType : "solid" }, { name: "12", type: "황", color: "#f1c40f", coords: mcToPx(-1913, 3153), mcX: -1913, mcZ: 3153, order : 4, lineType : "solid" }, { name: "13", type: "황", color: "#f1c40f", coords: mcToPx(-3094, 855), mcX: -3094, mcZ: 855, order : 3, lineType : "solid" }, { name: "14", type: "청", color: "#3498db", coords: mcToPx(7137, -1668), mcX: 7137, mcZ: -1668, order : 10, lineType : "solid" }, { name: "15", type: "청", color: "#3498db", coords: mcToPx(6123, 486), mcX: 6123, mcZ: 486, order : 11, lineType : "solid" }, { name: "16", type: "청", color: "#3498db", coords: mcToPx(5709, -3342), mcX: 5709, mcZ: -3342, order : 9, lineType : "dotted" }, { name: "17", type: "적", color: "#e74c3c", coords: mcToPx(3806, 5436), mcX: 3806, mcZ: 5436, order : 6, lineType : "dotted" }, { name: "18", type: "적", color: "#e74c3c", coords: mcToPx(3542, 6378), mcX: 3542, mcZ: 6378, order : 7, lineType : "solid" }, { name: "19", type: "적", color: "#e74c3c", coords: mcToPx(-6250, 2367), mcX: -6250, mcZ: 2367, order : 12, lineType : "solid" }, { name: "20", type: "적", color: "#e74c3c", coords: mcToPx(-7547, 623), mcX: -7547, mcZ: 623, order : 14, lineType : "solid" }, 
    { name: "21", type: "청", color: "#3498db", coords: mcToPx(-2854, -5529), mcX: -2854, mcZ: -5529, order : 8, lineType : "solid" }, { name: "22", type: "청", color: "#3498db", coords: mcToPx(-5186, 1256), mcX: -5186, mcZ: 1256, order : 1, lineType : "solid" }, { name: "23", type: "녹", color: "#2ecc71", coords: mcToPx(4301, -3381), mcX: 4301, mcZ: -3381, order : 2, lineType : "solid" }, { name: "24", type: "청", color: "#3498db", coords: mcToPx(5584, 3322), mcX: 5584, mcZ: 3322, order : 14, lineType : "dotted" }, { name: "25", type: "적", color: "#e74c3c", coords: mcToPx(1998, 4657), mcX: 1998, mcZ: 4657, order : 3, lineType : "solid" }, { name: "26", type: "녹", color: "#2ecc71", coords: mcToPx(2201, -2740), mcX: 2201, mcZ: -2740, order : 5, lineType : "dotted" }, { name: "27", type: "적", color: "#e74c3c", coords: mcToPx(-6540, 516), mcX: -6540, mcZ: 516, order : 13, lineType : "solid" }, { name: "28", type: "황", color: "#f1c40f", coords: mcToPx(3701, 2080), mcX: 3701, mcZ: 2080, order : 12, lineType : "solid" }, { name: "29", type: "황", color: "#f1c40f", coords: mcToPx(-4084, 3035), mcX: -4084, mcZ: 3035, order : 1, lineType : "solid" }, { name: "30", type: "적", color: "#e74c3c", coords: mcToPx(6217, 4562), mcX: 6217, mcZ: 4562, order : 10, lineType : "solid" }, 
    { name: "31", type: "녹", color: "#2ecc71", coords: mcToPx(-563, -6176), mcX: -563, mcZ: -6176, order : 17, lineType : "solid" }, { name: "32", type: "녹", color: "#2ecc71", coords: mcToPx(1472, -6472), mcX: 1472, mcZ: -6472, order : 19, lineType : "dotted" }, { name: "33", type: "녹", color: "#2ecc71", coords: mcToPx(4214, -4596), mcX: 4214, mcZ: -4596, order : 1, lineType : "solid" }, { name: "34", type: "녹", color: "#2ecc71", coords: mcToPx(1941, -5632), mcX: 1941, mcZ: -5632, order : 20, lineType : "solid" }, { name: "35", type: "청", color: "#3498db", coords: mcToPx(-4657, -4523), mcX: -4657, mcZ: -4523, order : 7, lineType : "solid" }, { name: "36", type: "청", color: "#3498db", coords: mcToPx(-4830, -4303), mcX: -4830, mcZ: -4303, order : 6, lineType : "dotted" }, { name: "37", type: "청", color: "#3498db", coords: mcToPx(-5480, -1720), mcX: -5480, mcZ: -1720, order : 4, lineType : "solid" }, { name: "38", type: "적", color: "#e74c3c", coords: mcToPx(-6696, -1145), mcX: -6696, mcZ: -1145, order : 15, lineType : "dotted" }, { name: "39", type: "녹", color: "#2ecc71", coords: mcToPx(-559, -4593), mcX: -559, mcZ: -4593, order : 16, lineType : "solid" }, { name: "40", type: "적", color: "#e74c3c", coords: mcToPx(1487, 5300), mcX: 1487, mcZ: 5300, order : 2, lineType : "solid" }, 
    { name: "41", type: "적", color: "#e74c3c", coords: mcToPx(1601, 5485), mcX: 1601, mcZ: 5485, order : 1, lineType : "solid" }, { name: "42", type: "적", color: "#e74c3c", coords: mcToPx(2129, 6598), mcX: 2129, mcZ: 6598, order : 8, lineType : "solid" }, { name: "43", type: "황", color: "#f1c40f", coords: mcToPx(-960, 2033), mcX: -960, mcZ: 2033, order : 4, lineType : "solid" }, { name: "44", type: "황", color: "#f1c40f", coords: mcToPx(-2468, 4433), mcX: -2468, mcZ: 4433, order : 6, lineType : "dotted" }, { name: "45", type: "적", color: "#e74c3c", coords: mcToPx(-5443, 4139), mcX: -5443, mcZ: 4139, order : 11, lineType : "dotted" }, { name: "46", type: "적", color: "#e74c3c", coords: mcToPx(4024, 3356), mcX: 4024, mcZ: 3356, order : 5, lineType : "solid" }, { name: "47", type: "황", color: "#f1c40f", coords: mcToPx(658, 3900), mcX: 658, mcZ: 3900, order : 8, lineType : "solid" }, { name: "48", type: "녹", color: "#2ecc71", coords: mcToPx(-2121, -3837), mcX: -2121, mcZ: -3837, order : 15, lineType : "dotted" }, { name: "49", type: "청", color: "#3498db", coords: mcToPx(4886, 954), mcX: 4886, mcZ: 954, order : 12, lineType : "solid" }, { name: "50", type: "청", color: "#3498db", coords: mcToPx(4942, -1189), mcX: 4942, mcZ: -1189, order : 13, lineType : "solid" }, 
    { name: "51", type: "황", color: "#f1c40f", coords: mcToPx(677, 1433), mcX: 677, mcZ: 1433, order : 10, lineType : "dotted" }, { name: "52", type: "녹", color: "#2ecc71", coords: mcToPx(-762, -6601), mcX: -762, mcZ: -6601, order : 18, lineType : "solid" }, { name: "53", type: "녹", color: "#2ecc71", coords: mcToPx(2657, -5891), mcX: 2657, mcZ: -5891, order : 21, lineType : "dotted" }, { name: "54", type: "녹", color: "#2ecc71", coords: mcToPx(2036, -3624), mcX: 2036, mcZ: -3624, order : 6, lineType : "solid" }, { name: "55", type: "청", color: "#3498db", coords: mcToPx(-4098, -55), mcX: -4098, mcZ: -55, order : 2, lineType : "solid" }, { name: "56", type: "녹", color: "#2ecc71", coords: mcToPx(-2006, 127), mcX: -2006, mcZ: 127, order : 23, lineType : "solid" }, { name: "57", type: "녹", color: "#2ecc71", coords: mcToPx(-2264, -1571), mcX: -2264, mcZ: -1571, order : 13, lineType : "solid" }, { name: "58", type: "녹", color: "#2ecc71", coords: mcToPx(3885, -1415), mcX: 3885, mcZ: -1415, order : 3, lineType : "solid" }, { name: "59", type: "청", color: "#3498db", coords: mcToPx(-5054, -2598), mcX: -5054, mcZ: -2598, order : 3, lineType : "solid" }, { name: "60", type: "적", color: "#e74c3c", coords: mcToPx(3323, 3939), mcX: 3323, mcZ: 3939, order : 4, lineType : "solid" }, 
    { name: "61", type: "적", color: "#e74c3c", coords: mcToPx(5258, 5723), mcX: 5258, mcZ: 5723, order : 9, lineType : "solid" }, { name: "62", type: "녹", color: "#2ecc71", coords: mcToPx(1014, -2648), mcX: 1014, mcZ: -2648, order : 7, lineType : "solid" }, { name: "63", type: "황", color: "#f1c40f", coords: mcToPx(2705, 2461), mcX: 2705, mcZ: 2461, order : 11, lineType : "dotted" }, { name: "64", type: "황", color: "#f1c40f", coords: mcToPx(-4029, 2321), mcX: -4029, mcZ: 2321, order : 2, lineType : "solid" }, { name: "65", type: "황", color: "#f1c40f", coords: mcToPx(-790, 4284), mcX: -790, mcZ: 4284, order : 7, lineType : "solid" } 
]; 

/** 4. 약초 데이터 **/
const herbData = [
    { name: "홍련(초)업화", file: "hub19.png", coords: mcToPx(-7519, 821), mcX: -7519, mcZ: 821 },
    { name: "민들레", file: "hub4.png", coords: mcToPx(-3128, -5376), mcX: -3128, mcZ: -5376 },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6306, 4265), mcX: 6306, mcZ: 4265 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5603, 1222), mcX: 5603, mcZ: 1222 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5735, 819), mcX: 5735, mcZ: 819 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5692, 827), mcX: 5692, mcZ: 827 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5775, 1081), mcX: 5775, mcZ: 1081 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5840, 1203), mcX: 5840, mcZ: 1203 },
    { name: "권엽", file: "hub1.png", coords: mcToPx(-4500, -700), mcX: -4500, mcZ: -700 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(6180, -1724), mcX: 6180, mcZ: -1724 },
    { name: "흑성과", file: "hub14.png", coords: mcToPx(-1671, -3534), mcX: -1671, mcZ: -3534 },
    { name: "권엽", file: "hub1.png", coords: mcToPx(-4386, 142), mcX: -4386, mcZ: 142 },
    { name: "민들레", file: "hub4.png", coords: mcToPx(1352, -6136), mcX: 1352, mcZ: -6136 },
    { name: "생강", file: "hub6.png", coords: mcToPx(1485, 3133), mcX: 1485, mcZ: 3133 },
    { name: "생강", file: "hub6.png", coords: mcToPx(1248, 5784), mcX: 1248, mcZ: 5784 },
    { name: "인삼", file: "hub10.png", coords: mcToPx(-4705, 765), mcX: -4705, mcZ: 765 },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(4800, 3752), mcX: 4800, mcZ: 3752 },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(-1323, -588), mcX: -1323, mcZ: -588 },
    { name: "황초", file: "hub13.png", coords: mcToPx(3348, -4641), mcX: 3348, mcZ: -4641 },
    { name: "녹태", file: "hub3.png", coords: mcToPx(1110, -2830), mcX: 1110, mcZ: -2830 },
    { name: "황초", file: "hub13.png", coords: mcToPx(-4168, -4856), mcX: -4168, mcZ: -4856 },
    { name: "황초", file: "hub13.png", coords: mcToPx(-1444, -298), mcX: -1444, mcZ: -298 },
    { name: "흑성과", file: "hub14.png", coords: mcToPx(1545, -186), mcX: 1545, mcZ: -186 },
    { name: "철목영지", file: "hub16.png", coords: mcToPx(-3901, 2699), mcX: -3901, mcZ: 2699 },
    { name: "철목영지", file: "hub16.png", coords: mcToPx(-2805, 2548), mcX: -2805, mcZ: 2548 },
    { name: "적주과", file: "hub12.png", coords: mcToPx(344, 2102), mcX: 344, mcZ: 2102 },
    { name: "적주과", file: "hub12.png", coords: mcToPx(-3944, 1272), mcX: -3944, mcZ: 1272 },
    { name: "적주과", file: "hub12.png", coords: mcToPx(-975, 766), mcX: -975, mcZ: 766 },
    { name: "자운초", file: "hub11.png", coords: mcToPx(2744, 4672), mcX: 2744, mcZ: 4672 },
    { name: "자운초", file: "hub11.png", coords: mcToPx(4034, 4340), mcX: 4034, mcZ: 4340 },
    { name: "인삼", file: "hub10.png", coords: mcToPx(1500, 4200), mcX: 1500, mcZ: 4200 },
    { name: "월계엽", file: "hub15.png", coords: mcToPx(-1622, -6433), mcX: -1622, mcZ: -6433 },
    { name: "월계엽", file: "hub15.png", coords: mcToPx(191, -6387), mcX: 191, mcZ: -6387 },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6408, 4024), mcX: 6408, mcZ: 4024 },
    { name: "옥향초", file: "hub9.png", coords: mcToPx(6438, 4437), mcX: 6438, mcZ: 4437 },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(-3702, -2388), mcX: -3702, mcZ: -2388 },
    { name: "옥취엽", file: "hub8.png", coords: mcToPx(882, -2274), mcX: 882, mcZ: -2274 },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(-4568, -3959), mcX: -4568, mcZ: -3959 },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(768, 5056), mcX: 768, mcZ: 5056 },
    { name: "영군버섯", file: "hub7.png", coords: mcToPx(-1712, -6379), mcX: -1712, mcZ: -6379 },
    { name: "백향초", file: "hub5.png", coords: mcToPx(-5488, 4162), mcX: -5488, mcZ: 4162 },
    { name: "생강", file: "hub6.png", coords: mcToPx(-4656, 2024), mcX: -4656, mcZ: 2024 },
    { name: "빙백설화", file: "hub18.png", coords: mcToPx(5923, 1509), mcX: 5923, mcZ: 1509 },
    { name: "민들레", file: "hub4.png", coords: mcToPx(-3006, -5033), mcX: -3006, mcZ: -5033 },
    { name: "녹태", file: "hub3.png", coords: mcToPx(-2176, -187), mcX: -2176, mcZ: -187 },
    { name: "녹태", file: "hub3.png", coords: mcToPx(-285, -1059), mcX: -285, mcZ: -1059 },
    { name: "금향과", file: "hub17.png", coords: mcToPx(-772, 1917), mcX: -772, mcZ: 1917 },
    { name: "금양광초", file: "hub2.png", coords: mcToPx(3633, 1015), mcX: 3633, mcZ: 1015 },
    { name: "금양광초", file: "hub2.png", coords: mcToPx(3070, 2541), mcX: 3070, mcZ: 2541 }
];

const herbColors = { 
    "홍련초": "#FF1493", "빙백설화": "#3498db", "철목영지": "#e67e22", 
    "월계엽": "#2ecc71", "금향과": "#f1c40f", "녹태": "#16a085", 
    "황초": "#f39c12", "적주과": "#e74c3c", "옥취엽": "#d35400", 
    "옥향초": "#8e44ad", "인삼": "#c0392b", "자운초": "#9b59b6", 
    "생강": "#7f8c8d", "민들레": "#e67e22", "영군버섯": "#2980b9", 
    "금양광초": "#f1c40f", "권엽": "#27ae60", "흑성과": "#2c3e50", "백향초": "#ecf0f1" 
};

/** 5. 십이간지 데이터 **/
const zodiacData = [ { name: "2.소", x: -616, z: 3889 }, { name: "10.닭", x: 5075, z: -344 }, { name: "4.토끼", x: 4590, z: -3397 }, { name: "6.뱀", x: 2685, z: -4051 }, { name: "12.돼지", x: -3657, z: 1112 }, { name: "11.개", x: -4455, z: -2376 }, { name: "7.말", x: -2365, z: 3968 }, { name: "9.원숭이", x: 3280, z: 2952 }, { name: "8.양", x: 5093, z: 2092 }, { name: "3.호랑이", x: -5500, z: -1600 }, { name: "5.용", x: -891, z: -536 }, { name: "1.쥐", x: -2900, z: -4600 } ];

/** 6. 사냥터 데이터 **/
const huntingInfo = [ // huntingInfo 배열 내 수정
{ 
    name: "혈교지",  lv: "100", monsters: "혈교도", file: "map17.png",  x: -3979, y: 80, z: 2501, center: mcToPx(-3979, 2501) }, { name: "화검문",  lv: "???", monsters: "봉원숭이, 곤봉원숭이, 화검문포탈", file: "map16.png", x: -3392, y: 81, z: -1819, center: mcToPx(-3392, -1819) }, { name: "경작지", lv: "0~5", monsters: "참새(Lv.0), 허수아비(Lv.5)", file: "map2.png", center: mcToPx(-954, -666) }, { name: "화수원", lv: "10~20", monsters: "다람쥐(Lv.10), 흙토끼(Lv.15), 백토끼(Lv.20)", file: "map3.png", center: mcToPx(-586, 446) }, { name: "괴암곡", lv: "25~35", monsters: "하급쥐(Lv.25), 중급쥐(Lv.30), 상급쥐(Lv.35)<br><span style='color:#e67e22;'>*정예쥐 출현</span>", file: "map4.png", center: mcToPx(1320, -1598) }, { name: "멸문", lv: "40~50", monsters: "뱀(Lv.40), 청사(Lv.45), 적사(Lv.50)<br><span style='color:#e67e22;'>*구렁이 출현</span></br><br><span style='color:#a29bfe;'>[히든]뱀의영기</br>", file: "map5.png", center: mcToPx(3862, -2644) }, { name: "신선원", lv: "55~65", monsters: "새싹삼(Lv.55), 진삼(Lv.60), 대장삼(Lv.65)<br><span style='color:#e67e22;'>*거대삼 출현</span>", file: "map6.png", center: mcToPx(-3628, -3094) }, { name: "천웅성", lv: "70~80", monsters: "비웅(Lv.70), 겸웅(Lv.75), 꼬마유령(Lv.80)", file: "map7.png", center: mcToPx(5700, 5198) }, { name: "매화곡", lv: "85~90", monsters: "천도원숭이(Lv.85), 황도원숭이(Lv.90)", file: "map8.png", center: mcToPx(4256, 392) }, { name: "이매궁", lv: "100~110", monsters: "도깨비(Lv.100), 청깨비(Lv.105), 진깨비(Lv.110)", file: "map9.png", center: mcToPx(1634, 336) }, { name: "검성지묘", lv: "115~125", monsters: "강암수호(Lv.115), 새끼암갑수(Lv.120), 암갑수(Lv.125)", file: "map10.png", center: mcToPx(-5436, -802) }, { name: "빙설곡", lv: "130~140", monsters: "백랑(Lv.130), 적호(Lv.135), 백호(Lv.140)", file: "map11.png", center: mcToPx(6784, -2500) }, { name: "빙궁", lv: "145~155", monsters: "빙궁조(Lv.145), 빙궁병(Lv.150), 북해신녀(Lv.155)", file: "map12.png", center: mcToPx(6572, 948) }, { name: "협사곡", lv: "160~170", monsters: "산적(Lv.160), 산적궁수(Lv.165), 멧돼지산적(Lv.170)", file: "map13.png", center: mcToPx(-282, 4318) }, { name: "황야성", lv: "175~185", monsters: "토석병(Lv.175), 토석군(Lv.180), 토석궁사(Lv.185)", file: "map14.png", center: mcToPx(-2080, 1996) }, { name: "운해궁", lv: "만렙", monsters: "최종구역", file: "map15.png", center: mcToPx(-1422, 5612) } ];

/** 7. 광산 상세 정보 데이터 **/
const mineDetailInfo = {
    "공통": "(돌덩어리, 철광석, 적동석, 광산초)",
    "녹": { 
        title: "녹색광산", 
        unique: "갈옥 / 신선옥 / 정철광 / 청연광",
        route: "33-23-58-8-26-54-62-9-6-2-1-3-57-4-48-39-31-52-32-34-53-7-56-5",
        desc: "23, 58 (멸문 사냥터), 62, 9, 6 (괴암곡/이매궁 사냥터), 1, 2, 3 (경작지 사냥터)"
    },
    "청": { 
        title: "청색광산", 
        unique: "청강석 / 현철 / 한철 / 빙옥",
        route: "22-55-59-37-10-36-35-21-16-14-15-49-50-24",
        desc: "10 (신선원 사냥터), 16, 14 (빙설곡 사냥터), 15 (빙궁 사냥터)"
    },
    "황": { 
        title: "황색광산", 
        unique: "오철 / 금강석 / 정철광",
        route: "29-64-13-43-12-44-65-47-11-51-63-28",
        desc: "47, 65 (협사곡 사냥터), 12, 43 (황야성 사냥터)"
    },
    "적": { 
        title: "적색광산", 
        unique: "매화옥 / 묵철 / 흑옥 / 청연광",
        route: "41-40-25-60-46-17-18-42-61-30-45-19-27-20-38",
        desc: "30, 61 (천웅성 사냥터)"
    }
        };

/** 8. 탐색 데이터 **/
var discoveryData = [
    { name: "항아리", x: -713, y: 156, z: 2862, item: "고목조각", tool: "탐색부적" },
    { name: "항아리", x: -1758, y: 243, z: -838, item: "송진덩어리", tool: "탐색부적" },
    { name: "항아리", x: 2179, y: 117, z: -529, item: "향목가루", tool: "탐령구" },
    { name: "항아리", x: 5878, y: 154, z: 1155, item: "깨진옥조각", tool: "탐색부적" },
    { name: "항아리", x: -5333, y: 155, z: 673, item: "깨진기와", tool: "탐색부적" },
    { name: "항아리", x: -3784, y: 125, z: -1670, item: "낡은목간", tool: "탐색부적" },
    { name: "항아리", x: -3313, y: 123, z: 3169, item: "청동파편", tool: "탐령구" },
    { name: "항아리", x: 720, y: 150, z: 1800, item: "녹슨철패", tool: "탐령구" },
    { name: "항아리", x: 6426, y: 112, z: 2392, item: "연마사", tool: "탐령구" },
     { name: "항아리", x: -7368, y: 88, z: 1546, item: "잔존영석", tool: "탐령구" },
    { name: "항아리", x: 7268, y: 65, z: 5300, item: "봉인된철편", tool: "탐령구" },
    { name: "항아리", x: 4171, y: 74, z: 2643, item: "마모된인장", tool: "탐령구" }
];

/** 9. 적환단 데이터 **/
var redHwanData = [
    { name: "1. 적환단", x: -3656, y: 78, z: 4060, file: "red1.png" },
    { name: "2. 적환단", x: -1458, y: 94, z: 2875, file: "red2.png" },
    { name: "3. 적환단", x: 2358, y: 100, z: 2177, file: "red3.png" },
    { name: "4. 적환단", x: 2661, y: 72, z: -4790, file: "red4.png" },
    { name: "5. 적환단", x: 1961, y: 150, z: -6200, file: "red5.png" },
    { name: "6. 적환단", x: -2579, y: 87, z: -5970, file: "red6.png" },
    { name: "7. 적환단", x: -3375, y: 100, z: 3449, file: "red7.png" }
];

/** 10. NPC 데이터 **/
var npcData = [
    { name: "해진(lv.50)", x: -4311, z: 5831, relation: "<span style='color:#a29bfe;'>[히든]해적선퀘스트1</span><br>해진>해적선>해진>백향초재배지>해진</br>", file: "haejin.png" },
    { name: "해적선(lv.50)", x: -3619, z: 4060, relation: "<span style='color:#a29bfe;'>[히든]해적선퀘스트2(포탈입장-훔친백향초)</span>", file: "boat.png" },
    { name: "백향초재배지", x: -5488, z: 4162, relation: "<span style='color:#a29bfe;'>[히든]해적선퀘스트3(수상한포탈)</span>", file: "door.png" },
    { name: "점소이", x: -2538, z: -5994, relation: "", file: "jumsoi.png" },
    { name: "주루대주", x: -2545, z: -6020, relation: "", file: "juru.png" },
    { name: "자운스님", x: -4366, z: 1394, relation: "<span style='color:#a29bfe;'>*[히든]상단주3(향목가루5개)</span><br>해무사퀘스트</br>", file: "jaun.png" },
     { name: "조사중인스님", x: 392, z: -1518, relation: "", file: "josa.png" },
    { name: "풍잔객", x: 3039, z: 4235, relation: "사도연퀘스트", file: "pung.png" },
    { name: "기록서", x: 1539, z: 4654, relation: "사도연퀘스트", file: "memo.png" },
    { name: "시녀(lv.50)", x: -6535, z: -2577, relation: "해무사퀘스트:연운객을 기다리는 사람", file: "girl.png" },
    { name: "몰락한소가주(lv.73)", x: 3138, z: -2582, relation: "<span style='color:#ff0000;'>무인의거처(2층침대클릭시 힘+1)</span>", file: "sogaju.png" },
    { name: "도공", x: -4786, z: 1442, relation: "<span style='color:#a29bfe;'>[히든]호리병을찾아서2(무괴철1개,자금3개)</span>", file: "dogong.png" },
    { name: "도사", x: -1290, z: -591, relation: "<span style='color:#a29bfe;'>[히든]십이지신<br>[히든]호리병을찾아서1</span></br><br>도사>도공>멸문대(수상한포탈)>도사", file: "dosa.png" },
    { name: "명인대장장이", x: -7051, z: -727, relation: "", file: "mungin.png" },
    { name: "망한대장장이", x: 5369, z: -3462, relation: "", file: "mang.png" },
    { name: "심마니(lv.90)", x: -3485, z: -1949, relation: "", file: "simmani.png" },
    { name: "감시관(lv.67)", x: 5176, z: 4585, relation: "필요아이템<br>*사보도1개,철3개,무공정수10개</br>", file: "gamsi.png" },
    { name: "척후병(lv.100)", x: -3963, z: 2612, relation: "", file: "scout.png" },
    { name: "해무사승려(lv.50)", x: -5728, z: 3441, relation: "해무사퀘스트:기록서확인(1~6)<br>연운객-시녀-연운객</br>", file: "haemusa.png" },
    { name: "연운객(lv.50)", x: -5656, z: 3266, relation: "해무사퀘스트:기록서확인(1~6)<br>연운객-시녀-연운객</br>", file: "yeonun.png" },
    { name: "상단주(lv.50)", x: -3260, z: -4290, relation: "<span style='color:#a29bfe;'>*[히든]상단주1</span><br>상단주>부숴진마차>자운스님>상단주</br>", file: "owner.png" },
    { name: "부숴진마차(lv.50)", x: -2706, z: -2372, relation: "<span style='color:#ff4757;'><span style='color:#a29bfe;'>*[히든]상단주2</span>", file: "macha.png" },
    { name: "탐령구제작", x: -2076, z: 425, relation: "철1개, 적동괴2개", file: "gu.png" },
    { name: "정청주제작", x: 2034, z: 3265, relation: "철1개, 적동괴2개, 송진덩어리1개", file: "jungju.png" }
];

/** 11. 상자 데이터 **/
var mysteryBoxData = [
    { name: "의문의 상자", x: 3068, y: 172, z: 6312 },
    { name: "의문의 상자", x: 5107, y: 211, z: -1998 },
    { name: "의문의 상자", x: 2985, y: 179, z: -980 },
    { name: "의문의 상자", x: -1420, y: 128, z: -4655 },
    { name: "의문의 상자", x: 2984, y: 181, z: -975 },
    { name: "의문의 상자", x: -1852, y: 143, z: 4290 },
    { name: "의문의 상자", x: 7049, y: 142, z: 2874, relation: "고급주문서뽑기" },
    { name: "의문의 상자", x: 1124, y: 258, z: 1498, relation: "일반부적뽑기"},
    { name: "의문의 상자", x: -3979, y: 80, z: 2501, relation: "<span style='color:#ff0000;'>상자3개있음</span>"}
];
