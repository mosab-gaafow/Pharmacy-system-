import express from 'express';
const app = express();
const PORT = process.env.PORT || 400;
app.listen(PORT, () => {
    console.log(`Server is Running on Port: ${PORT}`);
});
//# sourceMappingURL=server.js.map