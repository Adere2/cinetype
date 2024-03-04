import http.server

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    http.server.test(HandlerClass=NoCacheHTTPRequestHandler, port=9000)