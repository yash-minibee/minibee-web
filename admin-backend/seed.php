<?php
/**
 * Seed Script — Minibee Admin
 * Inserts ALL static data into the SQLite database.
 * Safe to run multiple times — checks if data already exists before inserting.
 *
 * Run via CLI:  php admin-backend/seed.php
 * Run via browser: http://localhost:8080/seed.php
 */

require_once __DIR__ . '/db.php';
header('Content-Type: text/plain; charset=utf-8');

$log = [];

function already_seeded($db, $table) {
    $count = $db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
    return $count > 0;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. PRICING PLANS
// ══════════════════════════════════════════════════════════════════════════════
if (already_seeded($db, 'pricing_plans')) {
    $log[] = "[SKIP] pricing_plans — already has data";
} else {
    $plans = [
        [
            'name'        => 'Starter',
            'tagline'     => 'Perfect for small businesses getting started',
            'monthly_usd' => 50,
            'yearly_usd'  => 41,
            'monthly_inr' => 1200,
            'yearly_inr'  => 1000,
            'popular'     => 0,
            'cta'         => 'Get Started',
            'href'        => '/contact',
            'sort_order'  => 1,
            'features'    => json_encode([
                '5 Tamplates/Month',
                'Support on Chat',
                'Working Days Support (Mon-Fri)',
                '1 Number',
                '1 Display Name',
                'Schedule Campain',
                '5 Msg/Sec',
            ]),
            'not_included' => json_encode([
                'ChatBots',
                'ChatBox',
                'Extra User Access',
                'API Integrations',
                'Automation Trigger',
            ]),
        ],
        [
            'name'        => 'Growth',
            'tagline'     => 'For growing teams that need more power',
            'monthly_usd' => 85,
            'yearly_usd'  => 70,
            'monthly_inr' => 2000,
            'yearly_inr'  => 1666,
            'popular'     => 1,
            'cta'         => 'Get Started',
            'href'        => '/contact',
            'sort_order'  => 2,
            'features'    => json_encode([
                '12 Tamplates/Month',
                'Support on Chat',
                'Working Days Support (Mon-Fri)',
                '2 Number',
                '2 Display Name',
                'Schedule Campain',
                '10 Msg/Sec',
                '3 ChatBots',
                'Upto 20 ChatBox',
                '1 Extra User',
                '1 Paid API Integration',
                '1 lakh Bot Trigger/Month',
            ]),
            'not_included' => json_encode([]),
        ],
        [
            'name'        => 'Premium',
            'tagline'     => 'Comprehensive solution for established businesses',
            'monthly_usd' => 170,
            'yearly_usd'  => 141,
            'monthly_inr' => 4000,
            'yearly_inr'  => 3333,
            'popular'     => 0,
            'cta'         => 'Get Started',
            'href'        => '/contact',
            'sort_order'  => 3,
            'features'    => json_encode([
                '30 Tamplates/Month',
                'Support on Call',
                'Working Days Support (Mon-Fri)',
                '4 Number',
                '4 Display Name',
                'Schedule Campain',
                '20 Msg/Sec',
                '8 Normal ChatBot OR 1 AI Chatbot',
                'Upto 70 ChatBox',
                '3 Extra User',
                '1 Free API Integration',
                '3 lakh Bot Trigger/Month',
            ]),
            'not_included' => json_encode([]),
        ],
        [
            'name'        => 'Enterprise',
            'tagline'     => 'Tailored for large enterprises at scale',
            'monthly_usd' => null,
            'yearly_usd'  => null,
            'monthly_inr' => null,
            'yearly_inr'  => null,
            'popular'     => 0,
            'cta'         => 'Get Started',
            'href'        => '/contact',
            'sort_order'  => 4,
            'features'    => json_encode([
                'Unlimited WhatsApp Numbers',
                'Unlimited Messages',
                'Custom AI Model Training',
                'Unlimited Seats',
                'All Premium features',
                'On-premise Deployment',
                'Custom SLA',
                'Dedicated Engineering Support',
                'Security Audit',
                'Custom Legal Agreements',
            ]),
            'not_included' => json_encode([]),
        ],
    ];

    $stmt = $db->prepare("
        INSERT INTO pricing_plans
            (name, tagline, monthly_usd, yearly_usd, monthly_inr, yearly_inr, popular, cta, href, sort_order, features, not_included)
        VALUES
            (:name, :tagline, :monthly_usd, :yearly_usd, :monthly_inr, :yearly_inr, :popular, :cta, :href, :sort_order, :features, :not_included)
    ");
    foreach ($plans as $p) {
        $stmt->execute([
            ':name'        => $p['name'],
            ':tagline'     => $p['tagline'],
            ':monthly_usd' => $p['monthly_usd'],
            ':yearly_usd'  => $p['yearly_usd'],
            ':monthly_inr' => $p['monthly_inr'],
            ':yearly_inr'  => $p['yearly_inr'],
            ':popular'     => $p['popular'],
            ':cta'         => $p['cta'],
            ':href'        => $p['href'],
            ':sort_order'  => $p['sort_order'],
            ':features'    => $p['features'],
            ':not_included'=> $p['not_included'],
        ]);
    }
    $log[] = "[OK] pricing_plans — inserted " . count($plans) . " plans";
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. FEATURE COMPARISON
// ══════════════════════════════════════════════════════════════════════════════
if (already_seeded($db, 'feature_comparison')) {
    $log[] = "[SKIP] feature_comparison — already has data";
} else {
    $rows = [
        ['Templates Allowed',    '5 / Month',        '12 / Month',          '30 / Month',         'Unlimited',     1],
        ['Support Channel',      'Chat Support',      'Chat Support',        'Call Support',        'Call Support',  2],
        ['Support Schedule',     'Mon - Fri',         'Mon - Fri',           'Mon - Fri',           'Mon-Fri',       3],
        ['WhatsApp Numbers',     '1 Number',          '2 Numbers',           '4 Numbers',           'Max Limit',     4],
        ['Display Names',        '1 Name',            '2 Names',             '4 Names',             'Max Limit',     5],
        ['Schedule Campaigns',   'true',              'true',                'true',                'true',          6],
        ['Messaging Speed',      '5 Msg/Sec',         '10 Msg/Sec',          '20 Msg/Sec',          'Max Limit',     7],
        ['Chatbots Included',    'false',             '3 ChatBots',          '8 Normal OR 1 AI',    'Customized ',   8],
        ['ChatBox Access',       'false',             'Up to 20',            'Up to 70',            'Max Limit',     9],
        ['Extra User Seats',     'false',             '1 Extra User',        '3 Extra Users',       'Customized',    10],
        ['API Integrations',     'false',             '1 Paid Integration',  '1 Free Integration',  'Customized',    11],
        ['Monthly Bot Triggers', 'false',             '1 Lakh / Month',      '3 Lakh / Month',      'Max Limit',     12],
    ];

    $stmt = $db->prepare("
        INSERT INTO feature_comparison (feature, starter, growth, premium, enterprise, sort_order)
        VALUES (:feature, :starter, :growth, :premium, :enterprise, :sort_order)
    ");
    foreach ($rows as [$feature, $starter, $growth, $premium, $enterprise, $order]) {
        $stmt->execute([
            ':feature'    => $feature,
            ':starter'    => $starter,
            ':growth'     => $growth,
            ':premium'    => $premium,
            ':enterprise' => $enterprise,
            ':sort_order' => $order,
        ]);
    }
    $log[] = "[OK] feature_comparison — inserted " . count($rows) . " rows";
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. PRICING ADDONS
// ══════════════════════════════════════════════════════════════════════════════
if (already_seeded($db, 'pricing_addons')) {
    $log[] = "[SKIP] pricing_addons — already has data";
} else {
    $addons = [
        [
            'icon_key'    => 'extra-agent',
            'name'        => 'Extra Team Member',
            'description' => 'Add an additional agent to collaborate on customer chats.',
            'price_usd'   => 25,
            'price_inr'   => 2000,
            'period'      => 'user / year',
            'sort_order'  => 1,
        ],
        [
            'icon_key'    => 'shopify-store',
            'name'        => 'E-Comm Store / Shopify',
            'description' => 'Seamless integration with your online store for automated catalog & order sync.',
            'price_usd'   => null,
            'price_inr'   => null,
            'period'      => 'Custom',
            'sort_order'  => 2,
        ],
        [
            'icon_key'    => 'bot-trigger',
            'name'        => 'Bot Triggers Pack',
            'description' => 'Increase your monthly automated bot message limits.',
            'price_usd'   => null,
            'price_inr'   => null,
            'period'      => 'Custom',
            'sort_order'  => 3,
        ],
        [
            'icon_key'    => 'social-channels',
            'name'        => 'Social Channels',
            'description' => 'Connect Facebook, Instagram, and RCS messages to your unified inbox.',
            'price_usd'   => 75,
            'price_inr'   => 6000,
            'period'      => 'FB / Insta / RCS',
            'sort_order'  => 4,
        ],
    ];

    $stmt = $db->prepare("
        INSERT INTO pricing_addons (icon_key, name, description, price_usd, price_inr, period, sort_order)
        VALUES (:icon_key, :name, :description, :price_usd, :price_inr, :period, :sort_order)
    ");
    foreach ($addons as $a) {
        $stmt->execute([
            ':icon_key'    => $a['icon_key'],
            ':name'        => $a['name'],
            ':description' => $a['description'],
            ':price_usd'   => $a['price_usd'],
            ':price_inr'   => $a['price_inr'],
            ':period'      => $a['period'],
            ':sort_order'  => $a['sort_order'],
        ]);
    }
    $log[] = "[OK] pricing_addons — inserted " . count($addons) . " addons";
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. PORTFOLIO ITEMS
// ══════════════════════════════════════════════════════════════════════════════
if (already_seeded($db, 'portfolio_items')) {
    $log[] = "[SKIP] portfolio_items — already has data";
} else {
    $items = [
        ['Kich India',        'Corporate Website', 'https://www.kichindia.com/',               'Premium architectural hardware and safety systems manufacturer website.',                    1],
        ['La Dolce Vita',     'E-Commerce Store',  'https://www.ladolcevita.com.au/',           'Bespoke luxury tour packaging and online booking platform.',                                2],
        ['Boomerang Travels', 'Web Application',   'https://boomerangglobaltravels.com/',       'Global travel itineraries, MICE planning, and holiday booking dashboard.',                  3],
        ['Micra Digital',     'UI/UX Design',      'https://www.micra.digital/',               'High-end agency portfolio and digital transformation platform.',                            4],
        ['MayaOS',            'Web Application',   'https://mayaos.in/',                       'Interactive landing page and user interface documentation portal.',                         5],
        ['Altin Exports',     'Corporate Website', 'https://altinexports.com/',                'International trade representation and agricultural exports showcase.',                      6],
        ['Krutika Jaggery',   'E-Commerce Store',  'https://krutikaagro.in/',                  'E-Commerce destination for organic agro products and premium jaggery.',                     7],
        ['Horizon Tours',     'Corporate Website', 'https://horizontoursandtravels.com.au/',   'Tour planning, flight booking assistance, and destination guides.',                         8],
        ['Lusano',            'E-Commerce Store',  'https://lusano.in/',                       'Premium designer lighting fixtures and home decor catalog platform.',                       9],
        ['Eknath Crop Science','Corporate Website','https://eknathcropscience.com/',           'Agrochemical solutions, crop protection, and dealer management database.',                  10],
    ];

    $stmt = $db->prepare("
        INSERT INTO portfolio_items (title, category, url, description, sort_order)
        VALUES (:title, :category, :url, :description, :sort_order)
    ");
    foreach ($items as [$title, $category, $url, $description, $order]) {
        $stmt->execute([
            ':title'       => $title,
            ':category'    => $category,
            ':url'         => $url,
            ':description' => $description,
            ':sort_order'  => $order,
        ]);
    }
    $log[] = "[OK] portfolio_items — inserted " . count($items) . " projects";
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. WHATSAPP BUSINESS API CLIENTS
// ══════════════════════════════════════════════════════════════════════════════
if (already_seeded($db, 'whatsapp_clients')) {
    $log[] = "[SKIP] whatsapp_clients — already has data";
} else {
    $clients = [
        ['Acme Corp',        'https://api.dicebear.com/7.x/initials/svg?seed=Acme', 1],
        ['Global Logistics', 'https://api.dicebear.com/7.x/initials/svg?seed=Global', 2],
        ['Nova Health',      'https://api.dicebear.com/7.x/initials/svg?seed=Nova', 3],
        ['Apex Solutions',   'https://api.dicebear.com/7.x/initials/svg?seed=Apex', 4],
        ['Echo Media',       'https://api.dicebear.com/7.x/initials/svg?seed=Echo', 5],
    ];

    $stmt = $db->prepare("
        INSERT INTO whatsapp_clients (name, logo_url, sort_order)
        VALUES (:name, :logo_url, :sort_order)
    ");
    foreach ($clients as [$name, $logo_url, $order]) {
        $stmt->execute([
            ':name'       => $name,
            ':logo_url'   => $logo_url,
            ':sort_order'  => $order,
        ]);
    }
    $log[] = "[OK] whatsapp_clients — inserted " . count($clients) . " clients";
}


// ══════════════════════════════════════════════════════════════════════════════
// Done
// ══════════════════════════════════════════════════════════════════════════════
echo "Minibee Seed Script\n";
echo "===================\n\n";
foreach ($log as $line) {
    echo $line . "\n";
}
echo "\nDone.\n";
