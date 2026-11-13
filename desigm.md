# 디자인 스펙 (프롬프트 검색·복사 사이트)

> `src/styles.css`의 CSS 변수와 동기화됩니다. 색·간격을 바꿀 때 여기를 수정한 뒤 styles에 반영하세요.

## 타이포

- 폰트: **Pretendard** (CDN)
- 본문: 15px, weight **500**
- 제목·테이블 헤더·프롬프트 이름: weight **600~700**
- 줄간격: 1.5

## 색상 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-bg` | `#f4f6f8` | 페이지 배경 |
| `--color-surface` | `#ffffff` | 카드·테이블 |
| `--color-text` | `#191f28` | 본문 |
| `--color-text-muted` | `#4e5968` | 보조 텍스트 |
| `--color-border` | `#e5e8eb` | 테두리 |
| `--color-primary` | `#3182f6` | 버튼·포커스 |
| `--color-primary-hover` | `#1b64da` | 버튼 hover |

**다크 모드** (`data-theme="dark"`): 배경 `#0f1216`, 표면 `#1a1f26`, 본문 `#e8eaed`, primary `#4593fc`. 헤더의 **라이트 모드 / 다크 모드** 버튼으로 전환하며 `localStorage`에 저장. 첫 방문 시 OS 설정(`prefers-color-scheme`)을 따름.

## 레이아웃

- 최대 너비: **960px**, 좌우 패딩 20px
- 헤더: 제목 + 한 줄 설명
- 검색창: 전체 너비, 높이 48px, radius 12px
- 테이블: radius 16px, 헤더 배경 `--color-bg`
- 모바일 (≤640px): 테이블 → 카드 스택

## 컴포넌트

- **버튼 primary**: 배경 primary, 흰 글자, radius 10px, weight 600
- **버튼 ghost**: 테두리, 배경 transparent, 「전체 보기」용
- **토스트**: 하단 중앙, 어두운 배경, 2초 후 fade
