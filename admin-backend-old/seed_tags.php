<?php
require_once __DIR__ . '/db.php';

$tags_map = [
    'why-every-growing-business-needs-whatsapp-api' => "whatsapp-api\nbusiness-growth\nautomation",
    'why-ecommerce-brands-are-investing-in-whatsapp-api' => "ecommerce\nwhatsapp-api\nsales",
    'how-to-increase-sales-using-whatsapp-api' => "sales-growth\nmarketing\nwhatsapp-api",
    'how-whatsapp-api-works-everything-you-need-to-know' => "beginners-guide\nwhatsapp-api\ntech",
];

foreach ($tags_map as $slug => $tags) {
    $stmt = $db->prepare("UPDATE blog_posts SET tags = :tags WHERE slug = :slug");
    $stmt->execute([':tags' => $tags, ':slug' => $slug]);
    echo "Updated tags for $slug\n";
}
echo "Migration finished successfully!\n";
