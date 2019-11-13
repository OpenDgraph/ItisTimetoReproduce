#!/bin/sh

sh ./DefineSchema.sh
sleep 0.3

sh ./mutation.sh
sleep 0.3

sh ./query.sh
sleep 0.3