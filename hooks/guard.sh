#!/usr/bin/env bash
data_dir="$1"
payload="$(cat | tr '\n' ' ')"
run_active=0
[ -n "$data_dir" ] && [ -f "$data_dir/active-run" ] && run_active=1
[ -n "$data_dir" ] && [ -n "$(ls -A "$data_dir/active-runs" 2>/dev/null)" ] && run_active=1

block() {
  echo "agents-know hard stop: $1. This is never done automatically; stop and ask the user." >&2
  exit 2
}

matches() {
  printf '%s' "$payload" | grep -Eiq "$1"
}

payload="$(printf '%s' "$payload" | sed -E 's/feed\.sh(\\")?[[:space:]]+[^[:space:]]+[[:space:]]+[^[:space:]]+[[:space:]]+\\"([^\\]|\\[^"])*\\"/feed.sh/g')"

agent="$(printf '%s' "$payload" | grep -Eo '"agent_type" *: *"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"$/\1/; s/^agents-know://')"
readonly_agent=0
case "$agent" in
  qa-engineer|security-engineer|staff-reviewer|bar-raiser|skeptic|ip-guard|accessibility-specialist|performance-engineer|mentor|dispatcher) readonly_agent=1 ;;
esac

tool="$(printf '%s' "$payload" | grep -Eo '"tool_name" *: *"[A-Za-z]+"' | head -1 | sed -E 's/.*"([A-Za-z]+)"$/\1/')"

if [ "$tool" = "Bash" ]; then
  matches '(drop|truncate)[[:space:]]+(table|database|schema|index|view|column)|drop[[:space:]]+(database|schema)' && block "destructive SQL (DROP/TRUNCATE)"
  matches 'delete[[:space:]]+from|alter[[:space:]]+table[^"]*drop|update[[:space:]]+[a-z_."]+[[:space:]]+set' && block "data-changing SQL against a database"
  matches '(^|[^a-z])(dropdb|dropuser|pg_restore[^"]*--clean|flushall|flushdb)([^a-z]|$)' && block "database deletion command"
  matches '(psql|pg_dump|mysql|mongosh|mongo|redis-cli)[^"]*(-h|--host|@)[[:space:]=]*[^l"[:space:]][^"[:space:]]*' && ! matches '(-h|--host)[[:space:]=]*(localhost|127\.0\.0\.1)|@(localhost|127\.0\.0\.1)' && block "connecting a database client to a non-local host"
  matches 'docker[^"]*(volume[[:space:]]+(rm|prune)|system[[:space:]]+prune|compose[^"]*down[^"]*(-v|--volumes))' && block "deleting docker volumes"
  matches 'kubectl[^"]*(delete|drain|scale[^"]*--replicas[= ]*0)|helm[[:space:]]+(uninstall|delete)|terraform[[:space:]]+destroy' && block "deleting infrastructure"
  matches 'git[[:space:]]+push[^"]*(--force|-f([[:space:]]|$)|--delete)|git[[:space:]]+branch[^"]*-D' && block "force push or branch deletion"
  # Every target of every forced or recursive rm must be a build artefact; one bad target blocks.
  set -f
  while IFS= read -r segment; do
    [ -z "$segment" ] && continue
    for target in $segment; do
      case "$target" in rm|-*) continue ;; esac
      case "$target" in *..*) block "recursive or forced delete outside build artefacts" ;; esac
      base="${target%/}"; base="${base##*/}"
      case "$base" in node_modules|dist|build|coverage|__pycache__|.pytest_cache) continue ;; esac
      case "$target" in /tmp/?*|*/.agents-know/runs/?*) continue ;; esac
      block "recursive or forced delete outside build artefacts"
    done
  done <<EOF
$(printf '%s' "$payload" | grep -Eo '(^|[^a-z])rm[[:space:]]+(-[a-z]*[[:space:]]+)*-[a-z]*[rf][a-z]*[[:space:]]+[^";&|)]*' | sed -E 's/^[^r]*rm/rm/')
EOF
  matches '(cat|less|more|head|tail|grep|cp|scp|curl)[^"]*\.env([^.a-z]|$)' && ! matches '\.env\.example' && block "reading or moving a .env file with secrets"

  if [ "$readonly_agent" = 1 ]; then
    matches '(sed|perl)[[:space:]]+(-[a-z]*i|-pi)|git[[:space:]]+(apply|am|checkout[[:space:]]+[^-])|(^|[^a-z])patch[[:space:]]+-' && block "verifier agents report findings and do not change product code"
  fi

  if [ "$run_active" = 1 ]; then
    matches 'git[[:space:]]+(commit|push)' && block "commits and pushes are left to the user"
    matches 'git[[:space:]]+(reset[[:space:]]+--hard|clean[[:space:]]+-[a-z]*f|checkout[[:space:]]+--[[:space:]]+\.|restore[[:space:]]+\.)' && block "this discards work in the working tree"
    matches 'alembic[[:space:]]+(upgrade|downgrade|stamp)|prisma[[:space:]]+migrate[[:space:]]+(deploy|reset)|manage\.py[[:space:]]+migrate' && block "migrations are run by the user"
    matches '(yarn[[:space:]]+add|pnpm[[:space:]]+add|npm[[:space:]]+(install|i)[[:space:]]+[a-z@]|uv[[:space:]]+add|pip[[:space:]]+install|poetry[[:space:]]+add)' && block "adding a dependency needs approval"
  fi
  exit 0
fi

case "$tool" in
  Read|Edit|Write|MultiEdit|NotebookEdit)
    matches '"file_path" *: *"[^"]*/\.env(\.[a-z]+)?"' && ! matches '"file_path" *: *"[^"]*\.env\.example"' && block "reading or editing a .env file with secrets"
    if [ "$readonly_agent" = 1 ] && [ "$tool" != "Read" ] && ! matches '"file_path" *: *"[^"]*/\.agents-know/runs/' && ! matches '"file_path" *: *"[^"]*(/tests?/|/__tests__/|\.test\.|\.spec\.|/test_[^/"]*\.py)'; then
      block "verifier agents write only reports and tests, not product code"
    fi
    if [ "$tool" != "Read" ] && ! matches '"file_path" *: *"[^"]*/\.agents-know/runs/' && ! matches '"file_path" *: *"[^"]*\.(md|mdx|rst|txt)"'; then
      payload="${payload%%def downgrade*}"
      matches 'op\.(drop_table|drop_column|drop_index|drop_constraint|rename_table|rename_column)|(drop|truncate)[[:space:]]+(table|column|schema|database|index|constraint)|delete[[:space:]]+from' && block "destructive migration or SQL in code (drop, truncate, delete)"
    fi
    ;;
esac

exit 0
