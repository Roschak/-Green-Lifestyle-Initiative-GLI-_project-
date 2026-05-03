const db = require('../config/db');

// Create new article
exports.createArticle = async (req, res) => {
  try {
    console.log('📝 Creating article...');
    console.log('Body:', req.body);
    console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');
    console.log('User:', req.user?.email);

    const { title, description, content, category, featured, status } = req.body;
    
    // Validation
    if (!title || !description || !content || !category) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title, description, content, dan category harus diisi'
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      console.log('❌ User not authenticated');
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Convert featured from string to boolean if needed
    let isFeatured = featured;
    if (typeof featured === 'string') {
      isFeatured = featured === 'true' || featured === '1';
    }

    // Handle file upload - supports both Cloudinary and local storage
    let imageUrl = '/images/default-article.png';
    if (req.file) {
      // Cloudinary storage returns secure_url
      if (req.file.secure_url) {
        imageUrl = req.file.secure_url;
      } 
      // Local disk storage returns filename
      else if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      // Memory storage - shouldn't reach here for articles, but handle it
      else if (req.file.path) {
        imageUrl = req.file.path;
      }
      console.log('📸 Image uploaded:', imageUrl);
    }

    const article = {
      title,
      description,
      content,
      category,
      featured: isFeatured || false,
      status: status || 'published',
      author_id: req.user.id,
      author_name: req.user.name,
      image: imageUrl,
      thumbnail: imageUrl,
      views: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('📄 Article to save:', {
      title: article.title,
      category: article.category,
      author: article.author_name,
      image: article.image
    });

    // Ensure no undefined values (Firestore rejects undefined)
    if (article.image === undefined || article.image === null) {
      article.image = '/images/default-article.png';
    }
    if (article.thumbnail === undefined || article.thumbnail === null) {
      article.thumbnail = article.image;
    }
    if (article.author_name === undefined || article.author_name === null) {
      article.author_name = req.user.name || 'Unknown';
    }

    // Sanitize - remove any keys with undefined values to avoid Firestore errors
    Object.keys(article).forEach((k) => {
      if (article[k] === undefined) {
        delete article[k];
      }
    });

    // Final safety: ensure image is a non-empty string
    if (!article.image) article.image = '/images/default-article.png';

    console.log('📄 Sanitized article to save:', article);

    // Add to Firestore
    const docRef = await db.collection('articles').add(article);
    console.log('✅ Article created successfully with ID:', docRef.id);

    res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat',
      article: { id: docRef.id, ...article }
    });
  } catch (error) {
    console.error('❌ Error creating article:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error membuat artikel: ' + (error.message || 'Unknown error')
    });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let query = db.collection('articles').where('status', '==', 'published');

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    // Get all matching documents (without orderBy to avoid index requirement)
    const snapshot = await query.get();
    const allArticles = [];

    snapshot.forEach(doc => {
      allArticles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in memory
    allArticles.sort((a, b) => {
      const dateA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
      const dateB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
      return dateB - dateA;
    });

    // Paginate
    const total = allArticles.length;
    const startIndex = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      articles: paginatedArticles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil artikel'
    });
  }
};

// Get single article
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('articles').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    const article = doc.data();

    // Increment views
    await db.collection('articles').doc(id).update({
      views: (article.views || 0) + 1
    });

    res.json({
      success: true,
      article: { id, ...article }
    });
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil artikel'
    });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, category, featured, status } = req.body;
    const userId = req.user.id;

    // Check if article exists
    const doc = await db.collection('articles').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    const article = doc.data();

    // Check authorization (only creator or admin can edit)
    if (article.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk edit artikel ini'
      });
    }

    let isFeatured = featured;
    if (typeof featured === 'string') {
      isFeatured = featured === 'true' || featured === '1';
    }

    let imageUrl;
    if (req.file) {
      if (req.file.secure_url) {
        imageUrl = req.file.secure_url;
      } else if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.file.path) {
        imageUrl = req.file.path;
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(content && { content }),
      ...(category && { category }),
      ...(featured !== undefined && { featured: isFeatured }),
      ...(status && { status }),
      ...(imageUrl && { image: imageUrl, thumbnail: imageUrl }),
      updated_at: new Date()
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('📝 Updating article with data:', updateData);

    await db.collection('articles').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Artikel berhasil diupdate',
      article: { id, ...article, ...updateData }
    });
  } catch (error) {
    console.error('Error updating article:', error.message);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Error mengupdate artikel: ' + (error.message || 'Unknown error')
    });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if article exists
    const doc = await db.collection('articles').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    const article = doc.data();

    // Check authorization (only creator or admin can delete)
    if (article.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk hapus artikel ini'
      });
    }

    // Delete article
    await db.collection('articles').doc(id).delete();

    res.json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: 'Error menghapus artikel'
    });
  }
};

// Get admin articles (all including drafts)
exports.getAdminArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get total count
    const countSnapshot = await db.collection('articles').get();
    const total = countSnapshot.size;

    // Paginate
    const startIndex = (page - 1) * limit;
    const snapshot = await db.collection('articles')
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(startIndex)
      .get();

    const articles = [];
    snapshot.forEach(doc => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting admin articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengambil artikel'
    });
  }
};

// Publish/Draft toggle
exports.toggleArticleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['published', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status harus published atau draft'
      });
    }

    await db.collection('articles').doc(id).update({
      status,
      updated_at: new Date()
    });

    res.json({
      success: true,
      message: `Artikel berhasil di-${status === 'published' ? 'publikasikan' : 'simpan sebagai draft'}`
    });
  } catch (error) {
    console.error('Error toggling article status:', error);
    res.status(500).json({
      success: false,
      message: 'Error mengubah status artikel'
    });
  }
};
