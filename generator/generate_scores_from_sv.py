import sys
import csv

# Gets details such as partisan bias, symmetry, and responsiveness from a seats votes curve and writes to a master csv

states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC", "ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

outputFile = open(sys.argv[1],"w")
inputFolder = sys.argv[2]

#python generator/generate_scores_from_sv.py data/seats-votes-scores/2016.csv data/seats-votes/2016

outputFile.write("state,gk_bias\n")

repLowerLimit = 0
demLowerLimit = 0
repUpperLimit = 0
demUpperLimit = 0

for state in states:
    inputFile = open(inputFolder + "/" + state + ".csv", "r")
    csv = inputFile.read().split("\n")
    repAtFifty = 0
    demAtFifty = 0

    global repLowerLimit
    global demLowerLimit
    global repUpperLimit
    global demUpperLimit

    repLowerLimit = 0
    demLowerLimit = 0
    repUpperLimit = 0
    demUpperLimit = 0
    repStarting = 0
    demStarting = 0

    for lineStr in csv:

        if len(lineStr) > 0:
            line = lineStr.split(",")
            if line[0] != "votesR":

                if float(line[0]) <= 50:
                    repLowerLimit = float(line[1])
                    repStarting = float(line[0])
                if float(line[0]) >= 50 and repUpperLimit == 0:
                    repUpperLimit = float(line[1])
                if float(line[2]) <= 50:
                    demLowerLimit = float(line[3])
                    demStarting = float(line[2])
                if float(line[2]) >= 50 and demUpperLimit == 0:
                    demUpperLimit = float(line[3])

    partisan_bias = ((repUpperLimit - repLowerLimit) * (50 - repStarting) + repLowerLimit) - ((demUpperLimit - demLowerLimit) * (50 - demStarting) + demLowerLimit)

    outputFile.write(state + "," + str(partisan_bias) + "\n")

outputFile.close()
