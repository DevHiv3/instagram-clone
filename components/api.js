// api.js
export const fetchPostById = async (postId, token, baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/post/${postId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching post');
    }
  };
  