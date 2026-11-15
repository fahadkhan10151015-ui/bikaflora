<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="robots" content="noindex"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>BikaFlora Sitemap</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f7f6f3;color:#1f2a44}
    .wrap{max-width:1000px;margin:0 auto;padding:32px 20px 60px}
    header{background:linear-gradient(120deg,#1f2a44,#0f1a30);color:#fff;border-radius:22px;padding:28px 30px;margin-bottom:24px}
    h1{margin:0 0 6px;font-size:28px} header p{margin:0;opacity:.8;line-height:1.6}
    .stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
    .stat{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 14px;font-size:14px}
    h2{font-size:18px;margin:28px 0 10px;display:flex;align-items:center;gap:10px}
    .count{background:#fbeef2;color:#8a2e4a;border-radius:999px;padding:2px 10px;font-size:13px;font-weight:600}
    table{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border:1px solid #f0dfe4;border-radius:16px;overflow:hidden;font-size:14px}
    th{background:#fbeef2;text-align:left;padding:10px 14px;font-weight:600}
    td{padding:10px 14px;border-top:1px solid #f3e7eb;vertical-align:top}
    td a{color:#1f2a44;text-decoration:none;word-break:break-all} td a:hover{color:#b0306a;text-decoration:underline}
    .n{color:#9a8f95;width:36px}.p{width:80px}.f{width:90px;color:#6b6470}
    .bar{display:inline-block;height:6px;border-radius:9px;background:#c9a45c;vertical-align:middle;margin-right:6px}
    footer{margin-top:30px;color:#8b8590;font-size:13px}
  </style>
</head>
<body><div class="wrap">
  <header>
    <h1>BikaFlora Sitemap</h1>
    <p>This is the list of pages Google can find on bikaflora.my. Search engines read it automatically.</p>
    <div class="stats"><span class="stat"><b><xsl:value-of select="count(s:urlset/s:url)"/></b> pages in total</span></div>
  </header>

  <xsl:call-template name="group"><xsl:with-param name="title">Main pages</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[not(contains(s:loc,'/category/') or contains(s:loc,'/product/') or contains(s:loc,'/flower-delivery/') or contains(s:loc,'/blog') or contains(s:loc,'/about') or contains(s:loc,'/contact') or contains(s:loc,'/faq') or contains(s:loc,'/reviews') or contains(s:loc,'/delivery-information') or contains(s:loc,'/privacy-policy') or contains(s:loc,'/terms') or contains(s:loc,'/refund-policy'))]"/></xsl:call-template>
  <xsl:call-template name="group"><xsl:with-param name="title">Categories</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[contains(s:loc,'/category/')]"/></xsl:call-template>
  <xsl:call-template name="group"><xsl:with-param name="title">Products</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[contains(s:loc,'/product/')]"/></xsl:call-template>
  <xsl:call-template name="group"><xsl:with-param name="title">Delivery areas</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[contains(s:loc,'/flower-delivery/')]"/></xsl:call-template>
  <xsl:call-template name="group"><xsl:with-param name="title">Blog</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[contains(s:loc,'/blog')]"/></xsl:call-template>
  <xsl:call-template name="group"><xsl:with-param name="title">Info pages</xsl:with-param><xsl:with-param name="rows" select="s:urlset/s:url[contains(s:loc,'/about') or contains(s:loc,'/contact') or contains(s:loc,'/faq') or contains(s:loc,'/reviews') or contains(s:loc,'/delivery-information') or contains(s:loc,'/privacy-policy') or contains(s:loc,'/terms') or contains(s:loc,'/refund-policy')]"/></xsl:call-template>

  <footer>Priority shows how important a page is compared with the others (1.0 = most important). Updated shows when the list was last built.</footer>
</div></body></html>
</xsl:template>

<xsl:template name="group">
  <xsl:param name="title"/><xsl:param name="rows"/>
  <xsl:if test="count($rows) &gt; 0">
    <h2><xsl:value-of select="$title"/> <span class="count"><xsl:value-of select="count($rows)"/></span></h2>
    <table>
      <tr><th class="n">#</th><th>Page</th><th class="p">Priority</th><th class="f">Updates</th><th class="f">Updated</th></tr>
      <xsl:for-each select="$rows">
        <tr>
          <td class="n"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="substring-after(s:loc,'bikaflora.my')"/><xsl:if test="substring-after(s:loc,'bikaflora.my')=''">/</xsl:if></a></td>
          <td class="p"><span class="bar" style="width:{s:priority * 40}px"/><xsl:value-of select="s:priority"/></td>
          <td class="f"><xsl:value-of select="s:changefreq"/></td>
          <td class="f"><xsl:value-of select="substring(s:lastmod,1,10)"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:if>
</xsl:template>
</xsl:stylesheet>
