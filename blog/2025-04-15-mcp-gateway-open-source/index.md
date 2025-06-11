---
slug: mcp-gateway-open-source
title: MCP Gateway 正式开源啦！
authors: [ifuryst]
tags: [milestone]
---

MCP Gateway 正式开源啦！

随着MCP生态逐渐发展，越来越多项目和B端业务开始接入MCP。

在真正进入生产环境时，存量API服务的接入改造将成为一个不可避免的问题，这通常意味着大量的人力投入和系统投入。

因此，我认为MCP层面也需要一个类似于Nginx的“反向代理”工具，帮助个人和企业低成本地将现有API快速接入MCP生态，快速验证想法与市场，无需一开始就投入大量资源改动或重构。

<!-- truncate -->

基于这样的背景，我开源了MCPGateway，一个轻量级、平台中立、低负担的MCP网关，可以快速在本地、单机或者K8s上快速部署，通过配置可以快速将API服务转成MCP Servers

不确定未来市场规模会怎样，但我相信，构建这样一个填补空白、降低接入门槛的工具，是一件有意义的事。

欢迎大家试用，也非常期待你的反馈和建议！❤️

> 👉GitHub: https://github.com/amoylab/unla
