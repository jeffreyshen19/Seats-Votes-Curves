import sys
import csv

# Gets historical trends from seats votes curve
#python generator/generate_historical_data.py

states = [{"name": "Alabama", "abbrev": "AL", "numDistricts": 7},{"name": "Alaska", "abbrev": "AK", "numDistricts": 1},{"name": "Arizona", "abbrev": "AZ", "numDistricts": 9},{"name": "Arkansas", "abbrev": "AR", "numDistricts": 4},{"name": "California", "abbrev": "CA", "numDistricts": 53},{"name": "Colorado", "abbrev": "CO", "numDistricts": 7},{"name": "Connecticut", "abbrev": "CT", "numDistricts": 5},{"name": "Delaware", "abbrev": "DE", "numDistricts": 1},{"name": "Florida", "abbrev": "FL", "numDistricts": 27},{"name": "Georgia", "abbrev": "GA", "numDistricts": 14},{"name": "Hawaii", "abbrev": "HI", "numDistricts": 1},{"name": "Idaho", "abbrev": "ID", "numDistricts": 2},{"name": "Illinois", "abbrev": "IL", "numDistricts": 18},{"name": "Indiana", "abbrev": "IN", "numDistricts": 9},{"name": "Iowa", "abbrev": "IA", "numDistricts": 4},{"name": "Kansas", "abbrev": "KS", "numDistricts": 4},{"name": "Kentucky", "abbrev": "KY", "numDistricts": 5},{"name": "Louisiana", "abbrev": "LA", "numDistricts": 6},{"name": "Maine", "abbrev": "ME", "numDistricts": 2},{"name": "Maryland", "abbrev": "MD", "numDistricts": 8},{"name": "Massachusetts", "abbrev": "MA", "numDistricts": 9},{"name": "Michigan", "abbrev": "MI", "numDistricts": 14},{"name": "Minnesota", "abbrev": "MN", "numDistricts": 8},{"name": "Mississippi", "abbrev": "MS", "numDistricts": 4},{"name": "Missouri", "abbrev": "MO", "numDistricts": 8},{"name": "Montana", "abbrev": "MT", "numDistricts": 1},{"name": "Nebraska", "abbrev": "NE", "numDistricts": 3},{"name": "Nevada", "abbrev": "NV", "numDistricts": 4},{"name": "New Hampshire", "abbrev": "NH", "numDistricts": 2},{"name": "New Jersey", "abbrev": "NJ", "numDistricts": 12},{"name": "New Mexico", "abbrev": "NM", "numDistricts": 3},{"name": "New York", "abbrev": "NY", "numDistricts": 27},{"name": "North Carolina", "abbrev": "NC", "numDistricts": 13},{"name": "North Dakota", "abbrev": "ND", "numDistricts": 1},{"name": "Ohio", "abbrev": "OH", "numDistricts": 16},{"name": "Oklahoma", "abbrev": "OK", "numDistricts": 5},{"name": "Oregon", "abbrev": "OR", "numDistricts": 5},{"name": "Pennsylvania", "abbrev": "PA", "numDistricts": 18},{"name": "Rhode Island", "abbrev": "RI", "numDistricts": 2},{"name": "South Carolina", "abbrev": "SC", "numDistricts": 17},{"name": "South Dakota", "abbrev": "SD", "numDistricts": 1},{"name": "Tennessee", "abbrev": "TN", "numDistricts": 9},{"name": "Texas", "abbrev": "TX", "numDistricts": 36},{"name": "Utah", "abbrev": "UT", "numDistricts": 4},{"name": "Vermont", "abbrev": "VT", "numDistricts": 1},{"name": "Virginia", "abbrev": "VA", "numDistricts": 11},{"name": "Washington", "abbrev": "WA", "numDistricts": 10},{"name": "West Virginia", "abbrev": "WV", "numDistricts": 3},{"name": "Wisconsin", "abbrev": "WI", "numDistricts": 8},{"name": "Wyoming", "abbrev": "WY", "numDistricts": 1}]

years = ["2000","2002","2004","2008","2010","2012","2014","2016"] # Ignoring 2006 for now
inputFiles = []

for year in years:
    with open("data/seats-votes-scores/" + year + ".csv", "rU") as csvfile:
        reader = csv.DictReader(csvfile)
        data = []
        for row in reader:
            data.append(row)
        inputFiles.append({"year": year, "data": data})

for state in states:
    # Generate partisan bias
    outputFile = open("data/historical-results/gk/" + state["name"] + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state["abbrev"]:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["gk_bias"] + "\n")
    outputFile.close()

    # Generate symmetry
    outputFile = open("data/historical-results/symmetry/" + state["name"] + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state["abbrev"]:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["symmetry"] + "\n")
    outputFile.close()

    # Generate responsiveness
    outputFile = open("data/historical-results/responsiveness/" + state["name"] + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state["abbrev"]:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["responsiveness"] + "\n")
    outputFile.close()


## Results for US as a whole
outputFile = open("data/historical-results/gk/us.csv","w")
outputFile.write("year,y\n")
for year in years:
    inputFile = inputFiles[0]
    i = 0
    while inputFile["year"] != year:
        i += 1
        inputFile = inputFiles[i]

    gkAv = 0
    numElements = 0

    for i in range(0, len(states)):
        if states[i]["numDistricts"] > 4:
            gkAv += float(inputFile["data"][i]["gk_bias"])
            numElements += 1

    gkAv /= numElements

    outputFile.write(year + "," + str(gkAv) + "\n")

outputFile = open("data/historical-results/responsiveness/us.csv","w")
outputFile.write("year,y\n")
for year in years:
    inputFile = inputFiles[0]
    i = 0
    while inputFile["year"] != year:
        i += 1
        inputFile = inputFiles[i]

    responsiveAv = 0
    numElements = 0

    for i in range(0, len(states)):
        if states[i]["numDistricts"] > 4:
            responsiveAv += float(inputFile["data"][i]["responsiveness"])
            numElements += 1

    responsiveAv /= numElements

    outputFile.write(year + "," + str(responsiveAv) + "\n")

outputFile = open("data/historical-results/symmetry/us.csv","w")
outputFile.write("year,y\n")
for year in years:
    inputFile = inputFiles[0]
    i = 0
    while inputFile["year"] != year:
        i += 1
        inputFile = inputFiles[i]

    symmetryAv = 0
    numElements = 0

    for i in range(0, len(states)):
        if states[i]["numDistricts"] > 4:
            symmetryAv += float(inputFile["data"][i]["symmetry"])
            numElements += 1

    symmetryAv /= numElements

    outputFile.write(year + "," + str(symmetryAv) + "\n")
