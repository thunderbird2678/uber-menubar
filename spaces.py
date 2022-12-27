import os
import json

stream = os.popen(
    '/opt/homebrew/bin/yabai -m query --spaces')
output = json.loads(stream.read())

# get number of spaces
numSpaces = len(output)
# print("there are " + str(numSpaces) + " spaces")

# get active space
activeSpace = 0  # default
for index, space in enumerate(output):
    if (space["has-focus"] == True):
        activeSpace = index

# print("the active space is space " + str(activeSpace))

print(str(numSpaces) + " " + str(activeSpace))
