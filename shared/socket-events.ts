// Daten, die der Client an den Server senden darf
export interface ClientToServerEvents {

    // Verbindungstest
    'client:ping': () => void;

}

// Daten, die der Server an den Client senden darf
export interface ServerToClientEvents {

    // Begrüßung nach erfolgreicher Verbindung
    'server:welcome': (data: {
        message: string;
    }) => void;

    // Antwort auf den Ping
    'server:pong': (data: {
        message: string;
    }) => void;

}