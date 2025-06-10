# Psybox Physics Engine v2.1.2-beta

마인크래프트 베드락 에디션용 고급 물리 시뮬레이션 엔진입니다.

## 주요 기능

### 🎯 물리 시뮬레이션
- **실시간 중력 시스템**: 차원별 차등 적용
- **경사면 물리학**: MACHINE_BUILDER 스타일의 raycast 기반 경사 검출
- **마찰 시뮬레이션**: 지면/공중 마찰 차등 적용
- **자동 미끄러짐**: 계단, 반블럭 경사면에서 자연스러운 물리 반응

### 🔧 기술 사양
- **API 버전**: Script API 2.0.0-beta.1.21.82-stable
- **GameTest API**: 1.0.0-beta.1.21.70-stable  
- **지원 버전**: Minecraft 1.21.82+
- **테스트 엔티티**: cybox:spirra

### 📊 물리 프로퍼티 (9개)
- `velx`, `vely`, `velz`: 3D 속도 벡터
- `isgrounded`: 지면 접촉 상태
- `issliding`: 경사면 미끄러짐 상태
- `slopeangle`: 경사각도 (0°-90°)
- `slopestrength`: 경사 강도 (0.0-1.0)
- `mass`: 질량 (기본값: 1.0)
- `friction`: 마찰 계수

## 🚀 설치 방법

### 1. 파일 설치
```bash
# 압축 해제 후 다음 경로에 복사
%LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\psybox\
```

### 2. 마인크래프트 설정
1. **설정 > 실험 > Beta APIs** 활성화 (필수)
2. 새 월드 생성 시 "Psybox Physics Engine" 선택
3. 크리에이티브 모드 권장

### 3. 개발 환경 (선택사항)
```bash
npm install
npm run build
```

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
```

### GameTest 실행
```mcfunction
# 기본 물리 테스트
/gametest run psybox:basic_physics

# 경사면 물리 테스트  
/gametest run psybox:slope_physics

# 지면 감지 테스트
/gametest run psybox:ground_detection

# 물리 프로퍼티 테스트
/gametest run psybox:physics_properties

# 속도 시스템 테스트
/gametest run psybox:velocity_system
```

## 🔬 물리엔진 동작 원리

### 경사면 검출 시스템
1. **Raycast 기반**: 엔티티 전방/후방 두 지점에서 지면까지 raycast
2. **각도 계산**: 전후 높이차를 이용한 삼각함수 계산
3. **임계값 판정**: 5°-60° 범위에서 경사면으로 인식
4. **방향 결정**: 높이차에 따른 미끄러짐 방향 계산

### 물리력 적용
- **applyImpulse()**: 충격량 기반 속도 변경
- **applyKnockback()**: 수평/수직 방향 분리 적용
- **동적 프로퍼티**: 실시간 물리 상태 추적

## 🐛 문제해결

### 물리엔진이 작동하지 않을 때
1. Beta APIs 실험 기능 활성화 확인
2. cybox:spirra 엔티티 정의 확인
3. 월드에서 행동팩 활성화 확인
4. F3+T로 리소스팩 리로드

### GameTest 오류 해결
1. GameTest 실험 기능 활성화
2. 구조물 템플릿 존재 확인
3. 크리에이티브 모드에서 테스트

## 📝 개발자 정보

### 파일 구조
```
psybox/
├── manifests.json          # 행동팩 메타데이터
├── package.json           # NPM 의존성
├── tsconfig.json          # TypeScript 설정
├── src/                   # 소스 코드
│   ├── main.ts           # 메인 물리엔진
│   ├── events/DebugHud.ts # 디버그 시스템
│   └── tests/GameTests.ts # 자동화 테스트
└── scripts/              # 컴파일된 JavaScript
```

### API 호환성
- ✅ Script API 2.0.0-beta.1.21.82-stable
- ✅ GameTest API 1.0.0-beta.1.21.70-stable
- ✅ Minecraft Bedrock 1.21.82+

## 📞 지원

- **문제 보고**: GitHub Issues
- **기능 요청**: GitHub Discussions  
- **개발 문의**: Discord

---
*Psybox Physics Engine v2.1.2-beta - MACHINE_BUILDER 스타일 경사면 물리학 구현*