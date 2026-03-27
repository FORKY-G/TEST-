/** 1. 좌표 변환 함수 **/
const mcToPx = (mcX, mcZ) => {
    var mcSpawnPxX = 3218, mcSpawnPxY = 2874;
    var mcSpawnCoordX = -971, mcSpawnCoordZ = -965;
    var scale = 7300 / 16384; 
    return [-(mcSpawnPxY + (mcZ - mcSpawnCoordZ) * scale), mcSpawnPxX + (mcX - mcSpawnCoordX) * scale]; 
};

/** 2. 산(비석) 데이터 **/
const mountainData = [{ name: "천보산", x: -2030, z: -4142 }, { name: "망운산", x: -2662, z: -1556 }, { name: "신운산", x: -2984, z: 72 }, { name: "봉래산", x: -5278, z: -2042 }, { name: "사성산", x: 4356, z: 3515 }, { name: "용문산", x: 5378, z: 3731 }, { name: "도덕산", x: 6498, z: 67 }, { name: "삼악산", x: 5917, z: 2453 }];

/** 3. 광산 및 포인트 데이터 **/
const poiData = [ 
    { name: "스폰", type: "스폰", color: "#333", coords: mcToPx(-971, -965), mcX: -971, mcZ: -965 }, 
    { name: "1", type: "녹", color: "#2ecc71", coords: mcToPx(-1093, -701), mcX: -1093, mcZ: -701 }, { name: "2", type: "녹", color: "#2ecc71", coords: mcToPx(-1038, -14), mcX: -1038, mcZ: -14 }, { name: "3", type: "녹", color: "#2ecc71", coords: mcToPx(-1837, -944), mcX: -1837, mcZ: -944 }, { name: "4", type: "녹", color: "#2ecc71", coords: mcToPx(-2599, -2691), mcX: -2599, mcZ: -2691 }, { name: "5", type: "녹", color: "#2ecc71", coords: mcToPx(-4001, -1579), mcX: -4001, mcZ: -1579 }, { name: "6", type: "녹", color: "#2ecc71", coords: mcToPx(1085, 199), mcX: 1085, mcZ: 199 }, { name: "7", type: "녹", color: "#2ecc71", coords: mcToPx(-775, -1986), mcX: -775, mcZ: -1986 }, { name: "8", type: "녹", color: "#2ecc71", coords: mcToPx(2605, -1142), mcX: 2605, mcZ: -1142 }, { name: "9", type: "녹", color: "#2ecc71", coords: mcToPx(752, -1272), mcX: 752, mcZ: -1272 }, 
    { name: "10", type: "청", color: "#3498db", coords: mcToPx(-4322, -2810), mcX: -4322, mcZ: -2810 }, { name: "11", type: "황", color: "#f1c40f", coords: mcToPx(815, 2558), mcX: 815, mcZ: 2558 }, { name: "12", type: "황", color: "#f1c40f", coords: mcToPx(-1913, 3153), mcX: -1913, mcZ: 3153 }, { name: "13", type: "황", color: "#f1c40f", coords: mcToPx(-3094, 855), mcX: -3094, mcZ: 855 }, { name: "14", type: "청", color: "#3498db", coords: mcToPx(7137, -1668), mcX: 7137, mcZ: -1668 }, { name: "15", type: "청", color: "#3498db", coords: mcToPx(6123, 486), mcX: 6123, mcZ: 486 }, { name: "16", type: "청", color: "#3498db", coords: mcToPx(5709, -3342), mcX: 5709, mcZ: -3342 }, { name: "17", type: "적", color: "#e74c3c", coords: mcToPx(3806, 5436), mcX: 3806, mcZ: 5436 }, { name: "18", type: "적", color: "#e74c3c", coords: mcToPx(3542, 6378), mcX: 3542, mcZ: 6378 }, { name: "19", type: "적", color: "#e74c3c", coords: mcToPx(-6250, 2367), mcX: -6250, mcZ: 2367 }, { name: "20", type: "적", color: "#e74c3c", coords: mcToPx(-7547, 623), mcX: -7547, mcZ: 623 }, 
    { name: "21", type: "청", color: "#3498db", coords: mcToPx(-2854, -5529), mcX: -2854, mcZ: -5529 }, { name: "22", type: "청", color: "#3498db", coords: mcToPx(-5186, 1256), mcX: -5186, mcZ: 1256 }, { name: "23", type: "녹", color: "#2ecc71", coords: mcToPx(4301, -3381), mcX: 4301, mcZ: -3381 }, { name: "24", type: "청", color: "#3498db", coords: mcToPx(5584, 3322), mcX: 5584, mcZ: 3322 }, { name: "25", type: "적", color: "#e74c3c", coords: mcToPx(1998, 4657), mcX: 1998, mcZ: 4657 }, { name: "26", type: "녹", color: "#2ecc71", coords: mcToPx(2201, -2740), mcX: 2201, mcZ: -2740 }, { name: "27", type: "적", color: "#e74c3c", coords: mcToPx(-6540, 516), mcX: -6540, mcZ: 516 }, { name: "28", type: "황", color: "#f1c40f", coords: mcToPx(3701, 2080), mcX: 3701, mcZ: 2080 }, { name: "29", type: "황", color: "#f1c40f", coords: mcToPx(-4084, 3035), mcX: -4084, mcZ: 3035 }, { name: "30", type: "적", color: "#e74c3c", coords: mcToPx(6217, 4562), mcX: 6217, mcZ: 4562 }, 
    { name: "31", type: "녹", color: "#2ecc71", coords: mcToPx(-563, -6176), mcX: -563, mcZ: -6176 }, { name: "32", type: "녹", color: "#2ecc71", coords: mcToPx(1472, -6472), mcX: 1472, mcZ: -6472 }, { name: "33", type: "녹", color: "#2ecc71", coords: mcToPx(4214, -4596), mcX: 4214, mcZ: -4596 }, { name: "34", type: "녹", color: "#2ecc71", coords: mcToPx(1941, -5632), mcX: 1941, mcZ: -5632 }, { name: "35", type: "청", color: "#3498db", coords: mcToPx(-4657, -4523), mcX: -4657, mcZ: -4523 }, { name: "36", type: "청", color: "#3498db", coords: mcToPx(-4830, -4303), mcX: -4830, mcZ: -4303 }, { name: "37", type: "청", color: "#3498db", coords: mcToPx(-5480, -1720), mcX: -5480, mcZ: -1720 }, { name: "38", type: "적", color: "#e74c3c", coords: mcToPx(-6696, -1145), mcX: -6696, mcZ: -1145 }, { name: "39", type: "녹", color: "#2ecc71", coords: mcToPx(-559, -4593), mcX: -559, mcZ: -4593 }, { name: "40", type: "적", color: "#e74c3c", coords: mcToPx(1487, 5300), mcX: 1487, mcZ: 5300 }, 
    { name: "41", type: "적", color: "#e74c3c", coords: mcToPx(1601, 5485), mcX: 1601, mcZ: 5485 }, { name: "42", type: "적", color: "#e74c3c", coords: mcToPx(2129, 6598), mcX: 2129, mcZ: 6598 }, { name: "43", type: "황", color: "#f1c40f", coords: mcToPx(-960, 2033), mcX: -960, mcZ: 2033 }, { name: "44", type: "황", color: "#f1c40f", coords: mcToPx(-2468, 4433), mcX: -2468, mcZ: 4433 }, { name: "45", type: "적", color: "#e74c3c", coords: mcToPx(-5443, 4139), mcX: -5443, mcZ: 4139 }, { name: "46", type: "적", color: "#e74c3c", coords: mcToPx(4024, 3356), mcX: 4024, mcZ: 3356 }, { name: "47", type: "황", color: "#f1c40f", coords: mcToPx(658, 3900), mcX: 658, mcZ: 3900 }, { name: "48", type: "녹", color: "#2ecc71", coords: mcToPx(-2121, -3837), mcX: -2121, mcZ: -3837 }, { name: "49", type: "청", color: "#3498db", coords: mcToPx(4886, 954), mcX: 4886, mcZ: 954 }, { name: "50", type: "청", color: "#3498db", coords: mcToPx(4942, -1189), mcX: 4942, mcZ: -1189 }, 
    { name: "51", type: "황", color: "#f1c40f", coords: mcToPx(677, 1433), mcX: 677, mcZ: 1433 }, { name: "52", type: "녹", color: "#2ecc71", coords: mcToPx(-762, -6601), mcX: -762, mcZ: -6601 }, { name: "53", type: "녹", color: "#2ecc71", coords: mcToPx(2657, -5891), mcX: 2657, mcZ: -5891 }, { name: "54", type: "녹", color: "#2ecc71", coords: mcToPx(2036, -3624), mcX: 2036, mcZ: -3624 }, { name: "55", type: "청", color: "#3498db", coords: mcToPx(-4098, -55), mcX: -4098, mcZ: -55 }, { name: "56", type: "녹", color: "#2ecc71", coords: mcToPx(-2006, 127), mcX: -2006, mcZ: 127 }, { name: "57", type: "녹", color: "#2ecc71", coords: mcToPx(-2264, -1571), mcX: -2264, mcZ: -1571 }, { name: "58", type: "녹", color: "#2ecc71", coords: mcToPx(3885, -1415), mcX: 3885, mcZ: -1415 }, { name: "59", type: "청", color: "#3498db", coords: mcToPx(-5054, -2598), mcX: -5054, mcZ: -2598 }, { name: "60", type: "적", color: "#e74c3c", coords: mcToPx(3323, 3939), mcX: 3323, mcZ: 3939 }, 
    { name: "61", type: "적", color: "#e74c3c", coords: mcToPx(5258, 5723), mcX: 5258, mcZ: 5723 }, { name: "62", type: "녹", color: "#2ecc71", coords: mcToPx(1014, -2648), mcX: 1014, mcZ: -2648 }, { name: "63", type: "황", color: "#f1c40f", coords: mcToPx(2705, 2461), mcX: 2705, mcZ: 2461 }, { name: "64", type: "황", color: "#f1c40f", coords: mcToPx(-4029, 2321), mcX: -4029, mcZ: 2321 }, { name: "65", type: "황", color: "#f1c40f", coords: mcToPx(-790, 4284), mcX: -790, mcZ: 4284 } 
];

