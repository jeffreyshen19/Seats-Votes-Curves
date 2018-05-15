import sys

fileToRead = open(sys.argv[1],"r")
demFile = open(sys.argv[2] + "-dem.csv","w")
repFile = open(sys.argv[2] + "-rep.csv","w")
csv = fileToRead.read().split("\n")

votingByDistrict = []
seatsVotesRep = []
seatsVotesDem = []

SWING_CONST = 0.02 #Percentage to increase each district by

for lineStr in csv:
    if len(lineStr) > 0:
        line = lineStr.split(",")
        line[0] = int(line[0])
        line[1] = int(line[1])

        votingByDistrict.append({"rep": line[0], "dem": line[1], "total": line[0] + line[1]})
i = 0

while True:
    #Increase by SWING_CONST
    repVotes = 0
    demVotes = 0
    repSeats = 0
    demSeats = 0
    for j in range(0,len(votingByDistrict)):
        district = votingByDistrict[j]
        repVote = round((SWING_CONST * i + float(district["rep"]) / district["total"]) * district["total"])
        demVote = district["total"] - repVote
        repVotes += repVote
        demVotes += demVote
        if repVote > demVote:
            repSeats += 1
        else:
            demSeats += 1
    repVotePercentage = float(100 * repVotes) / (repVotes + demVotes)
    repSeatPercentage = float(100 * repSeats) / (repSeats + demSeats)
    if repVotePercentage > 100:
        break
    seatsVotesRep.append({"votes": repVotePercentage, "seats": repSeatPercentage})
    i += 1

i = 0

while True:
    #Decrease by SWING_CONST
    repVotes = 0
    demVotes = 0
    repSeats = 0
    demSeats = 0
    for j in range(0,len(votingByDistrict)):
        district = votingByDistrict[j]
        repVote = round((float(district["rep"]) / district["total"] - SWING_CONST * i) * district["total"])
        demVote = district["total"] - repVote
        repVotes += repVote
        demVotes += demVote
        if repVote > demVote:
            repSeats += 1
        else:
            demSeats += 1
    repVotePercentage = float(100 * repVotes) / (repVotes + demVotes)
    repSeatPercentage = float(100 * repSeats) / (repSeats + demSeats)
    if repVotePercentage < 0:
        break
    seatsVotesRep.append({"votes": repVotePercentage, "seats": repSeatPercentage})
    i += 1

i = 0

while True:
    #Increase by SWING_CONST
    repVotes = 0
    demVotes = 0
    repSeats = 0
    demSeats = 0
    for j in range(0,len(votingByDistrict)):
        district = votingByDistrict[j]
        demVote = round((SWING_CONST * i + float(district["dem"]) / district["total"]) * district["total"])
        repVote = district["total"] - demVote
        repVotes += repVote
        demVotes += demVote
        #print demVote
        if repVote > demVote:
            repSeats += 1
        else:
            demSeats += 1
    demVotePercentage = float(100 * demVotes) / (repVotes + demVotes)
    demSeatPercentage = float(100 * demSeats) / (repSeats + demSeats)
    if demVotePercentage > 100:
        break
    seatsVotesDem.append({"votes": demVotePercentage, "seats": demSeatPercentage})
    i += 1

i = 0

while True:
    #Decrease by SWING_CONST
    repVotes = 0
    demVotes = 0
    repSeats = 0
    demSeats = 0
    for j in range(0,len(votingByDistrict)):
        district = votingByDistrict[j]
        demVote = round((float(district["dem"]) / district["total"]) * district["total"] - SWING_CONST * i)
        repVote = district["total"] - demVote
        repVotes += repVote
        demVotes += demVote
        if repVote > demVote:
            repSeats += 1
        else:
            demSeats += 1
    demVotePercentage = float(100 * demVotes) / (repVotes + demVotes)
    demSeatPercentage = float(100 * demSeats) / (repSeats + demSeats)
    if demVotePercentage < 0:
        break
    seatsVotesDem.append({"votes": demVotePercentage, "seats": demSeatPercentage})
    i += 1

print len(seatsVotesDem)
print len(seatsVotesRep)

seatsVotesRep = sorted(seatsVotesRep, key=lambda svpair: svpair["votes"])
seatsVotesDem = sorted(seatsVotesDem, key=lambda svpair: svpair["votes"])

repFile.write("votes,seats\n")
demFile.write("votes,seats\n")

for svpair in seatsVotesRep:
    repFile.write(str(svpair["votes"]) + "," + str(svpair["seats"]) + "\n")

for svpair in seatsVotesDem:
    demFile.write(str(svpair["votes"]) + "," + str(svpair["seats"]) + "\n")

fileToRead.close()
repFile.close()
demFile.close()
