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

### 사이트 URL

**https://dearinsoo.github.io/cursorstudy-prompt-savezone/**

### 최초 1회 (GitHub 설정)

저장소 [Settings → Pages](https://github.com/dearinsoo/cursorstudy-prompt-savezone/settings/pages)에서:

1. **Build and deployment** → Source: **Deploy from a branch**
2. Branch: **`gh-pages`** / **`/ (root)`** → Save

이후에는 `main` 푸시만으로 자동 갱신

## 디자인

[desigm.md](./desigm.md)의 토큰과 [src/styles.css](./src/styles.css)를 맞춰 두었습니다. 색·간격을 바꿀 때는 `desigm.md`를 수정한 뒤 CSS 변수를 동일하게 반영하세요.

## Python 의존성 (데이터 변환만)

```bash
pip install -r requirements.txt
```
