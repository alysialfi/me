---
title: DomaiNesia User Dashboard
url: https://my.domainesia.com/
period: 2022-present
role: Full Stack Developer (team)
stack: [Figma, Bitbucket, PHP, Smarty, jQuery, Bootstrap, WHMCS]
---
## Description

The user dashboard (MyDomaiNesia) is where customers manage their products, domains, invoices and support tickets after purchase. As part of the dev team, I redesigned the overview page and built the promotional surfaces inside it, so customers see what they own at a glance and marketing can reach them where they already are.

## Impacts

- Redesigned the overview with summary cards for products, domains, invoices and tickets
- Built a promo banner carousel with a live countdown and one-click promo code copy
- Added query-param driven states, so pages and campaigns can open the dashboard in a specific state
- Made banners easy to show or hide per campaign without touching templates

## Challenge

The dashboard runs on WHMCS, so every change had to fit inside its Smarty theme system and hook points. Customizations had to survive WHMCS upgrades without patching core files, which meant keeping logic in hooks and template overrides and testing each change against the default client-area behaviour.

## Lessons Learned

Working inside a platform you don't own rewards restraint. Small, well-placed hooks and overrides last longer than deep modifications, and a dashboard customers return to daily needs to stay predictable while still giving marketing room to move.

## Screenshots

![Overview](/projects/domainesia-user-dashboard/01-overview.webp)
