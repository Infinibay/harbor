import type { HarborLocale } from "../types";

/** Arabic (ar). RTL. Shipped as an example so consumers have at least
 *  one RTL locale to pressure-test their layouts with. Translations are
 *  baseline — real products should have a translator review them. */
export const ar: HarborLocale = {
  code: "ar",
  label: "العربية",
  direction: "rtl",
  messages: {
    "harbor.field.optional": "(اختياري)",
    "harbor.field.requiredMark": "*",
    "harbor.action.close": "إغلاق",
    "harbor.action.cancel": "إلغاء",
    "harbor.action.save": "حفظ",
    "harbor.action.back": "رجوع",
    "harbor.action.next": "التالي",
    "harbor.action.finish": "إنهاء",
    "harbor.action.clear": "مسح",
    "harbor.action.submit": "إرسال",
    "harbor.action.retry": "إعادة المحاولة",

    "harbor.wizard.stepOfN":
      "الخطوة {current, plural, other {#}} من {total, plural, other {#}}",
    "harbor.wizard.defaultError": "الحقول المطلوبة مفقودة",

    "harbor.commandPalette.placeholder": "اكتب أمراً…",
    "harbor.commandPalette.escKey": "ESC",
    "harbor.commandPalette.title": "لوحة الأوامر",
    "harbor.commandPalette.noResults": "لا توجد أوامر مطابقة",

    "harbor.select.placeholder": "اختر…",

    "harbor.search.placeholder": "بحث…",

    "harbor.datatable.empty": "لا توجد بيانات",
    "harbor.datatable.selectAll": "تحديد كل الصفوف في هذه الصفحة",
    "harbor.datatable.selectRow": "تحديد الصف",
    "harbor.datatable.rowsPerPage": "صفوف لكل صفحة",
    "harbor.datatable.showingRange":
      "عرض {start}–{end} من {total, plural, other {# صف}}",
    "harbor.datatable.firstPage": "الصفحة الأولى",
    "harbor.datatable.prevPage": "الصفحة السابقة",
    "harbor.datatable.nextPage": "الصفحة التالية",
    "harbor.datatable.lastPage": "الصفحة الأخيرة",
    "harbor.datatable.menu.open": "قائمة العمود",
    "harbor.datatable.menu.sortAsc": "فرز تصاعدي",
    "harbor.datatable.menu.sortDesc": "فرز تنازلي",
    "harbor.datatable.menu.clearSort": "إلغاء الفرز",
    "harbor.datatable.menu.pinStart": "تثبيت في البداية",
    "harbor.datatable.menu.pinEnd": "تثبيت في النهاية",
    "harbor.datatable.menu.unpin": "إلغاء التثبيت",
    "harbor.datatable.menu.hide": "إخفاء العمود",
    "harbor.datatable.menu.moveLeft": "نقل لليسار",
    "harbor.datatable.menu.moveRight": "نقل لليمين",
    "harbor.datatable.columns.title": "أعمدة",
    "harbor.datatable.columns.showAll": "إظهار الكل",
    "harbor.datatable.columns.hideAll": "إخفاء الكل",
    "harbor.datatable.density.label": "الكثافة",
    "harbor.datatable.density.compact": "مضغوط",
    "harbor.datatable.density.comfortable": "مريح",
    "harbor.datatable.density.spacious": "واسع",
    "harbor.datatable.export.title": "تصدير",
    "harbor.datatable.export.csv": "تصدير كـ CSV",
    "harbor.datatable.export.tsv": "تصدير كـ TSV",
    "harbor.datatable.export.json": "تصدير كـ JSON",
    "harbor.datatable.rowActions": "إجراءات الصف",

    "harbor.validation.required": "هذا الحقل مطلوب",
    "harbor.validation.email": "أدخل بريداً إلكترونياً صالحاً",
    "harbor.validation.min": "يجب أن يكون على الأقل {min}",
    "harbor.validation.max": "يجب أن يكون على الأكثر {max}",
    "harbor.validation.minLength":
      "{min, plural, other {الحد الأدنى # حرفاً}}",
    "harbor.validation.maxLength":
      "{max, plural, other {الحد الأقصى # حرفاً}}",
  },
};
