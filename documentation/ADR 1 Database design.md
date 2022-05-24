# ADR 1: Database design
## Context
Persistent storage is required to store the login credentials of users, information about each game (for logging purposes), as well as to store user settings (such as using the light or dark colour scheme).
## Decision
We will make use of four tables to store all the data in a database. These four tables have been designed in such a way as to ensure that the number of duplicate entries is kept to a minimum. To do this, a primary key in one table may act as a foreign key in another table. By doing this, we can associate a row in one table with a row in a different table. The names of the fields in each table have been chosen in such a way that they are self-explanatory.

### Game table
This table consists of all the data required to identify one game session played by several players on a specific date.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| GameID (🔑)  	| Autoincrementing Number 	| No                      	|
| GameType    	| Characters              	| No                      	|
| NumPlayers  	| Number                  	| No                      	|
| WordToGuess 	| Characters              	| No                      	|

Note that 🔑 indicates a primary key.

``GameType`` is used to indicate the nature of the game. This is to account for the modes where one player specifies a word and other players have to guess the word OR if a word is chosen from an internal source of words. Therefore, one can see that ``WordToGuess`` is the word that the players are guessing.

### Guess table
This table contains the data used to identify a specific word guess by a specific player for a specific game. One should note that ``GameID`` is a foreign key that originates from the Game tale. Likewise, ``UserID`` is a foreign key that originates from the Users table. Using these foreign keys and the other fields in the table, one can determine the number of guesses that a player (``PlayerID``) made for a specific round (`GameID`), or one may simply list the words guessed by a player for a specific round.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| GuessID (🔑) 	| Autoincrementing Number 	| No                      	|
| GuessedWord 	| Characters              	| No                      	|
| Time_stamp  	| Timestamp               	| No                      	|
| GameID (🔶)  	| Number                  	| No                      	|
| UserID (🔶)  	| Number                  	| No                      	|

Note that 🔑 indicates a primary key and 🔶 indicates a foreign key.

### Winners table
This table consists of only foreign keys. It is used to identify which player (``UserID``) won a specific round (``GameID``). If no players won, then this table will not contain a row for that round.
| Field      	| Type   	| Can contain null value? 	|
|------------	|--------	|-------------------------	|
| GameID (🔶) 	| Number 	| No                      	|
| UserID (🔶) 	| Number 	| No                      	|

Note that 🔶 indicates a foreign key.

### Users table
This table consists of data associated with each user. The ``DarkMode`` field is used to specify if a player would like to use the light or dark colour theme.

| Field      	| Type                    	| Can contain null value? 	|
|------------	|-------------------------	|-------------------------	|
| UserID (🔑) 	| Autoincrementing Number 	| No                      	|
| Username   	| Characters              	| No                      	|
| Password   	| Characters              	| No                      	|
| DarkMode   	| Boolean                 	| No                      	|

Note that 🔑 indicates a primary key.

## Status
Accepted

## Consequences
Due to the nature of the database scheme, changes to features that require more fields to be added to existing tables may impact other code that is in production.

## User Contribution
Huan Lei -> users table

Robyn Gebbie -> Settings related columns on users table

Roger de Mello Koch -> game table
