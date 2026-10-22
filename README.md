# Climate Comfort

კონდიციონერებისა და ცენტრალური გათბობის ქვაბების ონლაინ მაღაზია — storefront + ადმინ პანელი.

შპს კლიმატ კომფორტი+ · `climate-comfort.ge`

Static HTML/CSS/JavaScript, framework-ის გარეშე. Backend — [Supabase](https://supabase.com) (PostgreSQL, Auth, Edge Functions). ცალკე backend სერვერი არ არსებობს.

---

## სწრაფი გაშვება

```bash
git clone https://github.com/Gjavakha/CLIMATE-COMFORT.git
cd CLIMATE-COMFORT
```

ლოკალური სერვერი (Windows):

```powershell
.\server.ps1            # http://localhost:8000
.\server.ps1 -Port 8124 # თუ 8000 დაკავებულია ან OS-ს აქვს დაჯავშნილი
```

ან ნებისმიერი სხვა სტატიკური სერვერი:

```bash
python -m http.server 8000
npx serve .
```

> `file://`-ით გახსნა არ გამოდგება — Supabase-თან მოთხოვნები CORS-ზე ჩავარდება.

- საიტი: `http://localhost:8000`
- ადმინ პანელი: `http://localhost:8000/admin/`

---

## სტრუქტურა

| გზა | დანიშნულება |
| --- | --- |
| `index.html` | მთელი storefront ერთ ფაილში; ნავიგაცია რეალური მისამართებით (`/product/<slug>`, `/catalog/ac`, `/catalog/boiler`, `/checkout/<id>`, `/account`, `/terms`, `/privacy`, `/returns`; მთავარი გვერდის სექციები — `/#catalog`, `/#booking-section`). ჰოსტინგი ყველა გზაზე `index.html`-ს აბრუნებს (`_redirects`, ლოკალურად `server.ps1`) |
| `build.mjs`, `build.sh` | საიტის აწყობა `dist/`-ში (Cloudflare Pages). ბაზიდან იღებს გამოქვეყნებულ პროდუქტებს და თითოეულს ცალკე HTML გვერდად წინასწარ არენდერებს (`/product/<slug>`) — თავისი `<title>`, აღწერით, Open Graph და Product schema-თი; აგენერირებს `sitemap.xml`-ს. იხ. „ჰოსტინგი და SEO" |
| `_redirects`, `_headers` | Cloudflare Pages — SPA fallback და უსაფრთხოების header-ები (`build.mjs` აკოპირებს `dist/`-ში) |
| `app.js` | storefront-ის ლოგიკა — კატალოგი, ფილტრები, კალათა, ავტორიზაცია, checkout, იურიდიული გვერდები, WhatsApp, ორენოვნება (KA/EN) |
| `styles.css` | მთელი სტილი |
| `analytics.js` | GA4 + Meta Pixel cookie თანხმობის უკან; სანამ ID არ არის მითითებული, სრულად გამორთულია (ბანერიც არ ჩანს) |
| `supabase-config.js` | Supabase-ის URL და საჯარო anon key |
| `supabase-schema.sql` | ბაზის სრული სქემა — ცხრილები, RLS პოლიტიკები, ტრიგერები |
| `admin/` | ადმინ პანელი — შეკვეთები, ჯავშნები, ფასების იმპორტი Excel-იდან |
| `supabase/functions/fetch-product-details/` | Edge Function — პროდუქტის ფოტოებისა და მახასიათებლების ავტომატური მოძიება |
| `supabase/functions/send-order-email/` | Edge Function — შეკვეთის დადასტურების მეილი (Resend) |
| `supabase/functions/bog-create-payment/` | Edge Function — საქართველოს ბანკში გადახდის შექმნა, აბრუნებს გადახდის გვერდის ბმულს |
| `supabase/functions/bog-callback/` | Edge Function — ბანკის callback (ხელმოწერის შემოწმება, სტატუსის ჩაწერა, მეილი) |
| `supabase/functions/bog-payment-status/` | Edge Function — შეკვეთის გადახდის სტატუსი შედეგის გვერდისთვის; აკეთებს sync-ს ბანკიდან |
| `supabase/functions/bog-refund/` | Edge Function — ადმინის Refund / „Sync from bank" ღილაკები (მხოლოდ `admin_emails`-ში მყოფი მომხმარებლისთვის) |
| `supabase/functions/publish-site/` | Edge Function — ადმინის „Publish site" ღილაკი: Cloudflare Pages-ის deploy hook-ს უშვებს, რომ პროდუქტის გვერდები ახალი ფასებით გადაიწყოს (მხოლოდ ადმინისთვის) |
| `supabase/functions/mirror-product-images/` | Edge Function — მომწოდებლების საიტებიდან აღებულ ფოტოებს ჩვენს Storage-ში (`product-images` bucket) აკოპირებს და პროდუქტს ჩვენს ბმულებზე გადაწერს. იმპორტი ახალ პროდუქტებზე ავტომატურად იძახებს; ადმინის „Copy photos (N)" ღილაკი — დანარჩენზე |
| `guides.js` | სასარგებლო სტატიები (`/guide/<slug>`, 4 ცალი, ქართულად) — მთავარ გვერდზე ბარათებად, თითოეული ცალკე გვერდად. ⚠ ტექსტი საიტის ფაქტებიდანაა შედგენილი — მაღაზიამ გაშვებამდე ერთხელ უნდა წაიკითხოს |
| `supabase/config.toml` | Supabase CLI კონფიგი — `bog-callback`-ზე JWT შემოწმება გამორთულია |
| `robots.txt` | SEO (`sitemap.xml`-ს `build.mjs` აგენერირებს) |
| `server.ps1` | ლოკალური სტატიკური სერვერი დეველოპმენტისთვის |

---

## Backend

### დაყენება

1. შექმენი Supabase პროექტი
2. SQL Editor-ში გაუშვი `supabase-schema.sql` (ხელახლა გაშვება უსაფრთხოა)
3. `supabase-config.js`-ში ჩაწერე შენი `SUPABASE_URL` და anon key
4. `admin_emails` ცხრილში დაამატე ადმინის ელ. ფოსტა
5. Authentication → Providers → Email ჩართე
6. Edge Functions დააყენე (იხ. ქვემოთ)

დეტალები: [`SUPABASE-SETUP.md`](SUPABASE-SETUP.md)

### ცხრილები

| ცხრილი | შიგთავსი | წვდომა |
| --- | --- | --- |
| `products` | კანონიკური პროდუქტები (brand + model უნიკალურია), საიტის ფასი, ფოტოები, მახასიათებლები, `hidden` | საჯარო წაკითხვა (მხოლოდ გამოქვეყნებული); ჩაწერა — ადმინი |
| `supplier_offers` | თითო მომწოდებლის ფასები, **ჩვენი თვითღირებულების ჩათვლით** | მხოლოდ ადმინი |
| `suppliers` | მომწოდებლები: `elit`, `kontakt`, `chigo`, `alneo`, `midea` | მხოლოდ ადმინი |
| `import_batches` | ატვირთული ფაილების ჟურნალი | მხოლოდ ადმინი |
| `orders` | შეკვეთები (სტუმრისაც) | ჩაწერა — ყველა; კითხვა — მფლობელი თავისას, ადმინი ყველას |
| `profiles` | მომხმარებლის მიწოდების მონაცემები; რეგისტრაციისას ტრიგერით იქმნება | მფლობელი; ადმინი |
| `service_bookings` | სამონტაჟო სერვისის ჯავშნები | ჩაწერა — ყველა; კითხვა — ადმინი |
| `payment_events` | ბანკის ყველა callback და სტატუსის sync, სრული payload-ით | კითხვა — ადმინი; ჩაწერა — მხოლოდ Edge Function-ები |
| `admin_emails` | ვისაც აქვს ადმინის უფლება | მხოლოდ ადმინი |

### ავტორიზაცია

Storefront-ის ანგარიშები **Supabase Auth**-ზეა (ელ. ფოსტა + პაროლი, პაროლის აღდგენა, Google). პაროლი ბრაუზერში არ ინახება. მიწოდების მონაცემები `profiles` ცხრილშია, შეკვეთები ანგარიშს `orders.user_id`-ით ებმება — ამიტომ ნებისმიერი მოწყობილობიდან ჩანს.

ბარათის მონაცემები **არსად ინახება** — ანგარიშის გვერდზე ბარათების ტაბი წაშლილია.

### უსაფრთხოება

ყველა ცხრილზე ჩართულია **Row Level Security**. `is_admin()` ფუნქცია ამოწმებს, არის თუ არა მომხმარებლის ელ. ფოსტა `admin_emails`-ში.

`supabase-config.js`-ში არსებული anon key **საჯაროა დიზაინით** — ის მხოლოდ პროექტს აიდენტიფიცირებს, მონაცემებს კი RLS იცავს. `service_role` გასაღები არასდროს უნდა მოხვდეს კლიენტის კოდში — ის მხოლოდ Edge Function-ების შიგნით გამოიყენება.

---

## ფასების იმპორტი

ადმინ პანელი კითხულობს მომწოდებლების Excel ფაილებს ბრაუზერშივე ([SheetJS](https://sheetjs.com)), ავტომატურად ცნობს რომელი მომწოდებლისაა და აჩვენებს diff-ს (ახალი პროდუქტები, ფასის ცვლილებები, ფაილიდან გამქრალი პოზიციები) — **ბაზაში არაფერი იწერება, სანამ ადმინი არ დაადასტურებს**.

პროფილები (რომელი sheet, რომელი სვეტები) — `admin/importer-profiles.js`. ახალი მომწოდებელი = ერთი ახალი პროფილი ამ ფაილში + ერთი ჩანაწერი `suppliers` ცხრილში.

| მომწოდებელი | როგორ ამოიცნობა | Sheet | პროდუქტის ბმული |
| --- | --- | --- | --- |
| Elit Electronics | `ელიტი` sheet ან `Manufacturer Code` სვეტი | `ელიტი` | `EE LINK` სვეტი (ee.ge) |
| Kontakt | `გათბობა-გაგრილება` sheet | `გათბობა-გაგრილება` | `მოდელი` სვეტის ჰიპერბმული (kontakt.ge) |
| Chigo | `კონდიციონერი` sheet + `DRP` სვეტი | `კონდიციონერი` | არ აქვს |
| Alneo.ge | sheet-ის სახელში `ALNEOKONKA` | `კონდიციონერი ALNEOKONKA` | არ აქვს |
| Midea Georgia | `სრული პრაისი` sheet | `სრული პრაისი` | `www.midea.ge` სვეტის ჰიპერბმული |

### წესები

- **საიტის ფასი** = ყველაზე იაფი ფასი ყველა მომწოდებლის **მარაგში მყოფ** შეთავაზებებს შორის. თუ მომწოდებელს აქციის ფასი აქვს, ის იყიდება, საცალო კი გადახაზულად ჩანს.
- **მარაგის გარეშე** პროდუქტი (ყველა მომწოდებელთან) საიტზე არ ქვეყნდება; მარაგის გაჩენისთანავე შემდეგი იმპორტი გამოაქვეყნებს.
- **`hidden`** — ხელით დამალვა. ყოველი იმპორტი **ყველა** პროდუქტის `is_published`-ს თავიდან ითვლის, ამიტომ `is_published = false` მომდევნო ატვირთვაზე გაუქმდებოდა. `hidden = true` კი იმპორტს არ ეხება.
  - ამჟამად **Chigo დამალულია** (2026-10-07). დასაბრუნებლად:
    ```sql
    update products set hidden = false, is_published = (display_price is not null)
    where brand = 'CHIGO';
    ```
- **Midea-ს მოდელები**: სუფიქსები `INV` და `მილით` იჭრება, რომ იგივე მოდელი Elit/Kontakt-ისას დაემთხვეს და დუბლიკატი არ შეიქმნას; ფერი (`Black`, `Silver`, `Gold`) ცალკე SKU-ა და რჩება. BTU, თუ აღწერაში არ წერია, მოდელის კოდიდან იკითხება (`EF1-09HRFN8` → 9000).

> ⚠️ ფასიანი სიები შეიცავს ჩვენს თვითღირებულებას — `.gitignore` მიზანმიმართულად კეტავს `*.xlsx` და `*.xls` ფაილებს. არასდროს დაამატო ისინი რეპოზიტორიაში.

---

## Edge Functions

### `fetch-product-details` — ფოტოები და მახასიათებლები

იმპორტის დროს გამოიძახება მხოლოდ იმ პროდუქტებზე, რომლებსაც ფოტო ან მახასიათებლები აკლიათ (არსებულს არ ცვლის). წყაროების ჯაჭვი:

1. მომწოდებლის საკუთარი გვერდი ბმულიდან — Elit (Next.js `__NEXT_DATA__`), Kontakt (Magento HTML), **Midea (`midea.ge`, `specs-table`)**
2. Kontakt.ge-ზე ძებნა brand + model-ით
3. isurve.ge (Shopify JSON API) — Chigo/Alneo-სთვის პირველ რიგში

**ცნობილი შეზღუდვა:** ee.ge (403) და isurve.ge (429) დატაცენტრის IP-ებს აბლოკებენ, ამიტომ Edge Function-იდან ეს ორი წყარო არ მუშაობს (საოჯახო IP-დან მუშაობს). ასეთი პროდუქტები ერთჯერადი SQL-ით შეივსო ლოკალური კომპიუტერიდან; ასევე citrus.ge-დან (`/api/search`, `/api/product/<slug>`), რომელიც Edge Function-ში არ არის ჩართული. Kontakt და midea.ge Supabase-დანაც მუშაობს.

### `send-order-email` — შეკვეთის დადასტურება

შეკვეთის შენახვის შემდეგ ორ წერილს აგზავნის [Resend](https://resend.com)-ით: კლიენტს (დადასტურება) და მაღაზიას (ახალი შეკვეთა).

- ფუნქცია **მხოლოდ შეკვეთის ID-ს იღებს** და მიმღებს ბაზიდან კითხულობს (service role), ამიტომ საჯარო anon key-ით სპამის გაგზავნა შეუძლებელია.
- შეკვეთის ID ბრაუზერში გენერირდება (`crypto.randomUUID()`), რადგან RLS სტუმარს საკუთარი შეკვეთის წაკითხვის უფლებას არ აძლევს.
- გარე იმპორტები არ აქვს — esm.sh-დან `supabase-js` დეპლოიზე ჩავარდა.
- ⚠️ **Supabase-ში ეს ფუნქცია `rapid-action` სახელითაა დაიდეპლოიებული** (dashboard-მა შემთხვევითი სახელი მიანიჭა). `app.js`-ში: `const ORDER_EMAIL_FUNCTION = "rapid-action"`. თუ სწორი სახელით გადაიდეპლოიება, მხოლოდ ეს კონსტანტა შეცვალე.

Secrets (Supabase → Edge Functions → Secrets):

| სახელი | მნიშვნელობა |
| --- | --- |
| `RESEND_API_KEY` | Resend-ის გასაღები (ანგარიში `climatecomfortgroup@gmail.com`-ზე) |
| `MAIL_FROM` | ახლა `Climate Comfort <onboarding@resend.dev>`; დომენის შემდეგ `orders@climate-comfort.ge` |
| `ORDER_NOTIFY_TO` | `climatecomfortgroup@gmail.com` |

> ⚠️ სანამ `climate-comfort.ge` Resend-ში დადასტურებული არ არის, წერილი **მხოლოდ ანგარიშის მფლობელს** მიდის — მაღაზიის შეტყობინება მუშაობს, კლიენტის დადასტურება კი უარყოფილია.

### `bog-*` — ბარათით გადახდა (საქართველოს ბანკი)

ბარათით გადახდა მუშაობს საქართველოს ბანკის [Payments API](https://api.bog.ge/docs/payments/introduction)-ით
(მერჩანტი `CLIMATE-COMFORT.GE`, OPAY). საიტი ბანკს **არასდროს** ელაპარაკება — მხოლოდ სამი Edge Function:

| ფუნქცია | ვინ იძახებს | რას აკეთებს |
| --- | --- | --- |
| `bog-create-payment` | საიტი, შეკვეთის ჩაწერის შემდეგ | კითხულობს შეკვეთას ბაზიდან, **თანხას ამოწმებს პროდუქტის მიმდინარე ფასთან**, ბანკში ქმნის order-ს და აბრუნებს `redirect_url`-ს (ბანკის გადახდის გვერდი). თუ ღია ბანკის order უკვე არსებობს, იმავეს აბრუნებს. |
| `bog-callback` | ბანკი (server → server) | ამოწმებს `Callback-Signature`-ს (SHA256withRSA, ბანკის საჯარო გასაღები), შემდეგ **ბანკის receipt-იდან** კითხულობს რეალურ სტატუსს და წერს `orders`-ში. `paid`-ზე გადასვლისას აგზავნის დადასტურების მეილს. **ერთადერთი გზა, რითაც შეკვეთა `paid` ხდება.** |
| `bog-payment-status` | საიტი, `#payment-result/<orderId>` გვერდი | აბრუნებს გადახდის სტატუსს; თუ ჯერ `pending`-ია, ბანკის receipt-იდან აკეთებს sync-ს (callback რომც დაიკარგოს). |
| `bog-refund` | ადმინ-პანელი, გაშლილი შეკვეთის „Bank actions" | **Refund** — ბანკს სთხოვს თანხის დაბრუნებას (სრულს ან ნაწილობრივს, თანხა ველიდან; ღილაკზე ორჯერ დაჭერაა საჭირო), შეკვეთას `refund_requested`-ს უწერს, ბანკის პასუხი `payment_events`-ში ინახება ადმინის მეილით; საბოლოო `refunded` callback-ით ან **Sync from bank** ღილაკით მოდის. JWT + `is_admin()` შემოწმება. |

ნაკადი: checkout → `orders` ჩანაწერი (`payment_method = 'card'`, `pending`) → `bog-create-payment` → გადამისამართება `payment.bog.ge`-ზე →
ბანკი აბრუნებს `#payment-result/<orderId>`-ზე → გვერდი კითხულობს სტატუსს (5-ჯერ, 2 წმ ინტერვალით) → `paid` / `failed` (თავიდან ცდის ღილაკით) / `pending` (განახლება).

ბაზის სვეტები `orders`-ზე: `payment_provider`, `bog_order_id`, `bog_redirect_url`, `bog_order_status`, `bog_transaction_id`,
`bog_payer_identifier` (დაფარული ბარათი), `bog_card_type`, `payment_reason`, `paid_at`, `payment_updated_at`.
ბანკის სტატუსების შესაბამისობა: `completed` → `paid`, `rejected`/`blocked` → `failed`, `refunded`/`refunded_partially` → `refunded`; დანარჩენი `pending`-ს არ ცვლის.

Secrets (Supabase → Edge Functions → Secrets):

| სახელი | მნიშვნელობა |
| --- | --- |
| `BOG_CLIENT_ID` | OPAY CLIENT ID — [manager.bog.ge](https://manager.bog.ge/login) → გადახდების მენეჯერი → გადახდის მეთოდების მართვა → ობიექტი (ხედავს მხოლოდ დირექტორი) |
| `BOG_CLIENT_SECRET` | OPAY SECRET KEY — იქვე. **არასდროს** ჩაწერო კოდში ან რეპოზიტორიაში |
| `SITE_URL` | `https://climate-comfort.ge` — სადაც ბანკი მყიდველს აბრუნებს (ლოკალურად: `http://localhost:8000`) |
| `ORDER_EMAIL_FUNCTION` | არასავალდებულო; მეილის ფუნქციის სახელი, ახლა `rapid-action` |
| `BOG_CALLBACK_URL` | არასავალდებულო; ნაგულისხმევი `<SUPABASE_URL>/functions/v1/bog-callback` |

დეპლოი:

1. SQL Editor-ში ხელახლა გაუშვი `supabase-schema.sql` (ამატებს სვეტებს და `payment_events`-ს).
2. დააყენე სამივე ფუნქცია **ზუსტად ამ სახელებით** (`app.js`-ში `BOG_CREATE_FUNCTION` / `BOG_STATUS_FUNCTION` კონსტანტებია, სხვა სახელით დადეპლოიებისას ისინი შეცვალე).
3. **`bog-callback`-ზე გამორთე "Verify JWT"** — ბანკი Supabase-ის ტოკენს არ აგზავნის. დანარჩენ ორზე ჩართული დარჩეს.
4. ჩაწერე Secrets.
5. ტესტი: ბანკს sandbox არ აქვს დოკუმენტირებული — რეალური ბარათით გადაიხადე იაფი პროდუქტი (ან დროებით 1 ₾-იანი ტესტ-პროდუქტი), შეამოწმე ადმინში `paid` + ტრანზაქციის ID, შემდეგ `manager.bog.ge`-დან დააბრუნე თანხა და დარწმუნდი, რომ შეკვეთა `refunded` გახდა.

> Edge Function-ების ლოგები: Supabase → Edge Functions → ფუნქცია → Logs. ყველა callback `payment_events` ცხრილშიც ინახება.

CLI-თ (ერთხელ `npx -y supabase@latest login` ჩვეულებრივ ტერმინალში; პროექტი `qgujhxxezplvnbheaeqs`, იხ. `supabase/config.toml`):

```
npx -y supabase@latest secrets set --project-ref qgujhxxezplvnbheaeqs BOG_CLIENT_ID=... BOG_CLIENT_SECRET=... SITE_URL=https://climate-comfort.ge
npx -y supabase@latest functions deploy bog-callback --no-verify-jwt --project-ref qgujhxxezplvnbheaeqs
npx -y supabase@latest functions deploy bog-create-payment --project-ref qgujhxxezplvnbheaeqs
npx -y supabase@latest functions deploy bog-payment-status --project-ref qgujhxxezplvnbheaeqs
npx -y supabase@latest functions deploy bog-refund --project-ref qgujhxxezplvnbheaeqs
npx -y supabase@latest functions deploy publish-site --project-ref qgujhxxezplvnbheaeqs
# publish-site-ს სჭირდება Cloudflare Pages-ის deploy hook-ის URL (იხ. „ჰოსტინგი და SEO"):
npx -y supabase@latest secrets set PAGES_DEPLOY_HOOK=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/... --project-ref qgujhxxezplvnbheaeqs
```

✅ 2026-10-19: სამივე ფუნქცია დადეპლოიებულია, Secrets ჩაწერილია, სქემა გაშვებულია; ბანკის ტოკენი რეალური კრედენციალებით მიიღება. რეალური გადახდის ტესტი ჯერ არ ჩატარებულა.

---

## ჰოსტინგი და SEO

საიტი სტატიკურია და **Cloudflare Pages**-ზე იდება კლიენტის Cloudflare ანგარიშიდან, GitHub რეპოსთან მიბმით — ყოველი push `main`-ზე ავტომატურად აწყობს და აქვეყნებს.

| პარამეტრი | მნიშვნელობა |
| --- | --- |
| Build command | `sh build.sh` |
| Build output directory | `dist` |
| Node | 18+ (Pages-ის ნაგულისხმევი საკმარისია) |
| Custom domain | `climate-comfort.ge` (`www` → apex redirect rule უკვე არის Cloudflare-ში) |

### რას აკეთებს build-ი (`build.mjs`)

1. აკოპირებს ბრაუზერისთვის საჭირო ფაილებს (`app.js`, `styles.css`, `admin/`, `assets/` …) — Edge Function-ების კოდი, სქემა, README და Excel-ები `dist/`-ში არასდროს ხვდება.
2. Supabase-დან საჯარო anon key-ით იღებს გამოქვეყნებულ პროდუქტებს (იგივე წაკითხვა, რასაც საიტი აკეთებს).
3. კატალოგს JSON-ად ჩააშენებს `index.html`-ში (`#catalog-data`), რომ პირველი ჩატვირთვა და საძიებო სისტემის crawl-ი რეალურ პროდუქტებს ხედავდეს და არა demo-ს.
4. თითოეული პროდუქტისთვის წერს `dist/product/<slug>.html`-ს — თავისი `<title>`, meta description, canonical, Open Graph სურათი, `Product` + `BreadcrumbList` schema და უკვე ჩასმული კონტენტი (სათაური, ფასი, მახასიათებლები). `app.js` ჩატვირთვის შემდეგ იგივე გვერდს „აცოცხლებს". Slug = ბრენდი + მოდელი (`midea-msag-24hrn8`), ზუსტად იგივე წესით, რაც `productSlug()`-ს აქვს `app.js`-ში — ორივე ერთად უნდა შეიცვალოს.
5. წერს `/catalog/ac`, `/catalog/boiler`, `/brand/<brand>` (13 ბრენდი), `/guide/<slug>` (4 სტატია), `/terms`, `/privacy`, `/returns` გვერდებს თავიანთი `<head>`-ით, `404.html`-ს (noindex; Cloudflare-ი არარსებულ მისამართზე მას აბრუნებს 404 სტატუსით, `_redirects`-ში მხოლოდ აპლიკაციის მარშრუტებია გადაწერილი) და `sitemap.xml`-ს (172 URL).
6. პროდუქტის გვერდზე: ხილული breadcrumb (მთავარი › კატეგორია › ბრენდი › პროდუქტი), მახასიათებლებიდან გენერირებული ქართული აბზაცი (უნიკალური ტექსტი ყველა გვერდზე, როცა მომწოდებლის აღწერა არ არის ან მოკლეა) და „მსგავსი პროდუქტები" (6 ბმული იმავე კატეგორიიდან, ჯერ იგივე ბრენდი). იგივე მარკაპს `app.js` აწარმოებს (`renderProductDetailPage`, `generatedDescription`, `relatedProducts`).

> თუ ბაზა ვერ წაიკითხა, build **განზრახ ეცემა** — Cloudflare მაშინ წინა ვერსიას ტოვებს ცოცხლად, პროდუქტების გვერდების გარეშე საიტი არ ქვეყნდება. ლოკალურად უბაზოდ ასაწყობად: `ALLOW_EMPTY_CATALOG=1 node build.mjs`.

### ფასის ან პროდუქტის შეცვლის შემდეგ

საიტის აპლიკაცია ფასებს ბაზიდან ყოველთვის ცოცხლად იღებს, მაგრამ წინასწარ არენდერებული HTML (ის, რასაც Google და სოციალური ქსელები ხედავენ) build-ის დროის მდგომარეობას ინახავს. ამიტომ იმპორტის ან ხელით ცვლილების შემდეგ ადმინ-პანელში **„Publish site"** ღილაკს დააჭირე — `publish-site` Edge Function Cloudflare-ის deploy hook-ს უშვებს და 1–2 წუთში ახალი გვერდები ცოცხალია.

Deploy hook-ის შექმნა (ერთხელ, Pages პროექტის გაკეთების შემდეგ): Cloudflare → Workers & Pages → პროექტი → Settings → Builds → Deploy hooks → Add; URL-ი `PAGES_DEPLOY_HOOK` secret-ად (იხ. CLI ბლოკი ზემოთ). URL კოდში არასდროს — ვისაც აქვს, build-ების გაშვება შეუძლია.

### AI ძიება (ChatGPT, Claude, Perplexity, Gemini) — GEO

AI ასისტენტები საიტს თავიანთი crawler-ებით კითხულობენ (ChatGPT — Bing-ის ინდექსი + `OAI-SearchBot`, Claude — Brave-ის ინდექსი + `Claude-SearchBot`, Perplexity — `PerplexityBot`). „სიაში დამატების" მექანიზმი არცერთ მათგანს არ აქვს — ციტირება დამოკიდებულია იმაზე, რამდენად ადვილად წასაკითხი და კონკრეტულია გვერდები. რაც გაკეთებულია:

- პროდუქტის გვერდები წინასწარ არენდერებულია — AI crawler-ების უმეტესობა JavaScript-ს არ უშვებს, ამიტომ მხოლოდ HTML-ში ჩაწერილ ფასსა და მახასიათებლებს ხედავს.
- `robots.txt` ყველა AI crawler-ს ცალსახად უშვებს (`/admin/`, `/checkout/`, `/account` — არა).
- `llms.txt` — ბიზნესის ფაქტები ერთ ფაილში (მიწოდება, მონტაჟის ფასები, განვადება, გარანტია, საათები, ბრენდები); ახალი სტანდარტია, ზოგი ასისტენტი კითხულობს.
- მთავარ გვერდზე FAQ სექცია + `FAQPage` schema — პირდაპირი პასუხები იმ კითხვებზე, რასაც მომხმარებლები ასისტენტებს უსვამენ.
- Cloudflare → AI Crawl Control: დომენის აქტივაციისას არჩეული იყო „Allow" Search/Agent/Training სამივეზე. აქტივაციის შემდეგ გადაამოწმე, რომ არცერთი AI bot არ იბლოკება (Cloudflare ახალ ზონებზე AI crawler-ების ბლოკვას ნაგულისხმევად სთავაზობს).

⚠ ფასები და პირობები სამ ადგილას მეორდება: FAQ სექცია (`index.html` + `translations` `app.js`-ში), `FAQPage` schema (`index.html` `<head>`) და `llms.txt`. მონტაჟის ფასის ან პოლიტიკის ცვლილებისას სამივე განაახლე.

რჩება დომენის შემდეგ: Bing Webmaster Tools (ChatGPT-ს ინდექსი Bing-ია) — sitemap-ის გაგზავნა; Cloudflare → Caching → Configuration → **Crawler Hints** ჩართვა (IndexNow — Bing-ს ცვლილებებს მყისიერად ატყობინებს; Supplemental Terms-ზე თანხმობაა საჭირო); Google Business Profile და მიმოხილვები — ასისტენტები ლოკალურ ბიზნესს სწორედ აქედან „იცნობენ".

### რა რჩება დომენის გაშვების შემდეგ

- Google Search Console — დომენის დადასტურება Cloudflare DNS-ში TXT ჩანაწერით, `sitemap.xml`-ის გაგზავნა.
- Google Business Profile (მ. გელოვანის ქ. N4) — ლოკალური ძიებისთვის.
- `analytics.js`-ში GA4 / Pixel ID-ები.
- ინდექსირდება მხოლოდ ქართული ვერსია (`<html lang="ka">`, hreflang არ არის). ინგლისური ინტერფეისი გადამრთველით და `?lang=en`-ით იხსნება, მაგრამ იგივე URL-ია; ცალკე `/en/` გვერდები ცალკე სამუშაოა.

---

## Storefront — მნიშვნელოვანი დეტალები

- **გადახდის მეთოდები:** **ბარათით** (Visa / Mastercard, საქართველოს ბანკის გადახდის გვერდზე — იხ. `bog-*` ფუნქციები) და **ადგილზე გადახდა**. განვადების ფორმა ჯერ კიდევ განაცხადია, არა რეალური ონლაინ განვადება. პირადი ნომერი მხოლოდ განვადებისთვისაა საჭირო.
- **გადახდის შედეგის გვერდი:** `#payment-result/<orderId>` — ბანკი აქ აბრუნებს; ანგარიშის გვერდზე გადაუხდელ ბარათის შეკვეთას აქვს „გადახდა" ბმული იმავე გვერდზე.
- **WhatsApp** (+995 571 98 96 69): ფუტერში და მცურავი ღილაკი ყველა გვერდზე. პროდუქტის გვერდზე შეტყობინება წინასწარ ივსება პროდუქტის სახელით (`updateWhatsAppLinks` — `app.js`). ნომერი: `WHATSAPP_NUMBER`.
- **სოციალური ქსელები:** Facebook / Instagram `climatecomfort1` — ფუტერში და JSON-LD `sameAs`-ში.
- **კომპანიის მონაცემები** იურიდიული გვერდებისთვის — `COMPANY` ობიექტი `app.js`-ში.
- **მობილური:** შემოწმებულია 320–1440px სიგანეებზე, ჰორიზონტალური გადადინება არ არის.

---

## ცნობილი დავალიანება

> **2026-10-22 აუდიტი** (სამი დამოუკიდებელი კოდის მიმოხილვა, გამოსწორებული): შეკვეთის მეილი ახლა ერთხელ იგზავნება შეკვეთაზე (`orders.confirmation_sent_at`), მხოლოდ 24 საათის შეკვეთაზე, საათში მაქს. 5 ერთ მისამართზე და ბარათის შეკვეთაზე — მხოლოდ გადახდის შემდეგ; `orders_insert_any` `user_id`-ს მხოლოდ საკუთარს უშვებს; `bog-create-payment` ბარათით გადახდას მხოლოდ რეალურ, გამოქვეყნებულ პროდუქტზე იღებს, თანხას თეთრამდე ამოწმებს და `product_title`-ს თავად წერს; ბანკი ხელმოუწერელ callback-ს ვერ გამოგზავნის (401); ნაწილობრივი refund შეკვეთას `paid`-ად ტოვებს (`bog_order_status = refunded_partially`), დანარჩენის დაბრუნება შესაძლებელია; `fetch-product-details` მხოლოდ ადმინისთვის; storefront-ში მომწოდებლებიდან აღებული ყველა ტექსტი/ბმული escape-დება (`esc()` `app.js`-ში); ფასის ფილტრის ჭერი კატალოგის მაქსიმუმს მიჰყვება (ადრე 4 000 ₾-ზე ძვირი 6 პროდუქტი არ ჩანდა); `/checkout` და `/account` სესიის აღდგენის შემდეგ იტვირთება (Google-იდან დაბრუნება მუშაობს); „პაროლის აღდგენა“ ახალი პაროლის დაყენებამდე მიდის; ანგარიშის წაშლა შეკვეთებს არ აბლოკავს (`on delete set null`).

- **ბარათით გადახდა** — დადეპლოიებულია (2026-10-19), მაგრამ ჯერ **არ არის დატესტილი რეალური გადახდით**: საჭიროა ერთი რეალური გადახდა + დაბრუნება დომენის გაშვების შემდეგ (იხ. `bog-*` სექცია). **ონლაინ განვადება** (`bog_loan` / `bnpl`) ჯერ არ არის ჩართული — განვადების ფორმა განაცხადად რჩება.
- **Refund ადმინიდან** — ღილაკი არის (`bog-refund`, 2026-10-19), მაგრამ რეალურ გადახდაზე ჯერ არ არის გასინჯული; ბანკის refund პასუხის ზუსტი ფორმა დოკუმენტაციაში არ არის, ამიტომ პირველი refund-ის შემდეგ `payment_events`-ში ჩანაწერი შეამოწმე.
- **დომენი და hosting** — `climate-comfort.ge` ჯერ არ არის გაშვებული.
- **მეილები** — Resend-ში დომენის დადასტურება; Supabase Auth → Custom SMTP (ჩაშენებული გამგზავნი საათში ~2-4 წერილითაა შეზღუდული, რაც რეგისტრაციის დადასტურებას შეაფერხებს).
- **ანალიტიკა** — `ANALYTICS_CONFIG` (`analytics.js`) ID-ები ცარიელია.
- **SEO** — ✅ 2026-10-22: რეალური მისამართები + წინასწარ არენდერებული პროდუქტის გვერდები (იხ. „ჰოსტინგი და SEO"). რჩება: Search Console, Business Profile, ანალიტიკის ID-ები, `PAGES_DEPLOY_HOOK` secret-ი Pages პროექტის შექმნის შემდეგ.
- **ფოტოს გარეშე პროდუქტები** — HAIER ×6 (Elit-ის ფაილიდან; ვერცერთ ქართულ საიტზე ვერ მოიძებნა), MIDEA MSAG-24HRN8 და MFM-48FN8D0-Q (Midea-ს ფაილში ბმული არასწორია/აკლია). ფოტოები მომწოდებლებს უნდა ვთხოვოთ.
- **ფოტოები მომწოდებლების სერვერებზე** — 149 პროდუქტის ფოტო ჯერ კიდევ მომწოდებლების (isurve.ge, kontakt.ge …) ბმულებზეა. ადმინ-პანელში **„Copy photos (N)"** ღილაკი ერთხელ უნდა დაიჭიროს (ბაზიდან ჩვენს Storage-ში გადაწერს, ~10 პროდუქტი თითო წრეზე, თავისით მეორდება ბოლომდე), შემდეგ „Publish site". ახალ იმპორტებზე ეს ავტომატურია.

---

## ენები

საიტი ორენოვანია (ქართული / ინგლისური). თარგმანები `app.js`-ის თავში, `translations` ობიექტში. სტატიკური ტექსტი `data-i18n` ატრიბუტით ინიშნება, დინამიური — `t("key")` ფუნქციით.

> JavaScript-ის `toUpperCase()` ქართულ ტექსტს მთავრულად აქცევს (`მილით` → `ᲛᲘᲚᲘᲗ`). ქართული სტრიქონები ამ ფუნქციით არ გადაიყვანო.
