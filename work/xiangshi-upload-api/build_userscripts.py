"""Assemble the survey workflow into existing userscript distributions."""
from pathlib import Path

root = Path(__file__).resolve().parents[2]
source = Path(__file__).resolve().parent
modules = ['upload-settings.js', 'folder-plan.js', 'order-query.js', 'file-upload.js', 'image-payload.js',
           'page-context.js', 'save-payload.js', 'order-context.js', 'browser-api.js',
           'upload-outcome.js', 'upload-runner.js', 'folder-panel.js']
bundle = '\n'.join((source / name).read_text().split("if (typeof module")[0] for name in modules)
marker = '\n// XHJ survey folder panel\n'
for name in ['xhj_assistant.user.js', 'xhj_assistant_534783.user.js', 'xhj_assistant_563982.user.js', 'xhj_assistant_563997.user.js']:
    target = root / name
    original = target.read_text().split(marker)[0]
    target.write_text(original + marker + '(function () {\n' + bundle + '\n})();\n')
