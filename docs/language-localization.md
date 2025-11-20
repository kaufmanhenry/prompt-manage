# Language & Localization

Prompt Manage supports 20 languages to serve a global audience. The application uses `next-intl` for routing and content localization.

## Supported Languages

| Code | Language   | Native Name      |
| ---- | ---------- | ---------------- |
| `en` | English    | English          |
| `zh` | Chinese    | 中文             |
| `es` | Spanish    | Español          |
| `ar` | Arabic     | العربية          |
| `pt` | Portuguese | Português        |
| `id` | Indonesian | Bahasa Indonesia |
| `fr` | French     | Français         |
| `ja` | Japanese   | 日本語           |
| `ru` | Russian    | Русский          |
| `de` | German     | Deutsch          |
| `ko` | Korean     | 한국어           |
| `tr` | Turkish    | Türkçe           |
| `it` | Italian    | Italiano         |
| `vi` | Vietnamese | Tiếng Việt       |
| `th` | Thai       | ไทย              |
| `pl` | Polish     | Polski           |
| `nl` | Dutch      | Nederlands       |
| `hi` | Hindi      | हिन्दी           |
| `bn` | Bengali    | বাংলা            |
| `fa` | Persian    | فارسی            |

## How it Works

1.  **Routing**: URLs are prefixed with the locale code (e.g., `/en/dashboard`, `/zh/dashboard`).
2.  **Detection**: The application automatically detects the user's preferred language from their browser settings.
3.  **Persistence**: Language selection is persisted via the URL.

## Adding a New Language

To add a new language:

1.  Update `i18n/routing.ts` to include the new locale code.
2.  Update `components/LanguageSwitcher.tsx` to add the language to the dropdown.
3.  Create a new message file in `messages/<locale>.json`.
4.  Run `node scripts/generate-locales.js` to generate placeholder messages if needed.

## Contributing Translations

Translations are stored in `messages/<locale>.json`. We welcome contributions to improve the quality of our translations. Please submit a Pull Request with your changes.
