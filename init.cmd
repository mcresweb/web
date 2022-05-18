@echo off
title "init - MCRESWEB"

::install
cmd /c npm i

::build
cmd /c npm run build
