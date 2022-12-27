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

# using the above variables, print the output in json format using printf
printf '{"date_day":"%s","date_month":"%s","date_day_num":"%s","date_year":"%s","date_time":"%s","ssid":"%s","cpu_usage":"%s","mem_usage":"%s","volume":"%s","spotify_status":"%s","spotify_artist":"%s","spotify_song":"%s"}' "$DATE_DAY" "$DATE_MONTH" "$DATE_DAY_NUM" "$DATE_YEAR" "$DATE_TIME" "$SSID" "$CPU_USAGE" "$MEM_USAGE" "$VOLUME" "$SPOTIFY_STATUS" "$SPOTIFY_ARTIST" "$SPOTIFY_SONG"