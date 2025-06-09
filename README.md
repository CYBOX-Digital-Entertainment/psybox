# Psybox Physics Engine v2.0.0-beta

Minecraft Bedrock 1.21.82용 Script API 2.0.0-beta 기반 물리엔진

## 📋 요구사항

- Minecraft Bedrock 1.21.82 이상
- 실험적 기능에서 "Beta APIs" 활성화 (필수)
- "치트 허용" 설정 활성화 (필수)

## 🛠️ 설치 방법

### 1. NPM 모듈 설치
```bash
npm install @minecraft/server@2.0.0-beta.1.21.82-stable
npm install @minecraft/server-gametest@1.0.0-beta.1.21.70-stable
npm run build
```

### 2. 행동팩 적용
1. 이 폴더를 `development_behavior_packs` 디렉토리에 복사
2. Minecraft에서 새 월드 생성 시 해당 행동팩 활성화
3. 기존 리소스팩(Oullim_Spirra_RP)과 함께 사용

## 🎮 사용 방법

### 기본 테스트
```mcfunction
/summon cybox:spirra ~ ~3 ~
/fill ~ ~ ~ ~10 ~ ~10 oak_stairs 0 replace
/fill ~ ~1 ~ ~10 ~1 ~10 stone_slab 8 replace
```

### GameTest 실행
```mcfunction
/gametest run psybox:slope_test
/gametest run psybox:slab_test
/gametest run psybox:property_sync_test
```

### 디버그 명령어
```mcfunction
/scriptevent psybox:debug_on
/scriptevent psybox:debug_off
/scriptevent psybox:debug_toggle
/scriptevent psybox:physics_toggle
```

## 🔧 특징

- ✅ Script API 2.0.0-beta 완전 호환
- ✅ GameTest 1.0.0-beta 지원
- ✅ 4방향 경사면 검출 시스템
- ✅ 실시간 디버그 HUD
- ✅ 자연스러운 미끄러짐 효과
- ✅ 성능 최적화

## 📊 엔티티 프로퍼티

| 프로퍼티 | 타입 | 용도 |
|----------|------|------|
| phys:velx | float | X축 속도 |
| phys:vely | float | Y축 속도 |
| phys:velz | float | Z축 속도 |
| phys:isgrounded | bool | 지면 접촉 상태 |
| phys:issliding | bool | 미끄러짐 활성 상태 |
| phys:slopeangle | float | 경사각 (도 단위) |
| phys:slopestrength | float | 경사면 강도 |
| phys:mass | float | 엔티티 질량 |
| phys:friction | float | 마찰 계수 |

## 🚀 예상 성능

- 자연스러운 미끄러짐: 0.2-0.5m/s² 가속도
- 실시간 반응: 0.05초 내 물리 효과 적용
- 안정적 성능: 15개 이상 엔티티 지원
- 무제한 실행: Script Watchdog 무력화
