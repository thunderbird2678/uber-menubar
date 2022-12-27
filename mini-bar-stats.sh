#!/bin/zsh

export TZ=$1
DISK=$2
_DATE=$(date "+%a %b %d %Y %H:%M")
DATE_DAY=$(echo $_DATE | awk '{print $1}')
DATE_MONTH=$(echo $_DATE | awk '{print $2}')
DATE_DAY_NUM=$(echo $_DATE | awk '{print $3}')
DATE_YEAR=$(echo $_DATE | awk '{print $4}')
DATE_TIME=$(echo $_DATE | awk '{print $5}')
SSID=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk -F:  '($1 ~ "^ *SSID$"){print $2}' | cut -c 2-)
# get idle cpu usage
IDLE=$(top -l 1| grep "CPU usage" | awk '{print $7}' | cut -d% -f1)
CPU_USAGE=$((100 - $IDLE))
_MAX_MEMORY=$(sysctl hw.memsize | awk '{print $2}')
_PAGE_SIZE=$(vm_stat | grep "page size of" | awk '{print $8}')
_MEM_USED=$(vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/.$//')
MEM_USAGE=$(echo "scale=2; $_MEM_USED * $_PAGE_SIZE / $_MAX_MEMORY * 100" | bc)
# get volume level
VOLUME=$(osascript -e 'get volume settings' | grep -o "output volume:\d*" | grep -o "\d*")
# spotify stuff
SPOTIFY_STATUS=$(osascript -e 'tell application "Spotify" to player state')
SPOTIFY_ARTIST=$(osascript -e 'tell application "Spotify" to artist of current track')
SPOTIFY_SONG=$(osascript -e 'tell application "Spotify" to name of current track')
# get battery information
BATTERY_LEVEL=$(pmset -g batt | grep -o "\d*%" | grep -o "\d*")
BATTERY_STATUS=$(pmset -g batt | grep -o  "; [a-zA-Z]*;" | grep -o "[a-zA-Z]*")

printf -v output '{"date_day":"%s",'            "$DATE_DAY"
printf -v output '"%s\n"date_month":"%s",'      "$output"   "$DATE_MONTH"
printf -v output '"%s\n"date_day_num":"%s",'    "$output"   "$DATE_DAY_NUM"
printf -v output '"%s\n"date_year":"%s",'       "$output"   "$DATE_YEAR"
printf -v output '"%s\n"date_time":"%s",'       "$output"   "$DATE_TIME"
printf -v output '"%s\n"ssid":"%s",'            "$output"   "$SSID"
printf -v output '"%s\n"cpu_usage":"%s",'       "$output"   "$CPU_USAGE"
printf -v output '"%s\n"mem_usage":"%s",'       "$output"   "$MEM_USAGE"
printf -v output '"%s\n"volume":"%s",'          "$output"   "$VOLUME"
printf -v output '"%s\n"batt_level":"%s",'      "$output"   "$BATTERY_LEVEL"
printf -v output '"%s\n"batt_status":"%s",'     "$output"   "$BATTERY_STATUS"
printf -v output '"%s\n"spotify_status":"%s",'  "$output"   "$SPOTIFY_STATUS"
printf -v output '"%s\n"spotify_artist":"%s",'  "$output"   "$SPOTIFY_ARTIST"
printf -v output '"%s\n"spotify_song":"%s"},'   "$output"   "$SPOTIFY_SONG"

printf "%s" "$output"