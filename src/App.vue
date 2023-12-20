<template>
  <div class="background">
    <div class="music-player">
      <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
      <button @click="selectFolder" id="selectButton">选择文件夹</button>
      <button @click="playAll" class="control-button play-all">全部播放</button>
      <button @click="pauseAll" class="control-button pause-all">{{ pauseButtonText }}</button>
      <button ref="loopButton" class="loop-button" :class="{ 'loop-active': isLooping }" @click="toggleLoop">单曲循环</button>
      <!-- <button @click="pauseAll" class="control-button pause-all"></button> -->
      <div class="search-bar">
        <!-- <input type="text" v-model="searchQuery" placeholder="搜索歌曲" @input="searchSongs" /> -->
        <input type="text" v-model="searchQuery" placeholder="搜索歌曲" @input="searchSongs" ref="searchBar" />
        <button @click="clearSearch">×</button>
        <ul v-if="filteredSongs.length > 0" class="search-results">
          <li v-for="(song, index) in filteredSongs" :key="index" @click="playCorrectSong(song.name)">
            {{ song.name }}
          </li>
        </ul>
      </div>
      <div class="volume-slider">
        <input type="range" min="0" max="100" v-model="volume" class="slider" @input="adjustVolume" />
      </div>
      <div class="thecurrent">正在播放：{{ currentSong.name }}</div>
      <div class="progress-bar-container">
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="progress-bar" />
        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
      <ul class="music-list">
        <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
          <button @click.stop="catchNextIndex(index)">+</button>
          {{ song.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      songs: [],
      currentSong: { name: "", url: "" },
      currentTime: 0,
      duration: 0,
      isPlayingAll: false,//是否有音乐正在播放
      currentSongIndex: 0,
      firstSongIndex: 0,
      nextSongIndex: 0,
      isLooping: false, // 标志单曲循环状态
      fadeOutInterval: null,
      initialVolume: 1, // 记录初始音量
      searchQuery: '', // 存储搜索关键词
      filteredSongs: [], // 存储搜索结果
      songsMap: {}, // 用于映射歌曲名与索引值的对象
      volume: 50, // 设置默认音量
    };
  },
  computed: {
    pauseButtonText() {
      return this.isPlayingAll ? '暂停' : '继续播放';
    },
  },
  mounted() {
    document.addEventListener('click', this.outsideClickHandler); // 在组件挂载后监听点击事件
  },
  beforeUnmount() {
    document.removeEventListener('click', this.outsideClickHandler); // 在组件销毁前移除事件监听
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },

    pause() {
      const audio = this.$refs.audio;
      audio.pause();
    },

    pauseAll() {
      const audio = this.$refs.audio;

      if (audio.paused) {
        this.isPlayingAll = true;
        audio.currentTime = this.currentTime;
        this.resetVolumeToInitial();
        audio.volume = this.initialVolume; // 在播放前将音量设置为初始值
        audio.play();
      } else {
        this.isPlayingAll = false;
        this.currentTime = audio.currentTime;

        this.fadeOutAndPause();
      }
    },

    playAll() {
      if (!this.isPlayingAll) {
        this.isPlayingAll = true;
        this.playSong(this.firstSongIndex);
      } else {
        // 先进行渐弱暂停，然后播放首歌曲
        this.fadeOutAndPause().then(() => {
          this.isPlayingAll = true;
          this.playSong(this.firstSongIndex);
        });
      }
    },

    playSong(index) {
      console.log(index);
      this.resetVolumeToInitial();
      this.nextSongIndex = (this.currentSongIndex + 1) % this.songs.length;
      if (!this.isPlayingAll) {
        this.isPlayingAll = true;
        this.currentSong = this.songs[index];
        this.currentSongIndex = index;
        this.$refs.audio.src = this.currentSong.url;
        this.$refs.audio.load();
        this.playAudio();
      } else {
        // 先进行渐弱暂停，然后播放新的歌曲
        this.fadeOutAndPause().then(() => {
          this.currentSong = this.songs[index];
          this.currentSongIndex = index;
          this.$refs.audio.src = this.currentSong.url;
          this.$refs.audio.load();
          this.resetVolumeToInitial(); // 设置新歌曲的音量为初始音量
          this.playAudio();
        });
      }
      // 监听音频播放结束事件
      this.$refs.audio.addEventListener('ended', () => {
        if (this.isLooping) {
          // 单曲循环模式开启，播放当前歌曲
          this.playSong(this.currentSongIndex);
        } else {
          // 单曲循环模式关闭，播放下一首歌曲
          this.playSong(this.nextSongIndex);
        }
      }, { once: true });

      // 监听音频可以播放事件，开始播放当前歌曲
      this.$refs.audio.addEventListener('canplaythrough', () => {
        this.$refs.audio.play();
      }, { once: true });
    },

    playAudio() {
      this.$refs.audio.addEventListener('canplaythrough', () => {
        this.$refs.audio.play();
      }, { once: true });
    },

    catchNextIndex(index) {
      console.log(index);
      this.nextSongIndex = index;
    },

    // fadeOutAndPause() {
    //   return new Promise((resolve) => {
    //     const audio = this.$refs.audio;
    //     const fadeOutDuration = 550; // 渐弱持续时间，单位毫秒
    //     const initialVolume = audio.volume;
    //     const step = initialVolume / (fadeOutDuration / 150);

    //     const fadeOutInterval = setInterval(() => {
    //       if (audio.volume - step > 0) {
    //         audio.volume -= step;
    //       } else {
    //         audio.volume = 0;
    //         clearInterval(fadeOutInterval);
    //         this.pause();
    //         resolve(); // 渐弱暂停完成，resolve Promise
    //       }
    //     }, 100);
    //   });
    // },
    
    //渐弱效果优化
    fadeOutAndPause() {
      return new Promise((resolve) => {
        const audio = this.$refs.audio;
        const fadeOutDuration = 550; // 渐弱持续时间，单位毫秒
        const initialVolume = audio.volume;

        // 定义一个自定义函数，模拟先快后慢的渐弱效果
        function easeOutSine(t, b, c, d) {
          return c * Math.sin((t / d) * (Math.PI / 2)) + b;
        }

        let currentTime = 0;
        const fadeOutInterval = setInterval(() => {
          if (currentTime <= fadeOutDuration) {
            audio.volume = easeOutSine(currentTime, initialVolume, -initialVolume, fadeOutDuration);
            currentTime += 100;
          } else {
            audio.volume = 0;
            clearInterval(fadeOutInterval);
            this.pause();
            resolve(); // 渐弱暂停完成，resolve Promise
          }
        }, 100);
      });
    },

    //解决暂停后切歌导致音量为0：
    resetVolumeToInitial() {//将音量初始化
      const audio = this.$refs.audio;
      this.initialVolume = this.volume/100; // 设置初始音量为1（或者你所需的值）
      audio.volume = this.initialVolume;
    },
    //循环播放
    toggleLoop() {
      this.isLooping = !this.isLooping;
      this.$refs.loopButton.blur(); // 防止按钮的焦点样式在切换时出现
      this.$refs.audio.loop = this.isLooping;
    },

    updateProgress(event) {
      this.currentTime = event.target.currentTime;
      this.duration = event.target.duration;
    },

    seek() {
      this.$refs.audio.currentTime = this.currentTime;
    },

    selectFolder() {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.directory = true;
      input.multiple = true;
      input.accept = 'audio/*';
      input.addEventListener('change', this.handleFolderSelection);
      input.click();
    },

    handleFolderSelection(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
          this.songs.push({
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          });
          this.songsMap[files[i].name] = this.songs.length - 1;
        }
      }
      // 只有当之前没有歌曲在播放时，才进行播放
      if (!this.isPlayingAll && this.currentSong.url.trim() === '') {
        // 在这里添加一些标记或提示，等待用户点击“播放”按钮
        // 比如设置一个变量来表示需要等待播放?
        this.waitingToPlay = true;
      } else {
        // 如果有歌曲在播放或者用户点击了播放按钮，开始播放音乐
        this.waitingToPlay = false;
        this.startPlayback();
      }
    },

    startPlayback() {
      if (this.waitingToPlay) {
        // 开始播放音乐
        this.isPlayingAll = true;
        if (this.$refs.audio.paused) {
          if (this.currentTime > 0) {
            this.$refs.audio.currentTime = this.currentTime; // 使用记录的播放时间
          } else {
            this.$refs.audio.currentTime = 0; // 如果没有记录时间，从头开始播放
          }
          this.$refs.audio.play();
        } else {
          this.$refs.audio.currentTime = this.currentTime;
        }
      }
    },

    formatTime(time) {
      if (isNaN(time)) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    },

    searchSongs() {
      if (this.searchQuery.trim() !== '') {
        // 根据关键词搜索歌曲
        this.filteredSongs = this.songs.filter(song => {
          return song.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      } else {
        this.filteredSongs = []; // 清空搜索结果
      }
    },

    clearSearch() {
      this.searchQuery = ''; // 清空搜索关键词
      this.filteredSongs = []; // 清空搜索结果
    },

    outsideClickHandler(event) {
      const searchBar = this.$refs.searchBar; // 获取搜索框的引用
      if (searchBar && !searchBar.contains(event.target)) {
        // 点击的目标不在搜索框内，隐藏搜索结果并清空搜索关键词
        this.clearSearch();
      }
    },

    playCorrectSong(name) {//映射
      this.playSong(this.songsMap[name]);
    },

    adjustVolume() {
      const audio = this.$refs.audio; // 获取音频元素
      const adjustedVolume = this.volume / 100; // 将滑动条的值转换为 0 到 1 之间的范围
      audio.volume = adjustedVolume; // 直接设置音频的音量
    },
  },
};
</script>

