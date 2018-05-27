import sys
import csv

# Converts the raw election results to results by state. Works for 2012-2016
# python generator/raw-election-results-to-results-by-state.py data/raw-election-results/2016.csv data/results-by-state/2016

outputFolder = sys.argv[2]
states = [{"name": "Alabama", "abbrev": "AL", "districts": []},{"name": "Alaska", "abbrev": "AK", "districts": []},{"name": "Arizona", "abbrev": "AZ", "districts": []},{"name": "Arkansas", "abbrev": "AR", "districts": []},{"name": "California", "abbrev": "CA", "districts": []},{"name": "Colorado", "abbrev": "CO", "districts": []},{"name": "Connecticut", "abbrev": "CT", "districts": []},{"name": "Delaware", "abbrev": "DE", "districts": []},{"name": "Florida", "abbrev": "FL", "districts": []},{"name": "Georgia", "abbrev": "GA", "districts": []},{"name": "Hawaii", "abbrev": "HI", "districts": []},{"name": "Idaho", "abbrev": "ID", "districts": []},{"name": "Illinois", "abbrev": "IL", "districts": []},{"name": "Indiana", "abbrev": "IN", "districts": []},{"name": "Iowa", "abbrev": "IA", "districts": []},{"name": "Kansas", "abbrev": "KS", "districts": []},{"name": "Kentucky", "abbrev": "KY", "districts": []},{"name": "Louisiana", "abbrev": "LA", "districts": []},{"name": "Maine", "abbrev": "ME", "districts": []},{"name": "Maryland", "abbrev": "MD", "districts": []},{"name": "Massachusetts", "abbrev": "MA", "districts": []},{"name": "Michigan", "abbrev": "MI", "districts": []},{"name": "Minnesota", "abbrev": "MN", "districts": []},{"name": "Mississippi", "abbrev": "MS", "districts": []},{"name": "Missouri", "abbrev": "MO", "districts": []},{"name": "Montana", "abbrev": "MT", "districts": []},{"name": "Nebraska", "abbrev": "NE", "districts": []},{"name": "Nevada", "abbrev": "NV", "districts": []},{"name": "New Hampshire", "abbrev": "NH", "districts": []},{"name": "New Jersey", "abbrev": "NJ", "districts": []},{"name": "New Mexico", "abbrev": "NM", "districts": []},{"name": "New York", "abbrev": "NY", "districts": []},{"name": "North Carolina", "abbrev": "NC", "districts": []},{"name": "North Dakota", "abbrev": "ND", "districts": []},{"name": "Ohio", "abbrev": "OH", "districts": []},{"name": "Oklahoma", "abbrev": "OK", "districts": []},{"name": "Oregon", "abbrev": "OR", "districts": []},{"name": "Pennsylvania", "abbrev": "PA", "districts": []},{"name": "Rhode Island", "abbrev": "RI", "districts": []},{"name": "South Carolina", "abbrev": "SC", "districts": []},{"name": "South Dakota", "abbrev": "SD", "districts": []},{"name": "Tennessee", "abbrev": "TN", "districts": []},{"name": "Texas", "abbrev": "TX", "districts": []},{"name": "Utah", "abbrev": "UT", "districts": []},{"name": "Vermont", "abbrev": "VT", "districts": []},{"name": "Virginia", "abbrev": "VA", "districts": []},{"name": "Washington", "abbrev": "WA", "districts": []},{"name": "West Virginia", "abbrev": "WV", "districts": []},{"name": "Wisconsin", "abbrev": "WI", "districts": []},{"name": "Wyoming", "abbrev": "WY", "districts": []}]

stateNum = 0
currentAbbrev = states[stateNum]["abbrev"]
districtNum = 1

def includes(str):
    for state in states:
        if str == state["abbrev"]:
            return True
    return False

rep = 0
dem = 0

with open(sys.argv[1], "rU") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        state = row["STATE ABBREVIATION"]
        district = row["D"]
        votes = row["GENERAL VOTES "]
        party = row["PARTY"]
        if len(state) > 0 and len(district) > 0 and len(votes) > 0 and len(party) > 0 and includes(state) and district.isdigit(): #Make sure row is actually for a general election candidate

            global rep
            global dem

            votes = votes.replace(",", "")

            district = int(district)

            if state != currentAbbrev: # Increment state
                states[stateNum]["districts"].append(str(rep) + "," + str(dem))
                stateNum += 1
                currentAbbrev = states[stateNum]["abbrev"]
                districtNum = district
                rep = 0
                dem = 0

            if district != districtNum: # Increment district
                districtNum += 1
                states[stateNum]["districts"].append(str(rep) + "," + str(dem))
                rep = 0
                dem = 0

            if votes == "Unopposed" or votes == "#":
                votes = -1

            if party == "R":
                rep += int(votes)
            elif party == "D":
                dem += int(votes)

states[49]["districts"].append(str(rep) + "," + str(dem))

# Set uncontested districts as 75% and 25%
for state in states:
    for i in range(0, len(state["districts"])):
        votingResults = state["districts"][i].split(",")
        if int(votingResults[0]) == -1 and int(votingResults[1]) == 0:
            state["districts"][i] = "75,25"
        elif int(votingResults[0]) == 0 and int(votingResults[1]) == -1:
            state["districts"][i] = "25,75"
        elif int(votingResults[0]) == 0:
            state["districts"][i] = str(int(votingResults[1]) / 3) + "," + votingResults[1]
        elif int(votingResults[1]) == 0:
            state["districts"][i] = votingResults[0] + "," + str(int(votingResults[0]) / 3)

# Push to individual folder
for state in states:
    outputFile = open(outputFolder + "/" + state["abbrev"] + ".csv","w")
    for district in state["districts"]:
        outputFile.write(district + "\n")
    outputFile.close()
