# Bienvenidos a Compri

clonen el proyecto en la carpeta que van a usar con `git clone https://github.com/ThiagoPerez03/Compri.git `

---

## Aclaraciones

### Frontend
Previo a utilizar el frontend van a tener que instalarse **Node.js** en sus computadoras

Luego, dentro de la carpeta de frontend utilizan `npm install` para instalar todas las librerias y dependencias. 

Para correr el proyecto, usar el comando `npm run dev`

---

### Backend
Para utilizar el backend van a tener que instalarse Python, con el checkbox de "Add python to PATH" selecionado. 

Mi recomendación es que para cada proyecto de Django, se creen un entorno virtual. Si instalan todo en local no está mal, pero puede pasar que tengan un problema entre dependencias. 

Para instalarse un entorno virtual, parados sobre la carpeta de backend, pongan `python -m venv venv`.
- Para activar el entorno `venv\Scripts\activate`
- Para seleccionar el intérprete del entorno:
     - `ctrl + shift + p`
     - Python: select interpreter
     - Seleccionan el python que tenga (venv)
     - En el caso de que no les aparezca:
        - van a Enter interpreter path...
        - luego a Find y les va a abrir el explorador de archivos.
        - Entran a backend/venv/Scripts/ y seleccionan python.exe
- Cuando terminan de trabajar `deactivate` para desactivar el entorno virtual

Luego instalan las librerías/dependencias con `pip install -r requirements.txt`
**Cada vez que agreguen una librería y estén con el venv activado, usen `pip freeze > requirements.txt` para agregarlas al archivo y evitar confusiones. Igualmente avisar cuando se instalaron nuevas o utilizar el comando cada vez que estás por empezar a trabajar para estar actualizado (esto último cuando estás en la main)**

Después, `python manage.py migrate`. Esto va a aplicar las migraciones de la BBDD por primera vez en django. 

Por último, `python manage.py runserver` para levantar el proyecto. Hagan ctrl + click sobre el link que les aparece. 

--- 
Esto no sé si lo van a usar, pero por las dudas.

Cada vez que hagan un CRUD sobre un modelo en models.py, van a tener que migrar e implementar las migraciones
 - `python manage.py makemigrations` para detectar los cambios
  - `python manage.py migrate` para aplicar los cambios 

--- 
## Comandos de git 

`git clone https://github.com/ThiagoPerez03/Compri.git ` para clonar el repo

### Tema branches

Estaría bueno que cada uno trabaje en una rama, para evitar problemas en la main a la hora de que cada uno suba sus cambios.

Siempre recomendable hacer un `git pull` para tener actualizada la main antes de hacer tu rama.

`git branch -a` para saber sobre que rama estás parado y cuales son las otras ramas remotas que existen
    
    *main
    
    rama/1
    
    rama/2
Así debería aparecerles. El * indica sobre que rama están parados. El resto de ramas, son las que crearon el resto de colaboradores.

Para crear tu rama, `git branch rama` reemplazas rama por el nombre que quieras, puede ser tu nombre o la funcionalidad que vayas a trabajar. 

Para cambiarte a tu rama `git checkout rama` 
    Para chequear este paso a tu rama, volves a tirar `git branch` y debería aparecerte así
       
    main
        
    *rama
        
    rama/1

### Comandos a la hora de pushear archivos

`git pull` para tener actualizada tu rama. (no tendrías que tener cambios detectados porque cada uno trabaja en su rama, pero por las dudas.)

`git add . ` o `git add /ruta/del/archivo/modificado` para añadir los archivos que vas a subir 

`git commit -m "mensaje descriptivo sobre tus cambios"` para empaquetar tus archivos junto con un mensaje breve y acorde a los cambios 

`git push -u origin rama` para subir tus cambios a tu rama en el repo remoto la primera vez, después solo con `git pull`

### Pull Request

Una vez que ya terminaste de trabajar y veas que todo funcione, hay que llevarlo a la main. 

1. `git checkout main` para cambiarte a la main
2. `git pull origin main` para tener actualizada la main
3. `git checkout rama` para volver a tu rama
4. Ir a GitHub y dentro del repositorio te va a aparecer la opción de "Compare & pull request" en verde, apretala.
5. Base branch es a donde queres llevar tus cambios (main), Compare branch desde donde los traes (tu rama). 
6. Título y descripción para documentar que cambios traes.
7. Reviewers: para mi opcional. asignas colaboradores para que revisen el código.
8. "Create pull request"
9. Si no te aparecen conflictos, bárbaro. Ahora si te aparecen:
    - 9.1 Asegurate de estar en tu rama
    - 9.2 Asegurate de traerte el main actualizado `git pull origin main`
    - 9.3 Resolvé los conflictos
    - 9.4 Asegurate de que la aplicación funcione
    - 9.5 `git add . `, `git commit -m "comentario de que hiciste el merge"` , `git push origin rama`
    - 9.6 La interfaz de GitHub debería de dejar de mostrarte los conflictos
10. Apretar en "Merge" o "Merge request"

