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
| `index.html` | მთელი storefront ერთ ფაილში; ნავიგაცია hash routing-ით (`#catalog`, `#product/<id>`, `#checkout/<id>`, `#account`, `#terms`, `#privacy`, `#returns`) |
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
| `supabase/config.toml` | Supabase CLI კონფიგი — `bog-callback`-ზე JWT შემოწმება გამორთულია |
| `robots.txt`, `sitemap.xml` | SEO |
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
```

✅ 2026-10-19: სამივე ფუნქცია დადეპლოიებულია, Secrets ჩაწერილია, სქემა გაშვებულია; ბანკის ტოკენი რეალური კრედენციალებით მიიღება. რეალური გადახდის ტესტი ჯერ არ ჩატარებულა.

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

- **ბარათით გადახდა** — დადეპლოიებულია (2026-10-19), მაგრამ ჯერ **არ არის დატესტილი რეალური გადახდით**: საჭიროა ერთი რეალური გადახდა + დაბრუნება დომენის გაშვების შემდეგ (იხ. `bog-*` სექცია). **ონლაინ განვადება** (`bog_loan` / `bnpl`) ჯერ არ არის ჩართული — განვადების ფორმა განაცხადად რჩება.
- **Refund ადმინიდან** — ღილაკი არის (`bog-refund`, 2026-10-19), მაგრამ რეალურ გადახდაზე ჯერ არ არის გასინჯული; ბანკის refund პასუხის ზუსტი ფორმა დოკუმენტაციაში არ არის, ამიტომ პირველი refund-ის შემდეგ `payment_events`-ში ჩანაწერი შეამოწმე.
- **დომენი და hosting** — `climate-comfort.ge` ჯერ არ არის გაშვებული.
- **მეილები** — Resend-ში დომენის დადასტურება; Supabase Auth → Custom SMTP (ჩაშენებული გამგზავნი საათში ~2-4 წერილითაა შეზღუდული, რაც რეგისტრაციის დადასტურებას შეაფერხებს).
- **ანალიტიკა** — `ANALYTICS_CONFIG` (`analytics.js`) ID-ები ცარიელია.
- **SPA და SEO** — პროდუქტების გვერდები hash route-ებზეა, ამიტომ ცალკე არ ინდექსირდება; საჭიროა History API + ჰოსტინგის rewrite.
- **ფოტოს გარეშე პროდუქტები** — HAIER ×6 (Elit-ის ფაილიდან; ვერცერთ ქართულ საიტზე ვერ მოიძებნა), MIDEA MSAG-24HRN8 და MFM-48FN8D0-Q (Midea-ს ფაილში ბმული არასწორია/აკლია). ფოტოები მომწოდებლებს უნდა ვთხოვოთ.

---

## ენები

საიტი ორენოვანია (ქართული / ინგლისური). თარგმანები `app.js`-ის თავში, `translations` ობიექტში. სტატიკური ტექსტი `data-i18n` ატრიბუტით ინიშნება, დინამიური — `t("key")` ფუნქციით.

> JavaScript-ის `toUpperCase()` ქართულ ტექსტს მთავრულად აქცევს (`მილით` → `ᲛᲘᲚᲘᲗ`). ქართული სტრიქონები ამ ფუნქციით არ გადაიყვანო.
