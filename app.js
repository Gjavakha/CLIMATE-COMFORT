/* ==========================================================================
   Climate Comfort Core Logic (Localized) - app.js
   ========================================================================== */

// 1. Translation Dictionary
const translations = {
    ka: {
        "doc-title": "Climate Comfort | პრემიუმ გათბობა & კონდიცირება",
        "search-placeholder": "ძებნა (მაგ. Samsung, Bosch)...",
        "nav-shop": "პროდუქცია",
        "nav-ac": "კონდიციონერები",
        "nav-boiler": "ცენტრალური გათბობის ქვაბები",
        "nav-financing": "განვადება",
        "nav-booking": "სერვისები",
        "nav-why-us": "რატომ ჩვენ",
        
        "hero-tagline": "პრემიუმ კლიმატური ტექნიკა საქართველოში",
        "hero-title": "შეინარჩუნეთ სიგრილე ზაფხულში, სითბო ზამთარში",
        "hero-description": "აღმოაჩინეთ ინტელექტუალური კონდიციონერებისა და ცენტრალური გათბობის ქვაბების ფართო არჩევანი, ისარგებლეთ მყისიერი 0%-იანი განვადებით და პროფესიონალური მონტაჟით.",
        "hero-cta-explore": "კატალოგის ნახვა",
        "hero-cta-service": "დაჯავშნე სერვისი",
        
        "hero-stat1-title": "სწრაფი მიწოდება",
        "hero-stat1-desc": "უფასო თბილისის მასშტაბით",
        "hero-stat2-title": "0%-იანი განვადება",
        "hero-stat2-desc": "6 თვემდე უპროცენტო",
        "hero-stat3-title": "3-წლიანი გარანტია",
        "hero-stat3-desc": "ყველა მოდელზე",
        
        "whyus-header": "რატომ Climate Comfort?",
        "whyus-subheader": "ჩვენ გთავაზობთ სრულ სერვისს: ყიდვიდან დაწყებული, პროფესიონალურ მონტაჟსა და ყოველწლიურ მოვლამდე.",
        "whyus-f1-title": "ენერგოეფექტურობა",
        "whyus-f1-desc": "ჩვენ ორიენტირებული ვართ მაღალი ენერგოკლასის (A++ და A+++) კონდიციონერებსა და კონდენსაციურ გათბობის ქვაბებზე.",
        "whyus-f2-title": "ოფიციალური გარანტია",
        "whyus-f2-desc": "ყველა შესყიდვაზე ვრცელდება მწარმოებლის ოფიციალური გარანტია და ჩვენი სამონტაჟო სამუშაოების ხარისხის გარანტია.",
        "whyus-f3-title": "მოქნილი განვადება",
        "whyus-f3-desc": "მიიღეთ მყისიერი დასტური საქართველოს ბანკისგან ან თიბისისგან თქვენთვის მოსახერხებელი პირობებით.",
        "whyus-f4-title": "სერტიფიცირებული ტექნიკოსები",
        "whyus-f4-desc": "ჩვენი პროფესიონალი გუნდი სრულად ლიცენზირებულია ნებისმიერი ტიპის კლიმატური ტექნიკის დასამონტაჟებლად.",
        
        "mobile-filter-btn": "ფილტრები",
        "filters-title": "ფილტრები",
        "filters-reset": "ყველას გასუფთავება",
        "filters-reset-short": "გასუფთავება",
        "filters-apply-btn": "ფილტრების გამოყენება",
        "filter-price": "ფასი (₾)",
        "filter-brand": "ბრენდი",
        "filter-area": "რეკომენდებული ფართი",
        "filter-btu": "სიმძლავრე",
        "filter-inverter": "ტექნოლოგია",
        "filter-inverter-yes": "ინვერტორი / კონდენსაციური",
        "filter-inverter-no": "სტანდარტული (On/Off)",
        "filter-energy": "ენერგოკლასი",
        "filter-color": "ფერი",
        "filter-category": "კატეგორია",
        
        "category-all": "ყველა პროდუქტი",
        "category-ac": "კონდიციონერები",
        "category-boiler": "ცენტრალური გათბობის ქვაბები",
        
        "catalog-showing": "ნაჩვენებია",
        "catalog-unit": "პროდუქტი",
        "catalog-sort-label": "სორტირება:",
        "sort-popular": "პოპულარობით",
        "sort-price-asc": "ფასი: ზრდადობით",
        "sort-price-desc": "ფასი: კლებადობით",
        "sort-btu-desc": "სიმძლავრე: კლებადობით",
        "active-filters-title": "აქტიური ფილტრები:",
        
        "empty-title": "პროდუქცია ვერ მოიძებნა",
        "empty-desc": "შეცვალეთ ფილტრის პარამეტრები ან საძიებო სიტყვა.",
        "empty-reset-btn": "ფილტრების გასუფთავება",
        
        "finance-badge": "განვადება",
        "finance-title": "ხელმისაწვდომი განვადების პირობები",
        "finance-description": "ნუ გადადებთ კომფორტს. შეიძინეთ სასურველი პროდუქტი დღესვე და გადაიხადეთ ეტაპობრივად. ჩვენ ვთანამშრომლობთ წამყვან ქართულ ბანკებთან, რათა შემოგთავაზოთ საუკეთესო პირობები, მათ შორის 0%-იანი უპროცენტო განვადება.",
        "bank-promo-bog": "6 თვემდე 0%",
        "bank-promo-tbc": "3 თვემდე 0%",
        
        "calc-preview-header": "განვადების კალკულატორი",
        "calc-preview-help": "კალკულატორის გამოსაყენებლად და სასურველი განვადების პირობების მოსარგებად, დააჭირეთ „ყიდვა“ ღილაკს ნებისმიერი პროდუქტის ბარათზე და აირჩიეთ განვადება.",
        "calc-preview-label-cost": "ღირებულება",
        "calc-preview-label-monthly": "ყოველთვიური",
        "calc-preview-cta": "შეარჩიეთ პროდუქტი განვადებისთვის",
        
        "booking-header-title": "დაჯავშნეთ სერვისი",
        "booking-header-desc": "გჭირდებათ პროფესიონალური მონტაჟი ან მოვლა? გამოთვალეთ ღირებულება რეალურ დროში და დაჯავშნეთ ხელოსანი სასურველ დღეს.",
        "booking-form-title": "სერვისის დეტალები",
        "booking-label-service": "აირჩიეთ სერვისი",
        "booking-label-capacity": "სიმძლავრე",
        "booking-label-extra": "დამატებითი სერვისები",
        
        "srv-standard-install": "კონდიციონერის მონტაჟი",
        "srv-dismantle": "კონდიციონერის დემონტაჟი",
        "srv-refill": "ფრეონის შევსება",
        "srv-maintenance": "კონდიციონერის პროფილაქტიკა",
        "srv-boiler-install": "გათბობის ქვაბის მონტაჟი",
        "srv-boiler-maintenance": "გათბობის ქვაბის სერვისი/გაწმენდა",
        
        "booking-extra-brackets": "გარე ბლოკის კრონშტეინი (+30 ₾)",
        "booking-extra-pipe": "დამატებითი მილი (1 მეტრი) (+45 ₾)",
        "booking-extra-dismantle": "ძველი აპარატის დემონტაჟი (+50 ₾)",
        "booking-extra-boiler-filter": "მაგნიტური ფილტრი ქვაბისთვის (+80 ₾)",
        
        "booking-label-date": "სასურველი თარიღი",
        "booking-label-time": "სასურველი დრო",
        "booking-time-default": "აირჩიეთ დროის მონაკვეთი",
        "booking-time-morning": "დილა (09:00 - 13:00)",
        "booking-time-afternoon": "შუადღე (13:00 - 17:00)",
        "booking-time-evening": "საღამო (17:00 - 20:00)",
        
        "booking-customer-title": "საკონტაქტო ინფორმაცია",
        "booking-label-name": "სახელი და გვარი",
        "booking-label-phone": "ტელეფონი",
        "booking-label-address": "სერვისის მისამართი",
        "booking-label-notes": "დამატებითი შენიშვნა",
        
        "booking-name-placeholder": "მაგ. გიორგი",
        "booking-phone-placeholder": "მაგ. +995 5xx xx xx xx",
        "booking-address-placeholder": "მაგ. რუსთაველის გამზ. 15, თბილისი",
        "booking-notes-placeholder": "მოგვიყევით კედლის ტიპზე, სიმაღლეზე, ქვაბის/კონდიციონერის ბრენდზე ან სპეციალურ მოთხოვნებზე...",
        "booking-submit-btn": "დაჯავშნე პროფესიონალური სერვისი",
        
        "calc-summary-title": "ფასის კალკულატორი",
        "calc-summary-btu-adjust": "სიმძლავრის კორექტირება",
        "calc-summary-brackets": "დამატებითი დეტალები/აქსესუარები",
        "calc-summary-pipe": "დამატებითი მილი/კომუნიკაცია",
        "calc-summary-dismantle": "დემონტაჟის სერვისი",
        "calc-summary-total": "ჯამური ღირებულება",
        
        "booking-disclaimer": "სამონტაჟო სამუშაოების დეტალებს ჩვენი სპეციალისტი ადგილზე შეამოწმებს მუშაობის დაწყებამდე. ნებისმიერი დამატებითი ხარჯი გამოითვლება ზუსტი გაზომვის საფუძველზე.",
        
        "trust-certified": "სერტიფიცირებული გუნდი",
        "trust-warranty": "გარანტია სამუშაოზე",
        
        "cart-title": "თქვენი კალათა",
        "cart-empty": "კალათა ცარიელია.",
        "cart-shop-now": "კატალოგში დაბრუნება",
        "cart-subtotal": "ჯამი:",
        "cart-help": "მიწოდება თბილისში უფასოა. გადაიხადეთ ბარათით ან ისარგებლეთ განვადებით.",
        "cart-standard-checkout": "სტანდარტული შეკვეთა",
        "cart-finance-checkout": "განვადებით ყიდვა",
        
        "checkout-label-name": "სახელი და გვარი",
        "checkout-label-phone": "ტელეფონი",
        "checkout-label-address": "მიწოდების მისამართი",
        "checkout-label-idnum": "პირადი ნომერი (11 ნიშნა)",
        
        "checkout-name-placeholder": "გიორგი",
        "checkout-phone-placeholder": "+995 5xx xx xx xx",
        "checkout-address-placeholder": "მისამართი თბილისში...",
        "checkout-idnum-placeholder": "ბანკის კრედიტის შემოწმებისთვის...",
        "checkout-submit-btn": "შეკვეთის დადასტურება",
        
        "success-close": "დასრულება",
        
        "pay-method-title": "აირჩიეთ გადახდის მეთოდი",
        "pay-method-card": "ბარათით გადახდა",
        "pay-method-card-desc": "სწრაფი და უსაფრთხო გადახდა ნებისმიერი ბანკის ბარათით",
        "pay-method-finance": "განვადებით ყიდვა",
        "pay-method-finance-desc": "ონლაინ განვადება 0%-დან საქართველოს ბანკის ან თიბისის მეშვეობით",
        
        // Dynamic labels
        "ac-type-split": "სპლიტ სისტემა",
        "ac-type-portable": "დასადგამი",
        "card-buy": "ყიდვა",
        "stock-in": "მარაგშია",
        "stock-low": "ბოლო ერთეულები",
        "card-buy-credit": "განვადებით ყიდვა",
        "card-monthly-est": "განვადება თვეში",
        "card-add-cart": "კალათაში დამატება",

        // Product detail page
        "detail-back": "კატალოგში დაბრუნება",
        "detail-desc": "აღწერა",
        "detail-specs": "მახასიათებლები",
        "detail-features": "ძირითადი ფუნქციები",
        "detail-install-title": "პროფესიონალური მონტაჟი",
        "detail-install-desc": "დაამატეთ მონტაჟის სერვისი — ჩვენი სერტიფიცირებული ტექნიკოსი დაგიმონტაჟებთ თქვენთვის სასურველ დღეს.",
        "detail-install-note": "ღირებულება დამოკიდებულია სამუშაოს სირთულეზე. გადახდა ხდება მხოლოდ მონტაჟის დასრულების შემდეგ, ადგილზე — ონლაინ გადახდა საჭირო არ არის.",
        "detail-install-btn": "მონტაჟის დაჯავშნა",
        "spec-brand": "ბრენდი",
        "spec-capacity": "სიმძლავრე",
        "spec-area": "რეკომენდებული ფართობი",
        "spec-type": "ტიპი",
        "spec-color": "ფერი",
        "spec-energy": "ენერგოკლასი",
        "spec-tech": "ტექნოლოგია",

        // Auth (register / login) modal
        "auth-title-login": "შესვლა",
        "auth-title-register": "რეგისტრაცია",
        "auth-subtitle": "შესყიდვის გასაგრძელებლად საჭიროა ავტორიზაცია",
        "auth-email": "ელ. ფოსტა",
        "auth-password": "პაროლი",
        "auth-login-btn": "შესვლა",
        "auth-register-btn": "რეგისტრაცია",
        "auth-google-btn": "Google-ით გაგრძელება",
        "auth-or": "ან",
        "auth-google-title": "Google ანგარიშით გაგრძელება",
        "auth-google-hint": "შეიყვანეთ თქვენი Google ელ. ფოსტა",
        "auth-google-continue": "გაგრძელება",
        "auth-switch-to-register": "არ გაქვთ ანგარიში?",
        "auth-switch-to-login": "უკვე გაქვთ ანგარიში?",
        "auth-err-exists": "ამ ელ. ფოსტით ანგარიში უკვე არსებობს",
        "auth-err-invalid": "ელ. ფოსტა ან პაროლი არასწორია",
        "auth-err-offline": "სერვერთან კავშირი ვერ დამყარდა. სცადეთ მოგვიანებით.",
        "auth-forgot": "დაგავიწყდათ პაროლი?",
        "auth-reset-sent": "პაროლის აღდგენის ბმული გამოგზავნილია ელ. ფოსტაზე.",
        "auth-confirm-sent": "დადასტურების ბმული გამოგზავნილია ელ. ფოსტაზე. გთხოვთ, გახსნათ იგი რეგისტრაციის დასასრულებლად.",
        "acc-email-confirm": "დადასტურების ბმული გამოგზავნილია ახალ ელ. ფოსტაზე. მისამართი შეიცვლება მას შემდეგ, რაც ბმულს გახსნით.",
        "acc-status-confirmed": "დადასტურებულია",
        "acc-status-delivering": "მიწოდებაში",
        "acc-status-completed": "დასრულებულია",
        "acc-status-cancelled": "გაუქმებულია",
        "auth-err-email": "შეიყვანეთ სწორი ელ. ფოსტა",
        "auth-err-password": "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო",
        "auth-logout-confirm": "გსურთ ანგარიშიდან გასვლა?",
        "auth-guest-btn": "რეგისტრაციის გარეშე გაგრძელება",
        "co-guest-label": "სტუმრის რეჟიმი",

        // Full-page checkout
        "co-title": "შეკვეთის გაფორმება",
        "co-signed-as": "ავტორიზებული:",
        "co-logout": "გასვლა",
        "co-details-header": "მიმღების მონაცემები",
        "co-firstname": "სახელი",
        "co-lastname": "გვარი",
        "co-phone": "ტელეფონის ნომერი",
        "co-address": "მისამართი",
        "co-idnum": "პირადი ნომერი",
        "co-install-toggle": "მჭირდება მონტაჟის სერვისი",
        "co-payment-header": "გადახდის მეთოდი",
        "co-pay-card-desc": "ბარათით გადახდა",
        "co-pay-cash": "ნაღდი ანგარიშსწორება",
        "co-pay-cash-desc": "გადაიხადეთ კურიერთან ჩაბარებისას",
        "co-idnum-hint": "საჭიროა მხოლოდ განვადებისთვის — ბარათით ან ნაღდით გადახდისას შეგიძლიათ გამოტოვოთ",
        "co-order-btn": "შეკვეთის გაფორმება",
        "co-summary-header": "თქვენი შეკვეთა",
        "co-total": "ჯამი:",
        "co-install-line": "მონტაჟი:",
        "co-install-onsite": "ადგილზე გადახდა",
        "co-delivery-note": "მიწოდებას სჭირდება 2-5 სამუშაო დღე",
        "co-pay-btn": "გადახდა",

        // Footer
        "footer-text": "გთავაზობთ საიმედო გათბობისა და კონდიცირების სისტემებს საქართველოს მასშტაბით. უმაღლესი ხარისხი, სწრაფი სერვისი, მორგებული განვადება.",
        "footer-products-title": "პროდუქცია და სერვისი",
        "footer-prod-1": "კონდიციონერები",
        "footer-prod-2": "ცენტრალური გათბობის ქვაბები",
        "footer-services-title": "სერვისები",
        "footer-serv-1": "კონდიციონერის მონტაჟი",
        "footer-serv-2": "გათბობის ქვაბის მონტაჟი",
        "footer-serv-3": "ფრეონით შევსება / მოვლა",
        "footer-serv-4": "სრული პროფილაქტიკა",
        "meta-description": "კონდიციონერები და ცენტრალური გათბობის ქვაბები საქართველოში — Samsung, LG, Midea, Bosch, Gree და სხვა. ოფიციალური გარანტია, პროფესიონალური მონტაჟი, 0%-იანი განვადება და უფასო მიწოდება თბილისში.",
        "footer-legal-title": "წესები და პირობები",
        "footer-terms": "წესები და პირობები",
        "footer-privacy": "კონფიდენციალურობის პოლიტიკა",
        "footer-returns": "დაბრუნება და გარანტია",
        "footer-cookies": "Cookie პარამეტრები",
        "footer-follow-title": "გამოგვყევი",
        "whatsapp-cta": "მოგვწერეთ",
        "whatsapp-aria": "მოგვწერეთ WhatsApp-ზე",
        "whatsapp-msg-general": "გამარჯობა! მაინტერესებს თქვენი პროდუქცია.",
        "whatsapp-msg-product": "გამარჯობა! მაინტერესებს ეს პროდუქტი:",
        "footer-contact-title": "დაგვიკავშირდი",
        "footer-workhours": "ორშ - შაბ: 09:00 - 20:00",
        "footer-copyright": "საავტორო უფლება © 2026 Climate Comfort. ყველა უფლება დაცულია",
        "footer-made-by": "Powered by",

        // Homepage rails + brand strip
        "rail-midea": "Midea კოლექცია",
        "rail-best": "გაყიდვების ლიდერები",
        "rail-deals": "საუკეთესო შეთავაზებები",
        "rail-budget": "საბიუჯეტო არჩევანი",
        "brands-title": "ბრენდები",
        "co-processing": "მუშავდება...",
        "co-err-id": "პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან",
        "co-err-phone": "შეიყვანეთ სწორი ტელეფონის ნომერი",
        "co-success-title": "გადახდა წარმატებულია!",
        "co-success-msg": "თქვენი შეკვეთა მიღებულია. დეტალებს მიიღებთ ელ. ფოსტაზე.",
        "co-success-install": "მონტაჟის მოთხოვნა მიღებულია — ღირებულებას გადაიხდით ადგილზე, მონტაჟის დასრულების შემდეგ.",

        // Account page
        "acc-title": "ჩემი ანგარიში",
        "acc-nav-orders": "ჩემი შეკვეთები",
        "acc-nav-details": "პირადი მონაცემები",
        "acc-nav-security": "ანგარიშის უსაფრთხოება",
        "acc-orders-empty": "შეკვეთები ჯერ არ გაქვთ",
        "acc-status-received": "მიღებულია",
        "acc-save": "შენახვა",
        "acc-saved": "შენახულია",
        "acc-current-password": "მიმდინარე პაროლი",
        "acc-new-password": "ახალი პაროლი",
        "acc-change-password": "პაროლის შეცვლა",
        "acc-change-email": "ელ. ფოსტის შეცვლა",
        "acc-pass-changed": "პაროლი შეიცვალა",
        "acc-err-current": "მიმდინარე პაროლი არასწორია",
        "acc-google-note": "თქვენ Google ანგარიშით ხართ ავტორიზებული — ელ. ფოსტა და პაროლი Google-იდან იმართება.",

        "calc-modal-title": "განვადების კალკულატორი",
        "calc-modal-cost-label": "პროდუქტის ფასი:",
        "calc-modal-select-bank": "აირჩიეთ ბანკი",
        "calc-modal-down-payment": "თანამონაწილეობა (₾) - არასავალდებულო",
        "calc-modal-term": "განვადების ვადა: {0} თვე",
        "calc-modal-res-monthly": "ყოველთვიური გადასახადი",
        "calc-modal-res-financed": "განვადების თანხა:",
        "calc-modal-res-downpaid": "თანამონაწილეობა:",
        "calc-modal-res-rate": "ყოველთვიური პროცენტი:",
        "calc-modal-res-interest": "ჯამური პროცენტი:",
        "calc-modal-res-total": "სულ გადასახდელი:",
        "calc-modal-submit": "განვადების მოთხოვნა",
        
        "month-unit": "თვ",
        "inverter-label": "ინვერტორი",
        "inverter-yes": "დიახ",
        "inverter-no": "არა",
        
        // Colors KA
        "White": "თეთრი",
        "Black": "შავი",
        "Silver": "ვერცხლისფერი",
        
        // Area unit
        "sqm": "კვ.მ"
    },
    en: {
        "doc-title": "Climate Comfort | Premium Heating & Air Conditioning",
        "search-placeholder": "Search products (e.g. Samsung, Bosch)...",
        "nav-shop": "Products",
        "nav-ac": "Air Conditioners",
        "nav-boiler": "Central Heating Boilers",
        "nav-financing": "Financing",
        "nav-booking": "Services",
        "nav-why-us": "Why Us",
        
        "hero-tagline": "Premium Climate Solutions in Georgia",
        "hero-title": "Stay Cool in Summer, Warm in Winter",
        "hero-description": "Explore the widest selection of intelligent air conditioners and central heating boilers with instant 0% financing and professional installation service.",
        "hero-cta-explore": "Explore Catalog",
        "hero-cta-service": "Book Service",
        
        "hero-stat1-title": "Same-Day Delivery",
        "hero-stat1-desc": "Free within Tbilisi",
        "hero-stat2-title": "0% Installments",
        "hero-stat2-desc": "Up to 6 months promo",
        "hero-stat3-title": "3-Year Warranty",
        "hero-stat3-desc": "On all models",
        
        "whyus-header": "Why Choose Climate Comfort?",
        "whyus-subheader": "We provide full-cycle services: from buying advice to professional installation and annual maintenance.",
        "whyus-f1-title": "Energy Efficiency",
        "whyus-f1-desc": "We focus on high energy-class air conditioners and premium condensing central heating boilers.",
        "whyus-f2-title": "Official Warranty",
        "whyus-f2-desc": "Every purchase comes with an official manufacturer's warranty and our installation quality guarantee.",
        "whyus-f3-title": "Flexible Financing",
        "whyus-f3-desc": "Get instant approval from TBC Bank or Bank of Georgia with options up to 36 months.",
        "whyus-f4-title": "Certified Technicians",
        "whyus-f4-desc": "Our professional crew is fully licensed to install and maintain all major heating and cooling brands.",
        
        "mobile-filter-btn": "Filters",
        "filters-title": "Filters",
        "filters-reset": "Reset All",
        "filters-reset-short": "Clear all",
        "filters-apply-btn": "Apply Filters",
        "filter-price": "Price (₾)",
        "filter-brand": "Brand",
        "filter-area": "Recommended Area",
        "filter-btu": "Capacity",
        "filter-inverter": "Technology",
        "filter-inverter-yes": "Inverter / Condensing",
        "filter-inverter-no": "On/Off (Standard)",
        "filter-energy": "Energy Class",
        "filter-color": "Color",
        "filter-category": "Category",
        
        "category-all": "All Products",
        "category-ac": "Air Conditioners",
        "category-boiler": "Central Heating Boilers",
        
        "catalog-showing": "Showing",
        "catalog-unit": "products",
        "catalog-sort-label": "Sort by:",
        "sort-popular": "Popularity",
        "sort-price-asc": "Price: Low to High",
        "sort-price-desc": "Price: High to Low",
        "sort-btu-desc": "Capacity: High to Low",
        "active-filters-title": "Active filters:",
        
        "empty-title": "No Products Found",
        "empty-desc": "Try broadening your filter criteria or searching for something else.",
        "empty-reset-btn": "Reset All Filters",
        
        "finance-badge": "Financing Option",
        "finance-title": "Affordable Installment Plans",
        "finance-description": "Don't put off your comfort. Buy any product today and pay in easy monthly installments. We partner with the leading banks in Georgia to offer you the best rates, including 0% interest promo periods.",
        "bank-promo-bog": "Up to 6 Months 0%",
        "bank-promo-tbc": "Up to 3 Months 0%",
        
        "calc-preview-header": "Financing Calculator",
        "calc-preview-help": "Select 'Buy' on any product card above to open the payment options, then choose the financing calculator to customize your installment terms.",
        "calc-preview-label-cost": "Product Cost",
        "calc-preview-label-monthly": "Monthly Payment",
        "calc-preview-cta": "Select Product to Finance",
        
        "booking-header-title": "Book Service & Installation",
        "booking-header-desc": "Need a professional setup? Estimate your costs in real-time and book a certified installation crew on your preferred date.",
        "booking-form-title": "Service Details",
        "booking-label-service": "Select Service",
        "booking-label-capacity": "Capacity",
        "booking-label-extra": "Additional Options",
        
        "srv-standard-install": "AC Installation",
        "srv-dismantle": "AC Dismantling",
        "srv-refill": "Freon Refill / Recharge",
        "srv-maintenance": "AC Maintenance & Cleaning",
        "srv-boiler-install": "Central Heating Boiler Installation",
        "srv-boiler-maintenance": "Boiler Maintenance & Service",
        
        "booking-extra-brackets": "Outdoor Unit Brackets (+30 ₾)",
        "booking-extra-pipe": "Extra Copper Pipe (per meter) (+45 ₾)",
        "booking-extra-dismantle": "Dismantle old air conditioner (+50 ₾)",
        "booking-extra-boiler-filter": "Magnetic filter for boiler (+80 ₾)",
        
        "booking-label-date": "Preferred Date",
        "booking-label-time": "Preferred Time Slot",
        "booking-time-default": "Select a time window",
        "booking-time-morning": "Morning (09:00 - 13:00)",
        "booking-time-afternoon": "Afternoon (13:00 - 17:00)",
        "booking-time-evening": "Evening (17:00 - 20:00)",
        
        "booking-customer-title": "Customer Information",
        "booking-label-name": "Full Name",
        "booking-label-phone": "Phone Number",
        "booking-label-address": "Service Address",
        "booking-label-notes": "Additional Notes",
        
        "booking-name-placeholder": "e.g. Giorgi",
        "booking-phone-placeholder": "e.g. +995 5xx xx xx xx",
        "booking-address-placeholder": "e.g. 15 Shota Rustaveli Ave, Tbilisi",
        "booking-notes-placeholder": "Tell us about the mounting surface, height details, boiler/AC brand or any special requests...",
        "booking-submit-btn": "Book Professional Service",
        
        "calc-summary-title": "Service Pricing Estimate",
        "calc-summary-btu-adjust": "Capacity adjustment",
        "calc-summary-brackets": "Additional accessories / options",
        "calc-summary-pipe": "Extra copper pipe / plumbing",
        "calc-summary-dismantle": "Dismantling option",
        "calc-summary-total": "Total Estimated Price",
        
        "booking-disclaimer": "Our technician will verify the site before installation starts. All extra charges are based on precise measurements.",
        
        "trust-certified": "Certified Crew",
        "trust-warranty": "Warranty on work",
        
        "cart-title": "Your Shopping Cart",
        "cart-empty": "Your shopping cart is empty.",
        "cart-shop-now": "Back to Shop",
        "cart-subtotal": "Subtotal:",
        "cart-help": "Delivery is free within Tbilisi. Choose standard checkout or buy on credit.",
        "cart-standard-checkout": "Standard Checkout",
        "cart-finance-checkout": "Buy with Installment",
        
        "checkout-label-name": "Full Name",
        "checkout-label-phone": "Phone Number",
        "checkout-label-address": "Delivery Address",
        "checkout-label-idnum": "Personal ID Number (11 digits)",
        
        "checkout-name-placeholder": "e.g. Giorgi",
        "checkout-phone-placeholder": "e.g. +995 5xx xx xx xx",
        "checkout-address-placeholder": "Tbilisi address...",
        "checkout-idnum-placeholder": "For bank credit check...",
        "checkout-submit-btn": "Confirm Order",
        
        "success-close": "Done",
        
        "pay-method-title": "Choose Payment Method",
        "pay-method-card": "Pay by Card",
        "pay-method-card-desc": "Fast and secure checkout using any bank card",
        "pay-method-finance": "Buy in Installments",
        "pay-method-finance-desc": "Online financing from 0% interest via TBC or BOG",
        
        // Dynamic labels
        "ac-type-split": "Split System",
        "ac-type-portable": "Portable",
        "card-buy": "Buy",
        "stock-in": "In stock",
        "stock-low": "Last units",
        "card-buy-credit": "Buy on Credit",
        "card-monthly-est": "from",
        "card-add-cart": "Add to Cart",

        // Product detail page
        "detail-back": "Back to Catalog",
        "detail-desc": "Description",
        "detail-specs": "Specifications",
        "detail-features": "Key Features",
        "detail-install-title": "Professional Installation",
        "detail-install-desc": "Add our installation service — a certified technician will install the unit on the day you choose.",
        "detail-install-note": "The fee depends on the complexity of the job. You pay only after the installation is completed, on site — no online payment needed.",
        "detail-install-btn": "Book Installation",
        "spec-brand": "Brand",
        "spec-capacity": "Capacity",
        "spec-area": "Recommended Area",
        "spec-type": "Type",
        "spec-color": "Color",
        "spec-energy": "Energy Class",
        "spec-tech": "Technology",

        // Auth (register / login) modal
        "auth-title-login": "Log In",
        "auth-title-register": "Create Account",
        "auth-subtitle": "Sign in to continue with your purchase",
        "auth-email": "Email",
        "auth-password": "Password",
        "auth-login-btn": "Log In",
        "auth-register-btn": "Register",
        "auth-google-btn": "Continue with Google",
        "auth-or": "or",
        "auth-google-title": "Continue with Google",
        "auth-google-hint": "Enter your Google email address",
        "auth-google-continue": "Continue",
        "auth-switch-to-register": "No account yet?",
        "auth-switch-to-login": "Already have an account?",
        "auth-err-exists": "An account with this email already exists",
        "auth-err-invalid": "Incorrect email or password",
        "auth-err-offline": "Could not reach the server. Please try again later.",
        "auth-forgot": "Forgot your password?",
        "auth-reset-sent": "A password reset link has been sent to your email.",
        "auth-confirm-sent": "A confirmation link has been sent to your email. Please open it to finish signing up.",
        "acc-email-confirm": "A confirmation link has been sent to the new address. The email changes once you open it.",
        "acc-status-confirmed": "Confirmed",
        "acc-status-delivering": "Out for delivery",
        "acc-status-completed": "Completed",
        "acc-status-cancelled": "Cancelled",
        "auth-err-email": "Please enter a valid email address",
        "auth-err-password": "Password must be at least 6 characters",
        "auth-logout-confirm": "Log out of your account?",
        "auth-guest-btn": "Continue without registering",
        "co-guest-label": "Guest checkout",

        // Full-page checkout
        "co-title": "Checkout",
        "co-signed-as": "Signed in as:",
        "co-logout": "Log out",
        "co-details-header": "Your Details",
        "co-firstname": "First Name",
        "co-lastname": "Last Name",
        "co-phone": "Phone Number",
        "co-address": "Address",
        "co-idnum": "Personal ID Number",
        "co-install-toggle": "I need installation service",
        "co-payment-header": "Payment Method",
        "co-pay-card-desc": "Card payment",
        "co-pay-cash": "Cash on delivery",
        "co-pay-cash-desc": "Pay the courier when the product arrives",
        "co-idnum-hint": "Only needed for instalments — you can skip it for card or cash orders",
        "co-order-btn": "Place Order",
        "co-summary-header": "Order Summary",
        "co-total": "Total:",
        "co-install-line": "Installation:",
        "co-install-onsite": "paid on site",
        "co-delivery-note": "Delivery takes 2–5 business days",
        "co-pay-btn": "Pay Now",

        // Footer
        "footer-text": "Reliable heating and air conditioning systems across Georgia. Top quality, fast service, and flexible installment plans.",
        "footer-products-title": "Products & Service",
        "footer-prod-1": "Air Conditioners",
        "footer-prod-2": "Central Heating Boilers",
        "footer-services-title": "Services",
        "footer-serv-1": "AC Installation",
        "footer-serv-2": "Boiler Installation",
        "footer-serv-3": "Freon Refill / Maintenance",
        "footer-serv-4": "Full Servicing",
        "meta-description": "Air conditioners and central heating boilers in Georgia — Samsung, LG, Midea, Bosch, Gree and more. Official warranty, professional installation, 0% instalments and free delivery in Tbilisi.",
        "footer-legal-title": "Terms & Policies",
        "footer-terms": "Terms & Conditions",
        "footer-privacy": "Privacy Policy",
        "footer-returns": "Returns & Warranty",
        "footer-cookies": "Cookie settings",
        "footer-follow-title": "Follow us",
        "whatsapp-cta": "Chat with us",
        "whatsapp-aria": "Message us on WhatsApp",
        "whatsapp-msg-general": "Hello! I'm interested in your products.",
        "whatsapp-msg-product": "Hello! I'm interested in this product:",
        "footer-contact-title": "Get in touch",
        "footer-workhours": "Mon - Sat: 09:00 - 20:00",
        "footer-copyright": "Copyright © 2026 Climate Comfort. All rights reserved.",
        "footer-made-by": "Powered by",

        // Homepage rails + brand strip
        "rail-midea": "Midea Collection",
        "rail-best": "Best Sellers",
        "rail-deals": "Top Deals",
        "rail-budget": "Budget Picks",
        "brands-title": "Shop by Brand",
        "co-processing": "Processing...",
        "co-err-id": "The personal ID number must be exactly 11 digits",
        "co-err-phone": "Please enter a valid phone number",
        "co-success-title": "Payment Successful!",
        "co-success-msg": "Your order has been received. Details have been sent to your email.",
        "co-success-install": "Installation request received — you pay for it on site, after the work is completed.",

        // Account page
        "acc-title": "My Account",
        "acc-nav-orders": "My Orders",
        "acc-nav-details": "Personal Details",
        "acc-nav-security": "Account Security",
        "acc-orders-empty": "You have no orders yet",
        "acc-status-received": "Received",
        "acc-save": "Save",
        "acc-saved": "Saved",
        "acc-current-password": "Current Password",
        "acc-new-password": "New Password",
        "acc-change-password": "Change Password",
        "acc-change-email": "Change Email",
        "acc-pass-changed": "Password changed",
        "acc-err-current": "Current password is incorrect",
        "acc-google-note": "You signed in with Google — your email and password are managed by Google.",
        
        "calc-modal-title": "Financing Calculator",
        "calc-modal-cost-label": "Product Price:",
        "calc-modal-select-bank": "Select Financing Bank",
        "calc-modal-down-payment": "Down Payment (₾) - Optional",
        "calc-modal-term": "Installment Term: {0} Months",
        "calc-modal-res-monthly": "Monthly Payment",
        "calc-modal-res-financed": "Financed Amount:",
        "calc-modal-res-downpaid": "Down Payment Paid:",
        "calc-modal-res-rate": "Monthly Interest Rate:",
        "calc-modal-res-interest": "Total Interest:",
        "calc-modal-res-total": "Total Paid Cost:",
        "calc-modal-submit": "Apply for Financing",
        
        "month-unit": "mo",
        "inverter-label": "Technology",
        "inverter-yes": "Yes",
        "inverter-no": "No",
        
        // Colors EN
        "White": "White",
        "Black": "Black",
        "Silver": "Silver",
        
        // Area unit
        "sqm": "m²"
    }
};

