import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'getting-started/quick-start',
    },
    // {
    //   type: 'doc',
    //   id: 'intro',
    // },
    {
      type: 'category',
      label: '安装部署',
      items: [
        'deployment/docker',
        'deployment/binary',
        'deployment/k8s',
      ],
    },
    {
      type: 'category',
      label: '配置说明',
      items: [
        'configuration/apiserver',
        'configuration/mcp-gateway',
        'configuration/gateways',
        'configuration/tenant-management',
        'configuration/version-control',
        'configuration/templates',
      ],
    },
    {
      type: 'category',
      label: '客户端使用',
      items: [
        'client-usage/cursor',
        'client-usage/cherry-studio',
      ],
    },
    {
      type: 'category',
      label: '开发文档',
      items: [
        'development/architecture',
        'development/local-development',
      ],
    },
  ],
};

export default sidebars;
