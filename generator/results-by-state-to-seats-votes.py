import sys
import os

# Executes uniform partisan swing algorithm to generate seat votes in bulk
# python generator/results-by-state-to-seats-votes.py data/results-by-state/2016 data/seats-votes/2016

states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC", "ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

for state in states:
    os.system("generator/uniform_partisan_swing.py " + sys.argv[1] + "/" + state + ".csv " + sys.argv[2] + "/" + state)
