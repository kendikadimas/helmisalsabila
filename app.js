// Custom server entry point for cPanel Phusion Passenger / "Setup Node.js App"
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV === "development";
// Di cPanel Phusion Passenger, PORT bisa berupa named pipe (string) atau integer.
// JANGAN gunakan parseInt() karena akan merusak pipe socket Passenger!
const port = process.env.PORT || 3000;

const app = next({
  dev,
  // Di cPanel Passenger, jangan tentukan hostname kaku agar dapat listen di unix socket/pipe
  dir: __dirname,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("<h1>500 - Internal Server Error</h1>");
      }
    });

    server.listen(port, () => {
      console.log(`> Ready on port/pipe: ${port} (Node.js on cPanel)`);
    });
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    // Jalankan server darurat agar cPanel health check tidak gagal total dan menampilkan pesan error jelas di browser
    const emergencyServer = createServer((req, res) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`
        <div style="font-family:sans-serif;padding:40px;line-height:1.6">
          <h2 style="color:#e11d48">Next.js Initialization Error</h2>
          <p>Next.js gagal inisialisasi di server. Kemungkinan penyebab utama:</p>
          <ul>
            <li>Folder <b>.next</b> belum di-upload atau belum lengkap.</li>
            <li>Database tidak dapat diakses (periksa <code>.env</code>).</li>
          </ul>
          <pre style="background:#f1f5f9;padding:15px;border-radius:8px">${err.stack || err}</pre>
        </div>
      `);
    });
    emergencyServer.listen(port, () => {
      console.log(`> Emergency server listening on ${port}`);
    });
  });
