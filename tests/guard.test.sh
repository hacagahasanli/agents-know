#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
guard="hooks/guard.sh"
data="$(mktemp -d)"
pass=0
fail=0

bash_payload() { printf '{"tool_name":"Bash","tool_input":{"command":"%s"}%s}' "$1" "${2:+,\"agent_type\":\"$2\"}"; }
file_payload() { printf '{"tool_name":"%s","tool_input":{"file_path":"%s","content":"%s"}%s}' "$1" "$2" "$3" "${4:+,\"agent_type\":\"$4\"}"; }

check() {
  expected="$1"; name="$2"; payload="$3"
  printf '%s' "$payload" | bash "$guard" "$data" >/dev/null 2>&1
  code=$?
  if { [ "$expected" = block ] && [ "$code" = 2 ]; } || { [ "$expected" = allow ] && [ "$code" = 0 ]; }; then
    pass=$((pass + 1))
  else
    fail=$((fail + 1)); echo "FAIL ($expected, got $code): $name"
  fi
}

check block "drop table" "$(bash_payload 'psql -c \"DROP TABLE users\"')"
check block "truncate" "$(bash_payload 'psql -c \"truncate table messages\"')"
check block "delete from" "$(bash_payload 'psql -c \"DELETE FROM messages\"')"
check block "bulk update" "$(bash_payload 'psql -c \"UPDATE users SET active=false\"')"
check block "remote psql" "$(bash_payload 'psql -h db.prod.example.com appdb')"
check allow "local psql" "$(bash_payload 'psql -h localhost appdb_test -c \"select 1\"')"
check block "dropdb" "$(bash_payload 'dropdb appdb')"
check block "docker volumes" "$(bash_payload 'docker compose down -v')"
check block "terraform destroy" "$(bash_payload 'terraform destroy')"
check block "force push" "$(bash_payload 'git push --force origin main')"
check block "rm -rf src" "$(bash_payload 'rm -rf src')"
check allow "rm -rf node_modules" "$(bash_payload 'rm -rf node_modules')"
check allow "rm -rf two build dirs" "$(bash_payload 'rm -rf dist coverage && npm run build')"
check block "rm -rf with build word chained after" "$(bash_payload 'rm -rf src ; echo build')"
check block "rm -rf mixes build and source" "$(bash_payload 'rm -rf dist src')"
check block "rm -rf source dir named like build" "$(bash_payload 'rm -rf src/build-tools/../..')"
check block "rm -rf glob" "$(bash_payload 'rm -rf *')"
check block "rm -rf home" "$(bash_payload 'rm -rf ~')"
check block "second rm in chain" "$(bash_payload 'rm -rf dist && rm -rf src')"
check block "cat .env" "$(bash_payload 'cat backend/.env')"
check allow "cat .env.example" "$(bash_payload 'cat backend/.env.example')"
check allow "feed line mentioning DROP" "$(bash_payload '\"/p/scripts/feed.sh\" /r qa \"checked DROP TABLE guard\"')"
check allow "pytest" "$(bash_payload 'pytest tests/messaging -q')"
check block "read .env file" "$(file_payload Read /repo/backend/.env '')"
check block "drop_column in migration" "$(file_payload Write /repo/alembic/versions/x.py 'op.drop_column(\"m\",\"body\")')"
check allow "drop in downgrade only" "$(file_payload Write /repo/alembic/versions/x.py 'op.add_column(1)\ndef downgrade():\n op.drop_column(1)')"
check block "drop index via execute" "$(file_payload Edit /repo/alembic/versions/x.py 'op.execute(\"DROP INDEX ix\")')"
check allow "run dir notes" "$(file_payload Write /home/u/.agents-know/runs/x/verify/qa.md 'DROP TABLE was blocked')"
sql_kw="DR""OP TABLE users"
check allow "docs may mention destructive SQL" "$(file_payload Write /repo/README.md "Blocks $sql_kw")"
check block "sql file with destructive SQL" "$(file_payload Write /repo/db/patch.sql "$sql_kw")"
check block "verifier edits product code" "$(file_payload Write /repo/src/app.ts 'x' agents-know:qa-engineer)"
check allow "verifier writes a test" "$(file_payload Write /repo/tests/messaging/test_access.py 'x' agents-know:security-engineer)"
check allow "verifier writes a report" "$(file_payload Write /home/u/.agents-know/runs/x/verify/qa-report.md 'x' qa-engineer)"
check block "verifier sed -i" "$(bash_payload 'sed -i s/a/b/ src/app.ts' agents-know:staff-reviewer)"
check block "bar-raiser edits product code" "$(file_payload Write /repo/src/app.ts 'x' agents-know:bar-raiser)"
check block "skeptic edits product code" "$(file_payload Edit /repo/src/app.ts 'x' agents-know:skeptic)"
check block "skeptic sed -i" "$(bash_payload 'sed -i s/a/b/ src/app.ts' agents-know:skeptic)"
check allow "skeptic writes a report" "$(file_payload Write /home/u/.agents-know/runs/x/verify/skeptic-qa-1.md 'x' agents-know:skeptic)"
check allow "bar-raiser writes a review" "$(file_payload Write /home/u/.agents-know/runs/x/review/bar-qa-1.md 'x' bar-raiser)"
check block "dispatcher edits product code" "$(file_payload Write /repo/src/app.ts 'x' agents-know:dispatcher)"
check allow "dispatcher writes its plan" "$(file_payload Write /home/u/.agents-know/runs/x/plan/dispatch-build.md 'x' agents-know:dispatcher)"
check block "team-reviewer edits an agent file" "$(file_payload Edit /repo/agents/skeptic.md 'x' agents-know:team-reviewer)"
check allow "team-reviewer writes the scorecard" "$(file_payload Write /home/u/.agents-know/team/SCORECARD.md 'x' agents-know:team-reviewer)"
check block "talent-scout installs an agent" "$(file_payload Write /home/u/.claude/agents/new-role.md 'x' agents-know:talent-scout)"
check allow "talent-scout writes a candidate" "$(file_payload Write /home/u/.agents-know/team/candidates/new-role.md 'x' agents-know:talent-scout)"
check block "talent-scout sed -i" "$(bash_payload 'sed -i s/a/b/ agents/skeptic.md' agents-know:talent-scout)"
check allow "engineer writes product code" "$(file_payload Write /repo/src/app.ts 'x' agents-know:frontend-engineer)"

mkdir -p "$data/active-runs"
printf '/r/fix-a\n' > "$data/active-runs/fix-a"
check block "commit during registered run"  "$(bash_payload 'git commit -m x')"
rm -f "$data/active-runs/fix-a"
check allow "commit after the only run stopped" "$(bash_payload 'git commit -m x')"

touch "$data/active-run"
check block "commit during run" "$(bash_payload 'git commit -m x')"
check block "alembic upgrade during run" "$(bash_payload 'alembic upgrade head')"
check block "package add during run" "$(bash_payload 'pnpm add left-pad')"
check allow "git status during run" "$(bash_payload 'git status')"

rm -rf "$data"
echo "guard: $pass passed, $fail failed"
[ "$fail" = 0 ]
