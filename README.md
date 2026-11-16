# 나만의 프롬프트 (검색 · 복사)

로그인 없이 프롬프트를 검색하고 클립보드로 복사하는 원페이지 정적 사이트입니다.

## 로컬 실행

```bash
npm install
npm run data   # 엑셀 → public/prompts.json
npm run dev
```

브라우저에서 표시되는 주소(기본 `http://localhost:5173`)로 접속합니다.

## 엑셀 데이터 갱신

1. `나만의 프롬프트.xlsx`를 수정합니다 (기본 경로: 사용자 Downloads 폴더).
2. 다른 경로를 쓰려면: `py -3 scripts/convert_xlsx.py --input "경로\파일.xlsx"`
3. `npm run data` 실행 후 `npm run dev` 또는 `npm run build`.

## 빌드

```bash
npm run build
```

`dist/` 폴더를 정적 호스팅(Vercel, Netlify, GitHub Pages 등)에 올리면 됩니다.

## 배포 (GitHub Pages)

`main`에 푸시하면 Actions가 `dist`를 **`gh-pages` 브랜치**로 배포합니다. 로컬에서 수동 배포는:

```bash
set VITE_BASE_PATH=/cursorstudy-prompt-savezone/
npm run deploy
```

(PowerShell: `$env:VITE_BASE_PATH='/cursorstudy-prompt-savezone/'` 후 `npm run deploy`)

### 사이트 URL (이 주소만 사용)

**https://dearinsoo.github.io/cursorstudy-prompt-savezone/**

- `https://dearinsoo.github.io/` 는 다른 사이트입니다.
- 저장소 이름은 **소문자** `cursorstudy-prompt-savezone` 입니다.

### 404가 나올 때

1. 위 **전체 URL**(끝 `/` 포함)로 다시 접속해 보세요.
2. [Settings → Pages](https://github.com/dearinsoo/cursorstudy-prompt-savezone/settings/pages)에서 Source:
   - **권장**: Branch **`gh-pages`** / **`/ (root)`**
   - 또는: Branch **`main`** / **`/docs`**
3. **`main` / `(root)` 만 선택하면 빌드되지 않아 404**가 납니다. 저장 후 1~2분 기다린 뒤 새로고침하세요.

이후에는 `main` 푸시만으로 `gh-pages`와 `docs/`가 자동 갱신

## 디자인

[desigm.md](./desigm.md)의 토큰과 [src/styles.css](./src/styles.css)를 맞춰 두었습니다. 색·간격을 바꿀 때는 `desigm.md`를 수정한 뒤 CSS 변수를 동일하게 반영하세요.

## Python 의존성 (데이터 변환만)

```bash
pip install -r requirements.txt
```
