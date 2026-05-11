// Admin password
const ADMIN_PASSWORD = "0000";

// Switch between HOME and PORTFOLIO
function showSection(section) {
  const home = document.getElementById('homeSection');
  const portfolio = document.getElementById('portfolioSection');
  const navLinks = document.querySelectorAll('.nav-link');

  if (section === 'home') {
    home.style.display = '';
    portfolio.style.display = 'none';
  } else if (section === 'portfolio') {
    home.style.display = 'none';
    portfolio.style.display = '';
  }

  navLinks.forEach(btn => btn.classList.remove('active'));
  const activeBtn = Array.from(navLinks).find(
    btn => btn.textContent.trim() === section.toUpperCase()
  );
  if (activeBtn) activeBtn.classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
});

// Toggle admin mode
function toggleAdmin() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  if (isAdmin) {
    sessionStorage.removeItem('isAdmin');
    updateAdminUI();
  } else {
    document.getElementById('adminModal').classList.add('active');
  }
}

// Login admin
function loginAdmin() {
  const password = document.getElementById('adminPassword').value;
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('isAdmin', 'true');
    closeAdminModal();
    updateAdminUI();
    alert('Admin mode enabled');
  } else {
    alert('Incorrect password');
  }
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
  document.getElementById('adminPassword').value = '';
}

function updateAdminUI() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const adminBtn = document.getElementById('adminBtn');
  const adminElements = document.querySelectorAll('.admin-only');
  
  if (isAdmin) {
    adminBtn.classList.add('active');
    adminBtn.textContent = 'Logout';
    adminElements.forEach(el => el.style.display = 'block');
  } else {
    adminBtn.classList.remove('active');
    adminBtn.textContent = 'Admin';
    adminElements.forEach(el => el.style.display = 'none');
  }
}

// Profile functions
function openProfileEditor() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  document.getElementById('editName').value = document.getElementById('profileName').textContent;
  document.getElementById('editTitle').value = document.getElementById('profileTitle').textContent;
  document.getElementById('editLocation').value = document.getElementById('profileLocation').textContent.replace('📍 ', '');
  document.getElementById('editBio').value = document.getElementById('profileBio').textContent;
  document.getElementById('editAvatar').value = document.getElementById('avatarCircle').textContent;
  
  const websiteEl = document.getElementById('profileWebsite');
  if (websiteEl.style.display !== 'none') {
    document.getElementById('editWebsite').value = websiteEl.href;
  }
  
  const interestsEl = document.getElementById('profileInterests');
  if (interestsEl.style.display !== 'none') {
    document.getElementById('editInterests').value = interestsEl.textContent.replace('💡 ', '');
  }
  
  document.getElementById('profileModal').classList.add('active');
}

function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  const title = document.getElementById('editTitle').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  const avatar = document.getElementById('editAvatar').value.trim().toUpperCase();
  const website = document.getElementById('editWebsite').value.trim();
  const interests = document.getElementById('editInterests').value.trim();
  
  if (!name) {
    alert('Please enter a name');
    return;
  }
  
  const profileData = {
    name: name,
    title: title,
    location: location,
    bio: bio,
    avatar: avatar || name.charAt(0).toUpperCase(),
    website: website,
    interests: interests
  };
  
  window.dbSet(window.dbRef(window.db, 'profile'), profileData);
  closeProfileModal();
  alert('Profile updated!');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

// Edit artwork
function openEditItem(id) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const item = window.wishlistData[id];
  if (!item) return;
  
  document.getElementById('editItemId').value = id;
  document.getElementById('editItemName').value = item.name || '';
  document.getElementById('editItemPrice').value = item.price || '';
  document.getElementById('editItemLink').value = item.link || '';
  document.getElementById('editItemImage').value = item.image || '';
  document.getElementById('editItemTag').value = item.tag || '';
  document.getElementById('editItemInfo').value = item.info || '';
  
  const privateCheckbox = document.getElementById('editItemPrivate');
  if (privateCheckbox) {
    privateCheckbox.checked = item.isPrivate || false;
  }
  
  document.getElementById('editItemModal').classList.add('active');
}

function saveItemEdit() {
  const id = document.getElementById('editItemId').value;
  const item = window.wishlistData[id];
  const name = document.getElementById('editItemName').value.trim();
  const newPrice = document.getElementById('editItemPrice').value.trim();
  const link = document.getElementById('editItemLink').value.trim();
  const image = document.getElementById('editItemImage').value.trim();
  const tag = document.getElementById('editItemTag').value;
  const info = document.getElementById('editItemInfo').value.trim();
  
  if (!name) {
    alert('Please enter a title');
    return;
  }
  
  const updateData = {
    name: name,
    price: newPrice,
    link: link,
    image: image,
    tag: tag,
    info: info
  };
  
  const privateCheckbox = document.getElementById('editItemPrivate');
  if (privateCheckbox) {
    updateData.isPrivate = privateCheckbox.checked;
  }
  
  updateData.priceHistory = item.priceHistory || [];
  
  window.dbUpdate(window.dbRef(window.db, 'artwork/' + id), updateData);
  
  closeEditItemModal();
  alert('Artwork updated!');
}

function closeEditItemModal() {
  document.getElementById('editItemModal').classList.remove('active');
}

// Add/Delete artwork
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.classList.toggle('active');
  
  if (!form.classList.contains('active')) {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemLink').value = '';
    document.getElementById('itemImage').value = '';
    document.getElementById('itemTag').value = '';
    document.getElementById('itemInfo').value = '';
    
    const privateCheckbox = document.getElementById('itemPrivate');
    if (privateCheckbox) {
      privateCheckbox.checked = false;
    }
  }
}

