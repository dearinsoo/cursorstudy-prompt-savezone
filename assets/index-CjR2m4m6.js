(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function c(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=c(n);fetch(n.href,r)}})();const q=document.querySelector("#app");if(!q)throw new Error("#app not found");const $=q,b=10,k="prompt-site-theme";function x(t){document.documentElement.setAttribute("data-theme",t),localStorage.setItem(k,t),E()}function E(){const t=document.querySelector("#theme-toggle");if(!t)return;const e=document.documentElement.getAttribute("data-theme")==="dark";t.textContent=e?"라이트 모드":"다크 모드",t.setAttribute("aria-label",e?"라이트 모드로 전환":"다크 모드로 전환")}function M(){const t=document.querySelector("#theme-toggle");E(),t==null||t.addEventListener("click",()=>{const e=document.documentElement.getAttribute("data-theme")==="dark";x(e?"light":"dark")})}function v(t){return t.trim().toLowerCase()}async function A(){const t=await fetch("/cursorstudy-prompt-savezone/prompts.json");if(!t.ok)throw new Error("프롬프트 데이터를 불러오지 못했습니다.");return t.json()}async function L(t){try{return await navigator.clipboard.writeText(t),!0}catch{const e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.position="fixed",e.style.left="-9999px",document.body.appendChild(e),e.select();const c=document.execCommand("copy");return document.body.removeChild(e),c}}function m(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(){$.innerHTML=`
    <header class="site-header">
      <div class="site-header-row">
        <div class="site-header-text">
          <h1>나만의 프롬프트</h1>
          <p>이름이나 내용으로 검색한 뒤, 버튼 한 번으로 복사해 바로 사용하세요.</p>
        </div>
        <button type="button" class="btn btn-ghost theme-toggle" id="theme-toggle">다크 모드</button>
      </div>
    </header>
    <div class="search-wrap">
      <label for="search" class="sr-only">프롬프트 검색</label>
      <input
        id="search"
        class="search-input"
        type="search"
        placeholder="프롬프트 이름 또는 내용 검색..."
        autocomplete="off"
      />
    </div>
    <p class="result-meta" id="result-meta" aria-live="polite"></p>
    <div id="results"></div>
    <nav id="pagination" class="pagination" aria-label="페이지 탐색" hidden></nav>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <div id="modal-backdrop" class="modal-backdrop" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title"></h2>
        <pre id="modal-body"></pre>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="modal-close">닫기</button>
          <button type="button" class="btn btn-primary" id="modal-copy">복사</button>
        </div>
      </div>
    </div>
  `}function y(t){const e=document.querySelector("#toast");e&&(e.textContent=t,e.classList.add("is-visible"),window.clearTimeout(y._t),y._t=window.setTimeout(()=>{e.classList.remove("is-visible")},2e3))}y._t=0;function O(t){const e=document.querySelector("#modal-backdrop"),c=document.querySelector("#modal-title"),s=document.querySelector("#modal-body"),n=document.querySelector("#modal-copy");!e||!c||!s||!n||(c.textContent=t.name,s.textContent=t.prompt,e.hidden=!1,n.onclick=async()=>{const r=await L(t.prompt);y(r?"복사되었습니다":"복사에 실패했습니다")})}function w(){const t=document.querySelector("#modal-backdrop");t&&(t.hidden=!0)}function S(t){return Math.max(1,Math.ceil(t/b)||1)}function P(t,e){if(t===0)return{start:0,end:0};const c=(e-1)*b+1,s=Math.min(e*b,t);return{start:c,end:s}}function I(t,e,c,s){const n=document.querySelector("#result-meta"),r=document.querySelector("#results"),a=document.querySelector("#pagination");if(!n||!r||!a)return;if(e===0){n.textContent=c===0?"데이터 없음":`검색 결과 없음 (전체 ${c}개)`,r.innerHTML='<p class="empty-state">검색 결과가 없습니다. 다른 키워드를 입력해 보세요.</p>',a.hidden=!0,a.innerHTML="";return}const{start:l,end:g}=P(e,s),d=S(e),f=e===c?`총 ${c}개`:`${e}개 (전체 ${c}개)`;n.textContent=`${f} · ${l}–${g}번째 · ${s} / ${d}페이지`;const h=t.map(o=>`
    <tr data-id="${o.id}">
      <td class="col-name">${m(o.name)}</td>
      <td class="col-preview">
        <button type="button" class="preview-trigger" data-action="view" data-id="${o.id}" title="클릭하여 전체 보기" aria-label="${m(o.name)} 프롬프트 전체 보기">
          <span class="preview-text">${m(o.prompt)}</span>
        </button>
      </td>
      <td class="col-actions">
        <button type="button" class="btn btn-primary" data-action="copy" data-id="${o.id}" aria-label="${m(o.name)} 복사">복사</button>
      </td>
    </tr>
  `).join("");r.innerHTML=`
    <div class="table-wrap">
      <table class="prompt-table">
        <thead>
          <tr>
            <th scope="col">프롬프트 이름</th>
            <th scope="col">프롬프트</th>
            <th scope="col">동작</th>
          </tr>
        </thead>
        <tbody>${h}</tbody>
      </table>
    </div>
  `,a.hidden=d<=1,d>1?a.innerHTML=`
      <button type="button" class="btn btn-ghost pagination-btn" data-page-action="prev" ${s<=1?"disabled":""} aria-label="이전 페이지">이전</button>
      <span class="pagination-status" aria-live="polite">${s} / ${d}</span>
      <button type="button" class="btn btn-ghost pagination-btn" data-page-action="next" ${s>=d?"disabled":""} aria-label="다음 페이지">다음</button>
    `:a.innerHTML=""}async function _(){H(),M();let t=[];try{t=await A()}catch(o){$.innerHTML=`<p class="empty-state">${m(o instanceof Error?o.message:"오류")}</p>`;return}const e=document.querySelector("#search"),c=document.querySelector("#results"),s=document.querySelector("#modal-backdrop"),n=document.querySelector("#modal-close"),r=()=>new Map(t.map(o=>[o.id,o]));let a=1,l=[];function g(){if(!c)return;const o=r();c.querySelectorAll("[data-action]").forEach(i=>{i.onclick=async()=>{const p=Number(i.dataset.id),u=o.get(p);if(u)if(i.dataset.action==="copy"){const T=await L(u.prompt);y(T?"복사되었습니다":"복사에 실패했습니다")}else O(u)}})}function d(){const o=document.querySelector("#pagination");o&&o.querySelectorAll("[data-page-action]").forEach(i=>{i.onclick=()=>{var u;const p=S(l.length);if(i.dataset.pageAction==="prev"&&a>1)a-=1;else if(i.dataset.pageAction==="next"&&a<p)a+=1;else return;f(),(u=document.querySelector("#results"))==null||u.scrollIntoView({behavior:"smooth",block:"nearest"})}})}function f(){const o=S(l.length);a>o&&(a=o);const i=(a-1)*b,p=l.slice(i,i+b);I(p,l.length,t.length,a),g(),d()}function h(){const o=v((e==null?void 0:e.value)??"");l=o===""?t:t.filter(i=>v(i.name).includes(o)||v(i.prompt).includes(o)),a=1,f()}e==null||e.addEventListener("input",h),n==null||n.addEventListener("click",w),s==null||s.addEventListener("click",o=>{o.target===s&&w()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&w()}),h()}_();
