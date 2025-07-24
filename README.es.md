
# 🍋 Lemon Tree

![Lemon Tree](https://img.garrux.dev/docs/lemon-tree/swok58n6.png)

**Lemon Tree** es una herramienta CLI para automatizar la gestión de traducciones en proyectos multilingües. Permite crear claves de traducción, generar archivos tipados, traducir textos usando APIs externas, proteger fragmentos dentro del texto, y ejecutar scripts personalizados antes o después del proceso.

---

## 🚀 Características principales

- ✅ Creación de claves de traducción.
- 🔤 Traducción automática usando Google, DeepL, Microsoft, Yandex o plugins personalizados.
- 🛡 Protección de patrones en textos (e.g. `{{variable}}`) para evitar que sean traducidos.
- 🧠 Interpolación dinámica en rutas y archivos mediante expresiones JavaScript (`{{lang.toUpperCase()}}`, etc.).
- 🧪 Linter para detectar claves huérfanas, faltantes o archivos desactualizados.
- ⚙️ Scripts pre y post procesamiento.
- 🧩 Configuración flexible y declarativa en YAML.

---

## 📦 Instalación

```bash
npm install --save-dev lemon-tree
```

⸻

🧾 Configuración básica (lemon-tree.yaml)

Este archivo debe ubicarse en la raíz del proyecto.

languages:
  - en
  - es
  - pt
  - ru
  - zh
  - es-ES
  - es-MX

sourceLanguage: en       # Idioma de origen
cliLanguage: es          # Idioma de los mensajes de CLI (es | en)

default:                 # Configuración común para idiomas no definidos explícitamente
  filePattern: ./translations/{{lang}}/{{lang}}.json
  protectionPattern: '{{key}}'  # Protege lo que esté entre {{key}}, evitando que se traduzca
  typeDefinition:
    file: ./translations.d.ts
    exportName: Translations

translations:            # Configuración específica por idioma (opcional)
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

🧠 Interpolación en patrones

Lemon Tree permite usar expresiones JavaScript dentro de {{...}} en rutas de archivos:

filePattern: ./{{lang.replace("-", "_").toUpperCase()}}.json

Esto es evaluado en tiempo de ejecución con new Function, utilizando como contexto las variables:
	•	lang
	•	provider
	•	sourceLanguage

Si la expresión falla, se conserva el literal original ({{...}}).

⸻

🔐 Protección de texto (pattern)

Las partes del texto entre el patrón definido no serán traducidas.
Ejemplos válidos:
	•	{{key}}
	•	<<key>>
	•	__key__
	•	***key***

⚠️ El patrón debe contener la palabra key, o Lemon Tree mostrará un error.

⸻

🔌 API de traducción

api:
  provider: microsoft     # google | deepl-free | deepl-pro | microsoft | yandex | plugin
  key: '{{API_KEY}}'      # Puede interpolar variables de entorno
  plugin: './my-plugin.js' # Solo si provider = plugin

Los plugins personalizados deben exportar una función default asíncrona:

export default async function ({ text, from, to, apiKey, dryRun }) {
  // tu lógica personalizada
  return 'traducción';
}


⸻

🧩 Scripts personalizados

Los scripts se ejecutan secuencialmente con execSync (bloqueante) desde shell.

🔹 PreScripts

preScript:
  - echo "Preparando traducciones..."

	•	Se ejecutan antes de iniciar la traducción.
	•	No admiten variables interpolables.

⸻

🔹 postScript

postScript:
  - echo "Resultado: {{result}}"
  - echo "Acción: {{action}}"

	•	Se ejecutan después de realizar una acción (set o delete).
	•	Soportan las siguientes variables interpolables: 🟢 {{action}}
	•	"set": cuando se agregan o actualizan traducciones.
	•	"delete": cuando se elimina una clave de traducción. 🟢 {{result}}

El valor de {{result}} depende del tipo de acción:
	•	Para "set":

[
  { "lang": "es", "translation": "Hola" },
  { "lang": "pt", "translation": "Olá" },
  { "lang": "ru", "translation": "Привет" }
]


	•	Para "delete":

{ "key": "text-key {{example}}" }



Estos objetos son reemplazados literalmente dentro del comando.
por lo que ejecutar `echo {{result}}` será equivalente a algo similar a esto:
`echo '{"lang": "es", "translation": "Hola"}'`

⸻

¿Te gustaría que Lemon Tree también pase los resultados como variables de entorno (LEMON_RESULT, LEMON_ACTION) además de las interpolaciones?
Eso permitiría capturarlos de forma más limpia en scripts bash o node.

🛠 Comandos CLI

ltr init

Inicializa el proyecto con un archivo lemon-tree.yaml por defecto.

ltr set "clave {{var}}"           # Usa la clave como texto base
ltr set "clave" "Texto a traducir" # Clave y texto separados
ltr delete "clave"                # Elimina una clave de traducción
ltr -g                            # Modo guiado paso a paso
ltr lint                          # Revisa claves huérfanas o faltantes

🔸 Flags
	•	--dry-run: Simula las acciones sin modificar archivos.

ltr set "clave" "Texto" --dry-run
ltr delete "clave" --dry-run


⸻

📌 Notas adicionales
	•	La configuración default se aplica a todos los idiomas no definidos en translations.
	•	Si un idioma está en translations, usa exclusivamente esa configuración.
	•	El cliLanguage afecta solo los mensajes de consola.
	•	Si defines un typeDefinition, se generará un archivo .d.ts que contiene los tipos inferidos a partir de las traducciones.

⸻

💬 Ejemplo de uso en proyectos

import { tr } from './translations/en/en'; // Export generado automáticamente

console.log(tr["welcome.message"]); // Type-safe, si usas los tipos generados


⸻

🧼 Linting de traducciones

ltr lint

Verifica:
	•	Traducciones faltantes.
	•	Archivos con claves no utilizadas.
	•	Desincronización entre idiomas.

⸻

🛠 Estado de compatibilidad

Característica	Compatibilidad
Node.js	✅ mínimo v16+ recomendado


⸻

📄 Licencia

MIT

⸻

🧑‍💻 Autor

Desarrollado por Jhon Guerrero (Garrux)
¡Hecho con amor, obsesión por el rendimiento y 100% cobertura de tests!

---
