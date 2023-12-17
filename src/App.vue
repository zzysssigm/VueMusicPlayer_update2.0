<!-- <template>
  <div>
    <audio ref="audio" :src="currentSong.url"></audio>
    <button @click="play">播放</button>
    <button @click="pause">暂停</button>
    <div>
      <input type="range" min="0" :max="duration" v-model="currentTime" />
    </div>
    <ul>
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songs: [
        { name: "Song 1", url: "/path/to/song1.mp3" },
        { name: "Song 2", url: "/path/to/song2.mp3" },
        { name: "Song 3", url: "/path/to/song3.mp3" },
      ],
      currentSong: { name: "", url: "" },
      currentTime: 0,
      duration: 0,
    };
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },
    pause() {
      this.$refs.audio.pause();
    },
    playSong(index) {
      this.currentSong = this.songs[index];
      this.$refs.audio.load();
      this.$refs.audio.play();
    },
  },
  mounted() {
    this.$refs.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.$refs.audio.currentTime;
      this.duration = this.$refs.audio.duration;
    });
  },
};
</script> -->
<!-- <template>
  <div>
    <button @click="selectFolder">选择文件夹</button>
    <audio ref="audio" :src="currentSong.url"></audio>
    <ul>
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songs: [],
      currentSong: { name: "", url: "" },
    };
  },
  methods: {
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
      this.songs = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
          this.songs.push({
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          });
        }
      }
    },
    play() {
    this.$refs.audio.play();
  },
  pause() {
    this.$refs.audio.pause();
  },
  playSong(index) {
    this.currentSong = this.songs[index];
    this.$refs.audio.load();
    this.$refs.audio.addEventListener('canplaythrough', () => {
      this.$refs.audio.play();
    }, { once: true }); // 保证只触发一次
  },
  },
};
</script> -->
<!-- <template>
  <div>
    <input type="file" @change="handleFolderSelection" webkitdirectory directory multiple accept="audio/*" style="display: none;" ref="folderInput" />
    <button @click="selectFolder">选择文件夹</button>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
    <button @click="playAll">全部播放</button>
    <button @click="pauseAll">全部暂停</button>
    <button @click="play">播放</button>
    <button @click="pause">暂停</button>
    <div>
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seek"
      />
    </div>
    <ul>
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
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
      isPlayingAll: false,
      currentSongIndex: 0,
    };
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },
    pause() {
      this.$refs.audio.pause();
    },
    playSong(index) {
      this.currentSong = this.songs[index];
      this.currentSongIndex = index;
      this.$refs.audio.load();
      this.$refs.audio.play();
    },
    playAll() {
      this.isPlayingAll = true;
      this.playSong(this.currentSongIndex);
    },
    pauseAll() {
      this.isPlayingAll = false;
      this.pause();
    },
    updateProgress(event) {
      this.currentTime = event.target.currentTime;
      this.duration = event.target.duration;
      if (this.isPlayingAll && this.currentTime >= this.duration) {
        if (this.currentSongIndex < this.songs.length - 1) {
          this.currentSongIndex++;
          this.playSong(this.currentSongIndex);
        } else {
          this.isPlayingAll = false;
        }
      }
    },
    seek() {
      this.$refs.audio.currentTime = this.currentTime;
    },
    selectFolder() {
      this.$refs.folderInput.click();
    },
    handleFolderSelection(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
          this.songs.push({
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          });
        }
      }
    },
  },
};
</script> -->
<!-- <template>
  <div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
    <button @click="selectFolder">选择文件夹</button>
    <button @click="playAll">全部播放</button>
    <button @click="pauseAll">全部暂停</button>
    <ul>
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songs: [],
      currentSong: { name: "", url: "" },
      isPlayingAll: false,
      currentSongIndex: 0,
    };
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },

    pause() {
      this.$refs.audio.pause();
    },

    pauseAll() {
      this.isPlayingAll = false;
      this.pause();
    },
    playSong(index) {
      this.currentSong = this.songs[index];
      this.currentSongIndex = index;
      this.$refs.audio.src = this.currentSong.url; // 设置新的音频源
      this.$refs.audio.load(); // 可选 - 手动触发加载
      this.$refs.audio.addEventListener('canplaythrough', () => {
        this.$refs.audio.play(); // 当音频准备好时播放
      }, { once: true });
    },
    playAll() {
      this.isPlayingAll = true;
      this.playSong(this.currentSongIndex);
    },
    updateProgress() {
      // 更新播放进度
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
        }
      }
    },
  },
};
</script>-->
<!-- <template>
  <div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
    <button @click="selectFolder">选择文件夹</button>
    <button @click="playAll">全部播放</button>
    <button @click="pauseAll">全部暂停</button>
    <input
      type="range"
      min="0"
      :max="duration"
      v-model="currentTime"
      @input="seek"
      class="progress-bar"
    />
    <ul>
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
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
      isPlayingAll: false,
      currentSongIndex: 0,
    };
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },

    pause() {
      this.$refs.audio.pause();
    },

    pauseAll() {
      this.isPlayingAll = false;
      this.pause();
    },

    playSong(index) {
      this.currentSong = this.songs[index];
      this.currentSongIndex = index;
      this.$refs.audio.src = this.currentSong.url;
      this.$refs.audio.load();
      this.$refs.audio.addEventListener('canplaythrough', () => {
        this.$refs.audio.play();
      }, { once: true });
    },

    playAll() {
      this.isPlayingAll = true;
      this.playSong(this.currentSongIndex);
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
        }
      }
    },
  },
};
</script>

