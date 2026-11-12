<?php
/**
 * Universal Project Map Generator (PHP)
 * Standar Slop AI Indo - Human-Crafted Zero-Slop Performance
 *
 * Penggunaan:
 *   php generate_map.php
 *   php generate_map.php /path/to/project
 */

$ignoreDirs = [
    'vendor', 'system', '.git', '.svn', '.hg',
    'node_modules', '.next', '.nuxt', 'dist', 'build',
    'storage', 'cache', 'logs', 'venv', '.venv',
    'target', 'bin', 'obj', '.cache', 'tmp', 'temp'
];

$ignoreExts = ['.pyc', '.class', '.exe', '.dll', '.DS_Store', 'Thumbs.db'];

$targetDir = isset($argv[1]) ? realpath($argv[1]) : realpath(getcwd());
if (!$targetDir || !is_dir($targetDir)) {
    fwrite(STDERR, "[ERROR] Direktori tidak ditemukan.\n");
    exit(1);
}

$files = [];

$iterator = new RecursiveIteratorIterator(
    new RecursiveCallbackFilterIterator(
        new RecursiveDirectoryIterator($targetDir, RecursiveDirectoryIterator::SKIP_DOTS),
        function ($cur) use ($ignoreDirs) {
            return !in_array($cur->getFilename(), $ignoreDirs, true);
        }
    )
);

foreach ($iterator as $info) {
    if ($info->isFile()) {
        $filename = $info->getFilename();
        if ($filename === 'PROJECT_MAP.json') {
            continue;
        }
        $ext = '.' . strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (in_array($ext, $ignoreExts, true) || in_array($filename, $ignoreExts, true)) {
            continue;
        }
        $rel = str_replace([$targetDir . DIRECTORY_SEPARATOR, '\\'], ['', '/'], $info->getPathname());
        $files[] = $rel;
    }
}

sort($files);

$data = [
    'generated_at' => date('c'),
    'project_name' => basename($targetDir),
    'stats' => [
        'total_files' => count($files),
    ],
    'files' => $files,
];

file_put_contents(
    $targetDir . DIRECTORY_SEPARATOR . 'PROJECT_MAP.json',
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL
);

echo "[SUKSES] PROJECT_MAP.json berhasil dibuat (" . count($files) . " berkas dipetakan).\n";