// Helper translation function
function t(key) {
    const lang = state.currentLang;
    return translations[lang][key] || translations['ka'][key] || key;
}

// 2. Localized Product Database
// NOTE: this built-in array is DEMO data. On startup loadDbProducts() replaces
// it with the live catalog from Supabase whenever published products exist
// there; until the first import is done, the demo products keep the site alive.
const products = [
    {
        id: 1,
        category: "ac",
        brand: "Samsung",
        title: {
            ka: "Samsung WindFree Avant ინვერტორი",
            en: "Samsung WindFree Avant Inverter"
        },
        price: 2499,
        btu: "12000 BTU",
        area: "35-40 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A+++",
        color: "White",
        popularity: 98,
        description: {
            ka: "WindFree™ გაგრილების ტექნოლოგია ნაზად და ჩუმად ანაწილებს ჰაერს 23,000 მიკრო საჰაერო ხვრელის მეშვეობით, რაც გამორიცხავს ცივი ჰაერის პირდაპირი ნაკადის უსიამოვნო შეგრძნებას.",
            en: "WindFree™ cooling technology gently and quietly disperses air through 23,000 micro air holes, eliminating the unpleasant feeling of cold drafts."
        },
        features: {
            ka: ["WindFree გაგრილება", "PM 1.0 ფილტრი", "AI ავტო გაგრილება", "SmartThings Wi-Fi"],
            en: ["WindFree Cooling", "PM 1.0 Filter", "AI Auto Cooling", "SmartThings Wi-Fi"]
        }
    },
    {
        id: 2,
        category: "ac",
        brand: "Midea",
        title: {
            ka: "Midea Mission II სმარტ ინვერტორი",
            en: "Midea Mission II Smart Inverter"
        },
        price: 1349,
        btu: "12000 BTU",
        area: "35-40 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A++",
        color: "White",
        popularity: 85,
        description: {
            ka: "მაღალი სიხშირის ინვერტორული ტექნოლოგიის წყალობით, Midea Mission II უზრუნველყოფს ცივი ჰაერის მიწოდებას სულ რაღაც 40 წამში. Wi-Fi მოდული იძლევა სრულ დისტანციურ კონტროლს.",
            en: "Equipped with high-frequency inverter technology, Midea Mission II delivers cool air in just 40 seconds. Smart Wi-Fi features allow full app control."
        },
        features: {
            ka: ["სწრაფი გაგრილება", "Gear Shift ენერგოდაზოგვა", "3D დაბერვა", "Wi-Fi კონტროლი"],
            en: ["Flash Cooling", "Gear Shift energy saving", "3D Airflow", "Wi-Fi Control"]
        }
    },
    {
        id: 3,
        category: "ac",
        brand: "LG",
        title: {
            ka: "LG Artcool Gallery Mirror ინვერტორი",
            en: "LG Artcool Gallery Mirror Inverter"
        },
        price: 3199,
        btu: "12000 BTU",
        area: "30-35 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A++",
        color: "Black",
        popularity: 92,
        description: {
            ka: "უნიკალური დიზაინი, რომელიც საშუალებას გაძლევთ შეცვალოთ წინა პანელის ფოტო თქვენი ოთახის ინტერიერის შესაბამისად. ორმაგი ინვერტორული კომპრესორი ზოგავს ენერგიას და აგრილებს უფრო სწრაფად.",
            en: "A unique design that lets you customize the front photo panel to match your room decor. DUAL Inverter compressor saves energy and cools faster."
        },
        features: {
            ka: ["ორმაგი ინვერტორი", "პერსონალური ფოტო პანელი", "ThinQ Wi-Fi", "UVnano ჰაერის წმენდა"],
            en: ["DUAL Inverter", "Customizable Photo Panel", "ThinQ Wi-Fi", "UVnano Air Purification"]
        }
    },
    {
        id: 4,
        category: "ac",
        brand: "TCL",
        title: {
            ka: "TCL Elite Comfort ინვერტორი",
            en: "TCL Elite Comfort Inverter"
        },
        price: 999,
        btu: "9000 BTU",
        area: "20-25 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A+",
        color: "White",
        popularity: 80,
        description: {
            ka: "ინტელექტუალური ჰაერის ნაკადი მიმართავს ცივ ჰაერს ზემოთ, ხოლო თბილ ჰაერს - ქვემოთ. ფილტრის გაწმენდის შეხსენების ფუნქცია უზრუნველყოფს სუფთა ჰაერის მუდმივ მიწოდებას.",
            en: "Smart airflow directs cool air upwards and warm air downwards, avoiding direct blowing. Filter cleaning reminder ensures clean air operation."
        },
        features: {
            ka: ["ფილტრის წმენდის შეხსენება", "ულტრა ჩუმი (22dB)", "I Feel სენსორი", "სწრაფი გაგრილება"],
            en: ["Filter Cleaning Reminder", "Super Quiet (22dB)", "I Feel Sensor", "Rapid Temp Change"]
        }
    },
    {
        id: 5,
        category: "ac",
        brand: "Gree",
        title: {
            ka: "Gree Bora Premium ინვერტორი",
            en: "Gree Bora Premium Inverter"
        },
        price: 1599,
        btu: "18000 BTU",
        area: "50-60 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A++",
        color: "White",
        popularity: 90,
        description: {
            ka: "ცივი პლაზმის გენერატორი ახდენს ბაქტერიების 90%-მდე სტერილიზაციას. გააჩნია მძლავრი მახასიათებლები, იდეალურია დიდი ოთახებისა თუ ოფისებისთვის.",
            en: "Cold Plasma generator sterilizes up to 90% of bacteria. Features heavy-duty performance suitable for large rooms or offices."
        },
        features: {
            ka: ["პლაზმური სტერილიზატორი", "I-Feel დისტანციური სენსორი", "Turbo რეჟიმი", "თვითწმენდის ფუნქცია"],
            en: ["Cold Plasma Sterilizer", "I-Feel Remote Control", "Turbo Cooling Mode", "Auto-clean function"]
        }
    },
    {
        id: 6,
        category: "ac",
        brand: "Beko",
        title: {
            ka: "Beko Standard Cool ON/OFF",
            en: "Beko Standard Cool ON/OFF"
        },
        price: 849,
        btu: "9000 BTU",
        area: "20-25 m²",
        type: "Split System",
        inverter: false,
        energyClass: "A",
        color: "White",
        popularity: 70,
        description: {
            ka: "ბიუჯეტური და საიმედო სტანდარტული გაგრილების სისტემა. Jet Cool ღილაკი საშუალებას გაძლევთ მომენტალურად დაწიოთ ოთახის ტემპერატურა.",
            en: "Cost-effective, highly reliable standard cooling split system. Jet Cool button drops the room temperature instantly."
        },
        features: {
            ka: ["Jet Cool სწრაფი გაგრილება", "ავტო გადატვირთვა", "ტენიანობის კონტროლი", "ღამის რეჟიმი"],
            en: ["Jet Cool Function", "Auto Restart", "Dehumidification Mode", "Sleep Mode Timer"]
        }
    },
    {
        id: 7,
        category: "ac",
        brand: "TCL",
        title: {
            ka: "TCL პორტატული კონდიციონერი",
            en: "TCL Portable Smart Air Conditioner"
        },
        price: 1199,
        btu: "12000 BTU",
        area: "25-30 m²",
        type: "Portable",
        inverter: false,
        energyClass: "A",
        color: "White",
        popularity: 75,
        description: {
            ka: "არ საჭიროებს გარე ბლოკის მუდმივ მონტაჟს. იდეალურია ნაქირავები ბინებისთვის. ჩაშენებული ჰაერის დამშრობი და ბორბლები მარტივი გადაადგილებისთვის.",
            en: "No permanent outdoor unit required. Perfect for rented flats. Built-in dehumidifier and caster wheels for easy relocation."
        },
        features: {
            ka: ["მონტაჟის გარეშე", "24-საათიანი ტაიმერი", "მოსახერხებელი ბორბლები", "თვითორთქლებადი სისტემა"],
            en: ["No installation needed", "24-Hour Timer", "Caster Wheels", "Self-Evaporative System"]
        }
    },
    {
        id: 8,
        category: "ac",
        brand: "Aux",
        title: {
            ka: "Aux Freedom Silver ინვერტორი",
            en: "Aux Freedom Silver Inverter"
        },
        price: 1899,
        btu: "24000 BTU",
        area: "70-80 m²",
        type: "Split System",
        inverter: true,
        energyClass: "A++",
        color: "Silver",
        popularity: 88,
        description: {
            ka: "დახვეწილი ვერცხლისფერი დიზაინი ჰაერის გაუმჯობესებული ფილტრებით. განკუთვნილია დიდი სივრცეებისთვის 80 კვ.მ-მდე, ინარჩუნებს მუშაობის დაბალ ხმაურს.",
            en: "Sleek silver design with advanced air purification filters. Designed for massive spaces up to 80 sq.m., maintaining low noise operation."
        },
        features: {
            ka: ["4D ჰაერის ნაკადი", "ვერცხლის იონების ფილტრი", "მაღალი სიმკვრივის ფილტრი", "სოკოს საწინააღმდეგო თვითწმენდა"],
            en: ["4D Airflow", "Silver ion filter", "High Density Filter", "Anti-fungus self clean"]
        }
    },
    {
        id: 9,
        category: "boiler",
        brand: "Bosch",
        title: {
            ka: "Bosch Condens 2500W კონდენსაციური ქვაბი",
            en: "Bosch Condens 2500W Condensing Boiler"
        },
        price: 2399,
        btu: "24 kW",
        area: "100-140 m²",
        type: "Condensing",
        inverter: true,
        energyClass: "A+",
        color: "White",
        popularity: 97,
        description: {
            ka: "Bosch-ის მაღალი ხარისხის ორკონტურიანი გათბობის ქვაბი, რომელიც უზრუნველყოფს ეკონომიურ გათბობასა და ცხელი წყლის სტაბილურ მიწოდებას.",
            en: "High-efficiency double-circuit condensing boiler by Bosch, providing economical heating and stable hot water supply."
        },
        features: {
            ka: ["93% ეფექტურობა", "ეკო რეჟიმი", "LCD დისპლეი", "ჩუმი მუშაობა"],
            en: ["93% Efficiency", "Eco Mode", "LCD Display", "Super Quiet"]
        }
    },
    {
        id: 10,
        category: "boiler",
        brand: "Ariston",
        title: {
            ka: "Ariston Cares XC კონდენსაციური ქვაბი",
            en: "Ariston Cares XC Condensing Boiler"
        },
        price: 1849,
        btu: "24 kW",
        area: "100-140 m²",
        type: "Condensing",
        inverter: true,
        energyClass: "A",
        color: "White",
        popularity: 91,
        description: {
            ka: "იტალიური წარმოების კომპაქტური გათბობის ქვაბი. აღჭურვილია ენერგოეფექტური ტუმბოთი და სპილენძის პირველადი თბომცვლელით.",
            en: "Italian-made compact heating boiler. Equipped with energy-efficient pump and copper primary heat exchanger."
        },
        features: {
            ka: ["კომპაქტური დიზაინი", "ავტო დიაგნოსტიკა", "სპილენძის თბომცვლელი", "ყინვისგან დაცვა"],
            en: ["Compact Design", "Auto Diagnostics", "Copper Heat Exchanger", "Frost Protection"]
        }
    },
    {
        id: 11,
        category: "boiler",
        brand: "Demirdokum",
        title: {
            ka: "Demirdokum Nitromix კონდენსაციური ქვაბი",
            en: "Demirdokum Nitromix Condensing Boiler"
        },
        price: 2199,
        btu: "28 kW",
        area: "140-180 m²",
        type: "Condensing",
        inverter: true,
        energyClass: "A",
        color: "White",
        popularity: 93,
        description: {
            ka: "Nitromix-ი გამოირჩევა გაუმჯობესებული უჟანგავი ფოლადის თბომცვლელითა და მაღალი სიმძლავრით, იდეალურია საშუალო და დიდი ზომის სახლებისთვის.",
            en: "Nitromix features an advanced stainless steel heat exchanger and high output, ideal for medium to large homes."
        },
        features: {
            ka: ["უჟანგავი ფოლადის ბლოკი", "ორმაგი თბომცვლელი", "ციფრული ეკრანი", "Low NOx ეკო დაბერვა"],
            en: ["Stainless Steel block", "Double Heat Exchanger", "Digital Display", "Low NOx Eco Combustion"]
        }
    },
    {
        id: 12,
        category: "boiler",
        brand: "Immergas",
        title: {
            ka: "Immergas Victrix Tera გათბობის ქვაბი",
            en: "Immergas Victrix Tera Heating Boiler"
        },
        price: 2699,
        btu: "32 kW",
        area: "180-220 m²",
        type: "Condensing",
        inverter: true,
        energyClass: "A+",
        color: "White",
        popularity: 89,
        description: {
            ka: "Victrix Tera წარმოადგენს ახალი თაობის ეკოლოგიურად სუფთა ქვაბს. ჩაშენებული სმარტ მართვის მხარდაჭერითა და მაღალი საიმედოობით.",
            en: "Victrix Tera represents a new generation of eco-friendly condensing boilers, with built-in smart control support and high reliability."
        },
        features: {
            ka: ["სმარტ მართვის მხარდაჭერა", "ენერგიის მაღალი დაზოგვა", "ეკოლოგიური უსაფრთხოება", "32კვტ სიმძლავრე"],
            en: ["Smart App Support", "High Energy Saving", "Eco friendly safety", "32kW High Power"]
        }
    },
    {
        id: 13,
        category: "boiler",
        brand: "Bosch",
        title: {
            ka: "Bosch Condens 7000i ვერცხლისფერი ქვაბი",
            en: "Bosch Condens 7000i Silver Boiler"
        },
        price: 3499,
        btu: "35 kW",
        area: "220-280 m²",
        type: "Condensing",
        inverter: true,
        energyClass: "A++",
        color: "Silver",
        popularity: 96,
        description: {
            ka: "პრემიუმ კლასის გათბობის ქვაბი შუშის დეკორატიული წინა პანელით. დახვეწილი დიზაინი და უმაღლესი ენერგოეფექტურობა 30%-მდე დაზოგვისთვის.",
            en: "Premium heating boiler with titanium glass front design. High-end aesthetic styling and maximum A++ efficiency saving up to 30%."
        },
        features: {
            ka: ["ვერცხლისფერი მინის პანელი", "A++ ენერგოკლასი", "ინტელექტუალური მართვა", "სრული გარანტია"],
            en: ["Silver Glass Panel", "A++ Energy Class", "Intelligent Control", "Full Warranty"]
        }
    },
    {
        id: 14,
        category: "boiler",
        brand: "Midea",
        title: {
            ka: "Midea Standard გათბობის ქვაბი",
            en: "Midea Standard Heating Boiler"
        },
        price: 1499,
        btu: "24 kW",
        area: "100-120 m²",
        type: "Standard",
        inverter: false,
        energyClass: "B",
        color: "White",
        popularity: 84,
        description: {
            ka: "საიმედო და ბიუჯეტური სტანდარტული გათბობის ქვაბი ორმაგი თბომცვლელითა და მექანიკური მართვით. იდეალურია სტანდარტული ბინებისთვის.",
            en: "Highly reliable budget-friendly standard heating boiler with double heat exchanger and mechanical controls, perfect for standard apartments."
        },
        features: {
            ka: ["ორმაგი თბომცვლელი", "ადვილი ინსტალაცია", "მექანიკური მართვა", "ყინვის საწინააღმდეგო თერმოსტატი"],
            en: ["Double Heat Exchanger", "Easy installation", "Mechanical Controls", "Anti-frost thermostat"]
        }
    }
];

