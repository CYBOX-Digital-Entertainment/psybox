# Psybox Physics Engine v2.1.3-beta

Advanced physics simulation for Minecraft Bedrock Edition

## 개요

Psybox Physics Engine은 마인크래프트 베드락 에디션에서 실제같은 물리 시뮬레이션을 제공하는 행동팩입니다. 경사면 검출, 미끄러짐, 중력, 마찰 등 다양한 물리 효과를 구현합니다.

## 기능

- **경사면 물리학**: 계단이나 반블럭 경사면에서 자연스럽게 미끄러짐
- **중력 시뮬레이션**: 차원별 차등 중력 적용 (오버월드 1.0x, 네더 1.2x, 엔드 0.6x)
- **마찰 모델링**: 표면 종류에 따른 마찰 계수
- **실시간 디버그 HUD**: 물리 상태 모니터링

## 요구사항

- **마인크래프트 베드락 에디션** 1.21.82 이상
- **Beta APIs** 실험 기능 활성화

## 설치 및 사용

1. ZIP 파일을 다운로드하고 압축을 해제합니다
2. `psybox` 폴더를 다음 경로에 복사합니다:
   ```
   %LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\
   ```
3. 마인크래프트에서 새 월드를 생성하고 "Psybox Physics Engine" 행동팩을 활성화합니다
4. 월드 설정에서 "Beta APIs" 실험 기능을 반드시 활성화해야 합니다

## 명령어

```
/scriptevent psybox:debug_on - 디버그 모드 활성화
/scriptevent psybox:debug_off - 디버그 모드 비활성화
/scriptevent psybox:slope_test - 경사면 테스트 시작
/scriptevent psybox:physics_info - 물리엔진 정보 표시
/gametest run psybox:basic_physics - 기본 물리 테스트
```

## 개발자 문서

TypeScript 개발 환경 설정:

```bash
npm install
npm run build
```

## 호환성

이 행동팩은 다음 API 버전에 최적화되어 있습니다:
- @minecraft/server: 2.0.0-beta.1.21.82-stable
- @minecraft/server-gametest: 1.0.0-beta.1.21.70-stable

## 라이선스

MIT License
