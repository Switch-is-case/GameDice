const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- НАСТРОЙКИ ---
// 1. Укажите путь к папке, куда вы распаковали файлы
const pathToFiles = 'C:/Users/77787/Desktop/Task2'; 
// 2. Укажите ваш e-mail в нижнем регистре
const myEmail = 'user@example.com';
// ------------------

const hashes = [];

try {
    // Шаг 1: Вычисляем SHA3-256 для каждого файла
    const files = fs.readdirSync(pathToFiles);

    for (const file of files) {
        const filePath = path.join(pathToFiles, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            // Читаем файл как бинарный буфер
            const fileContent = fs.readFileSync(filePath);

            // Вычисляем хеш
            const hash = crypto.createHash('sha3-256');
            hash.update(fileContent);

            // Шаг 2: Представляем как 64 шестнадцатеричных цифры в нижнем регистре
            const hexDigest = hash.digest('hex');
            hashes.push(hexDigest);
        }
    }

    if (hashes.length === 0) {
        throw new Error(`Файлы не найдены по пути '${pathToFiles}'.`);
    }

    // Шаг 3: Сортируем хеши как строки по убыванию
    hashes.sort((a, b) => b.localeCompare(a));

    // Шаг 4: Склеиваем хеши без сепаратора
    const concatenatedHashes = hashes.join('');

    // Шаг 5: Приклеиваем e-mail в нижнем регистре
    const stringToHash = concatenatedHashes + myEmail.toLowerCase();

    // Шаг 6: Вычисляем финальный SHA3-256 от полученной строки
    const finalHash = crypto.createHash('sha3-256');
    finalHash.update(stringToHash); // строку можно передавать напрямую, Node.js по умолчанию использует UTF-8
    const finalResult = finalHash.digest('hex');
    
    // Вывод результата для отправки в Discord
    console.log("--- Результаты ---");
    console.log(`Отсортированные и склеенные хеши: ${concatenatedHashes.substring(0, 80)}...`);
    console.log(`Строка для финального хеширования: ${stringToHash.substring(0, 80)}...`);
    console.log("\n--- Финальный результат ---");
    console.log("Ваш e-mail для команды: " + myEmail.toLowerCase());
    console.log("Ваш финальный хеш для отправки:");
    console.log(finalResult);
    console.log("\nКоманда для Discord:");
    console.log(`!task2 ${myEmail.toLowerCase()} ${finalResult}`);

} catch (error) {
    console.error(`Ошибка: ${error.message} Убедитесь, что вы правильно указали путь и распаковали архив.`);
}