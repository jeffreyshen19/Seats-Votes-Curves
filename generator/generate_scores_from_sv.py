import sys
import csv

# Gets details such as partisan bias, symmetry, and responsiveness from a seats votes curve and writes to a master csv

states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC", "ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

outputFile = open(sys.argv[1],"w")
inputFolder = sys.argv[2]

#python generator/generate_scores_from_sv.py data/seats-votes-scores/2016.csv data/seats-votes/2016

outputFile.write("state,gk_bias,symmetry\n")

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
    starting = 0

    symmetry = 0
    numNumbers = 0

    for lineStr in csv:

        if len(lineStr) > 0:
            line = lineStr.split(",")
            if line[0] != "votes":

                if float(line[0]) <= 50:
                    repLowerLimit = float(line[1])
                    starting = float(line[0])
                    demLowerLimit = float(line[2])
                if float(line[0]) >= 50 and repUpperLimit == 0 and demUpperLimit == 0:
                    repUpperLimit = float(line[1])
                    demUpperLimit = float(line[2])
                if float(line[0]) >= 45 and float(line[0]) <= 55:
                    symmetry += float(line[1]) - float(line[2])
                    numNumbers += 1

    symmetry = symmetry / numNumbers

    partisan_bias = ((repUpperLimit - repLowerLimit) * (50 - starting) + repLowerLimit) - ((demUpperLimit - demLowerLimit) * (50 - starting) + demLowerLimit)

    outputFile.write(state + "," + str(partisan_bias) + "," + str(symmetry) + "\n")

outputFile.close()
