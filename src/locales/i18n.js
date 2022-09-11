import { createI18n } from "vue-i18n";
import en from "./en.json";
import tr from "./tr.json";
import ptBR from "./ptBR.json";
const i18n = createI18n({
  locale: "en",
  messages: {
    en,
    tr,
    ptBR,
  },
});

export default i18n;
