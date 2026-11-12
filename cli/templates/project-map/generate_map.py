#!/usr/bin/env python3
"""
Universal Project Map Generator (Python)
Standar Slop AI Indo - Human-Crafted Zero-Slop Performance

Penggunaan:
    python generate_map.py
    python generate_map.py /path/to/project
"""
import sys
import os
import json
from datetime import datetime

IGNORE_DIRS = {
    'venv', '.venv', 'env', '__pycache__', '.git', '.svn', '.hg',
    'node_modules', 'vendor', '.next', '.nuxt', 'dist', 'build',
    'out', 'coverage', '.pytest_cache', '.mypy_cache', 'target',
    'bin', 'obj', '.cache', 'tmp', 'temp', 'system'
}

IGNORE_EXTS = {'.pyc', '.pyo', '.pyd', '.class', '.exe', '.dll', '.so', '.dylib', '.DS_Store', 'Thumbs.db'}

def generate_map():
    target_dir = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.abspath(os.getcwd())
    files_list = []

    for root, dirs, files in os.walk(target_dir):
        # Filter direktori in-place agar os.walk tidak masuk ke folder berat
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            if file == 'PROJECT_MAP.json':
                continue
            _, ext = os.path.splitext(file)
            if ext.lower() in IGNORE_EXTS or file in IGNORE_EXTS:
                continue
            rel_path = os.path.relpath(os.path.join(root, file), target_dir).replace('\\', '/')
            files_list.append(rel_path)

    files_list.sort()
    data = {
        'generated_at': datetime.now().isoformat(),
        'project_name': os.path.basename(target_dir),
        'stats': {
            'total_files': len(files_list)
        },
        'files': files_list
    }

    out_file = os.path.join(target_dir, 'PROJECT_MAP.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"[SUKSES] PROJECT_MAP.json berhasil dibuat ({len(files_list)} berkas dipetakan).")

if __name__ == '__main__':
    generate_map()