// Bank configurations
const banksConfig = {
    bog: {
        name: "Bank of Georgia",
        minTerm: 3,
        maxTerm: 36,
        promoMonths: 6,
        standardRate: 1.8
    },
    tbc: {
        name: "TBC Bank",
        minTerm: 3,
        maxTerm: 36,
        promoMonths: 3,
        standardRate: 1.5
    }
};

// 3. Application State variables
let state = {
    currentLang: localStorage.getItem("lang") || "ka", // KA is main language
    cart: [],
    filters: {
        category: "all",
        search: "",
        minPrice: 500,
        maxPrice: 4000,
        brands: [],
        areas: [],
        btus: [],
        inverter: [],
        energyClass: [],
        colors: []
    },
    sortBy: "popular",
    catalogPage: 1,           // current catalog page (resets when filters/sort change)
    activeFinancedProduct: null,
    checkoutMode: "standard",
    user: null,               // signed-in account ({id, email, provider}) or null — from Supabase Auth
    profile: null,            // cached `profiles` row: delivery details
    orders: [],               // this user's orders, read from the database
    ordersLoaded: false,      // so the account page fetches them once per visit
    afterAuthHash: null,      // hash to navigate to once the user authenticates (checkout/N, account)
    guestCheckout: false      // set when the buyer skips registration ("continue without registering")
};

// ==========================================================================
// Live catalog from Supabase
// ==========================================================================
// Product ids: demo products use numbers (1, 2...), database products use
// UUIDs — always compare through findProduct()/String(), never parseInt.
function findProduct(id) {
    return products.find(p => String(p.id) === String(id));
}

function dbRowToProduct(r) {
    const fallbackTitle = `${r.brand} ${r.model}`;
    return {
        id: r.id,
        category: r.category,
        brand: r.brand,
        title: {
            ka: r.title_ka || fallbackTitle,
            en: r.title_en || fallbackTitle
        },
        price: Number(r.display_price) || 0,
        oldPrice: r.display_old_price ? Number(r.display_old_price) : null,
        btu: r.btu ? (r.category === "boiler" ? `${r.btu} kW` : `${r.btu} BTU`) : "",
        area: r.area_sqm ? `${r.area_sqm} m²` : "",
        type: "Split System",
        inverter: r.subtype === "inverter",
        energyClass: "",
        color: "",
        popularity: 50,
        stock: r.stock_status || null, // 'in' | 'low' (out of stock is never published)
        image: r.image_url || null,
        images: Array.isArray(r.images) && r.images.length ? r.images : (r.image_url ? [r.image_url] : []),
        // Full spec table fetched from the supplier's own product page at
        // import time: [{group, items:[{name,value}]}] — see fetch-product-details.
        specs: Array.isArray(r.specs) ? r.specs : [],
        description: {
            ka: r.description_ka || "",
            en: r.description_en || ""
        },
        features: { ka: [], en: [] }
    };
}

async function loadDbProducts() {
    if (!sbClient) return;
    try {
        const { data, error } = await sbClient
            .from("products")
            .select("*") // tolerant of columns added over time (e.g. stock_status)
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (error) { console.warn("Supabase catalog error — using demo products:", error.message); return; }
        if (!data || data.length === 0) return; // nothing imported yet — keep demo catalog

        products.length = 0;
        data.forEach(r => products.push(dbRowToProduct(r)));

        // Rebuild everything derived from the catalog
        generateFiltersUI();
        renderCatalog();
        renderHomeRails();
        handleRouting();
    } catch (err) {
        console.warn("Supabase unreachable — using demo products:", err);
    }
}

// Order persistence + confirmation email. The shopper's flow never blocks on
// either: the success modal is shown regardless, and a mail failure must not
// look like a failed order — the order is already safely in the database.
function saveOrderToDb(order) {
    if (!sbClient) return;
    // The id is generated here rather than read back after the insert: RLS lets
    // anyone create an order but only its owner select it, so a guest checkout
    // would get nothing back from .select(). Supplying the uuid ourselves keeps
    // guests and signed-in buyers on the same path.
    const id = (crypto.randomUUID && crypto.randomUUID()) || null;
    const row = id ? { id, ...order } : order;

    sbClient.from("orders").insert(row).then(({ error }) => {
        if (error) { console.warn("Order was not saved to the database:", error.message); return; }
        if (id) sendOrderEmail(id);
    });
}

// Mails the confirmation to the buyer and a copy to the shop. The function is
// given only the order id — it reads the recipient from the database itself,
// so this call cannot be abused to send mail to an arbitrary address.
// The dashboard deployed the function under an auto-generated slug; the code
// lives in supabase/functions/send-order-email/. If it is ever redeployed
// under its proper name, change this one constant.
const ORDER_EMAIL_FUNCTION = "rapid-action";

function sendOrderEmail(orderId) {
    if (!sbClient) return;
    sbClient.functions.invoke(ORDER_EMAIL_FUNCTION, { body: { orderId } })
        .then(({ data, error }) => {
            if (error) console.warn("Confirmation email was not sent:", error.message);
            else if (data && data.results) console.info("Order email:", data.results);
        })
        .catch(err => console.warn("Confirmation email failed:", err));
}

// Same for service bookings (admin page → Bookings tab)
function saveBookingToDb(booking) {
    if (typeof trackLead === "function") trackLead("service_booking");
    if (!sbClient) return;
    sbClient.from("service_bookings").insert(booking).then(({ error }) => {
        if (error) console.warn("Booking was not saved to the database:", error.message);
    });
}

// ==========================================================================
// Initialization & Localization Apply
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 0. Restore the auth session. supabase-js persists and refreshes the JWT
    //    itself, and also parses the tokens an OAuth / magic-link redirect puts
    //    in the URL — so this covers "already signed in" and "just came back
    //    from Google" alike. It is async, hence the re-render once it lands.
    if (sbClient) {
        sbClient.auth.getSession().then(({ data }) => {
            if (!data.session) return;
            applySession(data.session).then(() => handleRouting());
        });

        sbClient.auth.onAuthStateChange((event, session) => {
            // INITIAL_SESSION is already handled by getSession above
            if (event === "INITIAL_SESSION") return;
            applySession(session).then(() => {
                state.ordersLoaded = false;
                if (SUBPAGE_CLASSES.some(c => document.body.classList.contains(c))) handleRouting();
            });
        });
    }
    updateAuthUI();

    // 1. Setup Language Button States
    updateLangBtnStates();

    // 2. Translate static HTML
    applyLanguage();

    // 3. Generate filters dynamically based on product database to get correct counts
    generateFiltersUI();
    
    // 4. Initial Render of Catalog + homepage rails
    renderCatalog();
    renderHomeRails();
    
    // 5. Bind Event Listeners
    bindUIEventListeners();

    // 6. Hash routing (product detail pages) — handle deep links like #product/3
    window.addEventListener("hashchange", handleRouting);
    handleRouting();

    // 7. Swap in the live catalog from Supabase (async; demo data until it lands)
    loadDbProducts();

    // Initialize date selector minimum date
    const dateInput = document.getElementById("booking-date");
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
});

// Update selected visual state of language toggle buttons
function updateLangBtnStates() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.getAttribute("data-lang") === state.currentLang) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// Translates static DOM nodes with data-i18n attributes
function applyLanguage() {
    updateLangBtnStates();

    // Update document title
    document.title = t("doc-title");

    // Static text nodes content
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerText = t(key);
    });

    // Inputs placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key));
    });

    // SEO meta tags carry their text in a content attribute, not a text node
    document.querySelectorAll("[data-i18n-meta]").forEach(el => {
        el.setAttribute("content", t(el.getAttribute("data-i18n-meta")));
    });
    document.documentElement.setAttribute("lang", state.currentLang);

    updateWhatsAppLinks(whatsAppProduct);
}

// ==========================================================================
// WhatsApp (business number) — footer link + floating button.
// On a product page the message is pre-filled with that product's name and
// link, so the shop knows what the customer is asking about before replying.
// ==========================================================================
const WHATSAPP_NUMBER = "995571989669"; // +995 571 98 96 69, digits only for wa.me
let whatsAppProduct = null;

function updateWhatsAppLinks(product) {
    whatsAppProduct = product || null;

    let text = t("whatsapp-msg-general");
    if (whatsAppProduct) {
        const title = whatsAppProduct.title
            ? (whatsAppProduct.title[state.currentLang] || whatsAppProduct.title.ka)
            : `${whatsAppProduct.brand} ${whatsAppProduct.model || ""}`.trim();
        // Product links only mean something on the public site, not on localhost
        const onPublicSite = !/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
        text = `${t("whatsapp-msg-product")} ${title}` + (onPublicSite ? `\n${location.href}` : "");
    }

    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    document.querySelectorAll(".js-whatsapp-link").forEach(a => a.setAttribute("href", href));

    const floatBtn = document.getElementById("whatsapp-float");
    if (floatBtn) {
        floatBtn.setAttribute("aria-label", t("whatsapp-aria"));
        floatBtn.setAttribute("title", t("whatsapp-aria"));
    }
}

// Faceted Counter Generator
function getFacetCounts() {
    const brands = {};
    const areas = {};
    const btus = {};
    const energy = {};
    const colors = {};

    // Filter by Category first so filters represent current category selection
    const filteredByCategory = products.filter(p => {
        if (state.filters.category && state.filters.category !== 'all') {
            return p.category === state.filters.category;
        }
        return true;
    });

    // Imported products can have missing fields (no area/color/energy data in
    // the supplier files) — never build a facet checkbox out of an empty value
    filteredByCategory.forEach(p => {
        if (p.brand) brands[p.brand] = (brands[p.brand] || 0) + 1;
        if (p.area) areas[p.area] = (areas[p.area] || 0) + 1;
        if (p.btu) btus[p.btu] = (btus[p.btu] || 0) + 1;
        if (p.energyClass) energy[p.energyClass] = (energy[p.energyClass] || 0) + 1;
        if (p.color) colors[p.color] = (colors[p.color] || 0) + 1;
    });

    return { brands, areas, btus, energy, colors };
}

// Generate the Faceted Filters UI elements
function generateFiltersUI() {
    const facets = getFacetCounts();
    
    // Dynamic Filter Title for Capacity
    const capacityTitle = document.querySelector('#filter-sidebar .filter-group h4[data-i18n="filter-btu"]');
    if (capacityTitle) {
        if (state.filters.category === 'ac') {
            capacityTitle.innerText = state.currentLang === 'ka' ? "სიმძლავრე (BTU)" : "Capacity (BTU)";
        } else if (state.filters.category === 'boiler') {
            capacityTitle.innerText = state.currentLang === 'ka' ? "სიმძლავრე (kW)" : "Capacity (kW)";
        } else {
            capacityTitle.innerText = state.currentLang === 'ka' ? "სიმძლავრე (BTU / kW)" : "Capacity (BTU / kW)";
        }
    }

    // Dynamic Filter Title for Inverter/Condensing Technology
    const inverterTitle = document.querySelector('#filter-sidebar .filter-group h4[data-i18n="filter-inverter"]');
    const invYesLabel = document.querySelector('#filter-sidebar label span[data-i18n="filter-inverter-yes"]');
    const invNoLabel = document.querySelector('#filter-sidebar label span[data-i18n="filter-inverter-no"]');
    if (inverterTitle && invYesLabel && invNoLabel) {
        if (state.filters.category === 'boiler') {
            inverterTitle.innerText = state.currentLang === 'ka' ? "ტექნოლოგია" : "Technology";
            invYesLabel.innerText = state.currentLang === 'ka' ? "კონდენსაციური (ენერგოეფექტური)" : "Condensing (Energy Saving)";
            invNoLabel.innerText = state.currentLang === 'ka' ? "სტანდარტული" : "Standard (Non-Condensing)";
        } else {
            inverterTitle.innerText = t("filter-inverter");
            invYesLabel.innerText = t("filter-inverter-yes");
            invNoLabel.innerText = t("filter-inverter-no");
        }
    }

    // 1. Brands (restore checked state — brand tiles set the filter from outside)
    const brandContainer = document.getElementById("filter-brands");
    brandContainer.innerHTML = Object.keys(facets.brands).map(brand => `
        <label class="filter-checkbox-label">
            <input type="checkbox" name="brand" value="${brand}" ${state.filters.brands.includes(brand) ? "checked" : ""}>
            <span class="custom-checkbox"></span>
            <span class="label-text">${brand}</span>
            <span class="count">(${facets.brands[brand]})</span>
        </label>
    `).join('');

    // 2. Areas
    const areaContainer = document.getElementById("filter-areas");
    const sortedAreas = Object.keys(facets.areas).sort((a, b) => parseInt(a) - parseInt(b));
    areaContainer.innerHTML = sortedAreas.map(area => {
        // Translate unit (m2 -> sqm/კვ.მ)
        const areaLabel = area.replace("m²", t("sqm"));
        return `
            <label class="filter-checkbox-label">
                <input type="checkbox" name="area" value="${area}">
                <span class="custom-checkbox"></span>
                <span class="label-text">${areaLabel}</span>
                <span class="count">(${facets.areas[area]})</span>
            </label>
        `;
    }).join('');

    // 3. BTUs
    const btuContainer = document.getElementById("filter-btus");
    const sortedBtus = Object.keys(facets.btus).sort((a, b) => parseInt(a) - parseInt(b));
    btuContainer.innerHTML = sortedBtus.map(btu => `
        <label class="filter-checkbox-label">
            <input type="checkbox" name="btu" value="${btu}">
            <span class="custom-checkbox"></span>
            <span class="label-text">${btu}</span>
            <span class="count">(${facets.btus[btu]})</span>
        </label>
    `).join('');

    // 4. Energy Classes
    const energyContainer = document.getElementById("filter-energy");
    energyContainer.innerHTML = Object.keys(facets.energy).sort().map(eClass => `
        <label class="filter-checkbox-label">
            <input type="checkbox" name="energy" value="${eClass}">
            <span class="custom-checkbox"></span>
            <span class="label-text">${state.currentLang === 'ka' ? 'კლასი' : 'Class'} ${eClass}</span>
            <span class="count">(${facets.energy[eClass]})</span>
        </label>
    `).join('');

    // 5. Colors
    const colorContainer = document.getElementById("filter-colors");
    colorContainer.innerHTML = Object.keys(facets.colors).map(color => `
        <label class="filter-checkbox-label">
            <input type="checkbox" name="color" value="${color}">
            <span class="custom-checkbox"></span>
            <span class="label-text">${t(color)}</span>
            <span class="count">(${facets.colors[color]})</span>
        </label>
    `).join('');

    // Hide filter groups that have no options for the current catalog
    // (e.g. energy class / color — the supplier files carry no such data yet)
    [brandContainer, areaContainer, btuContainer, energyContainer, colorContainer].forEach(c => {
        const group = c.closest(".filter-group");
        if (group) group.classList.toggle("hidden", c.children.length === 0);
    });
}

// ==========================================================================
// Shared Product Render Helpers
// ==========================================================================

// Stock badge from supplier stock levels. Only 'in'/'low' exist here —
// products with no in-stock offer are never published at all. Demo products
// have no stock info and show no badge.
function stockBadge(p) {
    if (p.stock === "low") return `<span class="badge badge-stock-low">${t("stock-low")}</span>`;
    if (p.stock === "in") return `<span class="badge badge-stock-in">${t("stock-in")}</span>`;
    return "";
}

// Product visual, used by cards, detail page and checkout summary:
// real photo when the product has one, neutral placeholder otherwise
// (the old CSS-drawn mockups are retired — real photos are coming)
function buildProductMockup(p) {
    if (p.image) {
        return `<img class="product-photo" src="${p.image}" alt="${p.brand}" loading="lazy">`;
    }
    const soon = state.currentLang === 'ka' ? 'ფოტო მალე დაემატება' : 'Photo coming soon';
    return `
        <div class="photo-placeholder">
            <i class="fa-regular fa-image"></i>
            <span>${soon}</span>
        </div>
    `;
}

// Inverter / Condensing tech label
function getTechLabel(p) {
    if (p.category === 'boiler') {
        return p.inverter ? (state.currentLang === 'ka' ? 'კონდენსაციური' : 'Condensing') : (state.currentLang === 'ka' ? 'სტანდარტული' : 'Standard');
    }
    return p.inverter ? t("filter-inverter-yes").split(" ")[0] : t("filter-inverter-no").split(" ")[0];
}

// ==========================================================================
// Legal pages (hash routes: #terms, #privacy, #returns)
//
// Required before launch: Georgian consumer-protection law obliges a distance
// seller to publish its identity, the withdrawal right and the complaints
// procedure, and the acquiring bank asks for all three documents before it
// issues a merchant account.
//
// ⚠ FILL IN COMPANY below with the real registration data, then have a lawyer
// review the text once — the wording follows the law but is not legal advice.
// ==========================================================================
const COMPANY = {
    legalName: "შპს კლიმატ კომფორტი+",
    legalNameEn: "Climate-Comfort+ LLC",
    taxId: "405772926",
    address: "მ. გელოვანის ქ. N4, თბილისი, საქართველო",
    addressEn: "M. Gelovani Str. N4, Tbilisi, Georgia",
    phone: "+995 32 2 111 848",
    email: "climatecomfortgroup@gmail.com",
    site: "https://climatecomfort.ge",
    updated: "2026-10-05",                   // ← ბოლო რედაქტირების თარიღი
    installWarrantyMonths: 12                // ← გარანტია ჩვენს სამონტაჟო სამუშაოზე (თვე)
};

const LEGAL_SLUGS = ["terms", "privacy", "returns"];

