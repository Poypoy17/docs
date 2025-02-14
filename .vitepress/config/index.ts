import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import MarkdownItFootnote from 'markdown-it-footnote'
import { createWriteStream } from 'node:fs'
import path, { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'
import { genFeed } from './genFeed'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, HeadConfig } from 'vitepress'
import { colorPreviewPlugin } from '../theme/markdown/colorPreview'
import { cardPlugin } from '../theme/markdown/card'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { figure } from '@mdit/plugin-figure'
import { imgSize, obsidianImageSize } from '@mdit/plugin-img-size'
import { mark } from '@mdit/plugin-mark'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'

import { enConfig } from './en'
import { zhConfig } from './zh'
import { jaConfig } from './ja'
import { krConfig } from './kr'
import { frConfig } from './fr'

export const links: any[] = []
export const isProd = process.env.NODE_ENV === 'production'
export const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'
export const productionHead: HeadConfig[] = [
  [
    'script',
    {
      id: 'clarity-script',
    },
    `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "gx0jeyqvg5")`,
  ],
  [
    'script',
    {
      id: 'application-json',
      type: 'application/ld+json',
    },
    `
    {"@context":"https://schema.org","@type":"WebPage","name":Kongying Tavern Genshin Interactive Map"}`,
  ],
]

export default defineConfig({
  lastUpdated: true,
  srcDir: 'src',
  srcExclude: [],
  scrollOffset: 'header',
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                },
              },
            },
          },
          kr: {
            translations: {
              button: {
                buttonText: '찾다',
                buttonAriaLabel: '찾다',
              },
              modal: {
                noResultsText: '관련 결과가 없습니다',
                resetButtonTitle: '검색 재설정',
                footer: {
                  selectText: '선택하다',
                  navigateText: '전환하다',
                },
              },
            },
          },
          fr: {
            translations: {
              button: {
                buttonText: 'Recherche',
                buttonAriaLabel: 'Recherche',
              },
              modal: {
                noResultsText: 'Aucun résultat pour',
                resetButtonTitle: 'Réinitialiser la recherche',
                footer: {
                  selectText: 'pour sélectionner',
                  navigateText: 'naviguer',
                },
              },
            },
          },
          ja: {
            translations: {
              button: {
                buttonText: '検索',
                buttonAriaLabel: '検索',
              },
              modal: {
                noResultsText: '結果はありません',
                resetButtonTitle: '検索をリセットする',
                footer: {
                  selectText: '選ぶ',
                  navigateText: '切り替える',
                },
              },
            },
          },
        },
      },
    },
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      ...zhConfig,
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      ...enConfig,
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/',
      ...jaConfig,
    },
    kr: {
      label: '한국인',
      lang: 'kr',
      link: '/kr/',
      ...krConfig,
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      ...frConfig,
    },
  },
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover',
      },
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'lack-translucent',
      },
    ],
    [
      'meta',
      {
        name: 'applicable-device',
        content: 'pc,mobile',
      },
    ],
    [
      'meta',
      {
        name: 'google',
        content: 'notranslate',
      },
    ],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
    [
      'link',
      {
        rel: 'icon',
        href: `https://yuanshen.site/docs/imgs/favicon-32x32.png`,
        type: 'image/png',
      },
    ],
    [
      'link',
      {
        hreflang: 'zh-cn',
        href: 'https://yuanshen.site/docs',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        href: `https://yuanshen.site/docs/feed.rss`,
        type: 'application/rss',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        href: `https://yuanshen.site/docs/imgs/favicon.ico`,
        type: 'image/x-icon',
      },
    ],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['meta', { name: 'author', content: 'Arrebol' }],
    ['meta', { name: 'article:author', content: 'Arrebol' }],
    ['meta', { property: 'og:site', content: 'website' }],
    ['meta', { property: 'og:locale:alternate', content: 'zh-CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@KongyingTavern' }],
    [
      'script',
      { id: 'spotlightEffectLinks' },
      'function spotlightEffectLinks() {document.querySelector("body").addEventListener("mousemove", (e) => {e.currentTarget.style.setProperty("--x", `${e.clientX}px`);e.currentTarget.style.setProperty("--y", `${e.clientY}px`);});function setLinksPositions() {document.querySelectorAll("a").forEach((a) => {const bounding = a.getBoundingClientRect();a.style.setProperty("--positionX", `${bounding.x}px`);a.style.setProperty("--positionY", `${bounding.y}px`);});}window.addEventListener("load", setLinksPositions);window.addEventListener("resize", setLinksPositions)} spotlightEffectLinks() ',
    ],
    ...(isProd ? productionHead : []),
  ],
  ignoreDeadLinks: [
    // ignore exact url "/playground"
    '/playground',
    // ignore all localhost links
    /^https?:\/\/localhost/,
    // ignore all links include "/repl/""
    /\/repl\//,
    // custom function, ignore all links include "ignore"
    (url) => {
      return url.toLowerCase().includes('ignore')
    },
  ],
  vite: {
    server: {
      host: true,
      fs: {
        allow: ['../..'],
      },
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/Footer.vue', import.meta.url)
          ),
        },
        {
          find: /^.*\/VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/SwitchAppearance.vue', import.meta.url)
          ),
        },
      ],
    },
    plugins: [
      // https://github.com/antfu/unocss
      Unocss(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', '@vueuse/core'],
        dts: './auto-imports.d.ts',
        vueTemplate: true,
      }),

      Inspect(),
    ],
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity,
    },
    json: {
      stringify: true,
    },
  },
  markdown: {
    config(md) {
      md.use(MarkdownItFootnote)
      md.use(colorPreviewPlugin)
      md.use(cardPlugin)
      md.use(sub)
      md.use(sup)
      md.use(mark)
      md.use(imgLazyload)
      md.use(imgSize)
      md.use(obsidianImageSize)
      md.use(figure)
    },
  },
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        // you might need to change this if not using clean urls mode
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated,
      })
  },
  buildEnd: (config) => {
    const sitemap = new SitemapStream({
      hostname: 'https://yuanshen.site/docs/',
    })
    const writeStream = createWriteStream(resolve(config.outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
    genFeed(config)
  },
})