function addItem() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const name = document.getElementById('itemName').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const link = document.getElementById('itemLink').value.trim();
  const image = document.getElementById('itemImage').value.trim();
  const tag = document.getElementById('itemTag').value;
  const info = document.getElementById('itemInfo').value.trim();
  
  if (!name) {
    alert('Please enter a title');
    return;
  }
  
  const newItemRef = window.dbPush(window.dbRef(window.db, 'artwork'));
  
  const itemData = {
    name: name,
    price: price,
    link: link,
    image: image,
    tag: tag,
    info: info,
    checked: false,
    comments: {}
  };
  
  const privateCheckbox = document.getElementById('itemPrivate');
  if (privateCheckbox) {
    itemData.isPrivate = privateCheckbox.checked;
  }
  
  itemData.priceHistory = [];
  
  window.dbSet(newItemRef, itemData);
  
  toggleAddForm();
}

function deleteItem(id) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (confirm('Remove this artwork?')) {
    window.dbRemove(window.dbRef(window.db, 'artwork/' + id));
  }
}

// Info modal
function openInfo(id) {
  const item = window.wishlistData[id];
  if (!item) return;
  
  document.getElementById('infoItemName').textContent = item.name;
  
  let infoHTML = item.info ? `<p>${escapeHtml(item.info)}</p>` : '<p>No info available.</p>';
  
  document.getElementById('infoContent').innerHTML = infoHTML;
  document.getElementById('infoModal').classList.add('active');
}

function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
}

// Comments modal
function openComments(id) {
  const item = window.wishlistData[id];
  if (!item) return;
  
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  document.getElementById('commentsItemName').textContent = item.name;
  const commentsContent = document.getElementById('commentsContent');
  commentsContent.innerHTML = '';
  
  if (item.comments && Object.keys(item.comments).length > 0) {
    Object.entries(item.comments).forEach(([commentId, comment]) => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      
      let commentHTML = `<span class="comment-author">${escapeHtml(comment.author)}:</span> <span class="comment-text">${escapeHtml(comment.text)}</span>`;
      
      if (isAdmin) {
        commentHTML += ` <button class="delete-comment-btn" onclick="deleteComment('${id}', '${commentId}')">×</button>`;
      }
      
      commentDiv.innerHTML = commentHTML;
      commentsContent.appendChild(commentDiv);
    });
  } else {
    commentsContent.innerHTML = '<p style="color: #666;">No comments yet.</p>';
  }
  
  document.getElementById('commentsModal').classList.add('active');
}

function closeCommentsModal() {
  document.getElementById('commentsModal').classList.remove('active');
}

// Delete comment
function deleteComment(itemId, commentId) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (confirm('Delete this comment?')) {
    window.dbRemove(window.dbRef(window.db, 'artwork/' + itemId + '/comments/' + commentId));
    setTimeout(() => openComments(itemId), 200);
  }
}

// Add comment modal
function openAddComment(id) {
  document.getElementById('commentItemId').value = id;
  document.getElementById('commentAuthor').value = '';
  document.getElementById('commentText').value = '';
  document.getElementById('addCommentModal').classList.add('active');
}

function closeAddCommentModal() {
  document.getElementById('addCommentModal').classList.remove('active');
}

function submitComment() {
  const itemId = document.getElementById('commentItemId').value;
  const author = document.getElementById('commentAuthor').value.trim();
  const text = document.getElementById('commentText').value.trim();
  
  if (!author || !text) {
    alert('Please enter your name and comment');
    return;
  }
  
  const commentRef = window.dbPush(window.dbRef(window.db, 'artwork/' + itemId + '/comments'));
  window.dbSet(commentRef, {
    author: author,
    text: text,
    timestamp: Date.now()
  });
  
  closeAddCommentModal();
  alert('Comment posted!');
}

// Filters
let currentPriceFilter = 'all';
let currentTagFilter = 'all';

function filterByPrice(filter) {
  currentPriceFilter = filter;
  
  document.querySelectorAll('.filter-group .filter-btn').forEach(btn => {
    if (btn.textContent.includes('All') || btn.textContent.includes('Works')) {
      btn.classList.remove('active');
    }
  });
  event.target.classList.add('active');
  
  applyFilters();
}

function filterByTag(filter) {
  currentTagFilter = filter;
  
  document.querySelectorAll('#tagFilterGroup .filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  applyFilters();
}

function applyFilters() {
  const items = document.querySelectorAll('.wishlist-item');
  
  items.forEach(item => {
    let showItem = true;
    
    if (currentTagFilter !== 'all') {
      const tag = item.dataset.tag;
      if (tag !== currentTagFilter) showItem = false;
    }
    
    if (showItem) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modals on background click
document.addEventListener('click', (e) => {
  const adminModal = document.getElementById('adminModal');
  const profileModal = document.getElementById('profileModal');
  const infoModal = document.getElementById('infoModal');
  const editItemModal = document.getElementById('editItemModal');
  const commentsModal = document.getElementById('commentsModal');
  const addCommentModal = document.getElementById('addCommentModal');
  
  if (e.target === adminModal) closeAdminModal();
  if (e.target === profileModal) closeProfileModal();
  if (e.target === infoModal) closeInfoModal();
  if (e.target === editItemModal) closeEditItemModal();
  if (e.target === commentsModal) closeCommentsModal();
  if (e.target === addCommentModal) closeAddCommentModal();
});