// Each page is authored as HTML (not data-i18n) because applyLanguage() sets
// innerText and would strip the markup; the language switch re-renders instead.
function legalContent() {
    const c = COMPANY;
    const tel = c.phone.replace(/\s/g, "");
    const w = c.installWarrantyMonths;

    const ka = {
        terms: {
            title: "წესები და პირობები",
            html: `
<p class="legal-lead">წინამდებარე წესები და პირობები არეგულირებს ${c.site} ვებგვერდის (შემდგომში „ვებგვერდი") მეშვეობით პროდუქციის შეძენასა და სერვისის მიღებას. ვებგვერდზე შეკვეთის განთავსებით თქვენ ეთანხმებით ამ პირობებს.</p>

<h3>1. გამყიდველის შესახებ</h3>
<ul>
    <li>იურიდიული დასახელება: <strong>${c.legalName}</strong></li>
    <li>საიდენტიფიკაციო კოდი: <strong>${c.taxId}</strong></li>
    <li>მისამართი: ${c.address}</li>
    <li>ტელეფონი: <a href="tel:${tel}">${c.phone}</a></li>
    <li>ელ. ფოსტა: <a href="mailto:${c.email}">${c.email}</a></li>
</ul>

<h3>2. პროდუქცია და ფასები</h3>
<p>ფასები მითითებულია ლარში და მოიცავს დღგ-ს. შეკვეთის განთავსების მომენტში მოქმედი ფასი სავალდებულოა ორივე მხარისთვის.</p>
<p>ვებგვერდზე მითითებული ტექნიკური მახასიათებლები და ფოტოსურათები მოწოდებულია მწარმოებლისა და ოფიციალური დისტრიბუტორის მიერ. მწარმოებელმა შესაძლოა შეცვალოს პროდუქტის კომპლექტაცია, ხოლო ფოტო შესაძლოა იყოს საილუსტრაციო. თუ მიღებული პროდუქტი არსებითად განსხვავდება აღწერისგან, მოქმედებს <a href="#returns">დაბრუნებისა და გარანტიის</a> პირობები.</p>
<p>უფლებას ვიტოვებთ არ დავადასტუროთ შეკვეთა, თუ პროდუქტი მარაგში აღარ არის ან მისი ფასი/მახასიათებლები აშკარა ტექნიკური შეცდომით გამოქვეყნდა. ასეთ შემთხვევაში დაგიკავშირდებით და გადახდილ თანხას სრულად დაგიბრუნებთ.</p>

<h3>3. შეკვეთა და დადასტურება</h3>
<p>შეკვეთა მიღებულად ითვლება, როდესაც მიიღებთ დადასტურებას ელ. ფოსტით ან ტელეფონით. ვალდებული ხართ მიუთითოთ ზუსტი მონაცემები; არასწორი ინფორმაციით გამოწვეულ დაგვიანებასა თუ ჩაუბარებელ მიწოდებაზე პასუხისმგებლობას არ ვიღებთ.</p>

<h3>4. გადახდა</h3>
<p>ვებგვერდზე ხელმისაწვდომია გადახდის შემდეგი მეთოდები:</p>
<ul>
    <li><strong>ბარათით ონლაინ</strong> — Visa / Mastercard ბარათით, თიბისი ბანკის ან საქართველოს ბანკის დაცულ გადახდის გვერდზე. ბარათის მონაცემებს შეიყვანთ მხოლოდ ბანკის გვერდზე; ვებგვერდი მათ არ იღებს და არ ინახავს.</li>
    <li><strong>განვადება</strong> — თიბისი ბანკის ან საქართველოს ბანკის ონლაინ განვადებით. განვადების დამტკიცებას, პროცენტს, ვადასა და სხვა პირობებს განსაზღვრავს ბანკი ცალკე ხელშეკრულებით, რომლის მხარეც ${c.legalName} არ არის. ვებგვერდზე ნაჩვენები ყოველთვიური გადასახადი საორიენტაციოა. განვადების განაცხადისთვის აუცილებელია პირადი ნომერი.</li>
    <li><strong>ნაღდი ანგარიშსწორება მიწოდებისას</strong> — თანხას იხდით ლარში კურიერთან პროდუქტის ჩაბარებისას და მიიღებთ ჩეკს. ნაღდი ანგარიშსწორებით შეკვეთა ძალაში შედის მას შემდეგ, რაც მას ტელეფონით დავადასტურებთ.</li>
</ul>
<p>სამონტაჟო სამუშაო პროდუქტის ფასში არ შედის და ანაზღაურდება ცალკე, ადგილზე, სამუშაოს დასრულების შემდეგ (იხ. პუნქტი 6).</p>

<h3>5. მიწოდება</h3>
<p>მიწოდება ხორციელდება შეკვეთის დადასტურების შემდეგ შეთანხმებულ ვადაში, როგორც წესი, 2–5 სამუშაო დღეში. მიწოდებისას შეამოწმეთ შეფუთვის მთლიანობა და პროდუქტის მდგომარეობა. ტრანსპორტირებისას მიყენებული ხილული დაზიანება უნდა დაფიქსირდეს ჩაბარების მომენტში; მოგვიანებით წარმოდგენილი ამ ტიპის პრეტენზია ვერ მიიღება.</p>

<h3>6. მონტაჟი</h3>
<p>მონტაჟი ცალკე მომსახურებაა და პროდუქტის ფასში არ შედის, თუ აშკარად სხვაგვარად არ არის მითითებული. მისი ღირებულება დამოკიდებულია ობიექტზე და დგინდება ადგილზე დათვალიერების შემდეგ; ანაზღაურება ხდება სამუშაოს დასრულების შემდეგ.</p>
<p>გაითვალისწინეთ: მწარმოებლის გარანტია, როგორც წესი, უქმდება, თუ მონტაჟი არაუფლებამოსილმა პირმა შეასრულა. გირჩევთ, მონტაჟი შეუკვეთოთ ჩვენთან ან ავტორიზებულ სერვისცენტრში. ჩვენ მიერ შესრულებულ სამონტაჟო სამუშაოზე ვრცელდება <strong>${w}-თვიანი</strong> გარანტია (იხ. <a href="#returns">დაბრუნება და გარანტია</a>).</p>

<h3>7. ინტელექტუალური საკუთრება</h3>
<p>ვებგვერდის დიზაინი, ტექსტები და მასალები დაცულია საავტორო უფლებით. ბრენდების სასაქონლო ნიშნები ეკუთვნის მათ მფლობელებს და გამოიყენება მხოლოდ პროდუქციის იდენტიფიცირებისთვის.</p>

<h3>8. პასუხისმგებლობის შეზღუდვა</h3>
<p>ვებგვერდი მოწოდებულია „როგორც არის" პრინციპით. ტექნიკური ხარვეზით ან დროებითი მიუწვდომლობით გამოწვეულ ზიანზე პასუხისმგებლობას არ ვიღებთ. ეს პუნქტი არ ზღუდავს „მომხმარებლის უფლებების დაცვის შესახებ" საქართველოს კანონით გარანტირებულ უფლებებს.</p>

<h3>9. მარეგულირებელი კანონმდებლობა და დავები</h3>
<p>წინამდებარე პირობები რეგულირდება საქართველოს კანონმდებლობით. მხარეები დავას პირველ რიგში მოლაპარაკებით მოაგვარებენ; წარუმატებლობის შემთხვევაში დავას განიხილავს საქართველოს სასამართლო. მომხმარებელს ასევე შეუძლია მიმართოს <a href="https://www.competition.ge" target="_blank" rel="noopener">კონკურენციისა და მომხმარებლის დაცვის სააგენტოს</a>.</p>

<h3>10. ცვლილებები</h3>
<p>უფლებას ვიტოვებთ შევცვალოთ წინამდებარე პირობები. ცვლილება ძალაში შედის გამოქვეყნებისთანავე და უკვე დადასტურებულ შეკვეთებზე უკუძალით არ ვრცელდება.</p>`
        },
        privacy: {
            title: "კონფიდენციალურობის პოლიტიკა",
            html: `
<p class="legal-lead">ეს პოლიტიკა განმარტავს, რომელ პერსონალურ მონაცემებს ვამუშავებთ, რატომ და რა უფლებები გაქვთ. მონაცემებს ვამუშავებთ „პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის შესაბამისად.</p>

<h3>1. მონაცემთა დამმუშავებელი</h3>
<p>${c.legalName} (ს/კ ${c.taxId}), ${c.address}. კონფიდენციალურობასთან დაკავშირებულ ნებისმიერ საკითხზე მოგვწერეთ: <a href="mailto:${c.email}">${c.email}</a>.</p>

<h3>2. რა მონაცემებს ვაგროვებთ</h3>
<ul>
    <li><strong>ანგარიში:</strong> ელ. ფოსტა და პაროლი (დაშიფრული სახით), ან — Google-ით შესვლისას — თქვენი Google ანგარიშის სახელი და ელ. ფოსტა.</li>
    <li><strong>შეკვეთა:</strong> სახელი და გვარი, ტელეფონი, ელ. ფოსტა, მიწოდების მისამართი, შეკვეთილი პროდუქტი, თანხა, გადახდის მეთოდი და შეკვეთის სტატუსი. შეკვეთა შესაძლებელია ანგარიშის გარეშეც — ასეთ შემთხვევაში ვინახავთ მხოლოდ შეკვეთის მონაცემებს.</li>
    <li><strong>პირადი ნომერი:</strong> მხოლოდ განვადების განაცხადისას, რადგან მას ბანკი ითხოვს. ბარათით ან ნაღდი ანგარიშსწორებით შეკვეთისთვის პირადი ნომერი არ არის სავალდებულო.</li>
    <li><strong>სერვისის ჯავშანი:</strong> სახელი, ტელეფონი, მისამართი, სასურველი თარიღი და თქვენ მიერ დატოვებული შენიშვნა — მონტაჟის, დემონტაჟის ან მომსახურების შეკვეთისას.</li>
    <li><strong>ტექნიკური მონაცემები:</strong> ანალიტიკურ ინსტრუმენტებს ამჟამად არ ვიყენებთ. მონაცემთა ბაზის პროვაიდერი (Supabase) უსაფრთხოების მიზნით ინახავს სტანდარტულ სერვერულ ჟურნალს (IP მისამართი, მოთხოვნის დრო).</li>
</ul>
<p><strong>ბარათის მონაცემებს არ ვაგროვებთ და არ ვინახავთ.</strong> ბარათით გადახდა სრულად ხორციელდება თიბისი ბანკის ან საქართველოს ბანკის დაცულ გვერდზე. ვებგვერდი ინახავს მხოლოდ იმას, რომელი ბანკი აირჩიეთ.</p>

<h3>3. სამართლებრივი საფუძველი და მიზანი</h3>
<ul>
    <li><strong>ხელშეკრულების შესრულება</strong> — შეკვეთის დამუშავება, მიწოდება, მონტაჟი, საგარანტიო მომსახურება.</li>
    <li><strong>კანონისმიერი ვალდებულება</strong> — საბუღალტრო და საგადასახადო აღრიცხვა.</li>
    <li><strong>თანხმობა</strong> — ანალიტიკური ან მარკეტინგული cookie-ები, თუ მომავალში დავნერგავთ. თანხმობის გამოხმობა შესაძლებელია ნებისმიერ დროს.</li>
    <li><strong>ლეგიტიმური ინტერესი</strong> — ვებგვერდის უსაფრთხოება და გაუმჯობესება.</li>
</ul>

<h3>4. ვის ვუზიარებთ</h3>
<p>მონაცემებს არ ვყიდით. ვუზიარებთ მხოლოდ იმას, რაც აუცილებელია: კურიერსა და სამონტაჟო ჯგუფს (მისამართი და ტელეფონი), თიბისი ბანკს ან საქართველოს ბანკს (გადახდის ან განვადების გასაფორმებლად), პროდუქტის ოფიციალური დისტრიბუტორის სერვისცენტრს (საგარანტიო მომსახურებისთვის), ჩვენს საბუღალტრო და IT მომსახურების მიმწოდებლებს, ასევე უფლებამოსილ სახელმწიფო ორგანოებს — კანონით გათვალისწინებულ შემთხვევებში.</p>
<p>ვებგვერდი იყენებს შემდეგ გარე სერვისებს, რომლებსაც მონაცემები შესაძლოა საქართველოს ფარგლებს გარეთ დაამუშაონ:</p>
<ul>
    <li><strong>Supabase</strong> — მონაცემთა ბაზა და ავტორიზაცია; სერვერები განთავსებულია ევროკავშირში (ფრანკფურტი).</li>
    <li><strong>Google</strong> — Google-ით შესვლა, მხოლოდ თუ თავად აირჩევთ ამ მეთოდს.</li>
</ul>

<h3>5. შენახვის ვადა</h3>
<p>შეკვეთისა და საბუღალტრო ჩანაწერები ინახება კანონით გათვალისწინებული <strong>6 წლის</strong> განმავლობაში. სერვისის ჯავშნის მონაცემები ინახება სამუშაოს დასრულებიდან 1 წლის განმავლობაში (საგარანტიო მომსახურებისთვის). ანგარიშის მონაცემები ინახება ანგარიშის მოქმედების პერიოდში; წაშლის მოთხოვნისას მათ ვშლით, გარდა იმ მონაცემებისა, რომელთა შენახვაც კანონით გვევალება.</p>

<h3>6. თქვენი უფლებები</h3>
<p>უფლება გაქვთ: მიიღოთ ინფორმაცია დამუშავების შესახებ; მოითხოვოთ ასლი, შესწორება, განახლება, დაბლოკვა, წაშლა ან განადგურება; გამოიხმოთ თანხმობა; მოითხოვოთ მონაცემთა გადატანა. მოთხოვნაზე პასუხს გაიცემა კანონით დადგენილ ვადაში, უსასყიდლოდ.</p>
<p>მოგვწერეთ <a href="mailto:${c.email}">${c.email}</a>. თუ პასუხი არ დაგაკმაყოფილებთ, უფლება გაქვთ მიმართოთ <a href="https://personaldata.ge" target="_blank" rel="noopener">პერსონალურ მონაცემთა დაცვის სამსახურს</a> ან სასამართლოს.</p>

<h3>7. Cookie-ები და მსგავსი ტექნოლოგიები</h3>
<p><strong>აუცილებელი.</strong> ვებგვერდი თქვენს ბრაუზერში ინახავს მხოლოდ ორ რამეს: არჩეულ ენას და — თუ შეხვედით ანგარიშში — შესვლის სესიას. ამათ გარეშე ვებგვერდი ვერ იმუშავებს, ამიტომ მათთვის თანხმობა არ არის საჭირო. ეს ჩანაწერები სხვა ვებგვერდებისთვის მიუწვდომელია.</p>
<p><strong>ანალიტიკური და მარკეტინგული.</strong> ამჟამად ვებგვერდი არ იყენებს ანალიტიკურ ან სარეკლამო cookie-ებს და თქვენს ვიზიტს არ ითვლის. თუ მომავალში ასეთ ინსტრუმენტს დავნერგავთ, ის ჩაიტვირთება მხოლოდ მას შემდეგ, რაც ვებგვერდზე გამოჩენილ ბანერზე თანხმობას განაცხადებთ, და ეს პოლიტიკა შესაბამისად განახლდება.</p>
<p><strong>მესამე მხარის.</strong> Google-ით შესვლის გამოყენებისას Google საკუთარ cookie-ებს აყენებს საკუთარი <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">კონფიდენციალურობის პოლიტიკის</a> შესაბამისად. თუ Google-ით შესვლას არ იყენებთ, ეს cookie-ები არ იქმნება.</p>
<p><strong>წაშლა.</strong> ბრაუზერის პარამეტრებში ვებგვერდის მონაცემების წაშლით ენის არჩევანი და სესია იშლება; ვებგვერდი ჩვეულებრივ გააგრძელებს მუშაობას.</p>

<h3>8. უსაფრთხოება</h3>
<p>კავშირი დაშიფრულია (HTTPS), ბაზაზე წვდომა შეზღუდულია მონაცემთა მფლობელითა და უფლებამოსილი პერსონალით, ხოლო ადმინისტრირების პანელი ხელმისაწვდომია მხოლოდ უფლებამოსილი პირებისთვის.</p>`
        },
        returns: {
            title: "დაბრუნება და გარანტია",
            html: `
<p class="legal-lead">ეს გვერდი აღწერს პროდუქტის დაბრუნებისა და საგარანტიო მომსახურების წესებს. იგი ეფუძნება „მომხმარებლის უფლებების დაცვის შესახებ" საქართველოს კანონს და არ ზღუდავს ამ კანონით მინიჭებულ უფლებებს.</p>

<h3>1. დაბრუნების უფლება 14 დღის განმავლობაში</h3>
<p>დისტანციურად შეძენილი პროდუქტის დაბრუნება შეგიძლიათ მიღებიდან <strong>14 კალენდარული დღის</strong> განმავლობაში, მიზეზის მითითების გარეშე.</p>
<p>პროდუქტი უნდა იყოს:</p>
<ul>
    <li>გამოუყენებელი და დაუზიანებელი;</li>
    <li>სრული კომპლექტაციით, ორიგინალ შეფუთვაში, ყველა აქსესუარითა და დოკუმენტით;</li>
    <li>ხელახლა გასაყიდად ვარგის მდგომარეობაში.</li>
</ul>
<p>თანხას დაგიბრუნებთ პროდუქტის მიღებიდან <strong>14 დღის</strong> განმავლობაში, იმავე მეთოდით, რომლითაც გადაიხადეთ; ნაღდი ანგარიშსწორების შემთხვევაში — თქვენს საბანკო ანგარიშზე.</p>

<h3>2. როდის არ მოქმედებს 14-დღიანი უფლება</h3>
<p>უფლება არ ვრცელდება, თუ პროდუქტი:</p>
<ul>
    <li>დამონტაჟებულია და/ან ექსპლუატაციაში შევიდა (სისტემასთან უკვე მიერთებული კონდიციონერი ან ქვაბი);</li>
    <li>დამზადდა ან შეიკვეთა თქვენი ინდივიდუალური მოთხოვნით;</li>
    <li>დაზიანდა თქვენი ბრალით.</li>
</ul>
<p>ეს კლიმატური ტექნიკის თავისებურებაა: დამონტაჟებული და ფრეონით შევსებული მოწყობილობა ახალი აღარ არის.</p>

<h3>3. წუნდებული ან აღწერისგან განსხვავებული პროდუქტი</h3>
<p>თუ პროდუქტი წუნდებულია ან არსებითად განსხვავდება ვებგვერდზე მოცემული აღწერისგან, უფლება გაქვთ მოითხოვოთ — ამ თანმიმდევრობით — <strong>უფასო შეკეთება ან შეცვლა</strong>; ხოლო თუ ეს შეუძლებელია ან არაპროპორციულია — <strong>ფასის შემცირება ან ხელშეკრულების გაუქმება</strong> სრული თანხის დაბრუნებით.</p>
<p>ასეთ შემთხვევაში დაბრუნების ტრანსპორტირების ხარჯს ჩვენ ვფარავთ. კანონის თანახმად, მიღებიდან <strong>6 თვის</strong> განმავლობაში გამოვლენილი ნაკლი თავიდანვე არსებულად მიიჩნევა, თუ საწინააღმდეგო არ დამტკიცდება.</p>

<h3>4. პროდუქტის გარანტია</h3>
<p>ყველა პროდუქტს თან ახლავს მწარმოებლის გარანტია, რომელსაც საქართველოში უზრუნველყოფს ოფიციალური დისტრიბუტორი. ზუსტი ვადა მითითებულია საგარანტიო ტალონსა და პროდუქტის გვერდზე (კონდიციონერზე, როგორც წესი, 1–5 წელი, კომპრესორზე — მეტი). ამისგან დამოუკიდებლად მოქმედებს კანონით გათვალისწინებული <strong>2-წლიანი</strong> შესაბამისობის გარანტია.</p>
<p>საგარანტიო შეკეთებას ასრულებს დისტრიბუტორის ავტორიზებული სერვისცენტრი. მომსახურებისთვის საჭიროა საგარანტიო ტალონი და შეძენის დამადასტურებელი დოკუმენტი (ჩეკი ან ინვოისი). სერვისცენტრთან კომუნიკაციასა და პროდუქტის გადაცემაში დაგეხმარებით.</p>
<p>პროდუქტის შეცვლა ხდება თქვენი თანხმობით, იმავე ან უფრო მაღალი ღირებულების (სხვაობის დაფარვით) პროდუქტით, რომელიც შეცვლის მომენტში გასაყიდად ხელმისაწვდომია.</p>

<h3>5. სამონტაჟო სამუშაოს გარანტია</h3>
<p>ჩვენ მიერ შესრულებულ სამონტაჟო სამუშაოზე (კრონშტეინების დამაგრება, მილების გაყვანა, ვაკუუმირება, მიერთება) ვრცელდება <strong>${w}-თვიანი</strong> გარანტია სამუშაოს დასრულების დღიდან. ამ პერიოდში მონტაჟის ხარისხით გამოწვეულ ხარვეზს (მაგ. ფრეონის გაჟონვა შეერთებაზე, კონდენსატის წვეთვა) უფასოდ გამოვასწორებთ.</p>

<h3>6. როდის არ მოქმედებს გარანტია</h3>
<p>საგარანტიო მომსახურება არ ხორციელდება, თუ:</p>
<ul>
    <li>საგარანტიო ვადა გასულია;</li>
    <li>ვერ წარადგენთ საგარანტიო ტალონს და პროდუქტის იდენტიფიცირება სხვაგვარად შეუძლებელია;</li>
    <li>სერიული ნომერი წაშლილია, შეცვლილია ან არ იკითხება, ან ლუქი/პლომბი მოხსნილია;</li>
    <li>დაზიანება გამოწვეულია მექანიკური ზემოქმედებით, არასწორი ექსპლუატაციით ან შენახვის პირობების დარღვევით;</li>
    <li>დაზიანება გამოწვეულია სითხის ან უცხო სხეულის მოხვედრით, მეხის დაცემით ან სხვა სტიქიური მოვლენით;</li>
    <li>დაზიანება გამოწვეულია ელექტროქსელის ძაბვის ცვალებადობით (გირჩევთ ძაბვის სტაბილიზატორის გამოყენებას);</li>
    <li>მონტაჟი, დემონტაჟი ან შეკეთება შეასრულა არაუფლებამოსილმა პირმა;</li>
    <li>არ ჩატარებულა მწარმოებლის მიერ გათვალისწინებული პერიოდული მომსახურება (ფილტრების წმენდა, პროფილაქტიკა);</li>
    <li>საყოფაცხოვრებო დანიშნულების პროდუქტი გამოიყენებოდა კომერციული მიზნით.</li>
</ul>
<p>გარანტია არ ვრცელდება ხმარებად მასალებზე, რომლებიც ნორმალური ექსპლუატაციისას იცვლება (ფილტრები, ბატარეები პულტში და მსგავსი).</p>

<h3>7. როგორ წარვადგინო პრეტენზია</h3>
<ol>
    <li>დაგვიკავშირდით: <a href="mailto:${c.email}">${c.email}</a> ან <a href="tel:${tel}">${c.phone}</a>.</li>
    <li>მიუთითეთ შეკვეთის ნომერი და პროდუქტი, მოკლედ აღწერეთ პრობლემა და, თუ შესაძლებელია, დაურთეთ ფოტო ან ვიდეო.</li>
    <li>გიპასუხებთ <strong>2 სამუშაო დღეში</strong> და შევათანხმებთ შემდეგ ნაბიჯს — დიაგნოსტიკა, შეკეთება, შეცვლა ან თანხის დაბრუნება.</li>
</ol>`
        }
    };

    const en = {
        terms: {
            title: "Terms & Conditions",
            html: `
<p class="legal-lead">These terms govern purchases of products and services made through ${c.site} (the "Website"). By placing an order you agree to them.</p>

<h3>1. About the seller</h3>
<ul>
    <li>Legal name: <strong>${c.legalNameEn}</strong></li>
    <li>Tax ID: <strong>${c.taxId}</strong></li>
    <li>Address: ${c.addressEn}</li>
    <li>Phone: <a href="tel:${tel}">${c.phone}</a></li>
    <li>Email: <a href="mailto:${c.email}">${c.email}</a></li>
</ul>

<h3>2. Products and prices</h3>
<p>Prices are shown in Georgian Lari and include VAT. The price valid at the moment you place the order binds both parties.</p>
<p>Specifications and photos are supplied by the manufacturer and the official distributor. Manufacturers may change a product's configuration, and a photo may be illustrative. If what you receive differs materially from the description, the <a href="#returns">returns and warranty</a> terms apply.</p>
<p>We may decline to confirm an order if the product is out of stock or if its price or specification was published with an obvious technical error. We will contact you and refund any amount paid in full.</p>

<h3>3. Orders and confirmation</h3>
<p>An order is accepted once you receive confirmation by email or phone. You must provide accurate details; we are not liable for delays or failed delivery caused by incorrect information.</p>

<h3>4. Payment</h3>
<p>The Website offers the following payment methods:</p>
<ul>
    <li><strong>Card online</strong> — Visa / Mastercard, on the secure payment page of TBC Bank or Bank of Georgia. You enter card details only on the bank's page; the Website never receives or stores them.</li>
    <li><strong>Instalments</strong> — online financing from TBC Bank or Bank of Georgia. Approval, interest, term and all other conditions are set by the bank under a separate agreement to which ${c.legalNameEn} is not a party. The monthly amount shown on the Website is indicative. A personal ID number is required for an instalment application.</li>
    <li><strong>Cash on delivery</strong> — you pay the courier in Lari when the product is handed over and receive a receipt. A cash order becomes binding once we confirm it by phone.</li>
</ul>
<p>Installation is not included in the product price and is paid separately, on site, after the work is complete (see section 6).</p>

<h3>5. Delivery</h3>
<p>Delivery takes place within the period agreed after the order is confirmed, normally 2–5 business days. On delivery, check that the packaging is intact and inspect the product. Visible transport damage must be recorded at the moment of receipt; claims of this kind raised later cannot be accepted.</p>

<h3>6. Installation</h3>
<p>Installation is a separate service and is not included in the product price unless expressly stated. Its cost depends on the site and is set after an on-site inspection; you pay once the work is complete.</p>
<p>Please note: a manufacturer's warranty is generally void if installation was carried out by an unauthorised party. We recommend booking installation with us or with an authorised service centre. Installation work carried out by us is covered by a <strong>${w}-month</strong> warranty (see <a href="#returns">Returns & Warranty</a>).</p>

<h3>7. Intellectual property</h3>
<p>The Website's design, texts and materials are protected by copyright. Brand trademarks belong to their owners and are used only to identify the products.</p>

<h3>8. Limitation of liability</h3>
<p>The Website is provided "as is". We are not liable for damage arising from technical faults or temporary unavailability. This clause does not limit the rights guaranteed to you by the Georgian Law on Consumer Rights Protection.</p>

<h3>9. Governing law and disputes</h3>
<p>These terms are governed by the law of Georgia. The parties will first attempt to settle any dispute by negotiation; failing that, it will be heard by a Georgian court. Consumers may also contact the <a href="https://www.competition.ge" target="_blank" rel="noopener">Competition and Consumer Protection Agency</a>.</p>

<h3>10. Changes</h3>
<p>We may amend these terms. Amendments take effect on publication and do not apply retroactively to orders already confirmed.</p>`
        },
        privacy: {
            title: "Privacy Policy",
            html: `
<p class="legal-lead">This policy explains which personal data we process, why, and what rights you have. We process data in accordance with the Georgian Law on Personal Data Protection.</p>

<h3>1. Data controller</h3>
<p>${c.legalNameEn} (Tax ID ${c.taxId}), ${c.addressEn}. For any privacy matter write to <a href="mailto:${c.email}">${c.email}</a>.</p>

<h3>2. What we collect</h3>
<ul>
    <li><strong>Account:</strong> email and password (stored hashed), or — if you sign in with Google — the name and email of your Google account.</li>
    <li><strong>Order:</strong> first and last name, phone, email, delivery address, the product ordered, amount, payment method and order status. You can order without an account; in that case we keep only the order data.</li>
    <li><strong>Personal ID number:</strong> only for an instalment application, because the bank requires it. It is not required for card or cash orders.</li>
    <li><strong>Service booking:</strong> name, phone, address, preferred date and any note you leave when booking installation, dismantling or maintenance.</li>
    <li><strong>Technical data:</strong> we do not currently use any analytics tools. Our database provider (Supabase) keeps standard server logs (IP address, request time) for security purposes.</li>
</ul>
<p><strong>We do not collect or store card details.</strong> Card payment takes place entirely on the secure page of TBC Bank or Bank of Georgia. The Website records only which bank you chose.</p>

<h3>3. Legal basis and purpose</h3>
<ul>
    <li><strong>Performance of a contract</strong> — processing your order, delivery, installation, warranty service.</li>
    <li><strong>Legal obligation</strong> — accounting and tax records.</li>
    <li><strong>Consent</strong> — analytics or marketing cookies, should we introduce them in future. Consent can be withdrawn at any time.</li>
    <li><strong>Legitimate interest</strong> — securing and improving the Website.</li>
</ul>

<h3>4. Who we share with</h3>
<p>We do not sell data. We share only what is necessary: with our courier and installation team (delivery address and phone), with TBC Bank or Bank of Georgia (to process a payment or an instalment application), with the official distributor's service centre (for warranty work), with our accounting and IT providers, and with authorised public bodies where the law requires it.</p>
<p>The Website uses the following third-party services, which may process data outside Georgia:</p>
<ul>
    <li><strong>Supabase</strong> — database and authentication; servers located in the European Union (Frankfurt).</li>
    <li><strong>Google</strong> — Google Sign-In, only if you choose that method yourself.</li>
</ul>

<h3>5. Retention</h3>
<p>Order and accounting records are kept for the <strong>6 years</strong> required by law. Service booking data is kept for 1 year after the work is completed (for warranty purposes). Account data is kept while the account is active; on a deletion request we erase it, except where retention is legally required.</p>

<h3>6. Your rights</h3>
<p>You have the right to be informed about the processing; to request a copy, correction, update, blocking, erasure or destruction of your data; to withdraw consent; and to data portability. We respond within the statutory period, free of charge.</p>
<p>Write to <a href="mailto:${c.email}">${c.email}</a>. If our response does not satisfy you, you may contact the <a href="https://personaldata.ge" target="_blank" rel="noopener">Personal Data Protection Service</a> or the courts.</p>

<h3>7. Cookies and similar technologies</h3>
<p><strong>Essential.</strong> The Website stores only two things in your browser: your chosen language and — if you signed in — your login session. The Website cannot work without them, so no consent is needed. These records are not visible to other websites.</p>
<p><strong>Analytics and marketing.</strong> The Website currently uses no analytics or advertising cookies and does not count your visit. If we introduce such a tool in future, it will load only after you give consent on a banner shown on the Website, and this policy will be updated accordingly.</p>
<p><strong>Third-party.</strong> If you use Google Sign-In, Google sets its own cookies under its own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacy policy</a>. If you do not use Google Sign-In, these cookies are never created.</p>
<p><strong>Deleting.</strong> Clearing the Website's data in your browser settings removes the language choice and the session; the Website simply continues to work as normal.</p>

<h3>8. Security</h3>
<p>Connections are encrypted (HTTPS), database access is restricted to the data owner and authorised staff, and the admin panel is available only to authorised personnel.</p>`
        },
        returns: {
            title: "Returns & Warranty",
            html: `
<p class="legal-lead">This page sets out how to return a product and how warranty claims work. It follows the Georgian Law on Consumer Rights Protection and does not limit the rights that law gives you.</p>

<h3>1. 14-day right to return</h3>
<p>You may return a product bought at a distance within <strong>14 calendar days</strong> of receiving it, without giving a reason.</p>
<p>The product must be:</p>
<ul>
    <li>unused and undamaged;</li>
    <li>complete, in its original packaging, with all accessories and documents;</li>
    <li>in resalable condition.</li>
</ul>
<p>We refund you <strong>within 14 days</strong> of receiving the product back, using the same method you paid with; for cash orders, to your bank account.</p>

<h3>2. When the 14-day right does not apply</h3>
<p>It does not apply where the product:</p>
<ul>
    <li>has been installed and/or put into use (an air conditioner or boiler already connected to a system);</li>
    <li>was made or ordered to your individual specification;</li>
    <li>was damaged through your own fault.</li>
</ul>
<p>This is an inherent limitation for climate equipment: once a unit is mounted and charged with refrigerant it is no longer new.</p>

<h3>3. Faulty products or products that differ from the description</h3>
<p>If a product is faulty or differs materially from the description on the Website, you may require — in this order — <strong>free repair or replacement</strong>; and where that is impossible or disproportionate, <strong>a price reduction or cancellation of the contract</strong> with a full refund.</p>
<p>In that case we cover the cost of return shipping. Under the law, a fault that appears within <strong>6 months</strong> of receipt is presumed to have existed from the outset unless the contrary is proven.</p>

<h3>4. Product warranty</h3>
<p>Every product carries the manufacturer's warranty, provided in Georgia by the official distributor. The exact term is stated on the warranty card and on the product page (typically 1–5 years for an air conditioner, longer for the compressor). Separately, the <strong>2-year</strong> statutory conformity guarantee applies in its own right.</p>
<p>Warranty repairs are carried out by the distributor's authorised service centre. Service requires the warranty card and proof of purchase (receipt or invoice). We will help you contact the service centre and hand over the product.</p>
<p>A replacement is made with your consent, with a product of the same or higher value (you cover the difference) that is available for sale at the time of replacement.</p>

<h3>5. Installation work warranty</h3>
<p>Installation work carried out by us (bracket mounting, piping, vacuuming, connection) is covered by a <strong>${w}-month</strong> warranty from the day the work is completed. During this period we fix free of charge any defect caused by the quality of the installation, such as a refrigerant leak at a joint or condensate dripping.</p>

<h3>6. When the warranty does not apply</h3>
<p>Warranty service is not provided where:</p>
<ul>
    <li>the warranty period has expired;</li>
    <li>you cannot present the warranty card and the product cannot otherwise be identified;</li>
    <li>the serial number has been removed, altered or is unreadable, or a seal has been broken;</li>
    <li>the damage was caused by mechanical impact, improper use, or a breach of the storage conditions;</li>
    <li>the damage was caused by liquid or foreign-body ingress, lightning or another natural event;</li>
    <li>the damage was caused by voltage fluctuations in the power supply (we recommend a voltage stabiliser);</li>
    <li>installation, dismantling or repair was carried out by an unauthorised party;</li>
    <li>the periodic maintenance required by the manufacturer (filter cleaning, servicing) was not performed;</li>
    <li>a household-rated product was used for commercial purposes.</li>
</ul>
<p>The warranty does not cover consumables that are replaced in normal use (filters, remote-control batteries and the like).</p>

<h3>7. How to start a claim</h3>
<ol>
    <li>Contact us at <a href="mailto:${c.email}">${c.email}</a> or <a href="tel:${tel}">${c.phone}</a>.</li>
    <li>Give your order number and the product, describe the problem briefly, and attach a photo or video if you can.</li>
    <li>We reply within <strong>2 working days</strong> and agree the next step with you — diagnosis, repair, replacement or refund.</li>
</ol>`
        }
    };

    return state.currentLang === "ka" ? ka : en;
}

