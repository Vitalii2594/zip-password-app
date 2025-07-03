const express = require('express');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(fileUpload());
app.use(express.static('public'));

// Konfiguracja folderu tymczasowego
const TEMP_DIR = './temp';
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Endpoint do generowania ZIP-ów
app.post('/generate', async (req, res) => {
    try {
        // Walidacja danych wejściowych
        if (!req.files || !req.files.files || !req.body.password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Proszę przesłać pliki i podać hasło' 
            });
        }

        const files = Array.isArray(req.files.files) 
            ? req.files.files 
            : [req.files.files];
        const password = req.body.password;
        const generatedFiles = [];

        // Generowanie zahasłowanych ZIP-ów
        for (const file of files) {
            const zip = new AdmZip();
            zip.addFile(file.name, file.data);
            zip.setPassword(password);
            
            const originalName = path.parse(file.name).name;
            const zipName = `${originalName}_protected.zip`;
            const zipPath = path.join(TEMP_DIR, zipName);
            
            zip.writeZip(zipPath);
            
            generatedFiles.push({
                originalName: file.name,
                zipName: zipName
            });
        }

        res.json({ 
            success: true, 
            files: generatedFiles 
        });
    } catch (error) {
        console.error('Błąd:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Wystąpił błąd podczas przetwarzania plików' 
        });
    }
});

// Endpoint do pobierania plików
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(TEMP_DIR, req.params.filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, err => {
            if (err) {
                console.error('Błąd pobierania:', err);
                res.status(500).send('Błąd podczas pobierania pliku');
            }
            // Sprzątanie - usuwanie pliku po pobraniu
            try {
                fs.unlinkSync(filePath);
            } catch (cleanupError) {
                console.error('Błąd usuwania pliku:', cleanupError);
            }
        });
    } else {
        res.status(404).send('Plik nie został znaleziony');
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
    console.log('Aplikacja gotowa do użycia!');
});