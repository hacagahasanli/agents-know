#!/usr/bin/env bash
run_dir="$1"
agent="$2"
shift 2
[ -d "$run_dir" ] || exit 0
printf '%s  %-24s %s\n' "$(date '+%H:%M:%S')" "$agent" "$*" >> "$run_dir/feed.md"
