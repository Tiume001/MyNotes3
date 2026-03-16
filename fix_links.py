import os
import re

html_files = []
for root, dirs, files in os.walk('/Users/mattiascarpa/Desktop/login_firebase'):
    if 'node_modules' in root or '.git' in root or '.gemini' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        
        # 1. Replace the navbar github link
        content = re.sub(
            r'<a href="https://github\.com/Tiume001" target="_blank"\s*style="color: var\(--text-secondary\); font-size: 1\.2rem; transition: 0\.2s;">\s*<i\s+class="fa-brands fa-github"></i>\s*</a>',
            r'<a href="https://links.mattiascarpa.it" target="_blank"\n                    style="color: var(--text-secondary); font-size: 1.2rem; transition: 0.2s;"><i\n                        class="fa-solid fa-link"></i></a>',
            content,
            flags=re.IGNORECASE
        )
        
        # 2. Replace the drawer github link
        content = re.sub(
            r'<a href="https://github\.com/Tiume001" target="_blank">\s*<i\s+class="fa-brands fa-github"></i>\s*</a>',
            r'<a href="https://links.mattiascarpa.it" target="_blank"><i class="fa-solid fa-link"></i></a>',
            content,
            flags=re.IGNORECASE
        )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Skipped {file_path}: {e}")
        
# Also replace in replace_html.mjs
mjs_path = '/Users/mattiascarpa/Desktop/login_firebase/scripts/replace_html.mjs'
if os.path.exists(mjs_path):
    try:
        with open(mjs_path, 'r', encoding='utf-8') as f:
            mjs_content = f.read()
        orig_mjs = mjs_content
        mjs_content = re.sub(
            r'<a href="https://github\.com/Tiume001" target="_blank" style="color: var\(--text-secondary\); font-size: 1\.2rem; transition: 0\.2s;"><i class="fa-brands fa-github"></i></a>',
            r'<a href="https://links.mattiascarpa.it" target="_blank" style="color: var(--text-secondary); font-size: 1.2rem; transition: 0.2s;"><i class="fa-solid fa-link"></i></a>',
            mjs_content
        )
        if mjs_content != orig_mjs:
            with open(mjs_path, 'w', encoding='utf-8') as f:
                f.write(mjs_content)
            print("Updated: replace_html.mjs")
    except Exception as e:
        print(f"Skipped {mjs_path}: {e}")
