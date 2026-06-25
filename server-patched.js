const express = require("express");
const { exec } = require("child_process");
const app = express();
const PORT = 3000;
const SECRET = process.env.REBUILD_WEBHOOK_SECRET;
app.use(express.json());
app.post("/rebuild/:secret", (req, res) => {
    if (req.params.secret !== SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }
    // Respond immediately so GitHub doesn't time out waiting on a multi-minute build
    res.status(202).json({ success: true, message: "Rebuild triggered" });
    exec("./scripts/build-quartz.sh", (error, stdout, stderr) => {
        if (error) {
            console.error(`Webhook failed with error: ${stderr}`);
            return;
        }
        console.log(`Webhook trigger: ${stdout}`);
    });
});
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Webhook server running on http://127.0.0.1:${PORT}`);
});
