import sys

# Seats-votes curve generator
# Done using uniform partisan swing

fileToRead = open(sys.argv[1],"r")
demFile = open(sys.argv[2] + "-dem.csv","w")
repFile = open(sys.argv[2] + "-rep.csv","w")
csv = fileToRead.read().split("\n")

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

        votingByDistrict.append({"rep": rep, "dem": dem, "total": total, "percentRep": float(rep) / total, "percentDem": float(dem) / total})

repVoteShare = float(totalRepVotes) / totalVotes
demVoteShare = float(totalDemVotes) / totalVotes
i = repVoteShare
counter = 0

# Add endpoints
seatsVotesRep.append({"seats": 0, "votes": 0})
seatsVotesRep.append({"seats": 1, "votes": 1})
seatsVotesDem.append({"seats": 0, "votes": 0})
seatsVotesDem.append({"seats": 1, "votes": 1})

while i <= 1:
    repSeats = 0
    for district in votingByDistrict:
        percentRepUpdated = district["percentRep"] + counter * SWING_CONST
        if percentRepUpdated > 0.50:
            repSeats += 1

    i += 0.01
    counter += 1

    if i <= 1:
        seatsVotesRep.append({"seats": float(repSeats) / len(votingByDistrict), "votes": i})

i = demVoteShare
counter = 0

while i <= 1:
    demSeats = 0
    for district in votingByDistrict:
        percentDemUpdated = district["percentDem"] + counter * SWING_CONST
        if percentDemUpdated > 0.50:
            demSeats += 1

    i += 0.01
    counter += 1

    if i <= 1:
        seatsVotesDem.append({"seats": float(demSeats) / len(votingByDistrict), "votes": i})

i = repVoteShare
counter = 0

while i >= 0:
    repSeats = 0
    for district in votingByDistrict:
        percentRepUpdated = district["percentRep"] - counter * SWING_CONST
        if percentRepUpdated > 0.50:
            repSeats += 1

    i -= 0.01
    counter += 1

    if i >= 0:
        seatsVotesRep.append({"seats": float(repSeats) / len(votingByDistrict), "votes": i})

i = demVoteShare
counter = 0

while i >= 0:
    demSeats = 0
    for district in votingByDistrict:
        percentDemUpdated = district["percentDem"] - counter * SWING_CONST
        if percentDemUpdated > 0.50:
            demSeats += 1

    i -= 0.01
    counter += 1

    if i >= 0:
        seatsVotesDem.append({"seats": float(demSeats) / len(votingByDistrict), "votes": i})

seatsVotesRep = sorted(seatsVotesRep, key=lambda svpair: svpair["votes"])
seatsVotesDem = sorted(seatsVotesDem, key=lambda svpair: svpair["votes"])

repFile.write("votes,seats\n")
demFile.write("votes,seats\n")

for svpair in seatsVotesRep:
    repFile.write(str(100 * svpair["votes"]) + "," + str(100 * svpair["seats"]) + "\n")

for svpair in seatsVotesDem:
    demFile.write(str(100 * svpair["votes"]) + "," + str(100 * svpair["seats"]) + "\n")

fileToRead.close()
repFile.close()
demFile.close()
