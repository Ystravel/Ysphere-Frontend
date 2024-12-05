<!-- eslint-disable vue/prop-name-casing -->
<!-- eslint-disable vue/prop-name-casing -->
<template>
  <v-card
    class="custom-card d-flex flex-column"
    width="100%"
    @click="$router.push(`/announcement/${props._id}`)"
  >
    <v-row class="flex-grow-1">
      <!-- 左側圖片區域 -->
      <v-col
        cols="12"
        sm="5"
      >
        <v-img
          v-if="firstImage"
          :src="firstImage"
          width="100%"
          class="announcement-img"
          cover
        />
        <div
          v-else
          class="announcement-img d-flex align-center justify-center bg-grey-lighten-3"
        >
          <v-icon
            size="64"
            color="grey"
          >
            mdi-newspaper-variant-outline
          </v-icon>
        </div>
      </v-col>

      <!-- 右側內容區域 -->
      <v-col
        cols="12"
        sm="7"
      >
        <v-card-text class="d-flex flex-column justify-space-between h-100 py-0">
          <!-- 標題和類型 -->
          <div>
            <div class="d-flex align-center mb-2">
              <v-chip
                :color="getTypeColor(props.type)"
                :text-color="getTypeTextColor(props.type)"
                size="small"
                class="me-2"
              >
                {{ props.type }}
              </v-chip>
              <div class="text-h6 text-blue-grey-darken-3 text-truncate">
                {{ props.title }}
              </div>
            </div>
            <!-- 內容預覽 -->
            <div class="preview-text mb-4">
              {{ contentPreview }}
            </div>
          </div>

          <!-- 發布資訊 -->
          <div class="info-section">
            <div class="d-flex align-center mb-2">
              <v-icon
                size="small"
                color="grey"
                class="me-1"
              >
                mdi-account
              </v-icon>
              <span class="text-grey text-caption">{{ props.author?.name }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon
                size="small"
                color="grey"
                class="me-1"
              >
                mdi-clock-outline
              </v-icon>
              <span class="text-grey text-caption">{{ formatDate(props.createdAt) }}</span>
            </div>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  _id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  author: { type: Object, required: true },
  createdAt: { type: String, required: true }
})

// 從內容中提取第一張圖片的URL
const firstImage = computed(() => {
  const imgRegex = /<img[^>]+src="([^">]+)"/
  const match = props.content.match(imgRegex)
  return match ? match[1] : null
})

// 內容預覽（去除HTML標籤，限制字數）
const contentPreview = computed(() => {
  const plainText = props.content.replace(/<[^>]+>/g, '')
  return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText
})

// 類型顏色映射
const typeColors = {
  置頂: 'red',
  重要: 'orange',
  活動: 'green',
  系統: 'blue',
  一般: 'grey'
}

const getTypeColor = (type) => typeColors[type] || 'grey'
const getTypeTextColor = (type) => type === '一般' ? 'black' : 'white'

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.custom-card {
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }

  .announcement-img {
    height: 200px;
    border-radius: 8px;
  }

  .preview-text {
    font-size: 14px;
    color: #666;
    display: block;
    max-height: 4.5em;
    overflow: hidden;
    line-height: 1.5;
    position: relative;

    &::after {
      content: "...";
      position: absolute;
      bottom: 0;
      right: 0;
      padding-left: 1em;
      background: linear-gradient(to right, transparent, white 50%);
    }
  }

  .info-section {
    font-size: 12px;
  }
}

@media (min-width: 960px) {
  .custom-card {
    padding: 24px;
  }
}
</style>
