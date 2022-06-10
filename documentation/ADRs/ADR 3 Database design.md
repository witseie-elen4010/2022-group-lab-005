# ADR 1: Database design
## Context
Update to the original Database design as new tables are needed and old ones are modified.
## Decision
We will make use of seven tables to store all the data in a database. These seven tables have been designed in such a way as to ensure that the number of duplicate entries is kept to a minimum. To do this, a primary key in one table may act as a foreign key in another table. By doing this, we can associate a row in one table with a row in a different table. The names of the fields in each table have been chosen in such a way that they are self-explanatory.

### Friends table
This table consists of two foreign keys from the table Users, and it also contains a column containing the friend relationship between the Users.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| Inviter(🔶)   | Characters   	            | No                      	|
| Invitee(🔶)  	| Characters              	| No                      	|
| Status       	| Characters               	| No                      	|

Note that 🔶 indicates a foreign key.


### Game table
This table consists of all the data required to identify one game session played by several players on a specific date.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| ID (🔑)  	    | Autoincrementing Number   | No                      	|
| GameType    	| Characters              	| No                      	|
| NumPlayers  	| Number                  	| No                      	|
| WordToGuess 	| Characters              	| No                      	|
| WhoWon      	| Characters              	| No                      	|
| GameDateTime 	| Characters              	| Yes                      	|

Note that 🔑 indicates a primary key.

``GameType`` is used to indicate the nature of the game. This is to account for the modes where one player specifies a word and other players have to guess the word OR if a word is chosen from an internal source of words. Therefore, one can see that ``WordToGuess`` is the word that the players are guessing.


### Guess table
This table contains the data used to identify a specific word guess by a specific player for a specific game. One should note that ``GameID`` is a foreign key that originates from the Game tale. Likewise, ``Username`` is a foreign key that originates from the Users table. Using these foreign keys and the other fields in the table, one can determine the number of guesses that a player made for a specific round (`GameID`), or one may simply list the words guessed by a player for a specific round.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| ID (🔑)       | Autoincrementing Number 	| No                      	|
| Word         	| Characters              	| No                      	|
| TimeStamp   	| Timestamp               	| No                      	|
| GameID (🔶)   | Number                  	| No                      	|
| Username (🔶) | Characters               	| No                      	|

Note that 🔑 indicates a primary key and 🔶 indicates a foreign key.


### Settings table
This table contains the username which is the primary key for this table, and it is at the same time a foreign key from table Users. It is used to link which user the settings are related to.
| Field | Type | Can contain null value? |
| ----- | ---- | ----------------------- ||
| Username(🔑🔶)  | Character 	| No                      	|
| Background 	  | Character 	| No                      	|
| isDarkmode	  | Character 	| No                      	|

Note that 🔑 indicates a primary key and 🔶 indicates a foreign key.

### UserGame table
This table consists of two foreign keys to see who is in the same game at the same time.

| Field      	  | Type                    	| Can contain null value? 	|
|--------------	|-------------------------	|-------------------------	|
| Username(🔶) 	| Characters              	| No
| Username(🔶) 	| Number                  	| No

Note that 🔶 indicates a foreign key.


### Users table
This table contains account details for username and password(hashed)
note that the password stored in the database have been salted and hashed.

| Field      	  | Type                    	| Can contain null value? 	|
|--------------	|-------------------------	|-------------------------	|
| Username(🔑)  | Characters              	| No                      	|
| Password   	  | Characters              	| No                      	|

Note that 🔑 indicates a primary key.


### Vocabulary table
This table contains the primary key ID and its associated word, this table stores all the words the user's guesses can come from.

| Field       	| Type                    	| Can contain null value? 	|
|-------------	|-------------------------	|-------------------------	|
| ID(🔑)       | Characters   	            | No                      	|
| Word  	      | Characters              	| No                      	|

Note that 🔑 indicates a primary key.


## Status
Accepted

## Consequences
- Due to the nature of the database scheme, changes that are made to the database will affect the code, and the code is updated to suit the database design.
- Deletion of some variables will not be allowed as some columns(🔑primary key) are predecessors of other columns(🔶foreign key).
- The database is well structured and normalised. This means that to show specific information, calculations and database results sorting will have to occur. 

## User Contribution
Huan Lei -> users table
         -> Friend table

Robyn Gebbie -> Settings table

Roger de Mello Koch -> Game table
                    -> Vocabulary table

Jesse van der Merwe -> UserGame table

Nicholas Warrener -> Guess table
