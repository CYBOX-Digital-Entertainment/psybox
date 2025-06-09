# GameTest 구조 파일 생성 방법

GameTest가 정상 작동하려면 다음 단계를 따라주세요:

1. Minecraft에서 크리에이티브 모드로 접속
2. 간단한 3x3x3 구조물 건설 (예: 돌 계단 배치)
3. 다음 명령어로 구조 저장:
   /structure save psybox:slope_test ~ ~ ~ ~3 ~3 ~3

4. 또는 자동으로 structures 폴더에 기본 구조가 생성되도록 
   다음 명령어를 게임에서 실행:
   /gametest create slope_test 3 3 3

이렇게 하면 structures/psybox/slope_test.mcstructure 파일이 생성됩니다.
