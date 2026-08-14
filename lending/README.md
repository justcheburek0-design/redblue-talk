# RED & BLUE Talk

Лендинг разговорного клуба на Next.js (App Router).

## Команды

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run serve:export
```

Сборка статически экспортируется в `out/` с базовым путём `/redblue/`.

Для runtime-проверки export: после `npm run build` запусти `npm run serve:export`, затем в другом терминале `npm run verify:hero`. Сервер публикует `out/` по `http://127.0.0.1:4174/redblue/`.
