import colors from 'vuetify/es5/util/colors'
import { resolve } from 'path'
const env = process.env.NODE_ENV;
const envFile = `.env.${env}`;

require('dotenv').config({ path: resolve(__dirname, envFile) });

export default {
  publicRuntimeConfig: {
    TITLE: process.env.TITLE,
    NAVIGATOR_COLOR: process.env.NAVIGATOR_COLOR
  },
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Планировщик',
    title: 'Планировщик',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/' + process.env.FAVICON }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vuetify/dist/vuetify.min.css',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/helpers.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/auth-next',
    '@nuxtjs/axios'
  ],

  auth: {
    strategies: {
      cookie: {
        cookie: {
          name: 'XSRF-TOKEN',
          options: {
            maxAge: 60 * 60 * 2, // 2 часа
            secure: true, // Включите, если используете HTTPS
          }
        }
      },
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: process.env.API_BASE_URL,
        endpoints: {
          login: {
            url: '/api/login',
            method: 'post'
          },
          logout: {
            url: '/api/logout',
            method: 'post'
          },
          user: {
            url: '/api/user',
            method: 'get'
          },
        },
      },
    },
    redirect: {
      login: "/login",
      logout: "/",
      home: "/personal/tasks"
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_BASE_URL,
    credentials: true,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#37474f',
          accent: colors.grey.darken3,
          secondary: "#4b555e",
          info: "#2196f3",
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green,
        }
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
