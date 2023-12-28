const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musicPlayerDB')
  .then(async () => {
    console.log('MongoDB Connected');

    // 获取数据库连接
    const db = mongoose.connection.db;

    // 清空数据库
    await db.dropDatabase();
    console.log('Database cleared');

    // 关闭数据库连接
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
