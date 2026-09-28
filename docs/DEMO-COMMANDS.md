# دليل العرض التوضيحي للمشروع (Demo Commands Reference)

هذا الملف مخصص لمساعدتك أثناء العرض المباشر (Live Demo) للمشروع أمام الدكتور. يحتوي على جميع الأوامر التي ستحتاجها بالتسلسل المنطقي.

---

## 1. قبل بدء العرض

قبل بدء الشرح، تأكد من أن بيئة العمل جاهزة وتعمل بشكل سليم.

**الانتقال إلى مجلد المشروع:**
`powershell
cd C:\Users\NOMAN\Projects\task-management-api
`

**التأكد من أن Docker يعمل:**
`powershell
docker --version
docker info
`

**التحقق من حالة Git:**
`powershell
git status
`

---

## 2. التحقق من المشروع

قبل تشغيل الحاويات، يمكننا إثبات أن إعدادات Docker Compose صحيحة.

**فحص ملف الإعدادات:**
`powershell
docker compose config
`
*(يشرح هذا الأمر كيف يقوم Docker بدمج وتفسير ملف compose.yaml بدون تشغيل الخدمات).*

---

## 3. تشغيل المشروع

**أمر التشغيل الكامل (في الخلفية):**
`powershell
docker compose up -d --build
`
*(يبني هذا الأمر الصور إذا لزم الأمر، ويشغل الخدمات في الخلفية بفضل -d).*

**التحقق من حالة الخدمات:**
`powershell
docker compose ps
`
*(يجب أن يظهر هنا 	ask-management-db و 	ask-management-api و 	ask-management-nginx في حالة Up، ويظهر المنفذ 8080 بجانب Nginx فقط).*

---

## 4. اختبار API (عمليات CRUD)

لضمان عدم وجود مشاكل مع الأقواس المزدوجة في PowerShell، سنستخدم أوامر Invoke-RestMethod المدمجة.

