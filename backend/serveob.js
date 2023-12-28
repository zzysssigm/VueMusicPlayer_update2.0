const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MP3 = require('./models/MP3');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/musicPlayerDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

// 允许 http://localhost:8080 访问该后端 API
const corsOptions = {
  origin: 'http://localhost:8080',
};

// 使用 cors 中间件并传递特定来源的配置对象
app.use(cors(corsOptions));

app.get('/api/mp3/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  if (!fileName) {
    return res.status(400).json({ error: 'File name not provided' });
  }

  const filePath = path.join(__dirname, 'music', fileName); // 假设 MP3 文件在 music 文件夹下
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//本地上传
rl.question('You can Enter directory path to load MP3 files into database. \n', async (answer) => {
  try {
    const directoryPath = path.join(__dirname, answer.trim()); // 获取绝对路径
    if (!fs.existsSync(directoryPath)) {
      console.log('Directory not found');
      rl.close();
      return;
    }

    await loadMP3FilesIntoDB(directoryPath);
    console.log('MP3 files loaded into database!\n');
  } catch (error) {
    console.error('Error loading MP3 files into DB\n:', error);
  } finally {
    rl.close();
    //process.exit(0);
  }
});

async function loadMP3FilesIntoDB(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (path.extname(file) === '.mp3') {
      const filePath = path.join(directory, file);
      const existingMP3 = await MP3.findOne({ fileName: file });
      if (!existingMP3) {
        const newMP3 = new MP3({
          fileName: file,
          filePath: filePath,
          // Other relevant fields
        });
        await newMP3.save();
        console.log(`File ${file} added to the database.\n`);
      } else {
        console.log(`File ${file} already exists in the database.\n`);
      }
    }
  }
}

app.get('/api/mp3', async (req, res) => {
  try {
    // 从数据库获取音乐数据
    const mp3Files = await MP3.find({}, '-_id fileName filePath'); // 这里使用 MongoDB 的 MP3 模型获取数据
    // 将获取的音乐数据发送给前端
    console.log('MP3 Files:', mp3Files); // 输出查询结果到控制台
    res.json(mp3Files);
  } catch (error) {
    console.error('Error fetching MP3 files from DB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000\n');
});

