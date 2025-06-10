# Psybox Physics Engine v2.1.0-beta

Minecraft Bedrock 1.21.82용 고급 물리엔진 - MACHINE_BUILDER 스타일 자연스러운 경사면 미끄러짐 구현

## 🚀 주요 특징

### Script API 2.0.0-beta 완전 호환
- TypeScript 컴파일 오류 없음 (`Found 0 errors`)
- @minecraft/server@2.0.0-beta.1.21.82-stable 지원
- @minecraft/server-gametest@1.0.0-beta.1.21.70-stable 지원

### 정밀한 경사각 계산
- **계단**: 45° (0.7854 라디안) = arctan(1/1)
- **반블록**: 26.57° (0.4636 라디안) = arctan(0.5/1)  
- **완만한 반블록**: 14.04° (0.2450 라디안) = arctan(0.5/2)

### MACHINE_BUILDER 스타일 자동 미끄러짐
- 엔티티를 경사면에 두기만 해도 자동으로 미끄러져 내려옴
- 경사각에 따른 가변적인 가속도 제공
- 8방향 경사면 검출 시스템

## 📦 설치 방법

### 1. 기본 설치
1. 이 폴더를 `development_behavior_packs`에 복사
2. Minecraft 설정에서 **"Beta APIs"** 활성화 (필수)
3. **"치트 허용"** 설정 활성화 (필수)
4. 새 월드 생성 시 해당 행동팩 선택

### 2. 개발자 환경 (선택적)
```bash
npm install @minecraft/server@2.0.0-beta.1.21.82-stable
npm install @minecraft/server-gametest@1.0.0-beta.1.21.70-stable
npm install typescript@^5.0.0
npm run build
```

## 🎮 사용법

### 기본 테스트 명령어 (Minecraft 1.21.82 호환)
```mcfunction
# 계단 생성 (45° 경사면)
/fill ~ ~ ~ ~10 ~ ~10 minecraft:oak_stairs[facing=east] replace

# 반블록 생성 (26.57° 경사면)
/fill ~ ~ ~ ~10 ~ ~10 minecraft:stone_slab[vertical_half=bottom] replace

# 엔티티 소환
/summon cybox:spirra ~ ~5 ~
```

### 디버그 명령어
```mcfunction
/scriptevent psybox:debug_on     # 디버그 HUD 활성화
/scriptevent psybox:debug_off    # 디버그 HUD 비활성화
/scriptevent psybox:debug_detailed # 상세 분석 출력
```

### GameTest 명령어
```mcfunction
/gametest run psybox:slope_test          # 계단 경사면 테스트
/gametest run psybox:slab_test           # 반블록 테스트
/gametest run psybox:property_sync_test  # 프로퍼티 동기화 테스트
```

## 🔧 물리 프로퍼티 (최종 확정 9개)

| 프로퍼티 | 타입 | 범위 | 용도 |
|----------|------|------|------|
| `phys:velx` | float | -50.0 ~ 50.0 | X축 속도 |
| `phys:vely` | float | -50.0 ~ 50.0 | Y축 속도 |
| `phys:velz` | float | -50.0 ~ 50.0 | Z축 속도 |
| `phys:isgrounded` | bool | - | 지면 접촉 상태 |
| `phys:issliding` | bool | - | 미끄러짐 활성 상태 |
| `phys:slopeangle` | float | -90.0 ~ 90.0 | 경사각 (도 단위) |
| `phys:slopestrength` | float | 0.0 ~ 10.0 | 경사면 강도 |
| `phys:mass` | float | 0.1 ~ 10.0 | 엔티티 질량 |
| `phys:friction` | float | 0.0 ~ 1.0 | 마찰 계수 |

## 📊 예상 성능

| 지형 타입 | 경사각 | 가속도 | 최대 속도 | 반응 시간 |
|----------|--------|--------|-----------|-----------|
| 계단 | 45° | 0.2-0.5m/s² | 3.0m/s | 0.1초 |
| 반블록 | 26.57° | 0.1-0.3m/s² | 2.0m/s | 0.1초 |
| 완만한 반블록 | 14.04° | 0.05-0.15m/s² | 1.2m/s | 0.1초 |

## 🛠️ 문제 해결

### 빌드 오류
- `npm run build` 실행 시 "Found 0 errors" 메시지 확인
- TypeScript 5.0 이상 사용 권장

### 물리 효과 작동 안함
1. **Beta APIs** 활성화 확인
2. 엔티티가 `type_family: ["psybox"]` 포함 확인
3. `/scriptevent psybox:debug_on`으로 디버그 정보 확인

### GameTest 명령어 실패
- 실험적 기능에서 **"GameTest Framework"** 활성화
- `/gametest clearall` 후 재실행

## 📝 호환성

- **기존 리소스팩**: Oullim_Spirra_RP와 100% 호환
- **Minecraft 버전**: Bedrock 1.21.82 이상
- **Script API**: 2.0.0-beta.1.21.82-stable
- **GameTest**: 1.0.0-beta.1.21.70-stable

## 🎯 개발자 정보

이 물리엔진은 MACHINE_BUILDER의 자연스러운 경사면 물리와 MajestikButter Physics-Test의 부드러운 효과를 참고하여 개발되었습니다.

**버전**: 2.1.0-beta  
**마지막 업데이트**: 2025년 6월 10일  
**라이선스**: MIT