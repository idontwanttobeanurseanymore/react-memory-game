## Aplicacion web de juego de parejas

### Tiene varias pantallas:

1. landing page (nombre de usuario, selección de nivel y visualizacion de ranking en el botón leaderboard)
2. memoryboard (tablero, movimientos, tiempo, botones en funcion de la finalizacion del juego)
3. ranking (individual según el nivel jugado o global si se quiere ver todos los ranking de todos los niveles. El ranking global es accesible tanto desde landing page como desde el ranking que aparece una vez jugado un nivel).

### Botones:

leaderboard (muestra todos los rankings actualizados de todos los niveles). Aparece en landing page. Actualmente este nombre también aparece cuando se gana una partida, pero hay que cambiarlo. Leaderboard solo debería aparece en Landing Page.
play again (vuelve al mismo tablero con movimientos y tiempo a 0 y las cartas barajadas de nuevo). Aparece al finalizar una partida (tanto si se ha ganado como si se ha perdido) y en los rankings (no en el ranking al que se accede desde leaderboard).
choose level (volverá a landing page).
show all (muestra el ranking del resto de niveles actualizados, incluyendo la nueva puntuacion, y aparecerán los botones play again, choose level junto y show my ranking). Aparece cuando el usuario ha ganado una partida y pulsa en
show my ranking (devolverá al jugador al ranking del nivel jugado). El segundo boton que actualmente se llama leaderboard que aparece tras finalizar una partida debería llamarse show my ranking.

### Funcionamiento:

1. El jugador escribe 3 letras que será su nombre de usuario y elige el nivel. Hay 4 niveles. En funcion del nivel, se empezará el juego en un tablero u otro.
2. Cuando se inicia el juego, hay dos marcadores: numero de movimientos y tiempo. Ambos empiezan en 0 siempre que se inicia la partida. El jugador irá seleccionando cartas. Un movimiento es lo mismo que la selección de dos cartas.
3. El juego termina cuando se encuentran todas las parejas del tablero o cuando el tiempo llega a 3 minutos.
4. Si el tiempo se acaba, esa partida se cuenta como perdida. Si se encuentran todas las parejas, la partida contabiliza como ganada y se suben los datos a la base de datos para que cuente para el ranking. Datos que se suben: playyer_name, game_moves, game_time, game_date, game_pairs y difficulty.
5. Cuando la partida acaba, el jugador puede volver a jugar el nivel si pulsa en play again o volver a landing page a través de choose level. Si ha ganado la partida, también tiene acceso al ranking de ese nivel a través del botón show my ranking (que actualmente se llama leaderboard).
6. Si pulsa en show my ranking, saldrá el nivel que acaba de jugar. Su puntuacion y tiempo saldrán en la parte de arriba y, si esta entre los 5 primeros, aparecerá su puntuacion en el ranking. En esta pantalla habrá tres botones: show all, play again y choose level. Al pulsar en show all, además de mostrar todos los rankings actualizados (incluyendo la nueva puntuacion), aparecerán de nuevo los botones play again y choose level junto con show my ranking (que lo devuelve a la pantalla donde solo se ve el ranking del nivel jugado).

### Guardado y recuperación de datos:

1. Al abrir la aplicación, se deben de cargar los datos de la base de datos. Si no hay conexión con la BD, se deben de cargar los datos guardados en el local storage.
2. Al ganar la partida, esos nuevos datos deben guardarse en LS y en la BD y mostrarse en los rankings sin tener que recargar la aplicación.
3. Se debe comprobar que todos los datos guardados en LS están también guardados en la BD. En caso de que haya alguna puntuación no guardada, debe subirse y mostrarse. En los rankings solo se mostrarán las puntuaciones de los 5 mejores jugadores por niveles, pero en la BD se guardarán todos los resultados de las partidas ganadas.
4. Si una partida se pierde (actualmente solo se puede perder si el tiempo llega a 3 minutos), esa puntuación no debe de guardarse.

### Tareas pendientes

1. Cambiar nombre de botón para que "leaderboard" solo esté en la pantalla de inicio.
2. Revisar que todos los botones funcionan y hacen lo que tienen que hacer y no algo diferente.
3. Revisar funcionamiento de guardado y recuperación de datos. Actualmente no sube datos al jugar, pero si desde POSTMAN. Tambpoco los recupera sin recargar.
4. Revisar que LS está funcionando y que todo lo guardado ahí se está guardando en la BD.
5. Revisar que, si la BD falla, se estén recuperando los datos del LS.
