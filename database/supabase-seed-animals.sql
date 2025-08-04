-- 동물 데이터 시드
-- Kid Text Battle의 모든 동물 데이터

-- 현재 동물들 (Current Animals)
INSERT INTO animals (emoji, name, english_name, type, description, strength, speed, intelligence) VALUES
  ('🦁', '사자', 'Lion', 'current', '용맹한 백수의 왕', 90, 70, 60),
  ('🐘', '코끼리', 'Elephant', 'current', '지혜로운 거대한 포유류', 95, 30, 80),
  ('🐧', '펭귄', 'Penguin', 'current', '귀여운 남극의 신사', 20, 40, 50),
  ('🐬', '돌고래', 'Dolphin', 'current', '영리한 바다의 친구', 60, 85, 90),
  ('🐅', '호랑이', 'Tiger', 'current', '용맹한 정글의 왕', 85, 75, 65),
  ('🐼', '판다', 'Panda', 'current', '귀여운 대나무 애호가', 70, 30, 55),
  ('🦅', '독수리', 'Eagle', 'current', '하늘의 제왕', 75, 90, 70),
  ('🦒', '기린', 'Giraffe', 'current', '목이 긴 초원의 거인', 60, 65, 50),
  ('🦓', '얼룩말', 'Zebra', 'current', '줄무늬 패션의 달인', 50, 80, 55),
  ('🦘', '캥거루', 'Kangaroo', 'current', '주머니를 가진 점프 선수', 75, 85, 45),
  ('🐵', '원숭이', 'Monkey', 'current', '재빠른 나무 타기 선수', 55, 80, 75),
  ('🐻', '곰', 'Bear', 'current', '힘센 숲의 왕', 90, 50, 60),
  ('🐺', '늑대', 'Wolf', 'current', '무리를 이루는 사냥꾼', 70, 85, 70),
  ('🦊', '여우', 'Fox', 'current', '영리한 숲의 요정', 45, 75, 85),
  ('🐰', '토끼', 'Rabbit', 'current', '귀여운 점프 선수', 20, 85, 40),
  ('🐢', '거북이', 'Turtle', 'current', '느리지만 단단한 친구', 30, 10, 65),
  ('🐙', '문어', 'Octopus', 'current', '8개의 팔을 가진 천재', 60, 70, 95),
  ('🐋', '고래', 'Whale', 'current', '바다의 거인', 100, 60, 70),
  ('🦈', '상어', 'Shark', 'current', '바다의 포식자', 85, 90, 50),
  ('🐊', '악어', 'Crocodile', 'current', '강력한 턱을 가진 포식자', 80, 60, 45),
  ('🦛', '하마', 'Hippo', 'current', '물을 좋아하는 거구', 85, 40, 40),
  ('🦏', '코뿔소', 'Rhino', 'current', '뿔을 가진 전차', 90, 65, 35),
  ('🐪', '낙타', 'Camel', 'current', '사막의 배', 60, 55, 60),
  ('🦙', '라마', 'Llama', 'current', '침을 뱉는 귀요미', 40, 60, 50),
  ('🐨', '코알라', 'Koala', 'current', '유칼립투스를 좋아하는 나무늘보', 30, 20, 40),
  ('🦥', '나무늘보', 'Sloth', 'current', '세상에서 가장 느린 동물', 25, 5, 50),
  ('🦦', '수달', 'Otter', 'current', '물놀이를 좋아하는 장난꾸러기', 40, 70, 80),
  ('🦫', '비버', 'Beaver', 'current', '댐을 짓는 건축가', 50, 50, 85),
  ('🦔', '고슴도치', 'Hedgehog', 'current', '가시를 가진 귀요미', 30, 60, 65),
  ('🦇', '박쥐', 'Bat', 'current', '밤하늘의 비행사', 35, 85, 70),
  ('🦝', '너구리', 'Raccoon', 'current', '손재주가 좋은 도둑', 40, 65, 80),
  ('🦨', '스컹크', 'Skunk', 'current', '냄새로 무장한 동물', 35, 55, 60),
  ('🦡', '오소리', 'Badger', 'current', '땅굴을 파는 전문가', 60, 50, 65),
  ('🦢', '백조', 'Swan', 'current', '우아한 물의 여왕', 40, 70, 55),
  ('🦚', '공작', 'Peacock', 'current', '화려한 깃털의 소유자', 35, 50, 60),
  ('🦜', '앵무새', 'Parrot', 'current', '말하는 새', 25, 75, 85),
  ('🦩', '홍학', 'Flamingo', 'current', '분홍빛 다리의 소유자', 30, 60, 50),
  ('🦃', '칠면조', 'Turkey', 'current', '큰 몸집의 새', 45, 40, 35),
  ('🦆', '오리', 'Duck', 'current', '물에서 노는 새', 25, 65, 45),
  ('🦉', '올빼미', 'Owl', 'current', '밤의 현자', 50, 80, 90),
  ('🐔', '닭', 'Chicken', 'current', '알을 낳는 새', 20, 45, 30),
  ('🐷', '돼지', 'Pig', 'current', '똑똑한 농장 동물', 50, 35, 75),
  ('🐮', '소', 'Cow', 'current', '우유를 주는 친구', 70, 30, 40),
  ('🐐', '염소', 'Goat', 'current', '뭐든지 먹는 동물', 45, 70, 60),
  ('🐑', '양', 'Sheep', 'current', '양털을 주는 친구', 35, 50, 35),
  ('🐴', '말', 'Horse', 'current', '빠른 달리기 선수', 75, 95, 55),
  ('🐕', '개', 'Dog', 'current', '인간의 가장 친한 친구', 60, 75, 70),
  ('🐈', '고양이', 'Cat', 'current', '도도한 애교쟁이', 40, 85, 75),
  ('🐭', '쥐', 'Mouse', 'current', '작고 빠른 동물', 10, 90, 65),
  ('🐹', '햄스터', 'Hamster', 'current', '볼주머니가 귀여운 친구', 15, 70, 50);

