<template>
  <div id="app">
    <div id="js-search-box" class="search-box">
      <div id="js-icon" class="icon">
        <img src="./assets/icon.png">
      </div>
      <div class="country">
        <div @click="openDropdown" class="click"></div>
        <span>{{ country }}</span>
        <ul v-if="showDropdown" class="dropdown">
          <li v-for="country in countryList" :key="country.id" @click="changeCountry(country)">
            {{ country.flag }} <span>{{ country.name }}</span>
          </li>
        </ul>
      </div>
      <input v-model="keyword" id="js-input" placeholder="请输入关键词" type="text" @keydown="clickEnter">
      <span class="delete-button" v-if="keyword" @click="deleteKeyword">×</span>
      <button :class="{ 'no-content': !keyword }" @click="search">搜索</button>
    </div>
    <div v-if="loading" class="loader"></div>
    <div v-if="errored" class="error">😯出错了，刷新试试吧</div>
    <div class="search-result" v-if="info !== null">
      <template v-if="info.data.resultCount > 0"> 
        <div class="item" v-for="(item, index) in info.data.results" :key="index">
          <a :href="item.trackViewUrl" target="_blank">
            <img :src="item.artworkUrl100" class="logo">
            <div class="title">
              <div class="name">
                {{ item.trackName }}
                <span class="price" v-if="item.price !== 0">¥{{ item.price }}</span>
              </div>
              <div class="developer">{{ item.artistName }}</div>
              <div v-if="item.averageUserRating" class="rating">
                <span class="star" :style="{ width: (item.averageUserRating / 5) * 60 + 'px' }">★★★★★</span>
                <template v-if="item.userRatingCount">
                  <span class="num" v-text="numberConvert(item.userRatingCount)"></span>
                </template>
              </div>
              <div class="rating" v-else><span class="no-rating">评分人数不足</span></div>
            </div>
            <div class="screenshot">
              <img v-for="(screenshot, index) in item.screenshotUrls" v-if="index <= 2" :src="screenshot" :key="screenshot.id">
            </div>
            <div class="genres-group">
              <span v-for="genre in item.genres" :key="genre.id">{{ genre }}</span>
            </div>
          </a>
        </div>
      </template>
      <template v-else>
        <div class="no-result">没有搜到任何内容😅</div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from 'qs';