function renderLegalPage(slug) {
    const page = legalContent()[slug];
    const container = document.getElementById("legal-content");
    if (!page || !container) return;

    const isKa = state.currentLang === "ka";
    const updatedLabel = isKa ? "ბოლო განახლება" : "Last updated";
    const backLabel = isKa ? "მთავარზე დაბრუნება" : "Back to home";
    const otherLinks = LEGAL_SLUGS.filter(s => s !== slug)
        .map(s => `<a href="#${s}">${legalContent()[s].title}</a>`)
        .join("");

    document.title = `${page.title} | Climate Comfort`;
    container.innerHTML = `
        <a href="#" class="legal-back"><i class="fa-solid fa-arrow-left"></i> ${backLabel}</a>
        <h1 class="legal-title">${page.title}</h1>
        <p class="legal-updated">${updatedLabel}: ${COMPANY.updated}</p>
        <div class="legal-body">${page.html}</div>
        <nav class="legal-other">${otherLinks}</nav>
    `;
}

// ==========================================================================
// Product Detail Page (hash route: #product/<id>)
// ==========================================================================
const SUBPAGE_CLASSES = ["product-view", "checkout-view", "account-view", "legal-view"];

function handleRouting() {
    const productMatch = location.hash.match(/^#product\/([\w-]+)$/);
    const checkoutMatch = location.hash.match(/^#checkout\/([\w-]+)$/);
    const detailProduct = productMatch ? findProduct(productMatch[1]) : null;
    const checkoutProduct = checkoutMatch ? findProduct(checkoutMatch[1]) : null;
    const isAccount = location.hash === "#account";
    const legalSlug = LEGAL_SLUGS.includes(location.hash.slice(1)) ? location.hash.slice(1) : null;
    const wasOnSubPage = SUBPAGE_CLASSES.some(c => document.body.classList.contains(c));

    // WhatsApp message follows the page: product name on a product/checkout page
    updateWhatsAppLinks(detailProduct || checkoutProduct);

    // Checkout requires an account (or explicit guest mode) — bounce to the product page and ask to sign in
    if (checkoutProduct && !state.user && !state.guestCheckout) {
        state.afterAuthHash = `checkout/${checkoutProduct.id}`;
        location.hash = `product/${checkoutProduct.id}`;
        openAuthModal();
        return;
    }

    // Account page requires login — show home behind the auth modal, then return here
    if (isAccount && !state.user) {
        state.afterAuthHash = "account";
        document.body.classList.remove(...SUBPAGE_CLASSES);
        openAuthModal();
        setAuthMode("login");
        return;
    }

    function showSubPage(className, renderFn) {
        const entering = !document.body.classList.contains(className);
        renderFn();
        document.body.classList.remove(...SUBPAGE_CLASSES.filter(c => c !== className));
        document.body.classList.add(className);
        if (entering) window.scrollTo(0, 0);
    }

    if (legalSlug) {
        showSubPage("legal-view", () => renderLegalPage(legalSlug));
    } else if (isAccount) {
        showSubPage("account-view", () => renderAccountPage());
    } else if (checkoutProduct) {
        showSubPage("checkout-view", () => renderCheckoutPage(checkoutProduct));
    } else if (detailProduct) {
        showSubPage("product-view", () => renderProductDetailPage(detailProduct));
    } else {
        document.body.classList.remove(...SUBPAGE_CLASSES);
        document.title = t("doc-title");
        // Re-scroll to the section anchor once the home sections are visible again
        if (wasOnSubPage && location.hash) {
            const target = document.getElementById(location.hash.slice(1));
            if (target) target.scrollIntoView();
        }
    }
}

function renderProductDetailPage(p) {
    const container = document.getElementById("product-detail-content");
    if (!container) return;

    if (typeof trackViewItem === "function") trackViewItem(p);

    const lang = state.currentLang;
    const localizedTitle = p.title[lang];
    const techLabel = getTechLabel(p);
    const areaLabel = p.area.replace("m²", t("sqm"));
    const capacityLabel = p.category === 'boiler' ? (lang === 'ka' ? 'სიმძლავრე' : 'Power') : 'BTU';
    const typeLabel = p.type === 'Split System' ? t("ac-type-split") : p.type;

    // Minimum monthly estimate (same formula and term as the catalog cards)
    const bank = banksConfig.bog;
    const term = 12;
    const r = bank.standardRate / 100;
    const monthlyEst = (p.price * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)).toFixed(2);

    const inCart = state.cart.find(item => item.id === p.id);

    container.innerHTML = `
        <a href="#catalog" class="back-link"><i class="fa-solid fa-arrow-left"></i> ${t("detail-back")}</a>

        <div class="detail-layout">
            <div class="detail-visual ${p.images.length > 1 ? 'has-gallery' : ''}">
                <div class="card-badges">
                    ${p.energyClass ? `<span class="badge badge-accent">${p.energyClass}</span>` : ""}
                    ${p.inverter ? `<span class="badge badge-inverter">${techLabel}</span>` : ""}
                    ${stockBadge(p)}
                </div>
                ${p.images.length > 1 ? `
                <div class="detail-gallery">
                    <div class="detail-gallery-thumbs">
                        ${p.images.map((img, i) => `
                        <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${img}">
                            <img src="${img}" alt="${p.brand} ${i + 1}">
                        </button>`).join('')}
                    </div>
                    <div class="detail-gallery-main">
                        <img id="detail-main-image" src="${p.images[0]}" alt="${p.brand}">
                    </div>
                </div>` : buildProductMockup(p)}
            </div>

            <div class="detail-info">
                <span class="product-brand">${p.brand}</span>
                <h1 class="detail-title">${localizedTitle}</h1>
                <p class="detail-description">${p.description[lang]}</p>

                <div class="detail-price-row">
                    <div class="price-tag">${p.oldPrice && p.oldPrice > p.price ? `<span class="old-price">${p.oldPrice.toLocaleString()} ₾</span>` : ""}${p.price.toLocaleString()}</div>
                    <div class="financing-mini-indicator">
                        ${t("card-monthly-est")}<br>
                        <strong>${monthlyEst} ₾ / ${t("month-unit")}</strong>
                    </div>
                </div>

                <div class="detail-actions">
                    <button class="btn btn-accent btn-lg" id="detail-buy-btn">
                        ${t("card-buy")} <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <button class="btn btn-outline ${inCart ? 'added-to-cart' : ''}" id="detail-cart-btn">
                        <i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-shopping'}"></i> ${t("card-add-cart")}
                    </button>
                </div>
            </div>
        </div>

        <div class="detail-sections">
            <div class="detail-panel">
                <h3>${t("detail-specs")}</h3>
                <table class="spec-table">
                    ${lang === "ka" && p.specs && p.specs.length
                        ? p.specs.map(group => `
                            ${p.specs.length > 1 ? `<tr class="spec-group-row"><td colspan="2">${group.group}</td></tr>` : ""}
                            ${(group.items || []).map(item => `<tr><td>${item.name}</td><td>${item.value}</td></tr>`).join('')}
                        `).join('')
                        : `
                    <tr><td>${t("spec-brand")}</td><td>${p.brand}</td></tr>
                    ${p.btu ? `<tr><td>${capacityLabel}</td><td>${p.btu}</td></tr>` : ""}
                    ${p.area ? `<tr><td>${t("spec-area")}</td><td>${areaLabel}</td></tr>` : ""}
                    ${p.type ? `<tr><td>${t("spec-type")}</td><td>${typeLabel}</td></tr>` : ""}
                    ${p.energyClass ? `<tr><td>${t("spec-energy")}</td><td>${p.energyClass}</td></tr>` : ""}
                    <tr><td>${t("spec-tech")}</td><td>${techLabel}</td></tr>
                    ${p.color ? `<tr><td>${t("spec-color")}</td><td>${t(p.color)}</td></tr>` : ""}
                    `}
                </table>
            </div>
            ${p.features[lang].length ? `<div class="detail-panel">
                <h3>${t("detail-features")}</h3>
                <ul class="detail-features-list">
                    ${p.features[lang].map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('')}
                </ul>
            </div>` : ""}
        </div>
    `;

    document.title = `${localizedTitle} | Climate Comfort`;

    // Gallery thumbnails swap the big image; no reload of the rest of the page
    container.querySelectorAll(".gallery-thumb").forEach(btn => {
        btn.addEventListener("click", () => {
            container.querySelector("#detail-main-image").src = btn.getAttribute("data-img");
            container.querySelectorAll(".gallery-thumb").forEach(b => b.classList.toggle("active", b === btn));
        });
    });

    // Wire up action buttons (content is re-rendered on each visit / language switch)
    document.getElementById("detail-buy-btn").addEventListener("click", () => startPurchase(p.id));
    document.getElementById("detail-cart-btn").addEventListener("click", (e) => {
        addToCart(p.id);
        const btn = e.currentTarget;
        btn.classList.add("added-to-cart");
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t("card-add-cart")}`;
    });
}

// ==========================================================================
// Accounts & Auth — Supabase Auth
//
// Passwords never reach this code: signUp/signInWithPassword send them
// straight to Supabase, which stores only a hash. The session (a JWT) is
// persisted and refreshed by supabase-js, so the same account works on every
// device — unlike the old localStorage accounts, which lived in one browser
// and kept the password in plain text.
//
// state.user is the shape the rest of the app already expects
// ({ id, email, provider }); state.profile caches the `profiles` row so the
// render functions can stay synchronous.
// ==========================================================================

// Turns a Supabase session into the user object the UI works with
function userFromSession(session) {
    if (!session || !session.user) return null;
    const u = session.user;
    return {
        id: u.id,
        email: u.email,
        provider: (u.app_metadata && u.app_metadata.provider) || "email"
    };
}

// The profile row carries delivery details and saved cards. Missing row is not
// an error — the DB trigger creates one, but a brand-new signup can race it.
async function loadProfile() {
    if (!sbClient || !state.user) { state.profile = null; return null; }
    const { data, error } = await sbClient
        .from("profiles")
        .select("*")
        .eq("id", state.user.id)
        .maybeSingle();
    if (error) console.warn("Profile could not be loaded:", error.message);
    state.profile = data || { id: state.user.id, email: state.user.email, cards: [] };
    return state.profile;
}

async function saveProfile(patch) {
    if (!sbClient || !state.user) return { error: new Error("not signed in") };
    const row = { id: state.user.id, email: state.user.email, ...patch };
    const { data, error } = await sbClient
        .from("profiles")
        .upsert(row, { onConflict: "id" })
        .select()
        .maybeSingle();
    if (!error && data) state.profile = data;
    return { data, error };
}

// The account page lists orders straight from the database, so they follow the
// shopper to any device. RLS limits the rows to this user's own orders.
async function loadMyOrders() {
    if (!sbClient || !state.user) { state.orders = []; return []; }
    const { data, error } = await sbClient
        .from("orders")
        .select("order_no, product_title, amount, needs_install, payment_method, status, created_at")
        .eq("user_id", state.user.id)
        .order("created_at", { ascending: false });
    if (error) console.warn("Orders could not be loaded:", error.message);
    state.orders = data || [];
    return state.orders;
}

// Called on sign-in, sign-out and token refresh — the single place that keeps
// state.user / state.profile in step with Supabase.
async function applySession(session) {
    state.user = userFromSession(session);
    state.guestCheckout = false;
    if (state.user) {
        await loadProfile();
    } else {
        state.profile = null;
        state.orders = [];
    }
    updateAuthUI();
}

async function logout() {
    if (sbClient) await sbClient.auth.signOut();
    state.user = null;
    state.profile = null;
    state.orders = [];
    updateAuthUI();
    // Leaving an authenticated-only page? Return to the catalog
    if (document.body.classList.contains("checkout-view") || document.body.classList.contains("account-view")) {
        location.hash = "catalog";
    }
}

// Supabase returns English messages; map the common ones to the site's copy
// and fall back to the raw text so nothing is silently swallowed.
function authErrorKey(error) {
    const m = (error && error.message || "").toLowerCase();
    if (m.includes("already registered") || m.includes("already been registered")) return "auth-err-exists";
    if (m.includes("invalid login credentials")) return "auth-err-invalid";
    if (m.includes("password")) return "auth-err-password";
    if (m.includes("email")) return "auth-err-email";
    return null;
}

function updateAuthUI() {
    const btn = document.getElementById("account-btn");
    if (!btn) return;
    if (state.user) {
        btn.classList.remove("hidden");
        document.getElementById("account-name-short").innerText = state.user.email.split("@")[0];
        btn.title = state.user.email;
    } else {
        btn.classList.add("hidden");
    }
}

// Buy flow entry point: authenticated users go straight to checkout,
// everyone else registers / logs in first.
function startPurchase(productId) {
    if (state.user) {
        location.hash = `checkout/${productId}`;
    } else {
        state.afterAuthHash = `checkout/${productId}`;
        openAuthModal();
    }
}

let authMode = "register";

function openAuthModal() {
    setAuthMode("register");
    showAuthError(null);
    document.getElementById("auth-email-input").value = "";
    document.getElementById("auth-password-input").value = "";
    document.getElementById("auth-notice").classList.add("hidden");
    document.getElementById("auth-main-view").classList.remove("hidden");
    document.getElementById("auth-modal").classList.add("open");
    setupGoogleButton(); // swaps in the official Google button when a client ID is configured
}

function setAuthMode(mode) {
    authMode = mode;
    const isLogin = mode === "login";
    document.getElementById("auth-modal-title").innerText = t(isLogin ? "auth-title-login" : "auth-title-register");
    document.getElementById("auth-submit-btn").innerText = t(isLogin ? "auth-login-btn" : "auth-register-btn");
    document.getElementById("auth-switch-text").innerText = t(isLogin ? "auth-switch-to-register" : "auth-switch-to-login");
    document.getElementById("auth-switch-link").innerText = t(isLogin ? "auth-register-btn" : "auth-login-btn");
    showAuthError(null);
}

// `fallback` carries Supabase's own wording for cases we have no translation
// for, so an unexpected failure is still visible instead of silent.
function showAuthError(key, fallback) {
    const box = document.getElementById("auth-error");
    const notice = document.getElementById("auth-notice");
    if (notice) notice.classList.add("hidden");
    if (key || fallback) {
        box.innerText = key ? t(key) : fallback;
        box.classList.remove("hidden");
    } else {
        box.classList.add("hidden");
    }
}

// Green, non-error feedback: "check your inbox" and friends
function showAuthNotice(key) {
    const box = document.getElementById("auth-notice");
    if (!box) return;
    document.getElementById("auth-error").classList.add("hidden");
    box.innerText = t(key);
    box.classList.remove("hidden");
}

async function handleAuthSubmit() {
    const email = document.getElementById("auth-email-input").value.trim().toLowerCase();
    const password = document.getElementById("auth-password-input").value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAuthError("auth-err-email"); return; }
    if (password.length < 6) { showAuthError("auth-err-password"); return; }
    if (!sbClient) { showAuthError("auth-err-offline"); return; }

    const btn = document.getElementById("auth-submit-btn");
    const label = btn.innerText;
    btn.disabled = true;
    btn.innerText = t("co-processing");
    showAuthError(null);

    try {
        if (authMode === "register") {
            const { data, error } = await sbClient.auth.signUp({ email, password });
            if (error) { showAuthError(authErrorKey(error), error.message); return; }

            // With "Confirm email" switched on in Supabase, signUp returns no
            // session — the shopper has to click the link in their inbox first.
            if (!data.session) { showAuthNotice("auth-confirm-sent"); return; }
            await applySession(data.session);
        } else {
            const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
            if (error) { showAuthError(authErrorKey(error) || "auth-err-invalid", error.message); return; }
            await applySession(data.session);
        }
        finishAuth();
    } finally {
        btn.disabled = false;
        btn.innerText = label;
    }
}

// "Forgot password" — Supabase mails a one-time link back to the site
async function handlePasswordReset() {
    const email = document.getElementById("auth-email-input").value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAuthError("auth-err-email"); return; }
    if (!sbClient) { showAuthError("auth-err-offline"); return; }

    const { error } = await sbClient.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin + location.pathname + "#account"
    });
    if (error) { showAuthError(authErrorKey(error), error.message); return; }
    showAuthNotice("auth-reset-sent");
}

// Real Google OAuth through Supabase. The browser leaves the page and comes
// back with a session already established, which onAuthStateChange picks up —
// so there is nothing to do here but hand off.
async function handleGoogleSignIn() {
    if (!sbClient) { showAuthError("auth-err-offline"); return; }
    const { error } = await sbClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: location.origin + location.pathname + (state.afterAuthHash ? `#${state.afterAuthHash}` : "") }
    });
    if (error) showAuthError(authErrorKey(error), error.message);
}

