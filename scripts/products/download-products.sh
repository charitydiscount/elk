#!/bin/bash

TMP_LOCATION=/srv/cd-data-platform/tmp
PRODUCTS_LOCATION=/srv/cd-data-platform/products
LOG_LOCATION=/srv/cd-data-platform/logs

move_csvs() {
  mv -f "$TMP_LOCATION/feed-"*".csv" "$PRODUCTS_LOCATION/"
}

move_altex_csvs() {
  mv -f "$TMP_LOCATION/altex-"*".csv" "$PRODUCTS_LOCATION/"
}

download_products_from_feed() {
  now=$(date +%Y-%m-%d)

  exec > >(tee -i -a $LOG_LOCATION/products-$now.log)
  exec 2>&1

  echo "Downloading feed $1"
  curl -L -f -o "$TMP_LOCATION/feed-$1-$now.csv" "https://api.2performant.com/feed/$1.csv"
}

download_products_from_altex() {
  now=$(date +%Y-%m-%d)

  exec > >(tee -i -a $LOG_LOCATION/products-$now.log)
  exec 2>&1

  echo "Downloading altex feed"
  curl -L -f -o "$TMP_LOCATION/altex-$now.csv" "http://afiliere.altex.ro/ProductFeed?ent=k8ii6jjNSMfuFVB6gZmhmw%253d%253d"
  python3 /srv/cd-data-platform/scripts/altex-parser.py "$TMP_LOCATION/altex-$now.csv"
}

download_products_from_feed 28d491fd8

# Give the 2p API a short break
sleep 3m
download_products_from_feed 19516305a

sleep 3m
download_products_from_feed 4bfae515c

sleep 3m
download_products_from_feed 15f6233df

sleep 3m
download_products_from_feed daf9a7716

sleep 3m
download_products_from_feed 6ccd039c1

sleep 3m
download_products_from_feed 66a5ade6c

sleep 3m
download_products_from_feed 60d512f11

move_csvs

download_products_from_altex

move_altex_csvs
