#!/bin/bash
echo "Running Diagnostics..."
git status > git_status.log 2>&1
git log -n 5 > git_log.log 2>&1
git remote -v > git_remote.log 2>&1
git branch > git_branch.log 2>&1
echo "Diagnostics Complete"
