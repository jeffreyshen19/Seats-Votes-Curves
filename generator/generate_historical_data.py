import sys
import csv

# Gets historical trends from seats votes curve
#python generator/generate_historical_data.py

states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC", "ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

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
    outputFile = open("data/historical-results/gk/" + state + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["gk_bias"] + "\n")
    outputFile.close()

    # Generate symmetry
    outputFile = open("data/historical-results/symmetry/" + state + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["symmetry"] + "\n")
    outputFile.close()

    # Generate responsiveness
    outputFile = open("data/historical-results/responsiveness/" + state + ".csv","w")
    outputFile.write("year,y\n")
    for year in years:
        inputFile = inputFiles[0]
        i = 0
        while inputFile["year"] != year:
            i += 1
            inputFile = inputFiles[i]
        i = 0
        abbrev = inputFile["data"][0]["state"]
        while abbrev != state:
            i += 1
            abbrev = inputFile["data"][i]["state"]
        outputFile.write(year + "," + inputFile["data"][i]["responsiveness"] + "\n")
    outputFile.close()

# Calculate statistics for entire country
# outputFile = open("data/historical-results/gk/us.csv","w")
# outputFile.write("year,y\n")
# for year in years:
#     average = 0
#     for state in states:
#
#     inputFile = inputFiles[0]
#     i = 0
#     while inputFile["year"] != year:
#         i += 1
#         inputFile = inputFiles[i]
#     i = 0
#     abbrev = inputFile["data"][0]["state"]
#     while abbrev != state:
#         i += 1
#         abbrev = inputFile["data"][i]["state"]
#     outputFile.write(year + "," + inputFile["data"][i]["responsiveness"] + "\n")
# outputFile.close()
