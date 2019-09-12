import '@quasar/extras/eva-icons/eva-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
import '@quasar/extras/ionicons-v4/ionicons-v4.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/mdi-v3/mdi-v3.css';
import '@quasar/extras/roboto-font/roboto-font.css';
import {
  QBtn,
  QDate,
  QExpansionItem,
  QHeader,
  QIcon,
  QInput,
  QLayout,
  QPage,
  QPageContainer,
  QPopupProxy,
  QTab,
  QTable,
  QTabs,
  QTd,
  QTr
} from 'quasar';
import './styles/quasar.styl';

export default {
    config: {},
    components: {
        QBtn,
        QDate,
        QExpansionItem,
        QHeader,
        QIcon,
        QInput,
        QLayout,
        QPageContainer,
        QPage,
        QPopupProxy,
        QTab,
        QTable,
        QTabs,
        QTd,
        QTr
    },
    directives: {},
    framework: {
        lang: 'fr'
    },
    plugins: {},
    lang: require('quasar/lang/fr.js')
};
