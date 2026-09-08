# 部署建議：Vercel

1. 將此專案完整上傳到 GitHub：`anylovr888-source/yao-career`
2. 在 Vercel 建立新專案
3. Import Git Repository → `yao-career`
4. Framework Preset：Vite
5. Build Command：`npm run build`
6. Output Directory：`dist`
7. 若使用 Supabase，加入：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
8. Deploy

之後 main 分支每次更新，可自動重新部署。
