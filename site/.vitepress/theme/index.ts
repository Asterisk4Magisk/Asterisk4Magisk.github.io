import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HeroVisual from './components/HeroVisual.vue'
import HomeSections from './components/HomeSections.vue'
import LanguageRedirect from './components/LanguageRedirect.vue'
import LocalePreference from './components/LocalePreference.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h(HeroVisual),
    'layout-bottom': () => h(LocalePreference)
  }),
  enhanceApp({ app }) {
    app.component('HomeSections', HomeSections)
    app.component('LanguageRedirect', LanguageRedirect)
  }
}