-- 신화적 동물들 (Mythical Animals)
INSERT INTO animals (emoji, name, english_name, type, description, strength, speed, intelligence) VALUES
  ('🦄', '유니콘', 'Unicorn', 'mythical', '뿔을 가진 신비한 말', 80, 90, 85),
  ('🐉', '드래곤', 'Dragon', 'mythical', '불을 뿜는 전설의 용', 100, 85, 90),
  ('🔥', '불사조', 'Phoenix', 'mythical', '불에서 다시 태어나는 새', 85, 95, 95),
  ('🐴', '페가수스', 'Pegasus', 'mythical', '날개 달린 천마', 75, 100, 80),
  ('🦅', '그리핀', 'Griffin', 'mythical', '독수리와 사자의 결합', 90, 95, 85),
  ('🧜‍♀️', '인어', 'Mermaid', 'mythical', '반은 사람 반은 물고기', 50, 80, 90),
  ('🏹', '켄타우로스', 'Centaur', 'mythical', '반인반마의 궁수', 80, 85, 85),
  ('🐂', '미노타우로스', 'Minotaur', 'mythical', '소머리를 가진 괴물', 95, 60, 50),
  ('🦁', '스핑크스', 'Sphinx', 'mythical', '수수께끼를 내는 괴물', 85, 70, 100),
  ('🐍', '히드라', 'Hydra', 'mythical', '머리가 여러 개인 뱀', 90, 70, 75),
  ('🐕', '케르베로스', 'Cerberus', 'mythical', '지옥의 문지기', 95, 80, 70),
  ('🐙', '크라켄', 'Kraken', 'mythical', '거대한 바다 괴물', 100, 75, 85),
  ('🦎', '바실리스크', 'Basilisk', 'mythical', '독을 가진 도마뱀 왕', 85, 75, 80),
  ('🐐', '키메라', 'Chimera', 'mythical', '여러 동물이 합쳐진 괴물', 90, 80, 75),
  ('🍀', '레프러콘', 'Leprechaun', 'mythical', '행운을 가져다주는 요정', 30, 85, 95);

-- 선사시대 동물들 (Prehistoric Animals)
INSERT INTO animals (emoji, name, english_name, type, description, strength, speed, intelligence) VALUES
  ('🦖', '티라노사우루스', 'Tyrannosaurus', 'prehistoric', '공룡의 제왕', 100, 60, 55),
  ('🦏', '트리케라톱스', 'Triceratops', 'prehistoric', '세 개의 뿔을 가진 공룡', 85, 45, 50),
  ('🦅', '프테라노돈', 'Pteranodon', 'prehistoric', '하늘을 나는 파충류', 60, 95, 60),
  ('🦎', '디메트로돈', 'Dimetrodon', 'prehistoric', '돛을 가진 파충류', 75, 55, 45),
  ('🦐', '아노말로카리스', 'Anomalocaris', 'prehistoric', '캄브리아기의 포식자', 70, 80, 40),
  ('🪲', '삼엽충', 'Trilobite', 'prehistoric', '고대의 절지동물', 30, 40, 35),
  ('🐟', '둔클레오스테우스', 'Dunkleosteus', 'prehistoric', '갑옷을 입은 물고기', 90, 70, 45),
  ('🦟', '메가네우라', 'Meganeura', 'prehistoric', '거대한 잠자리', 40, 100, 50),
  ('🐛', '아스로플레우라', 'Arthropleura', 'prehistoric', '거대한 노래기', 60, 50, 30),
  ('🦖', '에다포사우루스', 'Edaphosaurus', 'prehistoric', '초식성 돛도마뱀', 65, 45, 40),
  ('🐛', '할루키게니아', 'Hallucigenia', 'prehistoric', '기묘한 캄브리아 생물', 20, 30, 25),
  ('🦑', '오파비니아', 'Opabinia', 'prehistoric', '다섯 개의 눈을 가진 생물', 45, 60, 55),
  ('🦂', '바다전갈', 'Eurypterid', 'prehistoric', '거대한 바다 전갈', 80, 70, 50),
  ('🦒', '브라키오사우루스', 'Brachiosaurus', 'prehistoric', '목이 긴 거대 공룡', 90, 35, 45),
  ('🦔', '스테고사우루스', 'Stegosaurus', 'prehistoric', '등에 골판을 가진 공룡', 80, 40, 40);

-- 봇 캐릭터용 특별 사용자 생성
INSERT INTO users (email, username, is_guest) VALUES
  ('bot1@kidtextbattle.com', '봇_황금갈기', false),
  ('bot2@kidtextbattle.com', '봇_무지개뿔', false),
  ('bot3@kidtextbattle.com', '봇_다이노킹', false),
  ('bot4@kidtextbattle.com', '봇_불꽃날개', false),
  ('bot5@kidtextbattle.com', '봇_파도타기', false)
ON CONFLICT (email) DO NOTHING;

-- 봇 캐릭터 생성 (사용자 ID는 실제 ID로 대체 필요)
-- 이 부분은 애플리케이션에서 처리하는 것이 더 안전합니다