import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

const createConfig = async function (): Promise<Config> {
  const locale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'zh';

  const title = {
    zh: 'MCP网关',
    en: 'MCP Gateway',
    fr: 'Passerelle MCP',
    de: 'MCP-Gateway',
    ja: 'MCPゲートウェイ',
    ko: 'MCP 게이트웨이',
    es: 'Puerta de Enlace MCP',
    hi: 'एमसीपी गेटवे'
  }[locale] ?? 'MCP网关';

  const tagline = {
    zh: '无需Coding，通过配置轻松将API转成MCP Server',
    en: 'Turn APIs into MCP endpoints, without changing a line of code',
    fr: 'Transformez vos APIs en points de terminaison MCP, sans modifier une seule ligne de code',
    de: 'Wandeln Sie APIs in MCP-Endpunkte um, ohne eine Zeile Code zu ändern',
    ja: 'コードを一行も変更せずに、APIをMCPエンドポイントに変換',
    ko: '코드 한 줄 수정 없이 API를 MCP 엔드포인트로 변환',
    es: 'Convierte APIs en puntos de conexión MCP, sin cambiar una sola línea de código',
    hi: 'कोड की एक पंक्ति बदले बिना, API को MCP एंडपॉइंट में बदलें'
  }[locale] ?? '无需Coding，通过配置轻松将API转成MCP Server';

  return {
    title,
    tagline,
    favicon: 'img/favicon.ico',

    url: 'https://mcp.ifuryst.com',
    baseUrl: '/',

    organizationName: 'amoylab',
    projectName: 'unla',

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
      defaultLocale: 'zh',
      locales: ['zh', 'en', 'fr', 'de', 'ja', 'ko', 'es', 'hi'],
      localeConfigs: {
        zh: { label: '中文', htmlLang: 'zh-CN', direction: 'ltr' },
        en: { label: 'English', htmlLang: 'en-US', direction: 'ltr' },
        fr: { label: 'Français', htmlLang: 'fr-FR', direction: 'ltr' },
        de: { label: 'Deutsch', htmlLang: 'de-DE', direction: 'ltr' },
        ja: { label: '日本語', htmlLang: 'ja-JP', direction: 'ltr' },
        ko: { label: '한국어', htmlLang: 'ko-KR', direction: 'ltr' },
        es: { label: 'Español', htmlLang: 'es-ES', direction: 'ltr' },
        hi: { label: 'हिन्दी', htmlLang: 'hi-IN', direction: 'ltr' },
      },
    },

    presets: [
      [
        'classic',
        {
          docs: {
            path: 'docs',
            routeBasePath: '/',
            sidebarPath: require.resolve('./sidebars.ts'),
            editUrl: 'https://github.com/amoylab/docs/edit/main/',
          },
          blog: {
            showReadingTime: true,
            feedOptions: {
              type: ['rss', 'atom'],
              xslt: true,
            },
            editUrl: 'https://github.com/amoylab/docs/edit/main/blog/',
          },
          theme: {
            customCss: './src/css/custom.css',
          },
        } satisfies Preset.Options,
      ],
    ],

    themeConfig: {
      image: 'img/social-card.png',
      navbar: {
        title: {
          zh: 'MCP网关',
          en: 'MCP Gateway',
          fr: 'Passerelle MCP',
          de: 'MCP-Gateway',
          ja: 'MCPゲートウェイ',
          ko: 'MCP 게이트웨이',
          es: 'Puerta de Enlace MCP',
          hi: 'एमसीपी गेटवे'
        }[locale] ?? 'MCP网关',
        logo: {
          alt: 'MCP Gateway Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: {
              zh: '文档',
              en: 'Docs',
              fr: 'Docs',
              de: 'Dokumentation',
              ja: 'ドキュメント',
              ko: '문서',
              es: 'Documentos',
              hi: 'दस्तावेज़'
            }[locale] ?? '文档'
          },
          {
            to: '/blog',
            position: 'left',
            label: {
              zh: '博客',
              en: 'Blog',
              fr: 'Blog',
              de: 'Blog',
              ja: 'ブログ',
              ko: '블로그',
              es: 'Blog',
              hi: 'ब्लॉग'
            }[locale] ?? '博客'
          },
          { type: 'localeDropdown', position: 'right' },
          {
            href: 'https://github.com/amoylab/unla',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: {
              zh: '文档',
              en: 'Docs',
              fr: 'Docs',
              de: 'Dokumentation',
              ja: 'ドキュメント',
              ko: '문서',
              es: 'Documentos',
              hi: 'दस्तावेज़'
            }[locale] ?? '文档',
            items: [
              {
                label: {
                  zh: '快速开始',
                  en: 'Getting Started',
                  fr: 'Démarrage',
                  de: 'Erste Schritte',
                  ja: 'はじめに',
                  ko: '시작하기',
                  es: 'Comenzar',
                  hi: 'शुरू करें'
                }[locale] ?? '快速开始',
                to: '/getting-started/quick-start',
              },
            ],
          },
          {
            title: {
              zh: '社区',
              en: 'Community',
              fr: 'Communauté',
              de: 'Community',
              ja: 'コミュニティ',
              ko: '커뮤니티',
              es: 'Comunidad',
              hi: 'समुदाय'
            }[locale] ?? '社区',
            items: [
              {
                label: {
                  zh: '讨论区',
                  en: 'Discussions',
                  fr: 'Discussions',
                  de: 'Diskussionen',
                  ja: 'ディスカッション',
                  ko: '토론',
                  es: 'Discusiones',
                  hi: 'चर्चाएँ'
                }[locale] ?? '讨论区',
                href: 'https://github.com/amoylab/unla/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/udf69cT9TY',
              },
            ],
          },
          {
            title: {
              zh: '更多',
              en: 'More',
              fr: 'Plus',
              de: 'Mehr',
              ja: 'その他',
              ko: '더보기',
              es: 'Más',
              hi: 'अधिक'
            }[locale] ?? '更多',
            items: [
              {
                label: 'GitHub - MCP Gateway',
                href: 'https://github.com/amoylab/unla',
              },
              {
                label: 'GitHub - Docs',
                href: 'https://github.com/amoylab/docs',
              },
            ],
          },
        ],
        copyright: {
          zh: `版权所有 © ${new Date().getFullYear()} MCP Gateway。由 <a href="https://www.ifuryst.com/" target="_blank" rel="noopener noreferrer">Leo</a> 创建。`,
          en: `Copyright © ${new Date().getFullYear()} MCP Gateway. Created by Leo.`,
          fr: `Copyright © ${new Date().getFullYear()} MCP Gateway. Créé par Leo.`,
          de: `Copyright © ${new Date().getFullYear()} MCP Gateway. Erstellt von Leo.`,
          ja: `Copyright © ${new Date().getFullYear()} MCP Gateway。Leo によって作成されました。`,
          ko: `Copyright © ${new Date().getFullYear()} MCP Gateway. Leo가 만들었습니다.`,
          es: `Copyright © ${new Date().getFullYear()} MCP Gateway. Creado por Leo.`,
          hi: `कॉपीराइट © ${new Date().getFullYear()} MCP Gateway। Leo द्वारा बनाया गया।`
        }[locale] ?? `版权所有 © ${new Date().getFullYear()} MCP Gateway。由 <a href="https://www.ifuryst.com/" target="_blank" rel="noopener noreferrer">Leo</a> 创建。`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash'],
      },
    },
  };
};

export default createConfig;
