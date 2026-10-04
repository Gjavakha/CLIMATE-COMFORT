# Climate Comfort

კონდიციონერებისა და ცენტრალური გათბობის ქვაბების ონლაინ მაღაზია — storefront + ადმინ პანელი.

Static HTML/CSS/JavaScript, framework-ის გარეშე. Backend — [Supabase](https://supabase.com) (PostgreSQL, Auth, Edge Functions). ცალკე backend სერვერი არ არსებობს.

---

## სწრაფი გაშვება

```bash
git clone https://github.com/Gjavakha/CLIMATE-COMFORT.git
cd CLIMATE-COMFORT
```

შემდეგ გაუშვი ლოკალური სერვერი (Windows):

```powershell
.\server.ps1            # http://localhost:8000
.\server.ps1 -Port 8123 # თუ 8000 დაკავებულია
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
| `index.html` | მთელი storefront ერთ ფაილში; ნავიგაცია hash routing-ით (`#catalog`, `#product/<id>`, `#checkout/<id>`, `#account`, `#terms`) |
| `app.js` | storefront-ის ლოგიკა — კატალოგი, ფილტრები, კალათა, ავტორიზაცია, checkout, ორენოვნება (KA/EN) |
| `styles.css` | მთელი სტილი |
| `analytics.js` | GA4 + Meta Pixel, cookie თანხმობის უკან |
| `supabase-config.js` | Supabase-ის URL და საჯარო anon key |
| `supabase-schema.sql` | ბაზის სრული სქემა — ცხრილები, RLS პოლიტიკები, ტრიგერები |
| `admin/` | ადმინ პანელი — შეკვეთები, ჯავშნები, ფასების იმპორტი Excel-იდან |
| `supabase/functions/fetch-product-details/` | Edge Function — პროდუქტის ფოტოებისა და მახასიათებლების ავტომატური მოძიება |
| `server.ps1` | ლოკალური სტატიკური სერვერი დეველოპმენტისთვის |

---

## Backend

### დაყენება

1. შექმენი Supabase პროექტი
2. SQL Editor-ში გაუშვი `supabase-schema.sql`
3. `supabase-config.js`-ში ჩაწერე შენი `SUPABASE_URL` და anon key
4. `admin_emails` ცხრილში დაამატე ადმინის ელ. ფოსტა
5. Authentication → Providers → Email ჩართე

დეტალები: [`SUPABASE-SETUP.md`](SUPABASE-SETUP.md)

### ცხრილები

| ცხრილი | შიგთავსი | წვდომა |
| --- | --- | --- |
| `products` | კანონიკური პროდუქტები (brand + model უნიკალურია), ფასი, ფოტოები, მახასიათებლები | საჯარო წაკითხვა; ჩაწერა — ადმინი |
| `supplier_offers` | თითო მომწოდებლის ფასები, **ჩვენი თვითღირებულების ჩათვლით** | მხოლოდ ადმინი |
| `suppliers` | მომწოდებლები (Elit, Kontakt, Chigo, Alneo) | მხოლოდ ადმინი |
| `import_batches` | ატვირთული ფაილების ჟურნალი | მხოლოდ ადმინი |
| `orders` | შეკვეთები | მფლობელი ხედავს თავისას; ადმინი ყველას |
| `profiles` | მომხმარებლის მიწოდების მონაცემები + ბარათის ბოლო 4 ციფრი | მფლობელი; ადმინი |
| `service_bookings` | სამონტაჟო სერვისის ჯავშნები | ჩაწერა — ყველა; კითხვა — ადმინი |
| `admin_emails` | ვისაც აქვს ადმინის უფლება | მხოლოდ ადმინი |

### უსაფრთხოება

ყველა ცხრილზე ჩართულია **Row Level Security**. `is_admin()` ფუნქცია ამოწმებს, არის თუ არა მომხმარებლის ელ. ფოსტა `admin_emails`-ში.

`supabase-config.js`-ში არსებული anon key **საჯაროა დიზაინით** — ის მხოლოდ პროექტს აიდენტიფიცირებს, მონაცემებს კი RLS იცავს. `service_role` გასაღები არასდროს უნდა მოხვდეს კლიენტის კოდში.

---

## ფასების იმპორტი

ადმინ პანელი კითხულობს მომწოდებლების Excel ფაილებს ბრაუზერშივე ([SheetJS](https://sheetjs.com)), ავტომატურად ცნობს რომელი მომწოდებლისაა და აჩვენებს diff-ს (ახალი პროდუქტები, ფასის ცვლილებები, ფაილიდან გამქრალი პოზიციები) — **ბაზაში არაფერი იწერება, სანამ ადმინი არ დაადასტურებს**.

პროფილები (რომელი sheet, რომელი სვეტები, ფასის წესი) — `admin/importer-profiles.js`.

მხარდაჭერილია: Elit Electronics, Kontakt, Chigo, Alneo.ge

> ⚠️ ფასიანი სიები შეიცავს ჩვენს თვითღირებულებას — `.gitignore` მიზანმიმართულად კეტავს `*.xlsx` და `*.xls` ფაილებს. არასდროს დაამატო ისინი რეპოზიტორიაში.

---

## პროდუქტის მონაცემების ავტომატური შევსება

`supabase/functions/fetch-product-details/` — Edge Function, რომელიც ბრენდითა და მოდელით ეძებს ფოტოებსა და ტექნიკურ მახასიათებლებს სამ წყაროში:

1. მომწოდებლის საკუთარი გვერდი (Elit — Next.js `__NEXT_DATA__`, Kontakt — Magento HTML)
2. Kontakt.ge-ზე ძებნა
3. isurve.ge (Shopify JSON API)

**ცნობილი შეზღუდვა:** ee.ge და isurve.ge დატაცენტრის IP-ებს აბლოკებენ (403 / 429), ამიტომ Edge Function-იდან ეს ორი წყარო არ მუშაობს, თუმცა საოჯახო IP-დან პასუხობს. ამჟამად ეს პროდუქტები ერთჯერადი SQL-ით შეივსო.

---

## ცნობილი დავალიანება

- **გადახდა იმიტირებულია** (`app.js`, „Mock card processing") — რეალური PSP ინტეგრაცია არ არის; საჭიროა TBC/BOG e-Commerce
- **SPA და SEO** — პროდუქტების გვერდები hash route-ებზეა, ამიტომ ცალკე არ ინდექსირდება; საჭიროა History API + ჰოსტინგის rewrite
- **7 პროდუქტი ფოტოს გარეშე** (HAIER, MIDEA MSAB-36HRFN8) — ვერცერთ ქართულ საიტზე ვერ მოიძებნა
- **შეკვეთის დადასტურების მეილი** არ იგზავნება
- `COMPANY` (`app.js`) და `ANALYTICS_CONFIG` (`analytics.js`) ჯერ placeholder მნიშვნელობებს შეიცავს

---

## ენები

საიტი ორენოვანია (ქართული / ინგლისური). თარგმანები `app.js`-ის თავში, `translations` ობიექტში. სტატიკური ტექსტი `data-i18n` ატრიბუტით ინიშნება, დინამიური — `t("key")` ფუნქციით.
