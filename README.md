# Psybox Physics Engine v2.1.4-beta

마인크래프트 베드락 에디션용 고급 물리 시뮬레이션 애드온

## 🚀 주요 기능

### MACHINE_BUILDER 스타일 물리 시뮬레이션
- **terrain-conforming 기술**: 경사면에서 자연스럽게 미끄러져 내려가는 현실적인 물리 효과
- **9개 물리 프로퍼티**: velx, vely, velz, isgrounded, issliding, slopeangle, slopestrength, mass, friction
- **차원별 차등 물리**: 오버월드(1.0x), 네더(1.2x), 엔드(0.6x) 중력 적용

### 고급 경사면 검출 시스템
- **Raycast 기반 검출**: getBlockFromRay API 사용으로 정밀한 경사면 분석
- **5°-60° 경사각 범위**: 완만한 경사부터 가파른 절벽까지 대응
- **표면별 마찰 모델링**: 블록 타입에 따른 차등 마찰 계수 적용

## 📋 시스템 요구사항

- **Minecraft Bedrock Edition** 1.21.82 이상
- **Script API** 2.0.0-beta.1.21.82-stable
- **GameTest API** 1.0.0-beta.1.21.70-stable
- **Beta APIs 실험 기능** 필수 활성화

## 🛠️ 설치 방법

### 1. 기본 설치
1. `psybox_physics_v2.1.4-beta.zip` 파일을 다운로드
2. 다음 경로에 압축 해제:
   ```
   %LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\
   ```
3. 마인크래프트 설정에서 **"Beta APIs"** 실험 기능 활성화

### 2. 개발자 환경 설정
```bash
cd psybox_physics_v2.1.4-beta
npm install
npm run build
```

## 🎮 사용법

### 기본 명령어
```mcfunction
# 디버그 모드 활성화/비활성화
/scriptevent psybox:debug_on
/scriptevent psybox:debug_off

# 경사면 테스트 실행
/scriptevent psybox:slope_test

# 물리엔진 정보 확인
/scriptevent psybox:physics_info
```

### 테스트 시나리오
```mcfunction
# 1. car:basic 엔티티 소환
/summon car:basic ~ ~2 ~

# 2. 경사면 구조 생성
/fill ~ ~ ~ ~5 ~3 ~ minecraft:oak_stairs

# 3. GameTest 자동화 테스트
/gametest run psybox:slope_physics
/gametest run psybox:basic_physics
/gametest run psybox:gravity_test
```

## 🔬 물리 시뮬레이션 상세

### 지원하는 물리 프로퍼티
| 프로퍼티 | 설명 | 단위 |
|---------|------|------|
| velx, vely, velz | 3D 속도 벡터 | m/s |
| isgrounded | 지면 접촉 상태 | boolean |
| issliding | 경사면 미끄러짐 상태 | boolean |
| slopeangle | 경사각도 | 도(°) |
| slopestrength | 경사 강도 | 0.0-1.0 |
| mass | 엔티티 질량 | kg |
| friction | 마찰 계수 | 0.0-2.0 |

### 표면별 마찰 계수
- **얼음**: 0.02 (매우 미끄러움)
- **모래**: 0.2 (미끄러움)
- **흙**: 0.4 (보통)
- **나무**: 0.5 (보통)
- **돌**: 0.6 (높음)
- **점토**: 0.45 (보통)

## 🧪 자동화 테스트

총 8가지 테스트 시나리오가 포함되어 있습니다:

1. **basic_physics**: 기본 물리 컴포넌트 및 속성 설정
2. **slope_physics**: 경사면 물리학 시스템 동작
3. **gravity_test**: 중력 시스템의 차원별 적용
4. **friction_test**: 표면별 마찰 계수 적용
5. **properties_test**: 9개 물리 프로퍼티 정상 설정
6. **dimension_physics**: 차원별 물리 특성
7. **performance_test**: 다중 엔티티 성능 검증

## 🔧 개발자 정보

### 프로젝트 구조
```
src/
├── main.ts                    # 메인 물리엔진 클래스
├── events/
│   └── DebugHud.ts           # 실시간 디버그 HUD
├── physics/
│   └── beta/
│       └── SlopePhysics.ts   # 경사면 물리학 시스템
└── tests/
    └── GameTests.ts          # 자동화 테스트 프레임워크
```

### API 호환성
- **Script API 2.0.0-beta**: 모든 메서드 시그니처 업데이트 완료
- **getBlockFromRay**: 정밀한 블록 감지를 위한 새로운 API 사용
- **applyImpulse**: 단일 Vector3 파라미터 형식으로 변경
- **scriptEventReceive**: system.afterEvents로 이동

### 컴파일 검증
```bash
npm run build
# 출력: Found 0 errors ✅
```

## 🎯 사용 예시

### 경사면 물리 시뮬레이션
1. 계단이나 반블럭으로 경사면 생성
2. car:basic 엔티티를 경사면 상단에 배치
3. 엔티티가 자연스럽게 아래로 미끄러져 내려가는 것 확인
4. 디버그 모드로 실시간 물리 상태 모니터링

### 실시간 디버그 정보
디버그 모드 활성화 시 액션바에 다음 정보 표시:
- 현재 위치 (X, Y, Z)
- 실제 속도 vs 시뮬레이션 속도
- 지면 접촉 및 경사면 상태
- 경사각도 및 강도
- 질량 및 마찰 계수

## 📞 지원

- **개발자**: CYBOX Digital Entertainment
- **버전**: 2.1.4-beta
- **호환성**: Minecraft Bedrock 1.21.82+
- **라이선스**: MIT

---

*Psybox Physics Engine은 현실적인 물리 시뮬레이션을 통해 마인크래프트의 게임플레이를 한 단계 끌어올립니다.*
