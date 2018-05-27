#!/usr/bin/python
import sys
import random

# Seats-votes curve generator
# Done using uniform partisan swing

inputFile = open(sys.argv[1],"r")
outputFile = open(sys.argv[2] + ".csv","w")
csv = inputFile.read().split("\n")

votingByDistrict = []
seatsVotesRep = []
seatsVotesDem = []

SWING_CONST = 0.01 #Percentage to increase each district by

totalVotes = 0
totalDemVotes = 0
totalRepVotes = 0

# Read all district data
for lineStr in csv:
    if len(lineStr) > 0:
        line = lineStr.split(",")
        rep = int(line[0])
        dem = int(line[1])
        total = rep + dem

        totalVotes += total
        totalDemVotes += dem
        totalRepVotes += rep
        percentRep = float(rep) / total

        votingByDistrict.append({"percentRep": percentRep, "percentDem": 1.0 - percentRep})

repVoteShare = float(totalRepVotes) / totalVotes
demVoteShare = float(totalDemVotes) / totalVotes

diff = (((100 * repVoteShare) % 1) - ((100 * demVoteShare) % 1)) / 100 #

# Generate curve
i = repVoteShare
counter = 0
while i <= 1:
    totalRepSeats = 0
    totalDemSeats = 0
    for j in range(0,1000): #simulate 1000 elections

        districtOverflowedRep = [False] * len(votingByDistrict);
        districtOverflowedDem = [False] * len(votingByDistrict);
        excessDem = 0
        excessRep = 0
        updatedValsRep = [0] * len(votingByDistrict);
        updatedValsDem = [0] * len(votingByDistrict);

        for k, district in enumerate(votingByDistrict):
            updatedValsRep[k] = district["percentRep"] + counter * SWING_CONST + SWING_CONST * random.randint(-5, 5)
            updatedValsDem[k] = 1 - updatedValsRep[k] + diff

            if updatedValsRep[k] > 1:
                excessRep += 1
                districtOverflowedRep[k] = True

            if updatedValsDem[k] < 0:
                excessDem += 1
                districtOverflowedDem[k] = True

        for k, district in enumerate(votingByDistrict):
            #Overflow mechanic: distribute excess votes to the other districts
            if districtOverflowedRep[k] is False:
                updatedValsRep[k] += SWING_CONST * (excessRep / (len(votingByDistrict) - excessRep))

            if districtOverflowedDem[k] is False:
                updatedValsDem[k] -= SWING_CONST * (excessDem / (len(votingByDistrict) - excessDem))

            if updatedValsRep[k] > 0.50:
                totalRepSeats += 1
            if updatedValsDem[k] > 0.50:
                totalDemSeats += 1

    i += SWING_CONST
    counter += 1

    if i <= 1:
        seatsVotesRep.append({"seats": float(totalRepSeats) / (len(votingByDistrict) * 1000.0), "votes": i})
        seatsVotesDem.insert(0, {"seats": float(totalDemSeats) / (len(votingByDistrict) * 1000.0), "votes": 1 - i + diff})

i = demVoteShare
counter = 0

while i <= 1:
    totalDemSeats = 0
    totalRepSeats = 0

    for j in range(0,1000): #simulate 1000 elections
        districtOverflowedRep = [False] * len(votingByDistrict);
        districtOverflowedDem = [False] * len(votingByDistrict);
        excessDem = 0
        excessRep = 0
        updatedValsRep = [0] * len(votingByDistrict);
        updatedValsDem = [0] * len(votingByDistrict);

        for k, district in enumerate(votingByDistrict):
            updatedValsDem[k] = district["percentDem"] + counter * SWING_CONST + SWING_CONST * random.randint(-5, 5) + diff
            updatedValsRep[k] = 1 - (updatedValsDem[k] - diff)

            if updatedValsRep[k] > 1:
                excessRep += 1
                districtOverflowedRep[k] = True

            if updatedValsDem[k] < 0:
                excessDem += 1
                districtOverflowedDem[k] = True

        for k, district in enumerate(votingByDistrict):
            #Overflow mechanic: distribute excess votes to the other districts
            if districtOverflowedRep[k] is False:
                updatedValsRep[k] -= SWING_CONST * (excessRep / (len(votingByDistrict) - excessRep))

            if districtOverflowedDem[k] is False:
                updatedValsDem[k] += SWING_CONST * (excessDem / (len(votingByDistrict) - excessDem))

            if updatedValsRep[k] > 0.50:
                totalRepSeats += 1
            if updatedValsDem[k] > 0.50:
                totalDemSeats += 1

    i += SWING_CONST
    counter += 1

    if i <= 1:
        seatsVotesDem.append({"seats": float(totalDemSeats) / (len(votingByDistrict) * 1000.0), "votes": i + diff})
        seatsVotesRep.insert(0, {"seats": float(totalRepSeats) / (len(votingByDistrict) * 1000.0), "votes": 1 - i})

# Add endpoints
seatsVotesRep.insert(0, {"seats": 0, "votes": 0})
seatsVotesDem.insert(0, {"seats": 0, "votes": 0})
seatsVotesRep.append({"seats": 1, "votes": 1})
seatsVotesDem.append({"seats": 1, "votes": 1})

# Write out to file
outputFile.write("votes,seatsR,seatsD\n")
for i in range(0, len(seatsVotesDem)):
    outputFile.write(str(100 * seatsVotesRep[i]["votes"]) + "," + str(100 * seatsVotesRep[i]["seats"]) + "," + str(100 * seatsVotesDem[i]["seats"]) + "\n")

inputFile.close()
outputFile.close()
