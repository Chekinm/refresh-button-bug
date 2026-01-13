<script setup>
import { onMounted } from 'vue';
import { useDataStore } from './composables/useDataStore';
import { useAutoRefresh } from './composables/useAutoRefresh';
import RefreshButton from './components/RefreshButton.vue';

const { posts, postPhotos, isLoading, refreshData, initializeStore } =
  useDataStore();

const { countdown, isAutoRefreshEnabled, manualRefresh } = useAutoRefresh(
  refreshData,
  10000
);

onMounted(() => {
  initializeStore();
});

const getPhotoForPost = (postId) => {
  return postPhotos.value.find((p) => p.postId === postId);
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📝 Posts Dashboard</h1>
      <p class="subtitle">Автообновление каждые 10 секунд</p>
    </header>

    <div class="controls">
      <RefreshButton
        @refresh="manualRefresh"
        :countdown="countdown"
        :isRefreshing="isLoading"
        :isAutoRefreshEnabled="isAutoRefreshEnabled"
      />
    </div>

    <div v-if="isLoading && posts.length === 0" class="loading-state">
      <span class="spinner">&#128257;</span>
      <p>Загрузка данных...</p>
    </div>

    <div v-else class="posts-grid">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div v-if="getPhotoForPost(post.id)" class="post-photo">
          <img
            :src="getPhotoForPost(post.id).thumbnailUrl"
            :alt="`Photo for post ${post.id}`"
            crossorigin="anonymous"
          />
        </div>
        <div class="post-content">
          <div class="post-header">
            <h3>{{ post.title }}</h3>
          </div>
          <p class="post-body">{{ post.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.app-header {
  text-align: center;
  margin-bottom: 32px;
}

.app-header h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.loading-state {
  text-align: center;
  padding: 48px;
  color: #7f8c8d;
}

.loading-state .spinner {
  font-size: 32px;
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.post-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-photo {
  width: 100%;
  height: 150px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 20px;
}

.post-header {
  margin-bottom: 12px;
}

.post-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.post-body {
  color: #555;
  line-height: 1.6;
  margin: 0;
}
</style>
