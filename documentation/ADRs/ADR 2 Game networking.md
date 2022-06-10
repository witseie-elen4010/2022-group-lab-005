# ADR 2: Game networking
## Context
To enable users to create, join, and view games, a communication system must be constructed.

## Decision
At a high level, the network is divided into two compartments. The first compartment is known as `/rooms` and the second compartment is simply called `/`. In terms of socket.io terminology, these compartments are called namespaces. The second compartment is the default namespace.

The socket.io server that operates these compartments enables limited communication between the two of them. However, the purpose of the compartments is to keep actual game information confined to a specific section of the communication system and to ensure that concurrent games do not overlap with one another.

### Rooms namespace
Clients must connect to the `/rooms` namespace to create and join games. Clients are automatically connected to this namespace when they navigate to the lobby page on the website. When a client connects, it receives a list of games that are waiting for players to join. The list displays the game name (which is a UUID with additional values appended to it), the number of places open, and the type of game (custom word or randomly chosen word).

The server only responds to the following requests from clients in the lobby (the `/rooms` namespace):
1. `create_game` - This asks the server to create a game with the specified type (standard or custom), the number of players, and the custom word (if required.)
2. On connection (or page refresh), a list of open games is sent to the client.

The server can send the following requests to clients in the lobby (the `/rooms` namespace):
1. `get_game_id` - If the request to create a game (create_game) is valid, the server sends the details of the socket.io room created for the game.
2. `invalid_word` - If the word specified for a custom game is not valid, the client receives this message.
3. `invalid_characters_in_custom_word` - If the word specified for a custom game contains characters that are not only alphabetical, the client receives this message.
4. `invalid_game_mode` - If the game mode specified by the client is invalid, the client receives this message from the server.
5. `invalid_player_number` - If the number of players specified by the client is invalid (not between 2 and 7 for standard OR 3 and 7 for custom) the client receives this message from the server.

### Default namespace
If a client receives the `get_game_id` message from the server, it has been granted a game session for the details specified. Next, the client saves these details to the session storage and is redirected to the game page. Once the game page loads, the connection details are read from the session storage and sent to the server. If the server accepts the details, the client (now in the default namespace (`/`)) is connected to the room corresponding to the game they created.

Once in a game room, the server will respond to the following messages from a client:
1. `send_guess` - When a client has entered their five letter word, a message containing their guess along with other data related to the tile colours is sent to the server.
2. `disconnect` - If a client disconnects from a room for any reason, a message is sent to the server. The server will then send a message (`update_game_list`) to all the clients in the `/rooms` namespace to update the open games list in the event that the user disconnected before the game started.
3. `game_over` - If the server has told the clients that they game is over, the clients will send this message back to the server to tell the server that the client wishes to disconnect. This event does not update the game list in the `/rooms` namespace since the game is no longer running.

The server can send the follow requests to clients in a specific room within the `/` namespace:
1. `waiting_for_players` - If a client joins a game that does not have enough players for it to start, this message is sent back to the client so it knows that the server is waiting. At the same time as this message is sent, a message is sent to all the clients in the `/rooms` namespace to updae their player and game numbers in the lobby page.
2. `game_can_start` - If enough clients have joined a game, then this message is sent to all of them to indicate that the game is about to start.
3. `game_already_running` - If a client attempts to join a game that is already running, this message is sent back to them. Furthermore, if they leave a running game and then try to join it again, this message is also sent to them.
4. `user_already_in_game` - If a client tries to join a game that they are already part of, this message is sent to them.
5. `invalid_game_id` - If a client attempts to join a game that does not exist, this message is sent back to them.
6. `update_player_screen` - This message sends back data containing information about the word that the client submitted as their guess. This information is used to update the player's blocks with the colours used to indicate the correctness of each letter in the guess word. In this way, the word that the players must guess is not sent to the clients. A boolean is also sent to indicate if the player won the game by guessing the correct word.
7. `update_opponent_colors` - Once a player has submitted a guess to the server, the server will send a message to all clients in the game (excluding the sender) with information about the senders guess. This information only contains the colours of the tiles indicating the correctness of the senders guess. A boolean is also sent to indicate if the sender won the game by guessing the correct word.
8. `nobody_won` - If none of the players managed to guess the word, then this message is sent to all the clients. The word that the clients had to guess is sent in this message. 
9. `word_not_found` - If a player submits a guess to the server that does not contain a word in its database of valid words, this message is sent back to the client to indicate that.
10. `invalid_guess` - If a client manages to bypass the input validation in the client-side code, this message is sent back to the client to tell them that the guess they sent can only contain letters of the alphabet and may only be 5 letters in length.

## Status
Accepted