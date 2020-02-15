#!/bin/bash
DEPLOY_INSTRUCTIONS=/opt/codedeploy-agent/deployment-root/deployment-instructions/
DEPLOY_ROOT=/opt/codedeploy-agent/deployment-root/
killall node
cd /home/ubuntu/raccoon-city-graphql
yarn run stop:forever
cd /home/ubuntu
rm -rf /home/ubuntu/raccoon-city-graphql

for d in ${DEPLOY_ROOT}*; do
[[ -d $d && "${d##*/}" != "deployment-instructions" ]] || continue
    for f in $d/*; do
    [[ -e $f && "$f" != $(cat ${DEPLOY_INSTRUCTIONS}${d##*/}_last_successful_install) ]] || continue
    if [[ $f == ${DEPLOY_ROOT}* ]]
    then
      $(rm -rf $f)
    fi
    done
done
