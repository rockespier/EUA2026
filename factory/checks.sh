#!/usr/bin/env bash
# The repo's checks. Exit 0 only when the branch is fit to review.
#
# The gate runs this script from the main checkout with the job's worktree as
# the working directory. Keep it fast, deterministic and non-interactive: no
# watch modes, no prompts, nothing that rewrites files.
#
# No automated test projects exist (see AGENTS.md): building both solutions
# (restore included) is the check.
set -euo pipefail

export DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1

dotnet build source/backend/BackAssistanceTravelers/BackAssistanceTravelers.sln -c Release -nologo -v q -clp:ErrorsOnly
dotnet build source/frontend/FrontAssistanceTravelers/FrontAssistanceTravelers.sln -c Release -nologo -v q -clp:ErrorsOnly
