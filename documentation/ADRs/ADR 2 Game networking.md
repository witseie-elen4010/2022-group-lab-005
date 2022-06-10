# ADR 2: Game networking
## Context
To enable users to create, join, and view games, a communication system must be constructed.

## Decision
At a high level, the network is divided into two compartments. The first compartment is known as '/rooms' and the second compartment is simply called '/'. In terms of socket.io terminology, these compartments are called namespaces. The second compartment is the default namespace.

The socket.io server that operates these compartments enables limited communication between the two of them.

### Rooms namespace
Clients must connect to the '/rooms' namespace to create and join games. Clients are automatically connected to this namespace when they navigate to the lobby page on the website. When a client connects, it receives a list of games that are waiting for players to join. The list displays the game name (which is a UUID with additional values appended to it), the number of places open, and the type of game (custom word or randomly chosen word).

The server responds to the following requests from clients in the game 



## Status
Accepted

## Consequences


