import { ref } from 'vue';

const posts = ref([]);
const postPhotos = ref([]);
const isLoading = ref(false);

async function fetchPosts() {
  isLoading.value = true;

  try {
    const randomOffset = Math.floor(Math.random() * 50);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=${randomOffset}&_limit=5`
    );
    const data = await response.json();
    posts.value = data;
    return data;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
}

async function loadPostPhotos(posts) {

  try {
    const photos = await Promise.all(
      posts.map(async (post) => {
        const response = await fetch(
          `https://picsum.photos/id/${(post.id % 100) + 1}/info`
        );
        const photoInfo = await response.json();

        return {
          postId: post.id,
          photoUrl: photoInfo.download_url,
          thumbnailUrl: `https://picsum.photos/id/${photoInfo.id}/150/150`,
          author: photoInfo.author,
        };
      })
    );

    postPhotos.value = photos;
  } catch (error) {
    console.error('❌ Error loading photos:', error);
    throw error;
  }
}

async function refreshData() {
  const postsData = await fetchPosts();
  await loadPostPhotos(postsData);
}

async function initializeStore() {
  await refreshData();
}

export function useDataStore() {
  return {
    posts,
    postPhotos,
    isLoading,
    fetchPosts,
    loadPostPhotos,
    refreshData,
    initializeStore,
  };
}
