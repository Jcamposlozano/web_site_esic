function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Si termina en "/", sirve el index.html de esa carpeta.
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // Si no tiene extensión (ej. /programas), añade "/index.html".
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
