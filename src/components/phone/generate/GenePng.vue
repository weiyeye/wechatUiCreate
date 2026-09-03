<template>
  <a-tooltip title="滚动到哪截到哪" placement="right">
    <div class="wtc-button" @click="handleGeneratePng">生成图片</div>
  </a-tooltip>
  <a-tooltip title="顾名思义" placement="right">
    <div class="wtc-button" @click="handleGenerateLongPng">生成长图</div>
  </a-tooltip>

  <a-drawer :width="500" :title="drawerTitle" placement="right" :closable="false" :destroyOnClose="true" :open="drawerVisible" @close="onClose">
    <template #extra>
      <a-space>
        <a-button type="primary" :disabled="!imageUrl" :loading="isSaving" @click="handleDownload">下载</a-button>
        <a-button danger type="link" shape="circle" :icon="h(CloseOutlined)" :disabled="!imageUrl" @click="onClose" />
      </a-space>
    </template>
    <img class="generated-image" :src="imageUrl" alt="生成的聊天图片">
  </a-drawer>
</template>

<script setup>
import { ref, h } from "vue";
import { CloseOutlined } from '@ant-design/icons-vue';
import dayjs from "dayjs";
import { useHtmlToImage } from '@/hooks/useHtmlToImage';
import { saveDownloadWithFeedback } from "@/utils/download";
import useStore from "@/store";
const { imageUrl, captureHtmlToImage } = useHtmlToImage();
const { useSystemStore } = useStore();

const drawerVisible = ref(false);
const drawerTitle = ref('');
const isSaving = ref(false);

const prepareHighResolutionClone = (clonedDocument) => {
  // 预览层使用了 0.32 左右的缩放；导出副本必须移除该缩放才能铺满原始画布。
  const phoneScale = clonedDocument.querySelector('.phone-scale');
  if (phoneScale) phoneScale.style.transform = 'none';
};

// 生成图片
const handleGeneratePng = async () => {
  const phone = document.querySelector('#phone');
  await captureHtmlToImage(phone, {
    width: useSystemStore.phoneWidth,
    height: useSystemStore.phoneHeight,
    scale: 1,
    onclone: prepareHighResolutionClone,
  });
  drawerVisible.value = true;
  drawerTitle.value = "生成图片";
}

// 生成长图
const handleGenerateLongPng = async () => {
  const wechatContent = document.querySelector('.wechat-content')
  const phoneBg = document.querySelector('.phone-bg')
  const chatBackground = useSystemStore.appearance.chatBackground
  const phone = document.querySelector('#phone')
  const phoneBody = document.querySelector('.phone-body')
  const phoneRealHeight = useSystemStore.phoneHeight > wechatContent.scrollHeight + 264 + 269 ? useSystemStore.phoneHeight : wechatContent.scrollHeight + 264 + 269;
  const backgroundImage = phoneBg.querySelector('img');

  phone.style.height = phoneRealHeight + "px";
  phoneBody.scrollTop = 0;
  if (chatBackground) {
    phoneBody.style.background = `url(${chatBackground}) repeat-y center top`;
    phoneBody.style.backgroundSize = `${useSystemStore.phoneWidth}px 2036px`;
    backgroundImage?.setAttribute('src', '');
  }

  try {
    // 等待高清长图完成后再恢复预览高度，避免截到恢复后的画面。
    await captureHtmlToImage(phone, {
      width: useSystemStore.phoneWidth,
      height: phoneRealHeight,
      scale: 1,
      onclone: prepareHighResolutionClone,
    });
  } finally {
    phone.style.height = useSystemStore.phoneHeight + "px";
    if (chatBackground) {
      backgroundImage?.setAttribute('src', chatBackground);
      phoneBody.style.background = "";
      phoneBody.style.backgroundSize = "";
    }
  }
  drawerVisible.value = true;
  drawerTitle.value = "生成长图";
}

const onClose = () => {
  drawerVisible.value = false;
  imageUrl.value = "";
}

const handleDownload = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  await saveDownloadWithFeedback({
    source: imageUrl.value,
    fileName: `微信聊天图片 - ${dayjs().format('YYYYMMDDHHmmss')}.png`,
    filterName: "PNG 图片",
  });
  isSaving.value = false;
}
</script>

<style scoped>
.generated-image {
  display: block;
  width: 100%;
  height: auto;
}
</style>