function finishAuth() {
    document.getElementById("auth-modal").classList.remove("open");
    if (state.afterAuthHash) {
        const target = `#${state.afterAuthHash}`;
        state.afterAuthHash = null;
        if (location.hash === target) {
            // Already on the target page (e.g. guest logged in from checkout) — re-render in place
            handleRouting();
        } else {
            location.hash = target;
        }
    }
}

// ==========================================================================
// Checkout Page (hash route: #checkout/<id>, login required)
// ==========================================================================
function renderCheckoutPage(p) {
    const container = document.getElementById("checkout-content");
    if (!container) return;

    if (typeof trackBeginCheckout === "function") trackBeginCheckout(p);

    const lang = state.currentLang;
    const localizedTitle = p.title[lang];
    const isGuest = !state.user;
    const profile = isGuest ? {} : getCurrentAccount().profile;

    const identityLine = isGuest
        ? `${t("co-guest-label")} <a href="#" id="co-login-link">${t("auth-login-btn")}</a>`
        : `${t("co-signed-as")} <strong>${state.user.email}</strong> <a href="#" id="co-logout-link">${t("co-logout")}</a>`;

    // Guests have no account email — ask for it in the form
    const guestEmailField = isGuest ? `
                        <div class="form-control-group">
                            <label class="input-label" for="co-email">${t("auth-email")} <span class="required">*</span></label>
                            <input type="email" id="co-email" class="form-input" placeholder="you@example.com" required>
                        </div>` : '';

    container.innerHTML = `
        <a href="#product/${p.id}" class="back-link"><i class="fa-solid fa-arrow-left"></i> ${localizedTitle}</a>

        <h1 class="checkout-title">${t("co-title")}</h1>
        <p class="signed-in-line">${identityLine}</p>

        <div class="checkout-layout">
            <form class="checkout-main" id="co-form" novalidate>
                <!-- Recipient details -->
                <div class="detail-panel">
                    <h3><i class="fa-solid fa-user"></i> ${t("co-details-header")}</h3>
                    <div class="co-field-grid">
                        <div class="form-control-group">
                            <label class="input-label" for="co-firstname">${t("co-firstname")} <span class="required">*</span></label>
                            <input type="text" id="co-firstname" class="form-input" required value="${profile.firstName || ''}">
                        </div>
                        <div class="form-control-group">
                            <label class="input-label" for="co-lastname">${t("co-lastname")} <span class="required">*</span></label>
                            <input type="text" id="co-lastname" class="form-input" required value="${profile.lastName || ''}">
                        </div>
                        ${guestEmailField}
                        <div class="form-control-group">
                            <label class="input-label" for="co-phone">${t("co-phone")} <span class="required">*</span></label>
                            <input type="tel" id="co-phone" class="form-input" placeholder="+995 5xx xx xx xx" required value="${profile.phone || ''}">
                        </div>
                        <div class="form-control-group">
                            <label class="input-label" for="co-idnum">${t("co-idnum")}</label>
                            <input type="text" id="co-idnum" class="form-input" placeholder="01001234567" maxlength="11" inputmode="numeric" value="${profile.idNumber || ''}">
                            <small class="field-hint">${t("co-idnum-hint")}</small>
                        </div>
                        <div class="form-control-group co-field-full">
                            <label class="input-label" for="co-address">${t("co-address")} <span class="required">*</span></label>
                            <input type="text" id="co-address" class="form-input" placeholder="${lang === 'ka' ? 'ქალაქი, ქუჩა, ბინა...' : 'City, street, apartment...'}" required value="${profile.address || ''}">
                        </div>
                    </div>
                </div>

                <!-- Installation service toggle (paid on site AFTER installation — never online) -->
                <div class="detail-panel">
                    <h3><i class="fa-solid fa-screwdriver-wrench"></i> ${t("detail-install-title")}</h3>
                    <label class="install-toggle">
                        <input type="checkbox" id="co-install-toggle">
                        <span class="toggle-track"><span class="toggle-thumb"></span></span>
                        <span class="toggle-label">${t("co-install-toggle")}</span>
                    </label>
                    <p class="install-note"><i class="fa-solid fa-circle-info"></i> ${t("detail-install-note")}</p>
                </div>

                <!-- Payment method: TBC / BOG card payment (on the bank's page) or cash on delivery -->
                <div class="detail-panel">
                    <h3><i class="fa-solid fa-credit-card"></i> ${t("co-payment-header")}</h3>
                    <div class="pay-bank-options">
                        <label class="pay-bank-card">
                            <input type="radio" name="co-bank" value="tbc" checked>
                            <span class="bank-logo bank-tbc">TBC</span>
                            <span class="pay-bank-text">
                                <strong>TBC Bank</strong>
                                <small>${t("co-pay-card-desc")}</small>
                            </span>
                            <i class="fa-solid fa-circle-check pay-check"></i>
                        </label>
                        <label class="pay-bank-card">
                            <input type="radio" name="co-bank" value="bog">
                            <span class="bank-logo bank-bog">BOG</span>
                            <span class="pay-bank-text">
                                <strong>Bank of Georgia</strong>
                                <small>${t("co-pay-card-desc")}</small>
                            </span>
                            <i class="fa-solid fa-circle-check pay-check"></i>
                        </label>
                        <label class="pay-bank-card">
                            <input type="radio" name="co-bank" value="cash">
                            <span class="bank-logo bank-cash"><i class="fa-solid fa-money-bill-wave"></i></span>
                            <span class="pay-bank-text">
                                <strong>${t("co-pay-cash")}</strong>
                                <small>${t("co-pay-cash-desc")}</small>
                            </span>
                            <i class="fa-solid fa-circle-check pay-check"></i>
                        </label>
                    </div>
                </div>
            </form>

            <!-- Order summary -->
            <aside class="checkout-summary detail-panel">
                <h3>${t("co-summary-header")}</h3>
                <div class="co-product-row">
                    <div class="co-product-thumb">${buildProductMockup(p)}</div>
                    <div>
                        <span class="product-brand">${p.brand}</span>
                        <p class="co-product-title">${localizedTitle}</p>
                    </div>
                </div>
                <div class="co-summary-rows">
                    <div class="co-summary-row">
                        <span>${localizedTitle}</span>
                        <strong>${p.price.toLocaleString()} ₾</strong>
                    </div>
                    <div class="co-summary-row co-install-row hidden" id="co-install-row">
                        <span>${t("co-install-line")}</span>
                        <strong class="co-onsite">${t("co-install-onsite")}</strong>
                    </div>
                    <div class="co-summary-row co-total-row">
                        <span>${t("co-total")}</span>
                        <strong>${p.price.toLocaleString()} ₾</strong>
                    </div>
                </div>
                <p class="co-delivery-note"><i class="fa-solid fa-truck-fast"></i> ${t("co-delivery-note")}</p>
                <button type="submit" form="co-form" class="btn btn-accent btn-lg w-full" id="co-pay-btn">
                    <i class="fa-solid fa-lock"></i> ${t("co-pay-btn")} — ${p.price.toLocaleString()} ₾
                </button>
                <p class="co-secure-note"><i class="fa-solid fa-shield-halved"></i> ${lang === 'ka' ? 'დაცული გადახდა' : 'Secure payment'}</p>
            </aside>
        </div>
    `;

    document.title = `${t("co-title")} | Climate Comfort`;

    if (isGuest) {
        // Guest → offer login; after auth the page re-renders with the account attached
        document.getElementById("co-login-link").addEventListener("click", (e) => {
            e.preventDefault();
            state.afterAuthHash = `checkout/${p.id}`;
            openAuthModal();
            setAuthMode("login");
        });
    } else {
        document.getElementById("co-logout-link").addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm(t("auth-logout-confirm"))) logout();
        });
    }

    // Installation toggle reflects into the summary
    document.getElementById("co-install-toggle").addEventListener("change", (e) => {
        document.getElementById("co-install-row").classList.toggle("hidden", !e.target.checked);
    });

    // Cash on delivery is an order, not a payment — the button and note say so
    const coPayBtn = document.getElementById("co-pay-btn");
    const coSecureNote = document.querySelector(".co-secure-note");
    const priceLabel = `${p.price.toLocaleString()} ₾`;
    function refreshPayButton() {
        const isCash = document.querySelector('input[name="co-bank"]:checked').value === "cash";
        coPayBtn.innerHTML = isCash
            ? `<i class="fa-solid fa-truck-fast"></i> ${t("co-order-btn")} — ${priceLabel}`
            : `<i class="fa-solid fa-lock"></i> ${t("co-pay-btn")} — ${priceLabel}`;
        if (coSecureNote) coSecureNote.classList.toggle("hidden", isCash);
    }
    document.querySelectorAll('input[name="co-bank"]').forEach(r => r.addEventListener("change", refreshPayButton));

    // Submit → validate → mock payment → success modal
    document.getElementById("co-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("co-firstname").value.trim();
        const lastName = document.getElementById("co-lastname").value.trim();
        const phone = document.getElementById("co-phone").value.trim();
        const address = document.getElementById("co-address").value.trim();
        const idNumber = document.getElementById("co-idnum").value.trim();

        if (!firstName || !lastName || !phone || !address) return;
        let guestEmail = "";
        if (isGuest) {
            guestEmail = document.getElementById("co-email").value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) { alert(t("auth-err-email")); return; }
        }
        if (idNumber && !/^\d{11}$/.test(idNumber)) { alert(t("co-err-id")); return; }
        if (phone.replace(/\D/g, "").length < 9) { alert(t("co-err-phone")); return; }

        // Remember the profile for the next purchase (accounts only — guests aren't stored)
        if (!isGuest) {
            saveProfile({
                first_name: firstName, last_name: lastName,
                phone: phone, address: address,
                ...(idNumber ? { personal_id: idNumber } : {})   // never wipe a stored ID with an empty field
            });
        }

        const withInstall = document.getElementById("co-install-toggle").checked;
        const bankVal = document.querySelector('input[name="co-bank"]:checked').value;
        const bankName = bankVal === "tbc" ? "TBC Bank" : bankVal === "bog" ? "Bank of Georgia" : t("co-pay-cash");

        // Analytics is optional — never let a missing/blocked script break checkout
        const track = (fn, ...args) => { if (typeof window[fn] === "function") window[fn](...args); };

        // Mock card processing (no real gateway on a static site); cash orders just get recorded
        const payBtn = document.getElementById("co-pay-btn");
        payBtn.disabled = true;
        payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t("co-processing")}`;

        setTimeout(() => {
            const refNum = "ORD-" + Math.floor(100000 + Math.random() * 900000);
            track("trackPurchase", p, refNum);

            // Persist to the database — this is now the ONLY copy of the order.
            // user_id ties it to the account, which is what lets the shopper see
            // it on the account page from any device (RLS: orders_select_own).
            saveOrderToDb({
                user_id: isGuest ? null : state.user.id,
                user_email: isGuest ? guestEmail : state.user.email,
                customer_name: `${firstName} ${lastName}`,
                phone: phone,
                address: address,
                personal_id: idNumber || null,
                product_id: typeof p.id === "string" ? p.id : null, // demo products have no DB id
                product_title: p.title.ka,
                amount: p.price,
                needs_install: withInstall,
                order_type: "standard",
                payment_method: bankVal,
                payment_status: "pending",
                status: "new"
            });
            state.ordersLoaded = false; // account page refetches on next visit

            document.getElementById("success-title").innerText = t("co-success-title");
            document.getElementById("success-message").innerText =
                t("co-success-msg") + (withInstall ? " " + t("co-success-install") : "");
            document.getElementById("success-details").innerHTML = `
                <div class="detail-line"><span>№</span><span>${refNum}</span></div>
                <div class="detail-line"><span>${p.title[state.currentLang]}</span><span>${p.price.toLocaleString()} ₾</span></div>
                <div class="detail-line"><span>${t("co-payment-header")}</span><span>${bankName}</span></div>
                ${withInstall ? `<div class="detail-line"><span>${t("co-install-line")}</span><span>${t("co-install-onsite")}</span></div>` : ''}
            `;
            document.getElementById("success-modal").classList.add("open");

            state.afterAuthHash = null;
            state.guestCheckout = false;
            location.hash = "catalog"; // home behind the success modal
        }, 1200);
    });
}

// ==========================================================================
// Google Sign-In (real GIS when a client ID is configured; mock fallback otherwise)
// ==========================================================================
// To enable REAL Google sign-in:
//   1. console.cloud.google.com → APIs & Services → Credentials → Create OAuth client ID (Web application)
//   2. Add your origins (e.g. http://localhost:8000 and the production domain) under "Authorized JavaScript origins"
//   3. Paste the client ID below. Until then the demo "Google" flow is used.
const GOOGLE_CLIENT_ID = "727149305420-4e6s8klpuu61np7c3hrgqk0hp8jl4u6c.apps.googleusercontent.com"; // e.g. "1234567890-abc123.apps.googleusercontent.com"

let googleInitDone = false;

function realGoogleAvailable() {
    return !!GOOGLE_CLIENT_ID && !!(window.google && google.accounts && google.accounts.id);
}

// Google One Tap credentials are passed to Supabase, which verifies the token
// server-side and issues its own session — the ID token alone is not trusted.
async function handleGoogleCredential(response) {
    if (!sbClient) { showAuthError("auth-err-offline"); return; }
    const { data, error } = await sbClient.auth.signInWithIdToken({
        provider: "google",
        token: response.credential
    });
    if (error) { showAuthError(authErrorKey(error), error.message); return; }
    await applySession(data.session);
    finishAuth();
}

// Renders Google's own button when a client ID is configured; the plain
// button below it falls back to the redirect flow.
function setupGoogleButton() {
    if (!realGoogleAvailable()) return;
    const container = document.getElementById("google-btn-container");
    if (!googleInitDone) {
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
        googleInitDone = true;
    }
    container.innerHTML = "";
    google.accounts.id.renderButton(container, { theme: "outline", size: "large", width: 320, text: "continue_with" });
    container.classList.remove("hidden");
    document.getElementById("google-signin-btn").classList.add("hidden");
}

// ==========================================================================
// Account Page (hash route: #account, login required)
// ==========================================================================
let accountActiveTab = "orders";

// Shapes the cached profile row + session into the object the tabs render from
function getCurrentAccount() {
    const p = state.profile || {};
    return {
        email: state.user.email,
        provider: state.user.provider,
        profile: {
            firstName: p.first_name || "",
            lastName: p.last_name || "",
            phone: p.phone || "",
            address: p.address || "",
            idNumber: p.personal_id || ""
        },
        cards: Array.isArray(p.cards) ? p.cards : [],
        orders: state.orders || []
    };
}

function renderAccountPage(tab) {
    if (tab) accountActiveTab = tab;
    const container = document.getElementById("account-content");
    if (!container) return;

    // Orders live in the database now; fetch once, then re-render in place
    if (accountActiveTab === "orders" && !state.ordersLoaded) {
        state.ordersLoaded = true;
        loadMyOrders().then(() => {
            if (document.body.classList.contains("account-view")) renderAccountPage();
        });
    }

    const acc = getCurrentAccount();

    const TABS = [
        { key: "orders", icon: "fa-box", label: t("acc-nav-orders") },
        { key: "details", icon: "fa-address-card", label: t("acc-nav-details") },
        { key: "security", icon: "fa-shield-halved", label: t("acc-nav-security") }
    ];

    container.innerHTML = `
        <h1 class="checkout-title">${t("acc-title")}</h1>
        <p class="signed-in-line">${t("co-signed-as")} <strong>${acc.email}</strong></p>

        <div class="account-layout">
            <nav class="account-nav detail-panel">
                ${TABS.map(tb => `
                    <button class="account-nav-btn ${tb.key === accountActiveTab ? 'active' : ''}" data-tab="${tb.key}">
                        <i class="fa-solid ${tb.icon}"></i> <span>${tb.label}</span>
                    </button>`).join('')}
                <button class="account-nav-btn acc-logout" id="acc-logout-btn">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> <span>${t("co-logout")}</span>
                </button>
            </nav>
            <div class="account-panel detail-panel">
                ${buildAccountTab(acc, accountActiveTab)}
            </div>
        </div>
    `;

    document.title = `${t("acc-title")} | Climate Comfort`;

    container.querySelectorAll(".account-nav-btn[data-tab]").forEach(btn => {
        btn.addEventListener("click", () => renderAccountPage(btn.getAttribute("data-tab")));
    });

    document.getElementById("acc-logout-btn").addEventListener("click", () => {
        if (confirm(t("auth-logout-confirm"))) logout();
    });

    bindAccountTabEvents();
}

function buildAccountTab(acc, tab) {
    const lang = state.currentLang;

    if (tab === "orders") {
        const orders = acc.orders || [];
        if (!orders.length) {
            return `
                <h3>${t("acc-nav-orders")}</h3>
                <div class="acc-empty">
                    <i class="fa-solid fa-box-open"></i>
                    <p>${t("acc-orders-empty")}</p>
                    <a href="#catalog" class="btn btn-primary">${t("hero-cta-explore")}</a>
                </div>`;
        }
        const STATUS_KEY = {
            new: "acc-status-received", confirmed: "acc-status-confirmed",
            delivering: "acc-status-delivering", completed: "acc-status-completed",
            cancelled: "acc-status-cancelled"
        };
        return `<h3>${t("acc-nav-orders")}</h3>` + orders.map(o => {
            const dateStr = new Date(o.created_at).toLocaleDateString(lang === 'ka' ? 'ka-GE' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
            const bank = o.payment_method === "tbc" ? "TBC Bank" : (o.payment_method === "bog" ? "Bank of Georgia" : "");
            const installTag = o.needs_install ? ` · ${t("co-install-line").replace(':', '')} (${t("co-install-onsite")})` : '';
            return `
                <div class="order-item">
                    <div class="order-main">
                        <span class="order-ref">ORD-${o.order_no}</span>
                        <p class="order-title-line">${o.product_title}</p>
                        <span class="order-meta">${dateStr}${bank ? ' · ' + bank : ''}${installTag}</span>
                    </div>
                    <div class="order-side">
                        <strong>${Number(o.amount).toLocaleString()} ₾</strong>
                        <span class="order-status">${t(STATUS_KEY[o.status] || "acc-status-received")}</span>
                    </div>
                </div>`;
        }).join('');
    }

    if (tab === "details") {
        const pr = acc.profile || {};
        return `
            <h3>${t("acc-nav-details")}</h3>
            <form id="acc-details-form" novalidate>
                <div class="co-field-grid">
                    <div class="form-control-group">
                        <label class="input-label" for="acc-firstname">${t("co-firstname")}</label>
                        <input type="text" id="acc-firstname" class="form-input" value="${pr.firstName || ''}">
                    </div>
                    <div class="form-control-group">
                        <label class="input-label" for="acc-lastname">${t("co-lastname")}</label>
                        <input type="text" id="acc-lastname" class="form-input" value="${pr.lastName || ''}">
                    </div>
                    <div class="form-control-group">
                        <label class="input-label" for="acc-phone">${t("co-phone")}</label>
                        <input type="tel" id="acc-phone" class="form-input" placeholder="+995 5xx xx xx xx" value="${pr.phone || ''}">
                    </div>
                    <div class="form-control-group">
                        <label class="input-label" for="acc-idnum">${t("co-idnum")}</label>
                        <input type="text" id="acc-idnum" class="form-input" maxlength="11" inputmode="numeric" value="${pr.idNumber || ''}">
                    </div>
                    <div class="form-control-group co-field-full">
                        <label class="input-label" for="acc-address">${t("co-address")}</label>
                        <input type="text" id="acc-address" class="form-input" placeholder="${lang === 'ka' ? 'ქალაქი, ქუჩა, ბინა...' : 'City, street, apartment...'}" value="${pr.address || ''}">
                    </div>
                </div>
                <div class="acc-form-footer">
                    <button type="submit" class="btn btn-accent">${t("acc-save")}</button>
                    <span class="acc-saved-note hidden" id="acc-details-saved"><i class="fa-solid fa-check"></i> ${t("acc-saved")}</span>
                </div>
            </form>`;
    }

    // Security tab
    if (acc.provider === "google") {
        return `
            <h3>${t("acc-nav-security")}</h3>
            <div class="google-account-note">
                <span class="google-g">G</span>
                <p>${t("acc-google-note")}</p>
            </div>`;
    }
    return `
        <h3>${t("acc-nav-security")}</h3>
        <form id="acc-email-form" class="acc-subform" novalidate>
            <h4>${t("acc-change-email")}</h4>
            <div class="form-control-group">
                <label class="input-label" for="acc-email-input">${t("auth-email")}</label>
                <input type="email" id="acc-email-input" class="form-input" value="${acc.email}">
            </div>
            <div class="acc-form-footer">
                <button type="submit" class="btn btn-primary">${t("acc-save")}</button>
                <span class="acc-saved-note hidden" id="acc-email-saved"><i class="fa-solid fa-check"></i> ${t("acc-saved")}</span>
            </div>
        </form>
        <form id="acc-pass-form" class="acc-subform" novalidate>
            <h4>${t("acc-change-password")}</h4>
            <div class="co-field-grid">
                <div class="form-control-group">
                    <label class="input-label" for="acc-pass-current">${t("acc-current-password")}</label>
                    <input type="password" id="acc-pass-current" class="form-input" autocomplete="current-password">
                </div>
                <div class="form-control-group">
                    <label class="input-label" for="acc-pass-new">${t("acc-new-password")}</label>
                    <input type="password" id="acc-pass-new" class="form-input" autocomplete="new-password">
                </div>
            </div>
            <div class="acc-form-footer">
                <button type="submit" class="btn btn-primary">${t("acc-change-password")}</button>
                <span class="acc-saved-note hidden" id="acc-pass-saved"><i class="fa-solid fa-check"></i> ${t("acc-pass-changed")}</span>
            </div>
        </form>`;
}

function flashSaved(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 2500);
}

function bindAccountTabEvents() {
    // Personal details
    const detailsForm = document.getElementById("acc-details-form");
    if (detailsForm) {
        detailsForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idNumber = document.getElementById("acc-idnum").value.trim();
            if (idNumber && !/^\d{11}$/.test(idNumber)) { alert(t("co-err-id")); return; }
            const { error } = await saveProfile({
                first_name:  document.getElementById("acc-firstname").value.trim(),
                last_name:   document.getElementById("acc-lastname").value.trim(),
                phone:       document.getElementById("acc-phone").value.trim(),
                address:     document.getElementById("acc-address").value.trim(),
                personal_id: idNumber
            });
            if (error) { alert(error.message); return; }
            flashSaved("acc-details-saved");
        });
    }

    // Change email — Supabase mails a confirmation link to the NEW address and
    // only switches it once that link is clicked.
    const emailForm = document.getElementById("acc-email-form");
    if (emailForm) {
        emailForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newEmail = document.getElementById("acc-email-input").value.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { alert(t("auth-err-email")); return; }
            if (newEmail === state.user.email) { flashSaved("acc-email-saved"); return; }
            const { error } = await sbClient.auth.updateUser({ email: newEmail });
            if (error) { alert(error.message); return; }
            alert(t("acc-email-confirm"));
        });
    }

    // Change password. Supabase's updateUser does not ask for the current one,
    // so it is verified explicitly first — otherwise anyone who walked up to an
    // unlocked, signed-in browser could silently take the account over.
    const passForm = document.getElementById("acc-pass-form");
    if (passForm) {
        passForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const current = document.getElementById("acc-pass-current").value;
            const next = document.getElementById("acc-pass-new").value;
            if (next.length < 6) { alert(t("auth-err-password")); return; }

            const { error: checkErr } = await sbClient.auth.signInWithPassword({
                email: state.user.email, password: current
            });
            if (checkErr) { alert(t("acc-err-current")); return; }

            const { error } = await sbClient.auth.updateUser({ password: next });
            if (error) { alert(error.message); return; }
            passForm.reset();
            flashSaved("acc-pass-saved");
        });
    }
}

// ==========================================================================
// Homepage Rails (featured carousels) + Brand Strip
// ==========================================================================
let bestSellerOrder = null; // random once per visit; replace with real sales data later

function railCard(p) {
    const title = p.title[state.currentLang];
    const onSale = p.oldPrice && p.oldPrice > p.price;
    return `
        <a class="rail-card" href="#product/${p.id}">
            <div class="rail-card-img">
                ${buildProductMockup(p)}
                ${onSale ? `<span class="rail-sale">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}
            </div>
            <span class="product-brand">${p.brand}</span>
            <p class="rail-card-title">${title}</p>
            <div class="rail-card-price">
                ${onSale ? `<span class="rail-old-price">${p.oldPrice.toLocaleString()} ₾</span>` : ""}
                <strong>${p.price.toLocaleString()} ₾</strong>
            </div>
        </a>
    `;
}

