# Cyberpunk Quiz Game Setup Guide

這是一個基於 React Vite 搭配 Google Sheets & Apps Script 的闖關問答遊戲。

## 1. Google Sheets 配置

請先在 Google Drive 建立一份新的試算表，並設定以下兩個工作表 (Sheet)：

### A. 「題目」工作表

用於存放測驗題目。欄位順序如下：

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| (編號) | (題目敘述) | (選項 A) | (選項 B) | (選項 C) | (選項 D) | (A/B/C/D) |

### B. 「回答」工作表

用於記錄玩家作答結果。請手動建立以下標題列欄位：
`ID`、`闖關次數`、`總分`、`最高分`、`第一次通關分數`、`花了幾次通關`、`最近遊玩時間`

---

## 2. Google Apps Script 布署

1. 在該試算表中，點擊 **「擴充功能」 > 「Apps Script」**。
2. 將 `backend_gas.gs` 檔案中的代碼全部複製並貼入 Apps Script 編輯器中。
3. 點擊 **「部署」 > 「新部署」**。
4. 選擇類型為 **「網頁應用程式 (Web App)」**。
5. **重要設定：**
   - 執行身份：**我 (Me)**
   - 誰有權存取：**所有人 (Anyone)**
6. 點擊「部署」並授權存取權限。
7. **複製得到的「網頁應用程式 URL」**。

---

## 3. 前端專案設定

1. 在專案根目錄開啟 `.env` 檔案。
2. 將剛才複製的 URL 填入：

   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=你的_GAS_網頁應用程式_URL
   VITE_PASS_THRESHOLD=8
   VITE_QUESTION_COUNT=10
   ```

3. 執行安裝與啟動：

   ```bash
   npm install
   npm run dev
   ```

---

## 5. GitHub Pages 自動化部署 (CI/CD)

本專案已配置 GitHub Actions，每當你推送到 `main` 分支時會自動編譯並部署。

### 步驟

1. **設定 GitHub Secrets**：
   - 到你的 GitHub Repository 頁面，點擊 **Settings > Secrets and variables > Actions**。
   - 點擊 **New repository secret**，依序新增以下三個 Secret (值請參考你的 `.env`)：
     - `VITE_GOOGLE_APP_SCRIPT_URL`
     - `VITE_PASS_THRESHOLD`
     - `VITE_QUESTION_COUNT`
2. **開啟 GitHub Pages**：
   - 到 **Settings > Pages**。
   - 在 **Build and deployment > Branch** 選擇 `gh-pages` 分支。
   - 儲存後，GitHub 會提供你的遊戲網址。

---

## 6. 測試題目測試資料：生成式 AI 基礎知識

請將下方表格內容直接複製並貼上到 Google Sheets 的 **「題目」** 工作表中：

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 生成式 AI (Generative AI) 的主要功能是什麼？ | 整理硬體設備 | 刪除錯誤資料 | 創造新的內容 | 加速網路速度 | C |
| 2 | LLM 代表什麼縮寫？ | Long Logic Model | Large Language Model | Linear Low Memory | Light Layer Module | B |
| 3 | 在生成式 AI 中，「幻覺 (Hallucination)」是指什麼？ | AI 產生的內容過於逼真 | AI 產生錯誤或虛構但看似合理的資訊 | AI 處理速度變慢 | AI 拒絕回答問題 | B |
| 4 | Transformer 架構中最重要的機制是什麼？ | 注意力機制 (Attention) | 遞迴機制 (Recurrence) | 卷積機制 (Convolution) | 隨機森林 (Random Forest) | A |
| 5 | 下列哪一個是目前知名的開源 LLM？ | ChatGPT 4o | Llama 3 | Gemini Pro | Claude 3.5 | B |
| 6 | 什麼是「提示工程 (Prompt Engineering)」？ | 維護電腦硬體 | 優化輸入給 AI 的指令 | 開發新的顯示卡 | 建立資料庫索引 | B |
| 7 | 在 AI 領域中，什麼是 Token？ | 一種虛擬貨幣 | 文字處理的基本單位 | 網路安全碼 | 使用者的帳號名稱 | B |
| 8 | 多模態 (Multimodal) AI 的意思是？ | 只能處理文字 | 能同時處理多種資料類型(如圖文) | 有很多種不同的按鈕 | 運行在不同的作業系統 | B |
| 9 | RAG 技術的全稱是？ | Retrieval-Augmented Generation | Real-time AI Guide | Randomized Auto Generation | Rapid Analysis Group | A |
| 10 | 預訓練 (Pre-training) 的目的是什麼？ | 節省電力消耗 | 讓模型在一大堆資料中學習基礎知識 | 限制 AI 的回答 | 將 AI 安裝到手機裡 | B |