<style>
@keyframes tada {
  from {
    transform: scale3d(1, 1, 1)
  }

  10%,
  20% {
    transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)
  }

  to {
    transform: scale3d(1, 1, 1)
  }
}

.background {
  width: 1380px;
  height: 788px;
  background-image: url('/public/images/ilovemygo.png');
  background-size: cover;
  background-position: center;
}

.music-player {
  position: relative;
  padding: 20px;
  background-color: rgb(255, 255, 255, 0.5);
  border-radius: 10px;
  width: 60%;
  margin: 0 auto;
  /* display: flex; */
  justify-content: space-between;
  /* 将按钮间距平均分布 */
}

.music-player .progress-bar-container {
  position: relative;
  width: 80%;
  /* 调整进度条容器的宽度 */
  margin: 20px auto;
  /* 居中显示 */
}

.music-player .progress-bar {
  width: 100%;
}

.music-player .time-display {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

#selectButton {
  /* 文字颜色 */
  color: #0099CC;
  /* 清除背景色 */
  background: transparent;
  /* 边框样式、颜色、宽度 */
  border: 2px solid #0099CC;
  /* 给边框添加圆角 */
  border-radius: 6px;
  /* 字母转大写 */
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  background-color: white;
  color: black;
  border: 2px solid #008CBA;
}

