<?php
function update_blog_sitemap() {
    global $db;
    try {
        // Fetch all published posts
        $stmt = $db->query("SELECT slug, updated_at, created_at FROM blog_posts WHERE status = 'published' ORDER BY updated_at DESC");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
        
        foreach ($posts as $post) {
            $slug = htmlspecialchars($post['slug'], ENT_XML1, 'UTF-8');
            // Use updated_at or created_at, fallback to current date
            $dateSource = !empty($post['updated_at']) ? $post['updated_at'] : (!empty($post['created_at']) ? $post['created_at'] : '');
            $updated = !empty($dateSource) ? substr($dateSource, 0, 10) : date('Y-m-d');
            
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>https://www.minibee.tech/blog/' . $slug . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $updated . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>weekly</changefreq>' . PHP_EOL;
            $xml .= '    <priority>0.6</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }
        
        $xml .= '</urlset>' . PHP_EOL;
        
        // Write to the React public/ folder so it's served at www.minibee.tech/blogSitemap.xml
        $filePath = __DIR__ . '/../public/blogSitemap.xml';
        file_put_contents($filePath, $xml);
    } catch (Exception $e) {
        // Silence or log generator exception
    }
}
