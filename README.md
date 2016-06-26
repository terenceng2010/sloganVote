# Slogan Vote
Realtime Slogan Voting for assembly (i.e public protest, gathering or public promotion of an association)

## Why
Currently, participants of an assembly have a hard time to push their own slogan and shout together.
They may only shout slogans provided by the host as the result.
This limits the variety of slogan In an assembly. 

Inspired from Team Fortress 2 voting feature. https://wiki.teamfortress.com/wiki/Voting , I think that it is time for participant
to have more variety in an assembly.

There are two stages:
Nominate Stage : In this stage, user can sumbit new slogans, can view nominated slogans, can view slogans that are chosen in previous round. This stage lasts for 5 minutes.
Voting Stage:    In this stage, user needs to vote for their favorite slogans. This stage last for 30 seconds. After voting stage, the top 3 slogans are chosen.

Nominate->Voting: After staying in nominate stage for 5 mins, user needs to press `call for vote` to switch from nominate stage to voting stage. 


## How to Use
TBD

## What it uses
* React Native (client)
* Meteor (server)

## TODO
* UI revamp to more user friendly
* simplify how to add user to a group (e.g either by QR code or by invitation code)
* improve app stability in weak network signal environment
* allow one group to have mutliple pending elections
