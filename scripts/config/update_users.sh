#!/bin/bash
sed -i "s/\<elastic\>/kibana/g" kibana/config/kibana.yml
sed -i "s/\<elastic\>/logstash_system/g" logstash/config/logstash.yml