**قراءة المهام (GET):**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET
`

**إنشاء مهمة جديدة (POST):**
`powershell
$body = @{ title = "Presentation Task"; description = "Live Demo Task" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body $body -ContentType "application/json"
`

**التأكد من إنشاء المهمة (GET):**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET
`

**تحديث حالة المهمة (PUT) - افترض أن رقم المهمة هو 1:**
`powershell
$body = @{ status = "completed" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/tasks/1 -Method PUT -Body $body -ContentType "application/json"
`

**حذف المهمة (DELETE):**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks/1 -Method DELETE
`

---

## 5. اختبار Nginx Reverse Proxy

لقد قمنا بتوجيه جميع الطلبات في الأمثلة السابقة إلى http://localhost:8080.
هذا المنفذ خاص بحاوية 	ask-management-nginx، وهي نقطة الدخول الخارجية (Reverse Proxy) الوحيدة.
الـ API وقاعدة البيانات (PostgreSQL) غير منشورين مباشرة على الـ Host كإجراء أمني قوي.

---

## 6. اختبار Persistence (استمرارية البيانات)

أهم متطلب في قواعد البيانات هو ألا نفقد البيانات عند إيقاف الحاويات.

**خطوات العرض:**
1. أنشئ مهمة جديدة باستخدام أمر POST من القسم 4.
2. أوقف المشروع بأمان:
`powershell
docker compose down
`
3. شغل المشروع مرة أخرى:
`powershell
docker compose up -d
`
4. نفذ أمر GET وتأكد أن المهمة التي أنشأتها لا تزال موجودة.

> **تحذير هام جداً:** إياك استخدام أمر docker compose down -v أثناء العرض! هذا الأمر يحذف الـ Named Volumes وسيمسح جميع بيانات PostgreSQL.

---

## 7. إظهار Docker Network

الخدمات الثلاثة تتصل ببعضها عبر شبكة داخلية معزولة اسمها في الكود 	ask-management-network.

**لعرض جميع الشبكات:**
`powershell
docker network ls
`

**لفحص شبكتنا بالتحديد:**
`powershell
docker network inspect task-management_task-management-network
`
*(يظهر هذا الأمر الأيبيهات الداخلية (IPs) للحاويات وكيف يمكنهم التحدث مع بعضهم عبر أسمائهم مثل 	ask-management-api).*

---

## 8. إظهار Docker Volume

لتخزين بيانات PostgreSQL بشكل دائم، نستخدم وحدة تخزين اسمها 	ask-management-db-data.

**لعرض وحدات التخزين:**
`powershell
docker volume ls
`

**لفحص وحدة التخزين الخاصة بنا:**
`powershell
docker volume inspect task-management-db-data
`
*(يوضح هذا الأمر مسار تخزين الملفات الفعلي على جهازك المضيف).*

---

## 9. إظهار Docker Images

الصور المحلية التي تم بناءها أو تحميلها.

**لعرض الصور:**
`powershell
docker images
`
*(ستظهر صورة 	ask-api:v1.0.0 بالإضافة إلى صور postgres:15-alpine و 
ginx:alpine).*

---

## 10. Docker Hub / Registry

يجب أن توضح أن المشروع تم نشره على الإنترنت للتحميل من أي مكان.
المستودع: hishamdiv/task-management-api

الفرق بين الـ Tags:
*   1.0.0: يمثل نسخة محددة وثابتة من المشروع لا تتغير (Immutable).
*   latest: المؤشر الديناميكي لآخر صورة تم تحديثها.

**لإثبات إمكانية السحب (فقط إن طُلب منك ذلك):**
`powershell
docker pull hishamdiv/task-management-api:v1.0.0
`

---

## 11. Failure Mode Demonstration (اختبار الانهيار)

ماذا يحدث لو تعطل الـ API فجأة؟

**1. إيقاف الـ API عمداً:**
`powershell
docker compose stop task-management-api
`

**2. إرسال طلب من المستخدم:**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET
`
*(سيظهر خطأ أحمر في PowerShell، أو لو فتحت المتصفح سيظهر 502 Bad Gateway. هذا يثبت أن Nginx يعمل ولكنه لا يجد الـ API خلفه).*

**3. إعادة تشغيل الـ API:**
`powershell
docker compose start task-management-api
`
*(بعد ثوانٍ قليلة، أعد طلب الـ GET وسيعود النظام للعمل طبيعياً).*

---

## 12. اختبارات إضافية آمنة للعرض

**طلب مهمة غير موجودة (404 Not Found):**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks/9999 -Method GET
`
*(سينتج خطأ 404 وهذا دليل على أن الـ API يقوم بالتحقق من المدخلات).*

**إرسال مهمة بدون بيانات صحيحة (400 Bad Request):**
`powershell
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body "{}" -ContentType "application/json"
`

---

## 13. إنهاء العرض

بعد نهاية المناقشة وإثبات كل شيء، أوقف التشغيل بشكل نظيف.

`powershell
docker compose down
`

---

## 14. الأوامر الأساسية فقط (Cheat Sheet)

هذه هي قائمة الأوامر للنسخ واللصق السريع أثناء العرض:

1. **الدخول للمشروع:** cd C:\Users\NOMAN\Projects\task-management-api
2. **فحص الإعدادات:** docker compose config
3. **التشغيل:** docker compose up -d
4. **عرض الحالة:** docker compose ps
5. **قراءة المهام:** Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET
6. **إنشاء مهمة:**
   $body = @{ title="Demo" } | ConvertTo-Json
   Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body  -ContentType "application/json"
7. **إيقاف النظام (لإثبات بقاء البيانات):** docker compose down
8. **عرض الشبكات:** docker network ls
9. **عرض التخزين:** docker volume ls
10. **عرض الصور:** docker images
11. **اختبار سقوط النظام:** docker compose stop task-management-api
12. **إيقاف نهائي بنهاية العرض:** docker compose down

---

## 15. أسئلة الدكتور المرتبطة بالأوامر

*   **لماذا استخدمنا docker compose؟**
    لتشغيل جميع خدمات المشروع الثلاث (API, DB, Nginx) معاً بملف إعداد واحد (declarative) بدلاً من تشغيل كل حاوية بأمر منفصل ومعقد.
*   **لماذا Nginx؟ ولماذا Port 8080؟**
    يستخدم كـ Reverse Proxy ليكون البوابة الخارجية الوحيدة. 8080 هو المنفذ المفتوح للمستخدمين على جهاز الـ Host.
*   **لماذا API لا يظهر على port 3000 للمستخدم؟**
    لأنه محمي داخل شبكة Docker الداخلية (Isolation) ولا يتم التواصل معه إلا عبر Nginx.
*   **لماذا PostgreSQL لا يظهر على 5432 للمستخدم؟**
    لنفس السبب، حماية أمنية لمنع أي وصول خارجي لقاعدة البيانات.
*   **لماذا نستخدم Named Volume؟**
    لتخزين البيانات في مكان آمن على جهاز الـ Host بعيداً عن دورة حياة الحاوية، حتى لا نفقد المهام إذا تم تدمير الحاوية.
*   **ماذا يحدث عند docker compose down؟**
    يتم إيقاف الحاويات وتدميرها هي والشبكات، لكن الـ Volumes تبقى آمنة.
*   **ماذا يحدث عند docker compose down -v؟**
    هذا أمر خطير! يقوم بحذف كل شيء بما في ذلك الـ Volumes ويفقدنا قاعدة بياناتنا تماماً.
*   **لماذا نستخدم 1.0.0 و latest؟**
    1.0.0 يحفظ نسخة محددة يمكننا العودة لها دائماً، و latest هو مؤشر ديناميكي يسهّل سحب أحدث كود تم رفعه دائماً.
*   **كيف تتواصل الخدمات داخل Docker؟**
    من خلال DNS داخلي توفره شبكة Docker 	ask-management-network، حيث يمكن لـ API التحدث مع 	ask-management-db باستخدام اسمها فقط.
*   **ماذا يحدث إذا توقف الـ API؟**
    يقوم Nginx بإرجاع خطأ 502 Bad Gateway للمستخدم لأنه لم يعد قادراً على الوصول إلى الخادم الخلفي.
