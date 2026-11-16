#!/usr/bin/env bash
action="$1"; data_dir="$2"; run_dir="${3%/}"
registry="$data_dir/active-runs"
runs_root="$HOME/.agents-know/runs"
mkdir -p "$registry"

case "$action" in
  start)
    [ -d "$run_dir" ] || { echo "no run directory: $run_dir" >&2; exit 1; }
    id="$(basename "$run_dir")"
    printf '%s\n' "$run_dir" > "$registry/$id"
    ln -sfn "$run_dir" "$runs_root/latest"
    echo "active: $id"
    ;;
  stop)
    id="$(basename "$run_dir")"
    rm -f "$registry/$id"
    if [ -f "$data_dir/active-run" ] && [ "$(cat "$data_dir/active-run")" = "$run_dir" ]; then
      rm -f "$data_dir/active-run"
    fi
    if [ "$(readlink "$runs_root/latest" 2>/dev/null)" = "$run_dir" ]; then
      next="$(ls -t "$registry" 2>/dev/null | head -1)"
      [ -n "$next" ] && ln -sfn "$(cat "$registry/$next")" "$runs_root/latest"
    fi
    echo "stopped: $id"
    ;;
  list)
    found=0
    for f in "$registry"/*; do
      [ -f "$f" ] || continue
      found=1; printf '%s\t%s\n' "$(basename "$f")" "$(cat "$f")"
    done
    [ -f "$data_dir/active-run" ] && found=1 && printf 'legacy\t%s\n' "$(cat "$data_dir/active-run")"
    [ "$found" = 1 ] || echo "no active runs"
    ;;
  *)
    echo "usage: run.sh start|stop|list <plugin-data-dir> [run-dir]" >&2; exit 1
    ;;
esac
