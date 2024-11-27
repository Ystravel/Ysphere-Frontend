<template>
  <div class="announcement-list">
    <template v-if="!loading">
      <!-- 置頂公告區域 -->
      <div
        v-if="pinnedAnnouncements.length > 0"
        class="mb-6"
      >
        <v-row>
          <v-col
            v-for="announcement in pinnedAnnouncements"
            :key="announcement._id"
            cols="12"
          >
            <v-card
              class="pinned-notice"
              elevation="2"
              @click="$emit('view', announcement)"
            >
              <v-card-item>
                <template #prepend>
                  <v-icon
                    color="red"
                    icon="mdi-pin"
                  />
                </template>
                <v-card-title>
                  {{ announcement.title }}
                </v-card-title>
                <template #append>
                  <v-menu v-if="canEdit(announcement)">
                    <template #activator="{ Aprops }">
                      <v-btn
                        icon
                        variant="text"
                        v-bind="Aprops"
                        @click.stop
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click.stop="$emit('edit', announcement)">
                        <template #prepend>
                          <v-icon color="blue-grey">
                            mdi-pencil
                          </v-icon>
                        </template>
                        <v-list-item-title>編輯</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click.stop="$emit('delete', announcement)">
                        <template #prepend>
                          <v-icon color="red">
                            mdi-delete
                          </v-icon>
                        </template>
                        <v-list-item-title>刪除</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-card-item>
              <v-card-text>
                <div class="preview-content">
                  {{ getPreviewContent(announcement.content) }}
                </div>
                <div class="mt-4 d-flex align-center text-caption text-medium-emphasis">
                  <v-icon
                    size="small"
                    class="me-1"
                  >
                    mdi-account
                  </v-icon>
                  {{ announcement.author.name }}
                  <v-icon
                    size="small"
                    class="ms-4 me-1"
                  >
                    mdi-clock-outline
                  </v-icon>
                  {{ formatDate(announcement.createdAt) }}
                  <v-icon
                    v-if="announcement.attachments?.length"
                    size="small"
                    class="ms-4 me-1"
                  >
                    mdi-attachment
                  </v-icon>
                  <span v-if="announcement.attachments?.length">
                    {{ announcement.attachments.length }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- 一般公告區域 -->
      <v-row>
        <v-col
          v-for="announcement in regularAnnouncements"
          :key="announcement._id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            elevation="1"
            height="100%"
            @click="$emit('view', announcement)"
          >
            <v-card-item>
              <template #prepend>
                <v-chip
                  :color="getTypeColor(announcement.type)"
                  size="small"
                  variant="outlined"
                >
                  {{ announcement.type }}
                </v-chip>
              </template>
              <v-card-title>{{ announcement.title }}</v-card-title>
              <template #append>
                <v-menu v-if="canEdit(announcement)">
                  <template #activator="{ Bprops }">
                    <v-btn
                      icon
                      variant="text"
                      v-bind="Bprops"
                      @click.stop
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click.stop="$emit('edit', announcement)">
                      <template #prepend>
                        <v-icon color="blue-grey">
                          mdi-pencil
                        </v-icon>
                      </template>
                      <v-list-item-title>編輯</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="$emit('delete', announcement)">
                      <template #prepend>
                        <v-icon color="red">
                          mdi-delete
                        </v-icon>
                      </template>
                      <v-list-item-title>刪除</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-card-item>
            <v-card-text>
              <div class="preview-content">
                {{ getPreviewContent(announcement.content) }}
              </div>
              <div class="mt-4 d-flex align-center text-caption text-medium-emphasis">
                <v-icon
                  size="small"
                  class="me-1"
                >
                  mdi-account
                </v-icon>
                {{ announcement.author.name }}
                <v-icon
                  size="small"
                  class="ms-4 me-1"
                >
                  mdi-clock-outline
                </v-icon>
                {{ formatDate(announcement.createdAt) }}
                <v-icon
                  v-if="announcement.attachments?.length"
                  size="small"
                  class="ms-4 me-1"
                >
                  mdi-attachment
                </v-icon>
                <span v-if="announcement.attachments?.length">
                  {{ announcement.attachments.length }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <div
      v-else
      class="d-flex justify-center align-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import UserRole from '@/enums/UserRole'
import { format } from 'date-fns'

const props = defineProps({
  announcements: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const user = useUserStore()

// 分離置頂和一般公告
const pinnedAnnouncements = computed(() =>
  props.announcements.filter(a => a.type === '置頂')
)

const regularAnnouncements = computed(() =>
  props.announcements.filter(a => a.type !== '置頂')
)

// 權限檢查
const canEdit = (announcement) => {
  return user.role >= UserRole.ADMIN || announcement.author._id === user._id
}

// 格式化日期
const formatDate = (date) => {
  return format(new Date(date), 'yyyy/MM/dd HH:mm')
}

// 獲取公告類型顏色
const getTypeColor = (type) => {
  const colors = {
    置頂: 'red',
    重要: 'error',
    活動: 'warning',
    系統: 'info',
    一般: 'grey'
  }
  return colors[type] || 'grey'
}

// 獲取預覽內容
const getPreviewContent = (content) => {
  const div = document.createElement('div')
  div.innerHTML = content
  const text = div.textContent || div.innerText
  return text.length > 100 ? text.slice(0, 100) + '...' : text
}

defineEmits(['view', 'edit', 'delete'])
</script>

<style lang="scss" scoped>
.preview-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 3em;
}

.pinned-notice {
  border-left: 4px solid #FF5252;
  background-color: #FFF8F8;
}
</style>
