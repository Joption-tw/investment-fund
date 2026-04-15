# 連發哥 即時績效

連發哥帳戶選擇權即時績效追蹤網頁，資料來源為 Google Sheets 即時同步。

## 🌐 網址

| 平台 | 網址 |
|------|------|
| **主要網址** | https://fund.joption.org/ |
| Vercel | https://lianfage-performance.vercel.app |
| GitHub Pages | https://joption-tw.github.io/investment-fund/ |

## 📊 功能特色

- **即時績效圖表**：期貨指數、時間價值、資產、獲利率、總點數 五軸顯示
- **交易時段切換**：自動偵測交易時段（日盤／夜盤）
- **股東績效報表**：即時顯示所有股東本金、損益、累積報酬
- **截圖分享**：一鍵輸出高清報表圖
- **Excel 匯出**：含原始資料、每分鐘內插、績效圖三個工作表

## 📁 資料來源

Google Sheets ID：`1GHOlICHupM5W4lap8VkaD1WdIEZ8n1rsScTrxo7BW0k`

| 工作表 | GID | 說明 |
|--------|-----|------|
| 績效圖表 | `1823639969` | 即時期指、時間價值、獲利率等 |
| 股東報表 | `1908704661` | 各股東本金與損益明細 |

## 🔄 更新方式

修改 `index.html` 後執行：

```powershell
cd "C:\Users\suntree\Desktop\homepage\連發哥報表"
git add index.html
git commit -m "更新說明"
git push
```

push 完成後，`fund.joption.org` 與 Vercel 約 1 分鐘內自動更新。

## 🛠 技術架構

- **前端**：HTML + Tailwind CSS + ECharts 5
- **部署**：Vercel（連結 GitHub，push 即自動部署）
- **DNS**：Namecheap → A Record `fund` → `76.76.21.21`
- **SSL**：Vercel 自動管理 HTTPS 憑證
