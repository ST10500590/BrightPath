<?xml version="1.0" encoding="UTF-8"?>
<!--
  Human-readable XSL stylesheet for sitemap.xml
  Visit /sitemap.xml in a browser to see a formatted table.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
    <head>
      <title>BrightPath XML Sitemap</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f8f5ff; color: #333; margin: 0; padding: 20px; }
        h1   { color: #6a0dad; }
        table{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;
               box-shadow: 0 2px 8px rgba(138,43,226,0.15); }
        th   { background: linear-gradient(135deg,#6a0dad,#8a2be2); color: white; padding: 12px 16px; text-align: left; }
        td   { padding: 10px 16px; border-bottom: 1px solid #e0d0f0; }
        tr:last-child td { border-bottom: none; }
        a    { color: #6a0dad; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>&#128269; BrightPath XML Sitemap</h1>
      <p>This sitemap contains <strong><xsl:value-of select="count(s:urlset/s:url)"/></strong> URLs.</p>
      <table>
        <tr>
          <th>URL</th>
          <th>Last Modified</th>
          <th>Change Frequency</th>
          <th>Priority</th>
        </tr>
        <xsl:for-each select="s:urlset/s:url">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td><xsl:value-of select="s:lastmod"/></td>
            <td><xsl:value-of select="s:changefreq"/></td>
            <td><xsl:value-of select="s:priority"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
