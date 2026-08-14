# RED & BLUE Talk

Лендинг разговорного клуба на Next.js (App Router).

## Команды

```bash
bun install --frozen-lockfile
bun run dev
bun run build
bun run start
bun run lint
bun run typecheck
bun run serve:export
```

Сборка статически экспортируется в `out/` с базовым путём `/redblue/`.

Для runtime-проверки export: после `bun run build` запусти `bun run serve:export`, затем в другом терминале `bun run verify:hero`. Сервер публикует `out/` по `http://127.0.0.1:4174/redblue/`.