<style>
/* 样式化进度条 */
.progress-bar {
  width: 100%;
  height: 10px;
  appearance: none;
  background: #ddd;
  border-radius: 5px;
  outline: none;
}

/* 进度条填充样式 */
.progress-bar::-webkit-slider-runnable-track {
  height: 10px;
  border-radius: 5px;
  background: #3498db;
}

/* 进度条滑块样式 */
.progress-bar::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}
</style> -->
<!-- <template>
  <div class="music-player">
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
    <button @click="selectFolder">选择文件夹</button>
    <button @click="playAll" class="control-button play-all">全部播放</button>
    <button @click="pauseAll" class="control-button pause-all">暂停</button>
    <input
      type="range"
      min="0"
      :max="duration"
      v-model="currentTime"
      @input="seek"
      class="progress-bar"
    />
    <ul class="music-list">
      <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template> -->
<template>
  <div class="background">
    <div class="music-player">
      <audio ref="audio" :src="currentSong.url" @timeupdate="updateProgress"></audio>
      <button @click="selectFolder" id="selectButton">选择文件夹</button>
      <button @click="playAll" class="control-button play-all">全部播放</button>
      <button @click="pauseAll" class="control-button pause-all">{{ pauseButtonText }}</button>
      <button ref="loopButton" class="loop-button" :class="{ 'loop-active': isLooping }" @click="toggleLoop">单曲循环</button>
      <!-- <button @click="pauseAll" class="control-button pause-all"></button> -->
      <div class="progress-bar-container">
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="progress-bar" />
        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
      <ul class="music-list">
        <li v-for="(song, index) in songs" :key="index" @click="playSong(index)">
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
      isPlayingAll: false,
      currentSongIndex: 0,
      firstSongIndex: 0,
      isLooping: false, // 标志单曲循环状态
      fadeOutInterval: null,
      initialVolume: 1, // 记录初始音量
    };
  },
  computed: {
    pauseButtonText() {
      return this.isPlayingAll ? '暂停' : '继续播放';
    }
  },
  methods: {
    play() {
      this.$refs.audio.play();
    },

    // pause() {
    //   if (this.fadeOutInterval) {
    //     clearInterval(this.fadeOutInterval);
    //     this.fadeOutInterval = null;
    //   }

    //   const audio = this.$refs.audio;
    //   audio.pause();
    // },

    pause() {
      const audio = this.$refs.audio;
      audio.pause();
    },

    pauseAll() {
      const audio = this.$refs.audio;

      if (audio.paused) {
        this.isPlayingAll = true;
        audio.currentTime = this.currentTime;
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

    // playSong(index) {
    //   this.resetVolumeToInitial();
    //   if (!this.isPlayingAll) {
    //     this.isPlayingAll = true;
    //     this.currentSong = this.songs[index];
    //     this.currentSongIndex = index;
    //     this.$refs.audio.src = this.currentSong.url;
    //     this.$refs.audio.load();
    //     this.$refs.audio.addEventListener('canplaythrough', () => {
    //       this.$refs.audio.play();
    //     }, { once: true });
    //   } else {
    //     this.pause(); // 先暂停当前播放的歌曲
    //     // 然后播放新的歌曲
    //     this.isPlayingAll = true;
    //     this.currentSong = this.songs[index];
    //     this.currentSongIndex = index;
    //     this.$refs.audio.src = this.currentSong.url;
    //     this.$refs.audio.load();
    //     this.$refs.audio.addEventListener('canplaythrough', () => {
    //       this.$refs.audio.play();
    //     }, { once: true });
    //   }
    // },

    playSong(index) {
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
          const nextIndex = (this.currentSongIndex + 1) % this.songs.length;
          this.playSong(nextIndex);
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

    //   fadeOutAndPause() {
    //   return new Promise((resolve) => {
    //     const audio = this.$refs.audio;
    //     const fadeOutDuration = 2000; // 渐弱持续时间，单位毫秒
    //     const initialVolume = audio.volume;
    //     const step = initialVolume / (fadeOutDuration / 100);

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
    fadeOutAndPause() {
      return new Promise((resolve) => {
        const audio = this.$refs.audio;
        const fadeOutDuration = 500; // 渐弱持续时间，单位毫秒
        const initialVolume = audio.volume;
        const step = initialVolume / (fadeOutDuration / 100);

        const fadeOutInterval = setInterval(() => {
          if (audio.volume - step > 0) {
            audio.volume -= step;
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
      this.initialVolume = 1; // 设置初始音量为1（或者你所需的值）
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
        }
      }
      // 只有当之前没有歌曲在播放时，才进行播放
      if (!this.isPlayingAll && this.currentSong.url.trim() === '') {
        // 在这里添加一些标记或提示，等待用户点击“播放”按钮
        // 比如设置一个变量来表示需要等待播放
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

  },
};
</script>

<style>
.background {
  width: 1350px;
  height: 785px;
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
}

.progress-bar::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #050505;
  cursor: pointer;
}

.time-display {
  text-align: center;
}
</style>