export default {
  name: 'app',
  data() {
    return {
      loading: false,
      errored: false,
      keyword: '',
      country: '🇨🇳',
      countryText: 'cn',
      info: null,
      showDropdown: false,
      countryList: [{
        flag: '🇨🇳',
        name: '中国大陆',
        text: 'cn'
      },{
        flag: '🇺🇸',
        name: '美国',
        text: 'us'
      },{
        flag: '🇯🇵',
        name: '日本',
        text: 'jp'
      }]
    }
  },
  methods: {
    openDropdown () {
      this.showDropdown = !this.showDropdown
    },
    changeCountry (e) {
      this.countryText = e.text
      this.country = e.flag
      this.showDropdown = false
    },
    clickEnter (event) {
      if (event.key === 'Enter' && this.keyword) {
        this.search ()
      }
    },
    search () {
      document.getElementById("js-search-box").classList.add("fixed")
      document.getElementById("js-icon").classList.add("hide")
      this.info = null
      this.loading = true
      const reqParams = { name: 'search' }
      const url = `https://itunes.apple.com/search?term=${this.keyword}&country=${this.countryText}&entity=software`
      axios
        .post(url, qs.stringify({ params: reqParams }))
        .then(response => (this.info = response))
        .catch(() => this.errored = true)
        .finally(() => this.loading = false)
    },
    deleteKeyword () {
      this.keyword = ''
      document.getElementById("js-input").focus()
    },
    numberConvert (e) {
      if (e >= 10000) {
        return '(' + (e / 10000).toFixed(1) + 'w)'
      } else {
        return '(' + e + ')'
      }
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  background-color: white;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  $main-color: #3388FF;

  .search-box {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    text-align: center;
    transition: .5s;

    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 30px;

      img {
        width: 100%;
        height: 100%;
      }

      &.hide {
        display: none;
      }
    }

    .country {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      padding-left: 10px;
      width: 46px;
      height: 36px;
      border-radius: 6px;
      font-size: 24px;
      border: 2px solid #ddd;
      transition: .2s;
      cursor: pointer;
      text-align: left;

      &:hover {
        background-color: #f0f0f0;
      }

      &:before {
        content: "";
        position: absolute;
        top: 16px;
        right: 6px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #999;
      }

      .click {
        position: absolute;
        width: 60px;
        height: 40px;
        top: -2px;
        left: -2px;
      }

      .dropdown {
        position: absolute;
        top: 20px;
        left: 0;
        padding: 0;
        width: 120px;
        text-align: left;
        box-shadow: 0 2px 10px rgba(0,0,0,.1);
        border-radius: 6px;
        overflow: hidden;
        background-color: white;

        li {
          padding: 10px;
          list-style: none;
          cursor: pointer;

          &:hover {
            background-color: #f0f0f0;
          }

          span {
            font-size: 14px;
          }
        }
      }
    }

    input, button {
      display: inline-block;
      border-radius: 6px;
      font-size: 18px;
      outline: none;
    }

    input {
      width: calc(100% - 240px);
      max-width: 270px;
      padding: 8px 40px 8px 10px;
      border: 2px solid #ddd;
      -webkit-appearance: none;
      &::-webkit-input-placeholder { color: #999; }
    }

    button {
      background-color: $main-color;
      color: white;
      border: none;
      padding: 8px 20px;
      margin-left: 10px;
      cursor: pointer;
      font-weight: bold;
      transition: .2s;

      &:hover {
        background-color: #1b70e6;
      }

      &.no-content {
        opacity: .4;
        pointer-events: none;
      }
    }

    .delete-button {
      position: absolute;
      margin-left: -30px;
      margin-top: 3px;
      font-size: 24px;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #333;
      }
    }

    &.fixed {
      top: 0;
      left: 0;
      transform: none;
      background-color: white;
      padding: 20px 0;
      box-shadow: 0 4px 20px rgba(0,0,0,.1);
      text-align: center;
    }
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #38f;
    border-top-color: transparent;
    animation: rolling 1s infinite linear;

    @keyframes rolling {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  .no-result, .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .search-result {
    padding: 100px 0;   
    margin: 20px auto;
    text-align: center;
    max-width: 1600px;

    a {
      color: #333;
      text-decoration: none;
    }

    .item {
      display: inline-block;
      margin: 0 20px 20px;
      padding: 20px 30px;
      width: 300px;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: .2s;
      vertical-align: top;

      &:hover {
        box-shadow: 0 2px 10px rgba(0,0,0,.1);
      }

      .logo {
        width: 64px;
        height: 64px;
        border: 1px solid #f0f0f0;
        border-radius: 16px;
        float: left;
      }

      .title {
        margin: 0 0 20px;
        padding-left: 75px;

        .name {
          font-size: 18px;
          font-weight: bold;
          line-height: 23px;

          .price {
            margin-left: 3px;
            padding: 1px 5px;
            border-radius: 3px;
            font-size: 13px;
            color: white;
            background-color: orange;
            vertical-align: middle;
          }
        }

        .developer {
          font-size: 14px;
          color: #aaa;
          line-height: 16px;
          margin: 6px 0 4px;
        }

        .name, .developer {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .rating {
          line-height: 1;

          .star {
            display: inline-block;
            overflow: hidden;
            font-size: 12px;
            line-height: 1;
            color: #E4B465;
            vertical-align: middle;
          }

          .num {
            margin-left: 4px;
            font-size: 12px;
            color: #999;
          }

          .no-rating {
            color: #999;
            font-size: 12px;
          }
        }
      }

      .screenshot {
        img {
          width: 94px;
          min-height: 55px;
          background-color: #f0f0f0;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          margin-right: 6px;
          vertical-align: top;

          &:last-of-type {
            margin-right: 0;
          }
        }
      }

      .genres-group {
        margin-top: 8px;

        span {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          margin: 0 5px 5px 0;
          background-color: #f0f0f0;
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
}
</style>
