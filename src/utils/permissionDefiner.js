function setCommentPermissions(userId, posterId, commenterId) {
  if (userId === commenterId) {
    return 'ed';
  }

  if (userId === posterId) {
    return 'd';
  }

  return '';
}

function setPostPermissions(userId, posterId) {
  if (userId === posterId) {
    return 'ed';
  }

  return '';
}

export { setCommentPermissions, setPostPermissions };