function renderHomeRails() {
    if (!document.getElementById("home-rails")) return;

    // Stable random order for "best sellers" until real sales data exists
    if (!bestSellerOrder || bestSellerOrder.length !== products.length) {
        bestSellerOrder = [...products].sort(() => Math.random() - 0.5).map(p => p.id);
    }

    const onSale = products.filter(p => p.oldPrice && p.oldPrice > p.price);
    const rails = [
        { key: "rail-midea", items: products.filter(p => p.brand.toUpperCase() === "MIDEA") },
        { key: "rail-best", items: bestSellerOrder.map(id => findProduct(id)).filter(Boolean) },
        { key: "rail-deals", items: [...onSale].sort((a, b) =>
            (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice) },
        { key: "rail-budget", items: [...products].filter(p => p.price > 0).sort((a, b) => a.price - b.price) },
    ];

    rails.forEach(rail => {
        const wrap = document.getElementById(`${rail.key}-wrap`);
        const track = document.getElementById(rail.key);
        if (!wrap || !track) return;
        const items = rail.items.slice(0, 12);
        wrap.classList.toggle("hidden", items.length < 4); // a rail with 2 cards looks broken
        track.innerHTML = items.map(railCard).join("");
    });

    renderBrandStrip();
}

function renderBrandStrip() {
    const wrap = document.getElementById("brand-strip-wrap");
    const strip = document.getElementById("brand-strip");
    if (!wrap || !strip) return;

    const brands = [...new Set(products.map(p => p.brand))].sort();
    wrap.classList.toggle("hidden", brands.length < 2);
    strip.innerHTML = brands.map(b => `
        <button class="brand-tile" data-brand="${b}" aria-label="${b}">
            <span class="brand-tile-name">${b}</span>
        </button>
    `).join("");
}

// ==========================================================================
// Catalog Rendering and Filtering Logic
// ==========================================================================
const CATALOG_PAGE_SIZE = 12; // divides evenly into 2/3/4-column grids
let lastCatalogContext = ""; // filters+sort signature; a change resets paging

function renderCatalogPagination(totalPages) {
    const nav = document.getElementById("catalog-pagination");
    if (!nav) return;
    if (totalPages <= 1) { nav.innerHTML = ""; return; }

    const cur = state.catalogPage;
    // Always show first, last and the current page's neighbours; collapse the rest
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - cur) <= 1) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "…") {
            pages.push("…");
        }
    }

    nav.innerHTML = `
        <button class="page-btn page-arrow" data-page="${cur - 1}" ${cur === 1 ? "disabled" : ""} aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>
        ${pages.map(pg => pg === "…"
            ? `<span class="page-ellipsis">…</span>`
            : `<button class="page-btn ${pg === cur ? "active" : ""}" data-page="${pg}">${pg}</button>`).join("")}
        <button class="page-btn page-arrow" data-page="${cur + 1}" ${cur === totalPages ? "disabled" : ""} aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>
    `;
}

