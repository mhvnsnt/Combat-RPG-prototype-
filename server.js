const http = require('http');

const PORT = 3000;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unreal Engine Workspace</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #0f172a; 
      color: #f8fafc; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      margin: 0; 
      text-align: center; 
    }
    .container { 
      max-width: 600px; 
      padding: 2.5rem; 
      border: 1px solid #334155; 
      border-radius: 0.75rem; 
      background: #1e293b; 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }
    h1 { 
      color: #38bdf8; 
      margin-top: 0; 
      font-size: 1.5rem;
    }
    p { 
      line-height: 1.6; 
      color: #94a3b8; 
      font-size: 0.95rem;
    }
    .status {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.25rem 0.75rem;
      background: #047857;
      color: #d1fae5;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Unreal Engine Workspace</h1>
    <p>This environment is strictly configured as a C++ source code workspace for the Lyra Starter Game repository.</p>
    <p>No web-based gameplay prototypes or control dashboards are active. To compile and play the 3D mobile RPG, export this codebase to a local machine equipped with the Unreal Engine build toolchain.</p>
    <div class="status">Workspace Active</div>
  </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Unreal Engine placeholder server running on port ${PORT}`);
});
