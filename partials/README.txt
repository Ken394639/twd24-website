共用頁首／頁尾
==============
1. 改導航或頁尾時，只改：
   - partials/site-header.html
   - partials/site-footer.html
2. 然後在網站根目錄執行：
   python tools/sync-shell.py
3. 腳本會把 partials 同步到各 *.html（chart-choices.html 除外）。
4. 首次執行若 partials 不存在，會從 index.html 自動產生。

注意：同步後各頁頂層連結若檔名對得上，會自動加 aria-current="page"。