function renderCatalog() {
    const grid = document.getElementById("products-grid");
    const emptyState = document.getElementById("empty-catalog-message");
    
    // Filter the items
    const filteredProducts = products.filter(p => {
        // Category Filter
        if (state.filters.category && state.filters.category !== 'all') {
            if (p.category !== state.filters.category) return false;
        }

        // Search Query
        if (state.filters.search) {
            const query = state.filters.search.toLowerCase();
            const matchesSearch = p.title[state.currentLang].toLowerCase().includes(query) || 
                                  p.brand.toLowerCase().includes(query) || 
                                  p.description[state.currentLang].toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Price range
        if (p.price < state.filters.minPrice || p.price > state.filters.maxPrice) return false;

        // Brands
        if (state.filters.brands.length > 0 && !state.filters.brands.includes(p.brand)) return false;

        // Area
        if (state.filters.areas.length > 0 && !state.filters.areas.includes(p.area)) return false;

        // BTU
        if (state.filters.btus.length > 0 && !state.filters.btus.includes(p.btu)) return false;

        // Inverter / Condensing
        if (state.filters.inverter.length > 0) {
            const hasInverter = p.inverter ? "yes" : "no";
            if (!state.filters.inverter.includes(hasInverter)) return false;
        }

        // Energy class
        if (state.filters.energyClass.length > 0 && !state.filters.energyClass.includes(p.energyClass)) return false;

        // Colors
        if (state.filters.colors.length > 0 && !state.filters.colors.includes(p.color)) return false;

        return true;
    });

    // Sort the items
    filteredProducts.sort((a, b) => {
        if (state.sortBy === "price-asc") return a.price - b.price;
        if (state.sortBy === "price-desc") return b.price - a.price;
        if (state.sortBy === "btu-desc") return parseInt(b.btu) - parseInt(a.btu);
        return b.popularity - a.popularity;
    });

    // Pagination: changing filters/sort resets to page 1; language switch keeps it
    const catalogContext = JSON.stringify(state.filters) + "|" + state.sortBy;
    if (catalogContext !== lastCatalogContext) {
        lastCatalogContext = catalogContext;
        state.catalogPage = 1;
    }
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / CATALOG_PAGE_SIZE));
    if (state.catalogPage > totalPages) state.catalogPage = totalPages;
    if (state.catalogPage < 1) state.catalogPage = 1;
    const pageStart = (state.catalogPage - 1) * CATALOG_PAGE_SIZE;
    const pageProducts = filteredProducts.slice(pageStart, pageStart + CATALOG_PAGE_SIZE);
    renderCatalogPagination(totalPages);

    // Toggle Empty State
    if (filteredProducts.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");

        // Build cards
        grid.innerHTML = pageProducts.map(p => {
            const inCart = state.cart.find(item => item.id === p.id);
            const cartBtnClass = inCart ? "btn-icon-only added-to-cart" : "btn-icon-only";
            const cartBtnIcon = inCart ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-cart-shopping"></i>';
            const cartBtnTitle = inCart ? t("Added to Cart") : t("card-add-cart");

            // Localized texts
            const localizedTitle = p.title[state.currentLang];
            const colorLabel = t(p.color);
            const areaLabel = p.area.replace("m²", t("sqm"));
            
            // Inverter / Condensing Label
            const techLabel = getTechLabel(p);

            // Boiler vs AC mockup graphic rendering
            const mockupHTML = buildProductMockup(p);

            return `
                <article class="product-card" data-id="${p.id}">
                    <div class="card-image-area">
                        <div class="card-badges">
                            ${p.energyClass ? `<span class="badge badge-accent">${p.energyClass}</span>` : ""}
                            ${p.inverter ? `<span class="badge badge-inverter">${techLabel}</span>` : ""}
                            ${stockBadge(p)}
                        </div>

                        ${mockupHTML}
                    </div>

                    <div class="card-body">
                        <span class="product-brand">${p.brand}</span>
                        <h3 class="product-title" title="${localizedTitle}">${localizedTitle}</h3>

                        <div class="product-specs-summary">
                            ${p.btu ? `<div class="spec-line">
                                <i class="fa-solid fa-cube"></i>
                                <span>${p.category === 'boiler' ? (state.currentLang === 'ka' ? 'სიმძლავრე' : 'Power') : 'BTU'}: <strong>${p.btu}</strong></span>
                            </div>` : ""}
                            ${p.area ? `<div class="spec-line"><i class="fa-solid fa-maximize"></i> <span>${t("filter-area").split(" ")[0]}: <strong>${areaLabel}</strong></span></div>` : ""}
                            ${p.color ? `<div class="spec-line"><i class="fa-solid fa-palette"></i> <span>${t("filter-color")}: <strong>${colorLabel}</strong></span></div>` : ""}
                            ${p.category !== 'boiler' ? `<div class="spec-line spec-line-wide">
                                <i class="fa-solid fa-snowflake"></i>
                                <span>${t("filter-inverter")}: <strong>${p.inverter ? (state.currentLang === 'ka' ? 'ინვერტორი' : 'Inverter') : 'ON/OFF'}</strong></span>
                            </div>` : ""}
                        </div>
                        
                        <div class="card-footer">
                            <div class="price-container">
                                <div class="price-tag">${p.oldPrice && p.oldPrice > p.price ? `<span class="old-price">${p.oldPrice.toLocaleString()} ₾</span>` : ""}${p.price.toLocaleString()}</div>
                            </div>
                            
                            <div class="card-actions">
                                <button class="btn btn-accent btn-sm buy-now-btn" data-id="${p.id}">
                                    ${t("card-buy")}
                                </button>
                                <button class="${cartBtnClass} add-cart-btn" data-id="${p.id}" title="${cartBtnTitle}">
                                    ${cartBtnIcon}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    // Update product counts ("13–24 / 87" when paged, plain total otherwise)
    const countLabel = filteredProducts.length > CATALOG_PAGE_SIZE
        ? `${pageStart + 1}–${pageStart + pageProducts.length} / ${filteredProducts.length}`
        : `${filteredProducts.length}`;
    document.getElementById("results-count-text").innerText = countLabel;
    document.getElementById("results-count-mobile").innerText = `${filteredProducts.length} ${t("catalog-unit")}`;
    
    // Render Active Badge List
    renderFilterBadges();
}

// Render active filter badges
function renderFilterBadges() {
    const badgeContainer = document.getElementById("active-filters-badges");
    const wrapper = document.getElementById("badges-wrapper");
    
    let activeFiltersCount = 0;
    wrapper.innerHTML = "";

    // Search Badge
    if (state.filters.search) {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(`${t("filters-title")}: "${state.filters.search}"`, 'search'));
    }

    // Price Badge
    if (state.filters.minPrice > 500 || state.filters.maxPrice < 4000) {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(`${t("filter-price").split(" ")[0]}: ${state.filters.minPrice}₾ - ${state.filters.maxPrice}₾`, 'price'));
    }

    // Brands
    state.filters.brands.forEach(b => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(b, 'brand', b));
    });

    // Areas
    state.filters.areas.forEach(a => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(`${t("filter-area").split(" ")[0]}: ${a.replace("m²", t("sqm"))}`, 'area', a));
    });

    // BTUs
    state.filters.btus.forEach(btu => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(btu, 'btu', btu));
    });

    // Inverter
    state.filters.inverter.forEach(inv => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(inv === 'yes' ? t("filter-inverter-yes").split(" ")[0] : t("filter-inverter-no").split(" ")[0], 'inverter', inv));
    });

    // Energy Class
    state.filters.energyClass.forEach(ec => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(`${t("filter-energy")}: ${ec}`, 'energy', ec));
    });

    // Color
    state.filters.colors.forEach(col => {
        activeFiltersCount++;
        wrapper.appendChild(createBadge(t(col), 'color', col));
    });

    if (activeFiltersCount > 0) {
        badgeContainer.classList.remove("hidden");
    } else {
        badgeContainer.classList.add("hidden");
    }
}

// Helper to create badge element
function createBadge(text, type, value = "") {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.innerHTML = `${text} <i class="fa-solid fa-xmark" data-type="${type}" data-val="${value}"></i>`;
    return badge;
}

// Remove filter on badge click
function removeFilterBadge(type, val) {
    if (type === 'search') {
        state.filters.search = "";
        document.getElementById("search-bar").value = "";
        document.getElementById("search-clear-btn").classList.add("hidden");
    } else if (type === 'price') {
        state.filters.minPrice = 500;
        state.filters.maxPrice = 4000;
        document.getElementById("price-min-input").value = 500;
        document.getElementById("price-max-input").value = 4000;
        document.getElementById("price-range-slider").value = 4000;
    } else {
        let selector = "";
        if (type === 'brand') selector = `input[name="brand"][value="${val}"]`;
        if (type === 'area') selector = `input[name="area"][value="${val}"]`;
        if (type === 'btu') selector = `input[name="btu"][value="${val}"]`;
        if (type === 'inverter') selector = `input[name="inverter"][value="${val}"]`;
        if (type === 'energy') selector = `input[name="energy"][value="${val}"]`;
        if (type === 'color') selector = `input[name="color"][value="${val}"]`;

        if (selector) {
            const el = document.querySelector(selector);
            if (el) el.checked = false;
        }
        
        if (type === 'brand') state.filters.brands = state.filters.brands.filter(b => b !== val);
        if (type === 'area') state.filters.areas = state.filters.areas.filter(a => a !== val);
        if (type === 'btu') state.filters.btus = state.filters.btus.filter(b => b !== val);
        if (type === 'inverter') state.filters.inverter = state.filters.inverter.filter(i => i !== val);
        if (type === 'energy') state.filters.energyClass = state.filters.energyClass.filter(e => e !== val);
        if (type === 'color') state.filters.colors = state.filters.colors.filter(c => c !== val);
    }
    
    renderCatalog();
}

// Switch Category selection in Catalog
function switchCategory(category) {
    state.filters.category = category;
    
    // Update active class on category tabs in UI
    document.querySelectorAll(".category-tab").forEach(tab => {
        if (tab.getAttribute("data-category") === category) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    // Reset other filters that might be invalid when switching categories (e.g. BTUs vs kWs)
    state.filters.btus = [];
    state.filters.brands = [];
    state.filters.areas = [];
    state.filters.inverter = [];
    state.filters.energyClass = [];
    state.filters.colors = [];

    // Reset checkmarks in UI
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(chk => chk.checked = false);

    // Regenerate filters sidebar options to reflect new counts/keys of this category
    generateFiltersUI();

    // Re-render catalog grid
    renderCatalog();

    // If we're on a product detail page, jump back to the (now filtered) catalog
    if (document.body.classList.contains("product-view")) {
        location.hash = "catalog";
    } else {
        // Otherwise (e.g. picked from the homepage nav dropdown) scroll the
        // now-filtered catalog into view — filtering alone leaves the page
        // exactly where it was, which looks like the click did nothing.
        document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }
}

// Reset all filters
function resetAllFilters() {
    state.filters = {
        category: "all",
        search: "",
        minPrice: 500,
        maxPrice: 4000,
        brands: [],
        areas: [],
        btus: [],
        inverter: [],
        energyClass: [],
        colors: []
    };

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(chk => chk.checked = false);
    
    document.getElementById("search-bar").value = "";
    document.getElementById("search-clear-btn").classList.add("hidden");
    document.getElementById("price-min-input").value = 500;
    document.getElementById("price-max-input").value = 4000;
    document.getElementById("price-range-slider").value = 4000;

    // Reset active category tab class
    document.querySelectorAll(".category-tab").forEach(tab => {
        if (tab.getAttribute("data-category") === "all") {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    generateFiltersUI();
    renderCatalog();
}

// Collect filters
function updateFiltersFromDOM() {
    const brandChecks = document.querySelectorAll('input[name="brand"]:checked');
    state.filters.brands = Array.from(brandChecks).map(chk => chk.value);

    const areaChecks = document.querySelectorAll('input[name="area"]:checked');
    state.filters.areas = Array.from(areaChecks).map(chk => chk.value);

    const btuChecks = document.querySelectorAll('input[name="btu"]:checked');
    state.filters.btus = Array.from(btuChecks).map(chk => chk.value);

    const inverterChecks = document.querySelectorAll('input[name="inverter"]:checked');
    state.filters.inverter = Array.from(inverterChecks).map(chk => chk.value);

    const energyChecks = document.querySelectorAll('input[name="energy"]:checked');
    state.filters.energyClass = Array.from(energyChecks).map(chk => chk.value);

    const colorChecks = document.querySelectorAll('input[name="color"]:checked');
    state.filters.colors = Array.from(colorChecks).map(chk => chk.value);

    renderCatalog();
}

function openPaymentMethodModal(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    state.activeFinancedProduct = product;
    
    // Open payment method selector modal
    document.getElementById("payment-method-modal").classList.add("open");
}

// ==========================================================================
// Installment Payment / Financing Calculator Engine
// ==========================================================================
function openFinancingModal(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    state.activeFinancedProduct = product;

    // Set preview details
    document.getElementById("modal-product-brand").innerText = product.brand;
    document.getElementById("modal-product-title").innerText = product.title[state.currentLang];
    document.getElementById("modal-product-price").innerText = `${product.price.toLocaleString()} ₾`;
    
    // Reset Down Payment
    document.getElementById("down-payment-input").value = 0;
    document.getElementById("down-payment-input").max = product.price - 100;

    // Default select BOG
    document.querySelector('input[name="bank-select"][value="bog"]').checked = true;
    document.querySelectorAll('.bank-radio-card').forEach(card => card.classList.remove("selected"));
    document.getElementById("bank-card-bog").classList.add("selected");
    
    // Term resets
    const slider = document.getElementById("term-months-slider");
    slider.value = 12;

    updateCalculatorValues();

    document.getElementById("calculator-modal").classList.add("open");
}

function updateCalculatorValues() {
    if (!state.activeFinancedProduct) return;
    
    const productPrice = state.activeFinancedProduct.price;
    const selectedBankVal = document.querySelector('input[name="bank-select"]:checked').value;
    const bank = banksConfig[selectedBankVal];
    const slider = document.getElementById("term-months-slider");
    
    let downPayment = parseFloat(document.getElementById("down-payment-input").value) || 0;
    if (downPayment >= productPrice) {
        downPayment = productPrice - 100;
        document.getElementById("down-payment-input").value = downPayment;
    }
    if (downPayment < 0) {
        downPayment = 0;
        document.getElementById("down-payment-input").value = 0;
    }

    const principal = productPrice - downPayment;
    const term = parseInt(slider.value);

    // Update term text label
    const termLabelText = t("calc-modal-term").replace("{0}", term);
    document.getElementById("term-label-text").innerText = termLabelText;

    // Render term milestones/marks under the slider
    const markers = document.getElementById("term-range-markers");
    markers.innerHTML = `
        <span>${bank.minTerm} ${t("month-unit")}</span>
        <span>12 ${t("month-unit")}</span>
        <span>24 ${t("month-unit")}</span>
        <span>${bank.maxTerm} ${t("month-unit")}</span>
    `;

    // Calculate Interest Rate
    let monthlyRatePercent = 0;
    if (term > bank.promoMonths) {
        monthlyRatePercent = bank.standardRate;
    }

    // Compute monthly payment via Annuity
    let monthlyPayment = 0;
    if (monthlyRatePercent === 0) {
        monthlyPayment = principal / term;
    } else {
        const r = monthlyRatePercent / 100;
        monthlyPayment = principal * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    }

    const totalPaid = (monthlyPayment * term) + downPayment;
    const totalInterest = (monthlyPayment * term) - principal;

    // Display updates
    document.getElementById("monthly-payment-amount").innerText = monthlyPayment.toFixed(2);
    document.getElementById("financed-amount-text").innerText = `${principal.toLocaleString()} ₾`;
    document.getElementById("down-payment-paid-text").innerText = `${downPayment.toLocaleString()} ₾`;
    document.getElementById("interest-rate-text").innerText = `${monthlyRatePercent}%`;
    document.getElementById("total-interest-text").innerText = `${Math.max(0, totalInterest).toFixed(2)} ₾`;
    document.getElementById("total-paid-text").innerText = `${totalPaid.toFixed(2)} ₾`;
}

function applyDownPaymentPercentage(pct) {
    if (!state.activeFinancedProduct) return;
    const price = state.activeFinancedProduct.price;
    const dpVal = Math.round(price * (pct / 100));
    document.getElementById("down-payment-input").value = dpVal;
    updateCalculatorValues();
}

// ==========================================================================
// Shopping Cart Logic
// ==========================================================================
function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const inCartItem = state.cart.find(item => String(item.id) === String(productId));
    if (inCartItem) {
        inCartItem.quantity++;
    } else {
        state.cart.push({
            id: productId,
            quantity: 1,
            productDetails: product
        });
    }

    updateCartUI();
    
    const cartBtn = document.querySelector(`.add-cart-btn[data-id="${productId}"]`);
    if (cartBtn) {
        cartBtn.className = "btn-icon-only added-to-cart animate-pulse";
        cartBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            cartBtn.classList.remove("animate-pulse");
        }, 1000);
    }
}

function updateCartUI() {
    const badge = document.getElementById("cart-badge-count");
    const itemsContainer = document.getElementById("cart-items-container");
    const emptyElement = document.getElementById("cart-empty-element");
    const footerElement = document.getElementById("cart-footer-element");
    const subtotalText = document.getElementById("cart-total-price-text");

    let totalQuantity = 0;
    let totalPrice = 0;

    state.cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.productDetails.price * item.quantity;
    });

    badge.innerText = totalQuantity;
    if (totalQuantity > 0) {
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }

    if (state.cart.length === 0) {
        itemsContainer.innerHTML = "";
        itemsContainer.classList.add("hidden");
        footerElement.classList.add("hidden");
        emptyElement.classList.remove("hidden");
    } else {
        emptyElement.classList.add("hidden");
        itemsContainer.classList.remove("hidden");
        footerElement.classList.remove("hidden");

        itemsContainer.innerHTML = state.cart.map(item => {
            const p = item.productDetails;
            return `
                <div class="cart-item">
                    <div class="cart-item-preview">
                        ${p.image ? `<img class="product-photo" src="${p.image}" alt="">` : '<i class="fa-regular fa-image"></i>'}
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${p.title[state.currentLang]}</h4>
                        <div class="cart-item-specs">${[p.btu, p.energyClass].filter(Boolean).join(" | ")}</div>
                        <div class="cart-item-price">${(p.price * item.quantity).toLocaleString()}</div>
                    </div>
                    
                    <div class="cart-item-controls">
                        <div class="qty-counter">
                            <button class="qty-btn qty-minus-btn" data-id="${p.id}"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn qty-plus-btn" data-id="${p.id}"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <button class="remove-item-btn" data-id="${p.id}">${state.currentLang === 'ka' ? 'წაშლა' : 'Remove'}</button>
                    </div>
                </div>
            `;
        }).join('');

        subtotalText.innerText = `${totalPrice.toLocaleString()} ₾`;
    }
}

function adjustCartQuantity(productId, delta) {
    const item = state.cart.find(i => String(i.id) === String(productId));
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== productId);
    }
    updateCartUI();
    renderCatalog();
}

function removeCartItem(productId) {
    state.cart = state.cart.filter(i => String(i.id) !== String(productId));
    updateCartUI();
    renderCatalog();
}

// ==========================================================================
// Service Installation Booking Calculator
// ==========================================================================
function updateServiceEstimator() {
    const serviceSelect = document.getElementById("service-type");
    const btuSelect = document.getElementById("booking-btu");
    
    const bracketsCheck = document.getElementById("extra-brackets");
    const pipeCheck = document.getElementById("extra-pipe");
    const dismantleCheck = document.getElementById("extra-dismantle");

    if (!serviceSelect || !btuSelect) return;

    const serviceVal = serviceSelect.value;
    const btuVal = btuSelect.value;

    let baseCost = 150;
    let serviceLabelKey = "srv-standard-install";
    
    if (serviceVal === 'dismantling') {
        baseCost = 50;
        serviceLabelKey = "srv-dismantle";
    } else if (serviceVal === 'refill') {
        baseCost = 80;
        serviceLabelKey = "srv-refill";
    } else if (serviceVal === 'maintenance') {
        baseCost = 70;
        serviceLabelKey = "srv-maintenance";
    }

    let btuAdjustment = 0;
    if (btuVal === '18000-24000') {
        btuAdjustment = 50;
    } else if (btuVal === '30000') {
        btuAdjustment = 100;
    }

    let bracketCost = bracketsCheck.checked ? 30 : 0;
    let pipeCost = pipeCheck.checked ? 45 : 0;
    let dismantleCost = dismantleCheck.checked ? 50 : 0;

    // Update estimator output
    document.getElementById("calc-service-name").innerText = t(serviceLabelKey);
    document.getElementById("calc-service-base-cost").innerText = `${baseCost} ₾`;
    document.getElementById("calc-btu-range").innerText = btuVal + " BTU";
    document.getElementById("calc-btu-adjustment").innerText = `+${btuAdjustment} ₾`;

    toggleBreakdownRow("breakdown-bracket-row", bracketsCheck.checked);
    toggleBreakdownRow("breakdown-pipe-row", pipeCheck.checked);
    toggleBreakdownRow("breakdown-dismantle-row", dismantleCheck.checked);

    const totalServiceCost = baseCost + btuAdjustment + bracketCost + pipeCost + dismantleCost;
    document.getElementById("calc-total-cost").innerText = `${totalServiceCost} ₾`;
}

function toggleBreakdownRow(id, isVisible) {
    const el = document.getElementById(id);
    if (isVisible) el.classList.remove("hidden");
    else el.classList.add("hidden");
}

// ==========================================================================
// Event Binding and Modal Controls
// ==========================================================================
function bindUIEventListeners() {
    
    // 1. Language Toggle Event Bindings
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const newLang = btn.getAttribute("data-lang");
            if (newLang !== state.currentLang) {
                state.currentLang = newLang;
                localStorage.setItem("lang", newLang);
                
                // Re-apply translation
                applyLanguage();
                generateFiltersUI();
                renderCatalog();
                renderHomeRails();
                updateCartUI();
                updateServiceEstimator();

                // Re-render the current sub-page (product / checkout / account) in the new language
                if (SUBPAGE_CLASSES.some(c => document.body.classList.contains(c))) {
                    handleRouting();
                }
            }
        });
    });

    // 2. Search Bar
    const searchBar = document.getElementById("search-bar");
    const clearBtn = document.getElementById("search-clear-btn");
    
    searchBar.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        state.filters.search = val;
        
        if (val) {
            clearBtn.classList.remove("hidden");
        } else {
            clearBtn.classList.add("hidden");
        }
        renderCatalog();
    });

    clearBtn.addEventListener("click", () => {
        searchBar.value = "";
        clearBtn.classList.add("hidden");
        state.filters.search = "";
        renderCatalog();
    });

    // 3. Sorting
    document.getElementById("sort-select").addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderCatalog();
    });

    // 4. Filters checkbox changes
    document.getElementById("filter-sidebar").addEventListener("change", (e) => {
        if (e.target.type === 'checkbox') {
            updateFiltersFromDOM();
        }
    });

    // 5. Price sliders
    const minInput = document.getElementById("price-min-input");
    const maxInput = document.getElementById("price-max-input");
    const rangeSlider = document.getElementById("price-range-slider");

    minInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value) || 500;
        if (val < 500) val = 500;
        if (val > state.filters.maxPrice) val = state.filters.maxPrice;
        state.filters.minPrice = val;
        minInput.value = val;
        renderCatalog();
    });

    maxInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value) || 4000;
        if (val > 4000) val = 4000;
        if (val < state.filters.minPrice) val = state.filters.minPrice;
        state.filters.maxPrice = val;
        maxInput.value = val;
        rangeSlider.value = val;
        renderCatalog();
    });

    rangeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.filters.maxPrice = val;
        maxInput.value = val;
        renderCatalog();
    });

    // Clear filters triggers
    document.getElementById("clear-all-filters").addEventListener("click", resetAllFilters);
    document.getElementById("reset-all-filters-btn").addEventListener("click", resetAllFilters);
    document.getElementById("clear-badges-link").addEventListener("click", resetAllFilters);

    // Active filters badge click removal
    document.getElementById("badges-wrapper").addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-xmark")) {
            const type = e.target.getAttribute("data-type");
            const val = e.target.getAttribute("data-val");
            removeFilterBadge(type, val);
        }
    });

    // Homepage rails: arrow buttons scroll the track; brand tiles filter the catalog
    const homeRails = document.getElementById("home-rails");
    if (homeRails) {
        homeRails.addEventListener("click", (e) => {
            const railBtn = e.target.closest(".rail-btn");
            if (railBtn) {
                const track = document.getElementById(railBtn.getAttribute("data-target"));
                if (track) {
                    track.scrollBy({ left: parseInt(railBtn.getAttribute("data-dir")) * track.clientWidth * 0.8, behavior: "smooth" });
                }
                return;
            }

            const tile = e.target.closest(".brand-tile");
            if (tile) {
                state.filters.brands = [tile.getAttribute("data-brand")];
                generateFiltersUI();
                renderCatalog();
                const catalogTop = document.querySelector(".category-tabs-container");
                if (catalogTop) {
                    window.scrollTo({ top: catalogTop.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
                }
            }
        });
    }

    // Catalog pagination (delegated; buttons are re-rendered on every filter change)
    document.getElementById("catalog-pagination").addEventListener("click", (e) => {
        const btn = e.target.closest(".page-btn");
        if (!btn || btn.disabled) return;
        const page = parseInt(btn.getAttribute("data-page"));
        if (!Number.isFinite(page) || page === state.catalogPage) return;
        state.catalogPage = page;
        renderCatalog();
        // Back to the top of the product list (offset clears the sticky header)
        const controlBar = document.querySelector(".catalog-control-bar");
        if (controlBar) {
            window.scrollTo({ top: controlBar.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
        }
    });

    // Mobile Sidebar Toggles
    const mobileTrigger = document.getElementById("mobile-filter-trigger");
    const sidebar = document.getElementById("filter-sidebar");
    const sidebarClose = document.getElementById("mobile-filter-close");
    const mobileApply = document.getElementById("mobile-apply-filters");

    mobileTrigger.addEventListener("click", () => {
        sidebar.classList.add("open");
    });
    
    sidebarClose.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    mobileApply.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Shopping Cart Drawer Open/Close
    const cartHeaderBtn = document.getElementById("cart-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartClose = document.getElementById("cart-drawer-close");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartShopNow = document.getElementById("cart-shop-now-btn");

    const openCart = () => {
        cartDrawer.classList.add("open");
        cartOverlay.classList.add("open");
    };

    const closeCart = () => {
        cartDrawer.classList.remove("open");
        cartOverlay.classList.remove("open");
    };

    cartHeaderBtn.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);
    cartShopNow.addEventListener("click", () => {
        closeCart();
        window.location.hash = "catalog";
    });

    // Category tab click listeners
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.getAttribute('data-category');
            switchCategory(cat);
        });
    });

    // Dropdown menu item click listeners
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = item.getAttribute('data-category');
            switchCategory(cat);
        });
    });

    // Footer category link click listeners (same filter-by-category behavior)
    document.querySelectorAll('.footer-cat-link').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = item.getAttribute('data-category');
            switchCategory(cat);
        });
    });

    // Catalog grid clicks (event delegation)
    document.getElementById("products-grid").addEventListener("click", (e) => {
        const addBtn = e.target.closest(".add-cart-btn");
        if (addBtn) {
            const id = addBtn.getAttribute("data-id");
            addToCart(id);
            return;
        }

        const buyBtn = e.target.closest(".buy-now-btn");
        if (buyBtn) {
            const id = buyBtn.getAttribute("data-id");
            startPurchase(id);
            return;
        }

        // Anywhere else on the card → open the product detail page
        const card = e.target.closest(".product-card");
        if (card) {
            location.hash = `product/${card.getAttribute("data-id")}`;
        }
    });

    // Cart controls
    document.getElementById("cart-items-container").addEventListener("click", (e) => {
        if (e.target.closest(".qty-plus-btn")) {
            const id = e.target.closest(".qty-plus-btn").getAttribute("data-id");
            adjustCartQuantity(id, 1);
        }
        if (e.target.closest(".qty-minus-btn")) {
            const id = e.target.closest(".qty-minus-btn").getAttribute("data-id");
            adjustCartQuantity(id, -1);
        }
        if (e.target.closest(".remove-item-btn")) {
            const id = e.target.closest(".remove-item-btn").getAttribute("data-id");
            removeCartItem(id);
        }
    });

    // Auth Modal Listeners
    document.getElementById("close-auth-modal").addEventListener("click", () => {
        document.getElementById("auth-modal").classList.remove("open");
        state.afterAuthHash = null;
    });

    document.getElementById("auth-form").addEventListener("submit", (e) => {
        e.preventDefault();
        handleAuthSubmit();
    });

    document.getElementById("auth-switch-link").addEventListener("click", (e) => {
        e.preventDefault();
        setAuthMode(authMode === "login" ? "register" : "login");
    });

    // Real Google OAuth — leaves the page and returns with a session
    document.getElementById("google-signin-btn").addEventListener("click", handleGoogleSignIn);

    document.getElementById("auth-forgot-link").addEventListener("click", (e) => {
        e.preventDefault();
        handlePasswordReset();
    });

    // Continue without registering (guest checkout)
    document.getElementById("guest-continue-btn").addEventListener("click", () => {
        state.guestCheckout = true;
        finishAuth();
    });

    // Header account chip → account page
    document.getElementById("account-btn").addEventListener("click", () => {
        location.hash = "account";
    });

    // Payment Method Selection Modal Listeners
    document.getElementById("close-pay-method-modal").addEventListener("click", () => {
        document.getElementById("payment-method-modal").classList.remove("open");
        state.activeFinancedProduct = null;
    });

    document.getElementById("pay-card-option").addEventListener("click", () => {
        // Close selection modal
        document.getElementById("payment-method-modal").classList.remove("open");
        
        // Open checkout modal in Standard Card mode
        state.checkoutMode = "standard";
        document.getElementById("checkout-modal-title").innerText = state.currentLang === 'ka' ? "სტანდარტული შეკვეთა" : "Complete Standard Order";
        document.getElementById("financing-fields-group").style.display = "none";
        document.getElementById("check-idnum").removeAttribute("required");
        document.getElementById("checkout-modal").classList.add("open");
    });

    document.getElementById("pay-finance-option").addEventListener("click", () => {
        // Close selection modal
        document.getElementById("payment-method-modal").classList.remove("open");
        
        // Open full financing modal
        if (state.activeFinancedProduct) {
            openFinancingModal(state.activeFinancedProduct.id);
        }
    });

    // Financing Calculator Modal Listeners
    document.getElementById("close-calc-modal").addEventListener("click", () => {
        document.getElementById("calculator-modal").classList.remove("open");
        state.activeFinancedProduct = null;
    });

    // Bank Selection Radio Cards Select
    document.querySelectorAll('.bank-radio-card').forEach(card => {
        card.addEventListener("click", (e) => {
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            document.querySelectorAll('.bank-radio-card').forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            
            const bank = banksConfig[radio.value];
            const termSlider = document.getElementById("term-months-slider");
            termSlider.min = bank.minTerm;
            termSlider.max = bank.maxTerm;
            termSlider.value = Math.min(bank.maxTerm, Math.max(bank.minTerm, parseInt(termSlider.value)));
            
            updateCalculatorValues();
        });
    });

    // Down payment values
    document.getElementById("down-payment-input").addEventListener("input", updateCalculatorValues);
    
    document.querySelectorAll(".dp-suggest-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const pct = parseInt(btn.getAttribute("data-pct"));
            applyDownPaymentPercentage(pct);
        });
    });

    document.getElementById("term-months-slider").addEventListener("input", updateCalculatorValues);

    // Apply Credit Button click
    document.getElementById("apply-financing-btn").addEventListener("click", () => {
        document.getElementById("calculator-modal").classList.remove("open");
        
        state.checkoutMode = "financing";
        
        // Localize checkout headers
        document.getElementById("checkout-modal-title").innerText = state.currentLang === 'ka' ? "განვადების განაცხადი" : "Financing Credit Application";
        document.getElementById("financing-fields-group").style.display = "block";
        document.getElementById("check-idnum").setAttribute("required", "true");
        document.getElementById("checkout-modal").classList.add("open");
    });

    // Cart Checkout Buttons
    document.getElementById("cart-standard-checkout").addEventListener("click", () => {
        closeCart();
        state.checkoutMode = "standard";
        document.getElementById("checkout-modal-title").innerText = state.currentLang === 'ka' ? "სტანდარტული შეკვეთა" : "Complete Standard Order";
        document.getElementById("financing-fields-group").style.display = "none";
        document.getElementById("check-idnum").removeAttribute("required");
        document.getElementById("checkout-modal").classList.add("open");
    });

    document.getElementById("cart-finance-checkout").addEventListener("click", () => {
        closeCart();
        if (state.cart.length > 0) {
            openFinancingModal(state.cart[0].id);
        }
    });

    document.getElementById("close-checkout-modal").addEventListener("click", () => {
        document.getElementById("checkout-modal").classList.remove("open");
    });

    // Checkout form submit
    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("check-name").value;
        const phone = document.getElementById("check-phone").value;
        const address = document.getElementById("check-address").value;
        
        document.getElementById("checkout-modal").classList.remove("open");

        const successTitle = document.getElementById("success-title");
        const successMsg = document.getElementById("success-message");
        const successDetails = document.getElementById("success-details");
        const refNum = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        if (state.checkoutMode === "financing") {
            const bankRadio = document.querySelector('input[name="bank-select"]:checked');
            const bankName = bankRadio ? banksConfig[bankRadio.value].name : "Bank of Georgia";
            const p = state.activeFinancedProduct || state.cart[0].productDetails;
            const monthlyPaymentText = document.getElementById("monthly-payment-amount").innerText;

            // Persist the financing application for the admin page
            saveOrderToDb({
                user_email: state.user ? state.user.email : "",
                customer_name: name,
                phone: phone,
                address: address,
                personal_id: document.getElementById("check-idnum").value.trim() || null,
                product_id: typeof p.id === "string" ? p.id : null,
                product_title: p.title.ka,
                amount: p.price,
                needs_install: false,
                order_type: "financing",
                payment_method: bankRadio ? bankRadio.value : null,
                payment_status: "pending",
                status: "new"
            });

            if (state.currentLang === 'ka') {
                successTitle.innerText = "განვადება წინასწარ დამტკიცებულია!";
                successMsg.innerText = "გილოცავთ! თქვენი ონლაინ განვადების განაცხადი წინასწარ დამტკიცებულია. ბანკის ოპერატორი მალე დაგიკავშირდებათ ხელშეკრულების გასაფორმებლად.";
                successDetails.innerHTML = `
                    <div class="detail-line"><span>განაცხადის კოდი:</span><span>${refNum}</span></div>
                    <div class="detail-line"><span>პროდუქტი:</span><span>${p.title.ka}</span></div>
                    <div class="detail-line"><span>ბანკი:</span><span>${bankName}</span></div>
                    <div class="detail-line"><span>ყოველთვიური:</span><span>${monthlyPaymentText} ₾ / თვ</span></div>
                    <div class="detail-line"><span>მყიდველი:</span><span>${name}</span></div>
                `;
            } else {
                successTitle.innerText = "Financing Pre-Approved!";
                successMsg.innerText = "Congratulations! Your credit application has been pre-approved. Our bank partner agent will call you to finalize signature.";
                successDetails.innerHTML = `
                    <div class="detail-line"><span>Application Ref:</span><span>${refNum}</span></div>
                    <div class="detail-line"><span>Financed Product:</span><span>${p.title.en}</span></div>
                    <div class="detail-line"><span>Financing Bank:</span><span>${bankName}</span></div>
                    <div class="detail-line"><span>Estimated Monthly:</span><span>${monthlyPaymentText} ₾ / mo</span></div>
                    <div class="detail-line"><span>Applicant Name:</span><span>${name}</span></div>
                `;
            }
        } else {
            // Standard order
            let orderSummary = "";
            let grandTotal = 0;

            // Persist one database order per cart line for the admin page
            state.cart.forEach(item => {
                const cp = item.productDetails;
                saveOrderToDb({
                    user_email: state.user ? state.user.email : "",
                    customer_name: name,
                    phone: phone,
                    address: address,
                    personal_id: document.getElementById("check-idnum").value.trim() || null,
                    product_id: typeof cp.id === "string" ? cp.id : null,
                    product_title: cp.title.ka + (item.quantity > 1 ? ` ×${item.quantity}` : ""),
                    amount: cp.price * item.quantity,
                    needs_install: false,
                    order_type: "standard",
                    payment_method: null,
                    payment_status: "pending",
                    status: "new"
                });
            });

            if (state.cart.length === 1) {
                orderSummary = state.cart[0].productDetails.title[state.currentLang];
                grandTotal = state.cart[0].productDetails.price * state.cart[0].quantity;
            } else {
                orderSummary = `${state.cart[0].productDetails.title[state.currentLang]} (+${state.cart.length - 1} ${state.currentLang === 'ka' ? 'სხვა' : 'other'})`;
                state.cart.forEach(item => {
                    grandTotal += item.productDetails.price * item.quantity;
                });
            }

            if (state.currentLang === 'ka') {
                successTitle.innerText = "შეკვეთა მიღებულია!";
                successMsg.innerText = "მადლობას გიხდით შესყიდვისთვის! თქვენი შეკვეთა წარმატებით გაფორმდა. კურიერი დაგიკავშირდებათ დღესვე.";
                successDetails.innerHTML = `
                    <div class="detail-line"><span>შეკვეთის კოდი:</span><span>${refNum}</span></div>
                    <div class="detail-line"><span>პროდუქცია:</span><span>${orderSummary}</span></div>
                    <div class="detail-line"><span>ჯამური ფასი:</span><span>${grandTotal.toLocaleString()} ₾</span></div>
                    <div class="detail-line"><span>მისამართი:</span><span>${address}</span></div>
                    <div class="detail-line"><span>ტელეფონი:</span><span>${phone}</span></div>
                `;
            } else {
                successTitle.innerText = "Order Placed Successfully!";
                successMsg.innerText = "Thank you for shopping! We have received your order. Delivery team will contact you today.";
                successDetails.innerHTML = `
                    <div class="detail-line"><span>Order Number:</span><span>${refNum}</span></div>
                    <div class="detail-line"><span>Products:</span><span>${orderSummary}</span></div>
                    <div class="detail-line"><span>Total Paid:</span><span>${grandTotal.toLocaleString()} ₾</span></div>
                    <div class="detail-line"><span>Delivery Address:</span><span>${address}</span></div>
                    <div class="detail-line"><span>Contact Phone:</span><span>${phone}</span></div>
                `;
            }
        }

        // Clear State
        state.cart = [];
        updateCartUI();
        renderCatalog();
        document.getElementById("checkout-form").reset();

        document.getElementById("success-modal").classList.add("open");
    });

    // Service booking form interactions
    const serviceBookingForm = document.getElementById("service-booking-form");
    
    // Form updates
    document.getElementById("service-type").addEventListener("change", updateServiceEstimator);
    document.getElementById("booking-btu").addEventListener("change", updateServiceEstimator);
    document.getElementById("extra-brackets").addEventListener("change", updateServiceEstimator);
    document.getElementById("extra-pipe").addEventListener("change", updateServiceEstimator);
    document.getElementById("extra-dismantle").addEventListener("change", updateServiceEstimator);

    serviceBookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const serviceTypeSelect = document.getElementById("service-type");
        const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
        
        const btuVal = document.getElementById("booking-btu").value;
        const dateVal = document.getElementById("booking-date").value;
        
        const timeSelect = document.getElementById("booking-time");
        const timeSlot = timeSelect.options[timeSelect.selectedIndex].text;
        
        const nameVal = document.getElementById("cust-name").value;
        const phoneVal = document.getElementById("cust-phone").value;
        const addressVal = document.getElementById("cust-address").value;
        const totalEstimatedCost = document.getElementById("calc-total-cost").innerText;

        const refNum = "SRV-" + Math.floor(100000 + Math.random() * 900000);

        // Persist for the admin page (Bookings tab)
        saveBookingToDb({
            service_type: serviceTypeSelect.value,
            service_label: serviceName,
            btu_range: btuVal,
            extras: {
                brackets: document.getElementById("extra-brackets").checked,
                pipe: document.getElementById("extra-pipe").checked,
                dismantle: document.getElementById("extra-dismantle").checked
            },
            preferred_date: dateVal || null,
            time_slot: timeSelect.value || null,
            customer_name: nameVal,
            phone: phoneVal,
            address: addressVal,
            notes: document.getElementById("cust-notes").value.trim() || null,
            estimated_cost: parseFloat(totalEstimatedCost.replace(/[^\d.]/g, "")) || null
        });

        const successTitle = document.getElementById("success-title");
        const successMsg = document.getElementById("success-message");
        const successDetails = document.getElementById("success-details");

        if (state.currentLang === 'ka') {
            successTitle.innerText = "სერვისი დაჯავშნილია!";
            successMsg.innerText = "თქვენი მოთხოვნა მონტაჟზე წარმატებით დარეგისტრირდა. ჩვენი მენეჯერი დაგიკავშირდებათ დეტალების დასაზუსტებლად.";
            successDetails.innerHTML = `
                <div class="detail-line"><span>დაჯავშნის კოდი:</span><span>${refNum}</span></div>
                <div class="detail-line"><span>სერვისი:</span><span>${serviceName} (${btuVal} BTU)</span></div>
                <div class="detail-line"><span>თარიღი:</span><span>${dateVal}</span></div>
                <div class="detail-line"><span>დრო:</span><span>${timeSlot}</span></div>
                <div class="detail-line"><span>ფასი:</span><span>${totalEstimatedCost}</span></div>
                <div class="detail-line"><span>მისამართი:</span><span>${addressVal}</span></div>
            `;
        } else {
            successTitle.innerText = "Service Booking Confirmed!";
            successMsg.innerText = "Your air conditioner service request has been booked. A dispatcher will call you to confirm technician arrival details.";
            successDetails.innerHTML = `
                <div class="detail-line"><span>Booking Reference:</span><span>${refNum}</span></div>
                <div class="detail-line"><span>Selected Service:</span><span>${serviceName} (${btuVal} BTU)</span></div>
                <div class="detail-line"><span>Scheduled Date:</span><span>${dateVal}</span></div>
                <div class="detail-line"><span>Arrival Window:</span><span>${timeSlot}</span></div>
                <div class="detail-line"><span>Estimated Price:</span><span>${totalEstimatedCost}</span></div>
                <div class="detail-line"><span>Installation Site:</span><span>${addressVal}</span></div>
            `;
        }

        // Reset
        serviceBookingForm.reset();
        updateServiceEstimator();

        document.getElementById("success-modal").classList.add("open");
    });

    // Success close
    document.getElementById("success-close-btn").addEventListener("click", () => {
        document.getElementById("success-modal").classList.remove("open");
    });
}
