<template>
  <v-container max-width="1400">
    <h2 class="my-6">
      公司及部門管理
    </h2>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-btn
              prepend-icon="mdi-domain-plus"
              variant="outlined"
              color="orange-darken-2"
              @click="openCompanyDialog"
            >
              新增公司
            </v-btn>
            <v-btn
              prepend-icon="mdi-account-multiple-plus"
              class="ms-4"
              variant="outlined"
              color="blue-grey-darken-1"
              @click="openDepartmentDialog"
            >
              新增部門
            </v-btn>
          </v-col>
          <v-col
            cols="3"
            class="d-flex justify-end"
          >
            <v-text-field
              v-model="tableSearch"
              label="搜尋"
              append-inner-icon="mdi-magnify"
              base-color="#666"
              color="blue-grey-darken-3"
              variant="outlined"
              density="compact"
              max-width="240"
              @keydown.enter="tableLoadItems(true)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <!-- 公司的 v-data-table 可根據需求放置於此 -->
      </v-col>
    </v-row>
  </v-container>

  <!-- 新增或編輯公司 Dialog -->
  <v-dialog
    v-model="companyDialog.open"
    persistent
    width="800"
  >
    <v-form @submit.prevent="submitCompany">
      <v-card class="rounded-lg pa-4 pt-6">
        <v-card-title>新增公司</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="companyName"
            label="公司名稱"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-lighten-1"
            variant="outlined"
            @click="closeCompanyDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            type="submit"
          >
            送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- 新增或編輯部門 Dialog -->
  <v-dialog
    v-model="departmentDialog.open"
    persistent
    width="800"
  >
    <v-form @submit.prevent="submitDepartment">
      <v-card class="rounded-lg pa-4 pt-6">
        <v-card-title>新增部門</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="departmentName"
            label="部門名稱"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-lighten-1"
            variant="outlined"
            @click="closeDepartmentDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            type="submit"
          >
            送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const companyDialog = ref({ open: false })
const departmentDialog = ref({ open: false })
const companyName = ref('')
const departmentName = ref('')

// 開啟對話框
const openCompanyDialog = () => (companyDialog.value.open = true)
const openDepartmentDialog = () => (departmentDialog.value.open = true)

// 關閉對話框
const closeCompanyDialog = () => {
  companyDialog.value.open = false
  companyName.value = ''
}
const closeDepartmentDialog = () => {
  departmentDialog.value.open = false
  departmentName.value = ''
}

// 提交函式
const submitCompany = () => {
  // 實際提交邏輯放置於此
}
const submitDepartment = () => {
  // 實際提交邏輯放置於此
}
</script>
