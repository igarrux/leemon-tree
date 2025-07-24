export const cliMessages = {
    en: {
        welcome: 'Leemon Tree CLI 🍋',
        version: 'Version',
        key_exists: 'The key already exists. Do you want to edit it?',
        enter_text: 'Enter text to translate:',
        translation_added: 'Translation added: {{key}}',
        config_exists: 'Config file already exists. Initialization skipped.',
        config_created: 'Config file created: lemon-tree.yaml',
        unknown_command: 'Unknown command.',
        dry_run_result: 'Dry run result',
        translation_deleted: 'Translation {{key}} deleted',
        usage: 'Usage: ltr <command> [options]\nCommands: init, set, delete',
        casing_conflict:
            'There are files in {{dir}} with similar names but different casing: {{similar}}. Only writing to {{baseName}}. Consider cleaning up old files if you changed the pattern casing.',
        renamed_file:
            'Renamed file {{oldPath}} to {{newPath}} due to casing change in your pattern.',
        key_exists_in_lng:
            'Key {{key}} already exists in {{lng}} with value: {{currentValue}}. Overwrite?',
        yes: 'Yes',
        no: 'No',
        yes_to_all: 'Yes to All',
        no_to_all: 'No to All',
        failed_to_translate:
            'Failed to translate {{key}} from {{sourceLanguage}} to {{lang}}: {{error}}',
        skipped_key: 'Skipped key {{key}} for language {{lang}}',
        use_text_as_key: 'Will you use the text as the translation key?',
        enter_text_to_translate: 'Enter text to translate:',
        enter_key_for_translation: 'Enter the key for the translation:',
        continue: 'Continue',
        edit: 'Edit',
        delete: 'Delete',
        translation_added_you_can: 'Translation added, you can:',
        edit_key: 'Edit the key:',
        edit_text: 'Edit the text:',
        delete_translation: 'Are you sure you want to delete this translation?',
        finished: 'I already finished.',
        empty_text: 'Empty text. Please enter a valid text or press CTRL+C to finish.',
        empty_key: 'Empty key. Please enter a valid key or press CTRL+C to finish.',
        editing: 'Editing',
        overwrite_all: 'Translations were overwritten',
        skip_all: 'Translations were skipped',
        how_to_exit: 'You can press CTRL+C for exit anytime.',
        lint_key: 'Key "{{key}}"',
        lint_present: 'Present in: {{present}}',
        lint_missing: 'Missing in: {{missing}}',
        lint_edit:
            'You can edit them with: \x1b[0mltr\x1b[33m set \x1b[34m\x1b[49mkey \x1b[32m"text to translate"\x1b[0m',
        lint_delete: 'You can delete them with: \x1b[0mltr\x1b[33m delete \x1b[34m\x1b[49mkey',
        no_add_translation: 'No translation added: {{key}}',
        lint_summary:
            '\n{{keysWithProblems}} keys with problems' +
            '\n{{filesWithProblems}} files with problems' +
            '\n{{totalFiles}} total files' +
            '\n{{totalKeys}} total keys' +
            '\n{{correctKeys}} keys without problems',
    } as const,
    es: {
        welcome: 'Leemon Tree CLI 🍋',
        version: 'Versión',
        key_exists: 'La clave ya existe. ¿Desea editarla?',
        enter_text: 'Ingrese el texto a traducir:',
        translation_added: 'Traducción agregada: {{key}}',
        config_exists: 'El archivo de configuración ya existe. Inicialización omitida.',
        config_created: 'Archivo de configuración creado: lemon-tree.yaml',
        unknown_command: 'Comando desconocido.',
        dry_run_result: 'Resultado de simulación: {{updatedFiles}}',
        translation_deleted: 'Traducción {{key}} eliminada',
        usage: 'Uso: ltr <comando> [opciones]\nComandos: init, set, delete',
        casing_conflict:
            'Hay archivos en {{dir}} con nombres similares pero diferentes mayúsculas/minúsculas: {{similar}}. Solo se escribirá en {{baseName}}. Considere limpiar los archivos antiguos si cambió el caso de la expresión.',
        renamed_file:
            'Archivo renombrado de {{oldPath}} a {{newPath}} debido a un cambio en el caso de la expresión.',
        key_exists_in_lng:
            'La clave {{key}} ya existe en {{lng}} con el valor: {{currentValue}}. ¿Desea sobreescribir?',
        yes: 'Sí',
        no: 'No',
        yes_to_all: 'Sí a todos',
        no_to_all: 'No a todos',
        failed_to_translate:
            'Error al traducir {{key}} de {{sourceLanguage}} a {{lang}}: {{error}}',
        skipped_key: 'Se omitió la clave {{key}} para el idioma {{lang}}',
        use_text_as_key: '¿Usarás el texto como clave de traducción?',
        enter_text_to_translate: 'Ingrese el texto a traducir:',
        enter_key_for_translation: 'Ingrese la clave de la traducción:',
        continue: 'Continuar',
        edit: 'Editar',
        delete: 'Eliminar',
        translation_added_you_can: 'Traducción agregada, puedes:',
        edit_key: 'Editar la clave:',
        edit_text: 'Editar el texto:',
        delete_translation: '¿Estás seguro de querer eliminar esta traducción?',
        finished: 'Ya terminé.',
        empty_text:
            'Texto vacío. Por favor, ingrese un texto válido o presione CTRL+C para terminar.',
        empty_key:
            'Clave vacía. Por favor, ingrese una clave válida o presione CTRL+C para terminar.',
        editing: 'Editando',
        overwrite_all: 'Se sobreescribieron las traducciones',
        skip_all: 'Se omitieron las traducciones',
        how_to_exit: 'Puedes presionar CTRL+C en cualquier momento para salir.',
        lint_key: 'Clave "{{key}}"',
        lint_present: 'Está en : {{present}}',
        lint_missing: 'Falta en: {{missing}}',
        lint_edit:
            'Puedes editarlas con: \x1b[0mltr\x1b[33m set \x1b[34m\x1b[49mclave \x1b[32m"texto a traducir"\x1b[0m',
        lint_delete: 'Puedes eliminarlas con: \x1b[0mltr\x1b[33m delete \x1b[34m\x1b[49mclave',
        no_add_translation: 'No se agregó la traducción {{key}}',
        lint_summary:
            '\n{{keysWithProblems}} claves con problemas' +
            '\n{{filesWithProblems}} archivos con problemas' +
            '\n{{totalFiles}} archivos totales' +
            '\n{{totalKeys}} claves totales' +
            '\n{{correctKeys}} claves sin problemas',
    } as const,
} as const;
