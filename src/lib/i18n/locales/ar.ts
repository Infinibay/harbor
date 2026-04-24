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

    "harbor.wizard.stepOfN":
      "الخطوة {current, plural, other {#}} من {total, plural, other {#}}",
    "harbor.wizard.defaultError": "الحقول المطلوبة مفقودة",

    "harbor.commandPalette.placeholder": "اكتب أمراً…",
    "harbor.commandPalette.escKey": "ESC",
    "harbor.commandPalette.title": "لوحة الأوامر",
    "harbor.commandPalette.noResults": "لا توجد أوامر مطابقة",

    "harbor.select.placeholder": "اختر…",

    "harbor.search.placeholder": "بحث…",

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
