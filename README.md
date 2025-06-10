# Psybox Physics Engine v2.1.3-beta

마인크래프트 베드락 에디션용 고급 물리 시뮬레이션 애드온입니다. MACHINE_BUILDER 스타일의 terrain-conforming 물리 시스템을 구현하여 엔티티가 경사면에서 자연스럽게 미끄러져 내려가는 현실적인 물리 반응을 제공합니다.

## 🎯 주요 기능

### 고급 물리 시뮬레이션
- **9개 물리 프로퍼티**: velx, vely, velz, isgrounded, issliding, slopeangle, slopestrength, mass, friction
- **실시간 중력 시스템**: 차원별 차등 적용 (오버월드 1.0x, 네더 1.2x, 엔드 0.6x)
- **8방향 경사면 검출**: 정밀한 각도 계산 및 자동 미끄러짐 효과
- **표면별 마찰 시스템**: 블록 종류에 따른 차등 마찰 계수

### 디버그 및 개발 도구
- **실시간 디버그 HUD**: 물리 상태 실시간 모니터링
- **Script Event 시스템**: `/scriptevent psybox:명령어` 지원
- **GameTest 프레임워크**: 5가지 자동화 테스트

## 📋 시스템 요구사항

- **Minecraft Bedrock Edition** 1.21.82 이상
- **Script API**: 2.0.0-beta.1.21.82-stable
- **GameTest API**: 1.0.0-beta.1.21.70-stable
- **Beta APIs 실험 기능** 필수 활성화

## 🚀 설치 방법

### 1. 파일 설치
1. ZIP 파일을 다운로드하고 압축을 해제합니다
2. `psybox` 폴더를 다음 경로에 복사합니다:
   ```
   %LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\
   ```

### 2. 마인크래프트 설정
1. 마인크래프트를 실행하고 **설정** → **실험 기능**으로 이동
2. **"Beta APIs"** 토글을 활성화합니다 (필수)
3. 새 월드 생성 시 **행동팩** 탭에서 "Psybox Physics Engine v2.1.3-beta"를 선택
4. **크리에이티브 모드**와 **치트 허용**을 권장합니다

## 🎮 사용법

### 기본 명령어
```mcfunction
# 디버그 모드 활성화/비활성화
/scriptevent psybox:debug_on
/scriptevent psybox:debug_off

# 물리엔진 정보 확인
/scriptevent psybox:physics_info

# 경사면 테스트 실행
/scriptevent psybox:slope_test

# 차량 물리 테스트
/scriptevent psybox:vehicle_test
```

### 테스트 엔티티 소환
```mcfunction
# car:basic 엔티티 소환
/summon car:basic ~ ~2 ~

# 경사면 구조 생성
/fill ~ ~ ~ ~5 ~3 ~ minecraft:oak_stairs
/fill ~ ~ ~ ~5 ~2 ~ minecraft:stone_slab
```

### GameTest 실행
```mcfunction
# 전체 테스트 실행
/gametest run psybox:basic_physics
/gametest run psybox:slope_physics
/gametest run psybox:ground_detection
/gametest run psybox:physics_properties
/gametest run psybox:velocity_system

# 모든 테스트 한번에 실행
/gametest runall
```

## 🔬 물리 시스템 상세

### 물리 프로퍼티 설명
| 프로퍼티 | 설명 | 범위 |
|---------|------|------|
| `velx`, `vely`, `velz` | 3D 속도 벡터 | -10.0 ~ 10.0 |
| `isgrounded` | 지면 접촉 상태 | true/false |
| `issliding` | 경사면 미끄러짐 상태 | true/false |
| `slopeangle` | 경사각도 (도) | 0° ~ 90° |
| `slopestrength` | 경사 강도 | 0.0 ~ 1.0 |
| `mass` | 엔티티 질량 (kg) | 1 ~ 10000 |
| `friction` | 마찰 계수 | 0.0 ~ 1.0 |

### 차원별 물리 특성
- **오버월드**: 표준 중력 (1.0x)
- **네더**: 강화된 중력 (1.2x) - 더 빠른 낙하
- **엔드**: 감소된 중력 (0.6x) - 더 느린 낙하

### 표면별 마찰 계수
- **돌**: 0.7
- **흙**: 0.6  
- **잔디**: 0.65
- **나무**: 0.5
- **얼음**: 0.1
- **기본값**: 0.6

## 🐛 문제 해결

### 컴파일 오류
```bash
npm run build
# Found 0 errors 확인
```

### 인게임 오류
1. **물리엔진이 작동하지 않는 경우**:
   - Beta APIs가 활성화되었는지 확인
   - 월드에서 행동팩이 활성화되었는지 확인
   - `/scriptevent psybox:debug_on`으로 디버그 모드 활성화

2. **엔티티가 스폰되지 않는 경우**:
   - `car:basic` 엔티티 정의가 올바른지 확인
   - 치트가 활성화되었는지 확인

3. **GameTest가 실행되지 않는 경우**:
   - 실험 기능에서 "GameTest Framework"도 활성화
   - `/gametest clearall` 후 재시도

## 🔧 개발자 정보

### TypeScript 빌드
```bash
npm install
npm run build
npm run watch  # 자동 빌드 모드
```

### 디버깅
- 콘솔 로그는 Content Log에서 확인
- 디버그 HUD는 액션바에 표시
- 물리 프로퍼티는 `/scriptevent psybox:physics_info`로 확인

### 확장성
- `src/physics/beta/` 디렉토리에 새로운 물리 시스템 추가 가능
- `src/tests/` 디렉토리에 추가 테스트 케이스 작성 가능
- 엔티티별 커스텀 물리 프로퍼티 지원

## 📝 변경 로그

### v2.1.3-beta (현재)
- Script API 2.0.0-beta.1.21.82-stable 완전 호환
- `setVelocity()` → `applyImpulse()` 마이그레이션
- `scriptEventReceive` 이벤트 위치 수정
- `car:basic` 테스트 엔티티 지원
- 모든 컴파일 오류 해결

### v2.1.2-beta
- `worldInitialize` → `worldLoad` 이벤트 변경
- `applyKnockback` 메서드 시그니처 업데이트
- GameTest import 구조 개선

## 📄 라이선스

이 프로젝트는 교육 및 개발 목적으로 제공됩니다. 상업적 사용 시 개발자에게 문의하시기 바랍니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈 트래커를 통해 제출해 주세요. 풀 리퀘스트는 언제나 환영합니다!
