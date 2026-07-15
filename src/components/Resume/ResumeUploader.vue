<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FileText, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

const dragging = ref(false)
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function openFilePicker() {
  fileInput.value?.click()
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  const dropped = e.dataTransfer?.files[0]
  if (dropped && isValid(dropped)) {
    file.value = dropped
    emit('upload', dropped)
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0]
  if (selected && isValid(selected)) {
    file.value = selected
    emit('upload', selected)
  }
}

function isValid(f: File) {
  return f.type === 'application/pdf' || f.name.endsWith('.docx')
}

function clearFile() {
  file.value = null
}
</script>

<template>
  <div class="card p-6">
    <h3 class="mb-4 font-display text-base font-semibold text-slate-900">
      第一步：上传简历
    </h3>

    <div
      class="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-all"
      :class="dragging ? 'border-primary-400 bg-primary-50' : 'hover:border-slate-400 hover:bg-slate-100'"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
      @click="openFilePicker"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".pdf,.docx"
        class="hidden"
        @change="handleFileChange"
      >

      <div
        v-if="!file"
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50"
      >
        <Upload class="h-8 w-8 text-primary-600" />
      </div>

      <div
        v-else
        class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3"
      >
        <FileText class="h-8 w-8 text-accent-amber" />
        <div class="text-left">
          <p class="text-sm font-medium text-slate-800">
            {{ file.name }}
          </p>
          <p class="text-xs text-slate-500">
            {{ (file.size / 1024).toFixed(1) }} KB
          </p>
        </div>
        <button
          class="ml-4 rounded-lg p-1 text-slate-500 hover:text-red-500"
          @click.stop="clearFile"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <p class="mt-4 text-sm font-semibold text-slate-800">
        {{ file ? '点击或拖拽更换文件' : '点击或拖拽上传简历' }}
      </p>
      <p class="mt-1 text-xs text-slate-500">
        支持 PDF / DOCX 格式，最大 10MB
      </p>
    </div>
  </div>
</template>
