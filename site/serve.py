#!/usr/bin/env python3
"""Tiny local server with HTTP Range support (needed for scroll-scrubbed video).
Run:  python3 serve.py   → open http://localhost:8000
"""
import http.server, os, re, sys

class H(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()
        m = re.match(r"bytes=(\d*)-(\d*)", rng)
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else 0
        end = int(m.group(2)) if m.group(2) else size - 1
        end = min(end, size - 1)
        f = open(path, "rb"); f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        self._left = end - start + 1
        return f
    def copyfile(self, src, dst):
        left = getattr(self, "_left", None)
        try:
            if left is None: return super().copyfile(src, dst)
            while left > 0:
                b = src.read(min(65536, left))
                if not b: break
                dst.write(b); left -= len(b)
        except (BrokenPipeError, ConnectionResetError): pass
        finally: self._left = None
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes"); super().end_headers()
    def log_message(self, *a): pass

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Yantrix running at http://localhost:{port}  (Ctrl+C to stop)")
    srv = http.server.ThreadingHTTPServer
    srv.request_queue_size = 256
    srv.daemon_threads = True
    srv(("", port), H).serve_forever()