/** 4. 약초 데이터 **/
const herbData = [
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

const herbColors = { "빙백설화": "#3498db", "철목영지": "#e67e22", "월계엽": "#2ecc71", "금향과": "#f1c40f", "녹태": "#16a085", "황초": "#f39c12", "적주과": "#e74c3c", "옥취엽": "#d35400", "옥향초": "#8e44ad", "인삼": "#c0392b", "자운초": "#9b59b6", "생강": "#7f8c8d", "민들레": "#e67e22", "영군버섯": "#2980b9", "금양광초": "#f1c40f", "권엽": "#27ae60", "흑성과": "#2c3e50", "백향초": "#ecf0f1" };

/** 5. 십이간지 데이터 **/
const zodiacData = [ { name: "소", x: -616, z: 3889 }, { name: "닭", x: 5075, z: -344 }, { name: "토끼", x: 4590, z: -3397 }, { name: "뱀", x: 2685, z: -4051 }, { name: "돼지", x: -3657, z: 1112 }, { name: "개", x: -4455, z: -2376 }, { name: "말", x: -2365, z: 3968 }, { name: "원숭이", x: 3280, z: 2952 }, { name: "양", x: 5093, z: 2092 }, { name: "호랑이", x: -5500, z: -1600 }, { name: "용", x: -891, z: -536 }, { name: "쥐", x: -2900, z: -4600 } ];

/** 6. 사냥터 데이터 **/
const huntingInfo = [ { name: "경작지", lv: "0~5", monsters: "참새(Lv.0), 허수아비(Lv.5)", file: "map2.png", center: mcToPx(-954, -666) }, { name: "화수원", lv: "10~20", monsters: "다람쥐(Lv.10), 흙토끼(Lv.15), 백토끼(Lv.20)", file: "map3.png", center: mcToPx(-586, 446) }, { name: "괴암곡", lv: "25~35", monsters: "하급쥐(Lv.25), 중급쥐(Lv.30), 상급쥐(Lv.35)<br><span style='color:#e67e22;'>*정예쥐 출현</span>", file: "map4.png", center: mcToPx(1320, -1598) }, { name: "멸문", lv: "40~50", monsters: "뱀(Lv.40), 청사(Lv.45), 적사(Lv.50)<br><span style='color:#e67e22;'>*구렁이 출현</span>", file: "map5.png", center: mcToPx(3862, -2644) }, { name: "신선원", lv: "55~65", monsters: "새싹삼(Lv.55), 진삼(Lv.60), 대장삼(Lv.65)<br><span style='color:#e67e22;'>*거대삼 출현</span>", file: "map6.png", center: mcToPx(-3628, -3094) }, { name: "천웅성", lv: "70~80", monsters: "비웅(Lv.70), 겸웅(Lv.75), 꼬마유령(Lv.80)", file: "map7.png", center: mcToPx(5700, 5198) }, { name: "매화곡", lv: "85~90", monsters: "천도원숭이(Lv.85), 황도원숭이(Lv.90)", file: "map8.png", center: mcToPx(4256, 392) }, { name: "이매궁", lv: "100~110", monsters: "도깨비(Lv.100), 청깨비(Lv.105), 진깨비(Lv.110)", file: "map9.png", center: mcToPx(1634, 336) }, { name: "검성지묘", lv: "115~125", monsters: "강암수호(Lv.115), 새끼암갑수(Lv.120), 암갑수(Lv.125)", file: "map10.png", center: mcToPx(-5436, -802) }, { name: "빙설곡", lv: "130~140", monsters: "백랑(Lv.130), 적호(Lv.135), 백호(Lv.140)", file: "map11.png", center: mcToPx(6784, -2500) }, { name: "빙궁", lv: "145~155", monsters: "빙궁조(Lv.145), 빙궁병(Lv.150), 북해신녀(Lv.155)", file: "map12.png", center: mcToPx(6572, 948) }, { name: "협사곡", lv: "160~170", monsters: "산적(Lv.160), 산적궁수(Lv.165), 멧돼지산적(Lv.170)", file: "map13.png", center: mcToPx(-282, 4318) }, { name: "황야성", lv: "175~185", monsters: "토석병(Lv.175), 토석군(Lv.180), 토석궁사(Lv.185)", file: "map14.png", center: mcToPx(-2080, 1996) }, { name: "운해궁", lv: "만렙", monsters: "최종구역", file: "map15.png", center: mcToPx(-1422, 5612) } ];
