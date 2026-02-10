# دليل نشر تطبيق سوريا AI (استضافة مجانية)

هذا الدليل يشرح كيفية نشر التطبيق (Frontend و Backend) باستخدام خيارات مجانية بالكامل.

## 1. نشر الـ Backend (باستخدام Render)
يعتبر **Render** أفضل خيار مجاني لتشغيل محرك Hono الخاص بالتطبيق.

### الخطوات:
1. قم بإنشاء حساب على [Render.com](https://render.com).
2. اختر **New +** ثم **Web Service**.
3. اربط مستودع GitHub الخاص بك (`syria-ai-manus`).
4. الإعدادات المطلوبة:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `pnpm install && pnpm run build` (أو `npm install`)
   - **Start Command:** `node dist/index.js`
5. **متغيرات البيئة (Environment Variables):** أضف المفاتيح التالية:
   - `OPENAI_API_KEY`: مفتاح OpenAI الخاص بك.
   - `PORT`: `3002`

---

## 2. نشر الـ Frontend (باستخدام Vercel)
يعتبر **Vercel** الأفضل لنشر تطبيقات React/Expo Web.

### الخطوات:
1. قم بإنشاء حساب على [Vercel.com](https://vercel.com).
2. اختر **Add New Project** واربط مستودع GitHub.
3. الإعدادات المطلوبة:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Create React App` أو `Other`.
   - **Build Command:** `npx expo export:web`
   - **Output Directory:** `dist`
4. **متغيرات البيئة (Environment Variables):**
   - `EXPO_PUBLIC_BACKEND_URL`: ضع رابط الـ Backend الذي حصلت عليه من Render (مثلاً: `https://syria-ai-api.onrender.com`).

---

## 3. قاعدة البيانات (Supabase)
التطبيق مهيأ بالفعل لاستخدام **Supabase** كخيار مجاني للذاكرة وقاعدة البيانات.
1. أنشئ مشروعاً على [Supabase.com](https://supabase.com).
2. احصل على الـ `URL` والـ `Anon Key`.
3. أضفهما إلى متغيرات البيئة في الـ Backend والـ Frontend.

---

## ملاحظة هامة:
بما أن الاستضافة مجانية، قد يحتاج الـ Backend (Render) إلى حوالي 30 ثانية "للاستيقاظ" عند أول طلب بعد فترة خمول. هذا أمر طبيعي في الخطط المجانية.
