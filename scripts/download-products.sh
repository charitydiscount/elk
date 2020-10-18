#!/bin/bash

TMP_LOCATION=/home/andrei/tmp
PRODUCTS_LOCATION=/home/andrei/products
LOG_LOCATION=/home/andrei/logs

update_csv_permissions() {
  find $PRODUCTS_LOCATION -type f -name "*.csv" -exec chmod 775 {} \;
  find $PRODUCTS_LOCATION -type f -name "*.csv" -exec chown andrei {} \;
}

move_csvs() {
  mv -f "$TMP_LOCATION/feed-"*".csv" "$PRODUCTS_LOCATION/"
  update_csv_permissions
}

download_products_from_feed() {
  now=$(date +%Y-%m-%d)

  exec > >(tee -i -a $LOG_LOCATION/products-$now.log)
  exec 2>&1

  echo "Downloading feed $1"
  curl -L -f -o "$TMP_LOCATION/feed-$1-$now.csv" "https://api.2performant.com/feed/$1.csv"
}

download_products_from_feed 28d491fd8

# Give the 2p API a short break
sleep 5m
download_products_from_feed 19516305a

sleep 5m
download_products_from_feed 4bfae515c

sleep 5m
download_products_from_feed 15f6233df

sleep 5m
download_products_from_feed daf9a7716

move_csvs
