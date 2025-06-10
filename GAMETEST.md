# GameTest 사용 가이드

## 구조 파일 설치
1. 게임 내에서 다음 명령어 실행:
   ```
   /gametest create slope_test 5 5 5
   ```
2. 테스트 구조 생성 후:
   ```
   /structure save psybox:slope_test ~ ~ ~ ~4 ~4 ~4
   ```
3. 저장된 구조 파일을 `structures/psybox/` 폴더에 복사

## 테스트 명령어
```
/gametest run psybox:slope_test
/gametest run psybox:slab_test
/gametest run psybox:property_sync_test
```

## 문제 해결
- "Could not find test" 오류: 구조 파일이 올바른 위치에 있는지 확인
- "Failed to spawn test structure" 오류: 구조 파일 형식 검증
