
Tehtävä 0.4: uusi muistiinpano


```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: redirect
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: the html file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
	activate server
	server-->>browser: the main javascript file
	deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "EW", "date": "2023-12-18T11:42:50.379Z" }, ... ]
    deactivate server    

    Note right of browser: The browser executes the callback function that renders the notes 
```

0.5: Single Page App

```mermaid
sequenceDiagram
    participant browser
    participant server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa)
	activate server
	server->>browser: the spa html file 
	deactivate server
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa)
	activate server 
	server->>browser: main.css file
	deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa)
	activate server
	server->>browser: spa.js file (a backend to read notes to html and send notes to the server)
	deactivate server
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa)
	activate server
	server->>browser: data.json file (contains the notes)
	deactivate server
```

0.6 Uusi muistiinpano

```mermaid
sequenceDiagram
    participant browser
    participant server
note right of browser:  spa.js file sends the note to server and submits it to the data.json file.
	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa)
	activate server
	server->>browser: content {"message": "note created"}
	deactivate server
```
