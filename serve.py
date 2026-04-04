import http.server, os, sys
os.chdir("/Users/sumitkmina/Documents/New project/.claude/worktrees/objective-wu/public")
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=5500, bind="127.0.0.1")
