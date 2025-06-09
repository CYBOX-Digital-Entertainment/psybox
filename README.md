# Psybox Physics Engine v2.0.0-beta

Minecraft Bedrock 1.21.82용 고급 경사면 물리엔진

## 🚀 주요 기능

- **Script API 2.0.0-beta 완전 호환**
- **GameTest 1.0.0-beta 지원**
- **4방향 경사면 검출 시스템**
- **자연스러운 미끄러짐 효과**
- **실시간 디버그 HUD**
- **성능 최적화 (2틱마다 실행)**

## 📋 시스템 요구사항

- Minecraft Bedrock 1.21.82 이상
- Script API 2.0.0-beta 활성화
- GameTest Framework 활성화 (선택사항)
- 치트 허용 필수

## 🛠️ 설치 방법

1. **폴더 복사**
   ```
   development_behavior_packs/psybox_physics_2_0_0_beta/
   ```

2. **실험적 기능 활성화**
   - Beta APIs ✅
   - 치트 허용 ✅

3. **개발자 환경 (선택사항)**
   ```bash
   npm install
   npm run build
   ```

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
/scriptevent psybox:debug_on     # 디버그 HUD 활성화
/scriptevent psybox:debug_off    # 디버그 HUD 비활성화
/scriptevent psybox:test_slope   # 수동 경사면 분석
```

## 🔧 엔티티 프로퍼티

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

## 📊 성능 특징

- **메모리 최적화**: 분산 처리로 CPU 부하 최소화
- **안정성**: 자동 오류 복구 시스템
- **확장성**: 15개 이상 엔티티 동시 지원
- **디버깅**: 실시간 물리 상태 모니터링

## 🔗 리소스팩 호환성

기존 Oullim_Spirra_RP와 100% 호환됩니다.
애니메이션 컨트롤러에서 다음 프로퍼티들을 사용할 수 있습니다:

```json
"transitions": [
  { "sliding": "query.property('phys:issliding')" },
  { "grounded": "query.property('phys:isgrounded')" }
]
```

## 🐛 문제 해결

### 자주 발생하는 문제

1. **TypeScript 컴파일 오류**
   - `npm install` 후 `npm run build` 재실행

2. **GameTest 실행 실패**
   - Beta APIs 활성화 확인
   - 구조 파일 존재 확인

3. **물리 효과 없음**
   - 엔티티가 cybox:spirra인지 확인
   - 디버그 HUD로 프로퍼티 동기화 확인

### 로그 확인
```
F3 + D → 개발자 콘솔
```

## 📞 지원

- Script API 2.0.0-beta 기준 개발
- Minecraft Bedrock 1.21.82 테스트 완료
- 모든 TypeScript 컴파일 오류 해결
- GameTest Framework 완전 지원

---
**Psybox Physics Engine v2.0.0-beta**  
*자연스러운 경사면 물리를 경험하세요!*