#selectButton:hover {
  background-color: #008CBA;
  color: white;
}

.thecurrent {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
}


.loop-button {
  color: #0099cc;
  background: transparent;
  border: 2px solid #0099cc;
  border-radius: 6px;
  font-size: 16px;
  padding: 16px 32px;
  text-align: center;
  display: inline-block;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
}

.loop-button:hover {
  background-color: #008CBA;
  color: white;
}

.loop-button.loop-active {
  background-color: #008CBA;
  color: white;
}

/* 音乐列表样式 */
.music-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  max-height: 580px;
  /* 设置最大高度 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  display: block;
}

/* music-list li 的基本样式 */
.music-list li {
  padding: 8px 12px;
  margin: 4px 0;
  background-color: #e0d3d3;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.4s, color 0.4s;
  /* 添加过渡效果 */
}

/* 当鼠标悬停在 li 元素上时的效果 */
.music-list li:hover {
  background-color: #008CBA;
  color: white;
}

.music-list button {
  background-color: rgb(255, 255, 255, 0.8);
  color: #dfc6a5;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: larger;
  transition: background-color 0.3s ease;
  animation: tada 0.6s;
}

.music-list button:hover {
  color: #f7fafb;
  background-color: #a3ceea;
}

.music-list button:active {
  animation: none;
}

/* 控制按钮样式 */
.control-button {
  /* 文字颜色 */
  color: #0099CC;
  /* 清除背景色 */
  background: transparent;
  /* 边框样式、颜色、宽度 */
  border: 2px solid #0099CC;
  /* 给边框添加圆角 */
  border-radius: 6px;
  /* 字母转大写 */
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  background-color: white;
  color: black;
  border: 2px solid #008CBA;
}

.play-all:hover {
  background-color: #008CBA;
  color: white;
}

.pause-all:hover {
  background-color: #008CBA;
  color: white;
}

/* 进度条样式 */
.progress-bar {
  width: 100%;
  height: 10px;
  appearance: none;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  margin-bottom: 10px;
}

.progress-bar::-webkit-slider-runnable-track {
  height: 16px;
  border-radius: 5px;
  background: #78accc;
  /* border:3px solid #050505; */
}

.progress-bar::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #050505;
  cursor: pointer;
  /* border:3px solid #050505; */
}

.time-display {
  text-align: center;
}

.search-bar {
  position: relative;
  display: inline-block;
}

input[type="text"] {
  margin-left: 10px;
  padding: 8px;
  font-size: 16px;
  border: 3px solid #69acc2;
  border-radius: 4px;
}

button {
  padding: 6px 10px;
  margin-left: 6px;
  font-size: 14px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

ul.search-results {
  border: 2px solid #9dccdd;
  position: absolute;
  top: 100%;
  left: 0;
  width: calc(100% - 2px);
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0;
  margin: 0;
  z-index: 1000;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

ul.search-results li {
  list-style-type: none;
  padding: 8px;
  cursor: pointer;
  /* 指针样式 */
  transition: background-color 0.4s, color 0.4s;
}

ul.search-results li:hover {
  background-color: #e0d3d3;
  cursor: pointer;
}

.search-bar button {
  /* 文字颜色 */
  color: #0099CC;
  /* 清除背景色 */
  background: transparent;
  /* 边框样式、颜色、宽度 */
  border: 2px solid #0099CC;
  /* 给边框添加圆角 */
  border-radius: 6px;
  /* 字母转大写 */
  border: none;
  color: white;
  text-align: center;
  display: inline-block;
  font-size: 17px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  background-color: white;
  color: black;
  border: 4px solid #69acc2;
  font-weight: 700;
  /* padding: 10px; */
}

.search-bar button:hover {
  background-color: #008CBA;
  color: white;
  border: 4px solid #9dccdd;
}
</style>
