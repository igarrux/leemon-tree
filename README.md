# 🍋 Lemon Tree

![Lemon Tree](https://img.garrux.dev/docs/lemon-tree/swok58n6.png)


**Lemon Tree** is a CLI tool to automate translation management in multilingual projects. It allows you to create translation keys, generate typed files, translate texts using external APIs, protect fragments within the text, and run custom scripts before or after the process.

---

## 🚀 Main Features

- ✅ Creation of translation keys.
- 🔤 Automatic translation using Google, DeepL, Microsoft, Yandex, or custom plugins.
- 🛡 Protection of patterns in texts (e.g. `{{variable}}`) to prevent them from being translated.
- 🧠 Dynamic interpolation in paths and files using JavaScript expressions (`{{lang.toUpperCase()}}`, etc.).
- 🧪 Linter to detect orphan, missing, or outdated keys/files.
- ⚙️ Pre and post processing scripts.
- 🧩 Flexible and declarative YAML configuration.

---

## 📦 Installation

```bash
npm install --save-dev lemon-tree
```

⸻

🧾 Basic Configuration (lemon-tree.yaml)

This file should be located at the root of the project.

languages:
  - en
  - es
  - pt
  - ru
  - zh
  - es-ES
  - es-MX

sourceLanguage: en       # Source language
cliLanguage: en          # CLI messages language (es | en)

default:                 # Common configuration for languages not explicitly defined
  filePattern: ./translations/{{lang}}/{{lang}}.json
  protectionPattern: '{{key}}'  # Protects what is between {{key}}, preventing it from being translated
  typeDefinition:
    file: ./translations.d.ts
    exportName: Translations

translations:            # Language-specific configuration (optional)
  - lang: zh
    filePattern: ./translations/zh.json
    protectionPattern: '<<key>>'
    typeDefinition:
      file: ./zh/translations_ch.d.ts
      exportName: TranslationsExample

  - lang: es-MX
    filePattern: ./translations/es_mx/{{lang}}.json
    protectionPattern: '__key__'
    typeDefinition:
      file: ./ES_MX/translations_ch.d.ts
      exportName: TranslationsExampleEsMx

⸻

🧠 Pattern Interpolation

Lemon Tree allows you to use JavaScript expressions inside {{...}} in file paths:

filePattern: ./{{lang.replace("-", "_").toUpperCase()}}.json

This is evaluated at runtime with new Function, using the following context variables:
  • lang
  • provider
  • sourceLanguage

If the expression fails, the original literal ({{...}}) is preserved.

⸻

🔐 Text Protection (pattern)

The parts of the text between the defined pattern will not be translated.
Valid examples:
  • {{key}}
  • <<key>>
  • __key__
  • ***key***

⚠️ The pattern must contain the word key, or Lemon Tree will show an error.

⸻

🔌 Translation API

api:
  provider: microsoft     # google | deepl-free | deepl-pro | microsoft | yandex | plugin
  key: '{{API_KEY}}'      # Can interpolate environment variables
  plugin: './my-plugin.js' # Only if provider = plugin

Custom plugins must export a default async function:

export default async function ({ text, from, to, apiKey, dryRun }) {
  // your custom logic
  return 'translation';
}

⸻

🧩 Custom Scripts

Scripts are executed sequentially with execSync (blocking) from the shell.

🔹 PreScripts

preScript:
  - echo "Preparing translations..."

  • Executed before starting the translation process.
  • Do not support interpolable variables.

⸻

🔹 postScript

postScript:
  - echo "Result: {{result}}"
  - echo "Action: {{action}}"

  • Executed after performing an action (set or delete).
  • Support the following interpolable variables: 🟢 {{action}}
  • "set": when translations are added or updated.
  • "delete": when a translation key is deleted. 🟢 {{result}}

The value of {{result}} depends on the type of action:
  • For "set":

[
  { "lang": "es", "translation": "Hola" },
  { "lang": "pt", "translation": "Olá" },
  { "lang": "ru", "translation": "Привет" }
]

  • For "delete":

{ "key": "text-key {{example}}" }

These objects are replaced literally within the command, so running `echo {{result}}` will be equivalent to something like:
`echo '{"lang": "es", "translation": "Hola"}'`

⸻

Would you like Lemon Tree to also pass the results as environment variables (LEMON_RESULT, LEMON_ACTION) in addition to interpolations? That would allow you to capture them more cleanly in bash or node scripts.

🛠 CLI Commands

ltr init

Initializes the project with a default lemon-tree.yaml file.

ltr set "key {{var}}"           # Uses the key as base text
ltr set "key" "Text to translate" # Key and text separated
ltr delete "key"                # Deletes a translation key
ltr -g                          # Guided step-by-step mode
ltr lint                        # Checks for orphan or missing keys

🔸 Flags
  • --dry-run: Simulates actions without modifying files.

ltr set "key" "Text" --dry-run
ltr delete "key" --dry-run

⸻

📌 Additional Notes
  • The default configuration applies to all languages not defined in translations.
  • If a language is in translations, only that configuration is used.
  • cliLanguage only affects console messages.
  • If you define a typeDefinition, a .d.ts file will be generated containing the types inferred from the translations.

⸻

💬 Example usage in projects

import { tr } from './translations/en/en'; // Automatically generated export

console.log(tr["welcome.message"]); // Type-safe, if you use the generated types

⸻

🧼 Translation Linting

ltr lint

Checks:
  • Missing translations.
  • Files with unused keys.
  • Desynchronization between languages.

⸻

🛠 Compatibility Status

Feature         Compatibility
Node.js         ✅ minimum v16+ recommended

⸻

📄 License

MIT

⸻

🧑‍💻 Author

Developed by Jhon Guerrero (Garrux)
Made with love, performance obsession, and 100% test coverage!

---
