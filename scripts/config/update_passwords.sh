#!/bin/bash
sed -i "s/elastic:changeme/elastic:$1/g" extensions/curator/config/curator.yml
sed -i "s/changeme/$1/g" logstash/pipeline/logstash.conf
sed -i "s/changeme/$2/g" kibana/config/kibana.yml
sed -i "s/changeme/$3/g" logstash/config/logstash.yml