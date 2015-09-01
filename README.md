# sloganVote
Realtime Slogan Voting for assembly (i.e public protest, gathering or public promotion of an association)

## Why
Currently, participants of an assembly have a hard time to push their own slogan and shout together.
They may only shout slogans provided by the host as the result.
This limits the variety of slogan In an assembly. 

Inspired from Team Fortress 2 voting feature. https://wiki.teamfortress.com/wiki/Voting , I think that it is time for participant
to have more variety in an assembly.

## How to Use
extract and run node server.js

## What it uses
* Node js
* it now uses long-polling. New messages would be pushed to existing users, while new users would have all messages retrieved. (Usage of timestamp)

## Limitation
* actual voting function is not added.
* user record is not yet added.
* no permenant storage nor in-memory db like redis.
* a proper UI
